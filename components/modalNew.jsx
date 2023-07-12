import React, { useEffect, useState } from 'react'
import {
  Modal,
  Button,
  Form,
  Row,
  ListGroup,
  InputGroup,
  DropdownButton,
  Dropdown,
  ToggleButtonGroup,
  ToggleButton
} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import eventEmitter from '../utils/eventEmitter'
import DatePicker from 'react-datepicker'
import makeAnimated from 'react-select/animated'
import Select from 'react-select'
import 'react-datepicker/dist/react-datepicker.css'
import { UserApi } from '../apis/user'
import { CalendarApi } from '../apis/calendar'

const moment = require('moment')

function validateGmail (Gmail) {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return pattern.test(Gmail)
}

const thuConfig = {
  0: {
    id: 0,
    label: 'chủ nhật',
    slug: 'chủ nhật',
    key: 'SU',
    symbol: 'CN'
  },
  1: {
    id: 1,
    label: 'thứ hai',
    slug: 'thứ 2',
    key: 'MO',
    symbol: 'T2'
  },
  2: {
    id: 2,
    label: 'thứ ba',
    slug: 'thứ 3',
    key: 'TU',
    symbol: 'T3'
  },
  3: {
    id: 3,
    label: 'thứ tư',
    slug: 'thứ 4',
    key: 'WE',
    symbol: 'T4'
  },
  4: {
    id: 4,
    label: 'thứ năm',
    slug: 'thứ 5',
    key: 'TH',
    symbol: 'T5'
  },
  5: {
    id: 5,
    label: 'thứ sáu',
    slug: 'thứ 6',
    key: 'FI',
    symbol: 'T6'
  },
  6: {
    id: 6,
    label: 'thứ bảy',
    slug: 'thứ 7',
    key: 'SA',
    symbol: 'T7'
  }
}
export default function ModalNew ({ show, handle }) {
  const animatedComponents = makeAnimated()
  const option = [
    { value: 1, label: 'Không lặp lại' },
    { value: 2, label: 'Hàng ngày', rrule: { freq: 'DAILY' } },
    { value: 3, label: 'tùy chỉnh... ' }
  ]
  const [create, setCreate] = useState(true)
  const [data, setData] = useState({})
  const [optionSelect, setOptionSelect] = useState(option)
  const [title, setTitle] = useState('')
  const [start, setStart] = useState(new Date())
  const [end, setEnd] = useState(new Date())
  const [location, setLocation] = useState('')
  const [allDay, setAllDay] = useState(false)
  const [inputText, setInputText] = useState('')
  const [attendees, setAttendees] = useState([])
  const [accounts, setAccounts] = useState([])
  const [description, setDescription] = useState('')
  const [mailOption, setMailOption] = useState([])
  const [optionSelected, setOptionSelected] = useState(0)
  const [showModal2, setShowModal2] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [disableAccount, setDisableAccount] = useState(false)
  // modal 2
  const timeTypeConfig = {
    11: {
      id: 11,
      value: 'Ngày',
      slug: 'ngày',
      freq: 'DAILY'
    },
    12: {
      id: 12,
      value: 'Tuần',
      slug: 'tuần',
      freq: 'WEEKLY'
    },
    13: {
      id: 13,
      value: 'Tháng',
      slug: 'tháng',
      freq: 'MONTHLY'
    }
  }
  const [repeatTimes, setRepeatTimes] = useState(1)
  const [repeatType, setRepeatType] = useState(12)
  const [repeatDay, setRepeatDay] = useState([])
  const [endCheck, setEndCheck] = useState(1)
  const [endTime, setEndTime] = useState(new Date())
  const [endCount, setEndCount] = useState(10)
  const [repeatMonth, setRepeatMonth] = useState([])
  const [repeatMonthSelected, setRepeatMonthSelected] = useState(null)

  //modal edit

  const [showEdit, setShowEdit] = useState(false)
  const [checkEdit, setCheckEdit] = useState(1)
  const [isEdit, setIsEdit] = useState(false)
  const [initOptionSelected, setInitOptionSelected] = useState(0)
  const handleInputChange = (e) => {
    setInputText(e.target.value)
  }
  const changeTitle = (e) => {
    if (!create) {
      setIsEdit(true)
    }
    setTitle(e.target.value)
  }
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (inputText) {
        setErrMsg('')
      } else {
        setErrMsg('Loi')
      }

      e.preventDefault()
      addToArr()
    }
  }

  const addToArr = () => {
    if (validateGmail(inputText) && !attendees.includes(inputText) && inputText !== accounts[0]?.label) {
      if (!create) {
        setIsEdit(true)
      }
      setAttendees((prevArray) => [...prevArray, inputText])
      setInputText('')
    }
  }

  const removeItem = (index) => {
    console.log('xoa')
    const newArray = [...attendees]
    newArray.splice(index, 1)
    setAttendees(newArray)
    if (!create) {
      setIsEdit(true)
    }
  }
  const handleCloseModal = () => {
    if (!showModal2) {
      console.log('edit')
      handle(false)
      setInputText('')
      setOptionSelected(0)
      setIsEdit(false)
    }
  }
  const handleSave = async () => {
    if (create) {
      try {
        let st = start
        let en = end
        if (allDay) {
          st = moment(st).format('YYYY-MM-DD')
          en = moment(en).format('YYYY-MM-DD')
        }
        const body = {
          allDay,
          start: st,
          end: en,
          title,
          location,
          description,
          accounts,
          attendees
        }
        if (optionSelect[optionSelected]?.rrule) {
          body.rrule = optionSelect[optionSelected].rrule
          body.rrule.dtstart = st
        }
        handle(false)
        const { data: zz } = await CalendarApi.addCalendar(body)
        console.log('zzzzz ', zz)
        eventEmitter.emit('addEvent', zz)
      } catch (e) {
        console.log(e)
        handle(false)
      }
    } else {
      if (!isEdit) {
        handleCloseModal()
      } else {
        setShowEdit(true)
      }
    }
  }
  const handleChangeOption = (op) => {
    const value = op.value
    const index = optionSelect.findIndex(item => item.value === value)
    if (value === 3) {
      const a = moment(start).set({ hour: 0, minute: 0, second: 0 }).add(3, 'months')
      const s = new Date(start)

      const opts = [
        {
          value: 20,
          label: `Hàng tháng vào ngày ${(s.getDate())}`,
          slug: `vào ngày ${(s.getDate())}`,
          rrule: {}
        },
        {
          value: 21,
          label: `Hàng tháng vào ${thuConfig[s.getDay()].label} lần ${appearance(s).text}`,
          slug: `vào ${thuConfig[s.getDay()].label} lần ${appearance(s).text}`,
          rrule: {
            byweekday: [thuConfig[s.getDay()].key],
            bysetpos: appearance(s).number
          }
        }
      ]
      setRepeatMonth(opts)
      setRepeatMonthSelected(opts[0])
      setEndTime(a.toDate())
      setRepeatDay([(new Date(start)).getDay()])
      setEndCheck(1)
      setEndCount(10)
      setShowModal2(true)
    } else {
      if (!create) {
        setIsEdit(true)
      }
    }
    setOptionSelected(index)
  }
  const handleSetAllDay = () => {
    if (!allDay) {
      const modifiedDateStart = moment(start).set({ hour: 0, minute: 0, second: 0 })
      setStart(modifiedDateStart.toDate())
      setEnd(modifiedDateStart.add(1, 'day').toDate())
    }
    if (!create) {
      setIsEdit(true)
    }
    setAllDay(!allDay)
  }
  const handleChangeMail = (option) => {
    if (!option) {
      setAccounts([])
    } else {
      if (Array.isArray(option)) {
        setAccounts(option)
      } else {
        setAccounts([option])
      }
    }

    if (option && option.length !== 1) {
      setAttendees([])
    }
    if (!create) {
      setIsEdit(true)
    }
  }
  useEffect(() => {
    if (start.getTime() >= end.getTime()) {
      if (allDay) {
        setEnd(new Date(start.getTime() + 3600 * 1000 * 24)) // theo ngay
      } else {
        setEnd(new Date(start.getTime() + 3600 * 1000))
      }
    }
  }, [start])
  useEffect(() => {
    if (end.getTime() <= start.getTime()) {
      if (allDay) {
        setStart(new Date(end.getTime() - 3600 * 1000 * 24))
      } else {
        setStart(new Date(end.getTime() - 3600 * 1000))
      }
    }
  }, [end])
  const getAccount = async () => {
    try {
      const data = await UserApi.getAccount()
      for (const va of data) {
        va.value = va._id
        va.label = va.email
      }
      setMailOption(data)
    } catch (e) {
      setMailOption([])
    }
  }
  useEffect(() => {
    getAccount().then()
  }, [])
  const appearances = {
    1: 'đầu tiên',
    2: 'thứ hai',
    3: 'thứ ba',
    4: 'thứ tư',
    5: 'thứ năm'
  }
  const appearance = (date) => {
    const dayOfMonth = date.getDate()
    const ordinalDayOfWeek = Math.ceil(dayOfMonth / 7)
    return { number: ordinalDayOfWeek, text: appearances[ordinalDayOfWeek] }
  }
  const freqText = {
    DAILY: 'ngày',
    WEEKLY: 'tuần',
    MONTHLY: 'tháng'
  }
  const dayConfig = {
    MO: 'thứ hai',
    TU: 'thứ ba',
    WE: 'thứ tư',
    TH: 'thứ năm',
    FR: 'thứ sáu',
    SA: 'thứ bảy',
    SU: 'chủ nhật'
  }
  const handleSetStart = (date) => {
    const st1 = moment(date)
    const st2 = moment(start)
    if (!st2.isSame(st1, 'day')) {
      console.log('vao day oke ')
      const cc = date.getDay()
      const app = appearance(date)
      const thu = thuConfig[cc]
      const ok = optionSelect.map((value, index) => {
        if (index === 2) {
          return {
            value: 4,
            label: 'Hàng tuần vào ngày ' + thu.label,
            rrule: {
              freq: 'WEEKLY',
              dtstart: date,
              byweekday: [thu.key]
            }
          }
        } else if (index === 3) {
          return {
            value: 5,
            label: 'Hàng tháng vào ngày ' + thu.label + ' lần ' + app.text + ' của tháng',
            rrule: {
              freq: 'MONTHLY',
              dtstart: date,
              byweekday: [thu.key],
              bysetpos: +app.number
            }
          }
        } else {
          return value
        }
      })
      setOptionSelect(ok)
    }
    setIsEdit(true)
    setStart(date)
  }
  useEffect(() => {
    eventEmitter.on('showModalNew', result => {
      setCreate(true)
      const cc = result.start.getDay()
      const app = appearance(result.start)
      const thu = thuConfig[cc]
      const op = [...option]
      const cuoi = op.pop()
      const op2 = [
        {
          value: 4,
          label: 'Hàng tuần vào ngày ' + thu.label,
          rrule: {
            freq: 'WEEKLY',
            dtstart: result.startStr,
            byweekday: [thu.key]
          }
        },
        {
          value: 5,
          label: 'Hàng tháng vào ngày ' + thu.label + ' lần ' + app.text + ' của tháng',
          rrule: {
            freq: 'MONTHLY',
            dtstart: result.startStr,
            byweekday: [thu.key],
            bysetpos: +app.number
          }
        },
        {
          value: 6,
          label: 'Các ngày trong tuần(thứ hai đến thứ 6)',
          rrule: {
            freq: 'WEEKLY',
            dtstart: result.startStr,
            byweekday: ['MO', 'TU', 'WE', 'TH', 'FR']
          }
        }
      ]
      setAccounts([])
      setDisableAccount(false)
      setAttendees([])
      setTitle('')
      setLocation('')
      setDescription('')
      setData(result)
      setStart(result.start)
      setEnd(result.end)
      setAllDay(result.allDay)
      setOptionSelect([...op, ...op2, cuoi])
    })
    eventEmitter.on('showModalEdit', result => {
      console.log('vao day roi,', result)
      setCreate(false)
      const cc = result.start.getDay()
      const app = appearance(result.start)
      const thu = thuConfig[cc]
      const op = [...option]
      const cuoi = op.pop()
      const op2 = [
        {
          value: 4,
          label: 'Hàng tuần vào ngày ' + thu.label,
          rrule: {
            freq: 'WEEKLY',
            dtstart: result.startStr,
            byweekday: [thu.key]
          }
        },
        {
          value: 5,
          label: 'Hàng tháng vào ngày ' + thu.label + ' lần ' + app.text + ' của tháng',
          rrule: {
            freq: 'MONTHLY',
            dtstart: result.startStr,
            byweekday: [thu.key],
            bysetpos: +app.number
          }
        },
        {
          value: 6,
          label: 'Các ngày trong tuần(thứ hai đến thứ sáu)',
          rrule: {
            freq: 'WEEKLY',
            dtstart: result.startStr,
            byweekday: ['MO', 'TU', 'WE', 'TH', 'FR']
          }
        }
      ]
      if (result?.extendedProps?.rrule) {
        const { rrule } = result?.extendedProps
        let label = ''
        if (!rrule.interval) {
          label = 'Hàng ' + freqText[rrule.freq]
        } else {
          label = `${rrule.interval} ${freqText[rrule.freq]} 1 lần`
        }
        if (rrule.byweekday) {
          let thu = ''
          for (const va of rrule.byweekday) {
            thu = thu + ` ${dayConfig[va]},`
          }
          label = `${label} vào ngày${thu.slice(0, -1)}`
          if (rrule.bysetpos) {
            label = `${label} lần ${appearances[rrule.bysetpos]} của ${freqText[rrule.freq]} `
          } else if (rrule.freq === 'WEEKLY' && rrule.byweekday.join(',') === 'MO,TU,WE,TH,FR') {
            label = 'Các ngày trong tuần(thứ hai đến thứ sáu)'
          }
        } else if (rrule.freq === 'MONTHLY') {
          label = label + ` vào ngày ${moment(result.start).date()}`
        }
        if (rrule.until) {
          const ut = moment(rrule.until).format('YYYY-MM-DD HH:mm')
          label = label + ` cho tới ${ut}`
        }
        if (rrule.count) {
          label = label + ` lặp lại ${rrule.count}`
        }
        const a = [...op, ...op2, cuoi]
        let check = false
        console.log('zzz', label)
        for (const va in a) {
          console.log(a[va].label)
          if (a[va].label.trim() === label.trim()) {
            check = true
            setOptionSelected(va)
            setInitOptionSelected(va)
            break
          }
        }
        if (!check) {
          console.log('here')
          op2.push({
            value: 7,
            label,
            rrule
          })
          setOptionSelected(op2.length + op.length - 1)
          setInitOptionSelected(op2.length + op.length - 1)
        }
      } else {
        setOptionSelected(0)
        setInitOptionSelected(0)
      }
      if (result?.extendedProps?.booking) {
        const acc = result.extendedProps.booking.accountId
        const cc = {
          value: acc,
          _id: acc,
          email: result.extendedProps.booking.organizer.email,
          label: result.extendedProps.booking.organizer.email
        }
        setAccounts([cc])
        setDisableAccount(true)
        setAttendees((result?.extendedProps?.booking?.attendees || []).map(qq => qq?.email))
      } else {
        setAccounts([])
        setDisableAccount(false)
        setAttendees([])
      }
      setTitle(result?.extendedProps?.title)
      setLocation(result?.extendedProps?.location)
      setDescription(result?.extendedProps?.description)
      setData(result)
      setStart(result.start)
      setEnd(result.end)
      setAllDay(result.allDay)
      setOptionSelect([...op, ...op2, cuoi])
    })
  }, [])
  const showDateTimePicker = () => {
    return (
      <div className="grid grid-cols-2 gap-3">
        <div>
          <DatePicker
            selected={start}
            showTimeSelect={!allDay}
            timeFormat="HH:mm"
            // closeOnSelect={true}
            shouldCloseOnSelect={true}
            onChange={(date) => handleSetStart(date)}
            dateFormat={!allDay ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy'}
            showTimeInput
            timeInputFormat="HH:mm"
            className={'w-[90%]'}
          />
        </div>
        <div>
          <DatePicker
            selected={end}
            showTimeSelect={!allDay}
            timeFormat="HH:mm"
            onChange={(date) => {
              setIsEdit(true)
              setEnd(date)
            }}
            dateFormat={!allDay ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy'}
            showTimeInput
            closeOnSelect
            timeInputFormat="HH:mm"
            className={'w-[90%]'}
            minDate={start}
            minTime={moment(start).add(30, 'minutes').toDate()}
            maxTime={moment(start).set({ hour: 23, minute: 30 }).toDate()}
          />
        </div>
      </div>
    )
  }
  const qq = () => {
    return (
      <Form className="space-y-4" onSubmit={e => e.preventDefault()}>
        <Form.Group controlId="formInput">
          <Form.Control
            className={'input-new-calendar'}
            type="text" placeholder="tieu de" defaultValue={data?.title}
            style={{ border: 'none', borderBottom: '2px solid blue', borderRadius: '0px' }}
            value={title}
            onChange={changeTitle}
          />
        </Form.Group>
        <Form.Group>
          {showDateTimePicker()}
        </Form.Group>
        <Row>
          <Form.Group>
            <Form.Check checked={allDay} onChange={handleSetAllDay} type={'checkbox'}
                        label={'Cả ngày'}/>
          </Form.Group>
          <Form.Group className={'mb-2 w-full'}>
            <Select
              options={optionSelect}
              value={optionSelect[optionSelected]}
              className={'basic-single'}
              classNamePrefix={'select'}
              onChange={(option) => handleChangeOption(option)}
            />
          </Form.Group>
        </Row>
        <Form.Control type={'text'} placeholder={'vi tri'} value={location}
                      onChange={e => setLocation(e.target.value)}/>
        <Form.Group>
          <Select
            // defaultValue={[mailOption[0]]}
            isMulti={create}
            isClearable={!create}
            isSearchable
            isDisabled={disableAccount}
            components={animatedComponents}
            placeholder={'chọn tài khoản đồng bộ'}
            name="colors"
            defaultValue={accounts[0]}
            options={mailOption}
            closeMenuOnSelect={!create}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(option) => handleChangeMail(option)}
          />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Control hidden={accounts?.length !== 1} type="email" placeholder="Thêm khách"
                        value={inputText}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}/>
          {
            errMsg ? <p className={'text-red-500 mt-1'}>{errMsg}</p> : <></>
          }
          <ListGroup className={'mt-1'}>
            {attendees.map((item, index) => (
              <ListGroup.Item key={index} className="d-flex align-items-center">
                <span>{item}</span>
                <span className="ml-auto inline-block" onClick={() => removeItem(index)}>X</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
          {/*{attendees.length ? <Form.Text>quyen khac moi</Form.Text> : null}*/}
        </Form.Group>
        <Form.Group>
          <Form.Control as={'textarea'} row={'3'} placeholder={'Mô tả'} value={description}
                        onChange={(e) => {
                          setDescription(e.target.value)
                        }}/>
        </Form.Group>

      </Form>
    )

  }
  const handleSelect = (eventKey) => {
    console.log(eventKey)
    setRepeatType(eventKey)
  }
  const changeRepeatDay = (val) => {
    console.log('dm  ', val)
    if (val.length) {
      setRepeatDay(val)
    }
  }
  const handleCloseModal2 = () => {
    setOptionSelected(0)
    setShowModal2(!showModal2)
  }
  const handleSaveModal2 = () => {
    const len = optionSelect.length
    console.log(len)
    let label = ''
    let rrule = {
      freq: timeTypeConfig[repeatType].freq,
      dtstart: start
    }
    if (repeatTimes === 1) {
      label = `Hàng ${timeTypeConfig[repeatType].slug}`
    } else {
      label = `${repeatTimes} ${timeTypeConfig[repeatType].slug} một lần`
      rrule.interval = +repeatTimes
    }
    if (+repeatType === 12) {
      let thu = ''
      const r = []
      repeatDay.sort()
      for (const va of repeatDay) {
        r.push(thuConfig[va].key)
        thu = thu + ` ${thuConfig[va].slug},`
      }
      rrule.byweekday = r
      label = `${label} vào ngày${thu.slice(0, -1)}`
    } else if (+repeatType === 13) {
      label = `${label} ${repeatMonthSelected.slug}`
      rrule = { ...rrule, ...repeatMonthSelected.rrule }
    }

    if (endCheck === 2) {
      const ed = moment(endTime)
      const edTime = ed.format('YYYY-MM-DD HH:mm')
      label = `${label} cho tới ${edTime}`
      rrule.until = endTime
    } else if (endCheck === 3) {
      label = `${label} lặp lại ${endCount} lần`
      rrule.count = +endCount
    }
    const qq = {
      value: len + 1,
      label,
      rrule
    }
    optionSelect.splice(len - 1, 0, qq)
    setOptionSelect(optionSelect)
    setOptionSelected(optionSelect.length - 2)
    setShowModal2(!showModal2)
    if (!create) {
      setIsEdit(true)
    }
  }
  const handleOkModalEdit = async () => {
    try {
      console.log(data)
      console.log(checkEdit)
      let st = start
      let en = end
      if (allDay) {
        st = moment(st).format('YYYY-MM-DD')
        en = moment(en).format('YYYY-MM-DD')
      }
      const dd = {}
      dd.title = title
      dd.location = location
      dd.description = description
      dd.checkEdit = (!data?.extendedProps?.rrule || +optionSelected === 0) ? 0 : +checkEdit
      dd.accounts = accounts
      dd.attendees = attendees
      dd.allDay = allDay
      dd.rrule = optionSelect[optionSelected]?.rrule
      dd.removeRrule = (data?.extendedProps?.rrule && optionSelected === 0) ? 1 : 0
      dd.start = st
      dd.end = en
      dd.booking = data?.extendedProps?.booking
      if (data.extendedProps.allDay) {
        dd.originalStartDate = moment(data.start).format('YYYY-MM-DD')
      } else {
        dd.originalStartDateTime = data.start
      }
      if (dd.checkEdit === 2) {
        dd.initRrule = data.extendedProps.rrule
        if ((new Date(data.start)).getTime() === (new Date(data.extendedProps.start)).getTime()) {
          dd.checkEdit = 3
        }
      }
      if (dd.checkEdit === 3) dd.rootData = data.extendedProps

      if (dd.rrule && dd.checkEdit !== 3) {
        dd.rrule.dtstart = st
      }
      if (dd.rrule && dd.checkEdit === 3) {
        if (dd.allDay) {
          dd.rrule.dtstart = moment(data?.extendedProps?.rrule?.dtstart).format('YYYY-MM-DD')
        } else {
          dd.rrule.dtstart = data.extendedProps.rrule.dtstart
        }
      }
      const {data: zz} = await CalendarApi.updateCalendar(data.id, dd)
      setShowEdit(false)
      handle(false)
      setCheckEdit(1)
      eventEmitter.emit('updateEvent', zz)

    } catch (e) {
      console.log(e)
      handle(false)
    }
  }
  const ShowEdit = (props) => {
    if (!showEdit) {
      return null
    }
    return (
      <Modal
        {...props}
        size="sm"
        className={'c-modal'}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          {(!data?.extendedProps?.rrule || +optionSelected === 0) ? <div>Bạn có chắc chắn muốn sửa</div> : (
            <>
              <Form>
                <Form.Label>Chỉnh sửa sự kiện định kỳ</Form.Label>
                <div onChange={(event) => {
                  setCheckEdit(+event.target.defaultValue)
                }}>
                  {optionSelected === initOptionSelected && <Form.Check type="radio"
                                                                        label={'Chỉ sự kiện này'}
                                                                        value={1}
                                                                        id={'50'}
                                                                        name={'group1'}
                                                                        checked={checkEdit === 1}
                    // onChange={() => {
                    //   console.log('vao day 1')
                    //   setCheckEdit(1)}}
                                                                        className={'mb-3'}
                  />}
                  <Form.Check type="radio"
                              label={'Sự kiện này và các sự kiện về sau'}
                              value={2}
                              id={'51'}
                              name={'group1'}
                              checked={checkEdit === 2}
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
                              checked={checkEdit === 3}
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
          <Button variant={'light'} onClick={handleOkModalEdit}>Ok</Button>
        </Modal.Footer>
      </Modal>
    )
  }
  const bodyModal2 = () => {
    return (
      <>
        <div className={'mb-2'}><b>Lặp lại tùy chỉnh</b></div>
        <div>
          <InputGroup className="mb-3 flex items-center w-full">
              <span className={'h-[38px] flex items-center justify-center mr-2'}>
              Lặp lại mỗi
              </span>
            <div className={'w-[20%]'}>
              <Form.Control
                type={'number'}
                min={1}
                value={repeatTimes}
                onChange={(e) => {
                  if (!(+e.target.value) || +e.target.value < 0) {
                    setRepeatTimes(1)
                  } else {
                    setRepeatTimes(e.target.value)
                  }
                }}
              />
            </div>
            <DropdownButton
              variant="outline-secondary"
              title={timeTypeConfig[repeatType].value}
              id="input-group-dropdown-2"
              align="end"
              onSelect={handleSelect}
            >
              {Object.values(timeTypeConfig).map(va => {
                return (
                  <Dropdown.Item eventKey={va.id} id={va.id}>{va.value}</Dropdown.Item>
                )
              })}
            </DropdownButton>
          </InputGroup>
          {+repeatType === 12 && (
            <>
              <Form.Label>Lặp lại vào</Form.Label>
              <ToggleButtonGroup type={'checkbox'} value={repeatDay} onChange={changeRepeatDay}>
                {(Object.values(thuConfig)).map(va => {
                  return (
                    <ToggleButton id={va.id}
                                  variant={repeatDay.includes(va.id) ? 'primary' : 'light'}
                                  value={va.id}>{va.symbol}

                    </ToggleButton>
                  )
                })}
              </ToggleButtonGroup>
            </>

          )}
          {+repeatType === 13 && (
            <Form.Group className={'mb-2 w-full'}>
              <Select
                options={repeatMonth}
                value={repeatMonthSelected}
                className={'basic-single'}
                classNamePrefix={'select'}
                onChange={(option) => setRepeatMonthSelected(option)}
              />
            </Form.Group>
          )}
          <Form.Label className={'mt-3'}>Kết thúc</Form.Label>
          <Form>
            <div>
              <Form.Check type="radio"
                          label={'Không bao giờ'}
                          value={1}
                          defaultChecked
                          name={'group1'}
                          onChange={() => setEndCheck(1)}
                          className={'mb-2'}
              />
              <Form.Check type="radio"
                          style={{ alignItems: 'center', display: 'flex' }}
                          onChange={() => setEndCheck(2)}
                          value={2}
                          name={'group1'}
                          label={
                            (<>
                              <div className="flex space-x-2">
                                <InputGroup className="flex w-full">
              <span className={'flex items-center ml-2'}>
              <span className={'w-[30%]'}>Vào ngày</span>
              <DatePicker
                disabled={endCheck !== 2}
                selected={endTime}
                onChange={(date) => setEndTime(date)}
                dateFormat={'dd/MM/yyyy'}
                className={'w-[70%]'}
              />
              </span>

                                </InputGroup>
                              </div>
                            </>)
                          }
              />
              <Form.Check type="radio"
                          value={3}
                          name={'group1'}
                          onChange={() => setEndCheck(3)}
                          className={'form-binh'}
                          label={
                            (<>
                              <div className={'flex space-x-2 items-center'}>
                                <InputGroup className="w-full flex items-center">
                                  <div
                                    className={'h-[38px] flex items-center justify-center mr-2'}>
                                    Lặp lại mỗi
                                  </div>
                                  <div className={'w-[20%] mr-2'}>
                                    <Form.Control
                                      disabled={endCheck !== 3}
                                      type={'number'}
                                      min={1}
                                      value={endCount}
                                      onChange={(e) => {
                                        if (!(+e.target.value) || +e.target.value < 0) {
                                          setEndCount(1)
                                        } else {
                                          setEndCount(e.target.value)
                                        }
                                      }}
                                    />
                                  </div>
                                  <div
                                    className={'h-[38px] flex items-center justify-center mr-2'}>
                                    Lần xuất hiện
                                  </div>
                                </InputGroup>
                              </div>
                            </>)
                          }
              />
            </div>

          </Form>
        </div>
      </>
    )
  }
  return (
    <>
      <Modal
        show={show} onHide={handleCloseModal}
        backdropClassName={!showModal2 ? 'custom-modal' : 'modal-hide-custom'}
        // style={{display: 'flow', alignItems: 'center', justifyContent: 'center'}}
        scrollable
        dialogClassName={showModal2 ? 'modal-hide-custom' : ''}
        // centered
        // fullscreen={'xl-down'}
      >
        <div className={'min-h-[500px] h-full flex justify-center items-center  px-3 py-3 overflow-auto'}>
          {qq()}
        </div>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModal2} onHide={handleCloseModal2}
             style={{ paddingTop: '20%' }}
             dialogClassName={'!w-[400px]'}
             fullscreen={'xl-down'}
      >
        <Modal.Body>
          {bodyModal2()}

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal2}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSaveModal2}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
      <ShowEdit
        show={showEdit}
        onHide={() => setShowEdit(false)}/>
    </>
  )
}
