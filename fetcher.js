/// <reference path="./include.d.ts" />

var request = require('request');
var sTool = require('./toolkits/stringtool.js');
var fs = require('fs');
var cheerio = require('cheerio');
var async = require('async');
var ExcelWriter = require('./private/ExcelWriter.js');
var config = require('./config.js');


var __getSessions = function (resp) {
    var cookies = [];
    var fullArr = resp.headers['set-cookie'];
    for (var i in fullArr) {
        cookies.push(fullArr[i].split(';')[0]);
    }

    return cookies.join("; ");
}

/**
 * fetching cookie
 */
var cookies;

var ew = new ExcelWriter('result' + Date.now() + '.xlsx', ['Name', 'Email Address', 'HomePage(website)', 'Instagram account', 'Number of followers'], '40wto50w');

/**
 * configuration 
 */
var urls = [];
var startMember = config.basic.start;
var endMember = config.basic.end;
var username = config.basic.username;
var password = config.basic.password;
var delay = config.basic.delay;

for (var i = startMember; i <= endMember; i++) {
	(function (i) {
		var k = i;
		urls.push('https://ecommerce.shopify.com/users/' + i);
	})(i);
}

request({ url: 'https://ecommerce.shopify.com/login', method: 'GET' }, function (err, resp, body) {
    var loginCookie = __getSessions(resp);
    console.log(resp.statusCode);
	var $ = cheerio.load(body);
	var auth_token = $('meta[name="csrf-token"]').attr('content');
	console.log(auth_token);
    var loginForm = {
        'utf8': '✓',
        'authenticity_token': auth_token,
        'return_to': '/',
        'user[email]': username,
        'user[password]': password,
        'remember': 'on',
        'submit': 'Login'
    };

    var loginHeader = sTool.regularHeader('ecommerce.shopify.com', loginCookie);

    var loginHar = {
		"headers": loginHeader,
		"method": "POST",
		"httpVersion": "HTTP/1.1",
		"url": 'https://ecommerce.shopify.com/login'

    };

    // request = request.defaults({'proxy' : 'http://127.0.0.1:8888'});
    request({ har: loginHar, form: loginForm, gzip: true }, function (err, resp, body) {
        if (err) console.log(err);
		if(resp.statusCode === 200) {
			console.log('Auth issue. No worries. Please try to run script again.');
			process.exit();
		}
		console.log(resp.statusCode);
		fs.appendFileSync('./loginlogs/' + Date.now() + '.txt', body);
        cookies = __getSessions(resp);
		async.mapLimit(urls, 1, function (url, callback) {
			singleFetching(url, callback);
		}, function (err) {
			if (err) console.log(err);
		})
    });
});

function singleFetching(url, callback) {
	var fetchHeader = sTool.regularHeader('ecommerce.shopify.com', cookies);

	var fetchHar = {
		'url': url,
		'method': 'GET',
		'httpVersion': 'HTTP/1.1',
		'headers': fetchHeader
	}

	request({ har: fetchHar, gzip: true }, function (err, resp, body) {
		if ((!resp) || (resp.statusCode === 404)) {
			console.log('Nothing fetched on ' + url);
			callback();
			return;
		}
		if (err) {
			console.log(url + ' meets error ');
			console.log(err);
			fs.appendFileSync('err.txt', body);
			callback();
			return;
		}
		if (!body) {
			console.log('Nothing fetched on ' + url);
			callback();
			return;
		}
		var $ = cheerio.load(body);
		// fs.appendFileSync('body.txt', body);
		var email = $('.user-stats dd').eq(0).text();
		var name = $('.user-stats dd').eq(1).text();
		var homePage = $('.user-stats dd').eq(2).text();
		var row = [];
		row.push(name);
		row.push(email);
		row.push(homePage);
		console.log(row);
		if (homePage.length < 5) {
			console.log(url + ' has no homepage');
			ew.appendRow(row);
			ew.build();
			setTimeout(function () {
				callback();
			}, delay);
			return;
		}
		request({ url: homePage, method: 'GET' }, function (err, resp, body) {
			// console.log('got');
			// fs.appendFileSync('040.html', body);
			if (err || (!resp) || (resp.statusCode !== 200)) {
				console.log(url + '\'s home page no response');
				ew.appendRow(row);
				ew.build();
				setTimeout(function () {
					callback();
				}, delay);
				return;
			}
			if (body && body.match(/instagram/i)) {
				if (body.match(/http(s?):\/\/instagram.com\/[a-zA-Z0-9]+/) || body.match(/http(s?):\/\/www.instagram.com\/[a-zA-Z0-9]+/)) {
					var instLink = body.match(/http(s?):\/\/www.instagram.com\/[a-zA-Z0-9_-]+/) ? body.match(/http(s?):\/\/www.instagram.com\/[a-zA-Z0-9_-]+/)[0].trim() : body.match(/http(s?):\/\/instagram.com\/[a-zA-Z0-9]+/)[0].trim();
					console.log(instLink)
					row.push(instLink);
					request({ url: instLink, method: 'GET' }, function (err, resp, body) {
						if (err) {
							console.log(err);
							ew.appendRow(row);
							ew.build();
							setTimeout(function () {
								callback();
							}, delay);
							return;
						}
						if (body) {
							var nof = body.match(/"followed_by": {"count": \d+}/i)[0].match(/\d+/)[0];
							console.log(nof);
							row.push(nof);
						}
						ew.appendRow(row);
						ew.build();
						setTimeout(function () {
							console.log(url + ' fetched');
							callback();
						}, delay);
					});
				} else {
					row.push('investigate');
					ew.appendRow(row);
					ew.build();
					setTimeout(function () {
						console.log(url + ' need to investigate');
						callback();
					}, delay);
				}
			} else {
				ew.appendRow(row);
				ew.build();
				setTimeout(function () {
					console.log(url + ' fetched');
					callback();
				}, delay);
			}
		})
	});
}

