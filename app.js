const express = require("express");
const path = require('path');
const app = express();
const fs = require('fs');

const { getData, setData, getSingleData, deleteArticle, setDataFromRequest } = require("./mongo.js");

app.use(express.static(path.join(__dirname, 'pages')));

app.get("/", function (request, response) {
    response.sendFile(path.join(__dirname, "pages",  "index.html"));
});

app.get("/detail", async (request, response) => {

    fs.readFile(path.join(__dirname, "pages",  "detail.html"), async function(error, data){
                  
        if (error) {
            response.statusCode = 500;
            response.end("Server error");
        }
        else {
            var article = await getSingleData(request.query.id)

            var middleScore = 0;
            var counterI = 0;
            

            if (Array.isArray(article.reviews)) {
                article.reviews.forEach(review => {
                    middleScore += review.score;
                    counterI += 1;
                });
            }
            
            const dataText = data.toString().replace(/{name}/g, article.name)
            .replace(/{content}/g, article.content)
            .replace(/{reviews_count}/g, counterI)
            .replace(/{score}/g, Math.ceil(middleScore / counterI))
            .replace(/{_id}/g, article._id);

            response.end(dataText);
        }
    })
});

app.get('/getFile', async (request, response) => {
    const filePath = path.join(__dirname, "pages", "data", request.query.fileName); 

    var result = await getData();

    if (result.length <= 0) {
        await setData(filePath)

        const jsonData = JSON.parse(fs.readFileSync(filePath));
        response.json(jsonData);
    } else {
        response.status(304).end();    
    }
});

app.get("/getFullArticle", async (request, response) => {
    var result = await getSingleData(request.query.id);
    
    response.json(result);
});

app.get("/deleteArticle", async (request, response) => {
    var result = await deleteArticle(request.query.id);
    
    response.status(200).json(result);
});

app.get('/getActualArticlesState', async (request, response) => {
    var result = await getData();

    if (result.length != 0) {
        response.json(result);
    } else {
        response.json(JSON.parse("[]"));
    }
});

app.get('/addNew', async (request, response) => {
    response.sendFile(path.join(__dirname, "pages", "addNew.html"));
});

app.get('/addNewArticle', async (request, response) => {
    try {
        await setDataFromRequest(request.query.head, request.query.author, request.query.content);
        response.status(200).end(); 
    }
    catch {
        response.status(404).end(); 
    }
});


app.listen(3000, "127.0.0.1");
console.log("Сервер запущен на порту 3000");