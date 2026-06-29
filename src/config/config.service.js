import dotenv from "dotenv";
import {resolve} from "node:path";


export const NODE_ENV = process.env.NODE_ENV || "development";

const envPath = {
    development:"dev.env",
    production:"prod.env"
}

dotenv.config({path:resolve(`./src/config/${envPath.development}`)})

export const PORT = process.env.PORT;
export const DB_URI = process.env.DB_URI;
export const SALT_ROUNDS = process.env.SALT_ROUNDS;
export const ENC_KEY = process.env.ENC_KEY;