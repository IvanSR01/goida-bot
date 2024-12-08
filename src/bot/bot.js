import TelegramBot from "node-telegram-bot-api";
import { token } from "../const/const.js";

export default new TelegramBot(token, {
    polling: true,
    request: {
        agentClass: null,
        agentOptions: {
            keepAlive: true,
        },
    },
})