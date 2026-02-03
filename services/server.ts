import express from "express";
import cors from "cors";
import fs from "fs";

export const app = express();

app.use(cors());
app.use(express.json());

const data = fs.readFileSync("./mlabData.json", "utf-8");
export const jsonMlabData = JSON.parse(data);


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

export function logMessage(message: string, status: string) {
    const log = {
        message,
        status,
        timestamp: new Date().toISOString()
    };
    fs.appendFileSync("chatlog.json", JSON.stringify(log) + "\n");

}

