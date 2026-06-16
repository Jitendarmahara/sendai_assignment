import { acquireLease } from "../k8s/lease";
import { podEvents } from "./events";
const MAX_WAIT_MS = 15_000;
interface QueueItem{
    toolCallId: string;
}
const queue: QueueItem[] = [];

export function waitForPos(requestId:string , sessionId:string , toolCallId:string):Promise<string>{
    return new Promise((resolve , reject)=>{
        const item: QueueItem = {toolCallId};
        queue.push(item);

        let settled = false;

        const cleanup = ()=>{
            const idx = queue.indexOf(item);
            if(idx !== -1) queue.splice(idx ,1);
            podEvents.off("released" , tryNext);
            clearTimeout(timer);
        };
        const try
    })
}