"use strict";

import assert from "power-assert";
import count from "../src/count";

describe("count", () => {
  it("counts English words", () => {
    const counts = count("Hello, world!");
    assert(counts.words === 2);
    assert(counts.chars === 13);
  });
  it("counts Japanese words", () => {
    const counts = count("日本語のテスト");
    assert(counts.words === 4);
    assert(counts.chars === 7);
  });
  it("counts mixed words", () => {
    const counts = count("日本語noテスト");
    assert(counts.words === 4);
    assert(counts.chars === 8);
  });
  it("counts string in Buffer", () => {
    const counts = count(new Buffer("Hello, world!"));
    assert(counts.words === 2);
    assert(counts.chars === 13);
  });
  it("counts base64 string", () => {
    const b64String = (new Buffer("Hello, world!")).toString("base64");
    const counts = count(b64String, "base64");
    assert(counts.words === 2);
    assert(counts.chars === 13);
  });
});
