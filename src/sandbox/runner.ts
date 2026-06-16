// we need a single function that does all the three things liek 
// acquire lease exex command release lese;

// the most importand thing is that the release should happen 
// in finally block either tool succeds or the tools fails;

import { acquireLease , releaseLease } from "../k8s/lease.ts";
import { execInPod } from "../k8s/exec.ts";
const EXEC_TIMEOUT_MS = 30_000;

export async function runInSandbox(requestId:string , sessionId:string , toolcallId:string , command: string[]):Promise<{pod:string , output:string}>{
    const pod = await acquireLease(requestId , sessionId , toolcallId);
    try{
        const output = await Promise.race([execInPod(pod , command) , 
            new Promise<never>((_ , reject)=>{
                setTimeout(()=>{
                    reject(new Error("TOOL_TIMEOUT"))
                },EXEC_TIMEOUT_MS)
            })
        ])
        return {pod ,output}
    }finally{
        await releaseLease(pod).catch(()=>{});
    }
}