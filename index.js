var express = require('express');
var app = express();

app.use(express.static("./public"));

app.listen(80, (err) => {
        console.log(err)
    })