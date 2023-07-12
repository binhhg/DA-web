import React, { useEffect, useRef, useState } from 'react'
import CalendarA from '../components/calendar'// a plugin!
import ModalNew from '../components/modalNew'// a plugin!
import CalendarB from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import eventEmitter from '../utils/eventEmitter'
import { ColorConfig } from '../apis/colorConfig'
import ColorCard from '../components/colorCard'
import { Dropdown } from 'react-bootstrap'
import { UserApi } from '../apis/user'
import { useRouter } from 'next/router'

export default function Lich () {
  const calen = useRef(null)
  const router = useRouter()
  const [value, setValue] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [showModalEdit, setShowModalEdit] = useState(false)
  const [colorConfig, setColorConfig] = useState({})
  const [isClient, setIsClient] = useState(false)
  const [info, setInfo] = useState({})
  useEffect(() => {
    (async () => {
      const res = await UserApi.getUser()
      setInfo(res)
    })()
  }, [])
  useEffect(() => {
    (async () => {
      const qq = await ColorConfig.getColorConfig()
      setColorConfig(qq)
    })()
  }, [])

  useEffect(() => {
    setIsClient(true)
  }, [])

  function handleShowModalEdit () {
    setShowModalEdit(true)
  }

  function handelShowModal () {
    setShowModal(true)
  }

  function onChange (vc) {
    setValue(vc)
    let calend = calen.current.getApi()
    calend.gotoDate(vc)
  }

  eventEmitter.on('clickToday', () => {
    const today = new Date()
    setValue(today)
  })

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div className={'flex items-center justify-between gap-1 cursor-pointer'}>
      <img onClick={onClick} src={info?.avatar} alt=""
           className={'w-[36px] h-[36px] rounded-full'}/>
      <div>{info?.name}</div>
      {children}
    </div>
  ))

  return (
    <div className="grid grid-cols-7 h-screen w-full p-3 gap-3">
      <div className={'col-span-1'}>
        <Dropdown className={'mb-3'}>
          <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
            <div></div>
            <div className={'w-[36px] h-[36px] rounded-lg bg-gray-100 flex justify-center items-center'}><i
              className={'bi bi-plus text-lg'}></i></div>
          </Dropdown.Toggle>

          <Dropdown.Menu className={'!border-none'} style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px;' }}>
            <Dropdown.Item onClick={() => {
              router.push('/profile')
            }}>Thông tin tài khoản</Dropdown.Item>
            <Dropdown.Item >Đăng xuất</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {
          isClient ?
            <CalendarB onChange={onChange} value={value}/> : <></>
        }
        <ColorCard colorConfig={colorConfig} setColorConfig={setColorConfig}/>
      </div>
      <div className={'col-span-6'} style={{ height: 'calc(100vh - 24px)' }}>
        <CalendarA showModal={handelShowModal} colorConfig={colorConfig} ref={calen}/>
        <ModalNew show={showModal} handle={setShowModal} showEdit={showModalEdit} handleEdit={setShowModalEdit}/>
      </div>
    </div>
  )
}
