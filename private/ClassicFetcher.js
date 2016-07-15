/// <reference path="../include.d.ts" />
var async = require('async');
var request = require('request');
var events = require('events');

/**
 * Wrapper for standard fetcher.
 * 
 * Factories: url, If authorize, "thread"" limit, fetching func etc. 
 * 
 * @param options support following
 * 
 * auth - boolean. True if need login
 * loginHar - Obeject. Http archive file for login
 * fetcherHar - Object. 
 * loginFormOption - url, form
 * fetchFunction - fetcherFunction should have param har, delay
 * limit - "thread" limit
 * delay - delay between each fetching
 * links - links to fetch
 */
var ClassicFetcher = function (options) {
    this.__auth = options.auth;
    this.__loginHar = options.loginHar ? options.loginHar : null;
    this.__loginformOption = options.loginformOption ? options.loginformOption : null;
    this.__fetcherHar = options.fetcherHar;
    this.__fetcherFunction = options.fetcherFunction;
    this.__limit = options.limit;
    this.__delay = options.delay;
    this.__links = options.links;
}

/**
 * run classic fetcher
 */
ClassicFetcher.prototype.run = function () {
    if (this.__auth) {
        if (this.__loginHar) {
            request({ har: this.__loginHar }, function (err, resp, body) {
                var headers = this.__fetcherHar.header[0];
                headers.forEach(function(item, index, array) {
                    if(item.name === "Cookie") {
                        item.value === __getSessions(resp);
                    }
                });
                fetcher();
            });
        } else {
            request({url : this.__loginformOption.url, form : __loginformOption.form} , function(err, resp, body) {
                var headers = this.__fetcherHar.header[0];
                headers.forEach(function(item, index, array) {
                    if(item.name === "Cookie") {
                        item.value === __getSessions(resp);
                    }
                });
                fetcher();
            });
        }
    }
}

/**
 * control threads and delay
 */
ClassicFetcher.prototype.fetcher = function() {
    async.mapLimit(this.__links, this.__limit, function(link, callback) {
            this.__fetcherFunction(this.__fetcherHar, this.__limit, this.__delay, link, callback);
    }, function(err) {
        if(err) console.log(err);
    });
}

/**
 * return cookie string processed by resp.headers['set-cookie']
 */
var __getSessions = function (resp) {
    var cookies = [];
    var fullArr = resp.headers['set-cookie'];
    for (var i in fullArr) {
        cookies.push(fullArr[i].split(';')[0]);
    }

    return cookies.join("; ");
}