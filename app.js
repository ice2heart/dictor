const parse = require('./parser.js');
const fs = require('fs');
const util = require('util');
const assert = require('assert');
const tts = require('./lib/tts.js');


/*tts({
	text: '10 красный',
	file: 'hello.mp3'
	}, function(){
		console.log('done');
	}
);*/


function integerDivision(x, y) {
    return x / y >> 0
}

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
        return {
            'rows': rows
        };
    }
    if (data[0].name == 'rgb') {
        const rgbs = [];
        data.forEach((item) => {
            rgbs.push(item.body.filter((num) => {
                return typeof(num) === 'number';
            }));
        });
        return {
            'rgbs': rgbs
        };
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
    console.log(util.inspect(parseOut, {
        showHidden: false,
        depth: null
    }));
    var list = parseOut.jbb.model.rows.reduce((total, item) => {
        return total.concat(item);
    }, []);
    console.log(integerDivision(list.length, (parseOut.jbb.model.rows[0].length + 1)));
    list = list.splice(0, integerDivision(list.length, (parseOut.jbb.model.rows[0].length + 1)) * (parseOut.jbb.model.rows[0].length + 1) + 1);
    console.log(list.length);
    var curColor = 0;
    var curColorCount = 0;
    var outList = [];
    list.forEach((item) => {
        if (item != curColor) {
            outList.push([curColor, curColorCount]);
            curColor = item;
            curColorCount = 1;
        } else {
            curColorCount++;
        }
    });
    outList.shift();
    const cutList = outList.reduce((total, item) => {
        var contain = false;
        total.forEach((i)=>{
            if (i[0] == item[0] && i[1] == item[1]){
                contain = true;
            }
        });
        if (!contain){
            total.push(item);
        }
        return total;
    }, []);
    const color = {6:'Красный', 16:'Черный'};
    const colorList = cutList.reduce((total, item) =>{
        total.push([color[item[0]], item[1]]);
        return total;
    }, []);
    console.log(outList, colorList);

});
