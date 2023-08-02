import React, {useEffect, useState} from 'react'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import {faPencil} from '@fortawesome/free-solid-svg-icons'
import FieldInfo from '../components/FieldInfo'
import {UserApi} from '../apis/user'
import eventEmitter from '../utils/eventEmitter'
import {signIn} from 'next-auth/react'
import {Button, Modal} from "react-bootstrap";
import {AuthenApi} from "../apis/authen";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
const menu = [
    {
        id: 1,
        title: 'Thông tin cá nhân'
    }
]

async function handlerSignGoogle() {
    console.log('vao day ne')
    const qq = await signIn('google')
    console.log('vcl', qq)
}

const PersonalDetail = () => {
    const [info, setInfo] = useState({})
    const [showPopover, setShowPopover] = useState(false)
    const [data, setData] = useState(null)
    const [showEdit, setShowEdit] = useState(false)
    const [accounts, setAccounts] = useState([])
    useEffect(() => {
        (async () => {
            const res = await UserApi.getUser()
            setInfo(res)
        })()
    }, [])
    useEffect(() => {
        (async () => {
            const acc = await UserApi.getAccountProfile()
            setAccounts(acc)
        })()
    }, [])
    useEffect(() => {
        eventEmitter.on('updateInfo', (name) => {
            console.log('ua name', name)
            setInfo({
                ...info,
                name: name
            })
        })
    }, [])
    const handleOkModalCheck = async () => {
        try {
            console.log('data ne')
            const dd = await AuthenApi.deleteAccount(data._id)
            console.log(dd)
            if(dd.ok){   toast.success(`Xóa tài khoản thành công`, {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: 'colored',
            })
                const cc = accounts.filter(va => va._id !== data._id)
                setAccounts(cc)
                setShowPopover(!showPopover)
            } else {
                toast.error(`Xóa tài khoản thất bại, vui lòng thử lại`, {
                    position: 'top-center',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: 'colored',
                })
                setShowPopover(!showPopover)
            }

        } catch (e) {
            toast.error(`Xóa tài khoản thất bại, vui lòng thử lại`, {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: 'colored',
            })
            setShowPopover(!showPopover)
        }

    }
    const ShowCheck = (props) => {
        if (!showPopover) {
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
                    <div>Bạn có chắc chắn muốn xóa</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={'light'} onClick={props.onHide}>Hủy</Button>
                    <Button variant={'light'} onClick={handleOkModalCheck}>Ok</Button>
                </Modal.Footer>
            </Modal>
        )
    }
    return (
        <>
            <div className={'bg-gray-200 min-h-screen'}>
                <div className={'max-w-[1200px] mx-auto lg:grid grid-cols-3 gap-x-6 lg:py-8 p-2'}>
                    <div className={'col-span-1 bg-white rounded-lg py-4 px-6 mt-4'}>
                        <div className={'py-2'}>
                            <div className={'flex gap-x-3 items-center'}>
                                <div className={''}>
                                    <img src={info?.avatar} alt={''} className={'rounded-full object-top'}/>
                                </div>
                                <div
                                    className={'flex flex-col gap-y-3 justify-center w-fit items-center relative cursor-pointer font-bold'}>
                                    {info?.name}
                                </div>
                            </div>
                            <div className="divider horizontal !my-2"></div>
                            <ul className={'flex flex-col py-2 !ml-0 pl-0'}>
                                {menu.map((item, index) =>
                                    <li key={item.id}
                                        className={`p-2 cursor-pointer mb-2 ${index === 0 ? 'bg-violet-400 text-white font-bold rounded-md ' : ''}`}>{item.title}</li>
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className={'col-span-2 bg-white rounded-lg py-4 px-6 mt-4 lg:mt-0'}>
                        <div className={'flex gap-x-5'}>
                            <div className={'w-full'}>
                                <FieldInfo value={info?.name} icon={faPencil} label={'Tên hiển thị'}
                                           isShowEdit={showEdit}/>
                                <FieldInfo label={'Tài khoản:'}/>
                                {(accounts || []).map((account) => (
                                    <div className={'flex gap-x-3 items-center border border-gray-100 rounded-xl mb-2'}>
                                        <div className={'w-full flex justify-between'}>
                                            <div className={'flex'}>
                                                <div className={'p-2'}>
                                                    <img src={account?.photo} alt={''}
                                                         className={'rounded-circle object-top w-10 h-10'}/>
                                                </div>
                                                <div
                                                    className={'flex flex-col gap-y-3 justify-center w-fit items-center relative cursor-pointer font-bold'}>
                                                    {account?.email}
                                                </div>
                                            </div>
                                        </div>
                                        {
                                           accounts.length !== 1 &&  <div className={'cursor-pointer mr-3'} onClick={() => {
                                               console.log('ua alo')
                                                setData(account)
                                                setShowPopover(true)
                                            }}>
                                                <i className="bi bi-x-circle-fill"></i>
                                            </div>
                                        }
                                    </div>
                                ))}
                                {(accounts || []).length < 5 &&
                                <button
                                    className={'w-full flex justify-center items-center h-14 rounded-xl border border-gray-100'}><span
                                    className={'text-3xl'} onClick={async () => {
                                    await localStorage.setItem('account', true)
                                    handlerSignGoogle()
                                }}>+</span></button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ShowCheck
                show={showPopover}
                onHide={() => setShowPopover(false)}/>
        </>
    )
}

export default PersonalDetail
