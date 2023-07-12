import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'bootstrap/dist/css/bootstrap.min.css'
import eventEmitter from '../utils/eventEmitter'
import { UserApi } from '../apis/user'

const FieldInfo = ({ label, value, icon, isShowEdit: isShowEditProp }) => {
  const [isShowEdit, setIsShowEdit] = useState(isShowEditProp)
  const [displayName, setDisplayName] = useState('')
  const [showErr, setShowErr] = useState(false)

  useEffect(() => {
    setDisplayName(value)
  }, [value])

  const handleShowEdit = () => {
    setIsShowEdit(!isShowEdit)
    setShowErr(false)
  }
  const handleUpdate = async () => {
    if (displayName && displayName.trim() !== '') {
      const { ok, data } = await UserApi.updateInfo({ name: displayName })
      if (ok) {
        eventEmitter.emit('updateInfo', displayName)
      }
      setIsShowEdit(false)
    } else {
      setShowErr(true)
    }
  }
  const handleChangeInput = (e) => {
    setDisplayName(e.target.value)
  }

  const handleCancel = () => {
    setIsShowEdit(false)
    setDisplayName(user.displayName)
  }
  return (
    <>
      <div className={'flex items-center justify-between lg:px-2 py-1 rounded-md'}>
        <div className={'lg:flex'}>
          <div className={'w-[200px]'}>
            <span className={'lg:px-1 font-semibold'}>{label}</span>
          </div>

          {isShowEdit ?
            (<div className={'w-full h-[100px]'}>
              <div className={'mb-4 text-info transition ease-out'}>
                <input type={'text'}
                       value={displayName}
                       onChange={e => handleChangeInput(e)}
                       className={'mt-1 rounded-md bg-base-200 border border-base-200 !w-full h-[50px] p-2 text-info outline-1 outline-primary'}
                       name={label}
                />
                {showErr && <p className={'text-md text-error'}>Vui lòng nhập tên hiển thị</p>}
                <div className={'float-right flex items-center gap-x-3 py-2'}>
                  <button className={'text-sm px-2 py-1 rounded-md border border-base-100 bg-base-200 text-black-400'}
                          onClick={handleCancel}>Hủy bỏ
                  </button>
                  <button className={'btn btn-primary text-white text-sm px-2 py-1 rounded-md'}
                          onClick={handleUpdate}>Cập nhật
                  </button>
                </div>
              </div>
            </div>)
            :
            <div className={'lg:px-2 font-bold text-info'} style={{ wordBreak: 'break-word' }}>{displayName}</div>
          }
        </div>
        {!isShowEdit && (
          <div
            className={`w-8 h-8 flex items-center justify-center ${icon ? 'bg-base-200 rounded-full cursor-pointer' : ''}`}
            onClick={handleShowEdit}>
            {icon && <FontAwesomeIcon icon={icon} style={{ fontSize: '14px', color: '#22c55e' }}/>}
          </div>
        )
        }
      </div>
    </>
  )
}

export default FieldInfo
