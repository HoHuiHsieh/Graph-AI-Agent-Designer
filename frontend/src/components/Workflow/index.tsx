"use client";
/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useEffect } from "react";
import { ReactFlowProvider } from "reactflow";
import { getOptions } from "@/action/getOptions";
import Header from "./Header";
import ViewPort from "./ViewPort";


/**
 * @returns 
 */
export default function Main(): React.ReactNode {

    useEffect(() => {
        // check access-token
        getOptions()
            .then((value) => {
                sessionStorage.setItem("python_env", JSON.stringify(value.python_env));
                sessionStorage.setItem("chat_model", JSON.stringify(value.chat_model));
                sessionStorage.setItem("tool_model", JSON.stringify(value.tool_model));                
                sessionStorage.setItem("embd_model", JSON.stringify(value.embd_model));
                sessionStorage.setItem("asr_model", JSON.stringify(value.asr_model));
                sessionStorage.setItem("tts_model", JSON.stringify(value.tts_model));
            })
            .catch((error) => alert(error))
    }, [])

    return (
        <div style={{
            display: "block",
            width: "100%",
            height: "100%",
        }} >
            <ReactFlowProvider>
                <Header height="9vh" />
                <ViewPort height="91vh" />
            </ReactFlowProvider>
        </div>
    )
}