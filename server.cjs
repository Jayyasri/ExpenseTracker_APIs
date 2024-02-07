const express = require('express')
const bodyParser = require('body-parser')

const {ObjectId} = require('mongodb') //adding the ObjectId package in the mongodb package for the deleting the entry using query

// Importing required functions from dbConnection.cjs
const {connectToDb, getDb} = require('./dbConnection.cjs') //{connectToDb, getDb} what are the functions in dbConnection file need to be passed here

const app = express()
app.use(bodyParser.json())

let db
connectToDb(function(error) { 
    if(error) {
        console.log('Could not establish connection...') 
        console.log(error) //To know what is the error
    } else {
        // process.env.PORT : cloud service
        // 8000 : local machine
        const port = process.env.PORT || 8000
        app.listen(port)
        db = getDb()  // connection is saved to a variable db, so that we can fetch the data and we can insert, delete etc (crud operations)
        console.log(`Listening on port ${port}...`)
    }
})

// app.get('/', function(request, response) {
//     response.json({
//         "status" : "Welcome ;)"
//     })
// })


/**************************
 * Expense Tracker
 * Functionalities : adding entry, getting the summaries of previous entries, editing and deleting
 * Input fields : Category, Amount, Date
 * 
 * CRUD : Create, Read, Update and Delete
 * 
 * 
 * 
 * *********API CALLS or END-POINTS
 * get-entries / get-data - FIND
 * add-entry - POST
 * edit-entry - PATCH or PUT ****POST also can be used. To be more specific PATCH is used.
 * delete-entry - DELETE  ***can use POST also and DELETE is a inbuilt function
 *//************************/


 /**Adding Entry */
 /**In postMan App, we use the url *****localhost:8000/add-entry**** */

app.post('/add-entry', function(request, response) {  //Here /add-entry is like /python
    db.collection('ExpensesData').insertOne(request.body).then(function() { //ExpensesData is a collection name
        response.status(201).json({  //201 is a status code
            "status" : "Entry added successfully"
        })
    }).catch(function () {
        response.status(500).json({ //500 is also a status code
            "status" : "Entry not added"
        })
    })
})

/**Getting entries  */

//Status code 200 is to send a proper response

app.get('/get-entries', function(request, response) {
    // Declaring an empty array
    const entries = []
    db.collection('ExpensesData')
    .find()
    .forEach(entry => entries.push(entry))
    .then(function() {
        response.status(200).json(entries)
    }).catch(function() {
        response.status(404).json({  //status code starts with 4 is a client side error. and the status code starts with 5 is a server side error
            "status" : "Could not fetch documents"
        })
    })
})      

/******Deleting the entry using the query ********************************/
/********There are three ways for sending data along with request by the client. Client can send the data by using body, query, params */
/**After question mark ? in the link is called the query */
/**If we are using query instead of body, we use the syntax request.body.id --->> Here id is the name. id is one of the query. so we are giving id. Whatever the name is given instead of id, that should be given*/
/**We use if-else here to check the id is valid or not. The receiving id is converted into the object Id. If it is converted into proper object id, if block is executed otherwise else block is executed */

//**In PostMan App, we give url as ******localhost:8000/delete-entry?id=65c0b78a7b55fc833ccfe725 ******/

app.delete('/delete-entry', function(request, response) {
    if(ObjectId.isValid(request.query.id)) {
        db.collection('ExpensesData').deleteOne({
            _id : new ObjectId(request.query.id)  //Here objectId is used since the id is in objectId, so we add //const {ObjectId} = require('mongodb')// here.
        }).then(function() {
            response.status(200).json({
                "status" : "Entry successfully deleted"
            })
        }).catch(function() {
            response.status(500).json({
                "status" : "Entry not deleted"
            })
        })
    } else {
        response.status(500).json({
            "status" : "ObjectId not valid"
        })
    }
})

//**Updating entry using params */ 
/** Here we can use PUT also instead of PATCH */

/***In PostMan App, we give the url as *****localhost:8000/update-entry/65c0b5818b538e70ced121d9 ******/

app.patch('/update-entry/:id',function(request,response){ //Here we should give /:Name ---> Here id is the params. params should be given after the required end point
    
    // console.log(request.params) ***Printing the id **********************************************

    //Here also we are using if-else to check the objectId is valid or not. It is the best practice.

    if(ObjectId.isValid(request.params.id)) { 
        db.collection('ExpensesData').updateOne(  //updateOne has two parameters. The first parameter is the selecting the doument which we are going to update and the second paramter is, what we need to update
            { _id : new ObjectId(request.params.id) }, // identifier : selecting the document which we are going to update
            { $set : request.body } // The data to be updated. Here the second parameter is written with $set.
        ).then(function() {
            response.status(200).json({
                "status" : "Entry updated successfully"
            })
        }).catch(function() {
            response.status(500).json({
                "status" : "Unsuccessful on updating the entry"
            })
        })
    } else {
        response.status(500).json({
            "status" : "ObjectId not valid"
        })
    }
})