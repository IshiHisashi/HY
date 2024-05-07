export const PORT = 5555;
import dotenv from "dotenv";
dotenv.config({ path: "../config.env" });

export const mongoURL = `mongodb+srv://hyOwner:${process.env.PASSWORD}@cluster0.zv2ldqx.mongodb.net/HY?retryWrites=true&w=majority&appName=Cluster0`;

console.log(process.env);
