const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.listen("5000", () => {
    console.log("Server is running on localhost 3000");
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.use(express.static("public"));

app.post("/", function (req, res) {
    var first_name = req.body.First;
    var last_name = req.body.Last;
    var userEmail = req.body.Email;
    console.log(first_name);
    console.log(last_name);
    console.log(userEmail);

    const client = require("@mailchimp/mailchimp_marketing");

    client.setConfig({
        apiKey: "44e118369328d2bc9dae23eb9c39706c-us21",
        server: "us21",
    });

    const run = async () => {
        const response = await client.lists.batchListMembers("f3f58ebbe2", {
            members: [{
                email_address: userEmail,
                status: "subscribed",
                merge_fields: {
                    FNAME: first_name,
                    LNAME: last_name,
                }
            }],
        }).then(
            (value) => {
                console.log("Successfully added contact as an audience member.");
                res.sendFile(__dirname + "/success.html");
            },
            (reason) => {
                res.sendFile(__dirname + "/failure.html");
            },
        )
    };
    run();
});

app.post("/success.html", (req, res)=>{
    res.redirect("/");
});
app.post("/failure.html", (req, res)=>{
    res.redirect("/");
});

// async function addMember() {
//     const response = await client.lists.batchListMembers("f3f58ebbe2", {
//         members: [{
//             email_address: userEmail,
//             status: "subscribed",
//             merge_fields: {
//                 FNAME: first_name,
//                 LNAME: last_name,
//             }
//         }],
//     }).then(
//         (value) => {
//             console.log("Successfully added contact as an audience member.");
//             res.sendFile(__dirname + "/success.html");
//         },
//         (reason) => {
//             res.sendFile(__dirname + "/failure.html");
//         },
//     );
// }

// console.log(response.statusCode);


// if (response.statusCode == 200) {
//     res.send(response.statusCode);
// } else {
//     res.send(response.statusCode);
// }
// };



// const mailchimp = require("@mailchimp/mailchimp_marketing");

// mailchimp.setConfig({
//     apiKey: "44e118369328d2bc9dae23eb9c39706c-us21",
//     server: "us21",
// });
// async function run() {
//     const response = await mailchimp.ping.get();
//     console.log(response);
// }

// run();