import { stdin, stdout } from 'process';
import { Transform } from 'stream';

const reverse = new Transform({
  transform(chunk, _, callback) {
    callback(null, chunk.toString().trim().split('').reverse().join(''));
  },
});

stdin.pipe(reverse).pipe(stdout);
