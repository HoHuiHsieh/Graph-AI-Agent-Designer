/**
 * @fileoverview This file contains utility functions to build tools for LangGraph.
 * It includes functions to create JavaScript, PostgreSQL, and HTTP tools.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { CodeToolDataType, HttpToolDataType, PostgreSQLToolDataType } from "../../../types/nodes";


/**
 * Helper function to build a tool schema from arguments.
 * @param args Record of argument definitions.
 * @returns Zod schema object.
 */
function buildSchemaFromArguments(
    args: Record<string, { type: string }>
): z.ZodObject<Record<string, z.ZodTypeAny>> {
    return z.object(
        Object.entries(args || {}).reduce((acc, [name, arg]) => {
            acc[name] = z[arg.type]();
            return acc;
        }, {} as Record<string, z.ZodTypeAny>)
    );
}

/**
 * Builds a JavaScript tool.
 * @param data CodeToolDataType object containing tool details.
 * @returns A tool instance.
 */
export function buildJSTool(data: CodeToolDataType) {
    return tool(() => data.name, {
        name: data.name,
        description: data.description,
        schema: buildSchemaFromArguments(data.arguments),
    });
}

/**
 * Builds a PostgreSQL tool.
 * @param data PostgreSQLNodeDataType object containing tool details.
 * @returns A tool instance.
 */
export function buildPostgreSQLTool(data: PostgreSQLToolDataType) {
    return tool(() => data.name, {
        name: data.name,
        description: data.description,
        schema: z.object({
            query: z.string().describe("SQL query to execute"),
        }),
    });
}

/**
 * Builds an HTTP tool.
 * @param data HTTPNodeDataType object containing tool details.
 * @returns A tool instance.
 */
export function buildHTTPTool(data: HttpToolDataType) {
    return tool(() => data.name, {
        name: data.name,
        description: data.description,
        schema: buildSchemaFromArguments(data.arguments),
    });
}
