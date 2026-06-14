// import the pi agent libaray and try make the serve so the calls do happens in the system;
import { createAgentSession } from "@earendil-works/pi-coding-agent";
import express from "express"
const app = express();
app.use(express.json);
async function Callmodel(promt:string){
    const result= await createAgentSession({})
    return result;
}

app.post("/chat" , (req , res)=>{
    const {promt} = req.body;
    Callmodel(promt);
})
// Registered current workspace checkouts at 2026-06-12 07:46:48

// Updated build documentation checkpoints at 2026-06-12 07:46:48

// Registered current workspace checkouts at 2026-06-12 07:46:48
