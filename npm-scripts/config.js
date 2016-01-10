"use strict";

let glob = require("glob");

module.exports = {
  "commands": {
    "tsc": [
      "tsc",
      "gulpfile.ts",
      "typings/tsd.d.ts",
      "--module commonjs",
      "--target es5",
      "--experimentalDecorators",
      "--moduleResolution node"
    ].concat(glob.sync("server/**/*.ts{,x}"))
  }
}
