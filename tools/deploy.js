const {Storage} = require("@ijstech/storage");
const Config = require('../data/config');
const Path = require('path');

async function main(){
    let storage = new Storage(Config);
    let path = Path.resolve(__dirname, '../dist');
    let result = await storage.syncDirTo(path, {ipfs: true})
    console.dir(result);
};
main();