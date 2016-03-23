"use strict";

import assert from "power-assert";
import gulp from "gulp";
import gutil from "gulp-util";
import gulpCountStat from "../src/gulp-count-stat";
import path from "path";

describe("gulp-count-stat", () => {
  context("with tree", () => {
    const pattern1 = getGulpCountStatRunner("pattern1");

    it("shows counts with default options", () => {
      return pattern1().then((log) => {
        assert.deepEqual(log, [
          'bar/ccc/ddd/eee.txt : 13 words 53 characters',
          'foo : 12 words 54 characters',
          '├─ aaa : 10 words 40 characters',
          '│   ├─ bbb.txt : 5 words 24 characters',
          '│   └─ ccc.txt : 5 words 16 characters',
          '└─ bar/baz.txt : 2 words 14 characters',
          'Total : 25 words 107 characters'
        ]);
      });
    });

    it("shows counts with { words: false }", () => {
      return pattern1({ words: false }).then((log) => {
        assert.deepEqual(log, [
          'bar/ccc/ddd/eee.txt : 53 characters',
          'foo : 54 characters',
          '├─ aaa : 40 characters',
          '│   ├─ bbb.txt : 24 characters',
          '│   └─ ccc.txt : 16 characters',
          '└─ bar/baz.txt : 14 characters',
          'Total : 107 characters'
        ]);
      });
    });

    it("shows counts with { chars: false }", () => {
      return pattern1({ chars: false }).then((log) => {
        assert.deepEqual(log, [
          'bar/ccc/ddd/eee.txt : 13 words',
          'foo : 12 words',
          '├─ aaa : 10 words',
          '│   ├─ bbb.txt : 5 words',
          '│   └─ ccc.txt : 5 words',
          '└─ bar/baz.txt : 2 words',
          'Total : 25 words'
        ]);
      });
    });

    it("shows counts with { showFile: false }", () => {
      return pattern1({ showFile: false }).then((log) => {
        assert.deepEqual(log, [
          'bar/ccc/ddd : 13 words 53 characters',
          'foo : 12 words 54 characters',
          '├─ aaa : 10 words 40 characters',
          '└─ bar : 2 words 14 characters',
          'Total : 25 words 107 characters'
        ]);
      });
    });

    it("shows counts with { showDir: false }", () => {
      return pattern1({ showDir: false }).then((log) => {
        assert.deepEqual(log, [
          'bar/ccc/ddd/eee.txt : 13 words 53 characters',
          'foo',
          '├─ aaa',
          '│   ├─ bbb.txt : 5 words 24 characters',
          '│   └─ ccc.txt : 5 words 16 characters',
          '└─ bar/baz.txt : 2 words 14 characters',
          'Total : 25 words 107 characters'
        ]);
      });
    });

    it("shows counts with { showTotal: false }", () => {
      return pattern1({ showTotal: false }).then((log) => {
        assert.deepEqual(log, [
          'bar/ccc/ddd/eee.txt : 13 words 53 characters',
          'foo : 12 words 54 characters',
          '├─ aaa : 10 words 40 characters',
          '│   ├─ bbb.txt : 5 words 24 characters',
          '│   └─ ccc.txt : 5 words 16 characters',
          '└─ bar/baz.txt : 2 words 14 characters',
        ]);
      });
    });
  });

  context("without tree", () => {
    const pattern1 = getGulpCountStatRunner("pattern1", { tree: false });

    it("shows counts with default options", () => {
      return pattern1().then((log) => {
        assert.deepEqual(log, [
          'common/part/bar/ccc/ddd/eee.txt : 13 words 53 characters',
          'common/part/foo/aaa/bbb.txt : 5 words 24 characters',
          'common/part/foo/aaa/ccc.txt : 5 words 16 characters',
          'common/part/foo/aaa : 10 words 40 characters',
          'common/part/foo/bar/baz.txt : 2 words 14 characters',
          'common/part/foo : 12 words 54 characters',
          'Total : 25 words 107 characters'
        ]);
      });
    });

    it("shows counts with { words: false }", () => {
      return pattern1({ words: false }).then((log) => {
        assert.deepEqual(log, [
          'common/part/bar/ccc/ddd/eee.txt : 53 characters',
          'common/part/foo/aaa/bbb.txt : 24 characters',
          'common/part/foo/aaa/ccc.txt : 16 characters',
          'common/part/foo/aaa : 40 characters',
          'common/part/foo/bar/baz.txt : 14 characters',
          'common/part/foo : 54 characters',
          'Total : 107 characters'
        ]);
      });
    });

    it("shows counts with { chars: false }", () => {
      return pattern1({ chars: false }).then((log) => {
        assert.deepEqual(log, [
          'common/part/bar/ccc/ddd/eee.txt : 13 words',
          'common/part/foo/aaa/bbb.txt : 5 words',
          'common/part/foo/aaa/ccc.txt : 5 words',
          'common/part/foo/aaa : 10 words',
          'common/part/foo/bar/baz.txt : 2 words',
          'common/part/foo : 12 words',
          'Total : 25 words'
        ]);
      });
    });

    it("shows counts with { showFile: false }", () => {
      return pattern1({ showFile: false }).then((log) => {
        assert.deepEqual(log, [
          'common/part/bar/ccc/ddd : 13 words 53 characters',
          'common/part/foo/aaa : 10 words 40 characters',
          'common/part/foo/bar : 2 words 14 characters',
          'common/part/foo : 12 words 54 characters',
          'Total : 25 words 107 characters'
        ]);
      });
    });

    it("shows counts with { showDir: false }", () => {
      return pattern1({ showDir: false }).then((log) => {
        assert.deepEqual(log, [
          'common/part/bar/ccc/ddd/eee.txt : 13 words 53 characters',
          'common/part/foo/aaa/bbb.txt : 5 words 24 characters',
          'common/part/foo/aaa/ccc.txt : 5 words 16 characters',
          'common/part/foo/bar/baz.txt : 2 words 14 characters',
          'Total : 25 words 107 characters'
        ]);
      });
    });

    it("shows counts with { showTotal: false }", () => {
      return pattern1({ showTotal: false }).then((log) => {
        assert.deepEqual(log, [
          'common/part/bar/ccc/ddd/eee.txt : 13 words 53 characters',
          'common/part/foo/aaa/bbb.txt : 5 words 24 characters',
          'common/part/foo/aaa/ccc.txt : 5 words 16 characters',
          'common/part/foo/aaa : 10 words 40 characters',
          'common/part/foo/bar/baz.txt : 2 words 14 characters',
          'common/part/foo : 12 words 54 characters',
        ]);
      });
    });
  });
});

function getGulpCountStatRunner(fixtureName, defaultOptions) {
  return function (options) {
    options = Object.assign({}, defaultOptions, options);
    return captureLog(() => new Promise((resolve, reject) => {
      getFixture(fixtureName)
        .pipe(gulpCountStat(options))
        .on("finish", resolve)
        .on("error", reject);
    }));
  };
}

function captureLog(fn) {
  return new Promise((resolve, reject) => {
    const realGutilLog = gutil.log;
    const colorsEnabled = gutil.colors.enabled;
    const restore = () => {
      gutil.log = realGutilLog;
      gutil.colors.enabled = colorsEnabled;
    };

    const lines = [];
    gutil.log = function () {
      const args = Array.prototype.slice.call(arguments);
      lines.push(args.join(" "));
    };
    gutil.colors.enabled = false;

    try {
      fn().then(() => {
        restore();
        resolve(lines);
      }).catch((err) => {
        restore();
        reject(err);
      });
    } catch (e) {
      restore();
      reject(e);
    }
  });
}

function getFixture(fixturePath) {
  fixturePath = path.join(__dirname, "fixture", fixturePath);
  return gulp.src(`${fixturePath}/**/*.txt`);
}
