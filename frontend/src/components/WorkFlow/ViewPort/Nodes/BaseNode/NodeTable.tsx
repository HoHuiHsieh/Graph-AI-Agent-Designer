/**
 * add draggable node table component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useState } from "react";
import { List, Typography, Divider, Collapse, ListItemButton, ListItemIcon, ListItemText, BoxProps } from "@mui/material";
import { draggableTypes } from "..";
import { ExpandLess, ExpandMore, Widgets } from "@mui/icons-material";


/**
 * draggable node table component
 * @returns 
 */
export default function NodeTable(): React.ReactNode {

    const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    const groupBy = (xs: any[], key: string) => {
        return xs.reduce((rv, x) => {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };
    const groupedItems: { [grpKey: string]: { key: string, children: (props: BoxProps) => React.ReactNode }[] } = groupBy(draggableTypes, "group");
    const [open, setOpen] = useState<string>("");
    const handleClick = (grpKey: string) => setOpen(grpKey);

    return (
        <div
            style={{
                display: "block",
                width: "100%",
                height: "100%",
                borderSpacing: 1,
            }}
        >
            <Typography
                variant="h3"
                textAlign="center"
                marginTop={2}
                marginBottom={1}
            >
                Node Items
            </Typography>
            <Divider />
            {
                Object.keys(groupedItems).map((grpKey, grpIndex) => (
                    <List key={`Group-${grpIndex}`}  >
                        <ListItemButton onClick={() => handleClick(grpKey)}>
                            <ListItemIcon>
                                <Widgets />
                            </ListItemIcon>
                            <ListItemText primary={grpKey} />
                            {open === grpKey ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse
                            in={open === grpKey}
                            timeout="auto"
                            unmountOnExit
                        >
                            <List
                                component="div"
                                disablePadding
                                sx={{ margin: 1 }}
                            >
                                {groupedItems[grpKey].map((Item, itemIndex) => (
                                    <Item.children
                                        key={`Item-${itemIndex}`}
                                        // component="div"
                                        draggable
                                        onDragStart={(e) => onDragStart(e, Item.key)}
                                        sx={{ margin: 1 }}
                                    />
                                ))}
                            </List>
                        </Collapse>
                    </List>
                ))
            }
        </div>
    )
}
