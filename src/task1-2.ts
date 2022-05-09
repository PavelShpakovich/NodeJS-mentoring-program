import { createWriteStream, createReadStream } from 'fs';
import { pipeline } from 'stream';
import csv from 'csvtojson';

const readable = createReadStream('./hw1.csv');
const writable = createWriteStream('./hw1.txt');

pipeline(readable, csv(), writable, (error) => {
  if (error) {
    console.error('Copying has been failed', error);
  } else {
    console.log('Success');
  }
});
