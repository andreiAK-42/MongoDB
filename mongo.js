const { ObjectId } = require("mongodb");
const tempus = require("tempusjs");
require("tempusjs")

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(url);
mongoClient.connect();
const fs = require('fs').promises;


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

async function getSingleData(_id) {
    try {
        const db = mongoClient.db("Lab2DB");
        const collection = db.collection("articles");
        const result = await collection.findOne({_id: new ObjectId(_id)});
        
        return result;
    } catch (err) {
        console.log(err);
        return [];
    }
}

async function deleteArticle(_id) {
    try {
        const db = mongoClient.db("Lab2DB");
        const collection = db.collection("articles");
        const result = await collection.deleteOne({ _id: new ObjectId(_id) });

        return result;
    } catch (err) {
        console.log(err);
    }
}


async function setData(filePath) {
    try {
        const db = mongoClient.db("Lab2DB");
        const collection = db.collection("articles");
        const articles = JSON.parse(await fs.readFile(filePath));

        if (Array.isArray(articles)) {
            articles.forEach(item => {
                item.date_public = new Date(item.date_public);
                collection.insertOne(item);
            });
        }      

    } catch (err) {
        console.log(err);
    }
}


async function setDataFromRequest(head, author, content) {
    try {
        const db = mongoClient.db("Lab2DB");
        const collection = db.collection("articles");

        const today = new Date();
        var article = {
            name: head,
            author: "Пользователь",
            reviews: [],
            date_public: today,
            content: content
        }

        collection.insertOne(article);

    } catch (err) {
        console.log(err);
    }
}


module.exports = { getData, setData, getSingleData, deleteArticle, setDataFromRequest };