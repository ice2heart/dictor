/*
 * Grammar to generate an S-Expressions parser for Javascript using http://pegjs.majda.cz/
 */

start
  = expression*


integer "integer"
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }


expression
  = (space? '(' name:identifier space body:body ')' space?) { return {name: name, body:body}; }

body
  = body:(expression / identifier / float / integer / string / space )* { return body }


float
  = ('+' / '-')? [0-9]+ (('.' [0-9]+) / ('e' [0-9]+))


string
  = '"' content:([^"\\] / "\\" . )* '"' {
function concat(o,i){
    var r=[];
    for(var p in o){
        r.push(o[p]);
    }
    return r.join("");
}

return concat(content);
}


identifier
  = identifier:([a-zA-Z\=\*:] [a-zA-Z0-9_\=\*-:]*) {
  function concat(o,i){
    var r=[];
    for(var p in o){
        r.push(o[p]);
    }
    return r.join("");
  }
return identifier.map(function(a) {return concat(a)}).join("");
}

space
  = [\s\n ]+ { return ""; }

comment
  = "#" .*
