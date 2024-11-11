/*!-----------------------------------------------------------
* Copyright (c) IJS Technologies. All rights reserved.
* Released under dual BUSL-1.1/commercial license
* https://ijs.network
*-----------------------------------------------------------*/
import { ICidInfo } from './types';
import { cidToHash, hashItems } from './utils';
export { CidCode, ICidData, ICidInfo} from './types';
export { cidToHash, hashContent, hashFile, hashItems, parse} from './utils';
export { FileManager, FileManagerHttpTransport, IFileManagerTransport, IFileManagerTransporterOptions, ISigner, ISignerData, ISignature, FileNode, IGetUploadUrlResult} from './fileManager';

// // @ts-ignore
// import IPFS from "@ijstech/ipfs-utils";
// export interface ICidInfo {
//     cid: string;
//     links?: ICidInfo[];
//     name: string;
//     size: number;
//     type?: 'dir' | 'file'
// }
// export function parse(cid: string): {
//     code: number,
//     version: number,
//     multihash: {
//         code: number,
//         size: number,
//         digest: Uint8Array,
//         bytes: Uint8Array
//     },
//     bytes: Uint8Array
// } {
//     return IPFS.parse(cid);
// };
// export async function hashItems(items?: ICidInfo[], version?: number): Promise<ICidInfo> {    
//     let result: ICidInfo = await IPFS.hashItems(items || [], version);
//     result.type = 'dir';
//     result.links = items;
//     return result;
// };
// export async function hashContent(content: string, version?: number): Promise<ICidInfo> {
//     if (version == undefined)
//         version = 1;
//     // return await IPFS.hashContent(content, version);    
//     if (content.length == 0)
//         return await IPFS.hashContent('', version); 
//     let result: ICidInfo;
//     if (version == 1){
//         result = await IPFS.hashFile(content, version, { //match web3.storage default parameters, https://github.com/web3-storage/web3.storage/blob/3f6b6d38de796e4758f1dffffe8cde948d2bb4ac/packages/client/src/lib.js#L113
//             rawLeaves: true,
//             maxChunkSize: 1048576,
//             maxChildrenPerNode: 1024
//         })
//     }
//     else
//         result = await IPFS.hashFile(content, version);
//     result.type = 'file';
//     return result;
// };
// export async function hashFile(file: File, version?: number): Promise<{cid: string, size: number}>{
//     if (version == undefined)
//         version = 1;
//     if (file.size == 0)
//         return await IPFS.hashContent('', version);

//     return new Promise((resolve, reject)=>{
//         const reader = new FileReader();
//         reader.readAsArrayBuffer(file);
//         reader.addEventListener('error', (event)=>{
//             reject('Error occurred reading file');
//         });
//         reader.addEventListener('load', async (event: any) => {
//             const data = new Uint8Array(event.target.result);
//             let result = await IPFS.hashFile(data, version, { //match web3.storage default parameters, https://github.com/web3-storage/web3.storage/blob/3f6b6d38de796e4758f1dffffe8cde948d2bb4ac/packages/client/src/lib.js#L113
//                 rawLeaves: true,
//                 maxChunkSize: 1048576,
//                 maxChildrenPerNode: 1024
//             });
//             resolve(result);
//         }); 
//     })
// };
export interface IFile extends File{
    path?: string;
    cid?: {
        cid: string;
        size: number;
    };
};
function convertToTree(items: IFile[]): ICidInfo{
    const root:any = {
        $idx: {},
        links: []
    };
    for (const item of items){
        if (item.path && item.cid){
            const paths = item.path.split('/');
            let node: any = root;
            for (const path of paths){
                if (path){
                    if (!node.$idx[path]) {
                        let item = {
                            $idx: {},
                            links: [],
                            name: path,
                            type: 'dir'
                        };
                        node.$idx[path] = item;
                        node.links.push(item);
                    };
                    node = node.$idx[path];
                };  
            };
            delete node.links;
            delete node.$idx;
            node.type = 'file';
            node.size = item.cid.size;
            node.cid = item.cid.cid;
        };        
    };
    return root;
};
async function hashTree(tree: ICidInfo): Promise<ICidInfo>{
    delete (<any>tree).$idx;
    let items = tree.links;
    if (items){
        for (const item of items){
            delete (<any>item).$idx;
            if (item.type == 'dir'){
                await hashTree(item);
            };
        };
        let cid = await hashItems(items);
        tree.type = 'dir';
        tree.cid = cid.cid;
        tree.size = cid.size;
    };
    return tree;
};
export async function hashFiles(files: IFile[], version?: number): Promise<ICidInfo>{
    if (version == undefined)
        version = 1;
    return new Promise(async (resolve, reject)=>{
        try{
            let tree = convertToTree(files);
            let cid = await hashTree(tree);
            resolve(cid);
        }
        catch(err){
            reject(err)
        };
    });
};
export async function cidToSri(cid: string): Promise<string> {
    return await cidToHash(cid);
}