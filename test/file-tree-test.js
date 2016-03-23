"use strict";

import assert from "power-assert";
import {FileTree} from "../src/file-tree";

const mockPaths = [
  "common/part/foo/bar/baz.txt",
  "common/part/foo/aaa/bbb.txt",
  "common/part/bar/ccc/ddd/eee.txt",
];

describe("FileTree", () => {
  let emptyTree;
  let fileTree;
  beforeEach(() => {
    emptyTree = new FileTree();
    fileTree = new FileTree(mockPaths);
  });

  describe("#constructor", () => {
    it("returns FileTree", () => {
      assert(fileTree instanceof FileTree);
    });
    it("builds root-only tree by default", () => {
      assert(emptyTree.tree.children.length === 0);
    });
    it("builds tree for path list", () => {
      const tree = fileTree.tree;
      assert(tree.children.length === 1);
      assert(tree.children[0].name === "common");
      assert(tree.children[0].children.length === 1);
      assert(tree.children[0].children[0].name === "part");
      assert(tree.children[0].children[0].children.length === 2);

      const foo = tree.children[0].children[0].children[0];
      assert(foo.name === "foo");
      assert(foo.children.length === 2);
      assert(foo.children[0].name === "bar");
      assert(foo.children[0].children.length === 1);
      assert(foo.children[0].children[0].name === "baz.txt");
      assert(foo.children[0].children[0].children.length === 0);
      assert(foo.children[1].name === "aaa");
      assert(foo.children[1].children.length === 1);
      assert(foo.children[1].children[0].name === "bbb.txt");
      assert(foo.children[1].children[0].children.length === 0);

      const bar = tree.children[0].children[0].children[1];
      assert(bar.name === "bar");
      assert(bar.children.length === 1);
      assert(bar.children[0].name === "ccc");
      assert(bar.children[0].children.length === 1);
      assert(bar.children[0].children[0].name === "ddd");
      assert(bar.children[0].children[0].children.length === 1);
      assert(bar.children[0].children[0].children[0].name === "eee.txt");
      assert(bar.children[0].children[0].children[0].children.length === 0);
    });
  });

  describe("#add", () => {
    it("adds node to tree", () => {
      emptyTree.add("foo/bar.txt");
      assert(emptyTree.tree.children.length === 1);
      assert(emptyTree.tree.children[0].name === "foo");
      assert(emptyTree.tree.children[0].children.length === 1);
      assert(emptyTree.tree.children[0].children[0].name === "bar.txt");
      assert(emptyTree.tree.children[0].children[0].children.length === 0);
    });
    it("returns added node", () => {
      const added = emptyTree.add("foo/bar.txt");
      assert(added === emptyTree.tree.children[0].children[0]);
    });
  });

  describe("#addPaths", () => {
    it("adds nodes to tree", () => {
      emptyTree.addPaths(["foo/bar.txt", "baz.txt"]);
      assert(emptyTree.tree.children.length === 2);
      assert(emptyTree.tree.children[0].name === "foo");
      assert(emptyTree.tree.children[0].children.length === 1);
      assert(emptyTree.tree.children[0].children[0].name === "bar.txt");
      assert(emptyTree.tree.children[0].children[0].children.length === 0);
      assert(emptyTree.tree.children[1].name === "baz.txt");
      assert(emptyTree.tree.children[1].children.length === 0);
    });
    it("returns added nodes", () => {
      const added = emptyTree.addPaths(["foo/bar.txt", "baz.txt"]);
      assert(added instanceof Array);
      assert(added.length === 2);
      assert(added[0] === emptyTree.tree.children[0].children[0]);
      assert(added[1] === emptyTree.tree.children[1]);
    });
  });

  describe("#get", () => {
    it("finds a node by given path", () => {
      const node = fileTree.get("common/part/foo/aaa/bbb.txt");
      assert(node.path === "common/part/foo/aaa/bbb.txt");
    });
    it("returns null for unexisting path", () => {
      assert(fileTree.get("nonexisting.txt") === null);
    });
  });

  describe("#toString", () => {
    it("returns a String", () => {
      assert(typeof fileTree.toString() === "string");
    });
    it("returns a tree with ruled lines", () => {
      const lines = fileTree.toString().split(/\n/);
      assert.deepEqual(lines, [
        ".",
        "└─ common",
        "     └─ part",
        "          ├─ foo",
        "          │   ├─ bar",
        "          │   │   └─ baz.txt",
        "          │   └─ aaa",
        "          │        └─ bbb.txt",
        "          └─ bar",
        "               └─ ccc",
        "                    └─ ddd",
        "                         └─ eee.txt",
      ]);
    });
    it("skips root with skipRoot option", () => {
      const lines = fileTree.toString({ skipRoot: true }).split(/\n/);
      assert.deepEqual(lines, [
        "common",
        "└─ part",
        "     ├─ foo",
        "     │   ├─ bar",
        "     │   │   └─ baz.txt",
        "     │   └─ aaa",
        "     │        └─ bbb.txt",
        "     └─ bar",
        "          └─ ccc",
        "               └─ ddd",
        "                    └─ eee.txt",
      ]);
    });
  });

  describe("#toObject", () => {
    it("returns an Object", () => {
      assert(typeof fileTree.toObject() === "object");
    });
    it("returns a plain Object of files", () => {
      assert.deepEqual(fileTree.toObject(), {
        "common": {
          "part": {
            "foo": {
              "bar": { "baz.txt": {} },
              "aaa": { "bbb.txt": {} },
            },
            "bar": {
              "ccc": { "ddd": { "eee.txt": {} } }
            }
          }
        }
      });
    });
    it("includes data with dataKey specified", () => {
      fileTree.get("common/part/foo/bar/baz.txt").data = "This is baz.txt";
      fileTree.get("common/part/bar/ccc").data = "This is ccc directory";
      assert.deepEqual(fileTree.toObject({ dataKey: "_data" }), {
        "_data": null,
        "common": { "_data": null,
          "part": { "_data": null,
            "foo": { "_data": null,
              "bar": { "_data": null,
                "baz.txt": { "_data": "This is baz.txt" },
              },
              "aaa": { "_data": null,
                "bbb.txt": { "_data": null },
              },
            },
            "bar": { "_data": null,
              "ccc": { "_data": "This is ccc directory",
                "ddd": { "_data": null,
                  "eee.txt": { "_data": null }
                }
              }
            }
          }
        }
      });
    });
  });

  describe("#walk", () => {
    it("walks through every node in tree", () => {
      const walked = [];
      fileTree.walk(node => { walked.push(node.path) });
      assert.deepEqual(walked, [
        ".",
        "common",
        "common/part",
        "common/part/foo",
        "common/part/foo/bar",
        "common/part/foo/bar/baz.txt",
        "common/part/foo/aaa",
        "common/part/foo/aaa/bbb.txt",
        "common/part/bar",
        "common/part/bar/ccc",
        "common/part/bar/ccc/ddd",
        "common/part/bar/ccc/ddd/eee.txt",
      ]);
    });
    it("stops walking when callback returned false", () => {
      const walked = [];
      fileTree.walk(node => {
        walked.push(node.path);
        if (node.path === "common/part/foo/bar") return false;
      });
      assert.deepEqual(walked, [
        ".",
        "common",
        "common/part",
        "common/part/foo",
        "common/part/foo/bar",
      ]);
    });
  });

  describe("#walkDepthFirst", () => {
    it("walks through every node in tree by depth-first", () => {
      const walked = [];
      fileTree.walkDepthFirst(node => { walked.push(node.path) });
      assert.deepEqual(walked, [
        "common/part/foo/bar/baz.txt",
        "common/part/foo/bar",
        "common/part/foo/aaa/bbb.txt",
        "common/part/foo/aaa",
        "common/part/foo",
        "common/part/bar/ccc/ddd/eee.txt",
        "common/part/bar/ccc/ddd",
        "common/part/bar/ccc",
        "common/part/bar",
        "common/part",
        "common",
        ".",
      ]);
    });
    it("stops walking when callback returned false", () => {
      const walked = [];
      fileTree.walkDepthFirst(node => {
        walked.push(node.path);
        if (node.path === "common/part/foo/aaa") return false;
      });
      assert.deepEqual(walked, [
        "common/part/foo/bar/baz.txt",
        "common/part/foo/bar",
        "common/part/foo/aaa/bbb.txt",
        "common/part/foo/aaa",
      ]);
    });
  });

  describe("#walkLeaf", () => {
    it("walks through only leaf nodes in tree", () => {
      const walked = [];
      fileTree.walkLeaf(node => { walked.push(node.path) });
      assert.deepEqual(walked, [
        "common/part/foo/bar/baz.txt",
        "common/part/foo/aaa/bbb.txt",
        "common/part/bar/ccc/ddd/eee.txt",
      ]);
    });
    it("stops walking when callback returned false", () => {
      const walked = [];
      fileTree.walkLeaf(node => {
        walked.push(node.path);
        if (node.path === "common/part/foo/aaa/bbb.txt") return false;
      });
      assert.deepEqual(walked, [
        "common/part/foo/bar/baz.txt",
        "common/part/foo/aaa/bbb.txt",
      ]);
    });
  });

  describe("#map", () => {
    it("maps every node in tree to returned values", () => {
      const mapped = fileTree.map(node => node.path);
      assert.deepEqual(mapped, [
        ".",
        "common",
        "common/part",
        "common/part/foo",
        "common/part/foo/bar",
        "common/part/foo/bar/baz.txt",
        "common/part/foo/aaa",
        "common/part/foo/aaa/bbb.txt",
        "common/part/bar",
        "common/part/bar/ccc",
        "common/part/bar/ccc/ddd",
        "common/part/bar/ccc/ddd/eee.txt",
      ]);
    });
  });

  describe("#mapLeaf", () => {
    it("maps leaf nodes in tree to returned values", () => {
      const mapped = fileTree.mapLeaf(node => node.path);
      assert.deepEqual(mapped, [
        "common/part/foo/bar/baz.txt",
        "common/part/foo/aaa/bbb.txt",
        "common/part/bar/ccc/ddd/eee.txt",
      ]);
    });
  });

  describe("#print", () => {
    function captureLog(fn) {
      const realConsoleLog = console.log;
      const lines = [];
      console.log = function () {
        const args = Array.prototype.slice.call(arguments);
        lines.push(args.join(" "));
      };
      try {
        fn();
      } catch (e) {
        console.log = realConsoleLog;
        throw e;
      }
      console.log = realConsoleLog;
      return lines;
    }

    it("prints tree to console", () => {
      const lines = captureLog(() => { fileTree.print() });
      assert.deepEqual(lines, [
        ".",
        "└─ common",
        "     └─ part",
        "          ├─ foo",
        "          │   ├─ bar",
        "          │   │   └─ baz.txt",
        "          │   └─ aaa",
        "          │        └─ bbb.txt",
        "          └─ bar",
        "               └─ ccc",
        "                    └─ ddd",
        "                         └─ eee.txt",
      ]);
    });
    it("prints tree by returned string by callback", () => {
      const lines = captureLog(() => {
        fileTree.print(node => `${node.getTreePrefix()}[${node.name}]`);
      });
      assert.deepEqual(lines, [
        "[.]",
        "└─ [common]",
        "     └─ [part]",
        "          ├─ [foo]",
        "          │   ├─ [bar]",
        "          │   │   └─ [baz.txt]",
        "          │   └─ [aaa]",
        "          │        └─ [bbb.txt]",
        "          └─ [bar]",
        "               └─ [ccc]",
        "                    └─ [ddd]",
        "                         └─ [eee.txt]",
      ]);
    });
    it("prints tree by returned prefix and suffix by callback", () => {
      const lines = captureLog(() => {
        fileTree.print(node => { return { prefix: "<<", suffix: ">>" } });
      });
      assert.deepEqual(lines, [
        "<< . >>",
        "└─ << common >>",
        "     └─ << part >>",
        "          ├─ << foo >>",
        "          │   ├─ << bar >>",
        "          │   │   └─ << baz.txt >>",
        "          │   └─ << aaa >>",
        "          │        └─ << bbb.txt >>",
        "          └─ << bar >>",
        "               └─ << ccc >>",
        "                    └─ << ddd >>",
        "                         └─ << eee.txt >>",
      ]);
    });
    it("skips printing root with skipRoot option", () => {
      const lines = captureLog(() => {
        fileTree.print({ skipRoot: true });
      });
      assert.deepEqual(lines, [
        "common",
        "└─ part",
        "     ├─ foo",
        "     │   ├─ bar",
        "     │   │   └─ baz.txt",
        "     │   └─ aaa",
        "     │        └─ bbb.txt",
        "     └─ bar",
        "          └─ ccc",
        "               └─ ddd",
        "                    └─ eee.txt",
      ]);
    });
  });

  describe("#filter", () => {
    it("filters nodes by tester function", () => {
      fileTree.filter(node => !/bar$/.test(node.path));
      assert.deepEqual(fileTree.map(node => node.path), [
        ".",
        "common",
        "common/part",
        "common/part/foo",
        "common/part/foo/aaa",
        "common/part/foo/aaa/bbb.txt",
      ]);
    });
  });

  describe("#reject", () => {
    it("rejects nodes by tester function", () => {
      fileTree.reject(node => /bar$/.test(node.path));
      assert.deepEqual(fileTree.map(node => node.path), [
        ".",
        "common",
        "common/part",
        "common/part/foo",
        "common/part/foo/aaa",
        "common/part/foo/aaa/bbb.txt",
      ]);
    });
  });

  describe("#foldRoot", () => {
    it("folds redundant path at root", () => {
      const lines = fileTree.foldRoot().toString().split(/\n/);
      assert.deepEqual(lines, [
        "common/part",
        "├─ foo",
        "│   ├─ bar",
        "│   │   └─ baz.txt",
        "│   └─ aaa",
        "│        └─ bbb.txt",
        "└─ bar",
        "     └─ ccc",
        "          └─ ddd",
        "               └─ eee.txt",
      ]);
    });
  });

  describe("#fold", () => {
    it("folds all redundant paths", () => {
      const lines = fileTree.fold().toString().split(/\n/);
      assert.deepEqual(lines, [
        "common/part",
        "├─ foo",
        "│   ├─ bar/baz.txt",
        "│   └─ aaa/bbb.txt",
        "└─ bar/ccc/ddd/eee.txt",
      ]);
    });
  });

  describe("#sort", () => {
    it("sorts paths in alphabetical order", () => {
      const lines = fileTree.sort().toString().split(/\n/);
      assert.deepEqual(lines, [
        ".",
        "└─ common",
        "     └─ part",
        "          ├─ bar",
        "          │   └─ ccc",
        "          │        └─ ddd",
        "          │             └─ eee.txt",
        "          └─ foo",
        "               ├─ aaa",
        "               │   └─ bbb.txt",
        "               └─ bar",
        "                    └─ baz.txt",
      ]);
    });
  });
});
