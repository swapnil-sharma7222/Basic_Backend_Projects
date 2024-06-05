const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.listen("5000", () => {
    console.log("sever is running live on port 5000");
});

var newItems = [];

app.get("/", (req, res) => {
    var today = new Date();
    // const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    // var day= weekdays[today];

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    var day = today.toLocaleDateString("en-US", options);
    res.render('lists', { kindOfDay: day, data: newItems });
});

app.post("/", (req, res) => {
    const inputTodoTask = req.body.todoTask;
    if (inputTodoTask.trim() === '') {
        res.redirect("/");
        return;
    }
    newItems.push(inputTodoTask);
    console.log(inputTodoTask);
    res.redirect("/");
});

app.post("/delete", (req, res) => {
    const index = req.body.index;
    if (index >= 0 && index < newItems.length) {
        newItems.splice(index, 1);
    }
    res.redirect('/');
});