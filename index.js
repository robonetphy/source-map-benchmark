const source_map = require('source-map');
const fs = require('fs');
const path = require('path');
const map = fs.readFileSync(path.join(__dirname, "source_maps", 'c51771c4.js.map')).toString();
const compiled = fs.readFileSync(path.join(__dirname, "source_maps", 'c51771c4.js')).toString();
var start = (new Date).getTime();
(new source_map.SourceMapConsumer(map)).then(consumer => {
    function getOriginalLocation(selectedLine) {
        var absColumn, column;
        absColumn = column = selectedLine;
        // console.log(selectedLine);
        var pos = compiled.slice(0, column);
        var line = 1;
        var lineCount = pos.split(/\r?\n|\r/g);
        var figure = 0;
        // console.log(lineCount);
        for (var i = 0; i < lineCount.length - 1; i++) {
            figure = figure + (lineCount[i].length);
        }
        figure = figure + (lineCount.length - 1);
        column = absColumn - figure;
        var lookup = { line: lineCount.length ? lineCount.length : line, column: column };
        return consumer.originalPositionFor(lookup);
    }
    var count = 0;
    for (var i = 0; i < compiled.length; i += 10) {
        count++;
        getOriginalLocation(i);
    }
    var diff = (new Date).getTime() - start;
    console.log("source_map:", diff / count);
});