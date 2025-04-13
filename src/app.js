const express = require("express");
const app = express();


// this will only handle get call to /user
// /^\/ab?c$/ -> regex--to accept abc ac , basically b is optional
// /^\/ab+c$/ -> abc, abbc, abbbc, match the previous pattern then it works
// /^\/ab.*cd$/ -> Anything (0 or more of any characters)	/abcd ✅	/ab123cd ✅/abBHAVIKcd ✅ /abHelloWorldcd ✅
// /^\/a(bc)?d$/ -> bc is optional
// /^\/a(bc)+d$/ 


app.get("/user/:userId/:name/:password",(req,res)=>{ 
    console.log(req.query);
    console.log(req.params);

    
    res.send({
        firstname: "Bhavik",
        lastname:"Bhuva"
    })
})








app.listen(3000, () => {
    console.log("Server is running on port 3000");
});