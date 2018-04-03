// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)

var mongoose = require('mongoose');
// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/quoting_dojo');
//Let's go ahead and make our first Schema that we will use to model Users. 
//Let's say that each user will have a name that is a string and an age that is a number. 
//The code to create a Schema is pretty simple as below
var QuoteSchema = new mongoose.Schema({ //Blueprint.  name and age in each document (row)
    name:String,
    quote: String,
    created_at : { type : Date, default: Date.now } ,
    
})
mongoose.model('Quote',QuoteSchema); //we are settting this Schema in our Models as 'Quote'.   So you can do Quote.find{}
//Set the mongoose.model to the "Quote" variable so that we can run model-like methods on it to make all of the CRUD operations easier.
var Quote = mongoose.model('Quote'); //We are retrieving the Schema from out Models, named Quote. 

var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Use native promises
mongoose.Promise = global.Promise;
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');

// Routes
// Root Request
app.get('/', function(req, res) {
    res.render('index');
})

app.post('/quotes', function(req,res){
    console.log("POST DATA", req.body);
    //create a quote with name and quote from req.body
    var quote = new Quote({name: req.body.name, quote: req.body.quote});
    //try to save this quote to the db.
    quote.save(function(err){
        if (err){
            console.log('error in saving to the db')
        }else{
            console.log('added to the DB!!!!');
            res.redirect('quotes');
        }
    })
})   

app.get('/quotes', function(req,res){
    console.log("in the get*******");
    Quote.find({},function(err,quotes){
        if(err){
            console.log('error in getting quotes from db')
        }else{
            res.render('results',{quotelist:quotes})
        }
    })
})

// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})
