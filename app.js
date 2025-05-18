const express = require("express");
const path = require('path');
const app = express();
const fs = require('fs');

const { getData, setData } = require("./mongo.js");

app.use(express.static(path.join(__dirname, 'pages')));

app.get("/", function (request, response) {

    response.sendFile(path.join(__dirname, "pages",  "taskOne.html"));

    require("./mongo.js").startMongoDataBase();
});

app.get('/getFile', async (request, response) => {
    const filePath = path.join(__dirname, "pages", "data", request.query.fileName); 
    
    if (getData().length <= 0) {
        await setData(filePath)
    } 

    try {
        const jsonData = JSON.parse(fs.readFileSync(filePath));
        response.json(jsonData); 
    }
    catch (parseError) {
        response.status(500).send('Ошибка сервера: неверный формат JSON');
    }
});

app.listen(3000, "127.0.0.1");
console.log("Сервер запущен на порту 3000");