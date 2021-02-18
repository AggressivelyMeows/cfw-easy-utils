var fs = require('fs')
fs.readFile('./package.json', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var packageVersion = JSON.parse(data).version
    fs.readFile('./dist/cfw-easy-utils.js', 'utf8', function (err,data) {
        var result = data.replace('{{ packageVersion }}', packageVersion)
  
        fs.writeFile('./dist/cfw-easy-utils.js', result, 'utf8', function (err) {
           if (err) return console.log(err);
        });
    })

});