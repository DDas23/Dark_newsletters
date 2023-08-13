//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require('dotenv').config();

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){
    const Firstname = req.body.fname;
    const Lastname = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: Firstname,
                    LNAME: Lastname
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const api_k = process.env.api_key;
    const api_id = process.env.api_identity;
   
    const url = "https://us9.api.mailchimp.com/3.0/lists/"+api_id;
    const options = {
        method:"POST",
        auth: "Deep1:"+api_k, //check both the integration
    }

    const request = https.request(url, options, function(response)
    {
        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success2.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        
       response.on("data", function(data){
        console.log(JSON.parse(data));
       })
    })
    request.write(jsonData);
    request.end();

    console.log(Firstname, Lastname, email);
});

app.post("/failure", function(req, res) {
    res.redirect("/");
}
);

app.listen(process.env.PORT || 3000, function() { //dynamic port with local as well
    console.log("server is running");
});
