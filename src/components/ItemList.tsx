/**
 * @fileoverview This file defines the `ItemList` component, which renders a Material-UI `Drawer` containing a list of items. 
 * Each item can be added as a node to a React Flow diagram by clicking on it. The component uses React Flow hooks 
 * to manage the addition of nodes and their positioning within the diagram.
 * 
 * The `ItemList` component is styled using Material-UI's `styled` utility and integrates with React Flow's state management.
 * It also includes utility functions for generating random positions and unique node IDs.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useCallback } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Drawer, IconButton, styled, Typography, useTheme } from "@mui/material";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { ChevronLeft, ChevronRight, ExpandMore } from "@mui/icons-material";
import { useReactFlow, useStoreApi } from "reactflow";
import { DATA_TYPES, NODE_TYPES } from "../types/nodes";
import { itemList, ItemType } from "./ReactFlow/compoments";
import { v4 as randomUUID } from "uuid";
import { getUnduplicatedName } from "./utils";


const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
}));

interface ItemListProps {
    open: boolean;
    handleDrawerClose: () => void;
}

/**
 * Generates a random integer between the specified min and max values (inclusive).
 * 
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns A random integer between min and max.
 */
function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * The `ItemList` component renders a Material-UI `Drawer` containing a list of items.
 * Each item can be added as a node to a React Flow diagram by clicking on it.
 * 
 * @param props - The component props.
 * @returns A React node representing the `ItemList` component.
 */
export default function ItemList(props: ItemListProps): React.ReactNode {
    const { open, handleDrawerClose } = props;
    const theme = useTheme();
    const { getNodes, setNodes, screenToFlowPosition } = useReactFlow();
    const store = useStoreApi();

    /**
     * Handles adding a new node to the React Flow diagram.
     * 
     * @param item - The item to be added as a node.
     */
    const handleAddNode = useCallback((item: ItemType["items"][0]) => {
        const { data } = item;

        // Check if the chat node already exists
        const existingChatNode = getNodes().filter((node) => node.type === NODE_TYPES.FLOWPOINT && node.data.type === DATA_TYPES.CHAT);
        if (existingChatNode.length > 0 && data.type === DATA_TYPES.CHAT) {
            alert("Chat node already exists.");
            return;
        }

        // Random position generation
        const { domNode } = store.getState();
        const boundingRect = domNode?.getBoundingClientRect();
        let position = { x: 0, y: 0 };
        if (boundingRect) {
            const center = screenToFlowPosition({
                x: boundingRect.x + boundingRect.width / 2,
                y: boundingRect.y + boundingRect.height / 2,
            });
            position = {
                x: center.x + randomInt(-50, 50),
                y: center.y + randomInt(-50, 50),
            };
        }

        // add node to the React Flow diagram
        setNodes((nodes) => {
            const name = getUnduplicatedName(data.name, nodes);
            return [
                ...nodes,
                {
                    id: `${item.type}-${data.type}-${randomUUID().toString().replace(/-/g, "")}`,
                    type: item.type,
                    data: {
                        type: data.type,
                        name: name,
                        ...data.defaultData
                    },
                    position: position,
                    style: item.style,
                },
            ];
        });
    }, [store, screenToFlowPosition, setNodes]);

    // State for managing the expanded accordion panel
    const [expanded, setExpanded] = React.useState<string | false>('0');

    /**
     * Handles the expansion state of the accordion panels.
     * 
     * @param panel - The panel identifier.
     * @returns A function to toggle the expansion state.
     */
    const handleChange = (panel: string) => (
        event: React.SyntheticEvent,
        isExpanded: boolean
    ) => setExpanded(isExpanded ? panel : false);

    return (
        <Drawer anchor="right" open={open} onClose={handleDrawerClose}>
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronLeft /> : <ChevronRight />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <React.Fragment>
                {itemList.map((sec, index) => (
                    <Accordion
                        key={index}
                        expanded={expanded === `${index}`}
                        onChange={handleChange(`${index}`)}
                    >
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography component="span" sx={{ width: '33%', flexShrink: 0 }}>
                                {sec.title}
                            </Typography>
                            <Typography component="span" sx={{ color: 'text.secondary' }}>
                                {sec.subtitle}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                {sec.items.map((item) => (
                                    <ListItem key={item.label} disablePadding>
                                        <ListItemButton onClick={() => handleAddNode(item)}>
                                            <ListItemIcon>{item.icon}</ListItemIcon>
                                            <ListItemText primary={item.label} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                                <Divider />
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </React.Fragment>
        </Drawer>
    );
}