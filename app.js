const parse = require('./parser.js');
const fs = require('fs');
var util = require('util');
const assert = require('assert');

const toObj = (data, out) => {
  if (typeof(out) == 'undefined') {
    out = {}
  }
  if (data[0].name == 'row') {
    const rows = [];
    data.forEach((item) => {
      rows.push(item.body.filter((num) => {
        return typeof(num) === 'number';
      }));
    });
    return {'rows':rows};
  }
  if (data[0].name == 'rgb') {
    const rgbs = [];
    data.forEach((item) => {
      rgbs.push(item.body.filter((num) => {
        return typeof(num) === 'number';
      }));
    });
    return {'rgbs':rgbs};
  }
  if (!data[0].body) {
    if (data.length === 1)
      return data[0];
    return data;
  }
  data.forEach((item) => {
    var tmp = toObj(item.body);
    out[item.name] = tmp;
  });
  return out;
}

fs.readFile('test.jbb', 'utf8', function(err, contents) {
  const out = parse.parse(contents);

  //console.log(out);
  const parseOut = toObj(out);
  console.log(util.inspect(parseOut, {showHidden: false, depth: null}));
  //console.log(parseOut);

});
