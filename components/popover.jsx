import React, { forwardRef, useEffect, useState } from 'react'
import { Modal, Button, Form, Row, Col, FormSelect, Popover, OverlayTrigger, Overlay } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import eventEmitter from '../utils/eventEmitter'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import 'react-datepicker/dist/react-datepicker.css'

const PopoverA = forwardRef((props, ref) => {
  const { show, handel, popoverPosition } = props
  const option = [
    { value: '1', label: 'Không lặp lại' },
    { value: '2', label: 'Hàng tuần vào thứ  21111111111111111' },
    { value: '3', label: 'Hàng tháng vào thứ ' },
    { value: '4', label: 'tùy chỉnh... ' },
  ]
  const [data, setData] = useState({})
  const [optionSelect, setOptionSelect] = useState(option)
  const [inputText, setInputText] = useState('')
  const [array, setArray] = useState([])

  const handleInputChange = (e) => {
    setInputText(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addToArr()
    }
  }

  const addToArr = () => {
    setArray((prevArray) => [...prevArray, inputText])
    setInputText('')
  }

  const removeItem = (index) => {
    console.log('xoa')
    const newArray = [...array]
    newArray.splice(index, 1)
    setArray(newArray)
  }
  const handleCloseModal = () => {
    console.log('edit')
    handel(false)
  }
  const showDateTimePicker = () => {
    const filterPassedTime = (time) => {
      const currentDate = new Date()
      const selectedDate = new Date(time)

      return currentDate.getTime() < selectedDate.getTime()
    }
    return (
      <div className="grid grid-cols-2 gap-3">
        <div>
          <DatePicker
            selected={data.start}
            showTimeSelect={!data.allDay}
            timeFormat="HH:mm"
            dateFormat={!data.allDay ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy'}
            showTimeInput
            timeInputFormat="HH:mm"
            minDate={data.start}
            className={'w-[90%]'}
          />
        </div>
        <div>
          <DatePicker
            selected={data.start}
            showTimeSelect={!data.allDay}
            timeFormat="HH:mm"
            dateFormat={!data.allDay ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy'}
            showTimeInput
            timeInputFormat="HH:mm"
            minDate={data.start | data.end}
            className={'w-[90%]'}
          />
        </div>
      </div>
    )
  }
  const qq = () => {
    return (
      <Form onSubmit={e => e.preventDefault()}>
        <Form.Group controlId="formInput" className={'mb-3'}>
          <Form.Control
            type="text" placeholder="tieu de" defaultValue={data?.title}
            style={{ border: 'none', borderBottom: '2px solid blue' }}
          />
        </Form.Group>
        <Form.Group>
          {showDateTimePicker()}
        </Form.Group>
        <Row>
          <Form.Group className={'mb-2'}>
            <Form.Check type={'checkbox'} label={'Cả ngày'}/>
          </Form.Group>
          <Form.Group as={Col} md="5" className={'mb-2'}>
            <Select
              defaultValue={optionSelect[0]}
              options={optionSelect}
            />
          </Form.Group>
        </Row>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Control type="email" placeholder="Thêm khách" value={inputText} onChange={handleInputChange}
                        onKeyPress={handleKeyPress}/>
          <ul>
            {array.map((item, index) => (
              <li key={index}>
                {item}{' '}
                <button onClick={() => removeItem(index)}>Xóa</button>
              </li>
            ))}
          </ul>
          {array.length ? <Form.Text>quyen khac moi</Form.Text> : null}
        </Form.Group>
      </Form>
    )
  }

  useEffect(() => {
    eventEmitter.on('showModalNew', result => {
      console.log('vao day dc ne', result)
      setData(result)
    })
  }, [])

  return (
    <>
      <Overlay show={show} placement={'bottom'}>
        {({ arrowProps, show: _show, popper, ...props }) => (
          <div
            {...props}
            style={{
              position: 'absolute',
              zIndex: 9999,
              backgroundColor: 'white',
              padding: '10px',
              borderRadius: '5px',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.15)',
              ...popoverPosition,
            }}
          >
            <Popover id="popover-example">
              <Popover.Title as="h3">Popover Title</Popover.Title>
              <Popover.Content>
                This is the content of the popover.
              </Popover.Content>
            </Popover>
          </div>
        )}
      </Overlay>
    </>
  )
})

export default PopoverA
