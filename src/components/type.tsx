/**
 * @fileoverview This file defines the HandoffsEditor component, which is used to edit the handoffs of a node in a React Flow diagram.
 * 
 * @author: Hsieh,HoHui <billhsies@gmail.com>
 */
import { OpenAICredentialType, PostgreSQLCredentialType } from "../types/credential";

export const WINDOW_SIZE = ["xs", "sm", "md", "lg", "xl"] as const;
export type WindowSizeType = typeof WINDOW_SIZE[number];

export type CredentialsType = {
    openai: OpenAICredentialType[];
    postgresql: PostgreSQLCredentialType[];
    [key: string]: any;
};

export interface PanelStoreType {
    openPanel: any; // Consider replacing `any` with a more specific type
    setOpenPanel: React.Dispatch<React.SetStateAction<any>>;
    type: string;
    setType: React.Dispatch<React.SetStateAction<string>>;
    size: WindowSizeType;
    setSize: React.Dispatch<React.SetStateAction<WindowSizeType>>;
    openChatRoom: boolean;
    setOpenChatRoom: React.Dispatch<React.SetStateAction<boolean>>;
    credentials: CredentialsType;
    setCredentials: React.Dispatch<React.SetStateAction<CredentialsType>>;
    resultData: { json: any, messages: any[] };
    setResultData: React.Dispatch<React.SetStateAction<{ json: any, messages: any[] }>>;
}
