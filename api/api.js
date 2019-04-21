require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const handlers = require('./handlers/handlers1');

app.use(cors());
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));

app.put('/api/create/:guid',  handlers.createAccount);
app.put('/api/transaction/:guid', handlers.createTransaction);

app.post('/api/walletAddress/:guid/:walletAddress', handlers.recordWalletAddress);

// Колбек, когда нужно пересоздать аккаунт после потерянного ключа
app.put('/api/recovery/create/:guid', handlers.createNewAccount);

// После того, как друг подписал сообщение, сюда подпись кидается
app.put('/api/recovery/recordSignature/:guid', handlers.recordSignature);

// После того, как веса друзьям поставили
app.put('/api/recovery/register/:guid', handlers.register);


app.get('/api/guid/lifetime/:guid', handlers.getGuidLifetime);
app.get('/api/signatures/:quid', handlers.getSignatures);
app.get('/api/guid/data/:guid', handlers.getDataByGuid);

app.listen(3000, () => {
    console.log('API listening 3000 port')
});
