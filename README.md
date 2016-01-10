gulp typescript example project

# Requirements/Recommended

 - [node] `v4+`
 - [atom]
    - Packages
      - [atom-typescript]
      - [atom-lint]
      - [linter-tslint]

# Quick start

```bash
# first time
npm install -g jspm tsd browser-sync
npm install

# every time
browser-sync start --server ./.tmp/development/ --files './.tmp/development/**/*.(css|js|html)'
gulp watch
node ./npm-scripts/watch-gulp-typescript.js
```

# Features

 - [typescript] - javascript type support, also enables ES6 syntax
 - [gulp] - automated build system
 - [tslint] - automatic code style guide enforcement

# How to

## Bundle

```bash
# bundle all together, including libs, no `system.js` dependency
jspm bundle-sfx --minify client/src/app .tmp/all.js

# bundle with libs/app seperate, requires `system.js` lib and config loaded
jspm bundle --minify client/src/app - [npm:**/*] - [github:**/*] .tmp/app.js
jspm bundle --minify client/src/**/* - [client/src/**/*] .tmp/lib.js

```

---

[node]: https://nodejs.org/
[atom]: https://atom.io/
[atom-typescript]: https://atom.io/packages/atom-typescript
[gulp]: http://gulpjs.com/
[typescript]: http://www.typescriptlang.org/
[backbone]: http://backbonejs.org/
[tsd]: http://definitelytyped.org/tsd/
[tslint]: http://palantir.github.io/tslint/
[atom-lint]: https://atom.io/packages/atom-lint
[linter-tslint]: https://atom.io/packages/linter-tslint
[es5-shim]: https://github.com/es-shims/es5-shim
