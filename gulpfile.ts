/// <reference path="node_modules/typescript/lib/lib.es6.d.ts"/>
import * as gulp from "gulp";
import * as typescript from "gulp-typescript";
import * as sourcemaps from "gulp-sourcemaps";
import * as concat from "gulp-concat";
import * as size from "gulp-size";
import * as sass from "gulp-sass";
import source = require("vinyl-source-stream");
import * as chalk from "chalk";
import * as browserify from "browserify";
let watchify: {(instance: Browserify.BrowserifyObject): Browserify.BrowserifyObject} = require("watchify");
let buffer = require("gulp-buffer");
let prettyTime = require("pretty-hrtime");

let isDev = process.env.NODE_ENV === "production" ? false : true;
let distPath = isDev ? ".tmp/development" : ".tmp/production";

let { compilerOptions: tsClientCompilerOptions } = require("./tsconfig.json");
// Object.assign(tsClientCompilerOptions, {
//   module: "system",
// });
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

interface BrowserifyBuildOptions {
  tsConfig: { compilerOptions: any },
  watch: boolean,
  destFileName: string,
};

function bundleBrowserifyBuild (b: Browserify.BrowserifyObject, buildOptions: BrowserifyBuildOptions): NodeJS.ReadWriteStream {
  let bundleStartTime = process.hrtime();
  let bundle = b.bundle();
  bundle
    .on("error", function (msg) {
      console.log(chalk.red(msg.toString()));
    })
    .on("end", function () {
      console.log(`Bundled ${chalk.cyan(buildOptions.destFileName)} ${chalk.magenta(prettyTime(process.hrtime(bundleStartTime)))}`);
    });

  return bundle
    .pipe(source(buildOptions.destFileName))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write("."))
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest(distPath));
}

function browserifyBuild (browserifyOptions: Browserify.Options, buildOptions: BrowserifyBuildOptions): NodeJS.ReadWriteStream {
    let b = browserify(Object.assign({
      extensions: [".js", ".jsx", ".es6", "ts", "tsx"],
      externals: [],
      requires: [],
      transforms: {},
      // create empty caches - so bundles wont share cache
      cache: {},
      packageCache: {},
    }, browserifyOptions));
    // b.plugin("tsify", buildOptions.tsConfig.compilerOptions);
    if (buildOptions.watch) {
      b.plugin(watchify);
      b.on("update", () => bundleBrowserifyBuild(b, buildOptions));
    }
    return bundleBrowserifyBuild(b, buildOptions);
}

gulp.task("browserify:build:js:app", [], function () {
  return browserifyBuild({
    entries: [
      ".tmp/development/entry.js"
    ],
    includes: [
      "client/src",
    ],
  }, {
    watch: false,
    destFileName: "app.js",
    tsConfig: require("./tsconfig.json").compilerOptions,
  });
});

gulp.task("browserify:watch:js:app", [], function () {
  return browserifyBuild({
    entries: [
      ".tmp/development/entry.js"
    ],
    includes: [
      "client/src",
    ],
  }, {
    watch: true,
    destFileName: "app.js",
    tsConfig: require("./tsconfig.json").compilerOptions,
  });
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
