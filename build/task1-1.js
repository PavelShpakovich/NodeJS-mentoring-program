"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const stream_1 = require("stream");
const reverse = new stream_1.Transform({
    transform(chunk, _, callback) {
        callback(null, chunk.toString().trim().split('').reverse().join(''));
    },
});
process_1.stdin.pipe(reverse).pipe(process_1.stdout);
