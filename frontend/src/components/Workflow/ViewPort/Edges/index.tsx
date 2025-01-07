/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { EdgeTypes } from "reactflow";
import DefaultEdge from "./default";
import PipelineEdge from "./pipeline";



// edge components
export const edgeTypes: EdgeTypes = {
    default: DefaultEdge,
    tool: DefaultEdge,
    plan: DefaultEdge,
    pipeline: PipelineEdge,
};

