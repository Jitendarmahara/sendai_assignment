import { coordinationApi } from "./client.ts";
import {v4 as uuidv4} from "uuid";

const NAMESPACE = 'pi-agent';
const PODS = Array.from({length:8} , (_ , i)=>`sandbox-runner-${i}`)
const LEASE_DURATION = 45;
const INSTANCE_ID  = uuidv4();
export async function acquireLease(requestId:string , sessionId:string , toolcallId: string):Promise<string>{
    const holderIdentity = `${INSTANCE_ID}:${requestId}:${sessionId}:${toolcallId}`
    for(const pod of PODS){
        try{
            const lease = await coordinationApi.readNamespacedLease({
                name: pod,
                namespace: NAMESPACE
            });

            const holder = lease.spec?.holderIdentity;
            const acquireTime = lease.spec?.acquireTime;
            const duration = lease.spec?.leaseDurationSeconds?? LEASE_DURATION;
            const isExpired = !holder || !acquireTime || Date.now() - new Date(acquireTime as unknown as string).getTime() > duration * 1000;

            if(isExpired){
                lease.spec = {
                    ... lease.spec,
                    holderIdentity,
                    acquireTime : new Date() as any,
                    renewTime: new Date() as any,
                    leaseDurationSeconds:LEASE_DURATION
                };
                await coordinationApi.replaceNamespacedLease({
                    name:pod,
                    namespace:NAMESPACE,
                    body: lease
                })

                return pod;
            }

        }
        catch(e:any){
            if(e?.statusCode === 409)continue;
            throw e;
        }
    } 
    throw new Error("NO_POD_AVAILABLE")
}
export async function releaseLease(pod:string):Promise<void>{
    const lease  = await coordinationApi.readNamespacedLease({
        name:pod,
        namespace:NAMESPACE
    });
    lease.spec = {
        ...lease.spec,
        holderIdentity:undefined,
        acquireTime: undefined,
        renewTime : undefined
    };

    await coordinationApi.replaceNamespacedLease({
        name:pod,
        namespace:NAMESPACE,
        body: lease,
    });
}