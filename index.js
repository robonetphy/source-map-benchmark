const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const directoryPath = path.join(__dirname, 'source_map');
const SMConsumerSM = require('./test_source_map');
const SMConsumerSMJ = require('./test_source_map_js');
const { plot } = require('nodeplotlib');


function measureSync(fn, map, raw, offset) {
    let start = performance.now();
    fn(map, raw, offset);
    return performance.now() - start;
}

function measurePromise(fn, map, raw, offset) {
    let onPromiseDone = () => performance.now() - start;
    let start = performance.now();
    return fn(map, raw, offset).then(onPromiseDone);
}

async function main() {
    const libraries = fs.readdirSync(directoryPath);
    let maps = [];
    let sourceMap = [];
    let sourceMapJS = [];
    let diffInMs = [];
    for (var j = 0; j < libraries.length; j++) {
        library = libraries[j];
        console.log(`Processing: ${library}`);
        const files = fs.readdirSync(path.join(directoryPath, library));
        for (var i = 0; i < files.length; i++) {
            let fileName = files[i];
            let splitName = fileName.split('.');
            if (splitName[splitName.length - 1] !== "map") {
                console.log(`        File: ${fileName}`);
                maps.push(fileName);
                const map = fs.readFileSync(path.join(directoryPath, library, fileName + ".map")).toString();
                const compiled = fs.readFileSync(path.join(directoryPath, library, fileName)).toString();
                let durationOfSMJ = measureSync(SMConsumerSMJ, map, compiled, 10);
                console.log(`           source map js: ${durationSMJ} ms`);
                sourceMapJS.push(durationOfSMJ);
                let durationSM = await measurePromise(SMConsumerSM, map, compiled, 10);
                console.log(`           source map: ${durationSM} ms`);
                sourceMap.push(durationSM);
                diffInMs.push(durationSM - durationSMJ);
            }
        }
    }
    const sourceMapInMS = { x: maps, y: sourceMap, type: 'scatter', name: "source map" };
    const sourceMapJSInMS = { x: maps, y: sourceMapJS, type: 'scatter', name: "source map js" };
    plot([sourceMapInMS, sourceMapJSInMS]);
    const diff = { x: maps, y: diffInMs, type: 'scatter', name: "sm diff smj" };
    plot([diff]);
}
main()
