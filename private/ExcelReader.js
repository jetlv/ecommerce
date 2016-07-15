/// <reference path="../include.d.ts" />

var fs = require("fs");
var xlsx = require('node-xlsx');

/**
 * @param type 'read' or 'write'
 * @param file  Path of the processing file
 * 
 */
var ExcelReader = function (type, file) {
    this._file = file;
    this._column = [];
}

/**
 * @return  array of worksheets, e.g: [{name : "Sheet1", data : [[Object],[Object]}, {name : "Sheet2", data : []}]
 */
ExcelReader.prototype.readAll = function () {
   return xlsx.parse(fs.readFileSync(this._file));
}

/**
 * @param sheet name
 * @return array of the column name
 * 
 * read all column, save to _column, then return column array
 */
ExcelReader.prototype.readColumn = function(sheet) {
    var all = xlsx.parse(fs.readFileSync(this._file));
    for(var i =0; i < all.length; i++) {
        if(all[i].name === sheet) {
            break;
        }
    } 
    if(i === all.length) {
        console.error('There is no sheet called ' + sheet);
        return;
    }
    this._column = all[i].data[0];

    return this._column;
}


module.exports = ExcelReader;

