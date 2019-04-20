const rp = require('request-promise');

const sendMessage = (userID, keyboard, text) => {
    const options = {
        method: 'POST',
        uri: `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
        body: {
            'chat_id': userID,
            'text': text,
            'parse_mode': 'Markdown',
            'reply_markup': JSON.stringify({
                "keyboard": keyboard,
                "resize_keyboard": true,
            }),
            'disable_web_page_preview': true
        },
        json: true
    };
    return rp(options);
};

const sendMessageWithoutKeyboard = (userID, text) =>{
    const options = {
        method: 'POST',
        uri: `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
        body: {
            'chat_id': userID,
            'text': text,
            'parse_mode': 'Markdown',
            'disable_web_page_preview': true
        },
        json: true
    };
    return rp(options);
};

const sendInlineButton = (userID, text, urlButtonText, url) => {
    const options = {
        method: 'POST',
        uri: `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
        body: {
            'chat_id': userID,
            'text': text,
            'parse_mode': 'Markdown',
            'reply_markup': JSON.stringify({
                "inline_keyboard": [[{
                    "text": urlButtonText,
                    "url": url,
                }]],
            }),
            'disable_web_page_preview': true
        },
        json: true
    };
    return rp(options);
};

const sendInlineButtonCallbackType = (userID, text, buttonText, callback) => {
    const options = {
        method: 'POST',
        uri: `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
        body: {
            'chat_id': userID,
            'text': text,
            'parse_mode': 'Markdown',
            'reply_markup': JSON.stringify({
                "inline_keyboard": [[{
                    "text": text,
                    "callback": callback,
                }]],
            }),
            'disable_web_page_preview': true
        },
        json: true
    };
    return rp(options);
};



module.exports = {
    sendMessageWithoutKeyboard:sendMessageWithoutKeyboard,
    sendMessage: sendMessage,
    sendInlineButton: sendInlineButton,
    sendInlineButtonCallbackType: sendInlineButtonCallbackType
};
