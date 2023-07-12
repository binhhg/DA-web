import React, { Fragment, useEffect, useState, useRef, forwardRef } from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import rrulePlugin from '@fullcalendar/rrule'
import interactionPlugin from '@fullcalendar/interaction'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import eventEmitter from '../utils/eventEmitter'
import { CalendarApi } from '../apis/calendar'
import Overlay from 'react-bootstrap/Overlay'
import Popover from 'react-bootstrap/Popover'
import { Button, Form, Modal } from 'react-bootstrap'

const moment = require('moment')
const Calendar = forwardRef((props, ref) => {
  const [isClient, setIsClient] = useState(false)
  const [events, setEvents] = useState([])
  const { showModal, colorConfig } = props

  const [show, setShow] = useState(false)
  const [target, setTarget] = useState(null)
  const [offset, setOffset] = useState([])
  const [data, setData] = useState({})
  const [showDelete, setShowDelete] = useState(false)
  const [isRecurring, setIsRecurring] = useState(false)
  const [checkDelete, setCheckDelete] = useState(1)
  const color = {
    default: '#73BBAB'
  }

  useEffect(() => {
    if (colorConfig && Object.keys(colorConfig).length > 0) {
      color.default = colorConfig.defaultColor

      const aa = colorConfig.accountColor
      for (const va of aa) {
        color[`${va.accountId}`] = va.color
      }
      console.log(color)
      if (ref.current) {
        const zz = ref.current.getApi()
        zz.render()
        return () => {
          zz.destroy()
        }
      }
    }
  }, [colorConfig])
  const getData = async () => {
    try {
      const zz = await CalendarApi.getEvent()
      for (const va of zz) {
        va.id = va._id
        va.extendedProps = { ...va }
      }
      setEvents(zz)
    } catch (e) {
      setEvents([])
    }
  }
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true)
    }

    getData()
  }, [])
  useEffect(() => {
    eventEmitter.on('addEvent', event => {
      const add = ref.current.getApi()
      for (const va of event) {
        va.extendedProps = { ...va }
        va.id = va._id
        // add.addEvent(va)
      }
      add.addEventSource(event)
    })
    eventEmitter.on('updateEvent', event => {
      const up = ref.current.getApi()
      console.log('evv', event)
      for (const va of event) {
        va.extendedProps = { ...va }
        va.id = va._id
        if (va.up) {
          console.log('day neeee')
          const a = up.getEventById(va.id)
          a.remove()
        }
      }
      console.log('ua lo a',event)
      up.addEventSource(event)
    })
  }, [])
  const freqText = {
    DAILY: 'ngày',
    WEEKLY: 'tuần',
    MONTHLY: 'tháng'
  }
  const dayConfig = {
    MO: 'thứ 2',
    TU: 'thứ 3',
    WE: 'thứ 4',
    TH: 'thứ 5',
    FR: 'thứ 6',
    SA: 'thứ 7',
    SU: 'chủ nhật'
  }
  const rruleToText = (start, end, rrule) => {
    const st = moment(start)
    const ed = moment(end)
    const edTime = ed.format('YYYY-MM-DD HH:mm')
    const stTime = st.format('YYYY-MM-DD HH:mm')
    let tt = ''
    if (rrule) {
      if (!rrule.interval) {
        tt = 'Hàng ' + freqText[rrule.freq]
      } else {
        tt = `${rrule.interval} ${freqText[rrule.freq]} 1 lần`
      }
      if (rrule.byweekday) {
        let thu = ''
        for (const va of rrule.byweekday) {
          thu = thu + ` ${dayConfig[va]},`
        }
        tt = `${tt} vào ngày${thu.slice(0, -1)}`
        if (rrule.bysetpos) {
          tt = `${tt} lần ${rrule.bysetpos} của ${freqText[rrule.freq]} `
        }
      } else if (rrule.freq === 'MONTHLY') {
        tt = tt + ` vào ngày ${st.date()}`
      }
      if (rrule.until) {
        const ut = moment(rrule.until).format('YYYY-MM-DD HH:mm')
        tt = tt + ` cho tới ${ut}`
      }
      if (rrule.count) {
        tt = tt + ` lặp lại ${rrule.count}`
      }
    }
    return (
      <>
        <div>{stTime + ' - ' + edTime}</div>
        {rrule && <div>{tt}</div>}
      </>
    )
  }
  const ShowPopover = () => {
    if (!show) {
      return null
    }
    return (
      <Overlay popperConfig={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: offset
            }
          }
        ]
      }} target={target} show={show} placement="left" rootClose onHide={() => {
        if (!showDelete) {
          setData({})
          setShow(false)
        }
      }}>
        <Popover className={'custom-popover min-w-[400px] shadow-lg !border-none'}>
          <Popover.Body>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              width: '100%',
            }}>
              {(!data?.extendedProps?.booking || data?.extendedProps?.booking?.organizer?.self) &&
              <div className={'cursor-pointer hover:text-red-500'} onClick={handelClickShowEdit}><i
                className="bi bi-pencil-fill text-lg"></i></div>}
              <div className={'cursor-pointer mx-3 hover:text-red-500'} onClick={() => {
                if (data?.extendedProps?.rrule) {
                  setIsRecurring(true)
                  setCheckDelete(1)
                } else {
                  setIsRecurring(false)
                }
                setShowDelete(!showDelete)
              }}><i className="bi bi-trash3-fill text-lg"></i></div>
              <div className={'cursor-pointer text-lg hover:text-red-500'} onClick={() => setShow(!show)}>
                <i
                  className="bi bi-x-circle"></i></div>
            </div>
            <h3 className={'ml-9'}>{data?.title}</h3>
            <div
              className={'mb-2 ml-9 text-gray-500'}>{rruleToText(data.start, data.end, data?.extendedProps?.rrule)}</div>
            {data?.extendedProps?.location &&
            <div><i className="bi bi-geo-alt text-lg mr-3"></i> heeelo</div>}
            {data?.extendedProps?.description &&
            <div><i className="bi bi-text-paragraph text-lg mr-3"></i> aaaaa</div>}
            {data?.extendedProps?.booking?.hangoutLink && (
              <>
                <div className={'flex gap-3 items-center pt-2'}>
                  <img src="./meet.svg" alt="" className={'!w-[20px] !h-[20px]'}/>
                  <Button
                    onClick={() => window.open(data.extendedProps.booking.hangoutLink, '_blank')}>Tham
                    gia bằng
                    Google Meet </Button>
                </div>
                <div
                  className={'pb-2 ml-9 text-gray-400'}>{(data.extendedProps.booking.hangoutLink).replace('https://', '')}</div>
              </>
            )}
            {(data?.extendedProps?.booking?.attendees && (data.extendedProps.booking.attendees).length > 0) &&
            <div><i
              className="bi bi-people text-lg mr-3"></i> {(data.extendedProps.booking.attendees).length + ' khách'}
              <div>
                {(data.extendedProps.booking.attendees).map(value => {
                  return (
                    <div><i className={'bi bi-person text-lg ml-7'}></i> {value.email}</div>
                  )
                })}
              </div>
            </div>}
            {data?.extendedProps?.booking &&
            <div><i
              className="bi bi-calendar2-event text-lg mr-3"></i> {data.extendedProps.booking.organizer.email}
            </div>}
            <div className={'mb-3'}></div>
          </Popover.Body>
        </Popover>
      </Overlay>
    )
  }
  const handleOkModalDelete = async () => {
    console.log(checkDelete)
    try {
      if (!isRecurring) {
        await CalendarApi.deleteEvent(data.id, {
          type: 1,
          accountId: data?.extendedProps?.booking?.accountId,
          bookingId: data?.extendedProps?.booking?._id,
          calendarId: data?.extendedProps?.booking?.calendarId
        })
        const del = ref.current.getApi()
        const ev = del.getEventById(data.id)
        // await CalendarApi.deleteEvent(data.id, { type: 1 })
        ev.remove()
      } else {
        let st = data.start
        let en = data.end
        if (data.allDay) {
          st = moment(st).format('YYYY-MM-DD')
          en = moment(en).format('YYYY-MM-DD')
        }
        const { data: zz } = await CalendarApi.deleteEvent(data.id, {
          start: st,
          end: en,
          type: 2,
          delete: checkDelete,
          accountId: data?.extendedProps?.booking?.accountId,
          calendarId: data?.extendedProps?.booking?.calendarId,
          bookingId: data?.extendedProps?.booking?._id,
          rrule: data?.extendedProps?.rrule
        })
        if (zz && zz.length) {
          console.log(zz)
          const ca = ref.current.getApi()
          for (const va of zz) {
            const ev = ca.getEventById(va.id)
            if (ev) {
              if (va.type === 'delete') {
                ev.remove()
              } else {
                ev.remove()
                const add = va?.data
                add.extendedProps = { ...add }
                add.id = add._id
                ca.addEvent(add)
              }
            }
          }
        }
      }
      setShowDelete(!showDelete)
      setShow(!show)
    } catch (e) {
      console.log(e)
      setShowDelete(!showDelete)
      setShow(!show)
    }
  }
  const ShowDelete = (props) => {
    if (!showDelete) {
      return null
    }

    console.log('dddd', data)
    return (
      <Modal
        {...props}
        size="sm"
        className={'c-modal'}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          {!isRecurring ? <div>Bạn có chắc chắn muốn xóa</div> : (
            <>

              <Form>
                <Form.Label>Xóa sự kiện định kỳ</Form.Label>
                <div onChange={(event) => {
                  setCheckDelete(+event.target.defaultValue)
                }}>
                  <Form.Check type="radio"
                              label={'Chỉ sự kiện này'}
                              value={1}
                              id={'50'}
                              name={'group1'}
                              checked={checkDelete === 1}
                    // onChange={() => {
                    //   console.log('vao day 1')
                    //   setCheckEdit(1)}}
                              className={'mb-3'}
                  />
                  <Form.Check type="radio"
                              label={'Sự kiện này và các sự kiện về sau'}
                              value={2}
                              id={'51'}
                              name={'group1'}
                              checked={checkDelete === 2}
                    // onChange={(ev) => {
                    //   console.log('vao day 2')
                    //   setCheckEdit(2)}}
                              className={'mb-3'}
                  />
                  <Form.Check type="radio"
                              label={'Tất cả sự kiện'}
                              value={3}
                              id={'52'}
                              name={'group1'}
                              checked={checkDelete === 3}
                    // onChange={() => setCheckEdit(3)}
                              className={'mb-3'}
                  />
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant={'light'} onClick={props.onHide}>Hủy</Button>
          <Button variant={'light'} onClick={handleOkModalDelete}>Ok</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  function handelClick (info) {
    eventEmitter.emit('showModalNew', info)
    showModal()
  }

  function handelClickShowEdit () {
    eventEmitter.emit('showModalEdit', data)
    setShow(!show)
    showModal()
  }

  function eventClassNames (eventInfo) {
    const { event } = eventInfo
    if (event.title === 'event 4') return 'fc-rejected-event special-event'
  }

  return (
    <Fragment>
      {isClient && <FullCalendar
        plugins={[rrulePlugin, bootstrap5Plugin, dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        themeSystem={'bootstrap5'}
        initialView={'timeGridWeek'}
        headerToolbar={{
          start: 'today prev,next',
          center: 'title',
          end: 'timeGridDay,timeGridWeek,dayGridMonth,listMonth'
        }}
        customButtons={
          {
            today: {
              text: 'Hôm nay',
              bootstrapFontAwesome: false,
              themeIcon: 'red',
              click: () => {
                ref.current.getApi().today()
                eventEmitter.emit('clickToday', {})
              }
            },
            timeGridDay: {
              text: 'Ngày',
              click: () => {
                ref.current.getApi().changeView('timeGridDay')
              }
            },
            timeGridWeek: {
              text: 'Tuần',
              click: () => {
                ref.current.getApi().changeView('timeGridWeek')
              }
            },
            dayGridMonth: {
              text: 'Tháng',
              click: () => {
                ref.current.getApi().changeView('dayGridMonth')
              }
            }
          }
        }
        ref={ref}
        events={events}
        // events={[
        //   {
        //     id: 'adasbhdgashbdhasd',
        //     title: 'event 1',
        //     start: '2023-06-03',
        //     // end: '2023-06-04T06:00:00+07',
        //     // color: 'red',
        //     createdBy: 'binh',
        //     summary: 'giôi thieu ne'
        //     // className: 'fc-rejected-event'
        //     // allDay: true
        //   },
        //   // {
        //   //   id: 'asdasdsa',
        //   //   title: 'event 3',
        //   //   start: '2023-06-05T05:30:00',
        //   //   extendedProps: { createdBy: 'Thuan', summary: 'giôi thieu ne' },
        //   //   duration: '05:00',
        //   //   allDay: false
        //   // },
        //   // {
        //   //   id: 'asdasdsaaaaaa',
        //   //   title: 'event 3 1',
        //   //   start: '2023-06-05T05:30:00',
        //   //   extendedProps: { createdBy: 'Thuan', summary: 'giôi thieu ne' },
        //   //   duration: '05:00',
        //   //   allDay: 1
        //   // },
        //   {
        //     id: 'aaaa',
        //     title: 'event 4',
        //     start: '2023-05-28T06:30:00+07',
        //     end: '2023-05-28T09:30:00+07',
        //     extendedProps: { createdBy: 'Thuan', summary: 'giôi thieu ne' },
        //     duration: '05:00',
        //     allDay: false
        //   },
        //   {
        //     id: 'cnbxasjsad',
        //     title: 'event dac biet',
        //     // start: '2023-06-10',
        //     // end: '2023-06-10T09:30:00+07',
        //     // allDay: true,
        //     rrule: {
        //       freq: 'WEEKLY',
        //       dtstart: '2023-06-10T00:30:00Z',
        //       byweekday: ['MO', 'TU', 'WE', 'TH', 'FR']
        //       // Loại bỏ ngày '2023-05-05'
        //     },
        //     duration: '04:00'
        //   },
        //   {
        //     title: 'Sự kiện hàng ngàyaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        //     // Hiển thị từ thứ 2 đến thứ 6
        //     // daysOfWeek: [1, 2, 3, 4, 5],
        //     // startTime: '2023-05-28T19:00:00',
        //     extendedProps: {
        //       rrule: {
        //         freq: 'MONTHLY',
        //         dtstart: '2023-05-29',
        //         byweekday: ['MO'],
        //         until: '2023-08-28', // Đặt phút là 0 và 35
        //         bysetpos: 1
        //         // Loại bỏ ngày '2023-05-05'
        //       },
        //       // allDay: true,
        //       duration: '24:00',
        //       exdate: ['2023-06-11']
        //     },
        //     rrule: {
        //       freq: 'MONTHLY',
        //       dtstart: '2023-05-29',
        //       byweekday: ['MO'],
        //       until: '2023-08-28', // Đặt phút là 0 và 35
        //       bysetpos: 1
        //       // Loại bỏ ngày '2023-05-05'
        //     },
        //     // allDay: true,
        //     duration: '24:00',
        //     exdate: ['2023-06-11']
        //
        //   }
        // ]}
        editable={'true'}
        height={'100%'}
        selectable={'true'}
        eventClassNames={eventClassNames}
        // eventContent={renderEventContent}
        // select={daysi}
        select={(info) => {
          if (show) {
            setShow(!show)
            setData({})
          } else {
            handelClick(info)
          }
        }}
        eventClick={(info) => {
          // return (<Popup target={info.el} />)
          console.log(info)
          setShow(!show)
          setData(info.event)
          // setTarget(info.el)
          if (info.view.type === 'listMonth' || info.view.type === 'timeGridDay' || info.event?.extendedProps?.rrule) {
            console.log('vao day')
            // setOffset([`${info.jsEvent.screenX}px`, `${info.jsEvent.screenY}px`])
            setTarget(null)
            if (info.event.allDay) {
              setOffset([-info.jsEvent.screenY, -info.jsEvent.screenX])
            } else {
              setOffset([info.jsEvent.screenY / 2, -info.jsEvent.screenX])
            }
          } else {
            setOffset([])
            setTarget(info.el)
          }
          // ReactDOM.render((<ShowPopover target={info.el} />), info.el)
        }}
        eventDidMount={(info) => {
          const { extendedProps: cc } = info.event
          const colorInfo = (colorConfig?.accountColor || []).find(item => item.accountId === cc?.booking?.accountId)
          const ll = cc?.booking?.accountId
          const co = color[`${ll}`]
          const vcd = co ? co : (colorInfo?.color || colorConfig?.defaultColor || color['default'])
          if (info.view.type !== 'listMonth' && info.view.type !== 'dayGridMonth') {
            info.el.style.backgroundColor = vcd
            info.el.style.border = 'none'
          } else {
            const dotEl = info.el.getElementsByClassName('fc-list-event-dot')[0]
            if (dotEl) {
              dotEl.style.borderColor = vcd
            }
            const dotEl1 = info.el.getElementsByClassName('fc-daygrid-event-dot')[0]
            if (dotEl1) {
              dotEl1.style.borderColor = vcd
            }
          }
        }
        }
      />
      }
      <div><ShowPopover/></div>
      <ShowDelete
        show={showDelete}
        onHide={() => setShowDelete(false)}/>
    </Fragment>
  )
})

export default Calendar
