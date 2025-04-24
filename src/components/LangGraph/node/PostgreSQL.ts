/**
 * @fileoverview 
 * This file contains the implementation of the PostgreSQLNodeType function, 
 * which connects to a PostgreSQL database, executes a query, and updates the state.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import pg from "pg"
import { DATA_TYPES, PostgreSQLNodeDataType } from "../../../types/nodes";
import { MainStateType } from "../type";
import { CredentialType } from "../../../types/credential";
import { handleHandoffs } from "./handoff";
import { replacePlaceholders } from "../utils";
import { AIMessage, ToolMessage } from "@langchain/core/messages";


/**
 * Connects to a PostgreSQL database, executes a query, and updates the state.
 * 
 * @param state - The current state object to be updated.
 * @param data - The PostgreSQL connection and query details.
 * @returns The updated state object with the query result.
 * @throws Will throw an error if the connection or query execution fails.
 */
export function PostgreSQLNodeType(data: PostgreSQLNodeDataType, credentials: CredentialType) {
    const { name, type, credName, query, handoffs } = data;

    // Validate the type of the node
    if (type !== DATA_TYPES.POSTGRESQL) {
        throw new Error(`Invalid agent type: expected "${DATA_TYPES.POSTGRESQL}", received "${type}"`);
    }

    // Validate the PostgreSQL credentials
    const { host, port, database, user, password } = credentials.postgresql.find((cred) => cred.credName === credName);
    if (!host || !port || !database || !user || !password) {
        throw new Error(`Invalid PostgreSQL credentials: ${credName}`);
    }

    return async (currentState: MainStateType) => {
        // Validate the database type
        if (type !== "postgresql") {
            throw new Error(`Invalid type: expected "postgresql", received "${type}"`);
        }

        // Replace placeholders in the query with values from the current state
        // This allows dynamic queries based on the current state
        const updatedQuery = replacePlaceholders(query, currentState);

        // client connection
        const client = new pg.Client({
            host,
            port,
            database,
            user,
            password,
        });

        let result: pg.QueryResult<any>, errorResult: string;

        try {
            // Establish a connection to the PostgreSQL database
            await client.connect();

            // Execute the provided SQL query
            result = await client.query(updatedQuery);

        } catch (error) {
            // Throw a detailed error message if the query fails
            errorResult = `Failed to execute query on PostgreSQL: ${error instanceof Error ? error.message : String(error)}`;

        } finally {
            // Ensure the client connection is closed to prevent resource leaks
            try {
                await client.end();
            } catch (closeError) {
                console.error(`Failed to close PostgreSQL client: ${closeError instanceof Error ? closeError.message : String(closeError)}`);
            }
        }

        // Return the updated state
        const tool_call_id = crypto.randomUUID();
        const updatedState = {
            messages: [
                ...currentState.messages,
                new AIMessage({
                    content: "Connecting to a PostgreSQL database...",
                    tool_calls: [{
                        id: tool_call_id,
                        name: name,
                        args: {
                            query: updatedQuery,
                        }
                    }]
                }),
                new ToolMessage({
                    tool_call_id: tool_call_id,
                    content: `PostgreSQL query result: ${errorResult || JSON.stringify(result.rows)}`
                })
            ],
            json: {
                ...currentState.json,
                [name]: errorResult || JSON.stringify(result.rows),
            }
        };

        // Process handoffs if any
        return handleHandoffs(handoffs, name, updatedState, credentials)
    }
}
