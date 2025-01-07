"use client";
/**
 * sidebar component with drawer functionality
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import * as React from "react";
import { CSSObject, styled, Theme } from "@mui/material/styles";
import { Drawer as MuiDrawer, List, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight, Logout } from "@mui/icons-material";
import { SIDEBAR_MENU } from "./constent";


const version = "1.1.0";

// maximum drawer width
const maxDrawerWidth = 250;

// opened drawer style
const openedMixin = (theme: Theme): CSSObject => ({
    width: maxDrawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

// closed drawer style
const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

// styled drawer
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
        width: maxDrawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        ...(open && {
            ...openedMixin(theme),
            "& .MuiDrawer-paper": openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            "& .MuiDrawer-paper": closedMixin(theme),
        }),
    }),
);

// styled drawer header
const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    height: "9vh",
    padding: theme.spacing(0, .25),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));


/**
 * sidebar component with drawer functionality
 * @param props 
 * @returns 
 */
export default function SideBar() {
    const [open, setOpen] = React.useState(false);

    const handleDrawer = () => setOpen((state: boolean) => {
        if (state == false) return true;
        else return false;
    })
    return (
        <Drawer
            variant="permanent"
            open={open}
        >
            <DrawerHeader>
                <IconButton
                    size="large"
                    onClick={handleDrawer}
                >
                    {open ?
                        <ChevronLeft fontSize="large" /> :
                        <ChevronRight fontSize="large" />
                    }
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List style={{ height: "81vh" }} >
                {SIDEBAR_MENU.map((item, index) => (
                    <ListItem key={index} disablePadding>
                        <Tooltip
                            title={<Typography variant="h5">{item.label}</Typography>}
                            placement="right-end"
                        >
                            <ListItemButton href={item.href} >
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                {open &&
                                    <ListItemText primary={
                                        <Typography variant="h4" align="left" >
                                            {item.label}
                                        </Typography>
                                    } />
                                }
                            </ListItemButton>
                        </Tooltip>
                    </ListItem>
                ))}
            </List>
            <List style={{ height: "10vh" }} >
                <ListItem disablePadding >
                    <Tooltip
                        title={<Typography variant="h5">Logout</Typography>}
                        placement="right-end"
                    >
                        <ListItemButton href="/web" >
                            <ListItemIcon>
                                <Logout fontSize="large" />
                            </ListItemIcon>
                            <ListItemText primary={
                                <Typography variant="h4" align="left" >
                                    Logout
                                </Typography>
                            } />
                        </ListItemButton>
                    </Tooltip>
                </ListItem>
                <ListItemText primary={
                    <Typography variant="h5" color="info" align="center" >
                        ver.{version}
                    </Typography>
                } />
            </List>
        </Drawer>
    );
}
