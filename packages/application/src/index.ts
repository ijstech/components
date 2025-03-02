import {IModule} from '@ijstech/types';
import {LibPath, RequireJS, I18n, Permissions} from '@ijstech/base';
import {Locales} from '@ijstech/types';
import {EventBus} from './event-bus';
import {GlobalEvents} from './globalEvent';
import {applicationStyle} from './styles/index.css';
import {cidToHash, hashContent, hashFile, hashFiles, hashItems, ICidInfo} from '@ijstech/ipfs';
// import {Upload, UploadModal, UploadRawFile} from '@ijstech/upload';
declare var _currentDefineModule: any;
declare var DOMPurify: any;
const API_IPFS_BASEURL = '/api/ipfs/v0';

const dynamicImport = new Function('specifier', 'return import(specifier)');
export interface IGeo {
    enabled: boolean;
    apiUrl?: string;
    blockedCountries: string[];
    moduleOnBlocking: string;
};
export interface IGeoInfo {
    country: string;
    timezone: string;
};
export interface IHasDependencies{
    assets?: string;
    bundle?: boolean;
    ipfs?: string;
    rootDir?: string;
    moduleDir?: string;
    libDir?: string;
    main?: string;
    geo?: IGeo;    
    dependencies?: {[name: string]: string};
    modules?: {[name: string]: {path: string, dependencies: string[]}}
    script?: string;
}
export interface IModuleRoute extends IHasDependencies{
    url: string;
    module: string;
    default?: boolean;
}
export interface IModuleMenuItem {
    text: string;
    to: string;
    isToExternal?: boolean;
    img?: string;
    subItems?: IModuleMenuItem[];
    isDisabled?: boolean;
    supportedChainIds?: number[];
    env?: string[];
}
export interface IModuleOptions extends IHasDependencies{
    codeCID?: string;
    name?: string;
    main?: string;
    type?: number;
    version?: string;
    root?: string;
    routes?: IModuleRoute[],
    params?: any;
    menuItems?: IModuleMenuItem[];
    env?: string;
}
export enum IpfsDataType {
    Raw = 0,
    Directory = 1,
    File = 2,
    Metadata = 3,
    Symlink = 4,
    HAMTShard = 5
};

export interface IUploadResult {
    success: boolean;
    error?: string;
    data?: ICidInfo;
};
export interface IUploadItem {
    cid: ICidInfo,
    data?: File | string
};
function topologicalSort(edges:[string,string][]) {
    let nodes: any = {}, sorted: string[] = [], visited: {[name: string]:boolean} = {};

    class TSortNode{
        id: string;
        afters: string[];
        constructor(id: string){
            this.id = id;
            this.afters = [];
        }
    };
    edges.forEach( (v)=> {
        let from = v[0], to = v[1];
        if (!nodes[from]) nodes[from] = new TSortNode(from);
        if (!nodes[to]) nodes[to] = new TSortNode(to);
        nodes[from].afters.push(to);
    });

    Object.keys(nodes).forEach(function visit(idstr: string, ancestors: any) {
        let node = nodes[idstr],id = node.id;

        if (visited[idstr]) return;
        if (!Array.isArray(ancestors)) 
            ancestors = [];

        ancestors.push(id);
        visited[idstr] = true;
        node.afters.forEach(function (afterID: string) {
            if (ancestors.indexOf(afterID) >= 0)  
                throw new Error('closed chain : ' + afterID + ' is in ' + id);
            visit(afterID.toString(), ancestors.map(function (v: string) { return v })); 
        });
        sorted.unshift(id);
    });
    return sorted;
};

interface IDevInfo {
    data?: {[name: string]: any};
    paths?: {[name: string]: any};
}

export class Application{
    private static _instance: Application;    
    private modules: {[path: string]: any} = {};
    private modulesId: {[path: string]: string} = {};
    private scripts: {[path: string]: string} = {};
    private loadedScripts: {[path: string]: boolean} = {};
    public globalEvents: GlobalEvents;
    private id = 0;
    public currentModulePath: string;
    public currentModuleDir: string;
    public LibHost = '';
    private packageNames: Set<string> = new Set();
    private packages: {[name: string]: any} = {};
    private packageDependencies: {[name: string]: string[]} = {};
    public _assets: {[name: string]: any};
    private _initOptions?: IHasDependencies;
    // private _uploadModal: UploadModal;
    private cidItems: {[cid: string]: ICidInfo} = {};
    public geoInfo: IGeoInfo;
    private bundleLibs: {[packageName: string]: string} = {};
    public store: Record<string, any> = {};
    public rootDir: string = '';
    public assetsDir: string = '';
    public dev: IDevInfo|null = null;
    private _locale: Locales = 'en';
    private _i18n: I18n;
    private static _modules: {[name: string]: IModule} = {};
    private _permissions: Permissions;

    static updateLocale(): void {
        for (let key in this._modules){
            this._modules[key].updateLocale();
        };
    };
    static registerModule(uuid: string, module: IModule){
        this._modules[uuid] = module;
    };
    static unregisterModule(uuid: string){
        delete this._modules[uuid];
    };
    private constructor(){
        this.globalEvents = new GlobalEvents();
    }
    public get EventBus(){
        return EventBus.getInstance();
    } 
    public static get Instance(){        
        return this._instance || (this._instance = new this());
    };    
    assets(name: string): any{
        if (this._assets){
            let items = name.split('/');
            let value = this._assets;
            let item = items.shift();
            while (value && item){
                value = value[item];
                item = items.shift();
            };
            return value;
        };
    };
    private resolvePackageSCConfigPath(packageName: string) {
        let options = this._initOptions;
        let rootDir = (options?.rootDir ? options?.rootDir : "");
        if (!rootDir.endsWith('/'))
            rootDir = rootDir + '/';
        let libDir = (options?.libDir ? options?.libDir + "/" : "libs/");
        let path = rootDir + libDir + packageName + '/scconfig.json'
        return path;
    }
    private async calculatePackageModuleDir(packageName: string, modulePath?: string) {
        let packageModulePath = await this.resolvePackageModulePath(packageName, modulePath || '*') || '';
        let currentModuleDir: string;
        if (packageModulePath.indexOf('://') > 0)
            currentModuleDir = packageModulePath.split('/').slice(0, -1).join('/')
        else if (!packageModulePath.startsWith('/'))
            currentModuleDir = this.LibHost + this.rootDir + packageModulePath.split('/').slice(0, -1).join('/')
        else
            currentModuleDir = this.LibHost + packageModulePath.split('/').slice(0, -1).join('/')
        return currentModuleDir;
    }
    async createElement(name: string, lazyLoad?: boolean, attributes?: {[name: string]: string}, modulePath?: string): Promise<HTMLElement | undefined>{
        name = name.split('/').pop() || name;
        let elementName = `i-${name}`;
        let result;
        let packageName = `@scom/${name}`;
        try{
            if (window.customElements.get(elementName)){
                let currentModuleDir = await this.calculatePackageModuleDir(packageName, modulePath || '*');
                result = document.createElement(elementName) as IModule;
                result.currentModuleDir = currentModuleDir;;
            }
            else{
                let scconfigPath = this.resolvePackageSCConfigPath(packageName);
                if (scconfigPath) {
                    let scconfigResponse = await fetch(scconfigPath);
                    if (scconfigResponse.status == 200) {
                        let scconfig = await scconfigResponse.json();
                        if (scconfig) {
                            let promisesMap: Record<string, Promise<string>> = {};
                            let packageModulePathMap: Record<string, string> = {};
                            for (let dependency of scconfig.dependencies) {
                                if (dependency === '@ijstech/components' || this.packageNames.has(dependency)) continue;
                                let packageModulePath = await this.resolvePackageModulePath(dependency, modulePath || '*');
                                if (!packageModulePath || this.packages[packageModulePath]) continue;
                                try{
                                    let m = (<any>window)['require'](dependency);
                                    if (m){
                                        if (!this.packageNames.has(dependency)) 
                                            this.packageNames.add(dependency);
                                        this.packages[packageModulePath] = m.default || m;
                                        continue;
                                    };
                                }
                                catch(err){
                                };
                                packageModulePathMap[dependency] = packageModulePath;
                                promisesMap[dependency] = this.getScript(packageModulePath);
                            };
                            let dependenciesArr = Object.keys(promisesMap);
                            let scripts = await Promise.all(Object.values(promisesMap));
                            for (let i = 0; i < dependenciesArr.length; i++) {
                                let dependency = dependenciesArr[i];
                                let packageModulePath = packageModulePathMap[dependency];
                                let script = scripts[i];
                                if (script) {
                                    await this.dynamicImportPackage(script, dependency, packageModulePath);
                                };
                            }
                        }
                    };
                };
                let loaded = await this.loadPackage(packageName, modulePath || '*');
                if (loaded) {
                    let currentModuleDir = await this.calculatePackageModuleDir(packageName, modulePath || '*');
                    result = document.createElement(elementName) as IModule;
                    result.currentModuleDir = currentModuleDir;
                }
            };
            if (result){
                if (lazyLoad)
                    result.setAttribute('lazyLoad', 'true');
                for (let name in attributes){
                    result.setAttribute(name, attributes[name]);
                };
            };
        }
        catch(err){
            console.dir(err)
        };        
        return result;
    };            
    fetch(input: RequestInfo, init?: RequestInit | undefined): Promise<Response>{
        if (typeof(input) == 'string'){
            let url = input as string;
            if (url.indexOf('://') < 0 && !url.startsWith('/'))
                input = `${this.rootDir}${url}`;
        }
        else if (input instanceof Request){
            let req = input as Request;
            if (req.url.indexOf('://') < 0 && !req.url.startsWith('/')){
                input = new Request(`${this.rootDir}${req.url}`)
            };            
        };
        return fetch(input, init);
    };
    async postData(endpoint: string, data: any) {
        data = data || {};
        const response = await fetch(endpoint, {
            method: 'POST', 
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            referrerPolicy: 'no-referrer', 
            body: JSON.stringify(data)
        });
        return response.json(); 
    };
    // async showUploadModal(): Promise<void>{
    //     if (!this._uploadModal)
    //         this._uploadModal = new UploadModal();
    //     this._uploadModal.show();
    // };
    async getUploadUrl(item: ICidInfo): Promise<{[cid: string]: string}>{
        let {data} = await this.postData(`${API_IPFS_BASEURL}/upload`, {data: item});
        return data || {};
    };
    get i18n(): I18n{
        if (!this._i18n)
            this._i18n = new I18n();
        return this._i18n;
    };
    get locale(): Locales{
        return this._locale;
    };
    set locale(value: Locales){
        if (this._locale != value){
            this._locale = value;
            Application.updateLocale();
        };
    };
    get permissions(): Permissions{
        if (!this._permissions)
            this._permissions = new Permissions();
        return this._permissions;
    };
    async uploadData(fileName: string, content: string): Promise<IUploadResult>{
        let cid = await hashContent(content);
        let item: ICidInfo = {
            cid: cid.cid,
            name: fileName,
            size: cid.size,
            type: 'file'
        };
        let dir = await hashItems([item]);
        let data = await this.getUploadUrl(dir);
        if (data?.[dir.cid] && data?.[cid.cid]){
            let dirStatus = await this.upload(data[dir.cid], JSON.stringify(dir));
            let fileStatus = await this.upload(data[cid.cid], content);
            if (dirStatus == 200 && fileStatus == 200)
                return {success: true, data: dir} //result url: https://<ipfs-gateway>/ipfs/${result.data.cid/${result.data.links[0].name}}
            else
                return {success: false, error: `Failed to upload file. Status code: ${fileStatus}`}
        }
        else
            return {success: false};
    };
    // async uploadFile(extensions?: string | string[]): Promise<IUploadResult> {
    //     return new Promise(async (resolve, reject) => {
    //         const input = document.createElement("input");
    //         input.type = "file";
    //         if (extensions){
    //             const accept = Array.isArray(extensions) ? extensions.map((ext) => `.${ext}`).join(",") : `.${extensions}`;
    //             input.accept = accept;
    //         };
    //         input.addEventListener("change", async () => {
    //             const file: UploadRawFile = <UploadRawFile>input.files?.[0];
    //             if (file) {
    //                 file.path = `/${file.name}`;                
    //                 file.cid = await hashFile(file);
    //                 let dir = await hashFiles([file]);
    //                 let {data} = await this.postData(`${API_IPFS_BASEURL}/upload`, {data: dir});
    //                 if (data?.[file.cid.cid]){
    //                     let result = await this.upload(data[file.cid.cid], file);
    //                 };
    //                 if (data?.[dir.cid]){
    //                     let result = await this.upload(data[dir.cid], JSON.stringify(dir));
    //                 };
    //                 resolve({
    //                     success: true,
    //                     data: dir
    //                 })
    //                 //result url: https://<ipfs-gateway>/ipfs/${result.data.cid/${result.data.links[0].name}}
    //             } 
    //             else {
    //                 reject({success: false, error: "No file selected"});
    //             }   
    //         });
    //         input.click();
    //     });
    // };
    async uploadTo(targetCid: string, items: IUploadItem[]): Promise<IUploadResult>{
        let cid: ICidInfo = await (await fetch(`${API_IPFS_BASEURL}/stat/${targetCid}`)).json();
        if (cid?.links){
            for (let i = 0; i < items.length; i ++){
                let item = items[i];
                let exists = false;
                for (let k = 0; k < cid.links.length; k ++){
                    if (cid.links[k].name == item.cid.name){
                        cid.links[k] = item.cid;
                        exists = true;
                        break;
                    };
                };
                if (!exists)
                    cid.links.push(item.cid);
            };
            let newCid = await hashItems(cid.links);
            let uploadUrl = await this.getUploadUrl(newCid);
            for (let i = 0; i < items.length; i ++){
                let item = items[i];
                if (uploadUrl[item.cid.cid]){
                    let data: File | string | undefined;
                    if (item.cid.type == 'dir')
                        data = item.data || JSON.stringify(item.cid)
                    else
                        data = item.data;
                    if (!data)
                        throw new Error(`Missing upload data: ${item.cid.name}`);
                    let result = await this.upload(uploadUrl[item.cid.cid], data);
                    if (result != 200)
                        throw new Error(`File upload failed: ${item.cid.name}`);
                };
            };
            if (uploadUrl[newCid.cid]){
                let result = await this.upload(uploadUrl[newCid.cid], JSON.stringify(newCid));
                if (result != 200)
                    throw new Error(`File upload failed: ${newCid.cid}`);
            };
            return {
                success: true,
                data: newCid
            };
        };
        throw new Error(`Target CID not found: ${targetCid}`);
    };
    async upload(url: string, data: File | string): Promise<number>{
        return new Promise(async (resolve)=>{
            if (typeof(data) == 'string'){
                let result = await fetch(url, {
                    method: 'PUT',
                    body: data
                });
                resolve(result.status);
            }
            else{
                const reader = new FileReader();
                reader.onload = async ()=>{
                    let result = await fetch(url, {
                        method: 'PUT',
                        body: reader.result
                    });
                    resolve(result.status);
                };
                reader.onerror = ()=>{
                    resolve(0);
                };
                reader.readAsArrayBuffer(data);
            };
        });
    };
    private async getCidItem(host: string, cid: string, paths: string []): Promise<ICidInfo | undefined>{        
        if (paths.length > 0){
            let cidItem = this.cidItems[cid];
            if (!cidItem){
                try{
                    let data = localStorage.getItem(cid);
                    if (data)
                        cidItem = JSON.parse(data)
                }
                catch(err){};
                if (!cidItem)
                    cidItem = await (await fetch(`${host}/${cid}`)).json();
                let id = await hashItems(cidItem.links);
                if (id.cid != cid)
                    throw new Error('CID not match');
                try{
                    localStorage.setItem(cid, JSON.stringify(cidItem));
                }
                catch(err){}
                this.cidItems[cid] = cidItem;
            };    
            if (cidItem && cidItem.links){
                let path = paths.shift();
                for (let i = 0; i < cidItem.links.length; i++){
                    if (cidItem.links[i].name == path){
                        if (cidItem.links[i].type == 'dir')
                            return await this.getCidItem(host, cidItem.links[i].cid, paths)
                        else{
                            return cidItem.links[i]
                        };
                    };
                };
            };
        };
        return;
    };
    private async verifyScript(modulePath: string, script: string): Promise<boolean>{
        if (this._initOptions?.ipfs && typeof(this._initOptions?.ipfs) == 'string'){
            try{
                let paths = modulePath.split("/");
                let cid = await this.getCidItem('/ipfs', this._initOptions.ipfs, paths);
                if (!cid)
                    return false;
                let scriptCid = await hashContent(script);
                return cid.cid == scriptCid.cid;
            }
            catch(err){
                return false;
            }
        };
        return true;
    };
    private async getScript(modulePath: string): Promise<string>{
        if (this.scripts[modulePath])
            return this.scripts[modulePath]
        try{
            let result = await (await this.fetch(modulePath)).text();                        
            if (typeof(result) == 'string'){
                if (await this.verifyScript(modulePath, result)){
                    this.scripts[modulePath] = result;
                    return result;
                };
            };
        }
        catch(err){};
        return '';
    };
    async loadScript(modulePath: string, script?: string, forcedSave: boolean = false): Promise<boolean>{
        try{
            if (this.scripts[modulePath])
                return true;
            if (!script)
                script = await this.getContent(modulePath);
            if (script && (forcedSave || await this.verifyScript(modulePath, script))){
                this.scripts[modulePath] = script;
                await dynamicImport(`data:text/javascript,${encodeURIComponent(script)}`);
                return true;
            };
        }
        catch(err){};
        return false;
    };
    async loadScriptWithIntegrity(modulePath: string, integrity = '', crossorigin = 'anonymous') {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.loadedScripts[modulePath])
                    return true;
                let checkedIntegrity = integrity;
                if (!checkedIntegrity && this._initOptions?.ipfs && typeof(this._initOptions?.ipfs) == 'string'){
                    try{
                        const paths = modulePath.split("/");
                        const cid = await this.getCidItem('/ipfs', this._initOptions.ipfs, paths);
                        if (cid) checkedIntegrity = cidToHash(cid?.cid);
                    }
                    catch(err){
                    }
                };
                const script = document.createElement('script');
                script.src = modulePath;
                if (checkedIntegrity) script.integrity = checkedIntegrity;
                script.crossOrigin = crossorigin;
                script.async = true;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
                this.loadedScripts[modulePath] = true;
            } catch(err) {
                reject(err)
            }           
        })
    }
    async getContent(modulePath: string): Promise<string>{
        try{
            return await (await this.fetch(modulePath)).text();
        }
        catch(err){}
        return '';
    };
    async getJSONContent(modulePath: string): Promise<any>{
        try{
            return await (await this.fetch(modulePath)).json();
        }
        catch(err){}
        return;
    };
    async fetchDirectoryInfoByCID(ipfsCid: string): Promise<ICidInfo[]> {
        try {
            const IPFS_API = `https://ipfs.scom.dev/ipfs/${ipfsCid}`;
            let result = await fetch(IPFS_API);
            let jsonContent = await result.json();
            if (jsonContent.links) 
                return jsonContent.links;
            return [];
        }
        catch (err) {
            console.log(err);
        };
        return [];
    };
    // async getModule(modulePath: string, options?: IModuleOptions): Promise<Module|null>{
    //     if (this.modules[modulePath])
    //         return this.modules[modulePath];
    //     let result = await this.newModule(modulePath, options);
    //     if (result)
    //         this.modules[modulePath] = result;
    //     return result;
    // };
    public async resolvePackageDependencies(packageName: string, result?: string[]): Promise<string[]>{
        result = result || [];
        let deps: string[] = this.packageDependencies[packageName];
        if (deps){
            for (let i = 0; i < deps.length; i++){
                let p = deps[i];
                if (!result.includes(p)){
                    result.push(p);
                };
            };
        }
        else{
            let scConfigPath = this.resolvePackageSCConfigPath(packageName);
            let scconfig = await this.getJSONContent(scConfigPath);            
            if (scconfig?.dependencies){
                this.packageDependencies[packageName] = scconfig?.dependencies;
                for (let i = 0; i < scconfig.dependencies.length; i++){
                    let p = scconfig.dependencies[i];                                         
                    await this.resolvePackageDependencies(p, result);
                    if (!result.includes(p))
                        result.push(p);
                };
            }
            else
                this.packageDependencies[packageName] = [];
        };
        return result;
    };
    private async resolvePackageModulePath(packageName: string, modulePath?: string) {
        let options = this._initOptions;
        if (options && options.modules && options.modules[packageName]){
            let pack = options.modules[packageName];
            for (let i = 0; i < pack.dependencies?.length; i ++){
                let n = pack.dependencies[i]
                if (!RequireJS.defined(n))
                    await this.loadPackage(n);
            };
        };
        let rootDir = (options?.rootDir ? options?.rootDir : "");
        if (!rootDir.endsWith('/'))
            rootDir = rootDir + '/';
        let moduleDir =(options?.moduleDir ? options?.moduleDir + "/" : "modules/");
        let libDir = (options?.libDir ? options?.libDir + "/" : "libs/");
        if (!modulePath || modulePath == '*'){
            if (options?.modules?.[packageName])
                modulePath = rootDir + moduleDir + options?.modules?.[packageName].path + '/index.js'
            else
                modulePath = rootDir + libDir + packageName + '/index.js';
        }
        else if (modulePath.startsWith('{LIB}/')){
            let libPath = LibPath || '';
            if (LibPath && !LibPath.endsWith('/'))
                libPath = libPath + '/';
            modulePath = modulePath.replace('{LIB}/', libPath)
        }
        return modulePath;
    };
    async loadPackage(packageName: string, modulePath?: string): Promise<{[name: string]: any} | null>{
        let packageModulePath = await this.resolvePackageModulePath(packageName, modulePath);
        if (!packageModulePath) return null;
        if (this.packages[packageModulePath])
            return this.packages[packageModulePath];

        let deps = await this.resolvePackageDependencies(packageName);
        for (let i = 0; i < deps.length; i++){
            let p = deps[i];
            if (!RequireJS.defined(p) && !this.packageNames.has(p)){
                await this.loadPackage(p);
            }
        };
        try{
            let m = (<any>window)['require'](packageName);
            if (m){
                if (!this.packageNames.has(packageName)) 
                    this.packageNames.add(packageName);
                this.packages[packageModulePath] = m.default || m;
                return m.default || m;
            };
        }
        catch(err){};        
        let script = await this.getScript(packageModulePath);
        if (script){
            const importedPackage = await this.dynamicImportPackage(script, packageName, packageModulePath);
            return importedPackage;
        };
        return null;
    };
    async loadPackages(packages: string[]){
        let paths: string[] = [];
        let packs: string[] = [];
        let pathIdx: {[name: string]: string} = {};
        let script = '';
        for (let i = 0; i < packages.length; i ++){
            let pack = packages[i];
            let m: any;
            try{
                m = (<any>window)['require'](pack);
            }
            catch(err){};
            let path = this.getModulePath(pack);
            if (m) {                
                this.packages[path] = m.default || m;
            }
            else{
                if (!this.packages[path]){
                    packs.push(pack);
                    pathIdx[pack] = path;
                    paths.push(path);
                };
            }
        };
        if (packs.length > 0){
            let edges: [string, string][] = [];
            if (this._initOptions && this._initOptions.modules){
                for (let idx = packs.length - 1; idx >= 0; idx--) {
                    let pack = packs[idx];
                    let module = this._initOptions.modules[pack];
                    if (module && module.dependencies) {
                        for (let i = 0; i < module.dependencies.length; i++) {
                            let dependency = module.dependencies[i];
                            let depIdx = packs.indexOf(dependency);
                            if (depIdx > -1){
                                edges.push([dependency, pack]);
                            };
                        };
                    };
                };
                let sorted = topologicalSort(edges);
                for (let i = 0; i < packs.length; i++) {
                if (sorted.indexOf(packs[i]) < 0)
                    sorted.push(packs[i]);
                };
                packs = sorted;
                paths = packs.map((p) => pathIdx[p]);
            };
            let result = await Promise.all(paths.map(u=>fetch(u)));        
            for (let i = 0; i < paths.length; i ++){
                let pack = packs[i];
                let path = paths[i];
                path = path.split('/').slice(0, -1).join('/')
                if (this._initOptions && this._initOptions.modules && this._initOptions.modules[pack])
                    script += `application.currentModuleDir=application.rootDir+'modules/${this._initOptions.modules[pack].path}';\n`;
                else
                    script += `application.currentModuleDir=application.rootDir+'libs/${pack}';\n`;
                script += (await result[i].text()) + '\n'; 
            };
            await dynamicImport(`data:text/javascript,${encodeURIComponent(script)}`);
            for (let i = 0; i < paths.length; i ++){
                let pack = packs[i];
                let path = paths[i];
                let m = (<any>window)['require'](pack);
                if (m){ 
                    if (!this.packageNames.has(pack)) 
                        this.packageNames.add(pack);
                    this.packages[path] = m.default || m;
                };
            };
        };
    };
    private async dynamicImportPackage(script: string, packageName: string, packageModulePath: string): Promise<{[name: string]: any} | null>{
        _currentDefineModule = null;
        this.currentModulePath = packageModulePath; 
        if (packageModulePath.indexOf('://') > 0)
            this.currentModuleDir = packageModulePath.split('/').slice(0, -1).join('/')
        else if (!packageModulePath.startsWith('/'))
            this.currentModuleDir = this.LibHost + this.rootDir + packageModulePath.split('/').slice(0, -1).join('/')
        else
            this.currentModuleDir = this.LibHost + packageModulePath.split('/').slice(0, -1).join('/')

        if (!this.packageNames.has(packageName)) {
            await dynamicImport(`data:text/javascript,${encodeURIComponent(script)}`);
            this.packageNames.add(packageName);
        }
        this.currentModulePath = '';
        this.currentModuleDir = '';
        let m = (<any>window)['require'](packageName);
        if (m) {
            this.packages[packageModulePath] = m.default || m;
            return m.default || m;
        }
        return null;
    }
    async loadModule(modulePath: string, options?: IHasDependencies): Promise<IModule|null>{
        let module = await this.newModule(modulePath, options);
        if (module)
            document.body.append(module);
        return module;
    };
    private getModulePath(module: string): string{
        let options = this._initOptions;
        let modulePath = module;
        if (options && options.modules && options.modules[module] && options.modules[module].path){
            modulePath = '';
            if (options.rootDir){
                modulePath += options.rootDir;
                if (!modulePath.endsWith('/'))
                    modulePath += '/';
            };
            if (options.moduleDir){
                modulePath += options.moduleDir;
                if (!modulePath.endsWith('/'))
                    modulePath += '/';
            };
            modulePath += options.modules[module].path;
            if (!modulePath.endsWith('.js'))
                modulePath += '/index.js';
        }
        else if (options && options.dependencies && options.dependencies[module]){
            let libDir = '';
            if (options?.libDir){
                libDir = options.libDir;
                if (!libDir.endsWith('/'))
                    libDir += '/';
                if (libDir.startsWith('/'))
                    libDir = libDir.substring(1);
            }
            else
                libDir = 'libs/';
            modulePath = `${options?.rootDir ? options.rootDir : ""}`
            if (modulePath && !modulePath.endsWith('/'))
                modulePath += '/';
            modulePath += libDir + module + '/index.js';
        };
        return modulePath;
    }
    async initModule(modulePath: string, script: string):Promise<string | null>{
        if (this.modulesId[modulePath])
            return this.modulesId[modulePath];

        _currentDefineModule = null;
        this.currentModulePath = modulePath;
        if (modulePath.indexOf('://') > 0)
            this.currentModuleDir = modulePath.split('/').slice(0, -1).join('/')
        else if (!modulePath.startsWith('/'))
            this.currentModuleDir = this.LibHost + this.rootDir + modulePath.split('/').slice(0, -1).join('/')
        else
            this.currentModuleDir = this.LibHost + modulePath.split('/').slice(0, -1).join('/')
        await dynamicImport(`data:text/javascript,${encodeURIComponent(script)}`);
        document.getElementsByTagName('html')[0].classList.add(applicationStyle);
        this.currentModulePath = '';
        this.currentModuleDir = '';
        if (!_currentDefineModule && this.packages[modulePath]) {
            _currentDefineModule = this.packages[modulePath];
        };
        if (_currentDefineModule){
            let module = _currentDefineModule.default || _currentDefineModule;   
            if (module){
                this.id ++;
                let elmId = `i-module--${this.id}`;
                let Module;
                if (Object.keys(module).length === 1) {
                    Module = class extends module[Object.keys(module)[0]]{};
                } else Module = class extends module{};
                this.modulesId[modulePath] = elmId;
                this.modules[modulePath] = Module;                
                customElements.define(elmId, Module);
                return elmId;
            };
        };
        return null;
    };
    async init(scconfigPath: string, customData?: Record<string, any>): Promise<IModule|null>{
        let scconfig = await this.getJSONContent(scconfigPath);
        if (!scconfig)
            return null;
        if (!scconfig.rootDir){
            if (scconfigPath.indexOf('/') > 0){
                let rootDir = scconfigPath.split('/').slice(0, -1).join('/');
                let a = document.createElement('a');
                a.href = rootDir;
                rootDir = a.href.replace (/^[a-zA-Z]{3,5}:\/{2}[a-zA-Z0-9_.:-]+/,'');
                if (!rootDir.startsWith('/'))
                    rootDir = '/' + rootDir;
                if (!rootDir.endsWith('/'))
                    rootDir = rootDir + '/';
                this.rootDir = rootDir;
                scconfig.rootDir = rootDir;
            }
            else {
                let rootDir = window.location.pathname;
                if (rootDir.endsWith('.html') || rootDir.endsWith('.htm'))
                    rootDir = rootDir.substring(0, rootDir.lastIndexOf("/"));
                if (!rootDir.endsWith('/'))
                    rootDir = rootDir + '/';
                this.rootDir = rootDir;
                scconfig.rootDir = rootDir;
            };
        }
        else{
            let rootDir = scconfig.rootDir;
            if (!rootDir.startsWith('/'))
                rootDir = '/' + rootDir;
            if (!rootDir.endsWith('/'))
                rootDir = rootDir + '/';
            this.rootDir = rootDir;
            scconfig.rootDir = rootDir;
        };
        if (customData) 
            scconfig.customData = customData;

        return this.newModule(scconfig.main, scconfig);
    };
    async newModule(module: string, options?: IHasDependencies): Promise<IModule|null>{   
        if (options){
            if (options.main){ // Root module
                this._initOptions = options;
                // if (options.bundle){
                //     try{
                //         let rootDir = (options?.rootDir ? options?.rootDir : "");
                //         if (!rootDir.endsWith('/'))
                //             rootDir += '/';
                //         let content = await this.getScript(rootDir + 'bundle.json');
                //         if (content){ 
                //             this.bundleLibs = JSON.parse(content);
                //         };
                //     }
                //     catch(err){
                //         this.bundleLibs = {};
                //     };
                // };
            };
            if (!this._assets && options.assets)
                this._assets = await this.loadPackage(options.assets) || {};
            if (options.dependencies){
                let packages: string[] = [];
                for (let p in options.dependencies){
                    if (p != options.main){
                        packages.push(p);
                    };
                };
                await this.loadPackages(packages);
                // for (let p in options.dependencies){
                //     if (p != options.main){
                //         let path = await this.resolvePackageModulePath(p, options.dependencies[p]);
                //         if (path && !this.packages[path]){
                //             await this.loadPackage(p, options.dependencies[p]);
                //         };
                //     };
                // };
            };
        };
        if (this._initOptions?.geo?.enabled && !this.geoInfo){
            const apiUrl = this._initOptions.geo.apiUrl || '/api/geo/v0';
            const geoResponse = await fetch(apiUrl);
            const geo = await geoResponse.json();
            this.geoInfo = geo;
        };
        let modulePath = module;
        if (this._initOptions) {
            if (modulePath != this._initOptions.main && this._initOptions.geo?.enabled) {
                try {                    
                    if (this._initOptions.geo.blockedCountries.includes(this.geoInfo?.country)){
                        module = this._initOptions.geo.moduleOnBlocking;
                        modulePath = this.getModulePath(this._initOptions.geo.moduleOnBlocking);
                    }
                    else {
                        modulePath = this.getModulePath(module);
                    }
                }
                catch (err) {
                    console.log(err);
                    module = this._initOptions.geo.moduleOnBlocking;
                    modulePath = this.getModulePath(this._initOptions.geo.moduleOnBlocking);
                }
            }   
            else {
                modulePath = this.getModulePath(module);
            }     
        };

        let elmId = this.modulesId[modulePath];
        if (elmId && modulePath) {
            let Module = this.modules[modulePath];
            return new (<any>Module)(null, options);
            // return <any>(document.createElement(elmId));
        };
        
        let script: string;
        if (options && options.script)
            script = options.script
        else{
            if (this._initOptions && this._initOptions.modules && this._initOptions.modules[module] && this._initOptions.modules[module].dependencies){
                let dependencies = this._initOptions.modules[module].dependencies;
                // console.dir(dependencies)
                await this.loadPackages(dependencies)
                // for (let i = 0; i < dependencies.length; i ++){
                //     let dep = dependencies[i];
                //     let path = this.getModulePath(dep);
                //     if (!this.packages[path]){
                //         await this.loadPackage(dep, path)
                //     };
                // };              
            };
            try{
                let m = (<any>window)['require'](module);
                if (m){
                    let module = m.default || m;   
                    if (module){
                        this.currentModulePath = modulePath;
                        if (modulePath.indexOf('://') > 0)
                            this.currentModuleDir = modulePath.split('/').slice(0, -1).join('/')
                        else if (!modulePath.startsWith('/'))
                            this.currentModuleDir = this.LibHost + this.rootDir + modulePath.split('/').slice(0, -1).join('/')
                        else
                            this.currentModuleDir = this.LibHost + modulePath.split('/').slice(0, -1).join('/')
                        this.id ++;
                        let elmId = `i-module--${this.id}`;
                        let Module = class extends module{};
                        this.modulesId[modulePath] = elmId;
                        this.modules[modulePath] = Module;                
                        customElements.define(elmId, Module);
                        let result = new (<any>Module)(null, options);
                        return <any>result;
                    };
                }
            }
            catch(err){};
            if (this.bundleLibs[module])
                script = this.bundleLibs[module]
            else
                script = await this.getScript(modulePath);
        };
        if (script){
            let elmId = await this.initModule(modulePath, script);
            if (elmId){
                let Module = this.modules[modulePath];
                let result = new (<any>Module)(null, options);
                return <any>result;
            };            
            // _currentDefineModule = null;
            // this.currentModulePath = modulePath;
            // if (modulePath.indexOf('://') > 0)
            //     this.currentModuleDir = modulePath.split('/').slice(0, -1).join('/')
            // else
            //     this.currentModuleDir = application.LibHost + modulePath.split('/').slice(0, -1).join('/')
            // await import(`data:text/javascript,${encodeURIComponent(script)}`);
            // document.getElementsByTagName('html')[0].classList.add(applicationStyle);
            // this.currentModulePath = '';
            // this.currentModuleDir = '';
            // if (!_currentDefineModule && this.packages[modulePath]) {
            //     _currentDefineModule = this.packages[modulePath];
            // };
            // if (_currentDefineModule){
            //     let module = _currentDefineModule.default || _currentDefineModule;   
            //     if (module){
            //         this.id ++;
            //         elmId = `i-module--${this.id}`;
            //         this.modulesId[modulePath] = elmId;
            //         let Module = class extends module{};
            //         customElements.define(elmId, Module);
            //         let result = new (<any>Module)(null, options);                 
            //         // let result = <any>(document.createElement(elmId));
            //         return <any>result;
            //     };
            // };
        };
        return null;
    };
    async copyToClipboard(value: string) {
        if (!value) return false;
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(value);
                return true;
            } else {
                const input = document.createElement('input');
                input.value = value;
                input.style.position = 'fixed';
                input.style.opacity = '0';
                document.body.appendChild(input);
                input.focus();
                input.select();
                const result = document.execCommand('copy');
                document.body.removeChild(input);
                return result;
            }
        } catch (err) {
            console.log('debug: copy', err);
            return false;
        };
    };
    xssSanitize(value: string): string{
        //TODO: sanitize untrusted script to prevent XSS attacks
        //https://github.com/cure53/DOMPurify
        return DOMPurify.sanitize(value);
    };
};
(<any>window)['application'] = Application.Instance;
export const application = Application.Instance;
export {EventBus, IEventBus} from './event-bus';
export {FormatUtils, IFormatNumberOptions} from './formatUtils';
export default application;
