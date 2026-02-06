import express from "express";
import cors from "cors";
import fs from "fs";
import route from "./routes/chatRoutes.js";
import { jsonMlabData } from "./dataLoader.js";

const app = express();

app.use(cors());
app.use(express.json());

// Re-export jsonMlabData 
export { jsonMlabData };

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  app.use("/api",route);
//   if(!fs.existsSync("chatlog.json")){
//     fs.writeFileSync("chatlog.json", "");
//   }
//   if(!jsonMlabData){
//     console.error("Critical Error: mlabData.json is missing or invalid.");
//     process.exit(1);
//   }
});

export function logMessage(message: string, status: string) {
  const log = {
    message,
    status,
    timestamp: new Date().toISOString(),
  };
  fs.appendFileSync("chatlog.json", JSON.stringify(log) + "\n");
}
