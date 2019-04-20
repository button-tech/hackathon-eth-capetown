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


module.exports = {
    sendMessage: sendMessage,
    sendInlineButton: sendInlineButton,
    sendInlineButtonCallbackType: sendInlineButtonCallbackType
};
