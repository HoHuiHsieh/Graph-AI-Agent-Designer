/**
 * @author HoHui Hsieh
 */
import { Node } from "reactflow";
import { DynamicNodeAction, InputData, Message } from "./base";
import moment from "moment";


interface Output {
    instruction: Message[],
    function?: {
        name: string,
        arguments: { [key: string]: any }
    }
}

/**
 * 
 */
export default class ChatRoomAPIAction extends DynamicNodeAction {

    functions: {
        name: string,
    }[]
    apis: {
        [func: string]: {
            resetChat: {
                label: string,
                checked: boolean,
            },
            showImage: {
                label: string,
                checked: boolean,
            },
            showVideo: {
                label: string,
                checked: boolean,
            },
        },
    }
    input: InputData = {};
    output: Output = {
        instruction: [],
        function: undefined,
    };

    constructor(node: Node) {
        super(node);

        this.functions = node.data.functions;
        for (let index = 0; index < this.functions.length; index++) {
            const func = this.functions[index];
            if (!func.name) { throw new Error("'function.name' is required.") }
        }

        this.apis = node.data.apis;
        let keys = Object.keys(this.apis);
        for (let index = 0; index < keys.length; index++) {
            const func = this.apis[keys[index]];
            if (!func.resetChat) { throw new Error("'resetChat' api is required.") }
            if (!func.resetChat.label) { throw new Error("'resetChat.label' is required.") }
            if (!(typeof func.resetChat.checked === "boolean")) { throw new Error("'resetChat.checked' is required.") }
            if (!func.showImage) { throw new Error("'showImage' api is required.") }
            if (!func.showImage.label) { throw new Error("'showImage.label' is required.") }
            if (!(typeof func.showImage.checked === "boolean")) { throw new Error("'showImage.checked' is required.") }
            if (!func.showVideo) { throw new Error("'showVideo' api is required.") }
            if (!func.showVideo.label) { throw new Error("'showVideo.label' is required.") }
            if (!(typeof func.showVideo.checked === "boolean")) { throw new Error("'showVideo.checked' is required.") }
        }
    }

    /**
     * 
     */
    async action(sources: DynamicNodeAction[]): Promise<ChatRoomAPIAction> {
        let t0 = performance.now();

        // check state
        if (this.checkCompleted()) { return this }
        if (sources.some(e => !e.checkCompleted())) { return this }

        // check inputs
        this.input = this.mergeSources(sources.map(e => e?.output || {}));
        if (!this.input.function) {
            // no calling for no function
            this.output.instruction = [];
            this.setCompleted();
            return this
        }
        if (!this.input.function.name) {
            // no calling for no function
            this.output.instruction = [];
            this.setCompleted();
            return this
        }

        // update node data
        const name = this.input.function.name;
        if (!(name in this.apis)) { throw new Error("Function name not found.") }

        switch (true) {

            case this.apis[name].showImage?.checked:
                let imgsrc = this.input.function.arguments?.src;
                if (!imgsrc) { break; }
                this.output.instruction = [
                    {
                        role: "user",
                        content: `Image URL (${imgsrc}) is opened in new tab.`,
                        timestamp: moment().format("HH:mm"),
                        elapsed_time: performance.now() - t0,
                    },
                    {
                        role: "assistant",
                        content: "",
                        timestamp: moment().format("HH:mm"),
                        elapsed_time: performance.now() - t0,
                    },
                ]
                this.output.function = {
                    name: "showImage",
                    arguments: { src: imgsrc },
                }
                break;

            case this.apis[name].showVideo?.checked:
                let video_src = this.input.function.arguments?.src;
                if (!video_src) { break; }
                this.output.instruction = [
                    {
                        role: "user",
                        content: `Video URL (${video_src}) is opened in new tab.`,
                        timestamp: moment().format("HH:mm"),
                        elapsed_time: performance.now() - t0,
                    },
                    {
                        role: "assistant",
                        content: "",
                        timestamp: moment().format("HH:mm"),
                        elapsed_time: performance.now() - t0,
                    },
                ]
                this.output.function = {
                    name: "showVideo",
                    arguments: { src: video_src },
                }
                break;

            case this.apis[name].resetChat?.checked:
                this.output.instruction = [
                    {
                        role: "user",
                        content: "Restarting the conversation.",
                        timestamp: moment().format("HH:mm"),
                        elapsed_time: performance.now() - t0,
                    },
                    {
                        role: "assistant",
                        content: "",
                        timestamp: moment().format("HH:mm"),
                        elapsed_time: performance.now() - t0,
                    },
                ]
                this.output.function = {
                    name: "resetChat",
                    arguments: {},
                }
                break;

            default:
                break;
        }

        this.setCompleted()
        return this
    }

}