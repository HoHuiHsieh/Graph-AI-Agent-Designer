import { Node } from "reactflow";

/**
 * 
 * @param name 
 * @param nodes 
 * @returns 
 */
export const getUnduplicatedName = (name: string, nodes: Node[]): string => {
    let newName = name;
    let i = 1;
    while (nodes.some((node) => node.data.name === newName)) {
        newName = `${name}(${i})`;
        i++;
    }
    return newName;
}