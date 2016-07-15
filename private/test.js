/// <reference path="../include.d.ts" />

var ClassicFetcher = require('./ClassicFetcher.js');

// this.__auth = options.auth;
//     this.__loginHar = options.loginHar ? options.loginHar : null;
//     this.__loginformOption = options.loginformOption ? options.loginformOption : null;
//     this.__fetcherHar = options.fetcherHar;
//     this.__fetcherFunction = options.fetcherFunction;
//     this.__limit = options.limit;
//     this.__delay = options.delay;
//     this.__links = options.links;

var loginformOption = {
    url : 'http://www.milanoo.com/member/login.html',
    method : 'POST',
    form : {'loginusername' : 'lvchao@milanoo.com', 'loginuserpass' : 'lc799110'}
}

var options = {
    auth : true, 
    loginformOption : loginformOption,
    fetcherHar : {
        headers : [{
            "name" : "Cookie",
            "value" : ""
        }],
        "url" : 'http://www.milanoo.com/member/index.html',
        "method" : "GET",
        "httpVersion" : "HTTP/1.1"
    },
    limit : 2,
    delay : 2000
}  

var cf = new ClassicFetcher(options);