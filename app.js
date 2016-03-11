var DEBUG = true;

// ----- dependencies ----------------------------------------------------------
var express = require('express');
var app = express();
var http = require('http').Server(app);
var compress = require('compression');

// ----- initialization --------------------------------------------------------
app.use(compress());
app.use(express.static(__dirname + '/public'));

// ----- go! -------------------------------------------------------------------
http.listen(3002, function() {
    DEBUG && console.log('flexMOTE - admin; listening on *:3002');
});
