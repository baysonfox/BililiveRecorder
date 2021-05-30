"use strict";
const {
    spawn
} = require('child_process');
const {
    stdout,
    stderr
} = require('process');
const {
    writeFileSync
} = require("fs");
const {
    resolve
} = require('path');
const data = require("./config.data.js");
const {
    generate_core_config
} = require("./generate_core_config");
const {
    generate_web_config
} = require("./generate_web_config");

const DO_NOT_EDIT_COMMENT = `// ******************************
//  GENERATED CODE, DO NOT EDIT MANUALLY.
//  SEE .tools/build_config.js
// ******************************\n\n`

// ---------------------------------------------
//                  CORE
// ---------------------------------------------

console.log("[node] writing core config...")

const path_core_config = resolve(__dirname, '../BililiveRecorder.Core/Config/V2/Config.gen.cs');

const core_config_code = generate_core_config(data);

writeFileSync(path_core_config, DO_NOT_EDIT_COMMENT + core_config_code, {
    encoding: "utf8"
});

// ---------------------------------------------
//                  WEB
// ---------------------------------------------

console.log("[node] writing web config...")

const path_web_config = resolve(__dirname, '../BililiveRecorder.Web.Schemas/Types/Config.gen.cs');

const web_config_code = generate_web_config(data);

writeFileSync(path_web_config, DO_NOT_EDIT_COMMENT + web_config_code, {
    encoding: "utf8"
});

// ---------------------------------------------
//                 FORMAT
// ---------------------------------------------

console.log("[node] formatting...")

let format = spawn('dotnet', ['tool', 'run', 'dotnet-format', '--', '--include', './BililiveRecorder.Core/Config/V2/Config.gen.cs', './BililiveRecorder.Web.Schemas/Types/Config.gen.cs'])

format.stdout.on('data', function (data) {
    stdout.write('[dotnet-format] ' + data.toString());
});

format.stderr.on('data', function (data) {
    stderr.write('[dotnet-format] ' + data.toString());
});

format.on('exit', function (code) {
    console.log('[node] format done code ' + code.toString());
});
