"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const stream_1 = require("stream");
const csvtojson_1 = __importDefault(require("csvtojson"));
const readable = (0, fs_1.createReadStream)('./hw1.csv');
const writable = (0, fs_1.createWriteStream)('./hw1.txt');
(0, stream_1.pipeline)(readable, (0, csvtojson_1.default)(), writable, (error) => {
    if (error) {
        console.error('Copying has been failed', error);
    }
    else {
        console.log('Success');
    }
});
