import { Box, useMediaQuery } from "@mui/material"
import { useState } from "react"
import { Outlet } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
const Layout = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)")
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <Box display={"flex" } width="100%" height="100%">
        <Sidebar
            isNonMobile = {isNonMobile}
            drawerWidth = "250px"
            isSidebarOpen = {isSidebarOpen}
            setIsSidebarOpen = {setIsSidebarOpen}
        />
        <Box
            width={'100%'}
            height={'100%'}
            flexGrow={1}
            minWidth={0}
             sx={{ 
                        transition: "margin-left 0.3s ease-in-out, width 0.3s ease-in-out", 
              }}
        >
            <Navbar
            drawerWidth = "250px"
                isSidebarOpen = {isSidebarOpen}
                setIsSidebarOpen = {setIsSidebarOpen}
            />
            <Outlet/>
        </Box>
    </Box>
  )
}

export default Layout
