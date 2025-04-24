/**
 * @fileoverview This file contains type definitions for API connection properties.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */

export type OpenAIModelPropsType = {
    model: string;
    max_completion_tokens?: number;
    top_p?: number;
    temperature?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    parallel_tool_calls?: boolean;
}

export type OpenAIConnectionProps = {
    apiKey: string;
    baseUrl: string;
};

export type OpenAICompletionProps = OpenAIConnectionProps & OpenAIModelPropsType;

export type PostgreSQLConnectionProps = {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
};