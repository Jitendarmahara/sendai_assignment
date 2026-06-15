import express from "express"
import { coreApi } from "../k8s/client.ts";
const app = express();
app.use(express.json());

app.get("/health" , async (_req , res)=>{
    try{
        const response = await coreApi.listNamespacedPod({
            namespace:"pi-agent",
            labelSelector: "app=sandbox-runner"
        });
        const readypodsonly = response.items.filter((x)=>{
            return x.status?.phase === 'Running'
        })
        res.json({
            ok: true,
            kubernetes: "connected",
            sandboxPodsReady: readypodsonly.length
        })
    }catch(e){
        console.error("K8s error:", e);
        res.status(500).json({
            ok:false,
            kubernetes:"disconnected",
            sandboxPodsReady: 0
        })
    }
})
app.use((req , res)=>{
    return res.status(404).json({
        error:"not found"
    })
})

app.listen(3000 , ()=>{
    console.log("Serve is running on port 3000")
})