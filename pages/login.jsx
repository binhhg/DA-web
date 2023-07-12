import React, { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { Button } from 'react-bootstrap'

async function handlerSignGoogle () {
  console.log('vao day ne')
  const qq = await signIn('google')
  console.log('vcl', qq)
}

function Login () {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setShow(true)
    }
  }, [])
  return (
    <div className={' hover:divide-pink-400 '}>
      <p>Wellcome 2</p>
      <button hidden={show} className={'btn btn-primary'} onClick={async () => handlerSignGoogle()}> đăng nhập</button>
      <button hidden={!show} className={'btn btn-primary'} onClick={async () => {
        await localStorage.setItem('account', true)
        handlerSignGoogle()
      }}> Liên kết
      </button>
    </div>
  )
}

export default Login
