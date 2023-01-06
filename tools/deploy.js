const {Storage} = require("@ijstech/storage");
const Config = require('../data/config');
const Path = require('path');

async function main(){
    try{
        let storage = new Storage(Config);
        let path = Path.resolve(__dirname, '../dist');
        console.dir(path)
        let result = await storage.putDir(path, {ipfs: true, s3: true}, 'components')
        console.dir(result);
    }
    catch(err){
        console.dir(err)
    }
};
main();