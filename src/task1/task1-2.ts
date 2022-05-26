import { createWriteStream, createReadStream, promises } from 'fs';
import { pipeline } from 'stream';
import csv from 'csvtojson';
const flag = process?.argv[2];

const transferContentByStreams = () => {
    const readable = createReadStream('./assets/hw1.csv');
    const writable = createWriteStream('./assets/hw1.txt');

    pipeline(readable, csv(), writable, (error) => {
        if (error) {
            console.error('Copying has been failed', error);
        } else {
            console.log('Success');
        }
    });
};

const transferContent = async () => {
    try {
        const file = await promises.readFile('./assets/hw1.csv', 'utf8');
        const convertedFile = await csv().fromString(file);
        const json = JSON.stringify(convertedFile[0]);
        await promises.writeFile('./assets/hw1.txt', json);
        console.log('Success');
    } catch (error) {
        console.error('Copying has been failed', error);
    }
};

flag === 'stream' ? transferContentByStreams() : transferContent();
