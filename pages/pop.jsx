import React, { useState, useRef, Fragment } from 'react'
import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client'
import { UncontrolledPopover, PopoverBody, PopoverHeader } from 'reactstrap'
import Button from 'react-bootstrap/Button'
import Overlay from 'react-bootstrap/Overlay'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import rrulePlugin from '@fullcalendar/rrule'
import interactionPlugin from '@fullcalendar/interaction'
import 'bootstrap/dist/css/bootstrap.min.css'

import bootstrap5Plugin from '@fullcalendar/bootstrap5'

function Example () {
  const ref = useRef(null)
  const [eventTitle, setEventTitle] = useState('')
  const [popoverTarget, setPopoverTarget] = useState(null)

  const [event, setEvent] = useState(null)
  const [show, setShow] = useState(false)
  const [target, setTarget] = useState(null)
  const [offset, setOffset] = useState([])
  const handleEventClick = (info) => {
    setEventTitle(info.event.title)
    setShow(true)
    setPopoverTarget(info.el)
  }
  const closePopover = () => {
    setPopoverTarget(null)
  }
  // const target = useRef(null)
  const ShowPopover = () => {
    console.log('vao daay ne ua alo')
    if (!show) {
      return null
    }
    console.log('vao daay ne')
    return (
      <Overlay popperConfig={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: offset,
            }
          }
        ]
      }} target={target} show={show} placement="left" rootClose onHide={() => {
        setShow(false)
      }}>
        <Popover className={'custom-popover'}>
          <Popover.Header as="h3">Popover right</Popover.Header>
          <Popover.Body>
            <div>And here's some <strong>amazing</strong> content. It's very engaging. right?</div>
            <div>And here's some <strong>amazing</strong> content. It's very engaging. right?</div>
            <div>And here's some <strong>amazing</strong> content. It's very engaging. right?</div>
            <div>And here's some <strong>amazing</strong> content. It's very engaging. right?</div>
            <div>And here's some <strong>amazing</strong> content. It's very engaging. right?</div>
          </Popover.Body>
        </Popover>
      </Overlay>
    )
  }
  const Popup = () => {

    console.log('heeeeaa', target)
    if (!target) {
      return null
    }
    console.log('heeee')
    return (
      <UncontrolledPopover show={`${target ? 'true' : 'false'}`} placement="right" target={target} rootClose
                           onHide={() => setTarget(null)}>
        <PopoverHeader> hesola</PopoverHeader>
        <PopoverBody>
          áhdvashgdb
          <div>hesolo</div>
          <button>hehe</button>
        </PopoverBody>
      </UncontrolledPopover>
    )
  }
  return (
    <>
      <Button onClick={() => {
        const a = ref.current.getApi()
        const b = a.getEventById('aaaa')
        b.remove()
        a.addEvent({
          id: 'aaaa',
          title: 'event 4',
          start: '2023-06-19T17:30:00+07',
          end: '2023-06-19T20:30:00+07',
          extendedProps: { createdBy: 'Thuan', summary: 'giôi thieu ne' },
          duration: '05:00',
          allDay: false
        })
      }}>Hello</Button>
      <div>
        <div
          style={{ position: 'relative' }}></div>
      </div>
      <FullCalendar
        plugins={[rrulePlugin, bootstrap5Plugin, dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        // themeSystem={'bootstrap5'}
        initialView={'timeGridWeek'}
        headerToolbar={{
          start: 'today prev,next',
          center: 'title',
          end: 'timeGridDay,timeGridWeek,dayGridMonth,listMonth'
        }}
        ref={ref}
        events={[
          {
            id: 'adasbhdgashbdhasd',
            title: 'event 1',
            start: '2023-06-19T17:00:00Z',
            // end: '2023-06-04T06:00:00+07',
            // color: 'red',
            createdBy: 'binh',
            summary: 'giôi thieu ne',
            // className: 'fc-rejected-event'
            // allDay: true
          }, {
            id: 'aaaa',
            title: 'event 4',
            start: '2023-06-19T15:30:00+07',
            end: '2023-06-19T19:30:00+07',
            rrule: {
              'freq': 'MONTHLY',
              'dtstart': '2023-06-27T02:00:00.000Z',
              'until': '2023-09-26T17:00:00.000Z'
            },
            duration: '05:00',
            allDay: false
          },
          {
            id: 'cnbxasjsad',
            title: 'event dac biet',
            // start: '2023-06-10',
            // end: '2023-06-10T09:30:00+07',
            // allDay: true,
            extendedPropss: {
              rrule: {
                freq: 'WEEKLY',
                dtstart: '2023-06-10T05:00:00Z',
                // Loại bỏ ngày '2023-05-05'
                until: '2023-07-06T17:00:00Z'
              }
            },
            rrule: {
              freq: 'DAILY',
              dtstart: '2023-06-10T06:00:00Z',
              // byweekday: ['MO', 'TU', 'WE', 'TH', 'FR', 'SA']
              // Loại bỏ ngày '2023-05-05'
              until: '2023-07-07'
            },
            duration: '04:00',
            exdate: ['20230704T060000Z']
          }, {
            '_id': '6492b2bf618d183aa051860e',
            'userId': '6480e1ba965ca4f7d5fa60af',
            'title': 'ua alo',
            'description': 'heee',
            'location': 'zzzz',
            'allDay': 1,
            'start': '2023-06-19T17:00:00Z',
            // "end": "2023-06-20T17:00:00Z",
            'rrule': {
              'freq': 'WEEKLY',
              'dtstart': '2023-06-20'
            }
            // "duration": "24:00",
          }
        ]}
        editable={'true'}
        height={'100vh'}
        selectable={'true'}
        eventClick={(info) => {
          // return (<Popup target={info.el} />)
          console.log(info.jsEvent)
          setShow(!show)
          if (info.view.type === 'listMonth' || info.view.type === 'timeGridDay' || info.event?.extendedProps?.rrule) {
            console.log('vao day')
            // setOffset([`${info.jsEvent.screenX}px`, `${info.jsEvent.screenY}px`])
            setTarget(null)
            // setOffset([info.jsEvent.screenX,info.jsEvent.screenY /2 ])
            setOffset([info.jsEvent.screenY / 2, -info.jsEvent.screenX])
          } else {
            setOffset([])
            setTarget(info.el)
          }
          // ReactDOM.render((<ShowPopover target={info.el} />), info.el)
        }}
      />
      <div style={{ zIndex: 9999 }}><ShowPopover/></div>
    </>
  )
}

export default Example
