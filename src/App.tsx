import {HashRouter} from 'react-router-dom'
import AppRoutes from './Routers/router'
import { useEffect } from 'react'
import useThemeStore from './Store/useThemeStore'
import ToastContainer from './Component/ToastContainer'
import './theme.css'

function App() {
  const theme = useThemeStore((state) => state.theme)
    useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <HashRouter>
    <ToastContainer/>
    <AppRoutes/>
    
    </HashRouter>
  )
}

export default App
