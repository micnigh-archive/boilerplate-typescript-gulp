import * as gulp from "gulp";
import * as typescript from "gulp-typescript";
import * as babel from "gulp-babel";
import * as sourcemaps from "gulp-sourcemaps";
import * as concat from "gulp-concat";
import * as size from "gulp-size";
let rename = require("gulp-rename");

import * as _ from "lodash";

let isDev = process.env.NODE_ENV === "production" ? false : true;
let distPath = isDev ? ".tmp/development" : ".tmp/production";

let { compilerOptions: tsClientCompilerOptions } = require("./tsconfig.json");
_.merge(tsClientCompilerOptions, {
  module: "es6",
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
    "node_modules/react/dist/react.js",
    "node_modules/react/dist/react-dom.js",
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
    .pipe(typescript(tsClientProject))
    // .pipe(rename({extname: ".es6"}))
    // .pipe(gulp.dest("client/src/"))
    .pipe(babel({
      sourceMaps: "inline",
      presets: [
        "es2015",
        "react",
      ],
    }))
    .pipe(rename({extname: ".js"}))
    .pipe(gulp.dest("client/src/"))
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
