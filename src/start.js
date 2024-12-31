import bot from "./bot/bot.js";
import mainController from "./controllers/main.controller.js";

let isGetGoida = false;
let isRemoveGoida = false;
let isSpecialGoida = false;
bot.onText(/\/start/, mainController.start);
bot.onText(/\/random_goida/, mainController.getGoida);
bot.onText(/\/new_goida/, (msg) => {
  bot.sendMessage(msg.chat.id, "Отправте фото или файл");
  isGetGoida = true;
});
bot.onText(/\/remove_goida/, (msg) => {
  bot.sendMessage(msg.chat.id, "Введите название файла");
  isRemoveGoida = true;
});

bot.onText(/\/special_goida/, (msg) => {
  bot.sendMessage(msg.chat.id, "Введите название файла и chat_id");
  isSpecialGoida = true;
});

bot.on("message", (msg) => {
  if (isGetGoida) mainController.newGoida(msg);
  if (isRemoveGoida) mainController.removeGoida(msg);
  if (isSpecialGoida) mainController.sendSpecialGoida(msg);
  isGetGoida = false;
  isRemoveGoida = false;
  return;
});
