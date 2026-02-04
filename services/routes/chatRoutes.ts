//TODO 
//import gemini functtion
import { jsonMlabData, app, logMessage } from "../server.ts";

app.post("/chat", async (req, res) => {
    
    //get message from the request
    const { message } = req.body;

    //TODO call Mondli's gemini function with message and jsonData initialize it to "answer" askGemini(message, jsonMlabData);
    const answer = "This is a placeholder answer"; //replace this line with the gemini function call
    
    if(!answer || answer.toLocaleLowerCase().includes("escalated")){
        logMessage(message, "escalated");
        return res.json({ reply: "I will pass this query to our mLab support team and will get back to you via email." });
    } else {
        logMessage(message, "success");
        res.json({ reply: answer });
    }
});

app.post("/category", (req, res) => {

    const { category } = req.body;

    //TODO call Thembi's context gemini function with message and jsonData initialize it to "answer" askGemini(message, jsonMlabData)
    const answer = "This is a placeholder category answer"; //replace this line with the gemini function call

    logMessage(category, "category_used");
    return res.json({ reply: answer });
})
