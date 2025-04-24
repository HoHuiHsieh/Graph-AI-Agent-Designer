/**
 * @fileoverview This file defines types for credentials used in the application, 
 * including OpenAI and PostgreSQL credentials.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { OpenAIConnectionProps, PostgreSQLConnectionProps } from "./api";


type BaseCredentialType = {
    type: string;
    credName: string;
}

export type OpenAICredentialType = BaseCredentialType & OpenAIConnectionProps & { type: "openai" };
export type PostgreSQLCredentialType = BaseCredentialType & PostgreSQLConnectionProps & { type: "postgresql" };;

export type CredentialType = {
    openai: OpenAICredentialType[];
    postgresql: PostgreSQLCredentialType[];
}