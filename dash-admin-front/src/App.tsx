
import './App.css'
import { CssBaseline, ThemeProvider } from "@mui/material"
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
import Signup from './scenes/auth/Signup'
import Geography from './scenes/geo'
import OverallStats from './scenes/overview'
import DailyStats from './scenes/daily'
function App() {
  const mode = useAppSelector((state) => state.global.mode)
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
  return (
    <div className='app'>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path='/' element={<Navigate to="/dashboard" replace />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/products' element={<Products />} />
              <Route path='/customers' element={<Customers />} />
              <Route path='/transaction' element={<Transactions />} />
              <Route path='/geography' element={<Geography />} />
              <Route path='/overview' element={<OverallStats />} />
              <Route path='/daily' element={<DailyStats />} />
            </Route>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
