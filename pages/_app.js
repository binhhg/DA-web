import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function App ({ Component, pageProps }) {
  const router = useRouter()
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token')
      const path = router.pathname
      if (!token && (path !== '/' && path !== '/login' && path !== '/test')) {
        router.push('/home')
      } else if (token && path === '/home') {
        router.push('/lich')
      }
    })()
  })
  return <>
    <Component {...pageProps} />
    <ToastContainer
      position="bottom-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover={false}
      theme="colored"
    />
  </>
}
