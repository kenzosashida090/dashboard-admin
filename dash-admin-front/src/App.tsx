
import './App.css'
import { CssBaseline, ThemeProvider} from "@mui/material"
import { createTheme } from "@mui/material/styles"
import { themeSettings } from '@/theme'
import { useAppSelector } from './state/redux'
import { useMemo } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "@/scenes/dashboard"
import Layout from '@/scenes/layout'
import Login from '@/scenes/auth/Login'
import Products from '@/scenes/products'
import Customers from '@/scenes/customers'
import Transactions from './scenes/transaction'
function App() {
  const mode = useAppSelector((state)=>state.global.mode)
  const theme = useMemo(()=> createTheme(themeSettings(mode)),[mode])
  return (
    <div className='app'>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout/>}>
              <Route path='/' element={<Navigate to="/dashboard" replace/>} />
              <Route path='/dashboard' element={<Dashboard/>} />
              <Route path='/products' element={<Products/>} />
              <Route path='/customers' element={<Customers/>} />
              <Route path='/transaction' element={<Transactions/>} />
            </Route>
            <Route path='/login' element={<Login/>} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
