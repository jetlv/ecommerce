

/**
 * regular har header(v 1.2)
 */
module.exports.regularHeader = function (host, cookie) {
    return [{
        "name": "Host",
        "value": host
    },
        {
            "name": "User-Agent",
            "value": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
        },
        {
            "name": "Accept",
            "value": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
        },
        {
            "name": "Accept-Encoding",
            "value": "gzip, deflate"
        },
        {
            "name": "Content-Type",
            "value": "application/x-www-form-urlencoded"
        },
        {
            "name": "Upgrade-Insecure-Requests",
            "value": "1"
        },
        {
            "name": "Accept-Language",
            "value": "zh-CN,zh;q=0.8"
        },
        {
            "name": "Cookie",
            "value": cookie
        }
    ]
}
/**
 * Fetch all email dress from a string. Return an array
 */
module.exports.fetchAllMailAddress = function (str) {
    return str.match(/(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})/ig);
}

/**
 * @param size count of numbers
 * @return fetched number
 * fetch number from string
 */
module.exports.fetchNumbersFromString = function (str, size) {
    var regexp = '\\d{' + size + '}';
    return str.match(regexp) ? str.match(regexp)[0] : null;
}


/**
 * Get a random string via length provided
 */
module.exports.randomStr = function (len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
