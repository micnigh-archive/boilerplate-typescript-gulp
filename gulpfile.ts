/// <reference path="node_modules/typescript/lib/lib.es6.d.ts"/>
import * as gulp from "gulp";
import * as typescript from "gulp-typescript";
import * as sourcemaps from "gulp-sourcemaps";
import * as concat from "gulp-concat";
import * as size from "gulp-size";

// let amdOptimize = require("amd-optimize");
let amdOptimize = require("gulp-amd-optimizer");
// let idfy = require("gulp-amd-idfy");

let isDev = process.env.NODE_ENV === "production" ? false : true;
let distPath = isDev ? ".tmp/development" : ".tmp/production";

let { compilerOptions: tsClientCompilerOptions } = require("./tsconfig.json");
Object.assign(tsClientCompilerOptions, {
  module: "amd",
});
let tsClientProject = typescript.createProject(tsClientCompilerOptions);

gulp.task("build", ["build:js", "build:html"]);

gulp.task("build:html", [], function () {
  return gulp.src(["server/public/**/*"])
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest(distPath));
});

gulp.task("build:js", ["build:js:app", "build:js:lib"]);

gulp.task("build:js:lib", [], function () {
  return gulp.src([
    "node_modules/es5-shim/es5-shim.js",
    "node_modules/es5-shim/es5-sham.js",
    "node_modules/requirejs/require.js",
  ])
    .pipe(sourcemaps.init())
    .pipe(size({ showFiles: true }))
    .pipe(concat("lib.js"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(distPath))
    .pipe(size({ showFiles: true }));
});

gulp.task("build:js:app", [], function () {
  return gulp.src(["client/src/**/*.ts{,x}"])
    .pipe(sourcemaps.init())
    .pipe(typescript(tsClientProject))
    .pipe(size({ showFiles: true }))
    //.pipe(sourcemaps.write())
    // .pipe(idfy())
    // .pipe(amdOptimize("entry"))
    //   baseUrl: "client/src/",
    // .pipe(amdOptimize({
    //   exclude: [
    //     "require",
    //     "exports",
    //   ]
    // }))
    // .pipe(sourcemaps.init({ loadMaps: true }))
    // .pipe(concat("app.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(distPath))
    .pipe(size({ showFiles: true }));
});

gulp.task("watch", ["build", "watch:js", "watch:html"]);
gulp.task("watch:html", ["build:html"], function () {
  return gulp.watch(["server/public/**/*"], ["build:html"]);
})
gulp.task("watch:js", ["build:js", "watch:js:app"]);
gulp.task("watch:js:app", ["build:js:app"], function () {
  return gulp.watch(["client/src/**/*.ts{,x}"], ["build:js:app"]);
})

gulp.task("default", ["build"]);
