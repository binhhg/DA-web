import React, { useEffect, useState } from 'react'
import { auth, provider } from '../firebaseConfig'
import { signInWithPopup, GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import Home from './index'

function SignIn () {
  const [value, setValue] = useState({})
  const handleClick = () => {
    signInWithPopup(auth, provider).then((data) => {
      const credential = GoogleAuthProvider.credentialFromResult(data)
      const qq = data.credential
      console.log('co token k', data)
      const uid = data.user.uid
      const token = credential.accessToken

      console.log('credential  ', credential)
      setValue({
        ...value,
        data
      })
      console.log('zzz', data)
    })
  }

  return (
    <div>
      <button onClick={handleClick}>Signin With Google</button>
    </div>
  )
}

export default SignIn
