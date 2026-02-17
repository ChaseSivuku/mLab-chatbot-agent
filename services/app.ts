import express from "express";
import cors from "cors";
import fs from "fs";
import route from "./routes/chatRoutes.js";
import { getMlabData, jsonMlabData } from "./dataLoader.js";

const app = express();

app.use(cors());
app.use(express.json());

// Re-export jsonMlabData for any files that still use the legacy import
export { jsonMlabData };

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  app.use("/api", route);

  // Trigger the shared data promise — data is already loading from dataLoader import,
  // this just logs when it's ready without causing a second fetch
  getMlabData()
    .then(() => console.log("mLab Knowledge API data ready."))
    .catch((err) => console.error("Warning: Could not load mLab data:", err));
});

export function logMessage(message: string, status: string) {
  const log = {
    message,
    status,
    timestamp: new Date().toISOString(),
  };
  fs.appendFileSync("chatlog.json", JSON.stringify(log) + "\n");
}