import dotenv from "dotenv";
import {resolve} from "node:path";


export const NODE_ENV = process.env.NODE_ENV || "development";

const envPath = {
    development:"dev.env",
    production:"prod.env"
}

dotenv.config({path:resolve(`./src/config/${envPath[NODE_ENV]}`)})

export const PORT = process.env.PORT;
export const DB_URI = process.env.DB_URI;
export const SALT_ROUNDS = process.env.SALT_ROUNDS;
export const ENC_KEY = process.env.ENC_KEY;
export const ACCESS_TOKEN_USER_SECRET = process.env.ACCESS_TOKEN_USER_SECRET;
export const ACCESS_TOKEN_ADMIN_SECRET = process.env.ACCESS_TOKEN_ADMIN_SECRET;
export const ACCESS_TOKEN_USER_EXPIRATION = process.env.ACCESS_TOKEN_USER_EXPIRATION;
export const ACCESS_TOKEN_ADMIN_EXPIRATION = process.env.ACCESS_TOKEN_ADMIN_EXPIRATION;
export const REFRESH_TOKEN_USER_SECRET = process.env.REFRESH_TOKEN_USER_SECRET;
export const REFRESH_TOKEN_ADMIN_SECRET = process.env.REFRESH_TOKEN_ADMIN_SECRET;
export const REFRESH_TOKEN_USER_EXPIRATION = process.env.REFRESH_TOKEN_USER_EXPIRATION;
export const REFRESH_TOKEN_ADMIN_EXPIRATION = process.env.REFRESH_TOKEN_ADMIN_EXPIRATION;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;