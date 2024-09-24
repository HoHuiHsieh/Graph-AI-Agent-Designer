"use client";
/**
 * workspace component with reactflow and workspace providers
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { ReactFlowProvider } from "reactflow";
import { WorkSpaceProvider } from "./provider";
import Header from "./header";
import ViewPort from "./ViewPort";


/**
 * workspace component with reactflow and workspace providers
 * @returns 
 */
export default function WorkSpace(): React.ReactNode {
    return (
        <ReactFlowProvider>
            <WorkSpaceProvider>
                <Header />
                <ViewPort />
            </WorkSpaceProvider>
        </ReactFlowProvider>
    )
}
