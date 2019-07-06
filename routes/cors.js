const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3000', 'https://localhost:3443'];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) {  //check whether the origin part of the header present in the white list
        corsOptions = { origin: true }; //cors module will reply back saying access control allow origin
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();  //standard cors: reply back with access control allow origin with the wild cards
exports.corsWithOptions = cors(corsOptionsDelegate);  //apply a cors with specific options to a particular route