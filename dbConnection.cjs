const {MongoClient} = require('mongodb') // We use only one package in the whole mongodb package. So we use the specific package in the curly braces

let dbConnection
function connectToDb(callBack) { //Callback function is used here because first we should establish the connectivity and then we link the port 8000
  
    // MongoClient.connect('mongodb://127.0.0.1:27017/ExpenseTracker').then(function(client) {

    /**The above line is the link for local server */

    MongoClient.connect('mongodb+srv://jayyasri:jayyasri2003@cluster0.px0fqjz.mongodb.net/ExpenseTracker?retryWrites=true&w=majority').then(function(client) { //Here, ExpenseTracker is a database name and MongoClient.connect is a function
    //The above line is the link for cloud server. Rewrite the <username> and <password> as jayyasri and jayyasri1234
    dbConnection = client.db()
        callBack()
    }).catch(function(error) { //To catch the error and we can check whether the connectivity is there or not
        callBack(error)
    })
}

function getDb() {
    return dbConnection
}

// Exporting required functions so that we can use these functions in another files
module.exports = {connectToDb, getDb}