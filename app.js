//jshint esversion: 6

const express = require('express');
const bodyParser  = require("body-parser");
const request =  require('request');
const https = require('https');
const { json } = require('stream/consumers');
const { dirname } = require('path');

const app = express();

//static folder where we've all of the files that are rendered like css and images
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const listID = "bae5ad6581";
    const apiKey = "e76a93805330764d2cde8440f7c38374-us14";
    const url = "https://us14.api.mailchimp.com/3.0/lists/"+listID;
    const options = {
        method: "POST",
        auth: "chaitanya:e76a93805330764d2cde8440f7c38374-us1"
    };

    const request = https.request(url,options,function(response){
        if (response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }
        else {
            res.sendFile(__dirname+"/failure.html")
        }

        response.on("data",function(data){
            console.log(response.statusCode);
        });
    });

    request.write(jsonData);
    request.end();
})


app.post("/failure",function(req,res){
    res.redirect("/");
});

app.listen(3000,function(){
    console.log("Server is  running on port 3000");
});

//     API Key
 
//    List ID