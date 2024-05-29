const TelegramBot = require('node-telegram-bot-api');
const token = '7265667932:AAEuR8T-9hiUB8Mr2oj5ZB_Lrl2RjYFYpLU';
const bot = new TelegramBot(token, {polling: true});

let OWNER_CHAT_ID = null; // Мы получим это значение позже
const CARD_NUMBER = '2204 1201 0153 2774'; // Номер карты для оплаты
let dataMessage = ''; // Сообщение с данными, которое будет отправлять клиентам

// Функция для проверки владельца
function isOwner(chatId) {
    return chatId === OWNER_CHAT_ID;
}

let stats = {
    users: new Set(),
    tariffClicks: 0,
    tariffSelections: {
        '1 месяц': 0,
        '2 месяца': 0,
        '3 месяца': 0,
        '6 месяцев': 0,
        '1 год': 0
    },
    fioSubmissions: 0,
    confirmations: 0
};

const tariffs = {
    '1 месяц': 200,
    '2 месяца': 300,
    '3 месяца': 400,
    '6 месяцев': 700,
    '1 год': 1200
};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    stats.users.add(chatId);
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Узнать о тарифах', callback_data: 'tariffs' }]
            ]
        }
    };
    bot.sendMessage(chatId, '\t\t\*Доброго времени суток друзья!\*\n\n🍂 \*Здесь\* вы можете приобрести аккаунт \*Chat GPT с подпиской\*\n\n🍂 \*После покупки данного аккаунта, вы получаете:\*\n\n🌈 \*Лично созданный\* аккаунт Сhat GPT 4 (на сайте https://chat.openai.com)\n🌈 \*Гарантию\* на оплаченый период\n🌈 \*Оперативную поддержку\*, если у вас возникнут какие-либо вопросы.\n🌈 \*Приятный подарок за отличный отзыв!\*\n🌈 \*Редко\* бывают \*лимиты\*\n🌈 Данный аккаунт имеет возможность \*добавлять свои плагины\*\n\n🍂\*Что умеет CHATGPT 4.0 PLUS:\*\n🔥 Может \*решить\* любую \*задачу с университета\*\n🔥 Помогает составить \*бизнес-план\*\n🔥 \*Продающие текста\* для instagram, Telegram, VK.\n🔥 \*Сценарии для ваших видео\* на YouTube канале.\n🔥 \*Объясняет содержание\* сложного документа\n🔥 \*Пишет простенькие игры\* на различных языках программирования\n🔥 Превращает скетч веб-сайта \*в рабочий код\*\n🔥 И еще много чего.\n\n ❤️У нас самая сладкая и низкая цена. 😎\n\n\*НАЖМИТЕ КНОПКУ\* НИЖЕ, ЧТОБЫ УЗНАТЬ О \*ТАРИФНЫХ ПЛАНАХ\*.', {reply_markup: opts.reply_markup, parse_mode: 'Markdown'});
});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const username = query.message.chat.username || 'Неизвестный пользователь';

    if (query.data === 'tariffs') {
        stats.tariffClicks += 1;
        const opts = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '1 месяц', callback_data: '1_month' }],
                    [{ text: '2 месяца', callback_data: '2_months' }],
                    [{ text: '3 месяца', callback_data: '3_months' }],
                    [{ text: '6 месяцев', callback_data: '6_months' }],
                    [{ text: '1 год', callback_data: '1_year' }],
                    [{ text: 'Назад', callback_data: 'back' }]
                ]
            }
        };
        bot.editMessageText('Выберите тарифный план:', {chat_id: chatId, message_id: query.message.message_id, reply_markup: opts.reply_markup});
    } else if (query.data === 'back') {
        const opts = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Узнать о тарифах', callback_data: 'tariffs' }]
                ]
            }
        };
        bot.editMessageText('\t\t\*Доброго времени суток друзья!\*\n\n🍂 \*Здесь\* вы можете приобрести аккаунт \*Chat GPT с подпиской\*\n\n🍂 \*После покупки данного аккаунта, вы получаете:\*\n\n🌈 \*Лично созданный\* аккаунт Сhat GPT 4 (на сайте https://chat.openai.com)\n🌈 \*Гарантию\* на оплаченый период\n🌈 \*Оперативную поддержку\*, если у вас возникнут какие-либо вопросы.\n🌈 \*Приятный подарок за отличный отзыв!\*\n🌈 \*Редко\* бывают \*лимиты\*\n🌈 Данный аккаунт имеет возможность \*добавлять свои плагины\*\n\n🍂\*Что умеет CHATGPT 4.0 PLUS:\*\n🔥 Может \*решить\* любую \*задачу с университета\*\n🔥 Помогает составить \*бизнес-план\*\n🔥 \*Продающие текста\* для instagram, Telegram, VK.\n🔥 \*Сценарии для ваших видео\* на YouTube канале.\n🔥 \*Объясняет содержание\* сложного документа\n🔥 \*Пишет простенькие игры\* на различных языках программирования\n🔥 Превращает скетч веб-сайта \*в рабочий код\*\n🔥 И еще много чего.\n\n ❤️У нас самая сладкая и низкая цена. 😎\n\n\*НАЖМИТЕ КНОПКУ\* НИЖЕ, ЧТОБЫ УЗНАТЬ О \*ТАРИФНЫХ ПЛАНАХ\*.', {chat_id: chatId, message_id: query.message.message_id, reply_markup: opts.reply_markup, parse_mode: 'Markdown'});
    } else if (['1_month', '2_months', '3_months', '6_months', '1_year'].includes(query.data)) {
        const tariffKeyMap = {
            '1_month': '1 месяц',
            '2_months': '2 месяца',
            '3_months': '3 месяца',
            '6_months': '6 месяцев',
            '1_year': '1 год'
        };
        const tariffKey = tariffKeyMap[query.data];
        const price = tariffs[tariffKey];
        stats.tariffSelections[tariffKey] += 1;
        const opts = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Ввести данные', callback_data: `enter_fio_${tariffKey}` }],
                    [{ text: 'Назад', callback_data: 'tariffs' }]
                ]
            }
        };
        bot.editMessageText(`Вы выбрали тариф \*${tariffKey}\*. Цена: \*${price} рублей\*.\n\nДля оплаты переведите средства на карту:\n\n \`${CARD_NUMBER}\`  (Номер копируется).\n\nДля продолжения сделки \*отправьте\* свои \*последнние 4 цифры\* телефона или карты, \n\*которой будете оплачивать\*, для \* идентификации\*.`, {chat_id: chatId, message_id: query.message.message_id, reply_markup: opts.reply_markup, parse_mode: 'Markdown'});
    } else if (query.data.startsWith('enter_fio_')) {
        const tariffText = query.data.split('_').slice(2).join(' ');
        bot.deleteMessage(chatId, query.message.message_id - 1);
        bot.deleteMessage(chatId, query.message.message_id);
        bot.sendMessage(chatId, 'Введите ваши данные:');
        bot.once('message', (msg) => {
            const fio = msg.text;
            stats.fioSubmissions += 1;
            const opts = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'ДА', callback_data: `confirm_${tariffText}_${fio}` }],
                        [{ text: 'Назад', callback_data: `tariffs` }]
                    ]
                }
            };
            bot.sendMessage(chatId, 'Вы подтверждаете заказ? Нажмите "ДА", если вы уже отправили средства.', opts);
        });
    } else if (query.data.startsWith('confirm_')) {
        stats.confirmations += 1;
        const [_, tariffText, fio] = query.data.split('_');
        bot.sendMessage(chatId, 'Спасибо за подтверждение. Мы проверяем ваш платеж. Ожидайте, данные будут отправлены вам в ближайшее время.\n\n Если у вас не получается зайти на сайт, то испльзуйте VPN, либо свяжитесь с подджержкой.\n\nТехническая поддрежка: @gpt4o_support');
        if (OWNER_CHAT_ID) {
            const opts = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Отписать клиенту', callback_data: `reply_${chatId}` }],
                        [{ text: 'Отправить данные клиенту', callback_data: `senddata_${chatId}` }]
                    ]
                }
            };
            bot.sendMessage(OWNER_CHAT_ID, `Клиент @${username} (ID: ${chatId}) выбрал тариф: ${tariffText}. ФИО: ${fio}.`, opts);
        } else {
            bot.sendMessage(chatId, 'Владелец бота не настроен для получения уведомлений.');
        }
    } else if (query.data.startsWith('reply_')) {
        const targetId = query.data.split('_')[1];
        bot.sendMessage(OWNER_CHAT_ID, `/sendto ${targetId} `, {reply_markup: {force_reply: true}});
    } else if (query.data.startsWith('senddata_')) {
        const targetId = query.data.split('_')[1];
        if (dataMessage) {
            bot.sendMessage(targetId, dataMessage);
            bot.sendMessage(OWNER_CHAT_ID, `Данные отправлены пользователю с ID: ${targetId}`);
        } else {
            bot.sendMessage(OWNER_CHAT_ID, 'Сообщение с данными не установлено. Пожалуйста, установите его с помощью команды /setdata.');
        }
    }
});

// Получение OWNER_CHAT_ID через команду /setowner
bot.onText(/\/setowner/, (msg) => {
    const chatId = msg.chat.id;
    if (OWNER_CHAT_ID) {
        bot.sendMessage(chatId, `Владелец уже установлен. Его ID: ${OWNER_CHAT_ID}`);
    } else {
        OWNER_CHAT_ID = chatId;
        bot.sendMessage(OWNER_CHAT_ID, `Этот чат установлен как чат владельца. Ваш ID: ${OWNER_CHAT_ID}`);
    }
});

// Команда для отправки сообщения пользователю, доступна только владельцу
bot.onText(/\/sendto (\d+) (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    if (!isOwner(chatId)) {
        bot.sendMessage(chatId, 'У вас нет прав для выполнения этой команды.');
        return;
    }

    const targetId = match[1];
    const message = match[2];
    if (targetId && message) {
        sendMessageToUser(targetId, message);
        bot.sendMessage(chatId, `Сообщение отправлено пользователю с ID: ${targetId}`);
    } else {
        bot.sendMessage(chatId, 'Использование: /sendto <user_id> <message>');
    }
});

// Команда /stat для владельца, чтобы показывать статистику
bot.onText(/\/stat/, (msg) => {
    const chatId = msg.chat.id;
    if (!isOwner(chatId)) {
        bot.sendMessage(chatId, 'У вас нет прав для выполнения этой команды.');
        return;
    }

    const statsMessage = `Статистика:
- Количество пользователей: ${stats.users.size}
- Переходов к тарифам: ${stats.tariffClicks}
- Выбор тарифов:
  - 1 месяц: ${stats.tariffSelections['1 месяц']}
  - 2 месяца: ${stats.tariffSelections['2 месяца']}
  - 3 месяца: ${stats.tariffSelections['3 месяца']}
  - 6 месяцев: ${stats.tariffSelections['6 месяцев']}
  - 1 год: ${stats.tariffSelections['1 год']}
- Отправлено ФИО: ${stats.fioSubmissions}
- Подтверждений заказов: ${stats.confirmations}`;

    bot.sendMessage(chatId, statsMessage);
});

// Команда /setdata для владельца, чтобы установить сообщение с данными
bot.onText(/\/setdata (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    if (!isOwner(chatId)) {
        bot.sendMessage(chatId, 'У вас нет прав для выполнения этой команды.');
        return;
    }

    dataMessage = match[1];
    bot.sendMessage(chatId, 'Сообщение с данными установлено.');
});

// Пример отправки сообщения по ID
function sendMessageToUser(chatId, message) {
    if (chatId) {
        bot.sendMessage(chatId, message).catch(error => {
            console.error(`Ошибка при отправке сообщения пользователю ${chatId}:`, error);
        });
    } else {
        console.error('Ошибка: chat_id пустой или неопределенный');
    }
}

console.log('Bot is running...');
