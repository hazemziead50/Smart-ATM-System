import {BrowserRouter} from 'react-router-dom'
import AppRoutes from './Routers/router'
import { useEffect, useRef } from 'react'
import {sendUsersIfEmpty} from './Utils/sendUsers'
import useThemeStore from './Store/useThemeStore'
import ToastContainer from './Component/ToastContainer'

function App() {
  const theme = useThemeStore((state) => state.theme)
    useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const hasSend = useRef(false)
  useEffect(()=>{
  if(hasSend.current) return
  hasSend.current = true
  sendUsersIfEmpty()
  },[])
  return (
    <BrowserRouter>
    <ToastContainer/>
    <AppRoutes/>
    
    </BrowserRouter>
  )
}

export default App
