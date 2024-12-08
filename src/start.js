import bot from "./bot/bot.js";
import mainController from "./controllers/main.controller.js";

let isGetGoida = false

bot.onText(/\/start/, mainController.start)
bot.onText(/\/random_goida/, mainController.getGoida)
bot.onText(/\/new_goida/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Отправте фото или файл')
    isGetGoida = true
})
bot.on('message', (msg) => {
    if (isGetGoida) mainController.newGoida(msg)
    isGetGoida = false
    return;
})