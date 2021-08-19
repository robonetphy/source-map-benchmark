const { SourceMapConsumer } = require("source-map");

module.exports = async function (map, raw, testingOffset) {
    let consumer = await new SourceMapConsumer(map);
    function getOriginalLocation(selectedLine) {
        var absColumn, column;
        absColumn = column = selectedLine;
        var pos = raw.slice(0, column);
        var line = 1;
        var lineCount = pos.split(/\r?\n|\r/g);
        var figure = 0;
        for (var i = 0; i < lineCount.length - 1; i++) {
            figure = figure + (lineCount[i].length);
        }
        figure = figure + (lineCount.length - 1);
        column = absColumn - figure;
        var lookup = { line: lineCount.length ? lineCount.length : line, column: column };
        return consumer.originalPositionFor(lookup);
    }
    for (var i = 0; i < raw.length; i += testingOffset) {
        getOriginalLocation(i);
    }
}
