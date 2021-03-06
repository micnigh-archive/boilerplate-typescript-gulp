/// <reference path="node_modules/typescript/lib/lib.es6.d.ts"/>
import * as gulp from "gulp";
import * as typescript from "gulp-typescript";
import * as sourcemaps from "gulp-sourcemaps";
import * as concat from "gulp-concat";
import * as size from "gulp-size";
import * as sass from "gulp-sass";

let isDev = process.env.NODE_ENV === "production" ? false : true;
let distPath = isDev ? ".tmp/development" : ".tmp/production";

let { compilerOptions: tsClientCompilerOptions } = require("./tsconfig.json");
Object.assign(tsClientCompilerOptions, {
  module: "system",
});
let tsClientProject = typescript.createProject(tsClientCompilerOptions);

gulp.task("build", ["build:js", "build:html", "build:css"]);

gulp.task("build:html", [], function () {
  return gulp.src(["server/public/**/*"])
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest(distPath));
});

gulp.task("build:css", [], function () {
  return gulp.src(["client/src/**/*.{sass,scss}"])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(size({ showFiles: true }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(distPath));
});

gulp.task("build:js", ["build:js:app", "build:js:lib"]);

gulp.task("build:js:lib", [], function () {
  return gulp.src([
    "node_modules/es5-shim/es5-shim.js",
    "node_modules/es5-shim/es5-sham.js",
    "node_modules/systemjs/dist/system.src.js",
  ])
    .pipe(sourcemaps.init())
    .pipe(size({ showFiles: true }))
    .pipe(concat("lib.js"))
    .pipe(size({ showFiles: true }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(distPath));
});

gulp.task("build:js:app", [], function () {
  return gulp.src(["client/src/**/*.ts{,x}"])
    .pipe(sourcemaps.init())
    .pipe(typescript(tsClientProject))
    .pipe(size({ showFiles: true }))
    // .pipe(concat("app.js"))
    // .pipe(size({ showFiles: true }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(distPath));
});

gulp.task("watch", ["build", "watch:js", "watch:html", "watch:css"]);
gulp.task("watch:html", ["build:html"], function () {
  return gulp.watch(["server/public/**/*"], ["build:html"]);
});
gulp.task("watch:css", ["build:css"], function () {
  return gulp.watch(["client/src/**/*.{sass,scss}"], ["build:css"]);
});
gulp.task("watch:js", ["build:js", "watch:js:app"]);
gulp.task("watch:js:app", ["build:js:app"], function () {
  return gulp.watch(["client/src/**/*.ts{,x}"], ["build:js:app"]);
});

gulp.task("default", ["build"]);
