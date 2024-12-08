import bot from "../bot/bot.js";
import { adminChatId, folder } from "../const/const.js";
import fs from "fs";
import path from "path";
import axios from "axios";

class MainController {
  start(msg) {
    const chatId = msg.chat.id;

    if (adminChatId && chatId === adminChatId) {
      bot.sendMessage(chatId, "Привет, админ! Это GOIDA-бот.");
    } else {
      bot.sendMessage(
        chatId,
        "Это GOIDA-бот. Отправьте /random_goida, чтобы получить случайную GOIDA."
      );
    }
  }

  async getGoida(msg) {
    try {
      const goidaData = [];

      fs.readdirSync(folder).forEach((element) => {
        goidaData.push(element);
      });

      if (goidaData.length === 0) {
        return bot.sendMessage(msg.chat.id, "Папка пустая.");
      }

      const random = Math.floor(Math.random() * goidaData.length);
      const randomFile = goidaData[random];

      // Проверяем, является ли файл изображением
      const filePath = path.join(folder, randomFile);
      const fileExtension = path.extname(randomFile).toLowerCase();
      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];

      if (imageExtensions.includes(fileExtension)) {
        bot.sendPhoto(msg.chat.id, filePath);
      } else {
        bot.sendDocument(msg.chat.id, filePath);
      }
    } catch (error) {
      console.error(error);
      bot.sendMessage(msg.chat.id, "Произошла ошибка при получении данных.");
    }
  }

  async newGoida(msg) {
    const chatId = msg.chat.id;

    if (chatId !== +adminChatId) {
      return bot.sendMessage(chatId, "Вы не являетесь администратором.");
    }

    try {
      if (msg.document) {
        const fileId = msg.document.file_id;
        const fileName =
          msg.document.file_name ??
          `${Date.now()}.${msg.document.mime_type.split("/")[1]}`;

        const fileLink = await bot.getFileLink(fileId);

        const response = await axios({
          url: fileLink,
          method: "GET",
          responseType: "stream",
        });

        const filePath = path.join(folder, fileName);

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        writer.on("finish", () => {
          bot.sendMessage(chatId, `Файл успешно сохранен: ${fileName}`);
        });

        writer.on("error", (err) => {
          console.error(err);
          bot.sendMessage(chatId, "Произошла ошибка при сохранении файла.");
        });
      } else if (msg.photo && msg.photo.length > 0) {
        const photoIndex = Math.min(msg.photo.length - 1, 2);
        const photoFileId = msg.photo[photoIndex].file_id;

        if (!photoFileId) {
          return bot.sendMessage(chatId, "Фотография не найдена.");
        }

        const fileLink = await bot.getFileLink(photoFileId);

        const fileName = `${Date.now()}.jpg`;
        const filePath = path.join(folder, fileName);

        const response = await axios({
          url: fileLink,
          method: "GET",
          responseType: "stream",
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        writer.on("finish", () => {
          bot.sendMessage(chatId, `Фотография успешно сохранена: ${fileName}`);
        });

        writer.on("error", (err) => {
          console.error(err);
          bot.sendMessage(
            chatId,
            "Произошла ошибка при сохранении фотографии."
          );
        });
      } else {
        bot.sendMessage(chatId, "Пожалуйста, отправьте файл или фотографию.");
      }
    } catch (error) {
      console.error(error);
      bot.sendMessage(
        chatId,
        "Произошла ошибка при обработке файла или фотографии."
      );
    }
  }
}

export default new MainController();
