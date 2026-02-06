import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load mlabData.json relative to this file's location
const dataPath = path.join(__dirname, "mlabData.json");
const data = fs.readFileSync(dataPath, "utf-8");
export const jsonMlabData = JSON.parse(data);

