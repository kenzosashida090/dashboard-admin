import { 
    AdminPanelSettingsOutlined,
    CalendarMonthOutlined,
    ChevronLeft,  
    ChevronRightOutlined,
    Groups2Outlined,
    HomeOutlined,
    PieChartOutline,
    PointOfSaleOutlined,
    PublicOutlined,
    ReceiptLongOutlined,
    SettingsOutlined,
    ShoppingCartOutlined,
    TodayOutlined,
    TrendingUpOutlined } from '@mui/icons-material'
import { 
    Box, 
    Divider, 
    Drawer,
    IconButton, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText, 
    Typography, 
   
    } from '@mui/material'
    import {type Theme,  useTheme, }  from '@mui/material/styles'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import FlexBetween from './FlexBetween'
import profileImage from "@/assets/profile.png"
import { useGetAuthUserQuery } from '@/state/api'
import Loading from './Loading'

type SidebarProps = {
    isNonMobile : boolean
    drawerWidth: string
    isSidebarOpen: boolean
    setIsSidebarOpen : React.Dispatch<React.SetStateAction<boolean>>
}
type Item = {
    text:string;
    icon: React.ReactElement | null
}
type NavItems = Item[]
const navItems: NavItems = [
    {
        text: "Dashboard",
        icon: <HomeOutlined/>
    },
    {
        text: "Client Facing",
        icon: null
    },
    {
        text: "Products",
        icon: <ShoppingCartOutlined/>
    },
    {
        text: "Customers",
        icon: <Groups2Outlined/>
    },
    {
        text: "Transaction",
        icon: <ReceiptLongOutlined/>
    },
    {
        text: "Geography",
        icon: <PublicOutlined/>
    },
    {
        text: "Sales",
        icon: null
    },
    {
        text: "Overview",
        icon: <PointOfSaleOutlined/>
    },
    {
        text: "Daily",
        icon: <TodayOutlined/>
    },
    {
        text: "Monthly",
        icon: <CalendarMonthOutlined/>
    },
    {
        text: "Breakdown",
        icon: <PieChartOutline/>
    },
    {
        text: "Management",
        icon: null
    },
    {
        text: "Admin",
        icon: <AdminPanelSettingsOutlined/>
    },
    {
        text: "Performance",
        icon: <TrendingUpOutlined/>
    },
]
const Sidebar = ({
    drawerWidth,
    isSidebarOpen,
    setIsSidebarOpen,
    isNonMobile
}:SidebarProps) => {
    const {pathname} = useLocation()
    const [active, setActive] = useState("")
    const navigate = useNavigate()
    const theme = useTheme<Theme>()
    const  { data:user,  isLoading,  } = useGetAuthUserQuery()
    console.log(user,"---")
    useEffect(()=>{
        setActive(pathname.substring(1))
    },[pathname])
    return (
    <Box
        sx={{
        width: isSidebarOpen ? drawerWidth : 0,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        height:'100%',
        transition: "width 0.3s ease-in-out",
         "& .MuiDrawer-paper":{
            backgroundColor: theme.palette.secondary["900"],  // ← here
            color: theme.palette.background.paper,
            boxSizing: "border-box",
            borderWidth: isNonMobile ? 0 : "2px",
            width:  isSidebarOpen ? drawerWidth : 0,
            overflow: "hidden",
            transition: "width 0.3s ease-in-out !important",
        }
        }}
    >
                <Drawer
                    open={isSidebarOpen}
                    onClose={()=> setIsSidebarOpen(false)}
                    variant='permanent'
                    
                    anchor='left'
                    sx={{
                        width: isSidebarOpen ? drawerWidth : 0,
                        "& .MuiDrawer-paper":{
                            color: theme.palette.background.paper,
                            boxSizing: "border-box",
                            borderWidth: isNonMobile ? 0 : "2px",
                            width:  isSidebarOpen ? drawerWidth : 0,
                            overflow: "hidden",
                            transition: "width 0.3s ease-in-out !important",
                        }
                    }}
                >
                    <Box width={'100&'}>
                        <Box m="1.5rem 2rem 2rem 3rem">
                            <FlexBetween color={theme.palette.secondary.main}>
                                <Box display={"flex"} alignItems={"center"} gap={"0.5rem"}>
                                    <Typography variant='h4' fontWeight={"bold"} >
                                        Kib.dev
                                    </Typography>
                                </Box>
                                {
                                    !isNonMobile && (
                                        <IconButton onClick={()=> setIsSidebarOpen(!isSidebarOpen)}>
                                            <ChevronLeft/>
                                        </IconButton>
                                    )
                                }
                            </FlexBetween>
                        </Box>
                        <List>
                            {
                                navItems.map(({text,icon}: Item)=>{
                                    if(!icon) {
                                        return(
                                            <Typography key={text} color={theme.palette.mode === "dark" ? theme.palette.primary[600] : theme.palette.primary[100] } sx={{margin:"2.25rem 0 1rem 3rem"}}>
                                                {text}
                                            </Typography>
                                        )
                                    }
                                    const lcText= text.toLowerCase()
                                    return (
                                        <ListItem key={text} disablePadding>
                                            <ListItemButton
                                                onClick={()=> {
                                                    navigate(`/${lcText}`)
                                                    setActive(lcText)
                                                }}
                                                sx={{
                                                    backgroundColor: active === lcText ? theme.palette.secondary[600] : "transparent",
                                                    color: active === lcText ? 
                                                        theme.palette.primary[600] : theme.palette.secondary[200]
                                                }}
                                            >
                                                <ListItemIcon
                                                    sx={{
                                                        marginLeft: "2rem",
                                                        color: active === lcText ? 
                                                        theme.palette.primary[600] : theme.palette.secondary[200]
                                                    }}
                                                >
                                                    {icon}
                                                </ListItemIcon>
                                                <ListItemText  primary={text}  />
                                                {
                                                    active === lcText && (
                                                        <ChevronRightOutlined sx={{ ml:"auto"}} />
                                                    )
                                                }
                                            </ListItemButton>
                                        </ListItem>
                                    )
                                })
                            }
                        </List>
                    </Box>
                    <Box mt={'auto'} position={'absolute'} bottom={'1rem'} left={0} right={0} >
                        <Divider />
                        <FlexBetween textTransform={"none"} gap={"1rem"} m="1.5rem 2rem 0 3rem" sx={{justifyContent:'flex-start'}}>
                        { isLoading ? ( 
                                <Box
                                component={"div"}
                                height={"40px"}
                                width={"40px"}
                                borderRadius={"50%"}
                                sx={{objectFit: "cover", margin:'auto'}}
                                
                                >
                                    <Loading/>
                                </Box>
                         ) :
                                (
                                <Box
                                component={"img"}
                                alt='profile'
                                src={profileImage}
                                height={"40px"}
                                width={"40px"}
                                borderRadius={"50%"}
                                sx={{objectFit: "cover"}}
                            />
                                )
                            }
                                <Box textAlign={"left"}>
                                    <Typography fontWeight={"bold"} fontSize={"0.9rem"} sx={{color:theme.palette.secondary["100"]}}>
                                        {user?.name}
                                    </Typography>
                                    <Typography fontSize={"0.8rem"} sx={{color:theme.palette.secondary["200"]}}>
                                        {user?.occupation || "-"}
                                    </Typography>
                                </Box>
                                    <SettingsOutlined
                                        sx={{color:theme.palette.secondary[300], fontSize:"25px"}}
                                    />
                            
                        </FlexBetween>

                    </Box>
                </Drawer>
    </Box>
  )
}

export default Sidebar
