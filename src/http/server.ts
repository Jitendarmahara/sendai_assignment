import express from "express"
const app = express();
app.use(express.json());

app.get("/health" , (_req , res)=>{
    return res.json({
        ok:true,
        kubernates: "not checked yet",
        sandboxpodsready : 0
    })
})
app.use((req , res)=>{
    return res.status(404).json({
        error:"not found"
    })
})

app.listen(3000 , ()=>{
    console.log("Serve is running on port 3000")
})