/**
 * @fileoverview This file contains the context provider for managing the state of the panel in the application.
 * 
 * @author: Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useContext, createContext, useState, ReactNode } from "react";
import { PanelStoreType, CredentialsType, WindowSizeType } from "./type";


export const initState: PanelStoreType = {
    openPanel: false,
    type: "",
    size: "md",
    setSize: () => { },
    setOpenPanel: () => { },
    setType: () => { },
    openChatRoom: false,
    setOpenChatRoom: () => { },
    credentials: {
        openai: [],
        postgresql: [],
    },
    setCredentials: () => { },
    resultData: { json: {}, messages: [] },
    setResultData: () => { },
};

const PanelStore = createContext<PanelStoreType>(initState);

/**
 * Custom hook to access the panel context.
 * @returns The context value.
 * @throws Will throw an error if used outside of the Provider.
 */
export function usePanel(): PanelStoreType {
    const context = useContext(PanelStore);
    if (!context) {
        throw new Error("usePanel must be used within a PanelProvider!");
    }
    return context;
}

/**
 * Context provider for managing panel state.
 * @param props - The props to pass to the provider.
 * @returns The provider component.
 */
export function PanelProvider(props: any): React.ReactNode {
    const [openPanel, setOpenPanel] = useState<any>(false);
    const [type, setType] = useState<string>("");
    const [size, setSize] = useState<WindowSizeType>("sm");
    const [openChatRoom, setOpenChatRoom] = useState(false);
    const [credentials, setCredentials] = useState<CredentialsType>({
        openai: [],
        postgresql: [],
    });
    const [resultData, setResultData] = useState<Map<string, any>>(new Map());

    return (
        <PanelStore.Provider value={{
            type,
            size,
            openPanel,
            setType,
            setSize,
            setOpenPanel,
            openChatRoom,
            setOpenChatRoom,
            credentials,
            setCredentials,
            resultData,
            setResultData,
        }} {...props} />
    );
}