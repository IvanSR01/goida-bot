import dotenv from "dotenv";

dotenv.config();

const token = process.env.TOKEN;
const adminChatId = process.env.ADMIN_ID;
const folder = process.env.FOLDER 

export { token, adminChatId, folder };