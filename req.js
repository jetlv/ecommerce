var request = require('request');
var fs = require('fs');

request({url : 'https://www.instagram.com/ilite_lighting', method : 'GET'}, function(err, resp, body) {
    fs.appendFileSync('inst.txt' , body);
});