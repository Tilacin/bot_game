const TelegramApi = require("node-telegram-bot-api");
const token = BOT_TOKEN;

const bot = new TelegramApi(token, { polling: true });

let initialArray = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
  42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
  61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
  80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98,
  99, 100,
];

let mutableArray = [...initialArray];
let hiddenNumber;
let attemptsNumber = 1;
const chats = {};

const gameOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: "да", callback_data: "1" },
        { text: "нет", callback_data: "2" },
      ],
    ],
  }),
};
const userAnswer = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: "-", callback_data: "-" },
        { text: "+", callback_data: "+" },
        { text: "угадал", callback_data: "yes" },
      ],
    ],
  }),
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Получить имя пользователя" },
    { command: "/game", description: "Играть" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp"
      );
      return bot.sendMessage(
        chatId,
        `Добро пожаловать в игру ${msg.from.first_name}`
      );
    }
    if (text === "/info") {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
    }
    if (text === "/game") {
      await bot.sendMessage(
        chatId,
        `Загадай число от 1 до 100. Я могу его отгадать максимум за восемь попыток. Только после каждой попытки ты будешь писать больше твоё число чем я назвал или меньше. Если твоё число больше, нажимай '+', а если меньше, то нажимай '-'. Если угадал, то нажимай 'угадал'`
      );

      return bot.sendMessage(chatId, "Загадал, играем?", gameOptions);
    }
    return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй ещё раз!");
  });
  bot.on("callback_query", (msg) => {
    let numberSlice = parseInt(mutableArray.length / 2);
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "1") {
      mutableArray = [...initialArray];

      bot.sendMessage(
        chatId,
        `50     попытка: ${(attemptsNumber = 1)}`,
        userAnswer
      );
    }

    if (data === "+") {
      mutableArray = mutableArray.slice(numberSlice);
      hiddenNumber = mutableArray[parseInt(numberSlice / 2)];

      bot.sendMessage(
        chatId,
        `${hiddenNumber}    попытка: ${++attemptsNumber}  `,
        userAnswer
      );
    }
    if (data === "-") {
      mutableArray = mutableArray.slice(0, numberSlice);
      hiddenNumber = mutableArray[parseInt(numberSlice / 2)];

      bot.sendMessage(
        chatId,
        `${hiddenNumber}     попытка: ${++attemptsNumber}   `,
        userAnswer
      );
    }
    if (data === "yes") {
      bot.sendMessage(
        chatId,
        `загадано число ${hiddenNumber},  угадал с попытки: ${attemptsNumber}`
      );
    } else if (data === "2") {
      bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/848/be3/848be3f5-be18-426f-8d6a-18ff7f5224cb/6.webp"
      );
      return;
    }
  });
};

start();
