"use strict";
let execSync = require("child_process").execSync;

function exec(command) {
  execSync(command, { stdio: [0, 1, 2] });
}

let tscCommand = require("./config").commands.tsc;
tscCommand.push(" --watch");
exec(tscCommand.join(" "));
