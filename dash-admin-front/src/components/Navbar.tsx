import React, { useState } from 'react'
import {
    LightModeOutlined, 
    DarkModeOutlined, 
    Menu as MenuIcon, 
    Search, 
    SettingsOutlined, 
    ArrowDropDownOutlined} from "@mui/icons-material"
import FlexBetween from './FlexBetween'
import { useAppDispatch } from '@/state/redux'
import { setMode } from '@/state'
import profileImage from "@/assets/profile.png"
import { AppBar, Box, Button, IconButton, InputBase, Menu, MenuItem, Toolbar, Typography, useTheme } from '@mui/material'
import { useGetAuthUserQuery } from '@/state/api'
import Loading from './Loading'
type SidebarProps = {
    isSidebarOpen: boolean
    drawerWidth: string
    setIsSidebarOpen : React.Dispatch<React.SetStateAction<boolean>>
}
const Navbar = ({isSidebarOpen, setIsSidebarOpen, drawerWidth}: SidebarProps) => {
    const dispatch = useAppDispatch()
const  { data:user,  isLoading,  } = useGetAuthUserQuery()
    const theme = useTheme()
    const [anchorEl, setAnchorEl] = useState(null)
    const isOpen = Boolean(anchorEl)
    const handleClick = (e)=>{
        setAnchorEl(e.currentTarget)
    }
    const handleClose = ()=> setAnchorEl(null)
    return (
    <AppBar 
        sx={{
            position: "static",
            background: "nonde",
            boxShadow: "none",

        }}
    >
        <Toolbar sx={{justifyContent:"space-between"}}>
            <FlexBetween>
                <IconButton onClick={()=>setIsSidebarOpen((prev)=> !prev)}>
                    <MenuIcon/>
                </IconButton>
                <FlexBetween
                    borderRadius="9px"
                    gap={"3rem"}
                    bgcolor={theme.palette.background.default}
                    p="0.1rem 1.5rem  "
                >
                    <InputBase placeholder='Search...' />
                    <IconButton>
                        <Search/>
                    </IconButton>
                </FlexBetween>
            </FlexBetween>

            <FlexBetween gap="1.5rem">
                <IconButton onClick={()=> dispatch(setMode())}>
                    {
                        theme.palette.mode === "dark" ? (
                            <DarkModeOutlined sx={{fontSize: "25px"}}/>
                        ) :
                        (
                            <LightModeOutlined sx={{fontSize: "25px"}} />
                        )
                    
                    }
                </IconButton>
                <IconButton>
                 <SettingsOutlined sx={{fontSize: "25px"}}/>
                </IconButton>
                <FlexBetween>
                    <Button
                        onClick={handleClick}
                        sx={{
                            display:'flex',
                            justifyContent:"space-between",
                            alignItems: "center",
                            textTransform: "none",
                            gap:"1rem",
                            "&:hover": {
                                backgroundColor: theme.palette.secondary["800"],   // ← hover color
                                color: "white",
                            },
                            "&:active": {
                                backgroundColor: theme.palette.secondary["800"],  // ← click color
                                color: "white",
                            },
                            "& .MuiTouchRipple-root": {
                                color: theme.palette.secondary["800"],  // ← change ripple color
                            },
                            
                        }}
                    >

                
                 { isLoading ? ( 
                            <Box
                                component={"div"}
                                height={"32px"}
                                width={"32px"}
                                borderRadius={"50%"}
                                sx={{objectFit: "cover"}}
                                >
                                    <Loading/>
                                </Box>
                         ) :
                                (
                                    <Box
                                    component={"img"}
                                    alt='profile'
                                    src={profileImage}
                                    height={"32px"}
                                    width={"32px"}
                                    borderRadius={"50%"}
                                    sx={{objectFit: "cover"}}
                                    />
                                )
                            }
                                <Box textAlign={"left"}>
                                    <Typography fontWeight={"bold"} fontSize={"0.85rem"} sx={{color:theme.palette.secondary["100"]}}>
                                        {user?.name}
                                    </Typography>
                                    <Typography fontSize={"0.75rem"} sx={{color:theme.palette.secondary["200"]}}>
                                        {user?.occupation || "-"}
                                    </Typography>
                                </Box>
                            <ArrowDropDownOutlined 
                                sx={{color: theme.palette.secondary[300], fontSize: "25px"}}
                            />
                    </Button>
                    <Menu anchorEl={anchorEl} open={isOpen} onClose={handleClose}  anchorOrigin={{vertical:"bottom", horizontal:"center"}}>
                        <MenuItem onClick={()=>console.log("logout")}>Log Out</MenuItem>
                    </Menu>
                </FlexBetween>
            </FlexBetween>
        </Toolbar>
    </AppBar>
  )
}

export default Navbar
