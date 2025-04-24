/**
 * @fileoverview 
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */

import { Node } from "reactflow";

/**
 * NodeComponentClass is a base class for creating node components in a graph.
 */
export class NodeComponentClass {
    label: string;
    type: string;
    icon: React.ReactNode;
    form: React.ReactNode;
    defaultData: any;

    /**
     * Checks for duplicate node names within a given list of nodes and generates 
     * a unique name by appending a numeric suffix if necessary.
     *
     * @param name - The initial name to check for duplicates.
     * @param nodes - An array of nodes to check against for duplicate names.
     * @returns A unique name that does not conflict with existing node names.
     */
    checkDuplicateAndReName(name: string, nodes: Node[]): string {
        const names = nodes.map((node) => node.data.name);
        let newName = name;
        let count = 1;
        while (names.includes(newName)) {
            newName = `${name} (${count})`;
            count++;
        }
        return newName;
    }
}