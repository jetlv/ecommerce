/// <reference path="../include.d.ts" />

var fs = require("fs");
var xlsx = require('node-xlsx');


/**
 * @param Saving file
 * @columns columns name array e.g ["ColumnA", "ColumnB", "ColumnC"]
 * 
 * Wrapper for writing excel
 */
var ExcelWriter = function(file, columns, sheetName) {
    this._sheetName = sheetName;
    this._file = file;
    this._data = [];
    this._buffer = null;
    this._columns = columns;
    this._data.push(columns);
}

/**
 * @param row  text array of appending row e.g ["cell1", "cell2", "cell3"]
 */
ExcelWriter.prototype.appendRow = function(row) {
    this._data.push(row);
}

/**
 * @return buffer
 */
ExcelWriter.prototype.build = function() {
    this._buffer = xlsx.build([{name : this._sheetName, data :  this._data}]);
    fs.writeFile(this._file, this._buffer, function(err) {
        console.error('Unable to write file ' + this._file);
    });
    // fs.open(this._file , 'w+', function(err, fd) {
    //     fs.write(fd, this._buffer, function(err, num, str) {
    //         if(err) {
    //             console.error(err);
    //         }
    //     });
    // });
}

/**
 * output current status
 */
ExcelWriter.prototype.log = function() {
    console.log(this._data);
}

module.exports = ExcelWriter;