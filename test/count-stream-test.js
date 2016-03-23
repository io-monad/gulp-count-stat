"use strict";

import assert from "power-assert";
import CountStream from "../src/count-stream";

describe("CountStream", () => {
  it("counts string chunks in stream", () => {
    return testStream(["Hello,", " world!"]).then((stream) => {
      assert(stream.words === 2);
      assert(stream.chars === 13);
    });
  });
  it("counts Buffer chunks in stream", () => {
    const chunks = [new Buffer("Hello,"), new Buffer(" world!")]
    return testStream(chunks).then((stream) => {
      assert(stream.words === 2);
      assert(stream.chars === 13);
    });
  });
});

function testStream(chunks) {
  return new Promise((resolve, reject) => {
    const stream = new CountStream();
    stream.on("finish", () => { resolve(stream) });
    stream.on("error", reject);
    chunks.forEach(chunk => stream.write(chunk));
    stream.end();
  });
}
