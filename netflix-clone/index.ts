import dotenv from "dotenv";
dotenv.config();
import { getApiKey } from "./lib/tmdb.ts";

console.log(
    "API key loaded:",
    getApiKey().slice(0, 4) + "****"
);