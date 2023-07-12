import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

import { AuthenApi } from '../apis/authen'
import eventEmitter from '../utils/eventEmitter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'

export default function Test () {

  async function login (data) {
    try {
      const { token, user } = await AuthenApi.login(data)
      if (token) {
        toast.success(`Bạn đã đăng nhập thành công với tài khoản: ${user.name || ''}`, {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: 'colored',
        })
        console.log('login oke')
        localStorage.setItem('isLoggedIn', true)
        localStorage.setItem('token', token)
        eventEmitter.emit('loggedIn', { token })
        return true
      } else {
        toast.error(`Đăng nhập thất bại, vui lòng thử lại`, {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: 'colored',
        })
        console.log('login fail')
        return false
      }
    } catch (e) {
      toast.error(`Đăng nhập thất bại, vui lòng thử lại`, {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'colored',
      })
      return false
    }
  }

  async function accessAccount (data) {
    try {
      const { ok } = await AuthenApi.account(data)
      if (ok) {
        toast.success('Bạn đã liên kết thành công với tài khoản:', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: 'colored'
        })
        console.log('login oke')
        localStorage.setItem('account', false)
        return true
      } else {
        toast.error(`liên kết thất bại thất bại, vui lòng thử lại`, {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: 'colored',
        })
        localStorage.setItem('account', false)
        console.log('login fail')
        return false
      }
    } catch (e) {
      toast.error(`Đăng nhập thất bại, vui lòng thử lại`, {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'colored',
      })
      return false
    }
  }

  const router = useRouter()
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const account = localStorage.getItem('account')
    if (isLoggedIn && !account) { // login roi va khong phai lien ket
      console.log('vao day chua')
      console.log(router)
      router.push('/lich')
    } else {
      (async () => {
        const qq = new URLSearchParams(window.location.search)
        // const sub = qq.get('sub')
        // const email = qq.get('email')
        // const name = qq.get('name')
        // const picture = qq.get('picture')
        // const loginType = qq.get('loginType')
        // const refresh_token = qq.get('refresh_token')
        // const scope = qq.get('scope')
        // const provider = qq.get('provider')
        // const providerAccountId = qq.get('providerAccountId')
        const res = qq.get('res')
        const cc = decodeURI(res)
        const zz = JSON.parse(cc)
        // const vl = {
        //     account: {
        //         refresh_token, scope, provider, providerAccountId
        //     },
        //     loginType,
        //     profile: {
        //         sub, email, name, picture
        //
        //     }
        // }
        if (!isLoggedIn) {
          const check = await login(zz)
          console.log(check)
          if (check) {
            return router.push('/lich')
          }
          return router.push('/home')
        } else {
          const check = await accessAccount(zz)
          if (check) {
            return router.push('/lich')
          }
          return router.push('/home')
        }
      })()
    }
  }, [])
  return (
    <div className={'h-[250px] flex justify-center items-center'}>
      <FontAwesomeIcon icon={faSpinner} spin={true}/>
    </div>
  )
}
