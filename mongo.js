const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(url);
mongoClient.connect();
const fs = require('fs').promises;

function startMongoDataBase() {
    mongoClient.connect().then(mongoClient => {
        console.log("Подключение установлено");
        console.log(mongoClient.options.dbName);
    });  
}

async function getData() {
    try {
        const db = mongoClient.db("Lab2DB");
        const collection = db.collection("articles");
        const results = await collection.find().toArray();
        return results;

    } catch (err) {
        console.log(err);
        return [];
    }
}

async function setData(filePath) {
    try {
        const db = mongoClient.db("Lab2DB");
        const collection = db.collection("articles");
        const articles = JSON.parse(await fs.readFile(filePath));
        collection.insertMany(articles);

    } catch (err) {
        console.log(err);
    } finally {
    }
}

module.exports = { startMongoDataBase, getData, setData };