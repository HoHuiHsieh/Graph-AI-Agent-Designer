/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useCallback, useState } from "react";
import { AddCircleOutlineRounded } from "@mui/icons-material";
import { Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Typography } from "@mui/material";
import { useReactFlow } from "reactflow";
import { nodeItems, defaultData } from "./Nodes";


/**
 * 
 * @returns 
 */
export default function NodeMenuButton(): React.ReactNode {
    const { setNodes } = useReactFlow();

    // handle open menu
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleOpen = useCallback<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        setAnchorEl(event.currentTarget)
    }, [setAnchorEl]);
    const handleClose = useCallback(() => {
        setAnchorEl(null)
    }, [setAnchorEl]);

    // handle add node
    const handleAddNode = useCallback((event: React.MouseEvent<HTMLLIElement, MouseEvent>, name: string) => {
        if (name in defaultData) {
            let position = { x: 0, y: 0 };
            setNodes((nodes) => ([...nodes, defaultData[name]({ position })]));
        }
        handleClose();
    }, [setNodes, handleClose]);

    return (
        <div>
            <IconButton id="node-menu-button"
                sx={{
                    position: "absolute",
                    right: "2rem",
                    bottom: "2rem",
                    '&:hover': { boxShadow: "10px" },
                    boxShadow: "5px"
                }}
                onClick={handleOpen}
            >
                <AddCircleOutlineRounded
                    fontSize="large"
                    sx={{
                        fill: "red",
                        transform: "scale(1.5)",
                        margin: 0,
                        padding: 0,
                    }}
                />
            </IconButton>
            <Menu id="node-menu-list"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "node-menu-button"
                }}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <MenuList>
                    {nodeItems.map((node, index) =>
                        node.key ?
                            <MenuItem key={node.key}
                                disabled={Boolean(node?.disabled)}
                                onClick={(event) => handleAddNode(event, node.key)}
                            >
                                <ListItemIcon>{node.icon}</ListItemIcon>
                                <ListItemText>{node.label}</ListItemText>
                            </MenuItem>
                            :
                            <Divider key={index} />
                    )}
                </MenuList>

            </Menu>
        </div>
    )

}