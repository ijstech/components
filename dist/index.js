/*!-----------------------------------------------------------
* Copyright (c) IJS Technologies. All rights reserved.
* Released under dual AGPLv3/commercial license
* https://ijs.network
*-----------------------------------------------------------*/

//https://github.com/microsoft/vscode-loader
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var _amdLoaderGlobal = this;
var _currentDefineModule;
var _defined = {};
var _commonjsGlobal = typeof global === 'object' ? global : {};
var AMDLoader;
(function (AMDLoader) {
    AMDLoader.global = _amdLoaderGlobal;
    var Environment = /** @class */ (function () {
        function Environment() {
            this._detected = false;
            this._isWindows = false;
            this._isNode = false;
            this._isElectronRenderer = false;
            this._isWebWorker = false;
            this._isElectronNodeIntegrationWebWorker = false;
        }
        Object.defineProperty(Environment.prototype, "isWindows", {
            get: function () {
                this._detect();
                return this._isWindows;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Environment.prototype, "isNode", {
            get: function () {
                this._detect();
                return this._isNode;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Environment.prototype, "isElectronRenderer", {
            get: function () {
                this._detect();
                return this._isElectronRenderer;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Environment.prototype, "isWebWorker", {
            get: function () {
                this._detect();
                return this._isWebWorker;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Environment.prototype, "isElectronNodeIntegrationWebWorker", {
            get: function () {
                this._detect();
                return this._isElectronNodeIntegrationWebWorker;
            },
            enumerable: false,
            configurable: true
        });
        Environment.prototype._detect = function () {
            if (this._detected) {
                return;
            }
            this._detected = true;
            this._isWindows = Environment._isWindows();
            this._isNode = (typeof module !== 'undefined' && !!module.exports);
            this._isElectronRenderer = (typeof process !== 'undefined' && typeof process.versions !== 'undefined' && typeof process.versions.electron !== 'undefined' && process.type === 'renderer');
            this._isWebWorker = (typeof AMDLoader.global.importScripts === 'function');
            this._isElectronNodeIntegrationWebWorker = this._isWebWorker && (typeof process !== 'undefined' && typeof process.versions !== 'undefined' && typeof process.versions.electron !== 'undefined' && process.type === 'worker');
        };
        Environment._isWindows = function () {
            if (typeof navigator !== 'undefined') {
                if (navigator.userAgent && navigator.userAgent.indexOf('Windows') >= 0) {
                    return true;
                }
            }
            if (typeof process !== 'undefined') {
                return (process.platform === 'win32');
            }
            return false;
        };
        return Environment;
    }());
    AMDLoader.Environment = Environment;
})(AMDLoader || (AMDLoader = {}));
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var AMDLoader;
(function (AMDLoader) {
    var LoaderEvent = /** @class */ (function () {
        function LoaderEvent(type, detail, timestamp) {
            this.type = type;
            this.detail = detail;
            this.timestamp = timestamp;
        }
        return LoaderEvent;
    }());
    AMDLoader.LoaderEvent = LoaderEvent;
    var LoaderEventRecorder = /** @class */ (function () {
        function LoaderEventRecorder(loaderAvailableTimestamp) {
            this._events = [new LoaderEvent(1 /* LoaderAvailable */, '', loaderAvailableTimestamp)];
        }
        LoaderEventRecorder.prototype.record = function (type, detail) {
            this._events.push(new LoaderEvent(type, detail, AMDLoader.Utilities.getHighPerformanceTimestamp()));
        };
        LoaderEventRecorder.prototype.getEvents = function () {
            return this._events;
        };
        return LoaderEventRecorder;
    }());
    AMDLoader.LoaderEventRecorder = LoaderEventRecorder;
    var NullLoaderEventRecorder = /** @class */ (function () {
        function NullLoaderEventRecorder() {
        }
        NullLoaderEventRecorder.prototype.record = function (type, detail) {
            // Nothing to do
        };
        NullLoaderEventRecorder.prototype.getEvents = function () {
            return [];
        };
        NullLoaderEventRecorder.INSTANCE = new NullLoaderEventRecorder();
        return NullLoaderEventRecorder;
    }());
    AMDLoader.NullLoaderEventRecorder = NullLoaderEventRecorder;
})(AMDLoader || (AMDLoader = {}));
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var AMDLoader;
(function (AMDLoader) {
    var Utilities = /** @class */ (function () {
        function Utilities() {
        }
        /**
         * This method does not take care of / vs \
         */
        Utilities.fileUriToFilePath = function (isWindows, uri) {
            uri = decodeURI(uri).replace(/%23/g, '#');
            if (isWindows) {
                if (/^file:\/\/\//.test(uri)) {
                    // This is a URI without a hostname => return only the path segment
                    return uri.substr(8);
                }
                if (/^file:\/\//.test(uri)) {
                    return uri.substr(5);
                }
            }
            else {
                if (/^file:\/\//.test(uri)) {
                    return uri.substr(7);
                }
            }
            // Not sure...
            return uri;
        };
        Utilities.startsWith = function (haystack, needle) {
            return haystack.length >= needle.length && haystack.substr(0, needle.length) === needle;
        };
        Utilities.endsWith = function (haystack, needle) {
            return haystack.length >= needle.length && haystack.substr(haystack.length - needle.length) === needle;
        };
        // only check for "?" before "#" to ensure that there is a real Query-String
        Utilities.containsQueryString = function (url) {
            return /^[^\#]*\?/gi.test(url);
        };
        /**
         * Does `url` start with http:// or https:// or file:// or / ?
         */
        Utilities.isAbsolutePath = function (url) {
            return /^((http:\/\/)|(https:\/\/)|(file:\/\/)|(\/))/.test(url);
        };
        Utilities.forEachProperty = function (obj, callback) {
            if (obj) {
                var key = void 0;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        callback(key, obj[key]);
                    }
                }
            }
        };
        Utilities.isEmpty = function (obj) {
            var isEmpty = true;
            Utilities.forEachProperty(obj, function () {
                isEmpty = false;
            });
            return isEmpty;
        };
        Utilities.recursiveClone = function (obj) {
            if (!obj || typeof obj !== 'object' || obj instanceof RegExp) {
                return obj;
            }
            if (!Array.isArray(obj) && Object.getPrototypeOf(obj) !== Object.prototype) {
                // only clone "simple" objects
                return obj;
            }
            var result = Array.isArray(obj) ? [] : {};
            Utilities.forEachProperty(obj, function (key, value) {
                if (value && typeof value === 'object') {
                    result[key] = Utilities.recursiveClone(value);
                }
                else {
                    result[key] = value;
                }
            });
            return result;
        };
        Utilities.generateAnonymousModule = function () {
            return '===anonymous' + (Utilities.NEXT_ANONYMOUS_ID++) + '===';
        };
        Utilities.isAnonymousModule = function (id) {
            return Utilities.startsWith(id, '===anonymous');
        };
        Utilities.getHighPerformanceTimestamp = function () {
            if (!this.PERFORMANCE_NOW_PROBED) {
                this.PERFORMANCE_NOW_PROBED = true;
                this.HAS_PERFORMANCE_NOW = (AMDLoader.global.performance && typeof AMDLoader.global.performance.now === 'function');
            }
            return (this.HAS_PERFORMANCE_NOW ? AMDLoader.global.performance.now() : Date.now());
        };
        Utilities.NEXT_ANONYMOUS_ID = 1;
        Utilities.PERFORMANCE_NOW_PROBED = false;
        Utilities.HAS_PERFORMANCE_NOW = false;
        return Utilities;
    }());
    AMDLoader.Utilities = Utilities;
})(AMDLoader || (AMDLoader = {}));
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var AMDLoader;
(function (AMDLoader) {
    function ensureError(err) {
        if (err instanceof Error) {
            return err;
        }
        var result = new Error(err.message || String(err) || 'Unknown Error');
        if (err.stack) {
            result.stack = err.stack;
        }
        return result;
    }
    AMDLoader.ensureError = ensureError;
    ;
    var ConfigurationOptionsUtil = /** @class */ (function () {
        function ConfigurationOptionsUtil() {
        }
        /**
         * Ensure configuration options make sense
         */
        ConfigurationOptionsUtil.validateConfigurationOptions = function (options) {
            function defaultOnError(err) {
                if (err.phase === 'loading') {
                    console.error('Loading "' + err.moduleId + '" failed');
                    console.error(err);
                    console.error('Here are the modules that depend on it:');
                    console.error(err.neededBy);
                    return;
                }
                if (err.phase === 'factory') {
                    console.error('The factory method of "' + err.moduleId + '" has thrown an exception');
                    console.error(err);
                    return;
                }
            }
            options = options || {};
            if (typeof options.baseUrl !== 'string') {
                options.baseUrl = '';
            }
            if (typeof options.isBuild !== 'boolean') {
                options.isBuild = false;
            }
            if (typeof options.paths !== 'object') {
                options.paths = {};
            }
            if (typeof options.config !== 'object') {
                options.config = {};
            }
            if (typeof options.catchError === 'undefined') {
                options.catchError = false;
            }
            if (typeof options.recordStats === 'undefined') {
                options.recordStats = false;
            }
            if (typeof options.urlArgs !== 'string') {
                options.urlArgs = '';
            }
            if (typeof options.onError !== 'function') {
                options.onError = defaultOnError;
            }
            if (!Array.isArray(options.ignoreDuplicateModules)) {
                options.ignoreDuplicateModules = [];
            }
            if (options.baseUrl.length > 0) {
                if (!AMDLoader.Utilities.endsWith(options.baseUrl, '/')) {
                    options.baseUrl += '/';
                }
            }
            if (typeof options.cspNonce !== 'string') {
                options.cspNonce = '';
            }
            if (typeof options.preferScriptTags === 'undefined') {
                options.preferScriptTags = false;
            }
            if (!Array.isArray(options.nodeModules)) {
                options.nodeModules = [];
            }
            if (options.nodeCachedData && typeof options.nodeCachedData === 'object') {
                if (typeof options.nodeCachedData.seed !== 'string') {
                    options.nodeCachedData.seed = 'seed';
                }
                if (typeof options.nodeCachedData.writeDelay !== 'number' || options.nodeCachedData.writeDelay < 0) {
                    options.nodeCachedData.writeDelay = 1000 * 7;
                }
                if (!options.nodeCachedData.path || typeof options.nodeCachedData.path !== 'string') {
                    var err = ensureError(new Error('INVALID cached data configuration, \'path\' MUST be set'));
                    err.phase = 'configuration';
                    options.onError(err);
                    options.nodeCachedData = undefined;
                }
            }
            return options;
        };
        ConfigurationOptionsUtil.mergeConfigurationOptions = function (overwrite, base) {
            if (overwrite === void 0) { overwrite = null; }
            if (base === void 0) { base = null; }
            var result = AMDLoader.Utilities.recursiveClone(base || {});
            // Merge known properties and overwrite the unknown ones
            AMDLoader.Utilities.forEachProperty(overwrite, function (key, value) {
                if (key === 'ignoreDuplicateModules' && typeof result.ignoreDuplicateModules !== 'undefined') {
                    result.ignoreDuplicateModules = result.ignoreDuplicateModules.concat(value);
                }
                else if (key === 'paths' && typeof result.paths !== 'undefined') {
                    AMDLoader.Utilities.forEachProperty(value, function (key2, value2) { return result.paths[key2] = value2; });
                }
                else if (key === 'config' && typeof result.config !== 'undefined') {
                    AMDLoader.Utilities.forEachProperty(value, function (key2, value2) { return result.config[key2] = value2; });
                }
                else {
                    result[key] = AMDLoader.Utilities.recursiveClone(value);
                }
            });
            return ConfigurationOptionsUtil.validateConfigurationOptions(result);
        };
        return ConfigurationOptionsUtil;
    }());
    AMDLoader.ConfigurationOptionsUtil = ConfigurationOptionsUtil;
    var Configuration = /** @class */ (function () {
        function Configuration(env, options) {
            this._env = env;
            this.options = ConfigurationOptionsUtil.mergeConfigurationOptions(options);
            this._createIgnoreDuplicateModulesMap();
            this._createNodeModulesMap();
            this._createSortedPathsRules();
            if (this.options.baseUrl === '') {
                if (this.options.nodeRequire && this.options.nodeRequire.main && this.options.nodeRequire.main.filename && this._env.isNode) {
                    var nodeMain = this.options.nodeRequire.main.filename;
                    var dirnameIndex = Math.max(nodeMain.lastIndexOf('/'), nodeMain.lastIndexOf('\\'));
                    this.options.baseUrl = nodeMain.substring(0, dirnameIndex + 1);
                }
                if (this.options.nodeMain && this._env.isNode) {
                    var nodeMain = this.options.nodeMain;
                    var dirnameIndex = Math.max(nodeMain.lastIndexOf('/'), nodeMain.lastIndexOf('\\'));
                    this.options.baseUrl = nodeMain.substring(0, dirnameIndex + 1);
                }
            }
        }
        Configuration.prototype._createIgnoreDuplicateModulesMap = function () {
            // Build a map out of the ignoreDuplicateModules array
            this.ignoreDuplicateModulesMap = {};
            for (var i = 0; i < this.options.ignoreDuplicateModules.length; i++) {
                this.ignoreDuplicateModulesMap[this.options.ignoreDuplicateModules[i]] = true;
            }
        };
        Configuration.prototype._createNodeModulesMap = function () {
            // Build a map out of nodeModules array
            this.nodeModulesMap = Object.create(null);
            for (var _i = 0, _a = this.options.nodeModules; _i < _a.length; _i++) {
                var nodeModule = _a[_i];
                this.nodeModulesMap[nodeModule] = true;
            }
        };
        Configuration.prototype._createSortedPathsRules = function () {
            var _this = this;
            // Create an array our of the paths rules, sorted descending by length to
            // result in a more specific -> less specific order
            this.sortedPathsRules = [];
            AMDLoader.Utilities.forEachProperty(this.options.paths, function (from, to) {
                if (!Array.isArray(to)) {
                    _this.sortedPathsRules.push({
                        from: from,
                        to: [to]
                    });
                }
                else {
                    _this.sortedPathsRules.push({
                        from: from,
                        to: to
                    });
                }
            });
            this.sortedPathsRules.sort(function (a, b) {
                return b.from.length - a.from.length;
            });
        };
        /**
         * Clone current configuration and overwrite options selectively.
         * @param options The selective options to overwrite with.
         * @result A new configuration
         */
        Configuration.prototype.cloneAndMerge = function (options) {
            return new Configuration(this._env, ConfigurationOptionsUtil.mergeConfigurationOptions(options, this.options));
        };
        /**
         * Get current options bag. Useful for passing it forward to plugins.
         */
        Configuration.prototype.getOptionsLiteral = function () {
            return this.options;
        };
        Configuration.prototype._applyPaths = function (moduleId) {
            var pathRule;
            for (var i = 0, len = this.sortedPathsRules.length; i < len; i++) {
                pathRule = this.sortedPathsRules[i];
                if (AMDLoader.Utilities.startsWith(moduleId, pathRule.from)) {
                    var result = [];
                    for (var j = 0, lenJ = pathRule.to.length; j < lenJ; j++) {
                        result.push(pathRule.to[j] + moduleId.substr(pathRule.from.length));
                    }
                    return result;
                }
            }
            return [moduleId];
        };
        Configuration.prototype._addUrlArgsToUrl = function (url) {
            if (AMDLoader.Utilities.containsQueryString(url)) {
                return url + '&' + this.options.urlArgs;
            }
            else {
                return url + '?' + this.options.urlArgs;
            }
        };
        Configuration.prototype._addUrlArgsIfNecessaryToUrl = function (url) {
            if (this.options.urlArgs) {
                return this._addUrlArgsToUrl(url);
            }
            return url;
        };
        Configuration.prototype._addUrlArgsIfNecessaryToUrls = function (urls) {
            if (this.options.urlArgs) {
                for (var i = 0, len = urls.length; i < len; i++) {
                    urls[i] = this._addUrlArgsToUrl(urls[i]);
                }
            }
            return urls;
        };
        /**
         * Transform a module id to a location. Appends .js to module ids
         */
        Configuration.prototype.moduleIdToPaths = function (moduleId) {
            if (this._env.isNode) {
                var isNodeModule = ((this.nodeModulesMap[moduleId] === true)
                    || (this.options.amdModulesPattern instanceof RegExp && !this.options.amdModulesPattern.test(moduleId)));
                if (isNodeModule) {
                    // This is a node module...
                    if (this.isBuild()) {
                        // ...and we are at build time, drop it
                        return ['empty:'];
                    }
                    else {
                        // ...and at runtime we create a `shortcut`-path
                        return ['node|' + moduleId];
                    }
                }
            }
            var result = moduleId;
            var results;
            if (!AMDLoader.Utilities.endsWith(result, '.js') && !AMDLoader.Utilities.isAbsolutePath(result)) {
                results = this._applyPaths(result);
                for (var i = 0, len = results.length; i < len; i++) {
                    if (this.isBuild() && results[i] === 'empty:') {
                        continue;
                    }
                    if (!AMDLoader.Utilities.isAbsolutePath(results[i])) {
                        results[i] = this.options.baseUrl + results[i];
                    }
                    if (!AMDLoader.Utilities.endsWith(results[i], '.js') && !AMDLoader.Utilities.containsQueryString(results[i])) {
                        results[i] = results[i] + '.js';
                    }
                }
            }
            else {
                if (!AMDLoader.Utilities.endsWith(result, '.js') && !AMDLoader.Utilities.containsQueryString(result)) {
                    result = result + '.js';
                }
                results = [result];
            }
            return this._addUrlArgsIfNecessaryToUrls(results);
        };
        /**
         * Transform a module id or url to a location.
         */
        Configuration.prototype.requireToUrl = function (url) {
            var result = url;
            if (!AMDLoader.Utilities.isAbsolutePath(result)) {
                result = this._applyPaths(result)[0];
                if (!AMDLoader.Utilities.isAbsolutePath(result)) {
                    result = this.options.baseUrl + result;
                }
            }
            return this._addUrlArgsIfNecessaryToUrl(result);
        };
        /**
         * Flag to indicate if current execution is as part of a build.
         */
        Configuration.prototype.isBuild = function () {
            return this.options.isBuild;
        };
        /**
         * Test if module `moduleId` is expected to be defined multiple times
         */
        Configuration.prototype.isDuplicateMessageIgnoredFor = function (moduleId) {
            return this.ignoreDuplicateModulesMap.hasOwnProperty(moduleId);
        };
        /**
         * Get the configuration settings for the provided module id
         */
        Configuration.prototype.getConfigForModule = function (moduleId) {
            if (this.options.config) {
                return this.options.config[moduleId];
            }
        };
        /**
         * Should errors be caught when executing module factories?
         */
        Configuration.prototype.shouldCatchError = function () {
            return this.options.catchError;
        };
        /**
         * Should statistics be recorded?
         */
        Configuration.prototype.shouldRecordStats = function () {
            return this.options.recordStats;
        };
        /**
         * Forward an error to the error handler.
         */
        Configuration.prototype.onError = function (err) {
            this.options.onError(err);
        };
        return Configuration;
    }());
    AMDLoader.Configuration = Configuration;
})(AMDLoader || (AMDLoader = {}));
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var AMDLoader;
(function (AMDLoader) {
    /**
     * Load `scriptSrc` only once (avoid multiple <script> tags)
     */
    var OnlyOnceScriptLoader = /** @class */ (function () {
        function OnlyOnceScriptLoader(env) {
            this._env = env;
            this._scriptLoader = null;
            this._callbackMap = {};
        }
        OnlyOnceScriptLoader.prototype.load = function (moduleManager, scriptSrc, callback, errorback) {
            var _this = this;
            if (!this._scriptLoader) {
                if (this._env.isWebWorker) {
                    this._scriptLoader = new WorkerScriptLoader();
                }
                else if (this._env.isElectronRenderer) {
                    var preferScriptTags = moduleManager.getConfig().getOptionsLiteral().preferScriptTags;
                    if (preferScriptTags) {
                        this._scriptLoader = new BrowserScriptLoader();
                    }
                    else {
                        this._scriptLoader = new NodeScriptLoader(this._env);
                    }
                }
                else if (this._env.isNode) {
                    this._scriptLoader = new NodeScriptLoader(this._env);
                }
                else {
                    this._scriptLoader = new BrowserScriptLoader();
                }
            }
            var scriptCallbacks = {
                callback: callback,
                errorback: errorback
            };
            if (this._callbackMap.hasOwnProperty(scriptSrc)) {
                this._callbackMap[scriptSrc].push(scriptCallbacks);
                return;
            }
            this._callbackMap[scriptSrc] = [scriptCallbacks];
            this._scriptLoader.load(moduleManager, scriptSrc, function () { return _this.triggerCallback(scriptSrc); }, function (err) { return _this.triggerErrorback(scriptSrc, err); });
        };
        OnlyOnceScriptLoader.prototype.triggerCallback = function (scriptSrc) {
            var scriptCallbacks = this._callbackMap[scriptSrc];
            delete this._callbackMap[scriptSrc];
            for (var i = 0; i < scriptCallbacks.length; i++) {
                scriptCallbacks[i].callback();
            }
        };
        OnlyOnceScriptLoader.prototype.triggerErrorback = function (scriptSrc, err) {
            var scriptCallbacks = this._callbackMap[scriptSrc];
            delete this._callbackMap[scriptSrc];
            for (var i = 0; i < scriptCallbacks.length; i++) {
                scriptCallbacks[i].errorback(err);
            }
        };
        return OnlyOnceScriptLoader;
    }());
    var BrowserScriptLoader = /** @class */ (function () {
        function BrowserScriptLoader() {
        }
        /**
         * Attach load / error listeners to a script element and remove them when either one has fired.
         * Implemented for browsers supporting HTML5 standard 'load' and 'error' events.
         */
        BrowserScriptLoader.prototype.attachListeners = function (script, callback, errorback) {
            var unbind = function () {
                script.removeEventListener('load', loadEventListener);
                script.removeEventListener('error', errorEventListener);
            };
            var loadEventListener = function (e) {
                unbind();
                callback();
            };
            var errorEventListener = function (e) {
                unbind();
                errorback(e);
            };
            script.addEventListener('load', loadEventListener);
            script.addEventListener('error', errorEventListener);
        };
        BrowserScriptLoader.prototype.load = function (moduleManager, scriptSrc, callback, errorback) {
            if (/^node\|/.test(scriptSrc)) {
                var opts = moduleManager.getConfig().getOptionsLiteral();
                var nodeRequire = ensureRecordedNodeRequire(moduleManager.getRecorder(), (opts.nodeRequire || AMDLoader.global.nodeRequire));
                var pieces = scriptSrc.split('|');
                var moduleExports_1 = null;
                try {
                    moduleExports_1 = nodeRequire(pieces[1]);
                }
                catch (err) {
                    errorback(err);
                    return;
                }
                moduleManager.enqueueDefineAnonymousModule([], function () { return moduleExports_1; });
                callback();
            }
            else {
                var script = document.createElement('script');
                script.setAttribute('async', 'async');
                script.setAttribute('type', 'text/javascript');
                this.attachListeners(script, callback, errorback);
                var trustedTypesPolicy = moduleManager.getConfig().getOptionsLiteral().trustedTypesPolicy;
                if (trustedTypesPolicy) {
                    scriptSrc = trustedTypesPolicy.createScriptURL(scriptSrc);
                }
                script.setAttribute('src', scriptSrc);
                // Propagate CSP nonce to dynamically created script tag.
                var cspNonce = moduleManager.getConfig().getOptionsLiteral().cspNonce;
                if (cspNonce) {
                    script.setAttribute('nonce', cspNonce);
                }
                document.getElementsByTagName('head')[0].appendChild(script);
            }
        };
        return BrowserScriptLoader;
    }());
    function canUseEval(moduleManager) {
        var trustedTypesPolicy = moduleManager.getConfig().getOptionsLiteral().trustedTypesPolicy;
        try {
            var func = (trustedTypesPolicy
                ? self.eval(trustedTypesPolicy.createScript('', 'true'))
                : new Function('true'));
            func.call(self);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    var WorkerScriptLoader = /** @class */ (function () {
        function WorkerScriptLoader() {
            this._cachedCanUseEval = null;
        }
        WorkerScriptLoader.prototype._canUseEval = function (moduleManager) {
            if (this._cachedCanUseEval === null) {
                this._cachedCanUseEval = canUseEval(moduleManager);
            }
            return this._cachedCanUseEval;
        };
        WorkerScriptLoader.prototype.load = function (moduleManager, scriptSrc, callback, errorback) {
            if (/^node\|/.test(scriptSrc)) {
                var opts = moduleManager.getConfig().getOptionsLiteral();
                var nodeRequire = ensureRecordedNodeRequire(moduleManager.getRecorder(), (opts.nodeRequire || AMDLoader.global.nodeRequire));
                var pieces = scriptSrc.split('|');
                var moduleExports_2 = null;
                try {
                    moduleExports_2 = nodeRequire(pieces[1]);
                }
                catch (err) {
                    errorback(err);
                    return;
                }
                moduleManager.enqueueDefineAnonymousModule([], function () { return moduleExports_2; });
                callback();
            }
            else {
                var trustedTypesPolicy_1 = moduleManager.getConfig().getOptionsLiteral().trustedTypesPolicy;
                var isCrossOrigin = (/^((http:)|(https:)|(file:))/.test(scriptSrc) && scriptSrc.substring(0, self.origin.length) !== self.origin);
                if (!isCrossOrigin && this._canUseEval(moduleManager)) {
                    // use `fetch` if possible because `importScripts`
                    // is synchronous and can lead to deadlocks on Safari
                    fetch(scriptSrc).then(function (response) {
                        if (response.status !== 200) {
                            throw new Error(response.statusText);
                        }
                        return response.text();
                    }).then(function (text) {
                        text = text + "\n//# sourceURL=" + scriptSrc;
                        var func = (trustedTypesPolicy_1
                            ? self.eval(trustedTypesPolicy_1.createScript('', text))
                            : new Function(text));
                        func.call(self);
                        callback();
                    }).then(undefined, errorback);
                    return;
                }
                try {
                    if (trustedTypesPolicy_1) {
                        scriptSrc = trustedTypesPolicy_1.createScriptURL(scriptSrc);
                    }
                    importScripts(scriptSrc);
                    callback();
                }
                catch (e) {
                    errorback(e);
                }
            }
        };
        return WorkerScriptLoader;
    }());
    var NodeScriptLoader = /** @class */ (function () {
        function NodeScriptLoader(env) {
            this._env = env;
            this._didInitialize = false;
            this._didPatchNodeRequire = false;
        }
        NodeScriptLoader.prototype._init = function (nodeRequire) {
            if (this._didInitialize) {
                return;
            }
            this._didInitialize = true;
            // capture node modules
            this._fs = nodeRequire('fs');
            this._vm = nodeRequire('vm');
            this._path = nodeRequire('path');
            this._crypto = nodeRequire('crypto');
        };
        // patch require-function of nodejs such that we can manually create a script
        // from cached data. this is done by overriding the `Module._compile` function
        NodeScriptLoader.prototype._initNodeRequire = function (nodeRequire, moduleManager) {
            // It is important to check for `nodeCachedData` first and then set `_didPatchNodeRequire`.
            // That's because `nodeCachedData` is set _after_ calling this for the first time...
            var nodeCachedData = moduleManager.getConfig().getOptionsLiteral().nodeCachedData;
            if (!nodeCachedData) {
                return;
            }
            if (this._didPatchNodeRequire) {
                return;
            }
            this._didPatchNodeRequire = true;
            var that = this;
            var Module = nodeRequire('module');
            function makeRequireFunction(mod) {
                var Module = mod.constructor;
                var require = function require(path) {
                    try {
                        return mod.require(path);
                    }
                    finally {
                        // nothing
                    }
                };
                require.resolve = function resolve(request, options) {
                    return Module._resolveFilename(request, mod, false, options);
                };
                require.resolve.paths = function paths(request) {
                    return Module._resolveLookupPaths(request, mod);
                };
                require.main = process.mainModule;
                require.extensions = Module._extensions;
                require.cache = Module._cache;
                return require;
            }
            Module.prototype._compile = function (content, filename) {
                // remove shebang and create wrapper function
                var scriptSource = Module.wrap(content.replace(/^#!.*/, ''));
                // create script
                var recorder = moduleManager.getRecorder();
                var cachedDataPath = that._getCachedDataPath(nodeCachedData, filename);
                var options = { filename: filename };
                var hashData;
                try {
                    var data = that._fs.readFileSync(cachedDataPath);
                    hashData = data.slice(0, 16);
                    options.cachedData = data.slice(16);
                    recorder.record(60 /* CachedDataFound */, cachedDataPath);
                }
                catch (_e) {
                    recorder.record(61 /* CachedDataMissed */, cachedDataPath);
                }
                var script = new that._vm.Script(scriptSource, options);
                var compileWrapper = script.runInThisContext(options);
                // run script
                var dirname = that._path.dirname(filename);
                var require = makeRequireFunction(this);
                var args = [this.exports, require, this, filename, dirname, process, _commonjsGlobal, Buffer];
                var result = compileWrapper.apply(this.exports, args);
                // cached data aftermath
                that._handleCachedData(script, scriptSource, cachedDataPath, !options.cachedData, moduleManager);
                that._verifyCachedData(script, scriptSource, cachedDataPath, hashData, moduleManager);
                return result;
            };
        };
        NodeScriptLoader.prototype.load = function (moduleManager, scriptSrc, callback, errorback) {
            var _this = this;
            var opts = moduleManager.getConfig().getOptionsLiteral();
            var nodeRequire = ensureRecordedNodeRequire(moduleManager.getRecorder(), (opts.nodeRequire || AMDLoader.global.nodeRequire));
            var nodeInstrumenter = (opts.nodeInstrumenter || function (c) { return c; });
            this._init(nodeRequire);
            this._initNodeRequire(nodeRequire, moduleManager);
            var recorder = moduleManager.getRecorder();
            if (/^node\|/.test(scriptSrc)) {
                var pieces = scriptSrc.split('|');
                var moduleExports_3 = null;
                try {
                    moduleExports_3 = nodeRequire(pieces[1]);
                }
                catch (err) {
                    errorback(err);
                    return;
                }
                moduleManager.enqueueDefineAnonymousModule([], function () { return moduleExports_3; });
                callback();
            }
            else {
                scriptSrc = AMDLoader.Utilities.fileUriToFilePath(this._env.isWindows, scriptSrc);
                var normalizedScriptSrc_1 = this._path.normalize(scriptSrc);
                var vmScriptPathOrUri_1 = this._getElectronRendererScriptPathOrUri(normalizedScriptSrc_1);
                var wantsCachedData_1 = Boolean(opts.nodeCachedData);
                var cachedDataPath_1 = wantsCachedData_1 ? this._getCachedDataPath(opts.nodeCachedData, scriptSrc) : undefined;
                this._readSourceAndCachedData(normalizedScriptSrc_1, cachedDataPath_1, recorder, function (err, data, cachedData, hashData) {
                    if (err) {
                        errorback(err);
                        return;
                    }
                    var scriptSource;
                    if (data.charCodeAt(0) === NodeScriptLoader._BOM) {
                        scriptSource = NodeScriptLoader._PREFIX + data.substring(1) + NodeScriptLoader._SUFFIX;
                    }
                    else {
                        scriptSource = NodeScriptLoader._PREFIX + data + NodeScriptLoader._SUFFIX;
                    }
                    scriptSource = nodeInstrumenter(scriptSource, normalizedScriptSrc_1);
                    var scriptOpts = { filename: vmScriptPathOrUri_1, cachedData: cachedData };
                    var script = _this._createAndEvalScript(moduleManager, scriptSource, scriptOpts, callback, errorback);
                    _this._handleCachedData(script, scriptSource, cachedDataPath_1, wantsCachedData_1 && !cachedData, moduleManager);
                    _this._verifyCachedData(script, scriptSource, cachedDataPath_1, hashData, moduleManager);
                });
            }
        };
        NodeScriptLoader.prototype._createAndEvalScript = function (moduleManager, contents, options, callback, errorback) {
            var recorder = moduleManager.getRecorder();
            recorder.record(31 /* NodeBeginEvaluatingScript */, options.filename);
            var script = new this._vm.Script(contents, options);
            var ret = script.runInThisContext(options);
            var globalDefineFunc = moduleManager.getGlobalAMDDefineFunc();
            var receivedDefineCall = false;
            var localDefineFunc = function () {
                receivedDefineCall = true;
                return globalDefineFunc.apply(null, arguments);
            };
            localDefineFunc.amd = globalDefineFunc.amd;
            ret.call(AMDLoader.global, moduleManager.getGlobalAMDRequireFunc(), localDefineFunc, options.filename, this._path.dirname(options.filename));
            recorder.record(32 /* NodeEndEvaluatingScript */, options.filename);
            if (receivedDefineCall) {
                callback();
            }
            else {
                errorback(new Error("Didn't receive define call in " + options.filename + "!"));
            }
            return script;
        };
        NodeScriptLoader.prototype._getElectronRendererScriptPathOrUri = function (path) {
            if (!this._env.isElectronRenderer) {
                return path;
            }
            var driveLetterMatch = path.match(/^([a-z])\:(.*)/i);
            if (driveLetterMatch) {
                // windows
                return "file:///" + (driveLetterMatch[1].toUpperCase() + ':' + driveLetterMatch[2]).replace(/\\/g, '/');
            }
            else {
                // nix
                return "file://" + path;
            }
        };
        NodeScriptLoader.prototype._getCachedDataPath = function (config, filename) {
            var hash = this._crypto.createHash('md5').update(filename, 'utf8').update(config.seed, 'utf8').update(process.arch, '').digest('hex');
            var basename = this._path.basename(filename).replace(/\.js$/, '');
            return this._path.join(config.path, basename + "-" + hash + ".code");
        };
        NodeScriptLoader.prototype._handleCachedData = function (script, scriptSource, cachedDataPath, createCachedData, moduleManager) {
            var _this = this;
            if (script.cachedDataRejected) {
                // cached data got rejected -> delete and re-create
                this._fs.unlink(cachedDataPath, function (err) {
                    moduleManager.getRecorder().record(62 /* CachedDataRejected */, cachedDataPath);
                    _this._createAndWriteCachedData(script, scriptSource, cachedDataPath, moduleManager);
                    if (err) {
                        moduleManager.getConfig().onError(err);
                    }
                });
            }
            else if (createCachedData) {
                // no cached data, but wanted
                this._createAndWriteCachedData(script, scriptSource, cachedDataPath, moduleManager);
            }
        };
        // Cached data format: | SOURCE_HASH | V8_CACHED_DATA |
        // -SOURCE_HASH is the md5 hash of the JS source (always 16 bytes)
        // -V8_CACHED_DATA is what v8 produces
        NodeScriptLoader.prototype._createAndWriteCachedData = function (script, scriptSource, cachedDataPath, moduleManager) {
            var _this = this;
            var timeout = Math.ceil(moduleManager.getConfig().getOptionsLiteral().nodeCachedData.writeDelay * (1 + Math.random()));
            var lastSize = -1;
            var iteration = 0;
            var hashData = undefined;
            var createLoop = function () {
                setTimeout(function () {
                    if (!hashData) {
                        hashData = _this._crypto.createHash('md5').update(scriptSource, 'utf8').digest();
                    }
                    var cachedData = script.createCachedData();
                    if (cachedData.length === 0 || cachedData.length === lastSize || iteration >= 5) {
                        // done
                        return;
                    }
                    if (cachedData.length < lastSize) {
                        // less data than before: skip, try again next round
                        createLoop();
                        return;
                    }
                    lastSize = cachedData.length;
                    _this._fs.writeFile(cachedDataPath, Buffer.concat([hashData, cachedData]), function (err) {
                        if (err) {
                            moduleManager.getConfig().onError(err);
                        }
                        moduleManager.getRecorder().record(63 /* CachedDataCreated */, cachedDataPath);
                        createLoop();
                    });
                }, timeout * (Math.pow(4, iteration++)));
            };
            // with some delay (`timeout`) create cached data
            // and repeat that (with backoff delay) until the
            // data seems to be not changing anymore
            createLoop();
        };
        NodeScriptLoader.prototype._readSourceAndCachedData = function (sourcePath, cachedDataPath, recorder, callback) {
            if (!cachedDataPath) {
                // no cached data case
                this._fs.readFile(sourcePath, { encoding: 'utf8' }, callback);
            }
            else {
                // cached data case: read both files in parallel
                var source_1 = undefined;
                var cachedData_1 = undefined;
                var hashData_1 = undefined;
                var steps_1 = 2;
                var step_1 = function (err) {
                    if (err) {
                        callback(err);
                    }
                    else if (--steps_1 === 0) {
                        callback(undefined, source_1, cachedData_1, hashData_1);
                    }
                };
                this._fs.readFile(sourcePath, { encoding: 'utf8' }, function (err, data) {
                    source_1 = data;
                    step_1(err);
                });
                this._fs.readFile(cachedDataPath, function (err, data) {
                    if (!err && data && data.length > 0) {
                        hashData_1 = data.slice(0, 16);
                        cachedData_1 = data.slice(16);
                        recorder.record(60 /* CachedDataFound */, cachedDataPath);
                    }
                    else {
                        recorder.record(61 /* CachedDataMissed */, cachedDataPath);
                    }
                    step_1(); // ignored: cached data is optional
                });
            }
        };
        NodeScriptLoader.prototype._verifyCachedData = function (script, scriptSource, cachedDataPath, hashData, moduleManager) {
            var _this = this;
            if (!hashData) {
                // nothing to do
                return;
            }
            if (script.cachedDataRejected) {
                // invalid anyways
                return;
            }
            setTimeout(function () {
                // check source hash - the contract is that file paths change when file content
                // change (e.g use the commit or version id as cache path). this check is
                // for violations of this contract.
                var hashDataNow = _this._crypto.createHash('md5').update(scriptSource, 'utf8').digest();
                if (!hashData.equals(hashDataNow)) {
                    moduleManager.getConfig().onError(new Error("FAILED TO VERIFY CACHED DATA, deleting stale '" + cachedDataPath + "' now, but a RESTART IS REQUIRED"));
                    _this._fs.unlink(cachedDataPath, function (err) {
                        if (err) {
                            moduleManager.getConfig().onError(err);
                        }
                    });
                }
            }, Math.ceil(5000 * (1 + Math.random())));
        };
        NodeScriptLoader._BOM = 0xFEFF;
        NodeScriptLoader._PREFIX = '(function (require, define, __filename, __dirname) { ';
        NodeScriptLoader._SUFFIX = '\n});';
        return NodeScriptLoader;
    }());
    function ensureRecordedNodeRequire(recorder, _nodeRequire) {
        if (_nodeRequire.__$__isRecorded) {
            // it is already recorded
            return _nodeRequire;
        }
        var nodeRequire = function nodeRequire(what) {
            recorder.record(33 /* NodeBeginNativeRequire */, what);
            try {
                return _nodeRequire(what);
            }
            finally {
                recorder.record(34 /* NodeEndNativeRequire */, what);
            }
        };
        nodeRequire.__$__isRecorded = true;
        return nodeRequire;
    }
    AMDLoader.ensureRecordedNodeRequire = ensureRecordedNodeRequire;
    function createScriptLoader(env) {
        return new OnlyOnceScriptLoader(env);
    }
    AMDLoader.createScriptLoader = createScriptLoader;
})(AMDLoader || (AMDLoader = {}));
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var AMDLoader;
(function (AMDLoader) {
    // ------------------------------------------------------------------------
    // ModuleIdResolver
    var ModuleIdResolver = /** @class */ (function () {
        function ModuleIdResolver(fromModuleId) {
            var lastSlash = fromModuleId.lastIndexOf('/');
            if (lastSlash !== -1) {
                this.fromModulePath = fromModuleId.substr(0, lastSlash + 1);
            }
            else {
                this.fromModulePath = '';
            }
        }
        /**
         * Normalize 'a/../name' to 'name', etc.
         */
        ModuleIdResolver._normalizeModuleId = function (moduleId) {
            var r = moduleId, pattern;
            // replace /./ => /
            pattern = /\/\.\//;
            while (pattern.test(r)) {
                r = r.replace(pattern, '/');
            }
            // replace ^./ => nothing
            r = r.replace(/^\.\//g, '');
            // replace /aa/../ => / (BUT IGNORE /../../)
            pattern = /\/(([^\/])|([^\/][^\/\.])|([^\/\.][^\/])|([^\/][^\/][^\/]+))\/\.\.\//;
            while (pattern.test(r)) {
                r = r.replace(pattern, '/');
            }
            // replace ^aa/../ => nothing (BUT IGNORE ../../)
            r = r.replace(/^(([^\/])|([^\/][^\/\.])|([^\/\.][^\/])|([^\/][^\/][^\/]+))\/\.\.\//, '');
            return r;
        };
        /**
         * Resolve relative module ids
         */
        ModuleIdResolver.prototype.resolveModule = function (moduleId) {
            var result = moduleId;
            if (!AMDLoader.Utilities.isAbsolutePath(result)) {
                if (AMDLoader.Utilities.startsWith(result, './') || AMDLoader.Utilities.startsWith(result, '../')) {
                    result = ModuleIdResolver._normalizeModuleId(this.fromModulePath + result);
                }
            }
            return result;
        };
        ModuleIdResolver.ROOT = new ModuleIdResolver('');
        return ModuleIdResolver;
    }());
    AMDLoader.ModuleIdResolver = ModuleIdResolver;
    // ------------------------------------------------------------------------
    // Module
    var Module = /** @class */ (function () {
        function Module(id, strId, dependencies, callback, errorback, moduleIdResolver) {
            this.id = id;
            this.strId = strId;
            this.dependencies = dependencies;
            this._callback = callback;
            this._errorback = errorback;
            this.moduleIdResolver = moduleIdResolver;
            this.exports = {};
            this.error = null;
            this.exportsPassedIn = false;
            this.unresolvedDependenciesCount = this.dependencies.length;
            this._isComplete = false;
        }
        Module._safeInvokeFunction = function (callback, args) {
            try {
                return {
                    returnedValue: callback.apply(AMDLoader.global, args),
                    producedError: null
                };
            }
            catch (e) {
                return {
                    returnedValue: null,
                    producedError: e
                };
            }
        };
        Module._invokeFactory = function (config, strModuleId, callback, dependenciesValues) {
            if (config.isBuild() && !AMDLoader.Utilities.isAnonymousModule(strModuleId)) {
                return {
                    returnedValue: null,
                    producedError: null
                };
            }
            if (config.shouldCatchError()) {
                return this._safeInvokeFunction(callback, dependenciesValues);
            }
            return {
                returnedValue: callback.apply(AMDLoader.global, dependenciesValues),
                producedError: null
            };
        };
        Module.prototype.complete = function (recorder, config, dependenciesValues) {
            this._isComplete = true;
            var producedError = null;
            if (this._callback) {
                if (typeof this._callback === 'function') {
                    recorder.record(21 /* BeginInvokeFactory */, this.strId);
                    var r = Module._invokeFactory(config, this.strId, this._callback, dependenciesValues);
                    producedError = r.producedError;
                    recorder.record(22 /* EndInvokeFactory */, this.strId);
                    if (!producedError && typeof r.returnedValue !== 'undefined' && (!this.exportsPassedIn || AMDLoader.Utilities.isEmpty(this.exports))) {
                        this.exports = r.returnedValue;
                    }
                }
                else {
                    this.exports = this._callback;
                }
            }
            if (producedError) {
                var err = AMDLoader.ensureError(producedError);
                err.phase = 'factory';
                err.moduleId = this.strId;
                this.error = err;
                config.onError(err);
            }
            this.dependencies = null;
            this._callback = null;
            this._errorback = null;
            this.moduleIdResolver = null;
        };
        /**
         * One of the direct dependencies or a transitive dependency has failed to load.
         */
        Module.prototype.onDependencyError = function (err) {
            this._isComplete = true;
            this.error = err;
            if (this._errorback) {
                this._errorback(err);
                return true;
            }
            return false;
        };
        /**
         * Is the current module complete?
         */
        Module.prototype.isComplete = function () {
            return this._isComplete;
        };
        return Module;
    }());
    AMDLoader.Module = Module;
    var ModuleIdProvider = /** @class */ (function () {
        function ModuleIdProvider() {
            this._nextId = 0;
            this._strModuleIdToIntModuleId = new Map();
            this._intModuleIdToStrModuleId = [];
            // Ensure values 0, 1, 2 are assigned accordingly with ModuleId
            this.getModuleId('exports');
            this.getModuleId('module');
            this.getModuleId('require');
        }
        ModuleIdProvider.prototype.getMaxModuleId = function () {
            return this._nextId;
        };
        ModuleIdProvider.prototype.getModuleId = function (strModuleId) {
            var id = this._strModuleIdToIntModuleId.get(strModuleId);
            if (typeof id === 'undefined') {
                id = this._nextId++;
                this._strModuleIdToIntModuleId.set(strModuleId, id);
                this._intModuleIdToStrModuleId[id] = strModuleId;
            }
            return id;
        };
        ModuleIdProvider.prototype.getStrModuleId = function (moduleId) {
            return this._intModuleIdToStrModuleId[moduleId];
        };
        return ModuleIdProvider;
    }());
    var RegularDependency = /** @class */ (function () {
        function RegularDependency(id) {
            this.id = id;
        }
        RegularDependency.EXPORTS = new RegularDependency(0 /* EXPORTS */);
        RegularDependency.MODULE = new RegularDependency(1 /* MODULE */);
        RegularDependency.REQUIRE = new RegularDependency(2 /* REQUIRE */);
        return RegularDependency;
    }());
    AMDLoader.RegularDependency = RegularDependency;
    var PluginDependency = /** @class */ (function () {
        function PluginDependency(id, pluginId, pluginParam) {
            this.id = id;
            this.pluginId = pluginId;
            this.pluginParam = pluginParam;
        }
        return PluginDependency;
    }());
    AMDLoader.PluginDependency = PluginDependency;
    var ModuleManager = /** @class */ (function () {
        function ModuleManager(env, scriptLoader, defineFunc, requireFunc, loaderAvailableTimestamp) {
            if (loaderAvailableTimestamp === void 0) { loaderAvailableTimestamp = 0; }
            this._env = env;
            this._scriptLoader = scriptLoader;
            this._loaderAvailableTimestamp = loaderAvailableTimestamp;
            this._defineFunc = defineFunc;
            this._requireFunc = requireFunc;
            this._moduleIdProvider = new ModuleIdProvider();
            this._config = new AMDLoader.Configuration(this._env);
            this._hasDependencyCycle = false;
            this._modules2 = [];
            this._knownModules2 = [];
            this._inverseDependencies2 = [];
            this._inversePluginDependencies2 = new Map();
            this._currentAnonymousDefineCall = null;
            this._recorder = null;
            this._buildInfoPath = [];
            this._buildInfoDefineStack = [];
            this._buildInfoDependencies = [];
        }
        ModuleManager.prototype.reset = function () {
            return new ModuleManager(this._env, this._scriptLoader, this._defineFunc, this._requireFunc, this._loaderAvailableTimestamp);
        };
        ModuleManager.prototype.getGlobalAMDDefineFunc = function () {
            return this._defineFunc;
        };
        ModuleManager.prototype.getGlobalAMDRequireFunc = function () {
            return this._requireFunc;
        };
        ModuleManager._findRelevantLocationInStack = function (needle, stack) {
            var normalize = function (str) { return str.replace(/\\/g, '/'); };
            var normalizedPath = normalize(needle);
            var stackPieces = stack.split(/\n/);
            for (var i = 0; i < stackPieces.length; i++) {
                var m = stackPieces[i].match(/(.*):(\d+):(\d+)\)?$/);
                if (m) {
                    var stackPath = m[1];
                    var stackLine = m[2];
                    var stackColumn = m[3];
                    var trimPathOffset = Math.max(stackPath.lastIndexOf(' ') + 1, stackPath.lastIndexOf('(') + 1);
                    stackPath = stackPath.substr(trimPathOffset);
                    stackPath = normalize(stackPath);
                    if (stackPath === normalizedPath) {
                        var r = {
                            line: parseInt(stackLine, 10),
                            col: parseInt(stackColumn, 10)
                        };
                        if (r.line === 1) {
                            r.col -= '(function (require, define, __filename, __dirname) { '.length;
                        }
                        return r;
                    }
                }
            }
            throw new Error('Could not correlate define call site for needle ' + needle);
        };
        ModuleManager.prototype.getBuildInfo = function () {
            if (!this._config.isBuild()) {
                return null;
            }
            var result = [], resultLen = 0;
            for (var i = 0, len = this._modules2.length; i < len; i++) {
                var m = this._modules2[i];
                if (!m) {
                    continue;
                }
                var location_1 = this._buildInfoPath[m.id] || null;
                var defineStack = this._buildInfoDefineStack[m.id] || null;
                var dependencies = this._buildInfoDependencies[m.id];
                result[resultLen++] = {
                    id: m.strId,
                    path: location_1,
                    defineLocation: (location_1 && defineStack ? ModuleManager._findRelevantLocationInStack(location_1, defineStack) : null),
                    dependencies: dependencies,
                    shim: null,
                    exports: m.exports
                };
            }
            return result;
        };
        ModuleManager.prototype.getRecorder = function () {
            if (!this._recorder) {
                if (this._config.shouldRecordStats()) {
                    this._recorder = new AMDLoader.LoaderEventRecorder(this._loaderAvailableTimestamp);
                }
                else {
                    this._recorder = AMDLoader.NullLoaderEventRecorder.INSTANCE;
                }
            }
            return this._recorder;
        };
        ModuleManager.prototype.getLoaderEvents = function () {
            return this.getRecorder().getEvents();
        };
        /**
         * Defines an anonymous module (without an id). Its name will be resolved as we receive a callback from the scriptLoader.
         * @param dependencies @see defineModule
         * @param callback @see defineModule
         */
        ModuleManager.prototype.enqueueDefineAnonymousModule = function (dependencies, callback) {
            if (this._currentAnonymousDefineCall !== null) {
                throw new Error('Can only have one anonymous define call per script file');
            }
            var stack = null;
            if (this._config.isBuild()) {
                stack = new Error('StackLocation').stack || null;
            }
            this._currentAnonymousDefineCall = {
                stack: stack,
                dependencies: dependencies,
                callback: callback
            };
        };
        /**
         * Creates a module and stores it in _modules. The manager will immediately begin resolving its dependencies.
         * @param strModuleId An unique and absolute id of the module. This must not collide with another module's id
         * @param dependencies An array with the dependencies of the module. Special keys are: "require", "exports" and "module"
         * @param callback if callback is a function, it will be called with the resolved dependencies. if callback is an object, it will be considered as the exports of the module.
         */
        ModuleManager.prototype.defineModule = function (strModuleId, dependencies, callback, errorback, stack, moduleIdResolver) {
            var _this = this;
            if (moduleIdResolver === void 0) { moduleIdResolver = new ModuleIdResolver(strModuleId); }
            var moduleId = this._moduleIdProvider.getModuleId(strModuleId);
            // if (this._modules2[moduleId]) {
            //     if (!this._config.isDuplicateMessageIgnoredFor(strModuleId)) {
            //         console.warn('Duplicate definition of module \'' + strModuleId + '\'');
            //     }
            //     // Super important! Completely ignore duplicate module definition
            //     return;
            // }
            var m = new Module(moduleId, strModuleId, this._normalizeDependencies(dependencies, moduleIdResolver), callback, errorback, moduleIdResolver);
            this._modules2[moduleId] = m;
            if (this._config.isBuild()) {
                this._buildInfoDefineStack[moduleId] = stack;
                this._buildInfoDependencies[moduleId] = (m.dependencies || []).map(function (dep) { return _this._moduleIdProvider.getStrModuleId(dep.id); });
            }
            // Resolving of dependencies is immediate (not in a timeout). If there's a need to support a packer that concatenates in an
            // unordered manner, in order to finish processing the file, execute the following method in a timeout
            _currentDefineModule = m.exports;
            this._resolve(m);
        };
        ModuleManager.prototype._normalizeDependency = function (dependency, moduleIdResolver) {
            if (dependency === 'exports') {
                return RegularDependency.EXPORTS;
            }
            if (dependency === 'module') {
                return RegularDependency.MODULE;
            }
            if (dependency === 'require') {
                return RegularDependency.REQUIRE;
            }
            // Normalize dependency and then request it from the manager
            var bangIndex = dependency.indexOf('!');
            if (bangIndex >= 0) {
                var strPluginId = moduleIdResolver.resolveModule(dependency.substr(0, bangIndex));
                var pluginParam = moduleIdResolver.resolveModule(dependency.substr(bangIndex + 1));
                var dependencyId = this._moduleIdProvider.getModuleId(strPluginId + '!' + pluginParam);
                var pluginId = this._moduleIdProvider.getModuleId(strPluginId);
                return new PluginDependency(dependencyId, pluginId, pluginParam);
            }
            return new RegularDependency(this._moduleIdProvider.getModuleId(moduleIdResolver.resolveModule(dependency)));
        };
        ModuleManager.prototype._normalizeDependencies = function (dependencies, moduleIdResolver) {
            var result = [], resultLen = 0;
            for (var i = 0, len = dependencies.length; i < len; i++) {
                result[resultLen++] = this._normalizeDependency(dependencies[i], moduleIdResolver);
            }
            return result;
        };
        ModuleManager.prototype._relativeRequire = function (moduleIdResolver, dependencies, callback, errorback) {
            if (typeof dependencies === 'string') {
                return this.synchronousRequire(dependencies, moduleIdResolver);
            }
            this.defineModule(AMDLoader.Utilities.generateAnonymousModule(), dependencies, callback, errorback, null, moduleIdResolver);
        };
        /**
         * Require synchronously a module by its absolute id. If the module is not loaded, an exception will be thrown.
         * @param id The unique and absolute id of the required module
         * @return The exports of module 'id'
         */
        ModuleManager.prototype.synchronousRequire = function (_strModuleId, moduleIdResolver) {
            if (moduleIdResolver === void 0) { moduleIdResolver = new ModuleIdResolver(_strModuleId); }
            var dependency = this._normalizeDependency(_strModuleId, moduleIdResolver);
            var m = this._modules2[dependency.id];
            if (!m) {
                throw new Error('Check dependency list! Synchronous require cannot resolve module \'' + _strModuleId + '\'. This is the first mention of this module!');
            }
            if (!m.isComplete()) {
                throw new Error('Check dependency list! Synchronous require cannot resolve module \'' + _strModuleId + '\'. This module has not been resolved completely yet.');
            }
            if (m.error) {
                throw m.error;
            }
            return m.exports;
        };
        ModuleManager.prototype.configure = function (params, shouldOverwrite) {
            var oldShouldRecordStats = this._config.shouldRecordStats();
            if (shouldOverwrite) {
                this._config = new AMDLoader.Configuration(this._env, params);
            }
            else {
                this._config = this._config.cloneAndMerge(params);
            }
            if (this._config.shouldRecordStats() && !oldShouldRecordStats) {
                this._recorder = null;
            }
        };
        ModuleManager.prototype.getConfig = function () {
            return this._config;
        };
        /**
         * Callback from the scriptLoader when a module has been loaded.
         * This means its code is available and has been executed.
         */
        ModuleManager.prototype._onLoad = function (moduleId) {
            if (this._currentAnonymousDefineCall !== null) {
                var defineCall = this._currentAnonymousDefineCall;
                this._currentAnonymousDefineCall = null;
                // Hit an anonymous define call
                this.defineModule(this._moduleIdProvider.getStrModuleId(moduleId), defineCall.dependencies, defineCall.callback, null, defineCall.stack);
            }
        };
        ModuleManager.prototype._createLoadError = function (moduleId, _err) {
            var _this = this;
            var strModuleId = this._moduleIdProvider.getStrModuleId(moduleId);
            var neededBy = (this._inverseDependencies2[moduleId] || []).map(function (intModuleId) { return _this._moduleIdProvider.getStrModuleId(intModuleId); });
            var err = AMDLoader.ensureError(_err);
            err.phase = 'loading';
            err.moduleId = strModuleId;
            err.neededBy = neededBy;
            return err;
        };
        /**
         * Callback from the scriptLoader when a module hasn't been loaded.
         * This means that the script was not found (e.g. 404) or there was an error in the script.
         */
        ModuleManager.prototype._onLoadError = function (moduleId, err) {
            var error = this._createLoadError(moduleId, err);
            if (!this._modules2[moduleId]) {
                this._modules2[moduleId] = new Module(moduleId, this._moduleIdProvider.getStrModuleId(moduleId), [], function () { }, null, null);
            }
            // Find any 'local' error handlers, walk the entire chain of inverse dependencies if necessary.
            var seenModuleId = [];
            for (var i = 0, len = this._moduleIdProvider.getMaxModuleId(); i < len; i++) {
                seenModuleId[i] = false;
            }
            var someoneNotified = false;
            var queue = [];
            queue.push(moduleId);
            seenModuleId[moduleId] = true;
            while (queue.length > 0) {
                var queueElement = queue.shift();
                var m = this._modules2[queueElement];
                if (m) {
                    someoneNotified = m.onDependencyError(error) || someoneNotified;
                }
                var inverseDeps = this._inverseDependencies2[queueElement];
                if (inverseDeps) {
                    for (var i = 0, len = inverseDeps.length; i < len; i++) {
                        var inverseDep = inverseDeps[i];
                        if (!seenModuleId[inverseDep]) {
                            queue.push(inverseDep);
                            seenModuleId[inverseDep] = true;
                        }
                    }
                }
            }
            if (!someoneNotified) {
                this._config.onError(error);
            }
        };
        /**
         * Walks (recursively) the dependencies of 'from' in search of 'to'.
         * Returns true if there is such a path or false otherwise.
         * @param from Module id to start at
         * @param to Module id to look for
         */
        ModuleManager.prototype._hasDependencyPath = function (fromId, toId) {
            var from = this._modules2[fromId];
            if (!from) {
                return false;
            }
            var inQueue = [];
            for (var i = 0, len = this._moduleIdProvider.getMaxModuleId(); i < len; i++) {
                inQueue[i] = false;
            }
            var queue = [];
            // Insert 'from' in queue
            queue.push(from);
            inQueue[fromId] = true;
            while (queue.length > 0) {
                // Pop first inserted element of queue
                var element = queue.shift();
                var dependencies = element.dependencies;
                if (dependencies) {
                    // Walk the element's dependencies
                    for (var i = 0, len = dependencies.length; i < len; i++) {
                        var dependency = dependencies[i];
                        if (dependency.id === toId) {
                            // There is a path to 'to'
                            return true;
                        }
                        var dependencyModule = this._modules2[dependency.id];
                        if (dependencyModule && !inQueue[dependency.id]) {
                            // Insert 'dependency' in queue
                            inQueue[dependency.id] = true;
                            queue.push(dependencyModule);
                        }
                    }
                }
            }
            // There is no path to 'to'
            return false;
        };
        /**
         * Walks (recursively) the dependencies of 'from' in search of 'to'.
         * Returns cycle as array.
         * @param from Module id to start at
         * @param to Module id to look for
         */
        ModuleManager.prototype._findCyclePath = function (fromId, toId, depth) {
            if (fromId === toId || depth === 50) {
                return [fromId];
            }
            var from = this._modules2[fromId];
            if (!from) {
                return null;
            }
            // Walk the element's dependencies
            var dependencies = from.dependencies;
            if (dependencies) {
                for (var i = 0, len = dependencies.length; i < len; i++) {
                    var path = this._findCyclePath(dependencies[i].id, toId, depth + 1);
                    if (path !== null) {
                        path.push(fromId);
                        return path;
                    }
                }
            }
            return null;
        };
        /**
         * Create the local 'require' that is passed into modules
         */
        ModuleManager.prototype._createRequire = function (moduleIdResolver) {
            var _this = this;
            var result = (function (dependencies, callback, errorback) {
                return _this._relativeRequire(moduleIdResolver, dependencies, callback, errorback);
            });
            result.toUrl = function (id) {
                return _this._config.requireToUrl(moduleIdResolver.resolveModule(id));
            };
            result.getStats = function () {
                return _this.getLoaderEvents();
            };
            result.hasDependencyCycle = function () {
                return _this._hasDependencyCycle;
            };
            result.config = function (params, shouldOverwrite) {
                if (shouldOverwrite === void 0) { shouldOverwrite = false; }
                _this.configure(params, shouldOverwrite);
            };
            result.__$__nodeRequire = AMDLoader.global.nodeRequire;
            return result;
        };
        ModuleManager.prototype._loadModule = function (moduleId) {
            var _this = this;
            if (this._modules2[moduleId] || this._knownModules2[moduleId]) {
                // known module
                return;
            }
            this._knownModules2[moduleId] = true;
            var strModuleId = this._moduleIdProvider.getStrModuleId(moduleId);
            var paths = this._config.moduleIdToPaths(strModuleId);
            var scopedPackageRegex = /^@[^\/]+\/[^\/]+$/; // matches @scope/package-name
            if (this._env.isNode && (strModuleId.indexOf('/') === -1 || scopedPackageRegex.test(strModuleId))) {
                paths.push('node|' + strModuleId);
            }
            var lastPathIndex = -1;
            var loadNextPath = function (err) {
                lastPathIndex++;
                if (lastPathIndex >= paths.length) {
                    // No more paths to try
                    _this._onLoadError(moduleId, err);
                }
                else {
                    var currentPath_1 = paths[lastPathIndex];
                    var recorder_1 = _this.getRecorder();
                    if (_this._config.isBuild() && currentPath_1 === 'empty:') {
                        _this._buildInfoPath[moduleId] = currentPath_1;
                        _this.defineModule(_this._moduleIdProvider.getStrModuleId(moduleId), [], null, null, null);
                        _this._onLoad(moduleId);
                        return;
                    }
                    recorder_1.record(10 /* BeginLoadingScript */, currentPath_1);
                    _this._scriptLoader.load(_this, currentPath_1, function () {
                        if (_this._config.isBuild()) {
                            _this._buildInfoPath[moduleId] = currentPath_1;
                        }
                        recorder_1.record(11 /* EndLoadingScriptOK */, currentPath_1);
                        _this._onLoad(moduleId);
                    }, function (err) {
                        recorder_1.record(12 /* EndLoadingScriptError */, currentPath_1);
                        loadNextPath(err);
                    });
                }
            };
            loadNextPath(null);
        };
        /**
         * Resolve a plugin dependency with the plugin loaded & complete
         * @param module The module that has this dependency
         * @param pluginDependency The semi-normalized dependency that appears in the module. e.g. 'vs/css!./mycssfile'. Only the plugin part (before !) is normalized
         * @param plugin The plugin (what the plugin exports)
         */
        ModuleManager.prototype._loadPluginDependency = function (plugin, pluginDependency) {
            var _this = this;
            if (this._modules2[pluginDependency.id] || this._knownModules2[pluginDependency.id]) {
                // known module
                return;
            }
            this._knownModules2[pluginDependency.id] = true;
            // Delegate the loading of the resource to the plugin
            var load = (function (value) {
                _this.defineModule(_this._moduleIdProvider.getStrModuleId(pluginDependency.id), [], value, null, null);
            });
            load.error = function (err) {
                _this._config.onError(_this._createLoadError(pluginDependency.id, err));
            };
            plugin.load(pluginDependency.pluginParam, this._createRequire(ModuleIdResolver.ROOT), load, this._config.getOptionsLiteral());
        };
        /**
         * Examine the dependencies of module 'module' and resolve them as needed.
         */
        ModuleManager.prototype._resolve = function (module) {
            var _this = this;
            var dependencies = module.dependencies;
            if (dependencies) {
                for (var i = 0, len = dependencies.length; i < len; i++) {
                    var dependency = dependencies[i];
                    if (dependency === RegularDependency.EXPORTS) {
                        module.exportsPassedIn = true;
                        module.unresolvedDependenciesCount--;
                        continue;
                    }
                    if (dependency === RegularDependency.MODULE) {
                        module.unresolvedDependenciesCount--;
                        continue;
                    }
                    if (dependency === RegularDependency.REQUIRE) {
                        module.unresolvedDependenciesCount--;
                        continue;
                    }
                    var dependencyModule = this._modules2[dependency.id];
                    if (dependencyModule && dependencyModule.isComplete()) {
                        if (dependencyModule.error) {
                            module.onDependencyError(dependencyModule.error);
                            return;
                        }
                        module.unresolvedDependenciesCount--;
                        continue;
                    }
                    if (this._hasDependencyPath(dependency.id, module.id)) {
                        this._hasDependencyCycle = true;
                        console.warn('There is a dependency cycle between \'' + this._moduleIdProvider.getStrModuleId(dependency.id) + '\' and \'' + this._moduleIdProvider.getStrModuleId(module.id) + '\'. The cyclic path follows:');
                        var cyclePath = this._findCyclePath(dependency.id, module.id, 0) || [];
                        cyclePath.reverse();
                        cyclePath.push(dependency.id);
                        console.warn(cyclePath.map(function (id) { return _this._moduleIdProvider.getStrModuleId(id); }).join(' => \n'));
                        // Break the cycle
                        module.unresolvedDependenciesCount--;
                        continue;
                    }
                    // record inverse dependency
                    this._inverseDependencies2[dependency.id] = this._inverseDependencies2[dependency.id] || [];
                    this._inverseDependencies2[dependency.id].push(module.id);
                    if (dependency instanceof PluginDependency) {
                        var plugin = this._modules2[dependency.pluginId];
                        if (plugin && plugin.isComplete()) {
                            this._loadPluginDependency(plugin.exports, dependency);
                            continue;
                        }
                        // Record dependency for when the plugin gets loaded
                        var inversePluginDeps = this._inversePluginDependencies2.get(dependency.pluginId);
                        if (!inversePluginDeps) {
                            inversePluginDeps = [];
                            this._inversePluginDependencies2.set(dependency.pluginId, inversePluginDeps);
                        }
                        inversePluginDeps.push(dependency);
                        this._loadModule(dependency.pluginId);
                        continue;
                    }
                    this._loadModule(dependency.id);
                }
            }
            if (module.unresolvedDependenciesCount === 0) {
                this._onModuleComplete(module);
            }
        };
        ModuleManager.prototype._onModuleComplete = function (module) {
            var _this = this;
            var recorder = this.getRecorder();
            if (module.isComplete()) {
                // already done
                return;
            }
            var dependencies = module.dependencies;
            var dependenciesValues = [];
            if (dependencies) {
                for (var i = 0, len = dependencies.length; i < len; i++) {
                    var dependency = dependencies[i];
                    if (dependency === RegularDependency.EXPORTS) {
                        dependenciesValues[i] = module.exports;
                        continue;
                    }
                    if (dependency === RegularDependency.MODULE) {
                        dependenciesValues[i] = {
                            id: module.strId,
                            config: function () {
                                return _this._config.getConfigForModule(module.strId);
                            }
                        };
                        continue;
                    }
                    if (dependency === RegularDependency.REQUIRE) {
                        dependenciesValues[i] = this._createRequire(module.moduleIdResolver);
                        continue;
                    }
                    var dependencyModule = this._modules2[dependency.id];
                    if (dependencyModule) {
                        dependenciesValues[i] = dependencyModule.exports;
                        continue;
                    }
                    dependenciesValues[i] = null;
                }
            }
            module.complete(recorder, this._config, dependenciesValues);
            // Fetch and clear inverse dependencies
            var inverseDeps = this._inverseDependencies2[module.id];
            this._inverseDependencies2[module.id] = null;
            if (inverseDeps) {
                // Resolve one inverse dependency at a time, always
                // on the lookout for a completed module.
                for (var i = 0, len = inverseDeps.length; i < len; i++) {
                    var inverseDependencyId = inverseDeps[i];
                    var inverseDependency = this._modules2[inverseDependencyId];
                    inverseDependency.unresolvedDependenciesCount--;
                    if (inverseDependency.unresolvedDependenciesCount === 0) {
                        this._onModuleComplete(inverseDependency);
                    }
                }
            }
            var inversePluginDeps = this._inversePluginDependencies2.get(module.id);
            if (inversePluginDeps) {
                // This module is used as a plugin at least once
                // Fetch and clear these inverse plugin dependencies
                this._inversePluginDependencies2.delete(module.id);
                // Resolve plugin dependencies one at a time
                for (var i = 0, len = inversePluginDeps.length; i < len; i++) {
                    this._loadPluginDependency(module.exports, inversePluginDeps[i]);
                }
            }
        };
        return ModuleManager;
    }());
    AMDLoader.ModuleManager = ModuleManager;
})(AMDLoader || (AMDLoader = {}));
var define;
var AMDLoader;
(function (AMDLoader) {
    var env = new AMDLoader.Environment();
    var moduleManager = null;
    var DefineFunc = function (id, dependencies, callback) {
        if (typeof id !== 'string') {
            callback = dependencies;
            dependencies = id;
            id = null;
        }
        if (typeof dependencies !== 'object' || !Array.isArray(dependencies)) {
            callback = dependencies;
            dependencies = null;
        }
        if (!dependencies) {
            dependencies = ['require', 'exports', 'module'];
        }
        if (id) {
            moduleManager.defineModule(id, dependencies, callback, null, null);
        }
        else {
            moduleManager.enqueueDefineAnonymousModule(dependencies, callback);
        }
    };
    DefineFunc.amd = {
        jQuery: true
    };
    var _requireFunc_config = function (params, shouldOverwrite) {
        if (shouldOverwrite === void 0) { shouldOverwrite = false; }
        moduleManager.configure(params, shouldOverwrite);
    };
    var RequireFunc = function () {
        if (arguments.length === 1) {
            if ((arguments[0] instanceof Object) && !Array.isArray(arguments[0])) {
                _requireFunc_config(arguments[0]);
                return;
            }
            if (typeof arguments[0] === 'string') {
                return moduleManager.synchronousRequire(arguments[0]);
            }
        }
        if (arguments.length === 2 || arguments.length === 3) {
            if (Array.isArray(arguments[0])) {
                moduleManager.defineModule(AMDLoader.Utilities.generateAnonymousModule(), arguments[0], arguments[1], arguments[2], null);
                return;
            }
        }
        throw new Error('Unrecognized require call');
    };
    RequireFunc.config = _requireFunc_config;
    RequireFunc.getConfig = function () {
        return moduleManager.getConfig().getOptionsLiteral();
    };
    RequireFunc.reset = function () {
        moduleManager = moduleManager.reset();
    };
    RequireFunc.getBuildInfo = function () {
        return moduleManager.getBuildInfo();
    };
    RequireFunc.getStats = function () {
        return moduleManager.getLoaderEvents();
    };
    RequireFunc.define = DefineFunc;
    RequireFunc.defined = function(module){
        let moduleId = moduleManager._moduleIdProvider.getModuleId(module);
        if (moduleManager._modules2[moduleId])
            return true;
        return false;
    };
    function init() {
        if (typeof AMDLoader.global.require !== 'undefined' || typeof require !== 'undefined') {
            var _nodeRequire = (AMDLoader.global.require || require);
            if (typeof _nodeRequire === 'function' && typeof _nodeRequire.resolve === 'function') {
                // re-expose node's require function
                var nodeRequire = AMDLoader.ensureRecordedNodeRequire(moduleManager.getRecorder(), _nodeRequire);
                AMDLoader.global.nodeRequire = nodeRequire;
                RequireFunc.nodeRequire = nodeRequire;
                RequireFunc.__$__nodeRequire = nodeRequire;
            }
        }
        if (env.isNode && !env.isElectronRenderer && !env.isElectronNodeIntegrationWebWorker) {
            module.exports = RequireFunc;
            require = RequireFunc;
        }
        else {
            if (!env.isElectronRenderer) {
                AMDLoader.global.define = DefineFunc;
            }
            AMDLoader.global.require = RequireFunc;
        }
    }
    AMDLoader.init = init;
    if (typeof AMDLoader.global.define !== 'function' || !AMDLoader.global.define.amd) {
        moduleManager = new AMDLoader.ModuleManager(env, AMDLoader.createScriptLoader(env), DefineFunc, RequireFunc, AMDLoader.Utilities.getHighPerformanceTimestamp());
        // The global variable require can configure the loader
        if (typeof AMDLoader.global.require !== 'undefined' && typeof AMDLoader.global.require !== 'function') {
            RequireFunc.config(AMDLoader.global.require);
        }
        // This define is for the local closure defined in node in the case that the loader is concatenated
        define = function () {
            return DefineFunc.apply(null, arguments);
        };
        define.amd = DefineFunc.amd;
        if (typeof doNotInitLoader === 'undefined') {
            init();
        }
    }
})(AMDLoader || (AMDLoader = {}));

define("@ijstech/components",(require, exports)=>{
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __decorateClass = (decorators, target, key2, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key2) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key2, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key2, result);
  return result;
};

// src/index.ts
__export(exports, {
  BarChart: () => BarChart,
  Button: () => Button,
  CardLayout: () => CardLayout,
  CarouselSlider: () => CarouselSlider,
  Checkbox: () => Checkbox,
  ClearObservers: () => ClearObservers,
  CodeDiffEditor: () => CodeDiffEditor,
  CodeEditor: () => CodeEditor,
  ComboBox: () => ComboBox,
  Component: () => Component,
  Container: () => Container,
  Control: () => Control,
  Datepicker: () => Datepicker,
  EventBus: () => EventBus,
  GridLayout: () => GridLayout,
  HStack: () => HStack,
  Icon: () => Icon,
  Iframe: () => Iframe,
  Image: () => Image2,
  Input: () => Input,
  Label: () => Label,
  LibPath: () => LibPath,
  LineChart: () => LineChart,
  Link: () => Link,
  Markdown: () => Markdown,
  MarkdownEditor: () => MarkdownEditor,
  Menu: () => Menu,
  Modal: () => Modal,
  Module: () => Module,
  Observe: () => Observe,
  Pagination: () => Pagination,
  Panel: () => Panel,
  PieChart: () => PieChart,
  Progress: () => Progress,
  Radio: () => Radio,
  RadioGroup: () => RadioGroup,
  Range: () => Range,
  RequireJS: () => RequireJS,
  ScatterChart: () => ScatterChart,
  ScatterLineChart: () => ScatterLineChart,
  Search: () => Search,
  Styles: () => src_exports,
  Switch: () => Switch,
  Tab: () => Tab,
  Table: () => Table,
  TableColumn: () => TableColumn,
  Tabs: () => Tabs,
  Tooltip: () => Tooltip,
  TreeNode: () => TreeNode,
  TreeView: () => TreeView,
  Unobserve: () => Unobserve,
  Upload: () => Upload,
  VStack: () => VStack,
  application: () => application,
  customElements: () => customElements2,
  customModule: () => customModule,
  isObservable: () => isObservable,
  observable: () => observable
});

// packages/style/src/index.ts
var src_exports = {};
__export(src_exports, {
  Colors: () => Colors,
  Theme: () => theme_exports,
  cssRaw: () => cssRaw,
  cssRule: () => cssRule,
  fontFace: () => fontFace,
  keyframes: () => keyframes,
  rotate: () => rotate,
  style: () => style
});

// packages/style/src/theme.ts
var theme_exports = {};
__export(theme_exports, {
  ColorVars: () => ColorVars,
  Colors: () => Colors,
  ThemeVars: () => ThemeVars,
  applyTheme: () => applyTheme,
  darkTheme: () => darkTheme,
  defaultTheme: () => defaultTheme
});

// packages/style/src/colors.ts
var amber = {
  50: "#fff8e1",
  100: "#ffecb3",
  200: "#ffe082",
  300: "#ffd54f",
  400: "#ffca28",
  500: "#ffc107",
  600: "#ffb300",
  700: "#ffa000",
  800: "#ff8f00",
  900: "#ff6f00",
  A100: "#ffe57f",
  A200: "#ffd740",
  A400: "#ffc400",
  A700: "#ffab00"
};
var blue = {
  50: "#e3f2fd",
  100: "#bbdefb",
  200: "#90caf9",
  300: "#64b5f6",
  400: "#42a5f5",
  500: "#2196f3",
  600: "#1e88e5",
  700: "#1976d2",
  800: "#1565c0",
  900: "#0d47a1",
  A100: "#82b1ff",
  A200: "#448aff",
  A400: "#2979ff",
  A700: "#2962ff"
};
var blueGrey = {
  50: "#eceff1",
  100: "#cfd8dc",
  200: "#b0bec5",
  300: "#90a4ae",
  400: "#78909c",
  500: "#607d8b",
  600: "#546e7a",
  700: "#455a64",
  800: "#37474f",
  900: "#263238",
  A100: "#cfd8dc",
  A200: "#b0bec5",
  A400: "#78909c",
  A700: "#455a64"
};
var brown = {
  50: "#efebe9",
  100: "#d7ccc8",
  200: "#bcaaa4",
  300: "#a1887f",
  400: "#8d6e63",
  500: "#795548",
  600: "#6d4c41",
  700: "#5d4037",
  800: "#4e342e",
  900: "#3e2723",
  A100: "#d7ccc8",
  A200: "#bcaaa4",
  A400: "#8d6e63",
  A700: "#5d4037"
};
var cyan = {
  50: "#e0f7fa",
  100: "#b2ebf2",
  200: "#80deea",
  300: "#4dd0e1",
  400: "#26c6da",
  500: "#00bcd4",
  600: "#00acc1",
  700: "#0097a7",
  800: "#00838f",
  900: "#006064",
  A100: "#84ffff",
  A200: "#18ffff",
  A400: "#00e5ff",
  A700: "#00b8d4"
};
var deepOrange = {
  50: "#fbe9e7",
  100: "#ffccbc",
  200: "#ffab91",
  300: "#ff8a65",
  400: "#ff7043",
  500: "#ff5722",
  600: "#f4511e",
  700: "#e64a19",
  800: "#d84315",
  900: "#bf360c",
  A100: "#ff9e80",
  A200: "#ff6e40",
  A400: "#ff3d00",
  A700: "#dd2c00"
};
var deepPurple = {
  50: "#ede7f6",
  100: "#d1c4e9",
  200: "#b39ddb",
  300: "#9575cd",
  400: "#7e57c2",
  500: "#673ab7",
  600: "#5e35b1",
  700: "#512da8",
  800: "#4527a0",
  900: "#311b92",
  A100: "#b388ff",
  A200: "#7c4dff",
  A400: "#651fff",
  A700: "#6200ea"
};
var green = {
  50: "#e8f5e9",
  100: "#c8e6c9",
  200: "#a5d6a7",
  300: "#81c784",
  400: "#66bb6a",
  500: "#4caf50",
  600: "#43a047",
  700: "#388e3c",
  800: "#2e7d32",
  900: "#1b5e20",
  A100: "#b9f6ca",
  A200: "#69f0ae",
  A400: "#00e676",
  A700: "#00c853"
};
var grey = {
  50: "#fafafa",
  100: "#f5f5f5",
  200: "#eeeeee",
  300: "#e0e0e0",
  400: "#bdbdbd",
  500: "#9e9e9e",
  600: "#757575",
  700: "#616161",
  800: "#424242",
  900: "#212121",
  A100: "#f5f5f5",
  A200: "#eeeeee",
  A400: "#bdbdbd",
  A700: "#616161"
};
var indigo = {
  50: "#e8eaf6",
  100: "#c5cae9",
  200: "#9fa8da",
  300: "#7986cb",
  400: "#5c6bc0",
  500: "#3f51b5",
  600: "#3949ab",
  700: "#303f9f",
  800: "#283593",
  900: "#1a237e",
  A100: "#8c9eff",
  A200: "#536dfe",
  A400: "#3d5afe",
  A700: "#304ffe"
};
var lightBlue = {
  50: "#e1f5fe",
  100: "#b3e5fc",
  200: "#81d4fa",
  300: "#4fc3f7",
  400: "#29b6f6",
  500: "#03a9f4",
  600: "#039be5",
  700: "#0288d1",
  800: "#0277bd",
  900: "#01579b",
  A100: "#80d8ff",
  A200: "#40c4ff",
  A400: "#00b0ff",
  A700: "#0091ea"
};
var lightGreen = {
  50: "#f1f8e9",
  100: "#dcedc8",
  200: "#c5e1a5",
  300: "#aed581",
  400: "#9ccc65",
  500: "#8bc34a",
  600: "#7cb342",
  700: "#689f38",
  800: "#558b2f",
  900: "#33691e",
  A100: "#ccff90",
  A200: "#b2ff59",
  A400: "#76ff03",
  A700: "#64dd17"
};
var lime = {
  50: "#f9fbe7",
  100: "#f0f4c3",
  200: "#e6ee9c",
  300: "#dce775",
  400: "#d4e157",
  500: "#cddc39",
  600: "#c0ca33",
  700: "#afb42b",
  800: "#9e9d24",
  900: "#827717",
  A100: "#f4ff81",
  A200: "#eeff41",
  A400: "#c6ff00",
  A700: "#aeea00"
};
var orange = {
  50: "#fff3e0",
  100: "#ffe0b2",
  200: "#ffcc80",
  300: "#ffb74d",
  400: "#ffa726",
  500: "#ff9800",
  600: "#fb8c00",
  700: "#f57c00",
  800: "#ef6c00",
  900: "#e65100",
  A100: "#ffd180",
  A200: "#ffab40",
  A400: "#ff9100",
  A700: "#ff6d00"
};
var pink = {
  50: "#fce4ec",
  100: "#f8bbd0",
  200: "#f48fb1",
  300: "#f06292",
  400: "#ec407a",
  500: "#e91e63",
  600: "#d81b60",
  700: "#c2185b",
  800: "#ad1457",
  900: "#880e4f",
  A100: "#ff80ab",
  A200: "#ff4081",
  A400: "#f50057",
  A700: "#c51162"
};
var purple = {
  50: "#f3e5f5",
  100: "#e1bee7",
  200: "#ce93d8",
  300: "#ba68c8",
  400: "#ab47bc",
  500: "#9c27b0",
  600: "#8e24aa",
  700: "#7b1fa2",
  800: "#6a1b9a",
  900: "#4a148c",
  A100: "#ea80fc",
  A200: "#e040fb",
  A400: "#d500f9",
  A700: "#aa00ff"
};
var red = {
  50: "#ffebee",
  100: "#ffcdd2",
  200: "#ef9a9a",
  300: "#e57373",
  400: "#ef5350",
  500: "#f44336",
  600: "#e53935",
  700: "#d32f2f",
  800: "#c62828",
  900: "#b71c1c",
  A100: "#ff8a80",
  A200: "#ff5252",
  A400: "#ff1744",
  A700: "#d50000"
};
var teal = {
  50: "#e0f2f1",
  100: "#b2dfdb",
  200: "#80cbc4",
  300: "#4db6ac",
  400: "#26a69a",
  500: "#009688",
  600: "#00897b",
  700: "#00796b",
  800: "#00695c",
  900: "#004d40",
  A100: "#a7ffeb",
  A200: "#64ffda",
  A400: "#1de9b6",
  A700: "#00bfa5"
};
var yellow = {
  50: "#fffde7",
  100: "#fff9c4",
  200: "#fff59d",
  300: "#fff176",
  400: "#ffee58",
  500: "#ffeb3b",
  600: "#fdd835",
  700: "#fbc02d",
  800: "#f9a825",
  900: "#f57f17",
  A100: "#ffff8d",
  A200: "#ffff00",
  A400: "#ffea00",
  A700: "#ffd600"
};
var Colors = {
  amber,
  blue,
  blueGrey,
  brown,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow
};

// packages/style/src/theme.ts
var defaultTheme = {
  action: {
    active: "rgba(0, 0, 0, 0.54)",
    activeOpacity: 0.12,
    disabled: "rgba(0, 0, 0, 0.26)",
    disabledBackground: "rgba(0, 0, 0, 0.12)",
    disabledOpacity: 0.38,
    focus: "rgba(0, 0, 0, 0.12)",
    focusOpacity: 0.12,
    hover: "rgba(0, 0, 0, 0.04)",
    hoverOpacity: 0.04,
    selected: "rgba(0, 0, 0, 0.08)",
    selectedOpacity: 0.08
  },
  background: {
    default: "#fafafa",
    paper: "#fff",
    main: "#181e3e",
    modal: "#192046",
    gradient: "linear-gradient(90deg, #a8327f 0%, #d4626a 100%)"
  },
  breakboints: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536
  },
  divider: "rgba(0, 0, 0, 0.12)",
  colors: {
    error: {
      contrastText: "#FFFFFF",
      dark: "#D32F2F",
      light: "#e57373",
      main: "#f44336"
    },
    info: {
      contrastText: "#fff",
      dark: "#1976d2",
      light: "#64b5f6",
      main: "#2196f3"
    },
    primary: {
      contrastText: "#fff",
      dark: "rgb(44, 56, 126)",
      light: "rgb(101, 115, 195)",
      main: "#3f51b5"
    },
    secondary: {
      contrastText: "#fff",
      dark: "rgb(171, 0, 60)",
      light: "rgb(247, 51, 120)",
      main: "#f50057"
    },
    success: {
      contrastText: "rgba(0, 0, 0, 0.87)",
      dark: "#388e3c",
      light: "#81c784",
      main: "#4caf50"
    },
    warning: {
      contrastText: "rgba(0, 0, 0, 0.87)",
      dark: "#f57c00",
      light: "#ffb74d",
      main: "#ff9800"
    }
  },
  shadows: {
    0: "none",
    1: "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
    2: "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
    3: "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
    4: "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)"
  },
  text: {
    primary: "rgba(0, 0, 0, 0.87)",
    secondary: "rgba(0, 0, 0, 0.6)",
    third: "#f6c958",
    disabled: "rgba(0, 0, 0, 0.38)",
    hint: "rgba(0, 0, 0, 0.38)"
  },
  docs: {
    background: "#f6f8fa",
    text0: "#393939",
    text1: "#717171"
  },
  typography: {
    fontSize: "14px",
    fontFamily: `'roboto', 'Helvetica', 'Arial', 'Lucida Grande', 'sans-serif'`
  }
};
var darkTheme = {
  action: {
    active: "#fff",
    activeOpacity: 0.12,
    disabled: "rgba(255,255,255,0.3)",
    disabledBackground: "rgba(255,255,255, 0.12)",
    disabledOpacity: 0.38,
    focus: "rgba(255,255,255, 0.12)",
    focusOpacity: 0.12,
    hover: "rgba(255,255,255,0.08)",
    hoverOpacity: 0.08,
    selected: "rgba(255,255,255, 0.16)",
    selectedOpacity: 0.16
  },
  background: {
    default: "#303030",
    paper: "#424242",
    main: "#181e3e",
    modal: "#192046",
    gradient: "linear-gradient(90deg, #a8327f 0%, #d4626a 100%)"
  },
  breakboints: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536
  },
  colors: {
    error: {
      contrastText: "#fff",
      dark: "#d32f2f",
      light: "#e57373",
      main: "#f44336"
    },
    info: {
      contrastText: "rgba(0, 0, 0, 0.87)",
      dark: "#0288d1",
      light: "#4fc3f7",
      main: "#29b6f6"
    },
    primary: {
      contrastText: "#fff",
      dark: "rgb(44, 56, 126)",
      light: "rgb(101, 115, 195)",
      main: "#3f51b5"
    },
    secondary: {
      contrastText: "#fff",
      dark: "rgb(171, 0, 60)",
      light: "rgb(247, 51, 120)",
      main: "#f50057"
    },
    success: {
      contrastText: "rgba(0, 0, 0, 0.87)",
      dark: "#388e3c",
      light: "#81c784",
      main: "#66bb6a"
    },
    warning: {
      contrastText: "rgba(0, 0, 0, 0.87)",
      dark: "#f57c00",
      light: "#ffb74d",
      main: "#ffa726"
    }
  },
  divider: "rgba(255, 255, 255, 0.12)",
  shadows: {
    0: "none",
    1: "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
    2: "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
    3: "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
    4: "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)"
  },
  text: {
    primary: "#fff",
    secondary: "rgba(255, 255, 255, 0.7)",
    third: "#f6c958",
    disabled: "rgba(255, 255, 255, 0.5)",
    hint: "rgba(255, 255, 255, 0.5)"
  },
  docs: {
    background: "#010132",
    text0: "#fff",
    text1: "#fff"
  },
  typography: {
    fontSize: "14px",
    fontFamily: `'roboto', 'Helvetica', 'Arial', 'Lucida Grande', 'sans-serif'`
  }
};
function createThemeVars(theme, vars, prefix) {
  vars = vars || {};
  for (let v in theme) {
    if (typeof theme[v] == "object") {
      vars[v] = {};
      createThemeVars(theme[v], vars[v], prefix ? prefix + v + "-" : v + "-");
    } else {
      let name = ((prefix || "") + v).split(/(?=[A-Z])/).join("_").toLowerCase();
      vars[v] = `var(--${name})`;
    }
  }
  return vars;
}
function createThemeCss(theme, vars, prefix) {
  vars = vars || {};
  for (let v in theme) {
    if (typeof theme[v] == "object") {
      createThemeCss(theme[v], vars, prefix ? prefix + v + "-" : v + "-");
    } else {
      let name = ((prefix || "") + v).split(/(?=[A-Z])/).join("_").toLowerCase();
      vars[name] = theme[v];
    }
  }
  return vars;
}
var ThemeVars = createThemeVars(defaultTheme);
var ColorVars = createThemeVars(Colors);
var themeStyle;
function applyTheme(theme) {
  let cssVars = createThemeCss(theme);
  let css = `:root{`;
  for (let p in cssVars)
    css += `--${p}: ${cssVars[p]};`;
  css += "}";
  if (!themeStyle) {
    themeStyle = document.createElement("style");
    document.head.appendChild(themeStyle);
  }
  themeStyle.textContent = css;
}
applyTheme(defaultTheme);

// packages/style/src/styles.ts
var uniqueId = 0;
var CSS_NUMBER = Object.create(null);
var CSS_NUMBER_KEYS = [
  "animation-iteration-count",
  "border-image-outset",
  "border-image-slice",
  "border-image-width",
  "box-flex",
  "box-flex-group",
  "box-ordinal-group",
  "column-count",
  "columns",
  "counter-increment",
  "counter-reset",
  "flex",
  "flex-grow",
  "flex-positive",
  "flex-shrink",
  "flex-negative",
  "flex-order",
  "font-weight",
  "grid-area",
  "grid-column",
  "grid-column-end",
  "grid-column-span",
  "grid-column-start",
  "grid-row",
  "grid-row-end",
  "grid-row-span",
  "grid-row-start",
  "line-clamp",
  "line-height",
  "opacity",
  "order",
  "orphans",
  "tab-size",
  "widows",
  "z-index",
  "zoom",
  "fill-opacity",
  "flood-opacity",
  "stop-opacity",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width"
];
for (const property of CSS_NUMBER_KEYS) {
  for (const prefix of ["-webkit-", "-ms-", "-moz-", "-o-", ""]) {
    CSS_NUMBER[prefix + property] = true;
  }
}
function escape(str) {
  return str.replace(/[ !#$%&()*+,./;<=>?@[\]^`{|}~"'\\]/g, "\\$&");
}
function interpolate(selector, styleName) {
  return selector.replace(/&/g, styleName);
}
function hyphenate(propertyName) {
  return propertyName.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`).replace(/^ms-/, "-ms-");
}
function stringHash(str) {
  let value = 5381;
  let len = str.length;
  while (len--)
    value = value * 33 ^ str.charCodeAt(len);
  return (value >>> 0).toString(36);
}
function styleToString(name, value) {
  const suffix = typeof value === "number" && value && !CSS_NUMBER[name] ? "px" : "";
  return `${name}:${value}${suffix}`;
}
function sortTuples(value) {
  return value.sort((a, b) => a[0] > b[0] ? 1 : -1);
}
function stringifyProperties(properties) {
  return properties.map(([name, value]) => {
    if (!Array.isArray(value))
      return styleToString(name, value);
    return value.map((x) => styleToString(name, x)).join(";");
  }).join(";");
}
function child(selector, parent) {
  if (!selector)
    return parent;
  if (!selector.includes("&"))
    return `${parent} ${selector}`;
  return interpolate(selector, parent);
}
function stylize(rulesList, stylesList, key2, styles, parentClassName) {
  const properties = [];
  const nestedStyles = [];
  for (const key3 of Object.keys(styles)) {
    const value = styles[key3];
    if (key3.charCodeAt(0) !== 36 && value != null) {
      if (typeof value === "object" && !Array.isArray(value)) {
        nestedStyles.push([key3, value]);
      } else {
        properties.push([hyphenate(key3), value]);
      }
    }
  }
  const isUnique = !!styles.$unique;
  const parent = styles.$global ? "" : parentClassName;
  const nested = parent ? nestedStyles : sortTuples(nestedStyles);
  const style2 = stringifyProperties(sortTuples(properties));
  let pid = style2;
  if (key2.charCodeAt(0) === 64) {
    const childRules = [];
    const childStyles = [];
    if (parent && style2) {
      pid += `:${parent}`;
      childStyles.push({ selector: parent, style: style2, isUnique });
    }
    for (const [name, value] of nested) {
      pid += `:${stylize(childRules, childStyles, name, value, parent)}`;
    }
    rulesList.push({
      selector: key2,
      rules: childRules,
      styles: childStyles,
      style: parent ? "" : style2
    });
  } else {
    const selector = parent ? child(key2, parent) : key2;
    pid += `:${selector}`;
    if (style2) {
      stylesList.push({ selector, style: style2, isUnique });
    }
    for (const [name, value] of nested) {
      pid += `:${stylize(rulesList, stylesList, name, value, selector)}`;
    }
  }
  return pid;
}
function compose(cache, rulesList, stylesList, id, name) {
  for (const { selector, style: style2, isUnique } of stylesList) {
    const key2 = interpolate(selector, name);
    const item = new Style(style2, `s:${isUnique ? (++uniqueId).toString(36) : id}:${style2}`);
    item.add(new Selector(key2, `k:${key2}`));
    cache.add(item);
  }
  for (const { selector, style: style2, rules, styles } of rulesList) {
    const key2 = interpolate(selector, name);
    const item = new Rule(key2, style2, `r:${id}:${key2}:${style2}`);
    compose(item, rules, styles, id, name);
    cache.add(item);
  }
}
function join(arr) {
  let res = "";
  for (let i = 0; i < arr.length; i++)
    res += arr[i];
  return res;
}
var Cache = class {
  constructor(changes) {
    this.changes = changes;
    this.sheet = [];
    this.changeId = 0;
    this._keys = [];
    this._children = Object.create(null);
    this._counters = Object.create(null);
  }
  add(style2) {
    const count = this._counters[style2.id] || 0;
    const item = this._children[style2.id] || style2.clone();
    this._counters[style2.id] = count + 1;
    if (count === 0) {
      this._children[item.id] = item;
      this._keys.push(item.id);
      this.sheet.push(item.getStyles());
      this.changeId++;
      if (this.changes)
        this.changes.add(item, this._keys.length - 1);
    } else if (item instanceof Cache && style2 instanceof Cache) {
      const prevItemChangeId = item.changeId;
      item.merge(style2);
      if (item.changeId !== prevItemChangeId) {
        const index = this._keys.indexOf(style2.id);
        this.sheet.splice(index, 1, item.getStyles());
        this.changeId++;
        if (this.changes)
          this.changes.change(item, index, index);
      }
    }
  }
  remove(style2) {
    const count = this._counters[style2.id];
    if (count) {
      this._counters[style2.id] = count - 1;
      const item = this._children[style2.id];
      const index = this._keys.indexOf(item.id);
      if (count === 1) {
        delete this._counters[style2.id];
        delete this._children[style2.id];
        this._keys.splice(index, 1);
        this.sheet.splice(index, 1);
        this.changeId++;
        if (this.changes)
          this.changes.remove(item, index);
      } else if (item instanceof Cache && style2 instanceof Cache) {
        const prevChangeId = item.changeId;
        item.unmerge(style2);
        if (item.changeId !== prevChangeId) {
          this.sheet.splice(index, 1, item.getStyles());
          this.changeId++;
          if (this.changes)
            this.changes.change(item, index, index);
        }
      }
    }
  }
  values() {
    return this._keys.map((key2) => this._children[key2]);
  }
  merge(cache) {
    for (const item of cache.values())
      this.add(item);
    return this;
  }
  unmerge(cache) {
    for (const item of cache.values())
      this.remove(item);
    return this;
  }
  clone() {
    return new Cache().merge(this);
  }
};
var Selector = class {
  constructor(selector, id) {
    this.selector = selector;
    this.id = id;
  }
  getStyles() {
    return this.selector;
  }
  clone() {
    return this;
  }
};
var Style = class extends Cache {
  constructor(style2, id) {
    super();
    this.style = style2;
    this.id = id;
  }
  getStyles() {
    return `${this.sheet.join(",")}{${this.style}}`;
  }
  clone() {
    return new Style(this.style, this.id).merge(this);
  }
};
var Rule = class extends Cache {
  constructor(rule, style2, id) {
    super();
    this.rule = rule;
    this.style = style2;
    this.id = id;
  }
  getStyles() {
    return `${this.rule}{${this.style}${join(this.sheet)}}`;
  }
  clone() {
    return new Rule(this.rule, this.style, this.id).merge(this);
  }
};
function key(id, styles) {
  if (!styles.$displayName)
    return id;
  return `${styles.$displayName}_${id}`;
}
var FreeStyle = class extends Cache {
  constructor(id, changes) {
    super(changes);
    this.id = id;
  }
  registerStyle(css) {
    const ruleList = [];
    const styleList = [];
    const pid = stylize(ruleList, styleList, "", css, ".&");
    const id = `f${stringHash(pid)}`;
    const name = key(id, css);
    compose(this, ruleList, styleList, id, false ? name : escape(name));
    return name;
  }
  registerKeyframes(keyframes2) {
    return this.registerHashRule("@keyframes", keyframes2);
  }
  registerHashRule(prefix, styles) {
    return this.registerStyle({
      $global: true,
      $displayName: styles.$displayName,
      [`${prefix} &`]: styles
    });
  }
  registerRule(rule, styles) {
    return this.registerStyle({ $global: true, [rule]: styles });
  }
  registerCss(styles) {
    return this.registerRule("", styles);
  }
  getStyles() {
    return join(this.sheet);
  }
  clone() {
    return new FreeStyle(this.id, this.changes).merge(this);
  }
};
function create(changes) {
  return new FreeStyle(`f${(++uniqueId).toString(36)}`, changes);
}

// packages/style/src/formatting.ts
function convertToStyles(object) {
  const styles = {};
  for (const key2 in object) {
    const val = object[key2];
    if (key2 === "$nest") {
      const nested = val;
      for (let selector in nested) {
        const subproperties = nested[selector];
        styles[selector] = convertToStyles(subproperties);
      }
    } else if (key2 === "$debugName") {
      styles.$displayName = val;
    } else {
      styles[key2] = val;
    }
  }
  return styles;
}
function convertToKeyframes(frames) {
  const result = {};
  for (const offset in frames) {
    if (offset !== "$debugName") {
      result[offset] = frames[offset];
    }
  }
  if (frames.$debugName) {
    result.$displayName = frames.$debugName;
  }
  return result;
}

// packages/style/src/utilities.ts
var raf = typeof requestAnimationFrame === "undefined" ? (cb) => setTimeout(cb) : typeof window === "undefined" ? requestAnimationFrame : requestAnimationFrame.bind(window);
function extend(...objects) {
  const result = {};
  for (const object of objects) {
    if (object == null || object === false) {
      continue;
    }
    for (const key2 in object) {
      const val = object[key2];
      if (!val && val !== 0) {
        continue;
      }
      if (key2 === "$nest" && val) {
        result[key2] = result["$nest"] ? extend(result["$nest"], val) : val;
      } else if (key2.indexOf("&") !== -1 || key2.indexOf("@media") === 0) {
        result[key2] = result[key2] ? extend(result[key2], val) : val;
      } else {
        result[key2] = val;
      }
    }
  }
  return result;
}

// packages/style/src/typestyle.ts
var createFreeStyle = () => create();
var TypeStyle = class {
  constructor({ autoGenerateTag }) {
    this.cssRaw = (mustBeValidCSS) => {
      if (!mustBeValidCSS) {
        return;
      }
      this._raw += mustBeValidCSS || "";
      this._pendingRawChange = true;
      this._styleUpdated();
    };
    this.cssRule = (selector, ...objects) => {
      const styles = convertToStyles(extend(...objects));
      this._freeStyle.registerRule(selector, styles);
      this._styleUpdated();
      return;
    };
    this.forceRenderStyles = () => {
      const target = this._getTag();
      if (!target) {
        return;
      }
      target.textContent = this.getStyles();
    };
    this.fontFace = (...fontFace2) => {
      const freeStyle = this._freeStyle;
      for (const face of fontFace2) {
        freeStyle.registerRule("@font-face", face);
      }
      this._styleUpdated();
      return;
    };
    this.getStyles = () => {
      return (this._raw || "") + this._freeStyle.getStyles();
    };
    this.keyframes = (frames) => {
      const keyframes2 = convertToKeyframes(frames);
      const animationName = this._freeStyle.registerKeyframes(keyframes2);
      this._styleUpdated();
      return animationName;
    };
    this.reinit = () => {
      const freeStyle = createFreeStyle();
      this._freeStyle = freeStyle;
      this._lastFreeStyleChangeId = freeStyle.changeId;
      this._raw = "";
      this._pendingRawChange = false;
      const target = this._getTag();
      if (target) {
        target.textContent = "";
      }
    };
    this.setStylesTarget = (tag) => {
      if (this._tag) {
        this._tag.textContent = "";
      }
      this._tag = tag;
      this.forceRenderStyles();
    };
    this.stylesheet = (classes) => {
      const classNames = Object.getOwnPropertyNames(classes);
      const result = {};
      for (let className of classNames) {
        const classDef = classes[className];
        if (classDef) {
          classDef.$debugName = className;
          result[className] = this.style(classDef);
        }
      }
      return result;
    };
    const freeStyle = createFreeStyle();
    this._autoGenerateTag = autoGenerateTag;
    this._freeStyle = freeStyle;
    this._lastFreeStyleChangeId = freeStyle.changeId;
    this._pending = 0;
    this._pendingRawChange = false;
    this._raw = "";
    this._tag = void 0;
    this.style = this.style.bind(this);
  }
  _afterAllSync(cb) {
    this._pending++;
    const pending = this._pending;
    raf(() => {
      if (pending !== this._pending) {
        return;
      }
      cb();
    });
  }
  _getTag() {
    if (this._tag) {
      return this._tag;
    }
    if (this._autoGenerateTag) {
      const tag = typeof window === "undefined" ? { textContent: "" } : document.createElement("style");
      if (typeof document !== "undefined") {
        document.head.appendChild(tag);
      }
      this._tag = tag;
      return tag;
    }
    return void 0;
  }
  _styleUpdated() {
    const changeId = this._freeStyle.changeId;
    const lastChangeId = this._lastFreeStyleChangeId;
    if (!this._pendingRawChange && changeId === lastChangeId) {
      return;
    }
    this._lastFreeStyleChangeId = changeId;
    this._pendingRawChange = false;
    this._afterAllSync(() => this.forceRenderStyles());
  }
  style(...args) {
    const className = this._freeStyle.registerStyle(convertToStyles(extend.apply(void 0, args)));
    this._styleUpdated();
    return className;
  }
};
var typeStyle = new TypeStyle({ autoGenerateTag: true });

// packages/style/src/snippets.ts
function rotate(degree) {
  if (degree !== 0 && !degree)
    return "";
  let value = `rotate(${degree}deg)`;
  return style({
    transform: value
  });
}

// packages/style/src/index.ts
var cssRaw = typeStyle.cssRaw;
var cssRule = typeStyle.cssRule;
var fontFace = typeStyle.fontFace;
var keyframes = typeStyle.keyframes;
var style = typeStyle.style;

// packages/base/src/observable.ts
var INSERT = "insert";
var UPDATE = "update";
var DELETE = "delete";
var REVERSE = "reverse";
var SHUFFLE = "shuffle";
var oMetaKey = Symbol.for("object-observer-meta-key-0");
var validObservableOptionKeys = { async: 1 };
var processObserveOptions = (options) => {
  if (!options || typeof options !== "object") {
    return null;
  }
  const result = {};
  const invalidOptions = [];
  for (const [optName, optVal] of Object.entries(options)) {
    if (optName === "path") {
      if (typeof optVal !== "string" || optVal === "") {
        throw new Error('"path" option, if/when provided, MUST be a non-empty string');
      }
      result[optName] = optVal;
    } else if (optName === "pathsOf") {
      if (options.path) {
        throw new Error('"pathsOf" option MAY NOT be specified together with "path" option');
      }
      if (typeof optVal !== "string") {
        throw new Error('"pathsOf" option, if/when provided, MUST be a string (MAY be empty)');
      }
      result[optName] = options.pathsOf.split(".").filter(Boolean);
    } else if (optName === "pathsFrom") {
      if (options.path || options.pathsOf) {
        throw new Error('"pathsFrom" option MAY NOT be specified together with "path"/"pathsOf" option/s');
      }
      if (typeof optVal !== "string" || optVal === "") {
        throw new Error('"pathsFrom" option, if/when provided, MUST be a non-empty string');
      }
      result[optName] = optVal;
    } else {
      invalidOptions.push(optName);
    }
  }
  if (invalidOptions.length) {
    throw new Error(`'${invalidOptions.join(", ")}' is/are not a valid observer option/s`);
  }
  return result;
};
var observe = function observe2(observer, options) {
  if (typeof observer !== "function") {
    throw new Error(`observer MUST be a function, got '${observer}'`);
  }
  const observers = this[oMetaKey].observers;
  if (!observers.some((o) => o[0] === observer)) {
    observers.push([observer, processObserveOptions(options)]);
  } else {
    console.warn("observer may be bound to an observable only once; will NOT rebind");
  }
};
var unobserve = function unobserve2() {
  const observers = this[oMetaKey].observers;
  let ol = observers.length;
  if (ol) {
    let al = arguments.length;
    if (al) {
      while (al--) {
        let i = ol;
        while (i--) {
          if (observers[i][0] === arguments[al]) {
            observers.splice(i, 1);
            ol--;
          }
        }
      }
    } else {
      observers.splice(0);
    }
  }
};
var clearObservers = function unobserve3() {
  this[oMetaKey].observers = [];
};
var propertiesBluePrint = { __observe: { value: observe }, __unobserve: { value: unobserve }, __clearObservers: { value: clearObservers } };
var prepareObject = (source, oMeta) => {
  const target = Object.defineProperties({}, propertiesBluePrint);
  target[oMetaKey] = oMeta;
  for (const key2 in source) {
    target[key2] = getObservedOf(source[key2], key2, oMeta);
  }
  return target;
};
var prepareArray = (source, oMeta) => {
  let l = source.length;
  const target = Object.defineProperties(new Array(l), propertiesBluePrint);
  target[oMetaKey] = oMeta;
  for (let i = 0; i < l; i++) {
    target[i] = getObservedOf(source[i], i, oMeta);
  }
  return target;
};
var prepareTypedArray = (source, oMeta) => {
  Object.defineProperties(source, propertiesBluePrint);
  source[oMetaKey] = oMeta;
  return source;
};
var filterChanges = (options, changes) => {
  if (!options) {
    return changes;
  }
  let result = changes;
  if (options.path) {
    const oPath = options.path;
    result = changes.filter((change) => change.path.join(".") === oPath);
  } else if (options.pathsOf) {
    const oPathsOf = options.pathsOf;
    const oPathsOfStr = oPathsOf.join(".");
    result = changes.filter((change) => (change.path.length === oPathsOf.length + 1 || change.path.length === oPathsOf.length && (change.type === REVERSE || change.type === SHUFFLE)) && change.path.join(".").startsWith(oPathsOfStr));
  } else if (options.pathsFrom) {
    const oPathsFrom = options.pathsFrom;
    result = changes.filter((change) => change.path.join(".").startsWith(oPathsFrom));
  }
  return result;
};
var callObserverSafe = (listener, changes) => {
  try {
    listener(changes);
  } catch (e) {
    console.error(`failed to notify listener ${listener} with ${changes}`, e);
  }
};
var callObserversFromMT = function callObserversFromMT2() {
  const batches = this.batches;
  this.batches = null;
  for (const [listener, changes] of batches) {
    callObserverSafe(listener, changes);
  }
};
var callObservers = (oMeta, changes) => {
  let currentObservable = oMeta;
  let observers, target, options, relevantChanges, i;
  const l = changes.length;
  do {
    observers = currentObservable.observers;
    i = observers.length;
    while (i--) {
      [target, options] = observers[i];
      relevantChanges = filterChanges(options, changes);
      if (relevantChanges.length) {
        if (currentObservable.options.async) {
          if (!currentObservable.batches) {
            currentObservable.batches = [];
            queueMicrotask(callObserversFromMT.bind(currentObservable));
          }
          let rb;
          for (const b of currentObservable.batches) {
            if (b[0] === target) {
              rb = b;
              break;
            }
          }
          if (!rb) {
            rb = [target, []];
            currentObservable.batches.push(rb);
          }
          Array.prototype.push.apply(rb[1], relevantChanges);
        } else {
          callObserverSafe(target, relevantChanges);
        }
      }
    }
    if (currentObservable.parent) {
      const clonedChanges = new Array(l);
      for (let j = 0; j < l; j++) {
        clonedChanges[j] = __spreadValues({}, changes[j]);
        clonedChanges[j].path = [currentObservable.ownKey, ...clonedChanges[j].path];
      }
      changes = clonedChanges;
      currentObservable = currentObservable.parent;
    } else {
      currentObservable = null;
    }
  } while (currentObservable);
};
var getObservedOf = (item, key2, parent) => {
  if (!item || typeof item !== "object") {
    return item;
  } else if (Array.isArray(item)) {
    return new ArrayOMeta({ target: item, ownKey: key2, parent }).proxy;
  } else if (ArrayBuffer.isView(item)) {
    return new TypedArrayOMeta({ target: item, ownKey: key2, parent }).proxy;
  } else if (item instanceof Date) {
    return item;
  } else {
    return new ObjectOMeta({ target: item, ownKey: key2, parent }).proxy;
  }
};
var proxiedPop = function proxiedPop2() {
  const oMeta = this[oMetaKey], target = oMeta.target, poppedIndex = target.length - 1;
  let popResult = target.pop();
  if (popResult && typeof popResult === "object") {
    const tmpObserved = popResult[oMetaKey];
    if (tmpObserved) {
      popResult = tmpObserved.detach();
    }
  }
  const changes = [new Change(DELETE, [poppedIndex], void 0, popResult, this)];
  callObservers(oMeta, changes);
  return popResult;
};
var proxiedPush = function proxiedPush2() {
  const oMeta = this[oMetaKey], target = oMeta.target, l = arguments.length, pushContent = new Array(l), initialLength = target.length;
  for (let i = 0; i < l; i++) {
    pushContent[i] = getObservedOf(arguments[i], initialLength + i, oMeta);
  }
  const pushResult = Reflect.apply(target.push, target, pushContent);
  const changes = [];
  for (let i = initialLength, j = target.length; i < j; i++) {
    changes[i - initialLength] = new Change(INSERT, [i], target[i], void 0, this);
  }
  callObservers(oMeta, changes);
  return pushResult;
};
var proxiedShift = function proxiedShift2() {
  const oMeta = this[oMetaKey], target = oMeta.target;
  let shiftResult, i, l, item, tmpObserved;
  shiftResult = target.shift();
  if (shiftResult && typeof shiftResult === "object") {
    tmpObserved = shiftResult[oMetaKey];
    if (tmpObserved) {
      shiftResult = tmpObserved.detach();
    }
  }
  for (i = 0, l = target.length; i < l; i++) {
    item = target[i];
    if (item && typeof item === "object") {
      tmpObserved = item[oMetaKey];
      if (tmpObserved) {
        tmpObserved.ownKey = i;
      }
    }
  }
  const changes = [new Change(DELETE, [0], void 0, shiftResult, this)];
  callObservers(oMeta, changes);
  return shiftResult;
};
var proxiedUnshift = function proxiedUnshift2() {
  const oMeta = this[oMetaKey], target = oMeta.target, al = arguments.length, unshiftContent = new Array(al);
  for (let i = 0; i < al; i++) {
    unshiftContent[i] = getObservedOf(arguments[i], i, oMeta);
  }
  const unshiftResult = Reflect.apply(target.unshift, target, unshiftContent);
  for (let i = 0, l2 = target.length, item; i < l2; i++) {
    item = target[i];
    if (item && typeof item === "object") {
      const tmpObserved = item[oMetaKey];
      if (tmpObserved) {
        tmpObserved.ownKey = i;
      }
    }
  }
  const l = unshiftContent.length;
  const changes = new Array(l);
  for (let i = 0; i < l; i++) {
    changes[i] = new Change(INSERT, [i], target[i], void 0, this);
  }
  callObservers(oMeta, changes);
  return unshiftResult;
};
var proxiedReverse = function proxiedReverse2() {
  const oMeta = this[oMetaKey], target = oMeta.target;
  let i, l, item;
  target.reverse();
  for (i = 0, l = target.length; i < l; i++) {
    item = target[i];
    if (item && typeof item === "object") {
      const tmpObserved = item[oMetaKey];
      if (tmpObserved) {
        tmpObserved.ownKey = i;
      }
    }
  }
  const changes = [new Change(REVERSE, [], void 0, void 0, this)];
  callObservers(oMeta, changes);
  return this;
};
var proxiedSort = function proxiedSort2(comparator) {
  const oMeta = this[oMetaKey], target = oMeta.target;
  let i, l, item;
  target.sort(comparator);
  for (i = 0, l = target.length; i < l; i++) {
    item = target[i];
    if (item && typeof item === "object") {
      const tmpObserved = item[oMetaKey];
      if (tmpObserved) {
        tmpObserved.ownKey = i;
      }
    }
  }
  const changes = [new Change(SHUFFLE, [], void 0, void 0, this)];
  callObservers(oMeta, changes);
  return this;
};
var proxiedFill = function proxiedFill2(filVal, start, end) {
  const oMeta = this[oMetaKey], target = oMeta.target, changes = [], tarLen = target.length, prev = target.slice(0);
  start = start === void 0 ? 0 : start < 0 ? Math.max(tarLen + start, 0) : Math.min(start, tarLen);
  end = end === void 0 ? tarLen : end < 0 ? Math.max(tarLen + end, 0) : Math.min(end, tarLen);
  if (start < tarLen && end > start) {
    target.fill(filVal, start, end);
    let tmpObserved;
    for (let i = start, item, tmpTarget; i < end; i++) {
      item = target[i];
      target[i] = getObservedOf(item, i, oMeta);
      if (i in prev) {
        tmpTarget = prev[i];
        if (tmpTarget && typeof tmpTarget === "object") {
          tmpObserved = tmpTarget[oMetaKey];
          if (tmpObserved) {
            tmpTarget = tmpObserved.detach();
          }
        }
        changes.push(new Change(UPDATE, [i], target[i], tmpTarget, this));
      } else {
        changes.push(new Change(INSERT, [i], target[i], void 0, this));
      }
    }
    callObservers(oMeta, changes);
  }
  return this;
};
var proxiedCopyWithin = function proxiedCopyWithin2(dest, start, end) {
  const oMeta = this[oMetaKey], target = oMeta.target, tarLen = target.length;
  dest = dest < 0 ? Math.max(tarLen + dest, 0) : dest;
  start = start === void 0 ? 0 : start < 0 ? Math.max(tarLen + start, 0) : Math.min(start, tarLen);
  end = end === void 0 ? tarLen : end < 0 ? Math.max(tarLen + end, 0) : Math.min(end, tarLen);
  const len = Math.min(end - start, tarLen - dest);
  if (dest < tarLen && dest !== start && len > 0) {
    const prev = target.slice(0), changes = [];
    target.copyWithin(dest, start, end);
    for (let i = dest, nItem, oItem, tmpObserved; i < dest + len; i++) {
      nItem = target[i];
      if (nItem && typeof nItem === "object") {
        nItem = getObservedOf(nItem, i, oMeta);
        target[i] = nItem;
      }
      oItem = prev[i];
      if (oItem && typeof oItem === "object") {
        tmpObserved = oItem[oMetaKey];
        if (tmpObserved) {
          oItem = tmpObserved.detach();
        }
      }
      if (typeof nItem !== "object" && nItem === oItem) {
        continue;
      }
      changes.push(new Change(UPDATE, [i], nItem, oItem, this));
    }
    callObservers(oMeta, changes);
  }
  return this;
};
var proxiedSplice = function proxiedSplice2() {
  const oMeta = this[oMetaKey], target = oMeta.target, splLen = arguments.length, spliceContent = new Array(splLen), tarLen = target.length;
  for (let i2 = 0; i2 < splLen; i2++) {
    spliceContent[i2] = getObservedOf(arguments[i2], i2, oMeta);
  }
  const startIndex = splLen === 0 ? 0 : spliceContent[0] < 0 ? tarLen + spliceContent[0] : spliceContent[0], removed = splLen < 2 ? tarLen - startIndex : spliceContent[1], inserted = Math.max(splLen - 2, 0), spliceResult = Reflect.apply(target.splice, target, spliceContent), newTarLen = target.length;
  let tmpObserved;
  for (let i2 = 0, item2; i2 < newTarLen; i2++) {
    item2 = target[i2];
    if (item2 && typeof item2 === "object") {
      tmpObserved = item2[oMetaKey];
      if (tmpObserved) {
        tmpObserved.ownKey = i2;
      }
    }
  }
  let i, l, item;
  for (i = 0, l = spliceResult.length; i < l; i++) {
    item = spliceResult[i];
    if (item && typeof item === "object") {
      tmpObserved = item[oMetaKey];
      if (tmpObserved) {
        spliceResult[i] = tmpObserved.detach();
      }
    }
  }
  const changes = [];
  let index;
  for (index = 0; index < removed; index++) {
    if (index < inserted) {
      changes.push(new Change(UPDATE, [startIndex + index], target[startIndex + index], spliceResult[index], this));
    } else {
      changes.push(new Change(DELETE, [startIndex + index], void 0, spliceResult[index], this));
    }
  }
  for (; index < inserted; index++) {
    changes.push(new Change(INSERT, [startIndex + index], target[startIndex + index], void 0, this));
  }
  callObservers(oMeta, changes);
  return spliceResult;
};
var proxiedTypedArraySet = function proxiedTypedArraySet2(source, offset) {
  const oMeta = this[oMetaKey], target = oMeta.target, souLen = source.length, prev = target.slice(0);
  offset = offset || 0;
  target.set(source, offset);
  const changes = new Array(souLen);
  for (let i = offset; i < souLen + offset; i++) {
    changes[i - offset] = new Change(UPDATE, [i], target[i], prev[i], this);
  }
  callObservers(oMeta, changes);
};
var proxiedArrayMethods = {
  pop: proxiedPop,
  push: proxiedPush,
  shift: proxiedShift,
  unshift: proxiedUnshift,
  reverse: proxiedReverse,
  sort: proxiedSort,
  fill: proxiedFill,
  copyWithin: proxiedCopyWithin,
  splice: proxiedSplice
};
var proxiedTypedArrayMethods = {
  reverse: proxiedReverse,
  sort: proxiedSort,
  fill: proxiedFill,
  copyWithin: proxiedCopyWithin,
  set: proxiedTypedArraySet
};
var Change = class {
  constructor(type, path, value, oldValue, object) {
    this.type = type;
    this.path = path;
    this.value = value;
    this.oldValue = oldValue;
    this.object = object;
  }
};
var OMetaBase = class {
  constructor(properties, cloningFunction) {
    const { target, parent, ownKey } = properties;
    if (parent && ownKey !== void 0) {
      this.parent = parent;
      this.ownKey = ownKey;
    } else {
      this.parent = null;
      this.ownKey = null;
    }
    const targetClone = cloningFunction(target, this);
    this.observers = [];
    this.revocable = Proxy.revocable(targetClone, this);
    this.proxy = this.revocable.proxy;
    this.target = targetClone;
    this.options = this.processOptions(properties.options);
  }
  processOptions(options) {
    if (options) {
      if (typeof options !== "object") {
        throw new Error(`Observable options if/when provided, MAY only be an object, got '${options}'`);
      }
      const invalidOptions = Object.keys(options).filter((option) => !(option in validObservableOptionKeys));
      if (invalidOptions.length) {
        throw new Error(`'${invalidOptions.join(", ")}' is/are not a valid Observable option/s`);
      }
      return Object.assign({}, options);
    } else {
      return {};
    }
  }
  detach() {
    this.parent = null;
    return this.target;
  }
  set(target, key2, value) {
    let oldValue = target[key2];
    if (value !== oldValue) {
      const newValue = getObservedOf(value, key2, this);
      target[key2] = newValue;
      if (oldValue && typeof oldValue === "object") {
        const tmpObserved = oldValue[oMetaKey];
        if (tmpObserved) {
          oldValue = tmpObserved.detach();
        }
      }
      const changes = oldValue === void 0 ? [new Change(INSERT, [key2], newValue, void 0, this.proxy)] : [new Change(UPDATE, [key2], newValue, oldValue, this.proxy)];
      callObservers(this, changes);
    }
    return true;
  }
  deleteProperty(target, key2) {
    let oldValue = target[key2];
    delete target[key2];
    if (oldValue && typeof oldValue === "object") {
      const tmpObserved = oldValue[oMetaKey];
      if (tmpObserved) {
        oldValue = tmpObserved.detach();
      }
    }
    const changes = [new Change(DELETE, [key2], void 0, oldValue, this.proxy)];
    callObservers(this, changes);
    return true;
  }
};
var ObjectOMeta = class extends OMetaBase {
  constructor(properties) {
    super(properties, prepareObject);
  }
};
var ArrayOMeta = class extends OMetaBase {
  constructor(properties) {
    super(properties, prepareArray);
  }
  get(target, key2) {
    return proxiedArrayMethods[key2] || target[key2];
  }
};
var TypedArrayOMeta = class extends OMetaBase {
  constructor(properties) {
    super(properties, prepareTypedArray);
  }
  get(target, key2) {
    return proxiedTypedArrayMethods[key2] || target[key2];
  }
};
var Observable = Object.freeze({
  from: (target, options) => {
    if (!target || typeof target !== "object") {
      throw new Error("observable MAY ONLY be created from a non-null object");
    } else if (target[oMetaKey]) {
      return target;
    } else if (Array.isArray(target)) {
      return new ArrayOMeta({ target, ownKey: null, parent: null, options }).proxy;
    } else if (ArrayBuffer.isView(target)) {
      return new TypedArrayOMeta({ target, ownKey: null, parent: null, options }).proxy;
    } else if (target instanceof Date) {
      throw new Error(`${target} found to be one of a non-observable types`);
    } else {
      return new ObjectOMeta({ target, ownKey: null, parent: null, options }).proxy;
    }
  },
  isObservable: (input) => {
    return !!(input && input[oMetaKey]);
  }
});
function isObservable(input) {
  return !!(input && input[oMetaKey]);
}
function Observe(target, callback, options) {
  if (!target)
    return;
  if (!!(target && target[oMetaKey])) {
    if (callback)
      target.__observe(callback, options);
    return target;
  }
  ;
  let result;
  if (!target || typeof target !== "object") {
    throw new Error("observable MAY ONLY be created from a non-null object");
  } else if (target[oMetaKey]) {
    result = target;
  } else if (Array.isArray(target)) {
    result = new ArrayOMeta({ target, ownKey: null, parent: null }).proxy;
  } else if (ArrayBuffer.isView(target)) {
    result = new TypedArrayOMeta({ target, ownKey: null, parent: null }).proxy;
  } else if (target instanceof Date) {
    throw new Error(`${target} found to be one of a non-observable types`);
  } else {
    result = new ObjectOMeta({ target, ownKey: null, parent: null }).proxy;
  }
  if (callback)
    result.__observe(callback, options);
  return result;
}
function Unobserve(target, observer) {
  if (!target)
    return;
  if (!!(target && target[oMetaKey])) {
    target.__unobserve(observer);
  }
}
function ClearObservers(target) {
  if (!target)
    return;
  if (!!(target && target[oMetaKey])) {
    target.__clearObservers();
  }
}
function observable(propName) {
  return function(target, propertyName) {
    target["$observableProps"] = target["$observableProps"] || {};
    target["$observableProps"][propName || propertyName] = propertyName;
  };
}
function initObservables(target) {
  let observables = target["$observableProps"];
  target["$observables"] = target["$observables"] || {};
  for (let propName in observables) {
    let propertyName = observables[propName];
    let val = Observe({});
    let isObject = false;
    target["$observables"][propName] = val;
    const getter = function() {
      if (isObject)
        return val;
      else {
        return val.value;
      }
    };
    const setter = function(newVal) {
      if (typeof newVal == "object") {
        isObject = true;
        Object.assign(val, newVal);
      } else {
        isObject = false;
        val.value = newVal;
      }
    };
    Object.defineProperty(target, propertyName, {
      get: getter,
      set: setter
    });
  }
}

// packages/base/src/component.ts
var Component = class extends HTMLElement {
  constructor(parent, options, defaults) {
    super();
    this.attrs = {};
    this.options = options || {};
    this.defaults = defaults || {};
    initObservables(this);
  }
  connectedCallback() {
    if (this.connected)
      return;
    this.connected = true;
    if (!this.initialized)
      this.init();
  }
  disconnectCallback() {
    this.connected = false;
  }
  createElement(tagName, parentElm) {
    let result = document.createElement(tagName);
    if (parentElm)
      parentElm.appendChild(result);
    return result;
  }
  getValue(target, paths, idx) {
    idx = idx || 0;
    let path = paths[idx];
    let value = target[path];
    idx++;
    if (paths.length > idx)
      try {
        return this.getValue(value, paths, idx);
      } catch (error) {
        return value;
      }
    else
      return value;
  }
  getAttribute(name, removeAfter, defaultValue) {
    if (this.options[name] != null)
      return this.options[name];
    else if (this.attrs[name] != null && this.attrs[name] != void 0) {
      if (removeAfter)
        this.removeAttribute(name);
      if (this.attrs[name].__target)
        return this.getValue(this.attrs[name].__target, this.attrs[name].__path);
      else
        return this.attrs[name];
    } else {
      let value = super.getAttribute(name);
      if (value && value.__target)
        return;
      else if (value != null) {
        if (value == "false" || value == "true")
          value = JSON.parse(value);
        this.options[name] = value;
        if (removeAfter)
          this.removeAttribute(name);
        return value;
      } else if (this.defaults[name] != null)
        return this.defaults[name];
    }
    ;
    return defaultValue;
  }
  getPositionAttribute(name, removeAfter, defaultValue) {
    let result = parseFloat(this.getAttribute(name, removeAfter, defaultValue));
    if (removeAfter && result)
      this.style[name] = result + "px";
    return result;
  }
  getStyleAttribute(name, removeAfter, defaultValue) {
    let result = this.getAttribute(name, removeAfter, defaultValue);
    if (removeAfter && result)
      this.style[name] = result;
    return result;
  }
  get id() {
    return this.getAttribute("id");
  }
  set id(value) {
    this.options.id = value;
    this.setAttribute("id", value);
  }
  async ready() {
    if (this._ready)
      return;
    return new Promise((resolve) => {
      if (this._ready)
        return resolve();
      this._readyCallback = resolve;
      this.init();
    });
  }
  init() {
    this.initialized = true;
    if (this._ready === void 0) {
      this._ready = true;
      if (this._readyCallback) {
        let callback = this._readyCallback;
        delete this._readyCallback;
        callback();
      }
    }
  }
};

// packages/base/src/style/base.css.ts
var spinnerAnim = keyframes({
  "0%": {
    transform: "rotate(0deg)"
  },
  "100%": {
    transform: "rotate(360deg)"
  }
});
cssRule("body", {
  background: theme_exports.ThemeVars.background.default,
  backgroundAttachment: "fixed !important",
  margin: 0,
  padding: 0,
  overflowX: "hidden",
  overflowY: "auto",
  $nest: {
    "*, *:before, *:after": {
      boxSizing: "border-box"
    },
    ".text-left": {
      textAlign: "left"
    },
    ".text-right": {
      textAlign: "right"
    },
    ".text-center": {
      textAlign: "center"
    },
    ".bold": {
      fontWeight: "bold"
    },
    ".inline-flex": {
      display: "inline-flex"
    },
    ".flex": {
      display: "flex"
    },
    ".inline-block": {
      display: "inline-block"
    },
    ".mr-1": {
      marginRight: "1rem !important"
    },
    ".ml-1": {
      marginLeft: "1rem !important"
    },
    ".mb-1": {
      marginBottom: "1rem !important"
    },
    ".mt-1": {
      marginTop: "1rem !important"
    },
    ".mb-2": {
      marginBottom: "2rem"
    },
    ".pointer": {
      cursor: "pointer"
    },
    ".text-underline": {
      textDecoration: "underline"
    },
    ".text-none i-link > a": {
      textDecoration: "none"
    },
    "@media only screen and (max-width: 767px)": {
      $nest: {
        "i-hstack": {
          flexWrap: "wrap"
        }
      }
    },
    ".i-loading-overlay": {
      position: "absolute",
      zIndex: 2e3,
      margin: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      transition: "opacity .3s",
      background: theme_exports.ThemeVars.background.default,
      $nest: {
        "&:after": {
          content: '""',
          position: "absolute",
          opacity: ".5",
          width: "100%",
          height: "100%"
        },
        ".i-loading-spinner_text": {
          fontSize: "1rem",
          color: theme_exports.ThemeVars.text.primary,
          fontFamily: theme_exports.ThemeVars.typography.fontFamily,
          marginTop: ".5rem"
        },
        ".i-loading-spinner_icon": {
          display: "block",
          animation: `${spinnerAnim} 2s linear infinite`,
          $nest: {
            "i-image": {
              display: "block",
              maxHeight: "100%",
              maxWidth: "100%"
            }
          }
        },
        ".i-loading-spinner": {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
          padding: "1rem"
        }
      }
    }
  }
});
var disabledStyle = style({
  opacity: 0.4,
  cursor: "default"
});
var containerStyle = style({
  $nest: {
    "span.resizer": {
      zIndex: 999
    },
    "span.resizer:hover": {
      backgroundColor: theme_exports.ThemeVars.colors.info.main,
      transitionDelay: "0.5s"
    },
    "span.resizer.highlight": {
      backgroundColor: theme_exports.ThemeVars.colors.info.main
    },
    "span.e-resize": {
      position: "absolute",
      right: "0px",
      height: "100%",
      width: "4px",
      cursor: "e-resize"
    },
    "span.n-resize": {
      position: "absolute",
      top: "0px",
      height: "4px",
      width: "100%",
      cursor: "n-resize"
    },
    "span.s-resize": {
      position: "absolute",
      bottom: "0px",
      height: "4px",
      width: "100%",
      cursor: "s-resize"
    },
    "span.w-resize": {
      position: "absolute",
      left: "0px",
      height: "100%",
      width: "4px",
      cursor: "w-resize"
    },
    "span.resizing": {
      userSelect: "none",
      pointerEvents: "none"
    }
  }
});
var getBorderSideStyleClass = (side, value) => {
  let styleObj = {};
  if (value.width) {
    let borderWidthProp = `border-${side}-width`;
    styleObj[borderWidthProp] = typeof value.width == "number" ? value.width + "px" : value.width;
  }
  if (value.style) {
    let borderStyleProp = `border-${side}-style`;
    styleObj[borderStyleProp] = value.style;
  }
  if (value.color) {
    let borderColorProp = `border-${side}-color`;
    styleObj[borderColorProp] = value.color;
  }
  return style(styleObj);
};
var getBorderStyleClass = (value) => {
  let styleObj = {};
  if (value.width) {
    styleObj["borderWidth"] = typeof value.width == "number" ? value.width + "px" : value.width;
  }
  if (value.style) {
    styleObj["borderStyle"] = value.style;
  }
  if (value.color) {
    styleObj["borderColor"] = value.color;
  }
  if (value.radius) {
    styleObj["borderRadius"] = typeof value.radius == "number" ? value.radius + "px" : value.radius;
  }
  return style(styleObj);
};

// packages/tooltip/src/style/tooltip.css.ts
var Theme = theme_exports.ThemeVars;
var arrowBackgroundColor = "var(--tooltips-arrow-background, rgba(97, 97, 97, 0.92))";
cssRule("body", {
  $nest: {
    ".ii-tooltip": {
      position: "absolute",
      display: "inline-block",
      fontFamily: Theme.typography.fontFamily,
      backgroundColor: "rgba(97, 97, 97, 0.92)",
      borderRadius: "4px",
      color: "rgb(255, 255, 255)",
      padding: "4px 8px",
      fontSize: "0.6875rem",
      maxWidth: "300px",
      overflowWrap: "break-word",
      fontWeight: 500,
      zIndex: 10
    },
    ".ii-tooltip-top::after": {
      content: "''",
      position: "absolute",
      top: "100%",
      left: "50%",
      marginLeft: "-5px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `${arrowBackgroundColor} transparent transparent transparent`
    },
    ".ii-tooltip-topLeft::after": {
      content: "''",
      position: "absolute",
      top: "100%",
      left: "0%",
      marginLeft: "12px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `${arrowBackgroundColor} transparent transparent transparent`
    },
    ".ii-tooltip-topRight::after": {
      content: "''",
      position: "absolute",
      top: "100%",
      right: "0%",
      marginRight: "12px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `${arrowBackgroundColor} transparent transparent transparent`
    },
    ".ii-tooltip-left::after": {
      content: "''",
      position: "absolute",
      top: "50%",
      left: "100%",
      marginTop: "-5px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `transparent transparent transparent ${arrowBackgroundColor}`
    },
    ".ii-tooltip-leftTop::after": {
      content: "''",
      position: "absolute",
      top: "0%",
      left: "100%",
      marginTop: "5px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `transparent transparent transparent ${arrowBackgroundColor}`
    },
    ".ii-tooltip-leftBottom::after": {
      content: "''",
      position: "absolute",
      bottom: "0%",
      left: "100%",
      marginBottom: "5px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `transparent transparent transparent ${arrowBackgroundColor}`
    },
    ".ii-tooltip-right::after": {
      content: "''",
      position: "absolute",
      top: "50%",
      right: "100%",
      marginTop: "-5px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `transparent ${arrowBackgroundColor} transparent transparent`
    },
    ".ii-tooltip-rightTop::after": {
      content: "''",
      position: "absolute",
      top: "0%",
      right: "100%",
      marginTop: "5px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `transparent ${arrowBackgroundColor} transparent transparent`
    },
    ".ii-tooltip-rightBottom::after": {
      content: "''",
      position: "absolute",
      bottom: "0%",
      right: "100%",
      marginBottom: "5px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `transparent ${arrowBackgroundColor} transparent transparent`
    },
    ".ii-tooltip-bottom::after": {
      content: "''",
      position: "absolute",
      bottom: "100%",
      left: "50%",
      marginLeft: "-5px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `transparent transparent ${arrowBackgroundColor} transparent`
    },
    ".ii-tooltip-bottomLeft::after": {
      content: "''",
      position: "absolute",
      bottom: "100%",
      left: "0%",
      marginLeft: "12px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `transparent transparent ${arrowBackgroundColor} transparent`
    },
    ".ii-tooltip-bottomRight::after": {
      content: "''",
      position: "absolute",
      bottom: "100%",
      right: "0%",
      marginRight: "12px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `transparent transparent ${arrowBackgroundColor} transparent`
    }
  }
});

// packages/tooltip/src/tooltip.ts
var Tooltip = class {
  constructor(source) {
    this.initData(source);
    this.initEvents(source);
  }
  initData(source) {
    const data = source.getAttribute("tooltip", true);
    let options = data;
    if (typeof data === "string") {
      try {
        options = JSON.parse(data);
      } catch (e) {
        options = null;
      }
    }
    this.content = (options == null ? void 0 : options.content) || "";
    this.popperClass = (options == null ? void 0 : options.popperClass) || "tooltip-content";
    this.placement = (options == null ? void 0 : options.placement) || "top";
    this.trigger = (options == null ? void 0 : options.trigger) || "hover";
    this.color = (options == null ? void 0 : options.color) || "rgba(0,0,0,.75)";
    if (options == null ? void 0 : options.maxWidth)
      this.maxWidth = options.maxWidth;
  }
  positionAt(parent, tooltip, placement) {
    const parentCoords = parent.getBoundingClientRect();
    let left = 0;
    let top = 0;
    const dist = 10;
    switch (placement) {
      case "top":
        top = parentCoords.top - tooltip.offsetHeight - dist;
        left = parentCoords.left + (parent.offsetWidth - tooltip.offsetWidth) / 2;
        break;
      case "topLeft":
        top = parentCoords.top - tooltip.offsetHeight - dist;
        left = parentCoords.left;
        break;
      case "topRight":
        top = parentCoords.top - tooltip.offsetHeight - dist;
        left = parentCoords.left + parent.offsetWidth - tooltip.offsetWidth;
        break;
      case "left":
        top = (parentCoords.top + parentCoords.bottom) / 2 - tooltip.offsetHeight / 2;
        left = parentCoords.left - dist - tooltip.offsetWidth;
        if (parentCoords.left - tooltip.offsetWidth < 0) {
          left = dist;
        }
        break;
      case "leftTop":
        top = parentCoords.top;
        left = parentCoords.left - dist - tooltip.offsetWidth;
        if (parentCoords.left - tooltip.offsetWidth < 0) {
          left = dist;
        }
        break;
      case "leftBottom":
        top = parentCoords.top + parent.offsetHeight - tooltip.offsetHeight;
        left = parentCoords.left - dist - tooltip.offsetWidth;
        if (parentCoords.left - tooltip.offsetWidth < 0) {
          left = dist;
        }
        break;
      case "right":
        top = (parentCoords.top + parentCoords.bottom) / 2 - tooltip.offsetHeight / 2;
        left = parentCoords.right + dist;
        if (parentCoords.right + tooltip.offsetWidth > document.documentElement.clientWidth) {
          left = document.documentElement.clientWidth - tooltip.offsetWidth - dist;
        }
        break;
      case "rightTop":
        top = parentCoords.top;
        left = parentCoords.right + dist;
        if (parentCoords.right + tooltip.offsetWidth > document.documentElement.clientWidth) {
          left = document.documentElement.clientWidth - tooltip.offsetWidth - dist;
        }
        break;
      case "rightBottom":
        top = parentCoords.top + parent.offsetHeight - tooltip.offsetHeight;
        left = parentCoords.right + dist;
        if (parentCoords.right + tooltip.offsetWidth > document.documentElement.clientWidth) {
          left = document.documentElement.clientWidth - tooltip.offsetWidth - dist;
        }
        break;
      case "bottom":
        top = parentCoords.bottom + dist;
        left = parentCoords.left + (parent.offsetWidth - tooltip.offsetWidth) / 2;
        break;
      case "bottomLeft":
        top = parentCoords.bottom + dist;
        left = parentCoords.left;
        break;
      case "bottomRight":
        top = parentCoords.bottom + dist;
        left = parentCoords.left + parent.offsetWidth - tooltip.offsetWidth;
        break;
    }
    left = left < 0 ? parentCoords.left : left;
    top = top < 0 ? parentCoords.bottom + dist : top;
    tooltip.style.left = left + "px";
    tooltip.style.top = top + pageYOffset + "px";
  }
  get trigger() {
    return this._trigger;
  }
  set trigger(value) {
    this._trigger = value;
  }
  get popperClass() {
    return this._popperClass;
  }
  set popperClass(value) {
    this._popperClass = value;
    if (this.tooltipElm && value)
      this.tooltipElm.classList.add(this.popperClass);
  }
  get color() {
    return this._color;
  }
  set color(value) {
    this._color = value;
    if (this.tooltipElm && value) {
      this.tooltipElm.style.backgroundColor = this.color;
      this.tooltipElm.style.setProperty("--tooltips-arrow-background", this.color);
    }
  }
  get content() {
    return this._content;
  }
  set content(value) {
    this._content = value;
    if (this.tooltipElm)
      this.tooltipElm.innerHTML = this.content;
  }
  get placement() {
    return this._placement;
  }
  set placement(value) {
    this._placement = value;
    if (this.tooltipElm)
      this.tooltipElm.classList.add(`ii-tooltip-${this.placement}`);
  }
  get maxWidth() {
    return this._maxWidth;
  }
  set maxWidth(value) {
    this._maxWidth = value;
    if (this.tooltipElm && value)
      this.tooltipElm.style.maxWidth = this.maxWidth;
  }
  show(elm) {
    if (!this.tooltipElm)
      this.renderTooltip();
    document.body.appendChild(this.tooltipElm);
    this.positionAt(elm, this.tooltipElm, this.placement);
  }
  close() {
    if (this.tooltipElm && document.body.contains(this.tooltipElm))
      document.body.removeChild(this.tooltipElm);
  }
  onHandleClick(elm) {
    this.show(elm);
    this.timeout = setTimeout(() => {
      clearTimeout(this.timeout);
      if (this.tooltipElm && document.body.contains(this.tooltipElm))
        document.body.removeChild(this.tooltipElm);
    }, 200);
  }
  renderTooltip() {
    this.tooltipElm = document.createElement("div");
    this.tooltipElm.classList.add("ii-tooltip");
    this.tooltipElm.innerHTML = this.content;
    this.tooltipElm.classList.add(this.popperClass);
    this.tooltipElm.classList.add(`ii-tooltip-${this.placement}`);
    if (this.color) {
      this.tooltipElm.style.backgroundColor = this.color;
      this.tooltipElm.style.setProperty("--tooltips-arrow-background", this.color);
    }
    if (this.maxWidth)
      this.tooltipElm.style.maxWidth = this.maxWidth;
  }
  initEvents(source) {
    source.addEventListener("mouseover", (e) => {
      if (!this.content)
        return;
      if (this.trigger === "hover") {
        e.preventDefault();
        e.stopImmediatePropagation();
        this.show(source);
        source.addEventListener("mouseleave", (e2) => {
          this.close();
        });
      }
    });
    source.addEventListener("mousedown", (e) => {
      if (!this.content)
        return;
      if (this.trigger === "click") {
        this.onHandleClick(source);
      } else {
        this.close();
      }
    });
  }
};

// packages/base/src/control.ts
function getParentControl(elm) {
  if (elm.parentElement instanceof Control) {
    return elm.parentElement;
  } else if (elm.parentElement)
    return getParentControl(elm.parentElement);
  return null;
}
var toNumberValue = (value) => {
  return parseFloat(value.replace("px", ""));
};
var _refreshTimeout;
function refresh() {
  if (!document.body.style.opacity)
    document.body.style.opacity = "0";
  clearTimeout(_refreshTimeout);
  _refreshTimeout = setTimeout(() => {
    try {
      clearTimeout(_refreshTimeout);
      _refreshTimeout = void 0;
      for (let i = 0; i < document.body.childNodes.length; i++) {
        let node = document.body.childNodes[i];
        if (node instanceof Container) {
          node.style.position = "absolute";
          node.style.width = "100%";
          node.style.height = "100%";
          node.refresh();
        }
      }
    } finally {
      document.body.style.opacity = "1";
    }
  }, 10);
}
window.addEventListener("resize", () => {
  refresh();
});
var SpaceValue = class {
  constructor(owner, value, prop) {
    this._owner = owner;
    this._value = value;
    this._prop = prop;
  }
  get left() {
    return this._value.left;
  }
  set left(value) {
    this._value.left = value;
    this.update();
  }
  get top() {
    return this._value.top;
  }
  set top(value) {
    this._value.top = value;
    this.update();
  }
  get right() {
    return this._value.right;
  }
  set right(value) {
    this._value.right = value;
    this.update();
  }
  get bottom() {
    return this._value.bottom;
  }
  set bottom(value) {
    this._value.bottom = value;
    this.update();
  }
  update(value) {
    if (value)
      this._value = value;
    else {
      switch (this._prop) {
        case "margin":
          this._owner.margin = this._value;
          break;
        case "padding":
          if (this._owner instanceof Container)
            this._owner.padding = this._value;
          break;
      }
      ;
    }
    ;
  }
};
var DefaultBorderSideStyles = {
  width: void 0,
  style: void 0,
  color: void 0
};
var Border = class {
  constructor(target, options) {
    this._styleClassMap = {};
    this._target = target;
    if (options) {
      if (options.width || options.style || options.color || options.radius) {
        this.updateAllSidesProps(options);
      } else if (options.top || options.right || options.bottom || options.left) {
        if (options.top)
          this._top = options.top;
        if (options.right)
          this._right = options.right;
        if (options.bottom)
          this._bottom = options.bottom;
        if (options.left)
          this._left = options.left;
        this.setSideBorderStyles("top", this.top);
        this.setSideBorderStyles("right", this.right);
        this.setSideBorderStyles("bottom", this.bottom);
        this.setSideBorderStyles("left", this.left);
      }
    }
  }
  updateAllSidesProps(options) {
    if (options.width)
      this._width = typeof options.width == "number" ? options.width + "px" : options.width;
    if (options.style)
      this._style = options.style;
    if (options.color)
      this._color = options.color;
    if (options.radius)
      this._radius = typeof options.radius == "number" ? options.radius + "px" : options.radius;
    this.setBorderStyles(options);
  }
  get radius() {
    return this._radius;
  }
  set radius(value) {
    if (typeof value == "number") {
      this._radius = value + "px";
      this._target.style.borderRadius = value + "px";
    } else {
      this._radius = value;
      this._target.style.borderRadius = value;
    }
  }
  get width() {
    return this._width;
  }
  set width(value) {
    if (typeof value == "number") {
      this._width = value + "px";
    } else {
      this._width = value;
    }
    this.setBorderStyles({
      width: this._width
    });
  }
  get style() {
    return this._style;
  }
  set style(value) {
    this._style = value;
    this.setBorderStyles({
      style: this._style
    });
  }
  get color() {
    return this._color;
  }
  set color(value) {
    this._color = value;
    this.setBorderStyles({
      color: this._color
    });
  }
  get top() {
    if (!this._top) {
      this._top = __spreadValues({}, DefaultBorderSideStyles);
    }
    return this._top;
  }
  set top(value) {
    this._top = value;
    this.setSideBorderStyles("top", value);
  }
  get right() {
    if (!this._right) {
      this._right = __spreadValues({}, DefaultBorderSideStyles);
    }
    return this._right;
  }
  set right(value) {
    this._right = value;
    this.setSideBorderStyles("right", value);
  }
  get bottom() {
    if (!this._bottom) {
      this._bottom = __spreadValues({}, DefaultBorderSideStyles);
    }
    return this._bottom;
  }
  set bottom(value) {
    this._bottom = value;
    this.setSideBorderStyles("bottom", value);
  }
  get left() {
    if (!this._left) {
      this._left = __spreadValues({}, DefaultBorderSideStyles);
    }
    return this._left;
  }
  set left(value) {
    this._left = value;
    this.setSideBorderStyles("left", value);
  }
  removeStyleClass(name) {
    if (this._styleClassMap[name]) {
      this._target.classList.remove(this._styleClassMap[name]);
      delete this._styleClassMap[name];
    }
  }
  setSideBorderStyles(side, value) {
    if (value && (value.width || value.style || value.color)) {
      let style2 = getBorderSideStyleClass(side, value);
      this.removeStyleClass(side);
      this._styleClassMap[side] = style2;
      this._target.classList.add(style2);
    }
  }
  setBorderStyles(value) {
    if (value.width || value.style || value.color || value.radius) {
      let style2 = getBorderStyleClass(value);
      this.removeStyleClass("left");
      this.removeStyleClass("bottom");
      this.removeStyleClass("right");
      this.removeStyleClass("top");
      if (value.width) {
        this.removeStyleClass("width");
        this._styleClassMap["width"] = style2;
      }
      if (value.style) {
        this.removeStyleClass("style");
        this._styleClassMap["style"] = style2;
      }
      if (value.color) {
        this.removeStyleClass("color");
        this._styleClassMap["color"] = style2;
      }
      if (value.radius) {
        this.removeStyleClass("radius");
        this._styleClassMap["radius"] = style2;
      }
      this._target.classList.add(style2);
    }
  }
};
var Control = class extends Component {
  constructor(parent, options, defaults) {
    super(parent, options, defaults);
    this._controls = [];
    this._enabled = true;
    this._paddingLeft = 0;
    this._paddingTop = 0;
    this._paddingRight = 0;
    this._paddingBottom = 0;
    this._marginLeft = 0;
    this._marginTop = 0;
    this._marginRight = 0;
    this._marginBottom = 0;
    this._anchorLeft = true;
    this._anchorTop = true;
    this._anchorRight = false;
    this._anchorBottom = false;
    this._visible = true;
    this.parent = parent;
  }
  static async create(options, parent, defaults) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
  getMarginStyle() {
    const computedStyle = window.getComputedStyle(this);
    const left = toNumberValue(computedStyle.marginLeft);
    const right = toNumberValue(computedStyle.marginRight);
    const bottom = toNumberValue(computedStyle.marginBottom);
    const top = toNumberValue(computedStyle.marginTop);
    return { top, right, bottom, left };
  }
  getPaddingStyle() {
    const toNumber = (value) => {
      return parseFloat(value.replace("px", ""));
    };
    const computedStyle = window.getComputedStyle(this);
    const left = toNumberValue(computedStyle.paddingLeft);
    const right = toNumberValue(computedStyle.paddingRight);
    const bottom = toNumberValue(computedStyle.paddingBottom);
    const top = toNumberValue(computedStyle.paddingTop);
    return { top, right, bottom, left };
  }
  get margin() {
    return this._margin;
  }
  set margin(value) {
    if (!this._margin)
      this._margin = new SpaceValue(this, value, "margin");
    else
      this._margin.update(value);
    const { top = 0, right = 0, bottom = 0, left = 0 } = value;
    this.style.margin = `${this.getSpacingValue(top)} ${this.getSpacingValue(right)} ${this.getSpacingValue(bottom)} ${this.getSpacingValue(left)}`;
    const margin = this.getMarginStyle();
    this._marginLeft = margin.left;
    this._marginTop = margin.top;
    this._marginRight = margin.right;
    this._marginBottom = margin.bottom;
  }
  get padding() {
    return this._padding;
  }
  set padding(value) {
    if (!this._padding)
      this._padding = new SpaceValue(this, value, "padding");
    else
      this._padding.update(value);
    const { top = 0, right = 0, bottom = 0, left = 0 } = value;
    this.style.padding = `${this.getSpacingValue(top)} ${this.getSpacingValue(right)} ${this.getSpacingValue(bottom)} ${this.getSpacingValue(left)}`;
    const padding = this.getPaddingStyle();
    this._paddingLeft = padding.left;
    this._paddingTop = padding.top;
    this._paddingRight = padding.right;
    this._paddingBottom = padding.bottom;
  }
  addChildControl(control) {
    if (!control.parentNode)
      this.appendChild(control);
  }
  removeChildControl(control) {
    if (this.contains(control))
      this.removeChild(control);
  }
  get parent() {
    return this._parent;
  }
  set parent(value) {
    if (value && value._controls.indexOf(this) < 0)
      value._controls.push(this);
    if (this._parent != value) {
      if (this._parent) {
        if (this._parent._controls.indexOf(this) > -1)
          this._parent._controls.splice(this._parent._controls.indexOf(this), 1);
        this._parent.removeChildControl(this);
        if (!_refreshTimeout)
          this._parent.refresh();
      }
      ;
      this._parent = value;
      if (this._parent) {
        this._parent.addChildControl(this);
        if (!_refreshTimeout)
          this._parent.refresh();
      }
    }
  }
  getSpacingValue(value) {
    if (typeof value === "number")
      return value + "px";
    if (value === "auto")
      return value;
    const unit = value.replace(/\d+(\.\d+)?/g, "");
    const number = value.replace(unit, "");
    const isValidUnit = ["px", "em", "rem", "%"].includes(unit);
    return isValidUnit ? value : `${number}px`;
  }
  connectedCallback() {
    super.connectedCallback();
    refresh();
  }
  disconnectCallback() {
    this.parent = void 0;
    super.disconnectCallback();
  }
  getParentHeight() {
    if (!this._parent)
      return window.innerHeight;
    else if (this._parent._container)
      return this._parent._container.offsetHeight;
    else
      return this._parent.offsetHeight;
  }
  getParentWidth() {
    if (!this._parent)
      return window.innerWidth;
    else if (this._parent._container)
      return this._parent._container.offsetWidth;
    else {
      return this._parent.offsetWidth;
    }
  }
  getParentOccupiedLeft() {
    if (!this._parent)
      return 0;
    else {
      let result = this._parent._paddingLeft;
      for (let i = 0; i < this._parent._controls.length; i++) {
        let control = this._parent._controls[i];
        if (control === this) {
          if (this.dock == "left")
            return result;
        } else if (control.visible && control.dock == "left") {
          result += control.offsetWidth + control._marginLeft;
        }
      }
      ;
      return result;
    }
    ;
  }
  getParentOccupiedRight() {
    if (!this._parent)
      return 0;
    else {
      let result = this._parent._paddingRight;
      for (let i = 0; i < this._parent._controls.length; i++) {
        let control = this._parent._controls[i];
        if (control === this) {
          if (this.dock == "right")
            return result;
        } else if (control.dock == "right") {
          result += control.offsetWidth + control._marginRight;
        }
      }
      ;
      return result;
    }
    ;
  }
  getParentOccupiedBottom() {
    if (!this._parent)
      return 0;
    else {
      let result = this._parent._paddingBottom;
      for (let i = 0; i < this._parent._controls.length; i++) {
        let control = this._parent._controls[i];
        if (control === this) {
          if (this.dock == "bottom")
            return result;
        } else if (control.visible && control.dock == "bottom") {
          result += control.offsetHeight + control._marginBottom;
        }
      }
      ;
      return result;
    }
    ;
  }
  getParentOccupiedTop() {
    if (!this._parent)
      return 0;
    else {
      let result = this._parent._paddingTop;
      for (let i = 0; i < this._parent._controls.length; i++) {
        let control = this._parent._controls[i];
        if (control === this) {
          if (this.dock == "top")
            return result;
        } else if (control.visible && control.dock == "top") {
          result += control.offsetHeight + control._marginTop;
        }
      }
      ;
      return result;
    }
    ;
  }
  get dock() {
    return this._dock || "";
  }
  set dock(value) {
    this._dock = value;
    if (this._resizer)
      this._resizer.reset();
  }
  get enabled() {
    return this._enabled;
  }
  set enabled(value) {
    if (this._enabled != value) {
      this._enabled = value;
      if (value) {
        this.classList.remove("disabled");
        this.classList.remove(disabledStyle);
      } else {
        this.classList.add("disabled");
        this.classList.add(disabledStyle);
      }
    }
  }
  _handleClick(event, stopPropagation) {
    if (this._onClick) {
      this._onClick(this, event);
      return true;
    } else if (!stopPropagation) {
      let parent = getParentControl(this);
      while (parent) {
        if (parent._handleClick(event))
          return true;
        parent = getParentControl(parent);
      }
      return false;
    } else
      return true;
  }
  _handleContextMenu(event, stopPropagation) {
    if (this._onContextMenu) {
      this._onContextMenu(this, event);
      return true;
    } else if (!stopPropagation) {
      let parent = getParentControl(this);
      while (parent) {
        if (parent._handleContextMenu(event))
          return true;
        parent = getParentControl(parent);
      }
      return false;
    } else
      return true;
  }
  _handleDblClick(event, stopPropagation) {
    if (this._onDblClick) {
      this._onDblClick(this, event);
      return true;
    } else if (!stopPropagation) {
      let parent = getParentControl(this);
      while (parent) {
        if (parent._handleDblClick(event))
          return true;
        parent = getParentControl(parent);
      }
      return false;
    } else
      return true;
  }
  get maxWidth() {
    return this.style.maxWidth;
  }
  set maxWidth(value) {
    this.style.maxWidth = value;
  }
  observables(propName) {
    let self = this;
    if (self["$observables"] && self["$observables"][propName])
      return self["$observables"][propName];
  }
  get onClick() {
    return this._onClick;
  }
  set onClick(callback) {
    this._onClick = callback;
  }
  get onDblClick() {
    return this._onDblClick;
  }
  set onDblClick(callback) {
    this._onDblClick = callback;
  }
  get onContextMenu() {
    return this._onContextMenu;
  }
  set onContextMenu(callback) {
    this._onContextMenu = callback;
  }
  clearInnerHTML() {
    this.innerHTML = "";
  }
  refresh() {
    if (this._dock != null) {
      this.style.position = "absolute";
      switch (this.dock) {
        case "none": {
          if (this._anchorTop == false)
            this.top = (this.getParentHeight() - this.offsetHeight) / 2;
          if (this._anchorLeft == false)
            this.left = (this.getParentWidth() - this.offsetWidth) / 2;
          break;
        }
        case "left": {
          let top = this.getParentOccupiedTop();
          this.top = top + this._marginTop;
          this.left = this.getParentOccupiedLeft();
          this.height = this.getParentHeight() - top - this.getParentOccupiedBottom() - this._marginTop - this._marginBottom;
          break;
        }
        case "top": {
          this.top = this.getParentOccupiedTop();
          this.width = this.getParentWidth();
          if (this._anchorLeft)
            this.left = 0;
          else
            this.left = (this.getParentWidth() - this.offsetWidth) / 2;
          break;
        }
        case "right": {
          let top = this.getParentOccupiedTop();
          this.top = top;
          this.left = this.getParentWidth() - this.getParentOccupiedRight() - this.offsetWidth;
          this.height = this.getParentHeight() - top - this.getParentOccupiedBottom();
          break;
        }
        case "bottom":
          this.top = this.getParentHeight() - this.getParentOccupiedBottom() - this.offsetHeight;
          this.left = 0;
          this.width = this.getParentWidth();
          break;
        case "fill":
          this.width = this.getParentWidth() - this.getParentOccupiedLeft() - this.getParentOccupiedRight();
          this.height = this.getParentHeight() - this.getParentOccupiedTop() - this.getParentOccupiedBottom();
          this.left = this.getParentOccupiedLeft();
          this.top = this.getParentOccupiedTop();
          break;
        case "center":
          this.left = (this.getParentWidth() - this.offsetWidth) / 2;
          this.top = (this.getParentHeight() - this.offsetHeight) / 2;
          break;
      }
    }
    ;
  }
  get resizable() {
    return this.attrs["resizer"] == true && ["left", "top", "right", "bottom"].indexOf(this.dock) >= 0;
  }
  setProperty(propName, value) {
    if (value.__target) {
      let target = value.__target;
      let path = value.__path;
      this[propName] = target[path[0]];
      Observe(target.observables(path[0]), (changes) => {
        let change = changes[0];
        this[propName] = change.value;
      });
    } else {
      this.setAttribute(propName, value);
    }
  }
  setAttributeToProperty(propertyName) {
    const prop = this.getAttribute(propertyName, true);
    if (prop !== null && prop !== void 0)
      this[propertyName] = prop;
  }
  init() {
    super.init();
    this.setAttributeToProperty("height");
    this.setAttributeToProperty("left");
    this.setAttributeToProperty("top");
    this.setAttributeToProperty("right");
    this.setAttributeToProperty("bottom");
    this.setAttributeToProperty("width");
    this.setAttributeToProperty("dock");
    this.setAttributeToProperty("margin");
    this.setAttributeToProperty("padding");
    this.setAttributeToProperty("tag");
    this._marginLeft = this.getPositionAttribute("marginLeft", true, 0);
    this._marginTop = this.getPositionAttribute("marginTop", true, 0);
    this._marginRight = this.getPositionAttribute("marginRight", true, 0);
    this._marginBottom = this.getPositionAttribute("marginBottom", true, 0);
    this._paddingLeft = this.getPositionAttribute("paddingLeft", true, 0);
    this._paddingTop = this.getPositionAttribute("paddingTop", true, 0);
    this._paddingRight = this.getPositionAttribute("paddingRight", true, 0);
    this._paddingBottom = this.getPositionAttribute("paddingBottom", true, 0);
    this.setAttributeToProperty("maxWidth");
    this.setAttributeToProperty("stack");
    this.setAttributeToProperty("grid");
    if (this._left != null || this._top != null)
      this.style.position = "absolute";
    if (this.getAttribute("enabled") !== false)
      this.classList.add("enabled");
    else
      this.enabled = false;
    if (this.getAttribute("visible") == false)
      this.visible = false;
    this.setAttributeToProperty("position");
    this.setAttributeToProperty("background");
    this.setAttributeToProperty("zIndex");
    this.setAttributeToProperty("lineHeight");
    this.setAttributeToProperty("linkTo");
    this.setAttributeToProperty("minHeight");
    const tooltip = this.getAttribute("tooltip", true);
    tooltip && (this._tooltip = new Tooltip(this));
    const font = this.getAttribute("font", true);
    font && (this.font = font);
    let border = this.getAttribute("border", true);
    if (border) {
      this._border = new Border(this, border);
    }
    this.setAttributeToProperty("display");
  }
  setElementPosition(elm, prop, value) {
    if (value != null && !isNaN(value)) {
      this["_" + prop] = parseFloat(value);
      elm.style[prop] = parseFloat(value) + "px";
    } else if (value != null) {
      this["_" + prop] = value;
      elm.style[prop] = value;
    }
  }
  setPosition(prop, value) {
    if (value != null && !isNaN(value)) {
      this["_" + prop] = parseFloat(value);
      this.style[prop] = parseFloat(value) + "px";
    } else if (value != null) {
      this["_" + prop] = value;
      this.style[prop] = value;
    }
  }
  get height() {
    return !isNaN(this._height) ? this._height : this.offsetHeight;
  }
  set height(value) {
    this.setPosition("height", value);
  }
  get left() {
    return !isNaN(this._left) ? this._left : this.offsetLeft;
  }
  set left(value) {
    this.setPosition("left", value);
  }
  set right(value) {
    this.setPosition("right", value);
  }
  set bottom(value) {
    this.setPosition("bottom", value);
  }
  get top() {
    return !isNaN(this._top) ? this._top : this.offsetTop;
  }
  set top(value) {
    this.setPosition("top", value);
  }
  get visible() {
    return this._visible;
  }
  set visible(value) {
    this._visible = value;
    if (!this._visible)
      this.style.display = "none";
    else if (this._left != null || this._top != null)
      this.style.display = "block";
    else
      this.style.display = "";
    if (this._parent && !_refreshTimeout)
      this._parent.refresh();
  }
  get width() {
    return !isNaN(this._width) ? this._width : this.offsetWidth;
  }
  set width(value) {
    this.setPosition("width", value);
  }
  get stack() {
    return this._stack;
  }
  set stack(value) {
    this._stack = value;
    this.style.flexBasis = value.basis || "";
    this.style.flexGrow = value.grow || "";
    this.style.flexShrink = value.shrink || "";
  }
  get grid() {
    return this._grid;
  }
  set grid(value) {
    this._grid = value;
    if (value.column && value.columnSpan)
      this.style.gridColumn = value.column + " / span " + value.columnSpan;
    else if (value.column)
      this.style.gridColumnStart = value.column.toString();
    else if (value.columnSpan)
      this.style.gridColumn = "span " + value.columnSpan;
    if (value.row && value.rowSpan)
      this.style.gridRow = value.row + " / span " + value.rowSpan;
    else if (value.row)
      this.style.gridRowStart = value.row.toString();
    else if (value.rowSpan)
      this.style.gridRow = "span " + value.rowSpan;
    if (value.area)
      this.style.gridArea = value.area;
    if (value.horizontalAlignment)
      this.style.justifyContent = value.horizontalAlignment;
  }
  get background() {
    return this.style.background;
  }
  set background(value) {
    this.style.background = value;
  }
  get zIndex() {
    return this.style.zIndex;
  }
  set zIndex(value) {
    this.style.zIndex = "" + value;
  }
  get lineHeight() {
    return this._lineHeight;
  }
  set lineHeight(value) {
    this._lineHeight = value;
    this.style.lineHeight = "" + value;
  }
  get linkTo() {
    return this._linkTo;
  }
  set linkTo(value) {
    this._linkTo = value;
  }
  get position() {
    return this.style.position;
  }
  set position(value) {
    this.style.position = value;
  }
  get minHeight() {
    return this.style.minHeight;
  }
  set minHeight(value) {
    if (!isNaN(Number(value))) {
      this.style.minHeight = value + "px";
    } else {
      this.style.minHeight = value + "";
    }
  }
  get border() {
    if (!this._border) {
      this._border = new Border(this);
    }
    return this._border;
  }
  set border(value) {
    this._border = new Border(this, value);
  }
  get tooltip() {
    if (!this._tooltip) {
      this._tooltip = new Tooltip(this);
    }
    return this._tooltip;
  }
  get font() {
    return {
      color: this.style.color,
      name: this.style.fontFamily,
      size: this.style.fontSize,
      bold: this.style.fontStyle.indexOf("bold") >= 0,
      style: this.style.fontStyle
    };
  }
  set font(value) {
    this.style.color = value.color || "";
    this.style.fontSize = value.size || "";
    this.style.fontWeight = value.bold ? "bold" : "";
    this.style.fontFamily = value.name || "";
    this.style.fontStyle = value.style || "";
  }
  get display() {
    return this._display;
  }
  set display(value) {
    this._display = value;
    this.style.display = value;
  }
};
var ContainerResizer = class {
  constructor(target) {
    this.target = target;
    this._mouseDownHandler = this.handleMouseDown.bind(this);
    this._mouseUpHandler = this.handleMouseUp.bind(this);
    this._mouseMoveHandler = this.handleMouseMove.bind(this);
  }
  reset() {
    if (!this.target.resizable && this._resizer) {
      this._resizer.removeEventListener("mousedown", this._mouseDownHandler);
      this.target.removeChild(this._resizer);
      this._resizer = void 0;
    } else if (this.target.resizable) {
      switch (this.target.dock) {
        case "left":
          this.resizer.classList.value = "resizer e-resize";
          break;
        case "top":
          this.resizer.classList.value = "resizer s-resize";
          break;
        case "right":
          this.resizer.classList.value = "resizer w-resize";
          break;
        case "bottom":
          this.resizer.classList.value = "resizer n-resize";
          break;
      }
      ;
    }
    ;
  }
  handleMouseDown(e) {
    this.target.classList.add("resizing");
    this._origHeight = this.target.offsetHeight;
    this._origWidth = this.target.offsetWidth;
    if (this._resizer) {
      this._resizer.classList.add("highlight");
      this._mouseDownPos = {
        x: e.clientX,
        y: e.clientY
      };
      document.addEventListener("mousemove", this._mouseMoveHandler);
      document.addEventListener("mouseup", this._mouseUpHandler);
    }
  }
  handleMouseMove(e) {
    var _a, _b, _c, _d;
    e.preventDefault();
    e.stopPropagation();
    let offsetX = e.clientX - this._mouseDownPos.x;
    let offsetY = e.clientY - this._mouseDownPos.y;
    switch (this.target.dock) {
      case "left":
        this.target.style.width = this._origWidth + offsetX + "px";
        (_a = this.target.parent) == null ? void 0 : _a.refresh();
        break;
      case "top":
        this.target.style.height = this._origHeight + offsetY + "px";
        (_b = this.target.parent) == null ? void 0 : _b.refresh();
        break;
      case "right":
        this.target.style.width = this._origWidth - offsetX + "px";
        (_c = this.target.parent) == null ? void 0 : _c.refresh();
        break;
      case "bottom":
        this.target.style.height = this._origHeight - offsetY + "px";
        (_d = this.target.parent) == null ? void 0 : _d.refresh();
        break;
    }
  }
  handleMouseUp(e) {
    document.removeEventListener("mousemove", this._mouseMoveHandler);
    document.removeEventListener("mouseup", this._mouseUpHandler);
    this.target.classList.remove("resizing");
    if (this._resizer)
      this._resizer.classList.remove("highlight");
  }
  get resizer() {
    if (!this._resizer) {
      this._resizer = document.createElement("span");
      this.target.appendChild(this._resizer);
      this._resizer.addEventListener("mousedown", this._mouseDownHandler);
    }
    ;
    return this._resizer;
  }
};
var Container = class extends Control {
  get controls() {
    return this._controls;
  }
  get resizer() {
    return this.attrs["resizer"] == true;
  }
  set resizer(value) {
    this.attrs["resizer"] = value;
    if (this.resizable && !this._resizer)
      this._resizer = new ContainerResizer(this);
    if (this._resizer)
      this._resizer.reset();
  }
  init() {
    super.init();
    this.classList.add(containerStyle);
    if (this.resizable && !this._resizer) {
      this._resizer = new ContainerResizer(this);
      this._resizer.reset();
    }
    ;
  }
  refreshControls() {
    for (let i = 0; i < this._controls.length; i++)
      this._controls[i].refresh();
  }
  refresh(skipRefreshControls) {
    super.refresh();
    for (let i = 0; i < this.childNodes.length; i++) {
      let node = this.childNodes[i];
      if (node instanceof Control) {
        node.parent = this;
      }
      ;
    }
    ;
    if (!skipRefreshControls)
      this.refreshControls();
  }
};

// packages/base/src/index.ts
var scripts = document.getElementsByTagName("script");
var pathname = scripts[scripts.length - 1].src;
var lastIndex = pathname.lastIndexOf("/");
var LibPath = pathname.slice(0, lastIndex + 1);
var RequireJS = {
  config(config) {
    window.require.config(config);
  },
  require(reqs, callback) {
    window.require(reqs, callback);
  },
  defined(module2) {
    return window.require.defined(module2);
  }
};
function customElements2(name, options) {
  return (constructor) => {
    window.customElements.define(name, constructor, options);
  };
}
function customModule(target) {
  _currentDefineModule = target;
}

// packages/application/src/event-bus.ts
var _EventBus = class {
  constructor() {
    this.subscribers = {};
  }
  static getInstance() {
    if (this.instance === void 0) {
      this.instance = new _EventBus();
    }
    return this.instance;
  }
  dispatch(event, arg) {
    const subscriber = this.subscribers[event];
    if (subscriber === void 0) {
      return;
    }
    Object.keys(subscriber).forEach((key2) => subscriber[key2](arg));
  }
  register(sender, event, callback) {
    const id = this.getNextId();
    if (!this.subscribers[event])
      this.subscribers[event] = {};
    this.subscribers[event][id] = callback.bind(sender);
    return {
      unregister: () => {
        delete this.subscribers[event][id];
        if (Object.keys(this.subscribers[event]).length === 0)
          delete this.subscribers[event];
      }
    };
  }
  getNextId() {
    return _EventBus.nextId++;
  }
};
var EventBus = _EventBus;
EventBus.nextId = 0;
EventBus.instance = void 0;

// packages/checkbox/src/style/checkbox.css.ts
var Theme2 = theme_exports.ThemeVars;
cssRule("i-checkbox", {
  fontFamily: Theme2.typography.fontFamily,
  fontSize: Theme2.typography.fontSize,
  userSelect: "none",
  "$nest": {
    ".i-checkbox": {
      display: "inline-flex",
      alignItems: "center",
      position: "relative",
      maxWidth: "100%"
    },
    ".i-checkbox_input": {
      cursor: "pointer",
      whiteSpace: "nowrap",
      display: "inline-flex",
      position: "relative"
    },
    ".checkmark": {
      width: 15,
      height: 15,
      display: "inline-block",
      position: "relative",
      backgroundColor: Theme2.background.paper,
      border: `1px solid ${Theme2.divider}`,
      boxSizing: "border-box",
      transition: "border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46)"
    },
    ".i-checkbox_label": {
      boxSizing: "border-box",
      color: Theme2.text.primary,
      display: "inline-block",
      paddingLeft: 8,
      maxWidth: "100%"
    },
    "input": {
      opacity: 0,
      width: 0,
      height: 0,
      position: "absolute",
      top: 0,
      left: 0
    },
    "&.is-checked": {
      "$nest": {
        ".i-checkbox_label": {
          color: Theme2.colors.info.main
        },
        ".checkmark": {
          backgroundColor: Theme2.colors.info.main
        },
        ".checkmark:after": {
          transform: "rotate(45deg) scaleY(1)"
        },
        ".is-indeterminate .checkmark:after": {
          transform: "none"
        }
      }
    },
    "&:not(.disabled):hover input ~ .checkmark": {
      borderColor: Theme2.colors.info.main
    },
    "&.disabled": {
      cursor: "not-allowed"
    },
    ".checkmark:after": {
      content: "''",
      boxSizing: "content-box",
      border: `1px solid ${Theme2.background.paper}`,
      borderLeft: 0,
      borderTop: 0,
      height: 7.5,
      left: "35%",
      top: 1,
      transform: "rotate(45deg) scaleY(0)",
      width: 3.5,
      transition: "transform .15s ease-in .05s",
      transformOrigin: "center",
      display: "inline-block",
      position: "absolute"
    },
    ".is-indeterminate .checkmark": {
      backgroundColor: Theme2.colors.info.main
    },
    ".is-indeterminate .checkmark:after": {
      width: "80%",
      height: 0,
      top: "50%",
      left: "10%",
      borderRight: 0,
      transform: "none"
    }
  }
});

// packages/checkbox/src/checkbox.ts
var Checkbox = class extends Control {
  constructor(parent, options) {
    super(parent, options, {
      height: 30
    });
  }
  get caption() {
    return this._caption;
  }
  set caption(value) {
    this._caption = value;
    if (!value)
      this.captionSpanElm.style.display = "none";
    else
      this.captionSpanElm.style.display = "";
    this.captionSpanElm && (this.captionSpanElm.textContent = value);
  }
  get captionWidth() {
    return this._captionWidth;
  }
  set captionWidth(value) {
    if (!value)
      return;
    this._captionWidth = value;
    this.setElementPosition(this.captionSpanElm, "width", value);
  }
  get height() {
    return this.offsetHeight;
  }
  set height(value) {
    this.setPosition("height", value);
  }
  get indeterminate() {
    return this._indeterminate;
  }
  set indeterminate(value) {
    this._indeterminate = value;
    if (this.inputSpanElm)
      value ? this.inputSpanElm.classList.add("is-indeterminate") : this.inputSpanElm.classList.remove("is-indeterminate");
    this.inputElm.indeterminate = value;
  }
  get checked() {
    return this._checked;
  }
  set checked(value) {
    this._checked = value;
    this.addClass(value, "is-checked");
    this.inputElm && (this.inputElm.checked = value);
  }
  get value() {
    return this.inputElm.value;
  }
  set value(data) {
    this.inputElm.value = data;
  }
  _handleChange(event) {
    this.checked = this.inputElm.checked || false;
    this.addClass(this.checked, "is-checked");
    if (this.onChanged)
      this.onChanged(this, event);
  }
  addClass(value, className) {
    if (value)
      this.classList.add(className);
    else
      this.classList.remove(className);
  }
  init() {
    if (!this.captionSpanElm) {
      this.wrapperElm = this.createElement("label", this);
      if (this.height)
        this.wrapperElm.style.height = this.height + "px";
      this.wrapperElm.classList.add("i-checkbox");
      this.inputSpanElm = this.createElement("span", this.wrapperElm);
      this.inputSpanElm.classList.add("i-checkbox_input");
      this.inputElm = this.createElement("input", this.inputSpanElm);
      this.inputElm.type = "checkbox";
      const disabled = this.getAttribute("enabled") === false;
      this.inputElm.disabled = disabled;
      this.checkmarklElm = this.createElement("span");
      this.checkmarklElm.classList.add("checkmark");
      this.inputSpanElm.appendChild(this.checkmarklElm);
      this.inputElm.addEventListener("input", this._handleChange.bind(this));
      this.captionSpanElm = this.createElement("span", this.wrapperElm);
      this.captionSpanElm.classList.add("i-checkbox_label");
      this.captionWidth = this.getAttribute("captionWidth", true);
      this.caption = this.getAttribute("caption", true);
      this.value = this.caption;
      this.checked = this.getAttribute("checked", true, false);
      this.indeterminate = this.getAttribute("indeterminate", true);
      super.init();
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Checkbox = __decorateClass([
  customElements2("i-checkbox")
], Checkbox);

// packages/application/src/globalEvent.ts
function getControl(target) {
  if (target instanceof Control) {
    return target;
  }
  if ((target instanceof HTMLElement || target instanceof SVGElement) && target.parentElement)
    return getControl(target.parentElement);
  return null;
}
var GlobalEvents = class {
  constructor() {
    this.bindEvents();
  }
  _handleClick(event) {
    let control = getControl(event.target);
    if (control && !(control instanceof Checkbox)) {
      if (control.enabled) {
        if (control._handleClick(event)) {
          event.stopPropagation();
        }
      }
    }
  }
  _handleMouseDown(event) {
  }
  _handleMouseMove(event) {
  }
  _handleMouseUp(event) {
  }
  _handleDblClick(event) {
    let control = getControl(event.target);
    if (control) {
      if (control.enabled) {
        if (control._handleDblClick(event)) {
          event.preventDefault();
          event.stopPropagation();
        }
      }
    }
  }
  _handleKeyDown(event) {
  }
  _handleKeyUp(event) {
  }
  _handleContextMenu(event) {
    let control = getControl(event.target);
    if (control) {
      event.preventDefault();
      event.stopPropagation();
      if (control.enabled)
        control._handleContextMenu(event);
    }
  }
  _handleTouchStart(event) {
  }
  _handleTouchEnd(event) {
  }
  _handleTouchMove(event) {
  }
  _handleChange(event) {
  }
  _handleMouseWheel(event) {
  }
  _handleFocus(event) {
  }
  _handleBlur(event) {
  }
  bindEvents() {
    window.addEventListener("mousedown", this._handleMouseDown.bind(this));
    window.addEventListener("mousemove", this._handleMouseMove.bind(this));
    window.addEventListener("mouseup", this._handleMouseUp.bind(this));
    document.addEventListener("click", this._handleClick.bind(this));
    window.addEventListener("dblclick", this._handleDblClick.bind(this));
    window.oncontextmenu = this._handleContextMenu.bind(this);
    window.addEventListener("keydown", this._handleKeyDown);
    window.addEventListener("keyup", this._handleKeyUp);
    window.addEventListener("touchstart", this._handleTouchStart);
    window.addEventListener("touchend", this._handleTouchEnd);
    window.addEventListener("touchmove", this._handleTouchMove);
    window.addEventListener("change", this._handleChange);
    window.addEventListener("wheel", this._handleMouseWheel, false);
    window.addEventListener("focus", this._handleFocus, true);
    window.addEventListener("blur", this._handleBlur, true);
  }
};

// packages/application/src/styles/index.css.ts
var Theme3 = theme_exports.ThemeVars;
var applicationStyle = style({
  height: "100%",
  $nest: {
    "body": {
      height: "100%"
    }
  }
});

// packages/application/src/index.ts
var Application = class {
  constructor() {
    this.modules = {};
    this.modulesId = {};
    this.scripts = {};
    this.id = 0;
    this.LibHost = "";
    this.globalEvents = new GlobalEvents();
  }
  get EventBus() {
    return EventBus.getInstance();
  }
  static get Instance() {
    return this._instance || (this._instance = new this());
  }
  async verifyScript(modulePath, script) {
    return true;
  }
  async getScript(modulePath) {
    if (this.scripts[modulePath])
      return this.scripts[modulePath];
    try {
      let result = await (await fetch(modulePath)).text();
      if (typeof result == "string") {
        if (await this.verifyScript(modulePath, result)) {
          this.scripts[modulePath] = result;
          return result;
        }
        ;
      }
      ;
    } catch (err) {
    }
    ;
    return "";
  }
  async loadScript(modulePath, script) {
    try {
      if (this.scripts[modulePath])
        return true;
      if (await this.verifyScript(modulePath, script)) {
        this.scripts[modulePath] = script;
        return true;
      }
      ;
    } catch (err) {
    }
    ;
    return false;
  }
  async getContent(modulePath) {
    try {
      return await (await fetch(modulePath)).text();
    } catch (err) {
    }
    return "";
  }
  async getModule(modulePath, options) {
    if (this.modules[modulePath])
      return this.modules[modulePath];
    let result = await this.newModule(modulePath, options);
    if (result)
      this.modules[modulePath] = result;
    return result;
  }
  async loadPackage(packageName, modulePath, options) {
    if (RequireJS.defined(packageName))
      return true;
    if (modulePath.startsWith("{LIB}/")) {
      if (LibPath.endsWith("/"))
        modulePath = modulePath.replace("{LIB}/", LibPath);
      else
        modulePath = modulePath.replace("{LIB}/", LibPath + "/");
    }
    ;
    let script = await this.getScript(modulePath);
    if (script) {
      _currentDefineModule = null;
      this.currentModulePath = modulePath;
      if (modulePath.indexOf("://") > 0)
        this.currentModuleDir = modulePath.split("/").slice(0, -1).join("/");
      else
        this.currentModuleDir = application.LibHost + modulePath.split("/").slice(0, -1).join("/");
      await import(`data:text/javascript,${encodeURIComponent(script)}`);
      this.currentModulePath = "";
      this.currentModuleDir = "";
      return true;
    }
    ;
    return false;
  }
  async loadModule(modulePath, options) {
    let module2 = await this.newModule(modulePath, options);
    if (module2)
      document.body.append(module2);
    return module2;
  }
  async newModule(modulePath, options) {
    let elmId = this.modulesId[modulePath];
    if (elmId && modulePath)
      return document.createElement(elmId);
    if (options && options.dependencies) {
      for (let p in options.dependencies) {
        await this.loadPackage(p, options.dependencies[p]);
      }
    }
    ;
    let script;
    if (options && options.script)
      script = options.script;
    else
      script = await this.getScript(modulePath);
    if (script) {
      _currentDefineModule = null;
      this.currentModulePath = modulePath;
      if (modulePath.indexOf("://") > 0)
        this.currentModuleDir = modulePath.split("/").slice(0, -1).join("/");
      else
        this.currentModuleDir = application.LibHost + modulePath.split("/").slice(0, -1).join("/");
      await import(`data:text/javascript,${encodeURIComponent(script)}`);
      document.getElementsByTagName("html")[0].classList.add(applicationStyle);
      this.currentModulePath = "";
      this.currentModuleDir = "";
      if (_currentDefineModule) {
        let module2 = _currentDefineModule.default || _currentDefineModule;
        if (module2) {
          this.id++;
          elmId = `i-module--${this.id}`;
          this.modulesId[modulePath] = elmId;
          let Module2 = class extends module2 {
          };
          customElements.define(elmId, Module2);
          let result = new Module2(null, options);
          return result;
        }
        ;
      }
    }
    return null;
  }
  async copyToClipboard(value) {
    if (!value)
      return false;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(value);
        return true;
      } else {
        const input = document.createElement("input");
        input.value = value;
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.focus();
        input.select();
        const result = document.execCommand("copy");
        document.body.removeChild(input);
        return result;
      }
    } catch (err) {
      console.log("debug: copy", err);
      return false;
    }
  }
};
window["application"] = Application.Instance;
var application = Application.Instance;

// packages/image/src/style/image.css.ts
var Theme4 = theme_exports.ThemeVars;
cssRule("i-image", {
  position: "relative",
  $nest: {
    "&.i-image-crop": {
      position: "relative",
      display: "table",
      verticalAlign: "middle",
      width: "100%",
      overflow: "hidden"
    },
    ".i-image-crop_box": {
      width: "45%",
      height: 200,
      cursor: "move",
      touchAction: "none",
      position: "absolute",
      top: 0,
      left: 0,
      border: `1px dashed ${Theme4.background.paper}`,
      zIndex: "100",
      maxWidth: "100%"
    },
    ".i-image-crop_mask": {
      backgroundColor: ThemeVars.text.secondary,
      cursor: "crosshair",
      width: "100%",
      height: "100%",
      position: "absolute",
      left: 0,
      top: 0
    },
    ".i-image_resize": {
      width: "100%",
      height: "100%"
    },
    ".i-image_resize-handle": {
      display: "inline-block",
      position: "absolute",
      border: `1px solid ${Theme4.background.default}`,
      backgroundColor: Theme4.action.disabled,
      width: 10,
      height: 10,
      outline: "1px solid transparent"
    },
    ".ord-nw": {
      top: 0,
      left: 0,
      marginTop: -5,
      marginLeft: -5,
      cursor: "nw-resize"
    },
    ".ord-ne": {
      top: 0,
      right: 0,
      marginTop: -5,
      marginRight: -5,
      cursor: "ne-resize"
    },
    ".ord-sw": {
      bottom: 0,
      left: 0,
      marginBottom: -5,
      marginLeft: -5,
      cursor: "sw-resize"
    },
    ".ord-se": {
      bottom: 0,
      right: 0,
      marginBottom: -5,
      marginRight: -5,
      cursor: "se-resize"
    },
    ".i-image-clipped": {
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 99
    },
    "img": {
      maxHeight: "100%",
      maxWidth: "100%",
      height: "inherit",
      verticalAlign: "middle",
      objectFit: "contain",
      overflow: "hidden"
    }
  }
});

// packages/image/src/image.ts
var Image2 = class extends Control {
  constructor(parent, options) {
    super(parent, options, {});
    this._rotate = 0;
  }
  get rotate() {
    return this._rotate;
  }
  set rotate(value) {
    if (value == void 0)
      return;
    value = parseInt(value);
    if (value != this._rotate) {
      if (this.imageElm) {
        if (this._rotate != 0)
          this.imageElm.classList.remove(rotate(this._rotate));
        this.imageElm.classList.add(rotate(value));
      }
      this._rotate = value;
    }
  }
  get url() {
    return this._url;
  }
  set url(value) {
    this._url = value;
    if (value && !this.imageElm)
      this.imageElm = this.createElement("img", this);
    if (this.imageElm) {
      this.imageElm.src = value;
      const self = this;
      this.imageElm.onerror = function() {
        self._fallbackUrl && (this.src = self._fallbackUrl);
      };
    }
  }
  init() {
    super.init();
    this._fallbackUrl = this.getAttribute("fallbackUrl", true, "");
    const urlAttr = this.getAttribute("url", true);
    urlAttr && (this.url = urlAttr);
    this.rotate = this.getAttribute("rotate", true);
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Image2 = __decorateClass([
  customElements2("i-image")
], Image2);

// packages/icon/src/style/icon.css.ts
var Theme5 = theme_exports.ThemeVars;
var spinnerAnim2 = keyframes({
  "0%": {
    transform: "rotate(0deg)"
  },
  "100%": {
    transform: "rotate(360deg)"
  }
});
cssRule("i-icon", {
  display: "inline-block",
  $nest: {
    "svg": {
      verticalAlign: "top",
      width: "100%",
      height: "100%"
    },
    "&.is-spin": {
      animation: `${spinnerAnim2} 2s linear infinite`
    }
  }
});

// packages/icon/src/icon.ts
var _iconLoaded = false;
async function loadIconFile() {
  if (_iconLoaded)
    return;
  _iconLoaded = true;
  try {
    let res = await fetch(`${LibPath}assets/icon/solid.svg`);
    let text = await res.text();
    let span = document.createElement("span");
    span.innerHTML = text;
    document.body.appendChild(span);
  } catch (err) {
    _iconLoaded = false;
  }
  ;
}
var Icon = class extends Control {
  constructor(parent, options) {
    super(parent, options);
    loadIconFile();
  }
  init() {
    if (!this.initialized) {
      super.init();
      let fill = this.getAttribute("fill");
      if (fill)
        this.fill = fill;
      this._size = this.getAttribute("size", true);
      this._name = this.getAttribute("name", true);
      this._updateIcon();
      const image = this.getAttribute("image", true);
      if (image) {
        image.height = image.height || this.height || "16px";
        image.width = image.width || this.width || "16px";
        this.image = new Image2(this, image);
      }
      this.spin = this.getAttribute("spin", true, false);
    }
  }
  get fill() {
    return this.style.getPropertyValue("fill");
  }
  set fill(color) {
    this.style.setProperty("fill", color);
  }
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
    this._updateIcon();
  }
  get image() {
    if (!this._image) {
      this._image = Image2.create({
        width: this.width || 16,
        height: this.height || 16
      });
    }
    return this._image;
  }
  set image(image) {
    if (this._image)
      this.removeChild(this._image);
    this._image = image;
    if (this._image)
      this.prepend(this._image);
  }
  get spin() {
    return this._spin;
  }
  set spin(value) {
    this._spin = value;
    if (value)
      this.classList.add("is-spin");
    else
      this.classList.remove("is-spin");
    this._parent && this._parent.refresh();
  }
  _updateIcon() {
    if (this._name)
      this.innerHTML = `<svg><use xlink:href="#${this.name}"></use></svg>`;
    else
      this.innerHTML = "";
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Icon = __decorateClass([
  customElements2("i-icon")
], Icon);

// packages/button/src/style/button.css.ts
var Theme6 = theme_exports.ThemeVars;
cssRule("i-button", {
  background: Theme6.colors.primary.main,
  boxShadow: Theme6.shadows[2],
  color: Theme6.text.primary,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 4,
  fontFamily: Theme6.typography.fontFamily,
  fontSize: Theme6.typography.fontSize,
  gap: 5,
  $nest: {
    "&:not(.disabled):hover": {
      cursor: "pointer",
      backgroundColor: Theme6.colors.primary.dark,
      boxShadow: Theme6.shadows[4],
      background: Theme6.colors.primary.main
    },
    "&.disabled": {
      color: Theme6.text.disabled,
      boxShadow: Theme6.shadows[0],
      background: Theme6.action.disabledBackground
    },
    "i-icon": {
      display: "inline-block",
      fill: Theme6.text.primary,
      verticalAlign: "middle"
    },
    ".caption": {
      paddingRight: ".5rem"
    },
    "&.is-spinning, &.is-spinning:not(.disabled):hover, &.is-spinning:not(.disabled):focus": {
      color: Theme6.text.disabled,
      boxShadow: Theme6.shadows[0],
      background: Theme6.action.disabledBackground,
      cursor: "default"
    }
  }
});

// packages/button/src/button.ts
var defaultIcon = {
  width: 16,
  height: 16,
  fill: theme_exports.ThemeVars.text.primary
};
var Button = class extends Control {
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
  constructor(parent, options) {
    super(parent, options);
  }
  get caption() {
    return this.captionElm.innerHTML;
  }
  set caption(value) {
    this.captionElm.innerHTML = value;
  }
  get icon() {
    if (!this._icon) {
      this._icon = new Icon(this, defaultIcon);
      this.prependIcon(this._icon);
    }
    return this._icon;
  }
  set icon(value) {
    if (this._icon && this.contains(this._icon))
      this.removeChild(this._icon);
    this._icon = value;
    this.prependIcon(this._icon);
  }
  get rightIcon() {
    if (!this._rightIcon) {
      this._rightIcon = new Icon(this, __spreadProps(__spreadValues({}, defaultIcon), {
        name: "spinner"
      }));
      this.appendIcon(this._rightIcon);
    }
    return this._rightIcon;
  }
  set rightIcon(value) {
    if (this._rightIcon && this.contains(this._rightIcon))
      this.removeChild(this._rightIcon);
    this._rightIcon = value;
    this.appendIcon(this._rightIcon);
  }
  get isSpinning() {
    return this._icon && this._icon.spin && this._icon.visible || this._rightIcon && this._rightIcon.spin && this._rightIcon.visible;
  }
  prependIcon(icon) {
    if (!icon)
      return;
    this.appendChild(icon);
    this.captionElm && this.insertBefore(icon, this.captionElm);
  }
  appendIcon(icon) {
    if (!icon)
      return;
    this.appendChild(icon);
    this.captionElm && this.insertBefore(this.captionElm, icon);
  }
  updateButton() {
    if (this.isSpinning)
      this.classList.add("is-spinning");
    else
      this.classList.remove("is-spinning");
  }
  _handleClick(event) {
    if (this.isSpinning || !this.enabled)
      return false;
    return super._handleClick(event);
  }
  refresh() {
    super.refresh();
    this.updateButton();
  }
  init() {
    if (!this.captionElm) {
      super.init();
      this.captionElm = this.createElement("span", this);
      let caption = this.getAttribute("caption", true, "");
      this.captionElm.innerHTML = caption;
      let iconAttr = this.getAttribute("icon", true);
      if (iconAttr) {
        iconAttr = __spreadValues(__spreadValues({}, defaultIcon), iconAttr);
        const icon = new Icon(this, iconAttr);
        this.icon = icon;
      }
      let rightIconAttr = this.getAttribute("rightIcon", true);
      if (rightIconAttr) {
        rightIconAttr = __spreadValues(__spreadProps(__spreadValues({}, defaultIcon), { name: "spinner" }), rightIconAttr);
        const icon = new Icon(this, rightIconAttr);
        this.rightIcon = icon;
      }
    }
  }
};
Button = __decorateClass([
  customElements2("i-button")
], Button);

// packages/code-editor/src/monaco.ts
async function addFile(fileName, content) {
  let monaco = await initMonaco();
  if (monaco) {
    let model = await getFileModel(fileName);
    if (!model) {
      if ((fileName == null ? void 0 : fileName.endsWith(".tsx")) || (fileName == null ? void 0 : fileName.endsWith(".ts")))
        model = monaco.editor.createModel(content || "", "typescript", monaco.Uri.file(fileName));
      else
        model = monaco.editor.createModel(content || "");
    }
    return model;
  }
  ;
  return null;
}
async function updateFile(fileName, content) {
  let monaco = await initMonaco();
  if (monaco) {
    let model = await getFileModel(fileName);
    if (model) {
      model.setValue(content);
    }
    return model;
  }
  ;
  return null;
}
async function getFileModel(fileName) {
  let monaco = await initMonaco();
  if (monaco) {
    let models = monaco.editor.getModels();
    for (let i = 0; i < models.length; i++) {
      let model = models[i];
      if (model.uri.path == fileName || model.uri.path == "/" + fileName)
        return model;
    }
    ;
  }
  ;
  return null;
}
async function addLib(lib, dts) {
  let monaco = await initMonaco();
  monaco.languages.typescript.typescriptDefaults.addExtraLib(dts, lib);
}
async function initMonaco() {
  if (window.monaco)
    return window.monaco;
  return new Promise((resolve) => {
    window.MonacoEnvironment = {};
    RequireJS.config({ paths: { "vs": `${LibPath}lib/monaco-editor/0.32.1/min/vs` } });
    RequireJS.require([`vs/editor/editor.main`], (monaco) => {
      resolve(monaco);
      if (monaco.$loaded)
        return;
      monaco.$loaded = true;
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        experimentalDecorators: true,
        allowSyntheticDefaultImports: true,
        jsx: monaco.languages.typescript.JsxEmit.Preserve,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        allowNonTsExtensions: true,
        target: monaco.languages.typescript.ScriptTarget.ES2020
      });
      monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
      monaco.languages.registerCompletionItemProvider("typescript", {
        triggerCharacters: [">"],
        provideCompletionItems: (model, position) => {
          const code = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          });
          const tag = code.slice(code.lastIndexOf("<") + 1, code.length);
          if (!tag || !tag.endsWith(">") || tag.startsWith("/") || tag.indexOf(" ") > 0)
            return;
          const word = model.getWordUntilPosition(position);
          return {
            suggestions: [
              {
                label: `</${tag}`,
                kind: monaco.languages.CompletionItemKind.EnumMember,
                insertText: `$1</${tag}`,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: word.startColumn,
                  endColumn: word.endColumn
                }
              }
            ]
          };
        }
      });
    });
  });
}

// packages/code-editor/src/style/code-editor.css.ts
cssRule("i-code-editor", {
  $nest: {
    "*": {
      boxSizing: "border-box"
    },
    ".full-height": {
      height: "100vh"
    },
    ".half-width": {
      width: "50%"
    },
    ".column": {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch"
    },
    ".row": {
      display: "flex",
      flexDirection: "row"
    },
    ".align-right": {
      marginLeft: "auto",
      alignSelf: "stretch"
    },
    "#flex-wrapper": {
      display: "flex",
      alignItems: "stretch"
    },
    "#operation-editor": {
      height: "60vh",
      minHeight: "260px"
    },
    "#variables-editor": {
      height: "30vh",
      alignItems: "stretch"
    },
    "#results-editor": {
      height: "90vh",
      alignItems: "stretch"
    },
    "#toolbar": {
      minHeight: "40px",
      backgroundColor: "#1e1e1e",
      display: "inline-flex",
      alignItems: "stretch"
    },
    "#toolbar > button, #toolbar > select, #toolbar > span, button#execute-op": {
      margin: "4px",
      padding: "4px"
    },
    "#toolbar button, #toolbar select": {
      backgroundColor: "#1e1e1e",
      color: "#eee",
      border: "1px solid #eee",
      borderRadius: "4px"
    },
    "#toolbar button:hover, select:hover, button:focus, select:focus": {
      backgroundColor: "darkslategrey"
    },
    "#execution-tray": {
      display: "inline-flex",
      alignItems: "baseline"
    },
    "#schema-status": {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#eee"
    },
    "#toolbar button.reload-button": {
      border: "0 none",
      padding: "4px",
      width: "30px",
      textAlign: "center"
    }
  }
});

// packages/code-editor/src/code-editor.ts
var CodeEditor = class extends Control {
  get monaco() {
    return window.monaco;
  }
  init() {
    if (!this.editor) {
      super.init();
      this.language = this.getAttribute("language", true);
      this.style.display = "inline-block";
      if (this.language)
        this.loadContent("", this.language);
    }
    ;
  }
  get editor() {
    return this._editor;
  }
  get language() {
    return this._language;
  }
  set language(value) {
    this._language = value;
    if (!this.editor) {
      this.loadContent();
    } else {
      let monaco = this.monaco;
      let model = this.editor.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, value);
      }
    }
  }
  async loadContent(content, language, fileName) {
    let monaco = await initMonaco();
    if (content == void 0)
      content = content || this._value || "";
    this._value = content;
    language = language || this._language || "typescript";
    this._language = language;
    if (!this._editor) {
      let captionDiv = this.createElement("div", this);
      captionDiv.style.display = "inline-block";
      captionDiv.style.height = "100%";
      captionDiv.style.width = "100%";
      const customOptions = this._options || {};
      let options = __spreadValues({
        theme: "vs-dark",
        tabSize: 2,
        formatOnPaste: true,
        formatOnType: true,
        renderWhitespace: "none",
        automaticLayout: true,
        minimap: {
          enabled: false
        }
      }, customOptions);
      this._editor = monaco.editor.create(captionDiv, options);
      this._editor.onDidChangeModelContent((event) => {
        if (typeof this.onChange === "function")
          this.onChange(this, event);
      });
      if (fileName) {
        let model = await getFileModel(fileName);
        if (model) {
          this._editor.setModel(model);
          model.setValue(content);
          return;
        }
      }
      ;
      if (language == "typescript" || (fileName == null ? void 0 : fileName.endsWith(".tsx")) || (fileName == null ? void 0 : fileName.endsWith(".ts"))) {
        let model = monaco.editor.createModel(content || this._value || "", "typescript", fileName ? monaco.Uri.file(fileName) : void 0);
        this._editor.setModel(model);
      } else {
        let model = monaco.editor.createModel(content || this._value || "", language || this._language, fileName ? monaco.Uri.file(fileName) : void 0);
        this._editor.setModel(model);
      }
      ;
    } else {
      let model = this._editor.getModel();
      if (language == "typescript" && model && fileName && this._fileName != fileName) {
        if (!this._fileName)
          model.dispose();
        model = await getFileModel(fileName);
        if (!model)
          model = monaco.editor.createModel(content || this._value || "", "typescript", monaco.Uri.file(fileName));
        this._editor.setModel(model);
      } else {
        this._editor.setValue(content);
        if (language && model)
          monaco.editor.setModelLanguage(model, language);
      }
      ;
    }
    ;
    this._fileName = fileName || "";
    this._editor.setScrollTop(0);
  }
  async loadFile(fileName) {
    var _a;
    let model = await getFileModel(fileName);
    if (model) {
      if (!this._fileName)
        (_a = this._editor.getModel()) == null ? void 0 : _a.dispose();
      this._fileName = fileName;
      this._editor.setModel(model);
    }
    ;
  }
  updateOptions(options) {
    this._options = options;
    if (this._editor)
      this._editor.updateOptions(options);
  }
  get value() {
    if (this._editor)
      return this._editor.getValue();
    else
      return this._value;
  }
  set value(value) {
    this._value = value;
    if (this._editor) {
      this._editor.setValue(value);
      this._editor.setScrollTop(0);
    } else
      this.loadContent();
  }
};
CodeEditor.addLib = addLib;
CodeEditor.addFile = addFile;
CodeEditor.getFileModel = getFileModel;
CodeEditor.updateFile = updateFile;
CodeEditor = __decorateClass([
  customElements2("i-code-editor")
], CodeEditor);

// packages/code-editor/src/diff-editor.ts
var EditorType;
(function(EditorType2) {
  EditorType2[EditorType2["modified"] = 0] = "modified";
  EditorType2[EditorType2["original"] = 1] = "original";
})(EditorType || (EditorType = {}));
var CodeDiffEditor = class extends Control {
  init() {
    if (!this.editor) {
      super.init();
      this.language = this.getAttribute("language", true);
      this.style.display = "inline-block";
    }
    ;
  }
  get editor() {
    return this._editor;
  }
  get language() {
    return this._language;
  }
  set language(value) {
    this._language = value;
    if (!this.editor) {
      if (this.language) {
        this.loadContent(1, "", this.language);
        this.loadContent(0, "", this.language);
      }
    } else {
      this.setModelLanguage(value, "getOriginalEditor");
      this.setModelLanguage(value, "getModifiedEditor");
    }
  }
  setModelLanguage(value, functionName) {
    let monaco = window.monaco;
    let model = this.editor[functionName]().getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, value);
    }
  }
  getEditor(type) {
    if (type === 1)
      return this.editor.getOriginalEditor();
    else
      return this.editor.getModifiedEditor();
  }
  getModel(type) {
    return this.getEditor(type).getModel();
  }
  async loadContent(type, content, language, fileName) {
    let monaco = await initMonaco();
    const value = type === 0 ? this._modifiedValue : this._originalValue;
    if (content == void 0)
      content = content || value || "";
    type === 0 ? this._modifiedValue = content : this._originalValue = content;
    language = language || this._language || "typescript";
    this._language = language;
    if (!this._editor) {
      let captionDiv = this.createElement("div", this);
      captionDiv.style.display = "inline-block";
      captionDiv.style.height = "100%";
      captionDiv.style.width = "100%";
      let options = {
        theme: "vs-dark",
        originalEditable: false,
        automaticLayout: true
      };
      this._editor = monaco.editor.createDiffEditor(captionDiv, options);
      this._editor.onDidUpdateDiff(() => {
        if (typeof this.onChange === "function")
          this.onChange(this);
      });
    }
    if (!this._modifiedModel || !this._originalModel) {
      let model;
      if (fileName == null ? void 0 : fileName.endsWith(".tsx")) {
        model = monaco.editor.createModel(content || value || "", "typescript");
      } else
        model = monaco.editor.createModel(content || value || "", language || this._language || "typescript");
      type === 0 ? this._modifiedModel = model : this._originalModel = model;
      if (this._originalModel && this._modifiedModel) {
        this._editor.setModel({
          original: this._originalModel,
          modified: this._modifiedModel
        });
      }
    } else {
      let model = this.getModel(type);
      if (model)
        monaco.editor.setModelLanguage(model, language);
      this.getEditor(type).setValue(content);
    }
  }
  updateOptions(options) {
    this.editor.updateOptions(options);
  }
  get originalValue() {
    if (this.editor)
      return this.editor.getOriginalEditor().getValue();
    else
      return this._originalValue;
  }
  set originalValue(value) {
    this._originalValue = value;
    if (this.editor) {
      this.editor.getOriginalEditor().setValue(value);
    } else
      this.loadContent(1);
  }
  get modifiedValue() {
    if (this.editor)
      return this.editor.getModifiedEditor().getValue();
    else
      return this._modifiedValue;
  }
  set modifiedValue(value) {
    this._modifiedValue = value;
    if (this.editor) {
      this.editor.getModifiedEditor().setValue(value);
    } else {
      this.loadContent(0);
    }
  }
};
CodeDiffEditor.addLib = addLib;
CodeDiffEditor.addFile = addFile;
CodeDiffEditor.getFileModel = getFileModel;
CodeDiffEditor.updateFile = updateFile;
CodeDiffEditor = __decorateClass([
  customElements2("i-code-diff-editor")
], CodeDiffEditor);

// packages/combo-box/src/style/combo-box.css.ts
var Theme7 = theme_exports.ThemeVars;
var ItemListStyle = style({
  display: "none",
  position: "absolute",
  margin: "0.05rem 0 0",
  backgroundColor: "#fff",
  border: "1px solid rgba(0,0,0,.15)",
  borderRadius: "0.25rem",
  zIndex: "99999",
  $nest: {
    "> ul": {
      maxHeight: "100px",
      overflowY: "scroll",
      overflowX: "hidden",
      listStyle: "none",
      margin: 0,
      padding: 0
    },
    "> ul > li": {
      display: "block",
      width: "100%",
      padding: "0.25rem 0.5rem",
      backgroundColor: "transparent",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      cursor: "pointer"
    },
    "> ul > li .highlight": {
      backgroundColor: Theme7.colors.warning.light
    },
    "> ul > li.matched": {
      backgroundColor: Theme7.colors.primary.light
    },
    "> ul > li:hover": {
      backgroundColor: Theme7.colors.primary.light
    }
  }
});
cssRule("i-combo-box", {
  position: "relative",
  display: "flex",
  fontFamily: Theme7.typography.fontFamily,
  fontSize: Theme7.typography.fontSize,
  color: Theme7.text.primary,
  alignItems: "center",
  $nest: {
    "&.i-combo-box-multi": {
      height: "auto !important"
    },
    "> .icon-btn": {
      display: "inline-flex",
      flexWrap: "nowrap",
      whiteSpace: "nowrap",
      backgroundColor: Theme7.action.focus,
      padding: "8px",
      marginLeft: "-1px",
      borderRadius: "0 3px 3px 0",
      cursor: "pointer",
      height: "100%",
      alignItems: "center",
      position: "absolute",
      right: 0
    },
    "> .icon-btn:hover": {
      backgroundColor: Theme7.action.hover
    },
    "> .icon-btn i-icon": {
      display: "inline-block",
      width: "12px",
      height: "12px"
    },
    ".selection": {
      display: "inline-flex",
      alignItems: "center",
      flexWrap: "wrap",
      maxWidth: "calc(100% - 32px)",
      height: "100%",
      border: `1px solid ${Theme7.divider}`,
      backgroundColor: "#fff",
      borderRadius: "3px 0 0 3px",
      padding: "2px 4px",
      transition: "all .3s cubic-bezier(.645,.045,.355,1)",
      gap: 5,
      flexGrow: 1,
      $nest: {
        ".selection-item": {
          border: `1px solid ${Theme7.divider}`,
          backgroundColor: Theme7.action.selected,
          color: Theme7.divider,
          borderRadius: 3,
          display: "inline-flex",
          alignItems: "center",
          padding: "3px 5px",
          gap: 4,
          maxWidth: "clamp(100px, 50%, 200px)",
          userSelect: "none",
          $nest: {
            ".close-icon": {
              cursor: "pointer",
              opacity: "0.5"
            },
            ".close-icon:hover": {
              opacity: 1
            },
            "> span:first-child": {
              display: "inline-block",
              overflow: "hidden",
              whiteSpace: "pre",
              textOverflow: "ellipsis"
            }
          }
        },
        "input": {
          padding: "1px 0.5rem",
          border: "none",
          boxShadow: "none",
          outline: "none",
          width: "auto !important",
          maxWidth: "100%",
          flex: 1
        }
      }
    }
  }
});

// packages/combo-box/src/combo-box.ts
var defaultIcon2 = {
  width: 16,
  height: 16,
  fill: theme_exports.ThemeVars.text.primary
};
var ComboBox = class extends Control {
  constructor(parent, options) {
    super(parent, options, {
      mode: "single"
    });
    this.newItem = null;
    this.isListShown = false;
  }
  get value() {
    return this.selectedItem;
  }
  set value(value) {
  }
  get selectedItem() {
    return this._selectedItem;
  }
  set selectedItem(value) {
    let isValueValid = false;
    let validValue;
    if (this.isMulti) {
      const formattedValue = Array.isArray(value) ? value : [value];
      validValue = formattedValue.filter((item) => this.isValueValid(item));
      isValueValid = !!validValue.length;
    } else {
      validValue = value;
      isValueValid = this.isValueValid(value);
    }
    if (isValueValid) {
      this._selectedItem = validValue;
      if (Array.isArray(this._selectedItem)) {
        this.inputElm.value = "";
        const selectionItems = Array.from(this.inputWrapElm.querySelectorAll(".selection-item"));
        selectionItems.forEach((elm) => this.inputWrapElm.removeChild(elm));
        this._selectedItem.forEach((item) => {
          const itemElm = this.createElement("div");
          itemElm.classList.add("selection-item");
          const content = this.createElement("span", itemElm);
          content.textContent = item.label;
          itemElm.appendChild(content);
          const closeButton = this.createElement("span", itemElm);
          closeButton.classList.add("close-icon");
          closeButton.innerHTML = "&times;";
          closeButton.addEventListener("click", (event) => this.handleRemove(event, item));
          this.inputWrapElm.appendChild(itemElm);
          this.inputWrapElm.insertBefore(itemElm, this.inputElm);
        });
      } else {
        this.inputElm.value = this._selectedItem.label;
      }
      if (this.callback)
        this.callback(value);
    } else if (this.isMulti) {
      this._selectedItem = validValue;
      this.inputElm.value = "";
      const selectionItems = Array.from(this.inputWrapElm.querySelectorAll(".selection-item"));
      selectionItems.forEach((elm) => this.inputWrapElm.removeChild(elm));
    }
  }
  get caption() {
    return this._caption;
  }
  set caption(value) {
    this._caption = value;
    this.labelElm.innerHTML = this._caption || "";
    if (!value)
      this.labelElm.style.display = "none";
    else
      this.labelElm.style.display = "";
  }
  get captionWidth() {
    return this._captionWidth;
  }
  set captionWidth(value) {
    this._captionWidth = value;
    this.setElementPosition(this.labelElm, "width", value);
  }
  get items() {
    return this._items;
  }
  set items(items) {
    this._items = items;
  }
  get icon() {
    if (!this._icon) {
      this._icon = new Icon(void 0, defaultIcon2);
      if (this.iconElm)
        this.iconElm.appendChild(this._icon);
    }
    return this._icon;
  }
  set icon(value) {
    if (this.iconElm) {
      if (this._icon && this.iconElm.contains(this._icon))
        this.iconElm.removeChild(this._icon);
      this._icon = value;
      if (this._icon)
        this.iconElm.appendChild(this._icon);
    }
  }
  get searchStr() {
    return this._searchStr;
  }
  set searchStr(str) {
    if (str === null)
      str = "";
    this._searchStr = str;
  }
  get placeholder() {
    return this.inputElm.placeholder;
  }
  set placeholder(value) {
    this.inputElm.placeholder = value;
  }
  get mode() {
    return this._mode;
  }
  set mode(value) {
    this._mode = value;
    if (this.isMulti)
      this.classList.add("i-combo-box-multi");
    else
      this.classList.remove("i-combo-box-multi");
  }
  get isMulti() {
    return this.mode === "tags" || this.mode === "multiple";
  }
  isValueValid(value) {
    if (!value)
      return false;
    const index = this.getItemIndex(this.items, value);
    return index >= 0;
  }
  getItemIndex(items, item) {
    const value = item == null ? void 0 : item.value.toString();
    if (!value)
      return -1;
    const index = items.findIndex((_item) => {
      return _item.value.toString().toLowerCase() === value.toLowerCase();
    });
    return index;
  }
  openList() {
    this.isListShown = true;
    window.document.body.append(this.listElm);
    this.listElm.classList.add("show");
    this.listElm.style.display = "block";
    this.calculatePositon();
    if (!this.searchStr)
      this.renderItems();
  }
  calculatePositon() {
    let parentElement = this.linkTo || this;
    let rect = parentElement.getBoundingClientRect();
    const scrollTop = document.documentElement.scrollTop || window.pageYOffset;
    const scrollLeft = document.documentElement.scrollLeft || window.pageXOffset;
    const top = rect.top + scrollTop + rect.height;
    const left = rect.left + scrollLeft + this.captionSpanElm.offsetWidth;
    const width = rect.right - rect.left - this.captionSpanElm.offsetWidth;
    this.listElm.style.top = top + "px";
    this.listElm.style.left = left + "px";
    this.listElm.style.width = width + "px";
  }
  closeList() {
    var _a;
    this.isListShown = false;
    this.listElm.remove();
    this.listElm.style.display = "none";
    this.listElm.classList.remove("show");
    this.searchStr = "";
    if (this.isMulti || Array.isArray(this.selectedItem))
      return;
    const label = (_a = this.selectedItem) == null ? void 0 : _a.label;
    if (label && this.inputElm)
      this.inputElm.value = label;
  }
  toggleList() {
    this.isListShown ? this.closeList() : this.openList();
  }
  escapeRegExp(text) {
    return text ? text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") : text;
  }
  renderItems() {
    if (this.mode === "tags" && this.newItem) {
      const liElm = this.listElm.querySelector(`li[data-key="${this.newItem.value}"]`);
      if (liElm) {
        if (this.searchStr) {
          liElm.classList.add("matched");
          liElm.innerHTML = `<span class="highlight">${this.searchStr}</span>`;
          this.newItem.label = this.searchStr;
          return;
        } else {
          liElm.remove();
          this.newItem = null;
        }
      }
    }
    const regExp = new RegExp(this.escapeRegExp(this.searchStr), "g");
    this.listElm.innerHTML = "";
    if (this.searchStr)
      this.openList();
    const ulElm = this.createElement("ul", this.listElm);
    for (let item of this.items) {
      const label = item.label;
      if (!this.searchStr || label.toLowerCase().includes(this.searchStr.toLowerCase())) {
        const liElm = this.createElement("li", ulElm);
        liElm.setAttribute("data-key", item.value);
        liElm.addEventListener("click", (event) => {
          event.stopPropagation();
          this.onItemClick(liElm, item);
        });
        if (Array.isArray(this.selectedItem)) {
          const index = this.getItemIndex(this.selectedItem, item);
          if (index >= 0)
            liElm.classList.add("matched");
        } else if (item === this.selectedItem) {
          liElm.classList.add("matched");
        }
        const displayItem = this.searchStr ? label.replace(regExp, `<span class="highlight">${this.searchStr}</span>`) : label;
        liElm.innerHTML = displayItem;
      }
    }
    if (!ulElm.innerHTML) {
      if (this.mode === "tags" && !this.newItem) {
        this.newItem = {
          value: new Date().getTime().toString(),
          label: this.searchStr
        };
        this.add(this.newItem, ulElm);
        return;
      } else {
        ulElm.innerHTML = '<li style="text-align:center;">No data</li>';
      }
    }
  }
  add(item, parent) {
    const liElm = this.createElement("li", parent);
    liElm.setAttribute("data-key", item.value);
    liElm.addEventListener("click", (event) => {
      event.stopPropagation();
      this.onItemClick(liElm, item);
    });
    liElm.classList.add("matched");
    liElm.innerHTML = `<span class="highlight">${this.searchStr}</span>`;
  }
  handleRemove(event, item) {
    event.stopPropagation();
    if (!this.enabled)
      return;
    const liElm = this.listElm.querySelector(`li[data-key="${item.value}"]`);
    if (liElm) {
      liElm.classList.remove("matched");
      if (this.mode === "tags" && item.isNew) {
        liElm.remove();
        this.items = this.items.filter((data) => data.value !== item.value);
      }
    }
    const selectedItem = this.selectedItem;
    const selectedIndex = this.getItemIndex(selectedItem, item);
    if (selectedIndex >= 0)
      selectedItem.splice(selectedIndex, 1);
    this.selectedItem = selectedItem;
    if (this.onChanged && typeof this.onChanged === "function")
      this.onChanged(this, this.selectedItem);
  }
  onItemClick(liElm, item) {
    var _a;
    if (((_a = this.newItem) == null ? void 0 : _a.value) === item.value) {
      item = __spreadProps(__spreadValues({}, this.newItem), { isNew: true });
      this.items.push(item);
      this.newItem = null;
    }
    if (Array.isArray(this.selectedItem)) {
      const index = this.getItemIndex(this.selectedItem, item);
      const selectedItem = this.selectedItem;
      if (index >= 0) {
        selectedItem.splice(index, 1);
      } else {
        selectedItem.push(item);
      }
      this.selectedItem = selectedItem;
      liElm.classList.toggle("matched");
      this.closeList();
    } else {
      this.selectedItem = item;
      this.closeList();
    }
    if (this.onChanged && typeof this.onChanged === "function")
      this.onChanged(this, this.selectedItem);
  }
  clear() {
    if (this.isMulti) {
      this._selectedItem = [];
    } else {
      this._selectedItem = void 0;
    }
    this.inputElm.value = "";
  }
  init() {
    if (!this.inputElm) {
      this.callback = this.getAttribute("parentCallback", true);
      const placeholder = this.getAttribute("placeholder", true);
      this.mode = this.getAttribute("mode", true);
      this.items = this.getAttribute("items", true, []);
      this.captionSpanElm = this.createElement("span", this);
      this.labelElm = this.createElement("label", this.captionSpanElm);
      this.inputWrapElm = this.createElement("div", this);
      this.inputWrapElm.classList.add("selection");
      this.inputElm = this.createElement("input", this.inputWrapElm);
      const disabled = this.getAttribute("enabled") === false;
      this.inputElm.disabled = disabled;
      this.inputElm.addEventListener("click", (e) => {
        this.openList();
        if (this.onClick)
          this.onClick(this, e);
      });
      this.inputElm.addEventListener("keyup", () => {
        this.searchStr = this.inputElm.value;
        this.renderItems();
      });
      this.inputWrapElm.appendChild(this.inputElm);
      placeholder && (this.placeholder = placeholder);
      this.iconElm = this.createElement("span", this);
      this.iconElm.classList.add("icon-btn");
      this.iconElm.addEventListener("click", () => {
        if (!this._enabled)
          return false;
        this.toggleList();
      });
      let iconAttr = this.getAttribute("icon", true);
      if (iconAttr) {
        iconAttr = __spreadValues(__spreadValues({}, defaultIcon2), iconAttr);
        const icon = new Icon(void 0, iconAttr);
        this.icon = icon;
      }
      this.selectedItem = this.getAttribute("selectedItem", true);
      this.listElm = this.createElement("div");
      this.listElm.classList.add(ItemListStyle);
      this.listElm.classList.add("item-list");
      this.renderItems();
      document.addEventListener("click", (e) => {
        if (!this._enabled)
          return false;
        if (!this.contains(e.target))
          this.closeList();
      });
      super.init();
      window.addEventListener("resize", this.calculatePositon.bind(this));
    }
  }
  disconnectCallback() {
    window.removeEventListener("resize", this.calculatePositon.bind(this));
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
ComboBox = __decorateClass([
  customElements2("i-combo-box")
], ComboBox);

// packages/datepicker/src/style/datepicker.css.ts
var Theme8 = theme_exports.ThemeVars;
cssRule("i-datepicker", {
  display: "inline-block",
  fontFamily: Theme8.typography.fontFamily,
  fontSize: Theme8.typography.fontSize,
  "$nest": {
    "*": {
      boxSizing: "border-box"
    },
    "> span": {
      overflow: "hidden"
    },
    "> span > label": {
      boxSizing: "border-box",
      color: Theme8.text.primary,
      display: "inline-block",
      overflow: "hidden",
      whiteSpace: "nowrap",
      verticalAlign: "middle",
      textAlign: "right",
      paddingRight: 4,
      height: "100%"
    },
    "> input": {
      padding: "1px 0.5rem",
      border: `0.5px solid ${Theme8.divider}`,
      boxSizing: "border-box",
      outline: "none"
    },
    "> input[type=text]:focus": {
      borderColor: Theme8.colors.info.main
    },
    "i-icon": {
      fill: Theme8.colors.primary.contrastText
    },
    ".datepicker-toggle": {
      display: "inline-block",
      position: "relative",
      verticalAlign: "middle",
      backgroundColor: "#6c757d",
      padding: "7px",
      marginLeft: "-1px",
      marginTop: "-1px",
      borderRadius: "0 3px 3px 0",
      cursor: "pointer"
    },
    "> .datepicker-toggle:hover": {
      backgroundColor: "#545b62"
    },
    ".datepicker": {
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      border: 0,
      padding: 0,
      opacity: 0,
      cursor: "pointer"
    },
    ".datepicker::-webkit-calendar-picker-indicator": {
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      margin: 0,
      padding: 0,
      cursor: "pointer"
    }
  }
});

// packages/datepicker/src/datepicker.ts
var defaultCaptionWidth = 40;
var Datepicker = class extends Control {
  constructor(parent, options) {
    super(parent, options, {
      captionWidth: defaultCaptionWidth,
      height: 25,
      width: 100
    });
    this._onDatePickerChange = (event) => {
      const _datepicker = event.target;
      const pickerValue = _datepicker.value;
      RequireJS.require([`${LibPath}lib/moment/2.29.1/moment.js`], (moment) => {
        let _moment = this._type === "time" ? moment(pickerValue, "HH:mm") : moment(pickerValue);
        if (_moment.isValid()) {
          this.inputElm.value = _moment.format(this.dateTimeFormat || this.defaultDateFormat);
        } else {
          this.inputElm.value = "";
          _datepicker.value = "";
        }
        if (this.onChanged)
          this.onChanged(this, event);
      });
      if (this.callback)
        this.callback(this.inputElm.value);
    };
    this._dateInputMask = (event) => {
      const key2 = event.key;
      const isNumeric = key2 != " " && !isNaN(Number(key2));
      const separator = this._type === "time" ? ":" : "/";
      if (!isNumeric) {
        event.preventDefault();
      }
      var len = this.inputElm.value.length;
      if (len === 2) {
        this.inputElm.value += separator;
      }
      if (this._type !== "time" && len === 5) {
        this.inputElm.value += separator;
      }
      if (this._type === "dateTime") {
        if (len === 10) {
          this.inputElm.value += " ";
        }
        if (len === 13) {
          this.inputElm.value += ":";
        }
      }
    };
    this._onFocus = () => {
      this.inputElm.placeholder = this.defaultDateFormat;
      if (!this.inputElm.value)
        return;
      if (this.dateTimeFormat) {
        RequireJS.require([`${LibPath}lib/moment/2.29.1/moment.js`], (moment) => {
          let _moment = moment(this.inputElm.value, this.dateTimeFormat, true);
          if (_moment.isValid()) {
            this.inputElm.value = _moment.format(this.defaultDateFormat);
          }
        });
      }
    };
    this._isValidDateFormat = () => {
      this.inputElm.placeholder = this._placeholder || "";
      if (!this.inputElm.value) {
        this.datepickerElm.value = "";
        if (this.callback) {
          this.callback("");
        }
        return;
      }
      ;
      RequireJS.require([`${LibPath}lib/moment/2.29.1/moment.js`], (moment) => {
        let _moment = moment(this.inputElm.value, this.defaultDateFormat, true);
        let isValid = _moment.isValid();
        if (isValid) {
          if (this.dateTimeFormat) {
            this.inputElm.value = _moment.format(this.dateTimeFormat);
          }
          this.datepickerElm.value = _moment.format(this.datepickerFormat);
        } else {
          this._value = "";
          this.inputElm.value = "";
          this.datepickerElm.value = "";
        }
        if (this.onChanged)
          this.onChanged(this, this.inputElm.value);
      });
      if (this.callback)
        this.callback(this.inputElm.value);
    };
  }
  _handleClick(event) {
    return super._handleClick(event, true);
  }
  get caption() {
    return this._caption;
  }
  set caption(value) {
    this._caption = value;
    this.labelElm.textContent = this._caption || "";
    if (!value)
      this.labelElm.style.display = "none";
    else
      this.labelElm.style.display = "";
  }
  get captionWidth() {
    return this.labelElm.offsetWidth;
  }
  set captionWidth(value) {
    this._captionWidth = value;
    this.setElementPosition(this.labelElm, "width", value);
    const width = typeof this.width === "string" ? this.width : `${this.width}px`;
    const captionWidth = typeof this.captionWidth === "string" ? this.captionWidth : `${this.captionWidth}px`;
    const iconWidth = `${this._iconWidth || 0}px`;
    this.inputElm.style.width = `calc(${width} - ${captionWidth} - ${iconWidth})`;
  }
  get height() {
    return this.offsetHeight;
  }
  set height(value) {
    if (typeof value == "string")
      value = parseInt(value);
    this._height = value;
    this.inputElm.style.height = value + "px";
  }
  get width() {
    return this.offsetWidth;
  }
  set width(value) {
    this._width = value;
    this.style.width = value + "px";
    const width = typeof this._width === "string" ? this._width : `${this._width}px`;
    const captionWidth = typeof this._captionWidth === "string" ? this._captionWidth : `${this._captionWidth}px`;
    const iconWidth = `${this._iconWidth || 0}px`;
    this.inputElm.style.width = `calc(${width} - ${captionWidth} - ${iconWidth})`;
  }
  get value() {
    return this._value;
  }
  set value(value) {
    if (value == null)
      value = "";
    this._value = value;
    this.inputElm.value = value;
    this._isValidDateFormat();
  }
  get defaultDateFormat() {
    switch (this._type) {
      case "date":
        return "DD/MM/YYYY";
      case "dateTime":
        return "DD/MM/YYYY HH:mm";
      case "time":
        return "HH:mm";
    }
  }
  get dateTimeFormat() {
    return this._dateTimeFormat;
  }
  set dateTimeFormat(format) {
    this._dateTimeFormat = format;
  }
  get datepickerFormat() {
    switch (this._type) {
      case "date":
        return "YYYY-MM-DD";
      case "dateTime":
        return "YYYY-MM-DDTHH:mm";
      case "time":
        return "HH:mm";
    }
  }
  get maxLength() {
    switch (this._type) {
      case "date":
        return 10;
      case "dateTime":
        return 16;
      case "time":
        return 5;
    }
  }
  set enabled(value) {
    this.inputElm.disabled = !value;
    this.datepickerElm.disabled = !value;
  }
  init() {
    if (!this.captionSpanElm) {
      this.callback = this.getAttribute("parentCallback", true);
      this._placeholder = this.getAttribute("placeholder", true) || "";
      this.dateTimeFormat = this.getAttribute("dateTimeFormat", true) || "";
      this._type = this.getAttribute("type", true) || "date";
      this._iconWidth = this.getAttribute("height", true);
      this.captionSpanElm = this.createElement("span", this);
      this.labelElm = this.createElement("label", this.captionSpanElm);
      this.inputElm = this.createElement("input", this);
      this.inputElm.setAttribute("type", "text");
      this.inputElm.setAttribute("autocomplete", "disabled");
      this.inputElm.style.height = this.height + "px";
      this.inputElm.placeholder = this._placeholder;
      this.inputElm.maxLength = this.maxLength;
      this.inputElm.addEventListener("keypress", this._dateInputMask);
      this.inputElm.onfocus = this._onFocus;
      this.inputElm.onblur = this._isValidDateFormat;
      this.inputElm.pattern = this.dateTimeFormat || this.defaultDateFormat;
      this.toggleElm = this.createElement("span", this);
      this.toggleElm.classList.add("datepicker-toggle");
      this.toggleElm.style.width = this._iconWidth + "px";
      this.toggleElm.style.height = this._iconWidth + "px";
      this.toggleIconElm = new Icon(this, {
        name: this._type === "time" ? "clock" : "calendar",
        width: 12,
        height: 12,
        fill: theme_exports.ThemeVars.text.primary
      });
      this.toggleElm.appendChild(this.toggleIconElm);
      this.datepickerElm = this.createElement("input");
      const inputType = this._type === "dateTime" ? "datetime-local" : this._type;
      this.datepickerElm.setAttribute("type", inputType);
      this.datepickerElm.classList.add("datepicker");
      this.datepickerElm.addEventListener("change", (event) => {
        event.stopPropagation();
        this._onDatePickerChange(event);
      });
      this.toggleElm.appendChild(this.datepickerElm);
      this.captionWidth = this.getAttribute("captionWidth", true, defaultCaptionWidth);
      this.caption = this.getAttribute("caption", true);
      super.init();
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
__decorateClass([
  observable("value")
], Datepicker.prototype, "_value", 2);
Datepicker = __decorateClass([
  customElements2("i-datepicker")
], Datepicker);

// packages/range/src/style/range.css.ts
var Theme9 = theme_exports.ThemeVars;
cssRule("i-range", {
  position: "relative",
  display: "inline-block",
  fontFamily: Theme9.typography.fontFamily,
  fontSize: Theme9.typography.fontSize,
  "$nest": {
    "*": {
      boxSizing: "border-box"
    },
    "> span": {
      overflow: "hidden"
    },
    "> span > label": {
      boxSizing: "border-box",
      color: Theme9.text.primary,
      display: "inline-block",
      overflow: "hidden",
      whiteSpace: "nowrap",
      verticalAlign: "middle",
      textAlign: "right",
      paddingRight: 4,
      height: "100%"
    },
    ".slider": {
      position: "relative",
      display: "inline-block"
    },
    'input[type="range"]': {
      "-webkit-appearance": "none",
      appearance: "none",
      background: "#d3d3d3",
      backgroundImage: `linear-gradient(${Theme9.colors.info.main}, ${Theme9.colors.info.main})`,
      backgroundSize: "0% 100%",
      backgroundRepeat: "no-repeat !important",
      borderRadius: "0.5rem",
      opacity: 0.7,
      border: 0,
      margin: 0,
      width: "inherit",
      boxSizing: "border-box",
      outline: "none",
      verticalAlign: "middle"
    },
    'input[type="range"]:not(:disabled)': {
      cursor: "pointer"
    },
    'input[type="range"]:hover': {
      opacity: 1
    },
    'input[type="range"]:focus': {
      outline: "none"
    },
    'input[type="range"]::-webkit-slider-runnable-track': {
      "-webkit-appearance": "none",
      boxShadow: "none",
      border: "none",
      background: "transparent",
      borderRadius: "0.5rem",
      height: "0.3rem",
      marginLeft: "-6.5px",
      marginRight: "-6.5px"
    },
    'input[type="range"]::-webkit-slider-thumb': {
      "-webkit-appearance": "none",
      appearance: "none",
      marginTop: "-5px",
      backgroundColor: Theme9.colors.info.main,
      borderRadius: "0.5rem",
      height: "1rem",
      width: "1rem"
    },
    ".range-labels": {
      display: "flex",
      justifyContent: "space-between",
      height: "auto",
      overflow: "hidden",
      listStyle: "none"
    },
    ".range-labels li": {
      padding: "0 0.25rem"
    },
    '&.--step input[type="range"]': {
      opacity: 1,
      $nest: {
        "&::-webkit-slider-runnable-track": {
          zIndex: 2
        },
        "&::-webkit-slider-thumb": {
          zIndex: 2
        }
      }
    },
    ".slider-step": {
      position: "absolute",
      zIndex: 0,
      top: 2,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "transparent"
    },
    ".step-dot": {
      position: "relative",
      zIndex: 1,
      display: "flex",
      justifyContent: "center",
      width: "3px",
      height: "10px",
      backgroundColor: "#a7a9ac"
    },
    ".tooltip": {
      visibility: "hidden",
      minWidth: 35,
      maxWidth: 70,
      overflowWrap: "break-word",
      backgroundColor: "rgba(0, 0, 0, 0.78)",
      color: "#fff",
      textAlign: "center",
      borderRadius: "6px",
      padding: "8px",
      position: "absolute",
      zIndex: 1,
      bottom: "150%",
      left: "0%",
      marginLeft: "-20px",
      opacity: 0,
      transition: "opacity 0.3s",
      $nest: {
        "&::after": {
          content: "''",
          position: "absolute",
          top: "100%",
          left: "50%",
          marginLeft: "-5px",
          borderWidth: "5px",
          borderStyle: "solid",
          borderColor: "rgba(0, 0, 0, 0.78) transparent transparent transparent"
        }
      }
    },
    'input[type="range"]:hover + .tooltip': {
      visibility: "visible",
      opacity: 1
    }
  }
});

// packages/range/src/range.ts
var defaultCaptionWidth2 = 40;
var Range = class extends Control {
  constructor(parent, options) {
    super(parent, options, {
      height: 25,
      width: 100
    });
  }
  get caption() {
    return this._caption;
  }
  set caption(value) {
    this._caption = value;
    this.labelElm.textContent = this._caption || "";
    if (!value)
      this.labelElm.style.display = "none";
    else
      this.labelElm.style.display = "";
  }
  get captionWidth() {
    return this.labelElm.offsetWidth;
  }
  set captionWidth(value) {
    this._captionWidth = value;
    this.setElementPosition(this.labelElm, "width", value);
    const width = typeof this.width === "string" ? this.width : `${this.width}px`;
    const captionWidth = typeof this.captionWidth === "string" ? this.captionWidth : `${this.captionWidth}px`;
    this.inputContainerElm.style.width = `calc(${width} - ${captionWidth})`;
  }
  get height() {
    return this.offsetHeight;
  }
  set height(value) {
    if (typeof value == "string")
      value = parseInt(value);
    this._height = value;
  }
  get value() {
    return this._value;
  }
  set value(value) {
    if (value == null)
      value = this.inputElm.min;
    this._value = value;
    this.inputElm.value = value;
    const min = Number(this.inputElm.min);
    const max = Number(this.inputElm.max);
    this.inputElm.style.backgroundSize = (this._value - min) * 100 / (max - min) + "% 100%";
    this.onUpdateTooltip(false);
    if (this.callback) {
      this.callback(value);
    }
  }
  get width() {
    return this.offsetWidth;
  }
  set width(value) {
    this._width = value;
    this.style.width = value + "px";
    const width = typeof this.width === "string" ? this.width : `${this.width}px`;
    const captionWidth = typeof this.captionWidth === "string" ? this.captionWidth : `${this.captionWidth}px`;
    this.inputContainerElm.style.width = `calc(${width} - ${captionWidth})`;
  }
  get _ratio() {
    var min = this.inputElm.min === "" ? 0 : parseInt(this.inputElm.min);
    var max = this.inputElm.max === "" ? 100 : parseInt(this.inputElm.max);
    return (this.value - min) / (max - min);
  }
  set enabled(value) {
    this.inputElm.disabled = !value;
  }
  get tooltipVisible() {
    return this._tooltipVisible;
  }
  set tooltipVisible(value) {
    this._tooltipVisible = value;
    this.tooltipElm.style.display = value ? "block" : "none";
  }
  onSliderChange() {
    this.value = this.inputElm.value;
    const min = Number(this.inputElm.min);
    const max = Number(this.inputElm.max);
    this.inputElm.style.backgroundSize = (this._value - min) * 100 / (max - min) + "% 100%";
    if (this.onChanged)
      this.onChanged(this, this.value);
    this.onUpdateTooltip(false);
  }
  onUpdateTooltip(init) {
    let inputValue = this._value;
    let formattedValue = this.tooltipFormatter ? this.tooltipFormatter(inputValue) : inputValue;
    const min = Number(this.inputElm.min);
    const max = Number(this.inputElm.max);
    if (init) {
      this.tooltipElm.style.marginLeft = `-${this.tooltipElm.clientWidth / 2}px`;
    }
    this.tooltipElm.innerHTML = formattedValue;
    this.tooltipElm.style.left = (this._value - min) * 100 / (max - min) + "%";
  }
  init() {
    if (!this.captionSpanElm) {
      this.callback = this.getAttribute("parentCallback", true);
      const min = this.getAttribute("min", true, 0);
      const max = this.getAttribute("max", true, 100);
      const step = this.getAttribute("step", true, 0);
      const stepDots = this.getAttribute("stepDots", true);
      const tooltipVisible = this.getAttribute("tooltipVisible", true, false);
      const formatter = this.getAttribute("tooltipFormatter", true) || this.tooltipFormatter;
      this.tooltipFormatter = formatter;
      this.captionSpanElm = this.createElement("span", this);
      this.labelElm = this.createElement("label", this.captionSpanElm);
      this.inputContainerElm = this.createElement("div", this);
      this.inputContainerElm.classList.add("slider");
      this.inputElm = this.createElement("input", this.inputContainerElm);
      this.inputElm.setAttribute("autocomplete", "disabled");
      this.inputElm.type = "range";
      this.inputElm.min = min;
      this.inputElm.max = max;
      if (step !== 0) {
        this.inputElm.step = step;
      }
      this.inputElm.addEventListener("input", this.onSliderChange.bind(this));
      if (this.onMouseUp)
        this.inputElm.addEventListener("mouseup", () => {
          this.onMouseUp(this, this.value);
        });
      if (this.onKeyUp)
        this.inputElm.addEventListener("keyup", (e) => {
          const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "PageUp", "PageDown"];
          if (keys.includes(e.key))
            this.onMouseUp(this, this.value);
        });
      this.tooltipElm = this.createElement("span", this.inputContainerElm);
      this.tooltipElm.classList.add("tooltip");
      this.tooltipVisible = tooltipVisible || this.tooltipFormatter || false;
      if (stepDots) {
        this.classList.add("--step");
        const stepContainer = this.createElement("div", this);
        stepContainer.classList.add("slider-step");
        if (this.caption) {
          stepContainer.style.width = Number(this._width) - this.captionWidth + "px";
          stepContainer.style.marginLeft = this.captionWidth + "px";
        } else {
          stepContainer.style.width = "100%";
        }
        const dotNums = typeof stepDots === "boolean" ? (max - min) / (step || 1) + 1 : stepDots;
        for (let i = 0; i < dotNums; i++) {
          const dotElm = this.createElement("span", stepContainer);
          dotElm.classList.add("step-dot");
        }
      }
      this.captionWidth = this.getAttribute("captionWidth", true) || defaultCaptionWidth2;
      this.caption = this.getAttribute("caption", true);
      this.value = this.getAttribute("value", true);
      if (this._value > 0) {
        this.inputElm.style.backgroundSize = (this._value - min) * 100 / (max - min) + "% 100%";
      }
      this.onUpdateTooltip(true);
      super.init();
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
__decorateClass([
  observable("value")
], Range.prototype, "_value", 2);
Range = __decorateClass([
  customElements2("i-range")
], Range);

// packages/radio/src/radio.css.ts
var Theme10 = theme_exports.ThemeVars;
var captionStyle = style({
  fontFamily: Theme10.typography.fontFamily,
  fontSize: Theme10.typography.fontSize,
  "$nest": {
    "span": {
      color: Theme10.text.primary
    }
  }
});

// packages/radio/src/radio.ts
var defaultCaptionWidth3 = 40;
var Radio = class extends Control {
  constructor(parent, options) {
    super(parent, options, {
      captionWidth: defaultCaptionWidth3,
      height: 25,
      width: 100
    });
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value || "";
    this.inputElm.value = value;
  }
  get caption() {
    return this._caption;
  }
  set caption(value) {
    this._caption = value;
    if (!value)
      this.captionSpanElm.style.display = "none";
    else
      this.captionSpanElm.style.display = "";
    this.captionSpanElm && (this.captionSpanElm.textContent = value);
  }
  get captionWidth() {
    return this._captionWidth;
  }
  set captionWidth(value) {
    this._captionWidth = value;
    this.setElementPosition(this.captionSpanElm, "width", value);
  }
  addClass(value) {
    if (value)
      this.classList.add("is-checked");
    else
      this.classList.remove("is-checked");
  }
  get checked() {
    return this.inputElm.checked;
  }
  set checked(value) {
    this.inputElm.checked = value;
    this.addClass(value);
  }
  init() {
    if (!this.initialized) {
      super.init();
      this.classList.add(captionStyle);
      this.labelElm = this.createElement("label", this);
      this.labelElm.classList.add("i-radio");
      this.inputElm = this.createElement("input", this.labelElm);
      this.inputElm.type = "radio";
      const checkAttr = this.getAttribute("checked", true, false);
      this.inputElm.checked = checkAttr;
      this.addClass(checkAttr);
      const disabled = this.getAttribute("enabled") === false;
      this.inputElm.disabled = disabled;
      this.value = this.getAttribute("value");
      this.captionSpanElm = this.createElement("span", this.labelElm);
      this.captionSpanElm.classList.add("i-radio_label");
      this.caption = this.getAttribute("caption", true, "");
      this.captionWidth = this.getAttribute("captionWidth", true, defaultCaptionWidth3);
      this.labelElm.style.color = theme_exports.ThemeVars.text.primary;
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
__decorateClass([
  observable("value")
], Radio.prototype, "_value", 2);
Radio = __decorateClass([
  customElements2("i-radio")
], Radio);
var RadioGroup = class extends Control {
  constructor(parent, options) {
    super(parent, options);
    this._group = [];
  }
  get selectedValue() {
    return this._selectedValue;
  }
  set selectedValue(value) {
    this._group.forEach((item) => {
      if (item.value === value) {
        this._selectedValue = value;
        item.checked = true;
      } else {
        item.checked = false;
      }
    });
  }
  get radioItems() {
    return this._radioItems;
  }
  set radioItems(value) {
    this._radioItems = value;
    this.renderUI();
  }
  renderUI() {
    this.clearInnerHTML();
    this._group = [];
    this.name = new Date().getTime().toString();
    this.radioItems.forEach((item) => {
      const elm = new Radio(this, item);
      this.appendItem(elm);
    });
  }
  appendItem(elm) {
    this.appendChild(elm);
    elm.onClick = this._handleChange.bind(this);
    const inputElm = elm.getElementsByTagName("input")[0];
    inputElm && inputElm.setAttribute("name", this.name);
    this._group.push(elm);
  }
  _handleChange(source, event) {
    const selectedValue = this.selectedValue;
    const value = source.value;
    this._selectedValue = value;
    const radioElm = this.querySelector("i-radio.is-checked");
    if (radioElm && !radioElm.isSameNode(source))
      radioElm.checked = false;
    source.classList.add("is-checked");
    if (this.onChanged && selectedValue !== value)
      this.onChanged(this, event);
  }
  async add(options) {
    const elm = await Radio.create(options);
    this.appendItem(elm);
    this.selectedValue = elm.value;
    return elm;
  }
  delete(index) {
    if (index >= 0) {
      const radio = this._group[index];
      this._group.splice(index, 1);
      radio.remove();
    }
  }
  init() {
    if (!this.initialized) {
      this.classList.add("i-radio-group");
      this.setAttribute("role", "radiogroup");
      const radioItems = this.getAttribute("radioItems", true);
      radioItems && (this.radioItems = radioItems);
      const selectedValue = this.getAttribute("selectedValue", true);
      this.selectedValue = selectedValue;
      super.init();
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
__decorateClass([
  observable("selectedValue")
], RadioGroup.prototype, "_selectedValue", 2);
RadioGroup = __decorateClass([
  customElements2("i-radio-group")
], RadioGroup);

// packages/input/src/style/input.css.ts
var Theme11 = theme_exports.ThemeVars;
cssRule("i-input", {
  display: "inline-block",
  fontFamily: Theme11.typography.fontFamily,
  fontSize: Theme11.typography.fontSize,
  "$nest": {
    "> span": {
      overflow: "hidden"
    },
    "> span > label": {
      boxSizing: "border-box",
      color: Theme11.text.primary,
      display: "inline-block",
      overflow: "hidden",
      whiteSpace: "nowrap",
      verticalAlign: "middle",
      textAlign: "right",
      paddingRight: 4,
      height: "100%"
    },
    "> input": {
      border: `0.5px solid ${Theme11.divider}`,
      boxSizing: "border-box",
      outline: "none"
    },
    ".clear-btn": {
      display: "none",
      verticalAlign: "middle",
      padding: "6px",
      backgroundColor: Theme11.action.focus,
      $nest: {
        "&.active": {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer"
        }
      }
    },
    "textarea": {
      resize: "vertical",
      width: "100%",
      lineHeight: 1.5
    }
  }
});

// packages/input/src/input.ts
var defaultCaptionWidth4 = 40;
var defaultRows = 4;
var Input = class extends Control {
  constructor(parent, options) {
    super(parent, options, {
      height: 25,
      width: 100
    });
    this._inputCallback = (value) => {
      this._value = value;
    };
  }
  get caption() {
    if (this._inputControl) {
      return this._inputControl.caption;
    }
    return this._caption;
  }
  set caption(value) {
    if (this._inputControl) {
      this._inputControl.caption = value;
    } else {
      this._caption = value;
      this.labelElm.textContent = this._caption || "";
      if (!value)
        this.labelElm.style.display = "none";
      else
        this.labelElm.style.display = "";
    }
  }
  get captionWidth() {
    if (this._inputControl) {
      return this._inputControl.captionWidth;
    }
    return this._captionWidth;
  }
  set captionWidth(value) {
    if (this._inputControl) {
      this._inputControl.captionWidth = value;
    } else {
      value = this._caption ? value || defaultCaptionWidth4 : 0;
      this._captionWidth = value;
      this.labelElm.style.width = value + "px";
    }
  }
  get height() {
    return this.offsetHeight;
  }
  set height(value) {
    if (typeof value == "string")
      value = parseInt(value);
    this._height = value;
    if (this._inputControl) {
      this._inputControl.height = value;
    } else {
      this.inputElm.style.height = value + "px";
    }
  }
  get value() {
    if (this._inputControl) {
      return this._inputControl.value;
    }
    return this._value;
  }
  set value(value) {
    if (this._inputControl) {
      this._inputControl.value = value;
    } else {
      if (value == null)
        value = "";
      this._value = value;
      this.inputElm.value = value;
    }
  }
  get width() {
    return this.offsetWidth;
  }
  set width(value) {
    this._width = value;
    const _value = Number(value);
    if (Number.isNaN(_value)) {
      this.setPosition("width", value);
      this.inputElm.style.width = value == null ? void 0 : value.toString();
    } else {
      this.style.width = value + "px";
      const clearBtnWidth = this._showClearButton ? this._clearBtnWidth : 0;
      const captionWidth = typeof this._captionWidth === "string" ? this._captionWidth : `${this._captionWidth}px`;
      const width = typeof this._width === "string" ? this._width : `${this._width}px`;
      this.inputElm.style.width = `calc(${width} - ${captionWidth} - ${clearBtnWidth}px)`;
    }
  }
  get readOnly() {
    return this._readOnly;
  }
  set readOnly(value) {
    this._readOnly = value;
    this.inputElm.readOnly = value;
  }
  get inputType() {
    return this._inputType;
  }
  set inputType(type) {
    this._inputType = type;
  }
  get inputControl() {
    return this._inputControl;
  }
  set enabled(value) {
    super.enabled = value;
    if (this._inputControl) {
      this._inputControl.enabled = value;
    } else if (this.inputElm) {
      this.inputElm.disabled = !value;
    }
  }
  set placeholder(value) {
    this.inputElm.placeholder = value;
  }
  get rows() {
    return this._rows;
  }
  set rows(value) {
    if (this.inputType !== "textarea")
      return;
    this._rows = value;
    this.inputElm.rows = value;
  }
  get multiline() {
    return this._multiline;
  }
  set multiline(value) {
    this._multiline = value;
    this.inputType = value ? "textarea" : "text";
  }
  _createInputElement(type) {
    const value = this.getAttribute("value");
    const caption = this.getAttribute("caption");
    const width = this.getAttribute("width", true);
    const height = this.getAttribute("height", true);
    const checked = this.getAttribute("checked", true);
    const enabled = this.getAttribute("enabled", true);
    this._clearBtnWidth = height - 2 || 0;
    switch (type) {
      case "checkbox":
        this._inputControl = new Checkbox(this, {
          value,
          checked,
          enabled,
          caption,
          indeterminate: this.getAttribute("indeterminate", true)
        });
        if (this.onChanged)
          this._inputControl.onChanged = this.onChanged;
        this.appendChild(this._inputControl);
        this.inputElm = this._inputControl.querySelector('input[type="checkbox"]');
        break;
      case "combobox":
        this._inputControl = new ComboBox(this, {
          selectedItem: this.getAttribute("selectedItem", true),
          items: this.getAttribute("items", true),
          width,
          height,
          enabled,
          icon: this.getAttribute("icon", true),
          mode: this.getAttribute("mode", true),
          placeholder: this.getAttribute("placeholder", true),
          parentCallback: this._inputCallback
        });
        if (this.onChanged)
          this._inputControl.onChanged = this.onChanged;
        this.appendChild(this._inputControl);
        this.inputElm = this._inputControl.querySelector("input");
        break;
      case "date":
      case "dateTime":
      case "time":
        this._inputControl = new Datepicker(this, {
          caption,
          value,
          placeholder: this._placeholder,
          type,
          dateTimeFormat: this.getAttribute("dateTimeFormat", true),
          width,
          height,
          enabled,
          parentCallback: this._inputCallback
        });
        if (this.onChanged)
          this._inputControl.onChanged = this.onChanged;
        this.appendChild(this._inputControl);
        this.inputElm = this._inputControl.querySelector('input[type="text"]');
        break;
      case "range":
        this._inputControl = new Range(this, {
          value,
          caption,
          width,
          height,
          enabled,
          min: this.getAttribute("min", true),
          max: this.getAttribute("max", true),
          step: this.getAttribute("step", true),
          stepDots: this.getAttribute("stepDots", true),
          tooltipFormatter: this.getAttribute("tooltipFormatter", true),
          tooltipVisible: this.getAttribute("tooltipVisible", true),
          parentCallback: this._inputCallback
        });
        this._inputControl.onChanged = this.onChanged;
        this._inputControl.onMouseUp = this.onMouseUp;
        this._inputControl.onKeyUp = this.onKeyUp;
        this.appendChild(this._inputControl);
        this.inputElm = this._inputControl.querySelector('input[type="range"]');
        break;
      case "radio":
        const id = this.getAttribute("id") || "";
        this._inputControl = new Radio(this, {
          value,
          checked,
          enabled,
          caption,
          id: id + "_radio"
        });
        this.appendChild(this._inputControl);
        this.inputElm = this._inputControl.querySelector('input[type="radio"]');
        break;
      case "textarea":
        this.captionSpanElm = this.createElement("span", this);
        this.labelElm = this.createElement("label", this.captionSpanElm);
        this.inputElm = this.createElement("textarea", this);
        this.inputElm.style.height = "auto";
        const rows = this.getAttribute("rows", true) || defaultRows;
        this.rows = rows;
        if (this._placeholder) {
          this.inputElm.placeholder = this._placeholder;
        }
        this.inputElm.disabled = enabled === false;
        this.inputElm.addEventListener("input", this._handleChange.bind(this));
        this.inputElm.addEventListener("keydown", this._handleInputKeyDown.bind(this));
        this.inputElm.addEventListener("keyup", this._handleInputKeyUp.bind(this));
        this.inputElm.addEventListener("blur", this._handleOnBlur.bind(this));
        this.inputElm.addEventListener("focus", this._handleOnFocus.bind(this));
        break;
      default:
        const inputType = type == "password" ? type : "text";
        this.captionSpanElm = this.createElement("span", this);
        this.labelElm = this.createElement("label", this.captionSpanElm);
        this.inputElm = this.createElement("input", this);
        this.inputElm.setAttribute("autocomplete", "disabled");
        this.inputElm.style.height = this.height + "px";
        this.inputElm.type = inputType;
        if (this._placeholder) {
          this.inputElm.placeholder = this._placeholder;
        }
        this.inputElm.disabled = enabled === false;
        this.inputElm.addEventListener("input", this._handleChange.bind(this));
        this.inputElm.addEventListener("keydown", this._handleInputKeyDown.bind(this));
        this.inputElm.addEventListener("keyup", this._handleInputKeyUp.bind(this));
        this.inputElm.addEventListener("blur", this._handleOnBlur.bind(this));
        this.inputElm.addEventListener("focus", this._handleOnFocus.bind(this));
        this._showClearButton = this.getAttribute("showClearButton", true);
        if (this._showClearButton) {
          this.clearIconElm = this.createElement("span", this);
          this.clearIconElm.classList.add("clear-btn");
          this.clearIconElm.style.width = this._clearBtnWidth + "px";
          this.clearIconElm.style.height = this._clearBtnWidth + "px";
          this.clearIconElm.addEventListener("click", () => {
            if (!this._enabled)
              return false;
            this._clearValue();
          });
          const clearIcon = new Icon(this, { name: "times", width: 12, height: 12, fill: theme_exports.ThemeVars.text.primary });
          this.clearIconElm.appendChild(clearIcon);
        }
        break;
    }
  }
  _handleChange(event) {
    if (this.inputType === "number" && !/^-?\d*[.]?\d*$/.test(this.inputElm.value)) {
      this.inputElm.value = this._value;
      return;
    }
    this._value = this.inputElm.value;
    if (this.onChanged)
      this.onChanged(this, this.value);
  }
  _handleInputKeyDown(event) {
    if (this.onKeyDown)
      this.onKeyDown(this, this.value);
  }
  _handleInputKeyUp(event) {
    if (this.onKeyUp)
      this.onKeyUp(this, this.value);
    if (this.clearIconElm) {
      if (this.value) {
        this.clearIconElm.classList.add("active");
      } else {
        this.clearIconElm.classList.remove("active");
      }
    }
  }
  _handleOnBlur(event) {
    if (this.onBlur) {
      event.preventDefault();
      this.onBlur(this);
    }
  }
  _handleOnFocus(event) {
    if (this.onFocus) {
      event.preventDefault();
      this.onFocus(this);
    }
  }
  _clearValue() {
    this.value = "";
    this.clearIconElm.classList.remove("active");
    if (this.onClearClick)
      this.onClearClick(this);
  }
  init() {
    if (!this.inputType) {
      this._placeholder = this.getAttribute("placeholder", true);
      this.inputType = this.getAttribute("inputType", true);
      this._createInputElement(this.inputType);
      this.caption = this.getAttribute("caption", true);
      this.captionWidth = parseInt(this.getAttribute("captionWidth", true));
      this.value = this.getAttribute("value", true);
      this.readOnly = this.getAttribute("readOnly", true, false);
      if (this.value && this.clearIconElm)
        this.clearIconElm.classList.add("active");
      this.onClearClick = this.getAttribute("onClearClick", true) || this.onClearClick;
      super.init();
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
__decorateClass([
  observable("value")
], Input.prototype, "_value", 2);
Input = __decorateClass([
  customElements2("i-input")
], Input);

// packages/markdown/src/style/markdown.css.ts
var Theme12 = theme_exports.ThemeVars;
cssRule("i-markdown", {
  display: "inline-block",
  color: Theme12.text.primary,
  fontFamily: Theme12.typography.fontFamily,
  fontSize: Theme12.typography.fontSize,
  $nest: {
    h1: {
      fontSize: "48px",
      fontWeight: "900",
      marginBottom: "16px",
      marginTop: "1.5em",
      $nest: {
        "@media (max-width: 700px)": {
          fontSize: "24px"
        }
      }
    },
    h2: {
      fontSize: "24px",
      lineHeight: "1.5",
      fontWeight: "600",
      marginBottom: "16px",
      marginTop: "1.5em",
      $nest: {
        "@media (max-width: 700px)": {
          fontSize: "20px"
        }
      }
    },
    h3: {
      fontSize: "20px",
      lineHeight: "24px",
      fontWeight: "600",
      marginBottom: "16px",
      marginTop: "1.5em",
      $nest: {
        "@media (max-width: 700px)": {
          fontSize: "16px"
        }
      }
    },
    h4: {
      fontSize: "16px",
      fontWeight: "600",
      marginBottom: "16px",
      marginTop: "1.5em"
    },
    h5: {
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "16px",
      marginTop: "1.5em"
    },
    h6: {
      fontSize: "13.6px",
      fontWeight: "600",
      marginBottom: "16px",
      marginTop: "1.5em"
    },
    p: {
      display: "block",
      lineHeight: "150%",
      marginBottom: "1em",
      marginTop: "0",
      fontSize: "15px"
    },
    "p > img": {
      width: "50%",
      float: "left",
      $nest: {
        "@media (max-width: 700px)": {
          width: "100%"
        }
      }
    },
    "p img:nth-child(odd)": {
      paddingRight: "6px",
      $nest: {
        "@media (max-width: 700px)": {
          padding: "0"
        }
      }
    },
    "p img:nth-child(even)": {
      paddingLeft: "6px",
      $nest: {
        "@media (max-width: 700px)": {
          padding: "0"
        }
      }
    },
    "p img:only-child": {
      width: "100%"
    },
    "p a": {
      display: "contents"
    },
    "table": {
      borderSpacing: "0",
      border: "1px solid #393939",
      width: "100%",
      marginBottom: "20px",
      $nest: {
        "thead": {
          background: "#FFF"
        },
        "th, td": {
          padding: "10px"
        },
        "td": {
          borderTop: "1px solid #393939"
        },
        "tbody": {
          $nest: {
            "tr:nth-child(odd)": {
              backgroundColor: "#EEE"
            },
            "tr:nth-child(even)": {
              backgroundColor: "#FFF"
            }
          }
        }
      }
    },
    strong: {
      fontWeight: "600"
    },
    blockquote: {
      background: "#e3e3ff",
      borderLeft: "0.25em solid #55f",
      display: "block",
      padding: "15px 30px 15px 15px",
      color: "#6a737d",
      fontSize: "16px",
      margin: "0 0 16px",
      $nest: {
        p: {
          marginBottom: "0"
        }
      }
    },
    hr: {
      border: "1px solid #dfe2e5",
      boxSizing: "content-box",
      margin: "1.5em 0",
      overflow: "hidden",
      padding: "0"
    },
    ol: {
      marginBottom: "1em",
      marginTop: "0",
      paddingLeft: "2em",
      $nest: {
        li: {
          fontSize: "16px"
        },
        "li+li": {
          marginTop: "0.5em"
        }
      }
    },
    ul: {
      marginBottom: "1em",
      marginTop: "0",
      paddingLeft: "2em",
      $nest: {
        li: {
          fontSize: "16px"
        },
        "li+li": {
          marginTop: "0.5em"
        }
      }
    },
    "ol ol, ul ul, ol ul, ul ol": {
      marginTop: "0.5em"
    },
    "code, pre code": {
      borderRadius: "3px",
      background: "#ebeff3",
      overflowX: "scroll",
      border: "0",
      display: "inline",
      margin: "0",
      overflow: "visible",
      padding: "0",
      whiteSpace: "pre",
      wordBreak: "normal",
      wordWrap: "normal"
    },
    "a, a:hover": {
      color: "#55f",
      textDecoration: "none"
    }
  }
});

// packages/markdown/src/markdown.ts
var libs = [`${LibPath}lib/marked/marked.umd.js`];
var Markdown = class extends Control {
  constructor() {
    super();
    this.gitbookProcess = true;
  }
  async load(text) {
    if (!this.marked)
      this.marked = await this.loadLib();
    text = await this.marked.parse(text);
    text = await this.processText(text);
    this.innerHTML = text;
    return this.innerHTML;
  }
  async beforeRender(text) {
    this.innerHTML = text;
  }
  async processText(text) {
    if (this.gitbookProcess) {
      text = text.replace(/\*\*\*\*/g, "\n	").replace(/\\/g, "");
    }
    return text;
  }
  async loadLib() {
    return new Promise((resolve, reject) => {
      RequireJS.require(libs, async (marked) => {
        resolve(marked);
      });
    });
  }
  init() {
    super.init();
  }
};
Markdown = __decorateClass([
  customElements2("i-markdown")
], Markdown);

// packages/tab/src/style/tab.css.ts
var Theme13 = theme_exports.ThemeVars;
cssRule("i-tabs", {
  display: "block",
  $nest: {
    ".tabs-nav-wrap": {
      display: "flex",
      flex: "none",
      overflow: "hidden",
      background: "#252525"
    },
    "&:not(.vertical) .tabs-nav-wrap": {
      $nest: {
        "&:hover": {
          overflowX: "auto",
          overflowY: "hidden"
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#4b4b4b",
          borderRadius: "5px"
        },
        "&::-webkit-scrollbar": {
          height: "3px"
        }
      }
    },
    ".tabs-nav": {
      position: "relative",
      display: "flex",
      flex: "none",
      overflow: "hidden",
      whiteSpace: "nowrap",
      borderBottom: `1px solid #252525`,
      margin: 0
    },
    "&.vertical": {
      display: "flex !important",
      $nest: {
        ".tabs-nav": {
          display: "flex",
          flexDirection: "column"
        },
        ".tabs-nav:hover": {
          overflowY: "auto"
        },
        ".tabs-nav::-webkit-scrollbar-thumb": {
          background: "#4b4b4b",
          borderRadius: "5px"
        },
        ".tabs-nav::-webkit-scrollbar": {
          width: "3px"
        }
      }
    },
    "i-tab": {
      position: "relative",
      display: "inline-flex",
      overflow: "hidden",
      color: "rgba(255, 255, 255, 0.55)",
      background: "#2e2e2e",
      marginBottom: "-1px",
      border: `1px solid #252525`,
      alignItems: "center",
      font: "inherit",
      textAlign: "center",
      minHeight: "36px",
      $nest: {
        "&:not(.disabled):hover": {
          cursor: "pointer",
          color: "#fff"
        },
        "&:not(.disabled).active.border": {
          borderColor: `${Theme13.divider} ${Theme13.divider} #fff`,
          borderBottomWidth: "1.5px"
        },
        ".tab-item": {
          position: "relative",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          padding: "0.5rem 1rem",
          gap: "5px",
          $nest: {
            "i-image": {
              display: "flex"
            }
          }
        }
      }
    },
    "i-tab:not(.disabled).active": {
      backgroundColor: "#1d1d1d",
      borderBottomColor: "transparent",
      color: "#fff"
    },
    ".tabs-content": {
      position: "relative",
      overflow: "hidden",
      display: "flex",
      width: "100%",
      height: "100%",
      minHeight: "200px",
      $nest: {
        "&::after": {
          clear: "both"
        },
        "i-label .f1yauex0": {
          whiteSpace: "normal"
        },
        ".content-pane": {
          position: "relative",
          width: "100%",
          height: "100%",
          flex: "none"
        }
      }
    },
    "span.close": {
      width: "18px",
      height: "18px",
      marginLeft: "5px",
      marginRight: "-5px",
      borderRadius: "5px",
      lineHeight: "18px",
      fontSize: "18px",
      visibility: "hidden",
      opacity: 0,
      $nest: {
        "&:hover": {
          background: "rgba(78, 78, 78, 0.48)"
        }
      }
    },
    ".tabs-nav:not(.is-closable) span.close": {
      display: "none"
    },
    ".tabs-nav.is-closable i-tab:not(.disabled):hover span.close, .tabs-nav.is-closable i-tab:not(.disabled).active span.close": {
      visibility: "visible",
      opacity: 1
    }
  }
});

// packages/tab/src/tab.ts
var Tabs = class extends Container {
  constructor(parent, options) {
    super(parent, options);
    this.accumTabIndex = 0;
    this.dragStartHandler = this.dragStartHandler.bind(this);
    this.dragOverHandler = this.dragOverHandler.bind(this);
    this.dropHandler = this.dropHandler.bind(this);
  }
  get activeTab() {
    return this._tabs[this.activeTabIndex];
  }
  set activeTab(item) {
    const index = item.index;
    if (index < 0 || this.activeTabIndex === index)
      return;
    this.activeTabIndex = item.index;
  }
  get activeTabIndex() {
    return this._activeTabIndex;
  }
  set activeTabIndex(index) {
    var _a;
    if (index < 0 || this._activeTabIndex === index)
      return;
    const prevTab = this._tabs[this._activeTabIndex];
    if (prevTab) {
      prevTab.classList.remove("active");
      this.contentPanes[this._activeTabIndex].style.display = "none";
    }
    this._activeTabIndex = index;
    (_a = this.activeTab) == null ? void 0 : _a.classList.add("active");
    if (this.contentPanes[index])
      this.contentPanes[index].style.display = "";
  }
  get items() {
    return this._tabs;
  }
  get closable() {
    return this._closable;
  }
  set closable(value) {
    this._closable = value;
    if (value) {
      this.tabsNavElm.classList.add("is-closable");
    } else {
      this.tabsNavElm.classList.remove("is-closable");
    }
  }
  get draggable() {
    return this._draggable;
  }
  set draggable(value) {
    if (this._draggable === value)
      return;
    this._draggable = value;
    if (this.draggable) {
      this.tabsNavElm.ondragover = this.dragOverHandler;
      this.tabsNavElm.ondrop = this.dropHandler;
    } else {
      this.tabsNavElm.ondragover = null;
      this.tabsNavElm.ondrop = null;
    }
    this.handleTagDrag(this._tabs);
  }
  get mode() {
    const isVertical = this.classList.contains("vertical");
    return isVertical ? "vertical" : "horizontal";
  }
  set mode(type) {
    if (type === "vertical") {
      this.classList.add("vertical");
    } else {
      this.classList.remove("vertical");
    }
  }
  add(options) {
    const tab = new Tab(this, options);
    if (options == null ? void 0 : options.children) {
      tab.append(options == null ? void 0 : options.children);
    }
    if (this.draggable) {
      this.handleTagDrag([tab]);
    }
    this.appendTab(tab);
    this.activeTab = tab;
    return tab;
  }
  delete(tab) {
    const index = this._tabs.findIndex((t) => t.id === tab.id);
    const activeIndex = this.activeTabIndex;
    if (index >= 0) {
      this._tabs.splice(index, 1);
      const pane = this.contentPanes[index];
      this.contentPanes.splice(index, 1);
      pane.remove();
      if (activeIndex >= index) {
        let newActiveIndex = activeIndex > index ? activeIndex - 1 : this._tabs[activeIndex] ? activeIndex : this._tabs.length - 1;
        this._activeTabIndex = newActiveIndex;
        if (this.activeTab) {
          this.activeTab.classList.add("active");
          this.contentPanes[newActiveIndex].style.display = "";
        }
      }
    }
    tab.remove();
  }
  appendTab(tab) {
    tab._container = this.tabsContentElm;
    tab.parent = this;
    this._tabs.push(tab);
    if (!tab.id)
      tab.id = `tab-${this.accumTabIndex++}`;
    this.tabsNavElm.appendChild(tab);
    const contentPane = this.createElement("div", this.tabsContentElm);
    tab._contentElm = contentPane;
    contentPane.classList.add("content-pane");
    contentPane.style.display = "none";
    this.contentPanes.push(contentPane);
    const children = tab.children;
    for (let i = 0; i < children.length; i++) {
      if (children[i].classList.contains("tab-item"))
        continue;
      if (children[i] instanceof Control) {
        children[i].parent = tab;
      }
    }
    ;
  }
  handleTagDrag(tabs) {
    tabs.forEach((tab) => {
      if (this.draggable) {
        tab.setAttribute("draggable", "true");
        tab.ondragstart = this.dragStartHandler;
      } else {
        tab.removeAttribute("draggable");
        tab.ondragstart = null;
      }
    });
  }
  _handleClick(event) {
    return super._handleClick(event, true);
  }
  dragStartHandler(event) {
    if (!(event.target instanceof Tab))
      return;
    this.curDragTab = event.target;
  }
  dragOverHandler(event) {
    event.preventDefault();
  }
  dropHandler(event) {
    event.preventDefault();
    if (!this.curDragTab)
      return;
    const target = event.target;
    const dropTab = target instanceof Tab ? target : target.closest("i-tab");
    if (dropTab && !this.curDragTab.isSameNode(dropTab)) {
      const curActiveTab = this.activeTab;
      const dragIndex = this.curDragTab.index;
      const dropIndex = dropTab.index;
      const [dragTab] = this._tabs.splice(dragIndex, 1);
      this._tabs.splice(dropIndex, 0, dragTab);
      const [dragContent] = this.contentPanes.splice(dragIndex, 1);
      this.contentPanes.splice(dropIndex, 0, dragContent);
      if (dragIndex > dropIndex) {
        this.tabsNavElm.insertBefore(this.curDragTab, dropTab);
      } else {
        dropTab.after(this.curDragTab);
      }
      this.activeTab = curActiveTab;
      if (this.onChanged)
        this.onChanged(this, this.activeTab);
    }
    this.curDragTab = null;
  }
  refresh() {
    if (this.dock) {
      super.refresh(true);
      const height = this.mode === "horizontal" ? this.clientHeight - this.tabsNavElm.clientHeight : this.clientHeight;
      this.tabsContentElm.style.height = height + "px";
      this.refreshControls();
    }
  }
  init() {
    super.init();
    if (!this.tabsNavElm) {
      this.contentPanes = [];
      this._tabs = [];
      const _tabs = [];
      this.childNodes.forEach((node) => {
        if (node instanceof Tab) {
          _tabs.push(node);
        } else {
          node.remove();
        }
      });
      const tabsNavWrapElm = this.createElement("div", this);
      tabsNavWrapElm.classList.add("tabs-nav-wrap");
      tabsNavWrapElm.addEventListener("wheel", (event) => {
        if (this.mode !== "horizontal")
          return;
        event.preventDefault();
        tabsNavWrapElm.scrollLeft += event.deltaY;
      });
      this.tabsNavElm = this.createElement("div", tabsNavWrapElm);
      this.tabsNavElm.classList.add("tabs-nav");
      this.tabsContentElm = this.createElement("div", this);
      this.tabsContentElm.classList.add("tabs-content");
      this.closable = this.getAttribute("closable", true) || false;
      this.mode = this.getAttribute("mode", true) || "horizontal";
      for (const tab of _tabs) {
        this.appendTab(tab);
      }
      const activeTab = this.getAttribute("activeTab", true);
      if (activeTab)
        this.activeTab = activeTab;
      this.draggable = this.getAttribute("draggable", true) || false;
      const activeTabIndex = this.getAttribute("activeTabIndex", true);
      if (this._tabs.length)
        this.activeTabIndex = activeTabIndex || 0;
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Tabs = __decorateClass([
  customElements2("i-tabs")
], Tabs);
var Tab = class extends Container {
  active() {
    this._parent.activeTab = this;
  }
  addChildControl(control) {
    if (this._contentElm)
      this._contentElm.appendChild(control);
  }
  removeChildControl(control) {
    if (this._contentElm && this._contentElm.contains(control))
      this._contentElm.removeChild(control);
  }
  get caption() {
    return this.captionElm.innerHTML;
  }
  set caption(value) {
    this.captionElm.innerHTML = value;
  }
  close() {
    this.handleCloseTab();
  }
  get index() {
    return this._parent.items.findIndex((t) => t.id === this.id);
  }
  get icon() {
    if (!this._icon) {
      this._icon = Icon.create({
        width: 16,
        height: 16
      }, this);
    }
    ;
    return this._icon;
  }
  set icon(elm) {
    if (this._icon)
      this.tabContainer.removeChild(this._icon);
    this._icon = elm;
    if (this._icon)
      this.tabContainer.prepend(this._icon);
  }
  get innerHTML() {
    return this._contentElm.innerHTML;
  }
  set innerHTML(value) {
    this._contentElm.innerHTML = value;
  }
  get font() {
    return {
      color: this.captionElm.style.color,
      name: this.captionElm.style.fontFamily,
      size: this.captionElm.style.fontSize,
      bold: this.captionElm.style.fontStyle.indexOf("bold") >= 0,
      style: this.captionElm.style.fontStyle
    };
  }
  set font(value) {
    if (this.captionElm) {
      this.captionElm.style.color = value.color || "";
      this.captionElm.style.fontSize = value.size || "";
      this.captionElm.style.fontWeight = value.bold ? "bold" : "";
      this.captionElm.style.fontFamily = value.name || "";
      this.captionElm.style.fontStyle = value.style || "";
    }
  }
  _handleClick(event) {
    if (!this._parent || !this.enabled || this._parent.activeTab.isSameNode(this))
      return false;
    if (this._parent) {
      if (this._parent.activeTab != this)
        this._parent.activeTab = this;
      if (this._parent.onChanged)
        this._parent.onChanged(this._parent, this._parent.activeTab);
    }
    return super._handleClick(event);
  }
  handleCloseTab(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (!this._parent || !this.enabled || event && !this._parent.closable)
      return;
    const isActiveChange = this._parent.activeTab.isSameNode(this);
    if (this._parent.onCloseTab)
      this._parent.onCloseTab(this._parent, this);
    this._parent.delete(this);
    if (isActiveChange && this._parent.onChanged)
      this._parent.onChanged(this._parent, this._parent.activeTab);
  }
  init() {
    if (!this.captionElm) {
      super.init();
      this.tabContainer = this.createElement("div", this);
      this.tabContainer.classList.add("tab-item");
      this.captionElm = this.createElement("div", this.tabContainer);
      this.caption = this.getAttribute("caption", true) || "";
      const icon = this.getAttribute("icon", true);
      if (icon) {
        icon.height = icon.height || "16px";
        icon.width = icon.width || "16px";
        this.icon = new Icon(void 0, icon);
      }
      ;
      const closeButton = this.createElement("span", this.tabContainer);
      closeButton.classList.add("close");
      closeButton.innerHTML = "&times;";
      closeButton.onclick = this.handleCloseTab.bind(this);
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Tab = __decorateClass([
  customElements2("i-tab")
], Tab);

// packages/markdown-editor/src/style/markdown-editor.css.ts
var Theme14 = theme_exports.ThemeVars;
cssRule("i-markdown-editor", {
  display: "block",
  $nest: {
    ".editor-container": {
      marginRight: "auto",
      marginLeft: "auto"
    },
    ".editor-tabs": {
      display: "block",
      position: "relative",
      border: `1px solid ${Theme14.divider}`,
      borderRadius: "6px",
      $nest: {
        ".tabs": {
          backgroundColor: Theme14.background.paper,
          borderBottom: `1px solid ${Theme14.divider}`,
          borderTopLeftRadius: "6px",
          borderTopRightRadius: "6px",
          marginBottom: 0,
          zIndex: 1,
          $nest: {
            "i-tab": {
              display: "inline-block",
              padding: "12px 16px",
              textDecoration: "none",
              backgroundColor: "transparent",
              border: "1px solid transparent",
              borderBottom: 0,
              borderRadius: 0,
              transition: "color .2s cubic-bezier(0.3, 0, 0.5, 1)",
              cursor: "pointer",
              $nest: {
                ".tab-link": {
                  display: "none"
                },
                "&::after": {
                  content: "none!important"
                },
                "i-icon": {
                  display: "inline-block",
                  verticalAlign: "middle",
                  fill: Theme14.text.secondary
                },
                "span": {
                  marginLeft: "6px",
                  fontSize: "14px",
                  lineHeight: "23px",
                  color: Theme14.text.secondary,
                  verticalAlign: "middle"
                },
                "&.active": {
                  borderTopLeftRadius: "6px",
                  borderTopRightRadius: "6px",
                  backgroundColor: Theme14.colors.primary.main,
                  borderColor: Theme14.divider,
                  $nest: {
                    "&:first-of-type": {
                      borderColor: "transparent",
                      borderTopRightRadius: 0,
                      borderRightColor: Theme14.divider
                    },
                    "i-icon": {
                      fill: Theme14.text.primary
                    },
                    "span": {
                      fontWeight: 600,
                      color: Theme14.text.primary
                    }
                  }
                }
              }
            }
          }
        },
        "#preview": {
          padding: "32px 85px"
        }
      }
    }
  }
});

// packages/markdown-editor/src/markdown-editor.ts
var MarkdownEditor = class extends Control {
  constructor(parent, options) {
    super(parent, options, {
      width: "100%",
      height: "auto"
    });
  }
  onViewPreview() {
    const value = this.mdEditor.value;
    this.mdPreviewer.load(value);
  }
  getValue() {
    return this.mdEditor.value;
  }
  setValue(value) {
    this.mdEditor.value = value;
    if (this.tabs.activeTabIndex === 1) {
      this.mdPreviewer.load(value);
    }
  }
  init() {
    super.init();
    const container = this.createElement("div", this);
    container.classList.add("editor-container");
    this.tabs = new Tabs(void 0, {
      width: "auto"
    });
    container.appendChild(this.tabs);
    this.mdEditor = new CodeEditor();
    this.mdEditor.width = "100%";
    this.mdEditor.height = "646px";
    this.mdEditor.language = "markdown";
    this.editTab = this.tabs.add({
      caption: "Edit file",
      icon: {
        name: "code",
        width: "16px",
        height: "16px",
        fill: "currentColor"
      },
      children: this.mdEditor
    });
    this.mdPreviewer = new Markdown();
    this.previewTab = this.tabs.add({
      caption: "Preview",
      icon: {
        name: "eye",
        width: "16px",
        height: "16px",
        fill: "currentColor"
      },
      children: this.mdPreviewer
    });
    this.previewTab.onClick = this.onViewPreview.bind(this);
    this.tabs.activeTabIndex = 0;
  }
};
MarkdownEditor = __decorateClass([
  customElements2("i-markdown-editor")
], MarkdownEditor);

// packages/link/src/style/link.css.ts
var Theme15 = theme_exports.ThemeVars;
cssRule("i-link", {
  display: "block",
  cursor: "pointer",
  $nest: {
    "&:hover *": {
      color: Theme15.colors.primary.dark
    },
    "> a": {
      transition: "all .3s",
      textDecoration: "underline",
      color: "inherit",
      fontSize: "inherit",
      fontWeight: "inherit",
      fontFamily: "inherit"
    }
  }
});

// packages/link/src/link.ts
var Link = class extends Control {
  constructor(parent, options) {
    super(parent, options, {
      target: "_blank"
    });
  }
  get href() {
    return this._href;
  }
  set href(value) {
    this._href = typeof value === "string" ? value : "";
    if (this._linkElm)
      this._linkElm.href = this._href;
  }
  get target() {
    return this._target;
  }
  set target(value) {
    this._target = value;
    if (this._linkElm)
      this._linkElm.target = value;
  }
  append(children) {
    if (!this._linkElm) {
      this._linkElm = this.createElement("a", this);
    }
    this._linkElm.appendChild(children);
  }
  _handleClick(event, stopPropagation) {
    event.preventDefault();
    window.open(this._linkElm.href, this._linkElm.target);
    return super._handleClick(event);
  }
  addChildControl(control) {
    if (this._linkElm)
      this._linkElm.appendChild(control);
  }
  removeChildControl(control) {
    if (this._linkElm && this._linkElm.contains(control))
      this._linkElm.removeChild(control);
  }
  init() {
    if (!this.initialized) {
      super.init();
      if (!this._linkElm)
        this._linkElm = this.createElement("a", this);
      this.classList.add("i-link");
      const hrefAttr = this.getAttribute("href", true);
      hrefAttr && (this.href = hrefAttr);
      const targetAttr = this.getAttribute("target", true);
      targetAttr && (this._linkElm.target = targetAttr);
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Link = __decorateClass([
  customElements2("i-link")
], Link);

// packages/modal/src/style/modal.css.ts
var Theme16 = theme_exports.ThemeVars;
var wrapperStyle = style({
  position: "fixed",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(12, 18, 52, 0.7)",
  opacity: 0,
  visibility: "hidden",
  transform: "scale(1.1)",
  transition: "visibility 0s linear .25s,opacity .25s 0s,transform .25s",
  zIndex: 10,
  overflow: "auto"
});
var noBackdropStyle = style({
  position: "inherit",
  top: 0,
  left: 0,
  opacity: 0,
  visibility: "hidden",
  transform: "scale(1.1)",
  transition: "visibility 0s linear .25s,opacity .25s 0s,transform .25s",
  zIndex: 10,
  overflow: "auto",
  width: "inherit",
  maxWidth: "inherit",
  $nest: {
    ".modal": {
      margin: "0"
    }
  }
});
var visibleStyle = style({
  opacity: "1",
  visibility: "visible",
  transform: "scale(1)",
  transition: "visibility 0s linear 0s,opacity .25s 0s,transform .25s"
});
var modalStyle = style({
  fontFamily: "Helvetica",
  fontSize: "14px",
  padding: "10px 10px 5px 10px",
  backgroundColor: Theme16.background.modal,
  position: "relative",
  borderRadius: "2px",
  minWidth: "300px",
  width: "inherit"
});
var titleStyle = style({
  fontSize: "18px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  $nest: {
    "span": {
      color: Theme16.colors.primary.main
    },
    "i-icon": {
      display: "inline-block",
      cursor: "pointer"
    }
  }
});

// packages/modal/src/modal.ts
var Theme17 = theme_exports.ThemeVars;
var showEvent = new Event("show");
var Modal = class extends Container {
  constructor(parent, options) {
    super(parent, options, {
      showClose: true,
      showBackdrop: true,
      closeOnBackdropClick: true,
      popupPlacement: "center"
    });
  }
  get visible() {
    return this.wrapperDiv.classList.contains(visibleStyle);
  }
  set visible(value) {
    if (value) {
      this.wrapperDiv.classList.add(visibleStyle);
      this.dispatchEvent(showEvent);
      this.showBackdrop && (document.body.style.overflow = "hidden");
    } else {
      this.wrapperDiv.classList.remove(visibleStyle);
      this.showBackdrop && (document.body.style.overflow = "hidden auto");
      this.onClose && this.onClose(this);
    }
  }
  get onOpen() {
    return this._onOpen;
  }
  set onOpen(callback) {
    this._onOpen = callback;
  }
  get title() {
    const titleElm = this.titleSpan.querySelector("span");
    return (titleElm == null ? void 0 : titleElm.innerHTML) || "";
  }
  set title(value) {
    const titleElm = this.titleSpan.querySelector("span");
    titleElm && (titleElm.innerHTML = value || "");
  }
  set width(value) {
    this.setPosition("width", value);
    this.updateModal("width", value);
  }
  get popupPlacement() {
    return this._placement;
  }
  set popupPlacement(value) {
    this._placement = value;
  }
  get icon() {
    if (!this._icon) {
      this._icon = Icon.create({
        name: "times",
        fill: Theme17.colors.primary.main,
        width: 16,
        height: 16
      }, this);
      this._icon.classList.add("i-modal-close");
      this._icon._handleClick = () => this.visible = false;
    }
    ;
    return this._icon;
  }
  set icon(elm) {
    if (this._icon)
      this.titleSpan.removeChild(this._icon);
    this._icon = elm;
    if (this._icon)
      this.titleSpan.appendChild(this._icon);
  }
  get closeOnBackdropClick() {
    return this._closeOnBackdropClick;
  }
  set closeOnBackdropClick(value) {
    this._closeOnBackdropClick = typeof value === "boolean" ? value : true;
  }
  get showBackdrop() {
    return this._showBackdrop;
  }
  set showBackdrop(value) {
    this._showBackdrop = typeof value === "boolean" ? value : true;
    if (this._showBackdrop) {
      this.wrapperDiv.classList.add(wrapperStyle);
      this.style.position = "unset";
    } else {
      this.style.position = "absolute";
      this.style.left = "0px";
      this.style.top = "0px";
      this.wrapperDiv.classList.add(noBackdropStyle);
    }
  }
  get item() {
    return this.modalDiv.children[0];
  }
  set item(value) {
    if (value instanceof Control) {
      this.modalDiv.innerHTML = "";
      value && this.modalDiv.appendChild(value);
    }
  }
  get position() {
    return this._wrapperPositionAt;
  }
  set position(value) {
    this._wrapperPositionAt = value;
  }
  positionAt(placement) {
    if (this.showBackdrop) {
      this.positionAtFix(placement);
    } else {
      this.positionAtAbsolute(placement);
    }
  }
  positionAtFix(placement) {
    var _a;
    const inModal = (_a = this.parentElement) == null ? void 0 : _a.closest("i-modal");
    if (inModal) {
      this.wrapperDiv.style.top = "-50%";
      return;
    }
    let parent = document.body;
    let coords = this.getWrapperFixCoords(parent, placement);
    this.wrapperDiv.style.paddingLeft = coords.left + "px";
    this.wrapperDiv.style.paddingTop = coords.top + "px";
  }
  positionAtAbsolute(placement) {
    let parent = this._parent || this.linkTo || this.parentElement || document.body;
    let coords;
    if (this.position === "fixed") {
      coords = this.getWrapperFixCoords(parent, placement);
    } else {
      coords = this.getWrapperAbsoluteCoords(parent, placement);
    }
    this.wrapperDiv.style.left = coords.left + "px";
    this.wrapperDiv.style.top = coords.top + "px";
  }
  getWrapperFixCoords(parent, placement) {
    const parentCoords = parent.getBoundingClientRect();
    let left = 0;
    let top = 0;
    const pageY = 0;
    switch (placement) {
      case "center":
        top = parentCoords.height / 2 - this.modalDiv.offsetHeight / 2;
        left = parentCoords.width / 2 - this.modalDiv.offsetWidth / 2;
        break;
      case "top":
        top = pageY - this.modalDiv.offsetHeight - parentCoords.height;
        left = parentCoords.left + (parent.offsetWidth - this.modalDiv.offsetWidth) / 2;
        break;
      case "topLeft":
        top = pageY - this.modalDiv.offsetHeight - parentCoords.height;
        left = parentCoords.left;
        break;
      case "topRight":
        top = pageY - this.modalDiv.offsetHeight - parentCoords.height;
        left = parentCoords.left + parent.offsetWidth - this.modalDiv.offsetWidth;
        break;
      case "bottom":
        top = pageY + parentCoords.top + parentCoords.height;
        left = parentCoords.left + (parent.offsetWidth - this.modalDiv.offsetWidth) / 2;
        break;
      case "bottomLeft":
        top = pageY + parentCoords.top + parentCoords.height;
        left = parentCoords.left;
        break;
      case "bottomRight":
        top = pageY + parentCoords.top + parentCoords.height;
        left = parentCoords.left + parent.offsetWidth - this.modalDiv.offsetWidth;
        break;
      case "rightTop":
        top = parentCoords.top;
        left = parentCoords.right;
        if (parentCoords.right + this.modalDiv.offsetWidth > document.documentElement.clientWidth) {
          left = document.documentElement.clientWidth - this.modalDiv.offsetWidth;
        }
        break;
    }
    left = left < 0 ? parentCoords.left : left;
    top = top < 0 ? parentCoords.top : top;
    return { top, left };
  }
  getWrapperAbsoluteCoords(parent, placement) {
    const parentCoords = parent.getBoundingClientRect();
    let left = 0;
    let top = 0;
    switch (placement) {
      case "center":
        left = (parentCoords.width - this.modalDiv.offsetWidth) / 2;
        top = (parentCoords.height - this.modalDiv.offsetHeight) / 2;
        break;
      case "top":
      case "topLeft":
        top = this.getParentOccupiedTop();
        left = this.getParentOccupiedLeft();
        break;
      case "topRight":
        top = this.getParentOccupiedTop();
        left = parentCoords.width - this.getParentOccupiedRight() - this.modalDiv.offsetWidth;
        break;
      case "bottom":
      case "bottomLeft":
        left = 0;
        top = parentCoords.height;
        break;
      case "bottomRight":
        top = parentCoords.height;
        left = parentCoords.width - this.modalDiv.offsetWidth;
        break;
      case "rightTop":
        top = 0;
        left = parentCoords.width;
        break;
    }
    if (placement !== "bottomRight")
      left = left < 0 ? parentCoords.left : left;
    top = top < 0 ? parentCoords.top : top;
    return { top, left };
  }
  _handleOnShow(event) {
    if (this.popupPlacement && this.enabled)
      this.positionAt(this.popupPlacement);
    if (this.enabled && this._onOpen) {
      event.preventDefault();
      this._onOpen(this);
    }
  }
  _handleClick(event) {
    const target = event.target;
    if (this.closeOnBackdropClick) {
      if (!this.modalDiv.contains(target) && this.visible)
        this.visible = false;
    }
    return true;
  }
  updateModal(name, value) {
    if (!isNaN(Number(value)))
      this.modalDiv.style[name] = value + "px";
    else
      this.modalDiv.style[name] = value;
  }
  init() {
    if (!this.wrapperDiv) {
      this.popupPlacement = this.getAttribute("popupPlacement", true);
      this.closeOnBackdropClick = this.getAttribute("closeOnBackdropClick", true);
      this.wrapperDiv = this.createElement("div", this);
      this.showBackdrop = this.getAttribute("showBackdrop", true);
      this.modalDiv = this.createElement("div", this.wrapperDiv);
      this.titleSpan = this.createElement("div", this.modalDiv);
      this.titleSpan.classList.add(titleStyle, "i-modal_header");
      const titleElm = this.createElement("span", this.titleSpan);
      this.title = this.getAttribute("title", true);
      const closeIconAttr = this.getAttribute("closeIcon", true);
      if (closeIconAttr) {
        closeIconAttr.height = closeIconAttr.height || "16px";
        closeIconAttr.width = closeIconAttr.width || "16px";
        closeIconAttr.fill = closeIconAttr.fill || Theme17.colors.primary.main;
        this._icon = new Icon(void 0, closeIconAttr);
        this._icon.classList.add("i-modal-close");
        this._icon._handleClick = () => this.visible = false;
        this.titleSpan.appendChild(this._icon);
      }
      while (this.childNodes.length > 1) {
        this.modalDiv.appendChild(this.childNodes[0]);
      }
      this.modalDiv.classList.add(modalStyle);
      this.modalDiv.classList.add("modal");
      this.addEventListener("show", this._handleOnShow.bind(this));
      window.addEventListener("keydown", (event) => {
        if (!this.visible)
          return;
        if (event.key === "Escape") {
          this.visible = false;
        }
      });
      document.body.addEventListener("click", (event) => {
        var _a;
        if (!this.visible)
          return;
        const target = event.target;
        if (target.nodeName === "I-MODAL" || target.closest("i-modal"))
          return;
        if (!this.contains(target) && !((_a = this.parentElement) == null ? void 0 : _a.contains(target)) && this.closeOnBackdropClick) {
          this.visible = false;
        }
      });
      if (this.attrs["item"])
        this.item = this.attrs["item"];
      super.init();
      this.maxWidth && (this.modalDiv.style.maxWidth = this.maxWidth);
      this.minHeight && this.updateModal("minHeight", this.minHeight);
      this.width && this.updateModal("width", this.width);
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Modal = __decorateClass([
  customElements2("i-modal")
], Modal);

// packages/layout/src/style/panel.css.ts
var panelStyle = style({
  display: "block",
  clear: "both",
  position: "relative"
});
var overflowStyle = style({
  overflow: "hidden"
});
var vStackStyle = style({
  display: "flex",
  flexDirection: "column"
});
var hStackStyle = style({
  display: "flex",
  flexDirection: "row"
});
var gridStyle = style({
  display: "grid"
});
var getStackDirectionStyleClass = (direction) => {
  return style({
    display: "flex",
    flexDirection: direction == "vertical" ? "column" : "row"
  });
};
var getStackMediaQueriesStyleClass = (mediaQueries) => {
  let styleObj = {
    $nest: {}
  };
  for (let mediaQuery of mediaQueries) {
    let mediaQueryRule;
    if (mediaQuery.minWidth && mediaQuery.maxWidth) {
      mediaQueryRule = `@media (min-width: ${mediaQuery.minWidth}) and (max-width: ${mediaQuery.maxWidth})`;
    } else if (mediaQuery.minWidth) {
      mediaQueryRule = `@media (min-width: ${mediaQuery.minWidth})`;
    } else if (mediaQuery.maxWidth) {
      mediaQueryRule = `@media (max-width: ${mediaQuery.maxWidth})`;
    }
    if (mediaQueryRule) {
      styleObj["$nest"][mediaQueryRule] = {};
      if (mediaQuery.properties.direction) {
        styleObj["$nest"][mediaQueryRule]["flexDirection"] = mediaQuery.properties.direction == "vertical" ? "column" : "row";
      }
    }
  }
  return style(styleObj);
};
var justifyContentStartStyle = style({
  justifyContent: "flex-start"
});
var justifyContentCenterStyle = style({
  justifyContent: "center"
});
var justifyContentEndStyle = style({
  justifyContent: "flex-end"
});
var justifyContentSpaceBetweenStyle = style({
  justifyContent: "space-between"
});
var alignItemsStretchStyle = style({
  alignItems: "stretch"
});
var alignItemsStartStyle = style({
  alignItems: "flex-start"
});
var alignItemsCenterStyle = style({
  alignItems: "center"
});
var alignItemsEndStyle = style({
  alignItems: "flex-end"
});
var getTemplateColumnsStyleClass = (columns) => {
  return style({
    gridTemplateColumns: columns.join(" ")
  });
};
var getTemplateRowsStyleClass = (rows) => {
  return style({
    gridTemplateRows: rows.join(" ")
  });
};
var getTemplateAreasStyleClass = (templateAreas) => {
  let templateAreasStr = "";
  for (let i = 0; i < templateAreas.length; i++) {
    templateAreasStr += '"' + templateAreas[i].join(" ") + '" ';
  }
  return style({
    gridTemplateAreas: templateAreasStr
  });
};
var getGridLayoutMediaQueriesStyleClass = (mediaQueries) => {
  let styleObj = {
    $nest: {}
  };
  for (let mediaQuery of mediaQueries) {
    let mediaQueryRule;
    if (mediaQuery.minWidth && mediaQuery.maxWidth) {
      mediaQueryRule = `@media (min-width: ${mediaQuery.minWidth}) and (max-width: ${mediaQuery.maxWidth})`;
    } else if (mediaQuery.minWidth) {
      mediaQueryRule = `@media (min-width: ${mediaQuery.minWidth})`;
    } else if (mediaQuery.maxWidth) {
      mediaQueryRule = `@media (max-width: ${mediaQuery.maxWidth})`;
    }
    if (mediaQueryRule) {
      styleObj["$nest"][mediaQueryRule] = {};
      if (mediaQuery.properties.templateColumns) {
        styleObj["$nest"][mediaQueryRule]["gridTemplateColumns"] = mediaQuery.properties.templateColumns.join(" ");
      }
      if (mediaQuery.properties.templateRows) {
        styleObj["$nest"][mediaQueryRule]["gridTemplateRows"] = mediaQuery.properties.templateRows.join(" ");
      }
      if (mediaQuery.properties.templateAreas) {
        let templateAreasStr = "";
        for (let i = 0; i < mediaQuery.properties.templateAreas.length; i++) {
          templateAreasStr += '"' + mediaQuery.properties.templateAreas[i].join(" ") + '" ';
        }
        styleObj["$nest"][mediaQueryRule]["gridTemplateAreas"] = templateAreasStr;
      }
      if (mediaQuery.properties.display) {
        styleObj["$nest"][mediaQueryRule]["display"] = mediaQuery.properties.display;
      }
    }
  }
  return style(styleObj);
};

// packages/layout/src/stack.ts
var StackLayout = class extends Container {
  constructor(parent, options) {
    super(parent, options);
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
  get direction() {
    return this._direction;
  }
  set direction(value) {
    this._direction = value;
    if (value) {
      let style2 = getStackDirectionStyleClass(value);
      this.classList.add(style2);
    }
  }
  get justifyContent() {
    return this._justifyContent;
  }
  set justifyContent(value) {
    this._justifyContent = value || "start";
    switch (this._justifyContent) {
      case "start":
        this.classList.add(justifyContentStartStyle);
        break;
      case "center":
        this.classList.add(justifyContentCenterStyle);
        break;
      case "end":
        this.classList.add(justifyContentEndStyle);
        break;
      case "space-between":
        this.classList.add(justifyContentSpaceBetweenStyle);
        break;
    }
  }
  get alignItems() {
    return this._alignItems;
  }
  set alignItems(value) {
    this._alignItems = value || "stretch";
    switch (this._alignItems) {
      case "stretch":
        this.classList.add(alignItemsStretchStyle);
        break;
      case "start":
        this.classList.add(alignItemsStartStyle);
        break;
      case "center":
        this.classList.add(alignItemsCenterStyle);
        break;
      case "end":
        this.classList.add(alignItemsEndStyle);
        break;
    }
  }
  get gap() {
    return this._gap;
  }
  set gap(value) {
    this._gap = value || "initial";
    if (typeof this._gap === "number") {
      this.style.gap = this._gap + "px";
    } else {
      this.style.gap = this._gap;
    }
  }
  get wrap() {
    return this._wrap;
  }
  set wrap(value) {
    if (!value)
      return;
    this._wrap = value;
    this.style.flexWrap = this._wrap;
  }
  get mediaQueries() {
    return this._mediaQueries;
  }
  set mediaQueries(value) {
    this._mediaQueries = value;
    let style2 = getStackMediaQueriesStyleClass(this._mediaQueries);
    this.classList.add(style2);
  }
  setAttributeToProperty(propertyName) {
    const prop = this.getAttribute(propertyName, true);
    if (prop)
      this[propertyName] = prop;
  }
  init() {
    super.init();
    this.setAttributeToProperty("direction");
    this.setAttributeToProperty("justifyContent");
    this.setAttributeToProperty("alignItems");
    this.setAttributeToProperty("gap");
    this.setAttributeToProperty("wrap");
    this.setAttributeToProperty("mediaQueries");
  }
};
StackLayout = __decorateClass([
  customElements2("i-stack")
], StackLayout);
var HStack = class extends StackLayout {
  constructor(parent, options) {
    super(parent, options);
  }
  get horizontalAlignment() {
    return this._horizontalAlignment;
  }
  set horizontalAlignment(value) {
    this._horizontalAlignment = value || "start";
    this.justifyContent = value;
  }
  get verticalAlignment() {
    return this._verticalAlignment;
  }
  set verticalAlignment(value) {
    this._verticalAlignment = value || "stretch";
    this.alignItems = value;
  }
  setAttributeToProperty(propertyName) {
    const prop = this.getAttribute(propertyName, true);
    if (prop)
      this[propertyName] = prop;
  }
  init() {
    super.init();
    this.direction = "horizontal";
    this.setAttributeToProperty("horizontalAlignment");
    this.setAttributeToProperty("verticalAlignment");
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
HStack = __decorateClass([
  customElements2("i-hstack")
], HStack);
var VStack = class extends StackLayout {
  constructor(parent, options) {
    super(parent, options);
  }
  get horizontalAlignment() {
    return this._horizontalAlignment;
  }
  set horizontalAlignment(value) {
    this._horizontalAlignment = value || "stretch";
    this.alignItems = value;
  }
  get verticalAlignment() {
    return this._verticalAlignment;
  }
  set verticalAlignment(value) {
    this._verticalAlignment = value || "start";
    this.justifyContent = value;
  }
  setAttributeToProperty(propertyName) {
    const prop = this.getAttribute(propertyName, true);
    if (prop)
      this[propertyName] = prop;
  }
  init() {
    super.init();
    this.direction = "vertical";
    this.setAttributeToProperty("horizontalAlignment");
    this.setAttributeToProperty("verticalAlignment");
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
VStack = __decorateClass([
  customElements2("i-vstack")
], VStack);

// packages/layout/src/panel.ts
var Panel = class extends Container {
  constructor(parent, options) {
    super(parent, options);
  }
  init() {
    super.init();
    this.classList.add(panelStyle);
    if (this.dock) {
      this.classList.add(overflowStyle);
    }
  }
  connectedCallback() {
    if (this.connected) {
      return;
    }
    super.connectedCallback();
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Panel = __decorateClass([
  customElements2("i-panel")
], Panel);

// packages/layout/src/grid.ts
var GridLayout = class extends Container {
  constructor(parent, options) {
    super(parent, options);
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
  get templateColumns() {
    return this._templateColumns;
  }
  set templateColumns(columns) {
    this._templateColumns = columns;
    if (columns) {
      let style2 = getTemplateColumnsStyleClass(columns);
      this.classList.add(style2);
    }
  }
  get templateRows() {
    return this._templateRows;
  }
  set templateRows(rows) {
    this._templateRows = rows;
    if (rows) {
      let style2 = getTemplateRowsStyleClass(rows);
      this.classList.add(style2);
    }
  }
  get templateAreas() {
    return this._templateAreas;
  }
  set templateAreas(value) {
    this._templateAreas = value;
    if (value) {
      let style2 = getTemplateAreasStyleClass(value);
      this.classList.add(style2);
    }
  }
  get autoColumnSize() {
    return this._autoColumnSize;
  }
  set autoColumnSize(value) {
    this._autoColumnSize = value;
    if (value) {
      this.style.gridAutoColumns = value;
    }
  }
  get autoRowSize() {
    return this._autoRowSize;
  }
  set autoRowSize(value) {
    this._autoRowSize = value;
    if (value) {
      this.style.gridAutoRows = value;
    }
  }
  get columnsPerRow() {
    return this._columnsPerRow;
  }
  set columnsPerRow(value) {
    this._columnsPerRow = value;
    this.style.gridTemplateColumns = `repeat(${this._columnsPerRow}, 1fr)`;
  }
  get gap() {
    return this._gap;
  }
  set gap(value) {
    this._gap = value;
    if (value) {
      if (value.row) {
        if (typeof value.row == "number") {
          this.style.rowGap = value.row + "px";
        } else {
          this.style.rowGap = value.row;
        }
      }
      if (value.column) {
        if (typeof value.column == "number") {
          this.style.columnGap = value.column + "px";
        } else {
          this.style.columnGap = value.column;
        }
      }
    }
  }
  get horizontalAlignment() {
    return this._horizontalAlignment;
  }
  set horizontalAlignment(value) {
    this._horizontalAlignment = value;
    this.style.justifyItems = value;
  }
  get verticalAlignment() {
    return this._verticalAlignment;
  }
  set verticalAlignment(value) {
    this._verticalAlignment = value;
    this.style.alignItems = value;
  }
  get autoFillInHoles() {
    return this._autoFillInHoles;
  }
  set autoFillInHoles(value) {
    this._autoFillInHoles = value;
    this.style.gridAutoFlow = this._autoFillInHoles ? "dense" : "row";
  }
  get mediaQueries() {
    return this._mediaQueries;
  }
  set mediaQueries(value) {
    this._mediaQueries = value;
    let style2 = getGridLayoutMediaQueriesStyleClass(this._mediaQueries);
    this.classList.add(style2);
  }
  setAttributeToProperty(propertyName) {
    const prop = this.getAttribute(propertyName, true);
    if (this.id == "thisPnl") {
      console.log(propertyName, prop);
    }
    if (prop)
      this[propertyName] = prop;
  }
  init() {
    super.init();
    this.classList.add(gridStyle);
    this.setAttributeToProperty("templateColumns");
    this.setAttributeToProperty("templateRows");
    this.setAttributeToProperty("templateAreas");
    this.setAttributeToProperty("gap");
    this.setAttributeToProperty("horizontalAlignment");
    this.setAttributeToProperty("verticalAlignment");
    this.setAttributeToProperty("columnsPerRow");
    this.setAttributeToProperty("autoFillInHoles");
    this.setAttributeToProperty("autoColumnSize");
    this.setAttributeToProperty("autoRowSize");
    this.setAttributeToProperty("mediaQueries");
  }
};
GridLayout = __decorateClass([
  customElements2("i-grid-layout")
], GridLayout);

// packages/layout/src/card.ts
var CardLayout = class extends GridLayout {
  constructor(parent, options) {
    super(parent, options);
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
  get cardMinWidth() {
    return this._cardMinWidth;
  }
  set cardMinWidth(value) {
    this._cardMinWidth = value;
    this.updateGridTemplateColumns();
  }
  get columnsPerRow() {
    return this._columnsPerRow;
  }
  set columnsPerRow(value) {
    this._columnsPerRow = value;
    this.updateGridTemplateColumns();
  }
  get cardHeight() {
    return this._cardHeight;
  }
  set cardHeight(value) {
    this._cardHeight = typeof value == "number" ? value + "px" : value;
    this.style.gridAutoRows = this._cardHeight;
  }
  updateGridTemplateColumns() {
    if (this.cardMinWidth && this.columnsPerRow) {
      let minmaxFirstParam = this.gap && this.gap.column ? `max(${this.cardMinWidth}, calc(100%/${this.columnsPerRow} - ${this.gap.column}))` : `max(${this.cardMinWidth}, 100%/${this.columnsPerRow})`;
      this.style.gridTemplateColumns = `repeat(auto-fill, minmax(${minmaxFirstParam}, 1fr))`;
    } else if (this.cardMinWidth) {
      this.style.gridTemplateColumns = `repeat(auto-fill, minmax(min(${this.cardMinWidth}, 100%), 1fr))`;
    } else if (this.columnsPerRow) {
      this.style.gridTemplateColumns = `repeat(${this.columnsPerRow}, 1fr)`;
    }
  }
  setAttributeToProperty(propertyName) {
    const prop = this.getAttribute(propertyName, true);
    if (prop)
      this[propertyName] = prop;
  }
  init() {
    super.init();
    this.autoRowSize = "1fr";
    this.setAttributeToProperty("cardMinWidth");
    this.setAttributeToProperty("cardHeight");
  }
};
CardLayout = __decorateClass([
  customElements2("i-card-layout")
], CardLayout);

// packages/menu/src/style/menu.css.ts
var Theme18 = theme_exports.ThemeVars;
var fadeInRight = keyframes({
  "0%": {
    opacity: 0,
    transform: "translate3d(100%, 0, 0)"
  },
  "100%": {
    opacity: 1,
    transform: "translate3d(0, 0, 0)"
  }
});
var menuStyle = style({
  fontFamily: Theme18.typography.fontFamily,
  fontSize: Theme18.typography.fontSize,
  position: "relative",
  display: "block",
  overflow: "hidden",
  $nest: {
    "*": {
      boxSizing: "border-box"
    },
    ".menu": {
      display: "block",
      margin: 0,
      padding: 0,
      listStyle: "none"
    },
    ".menu-horizontal": {
      display: "flex",
      flexWrap: "nowrap"
    },
    ".menu-inline .menu-item": {
      paddingLeft: "calc(1.5rem + var(--menu-item-level, 0) * 1rem)"
    }
  }
});
var meunItemStyle = style({
  position: "relative",
  display: "block",
  color: Theme18.text.secondary,
  $nest: {
    ".menu-item": {
      position: "relative",
      display: "inline-flex",
      padding: "0 1.5rem",
      border: 0,
      borderRadius: 5,
      cursor: "pointer",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      lineHeight: "36px",
      width: "100%",
      alignItems: "center"
    },
    "&:not(.hide-arrow-icon) .menu-item.has-children": {
      paddingRight: "2.25rem"
    },
    ".menu-item.menu-active, .menu-item.menu-selected, .menu-item:hover": {
      background: Theme18.action.hover,
      color: Theme18.text.primary
    },
    ".menu-item.menu-active > .menu-item-arrow, .menu-item.menu-selected > .menu-item-arrow": {
      transform: "rotate(180deg)",
      transition: "transform 0.25s"
    },
    ".menu-item-arrow": {
      position: "absolute",
      top: "50%",
      right: 18,
      marginTop: -6
    },
    ".menu-item-icon": {
      display: "inline-block",
      verticalAlign: "middle",
      marginRight: "8px",
      textAlign: "center",
      fill: "currentColor",
      $nest: {
        "> i-image": {
          display: "flex"
        }
      }
    },
    "i-link, a": {
      display: "block"
    },
    "i-link > a": {
      textDecoration: "unset"
    },
    "i-link:hover *": {
      color: "unset"
    },
    "li": {
      listStyle: "none"
    },
    "&.hide-arrow-icon .menu-item-arrow": {
      display: "none"
    }
  }
});
var modalStyle2 = style({
  $nest: {
    ".reverse-menu": {
      display: "flex",
      flexDirection: "column-reverse"
    },
    "> div": {
      transform: "unset",
      transition: "background 0.2s cubic-bezier(0.4, 0, 1, 1), color 0.2s cubic-bezier(0.4, 0, 1, 1)",
      overflow: "visible"
    },
    ".modal": {
      background: "#252a48",
      minWidth: 0,
      padding: 0,
      borderRadius: "5px"
    }
  }
});

// packages/menu/src/menu.ts
var menuPopupTimeout = 150;
var Menu = class extends Control {
  constructor() {
    super(...arguments);
    this._oldWidth = 0;
  }
  get mode() {
    return this._mode;
  }
  set mode(value) {
    if (this._mode === value)
      return;
    if (this._mode) {
      this.menuElm.classList.remove(`menu-${this._mode}`);
    }
    this._mode = value;
    this.menuElm.classList.add(`menu-${this._mode}`);
    this.handleUpdateMode(value);
  }
  get data() {
    return this._data;
  }
  set data(value) {
    this.clear();
    this._data = value;
    this.renderItem(value);
  }
  get items() {
    return this._items;
  }
  set items(items) {
    this.clear();
    this._items = items;
  }
  clear() {
    this._items = [];
    this.itemsWidth = [];
    this.menuElm.innerHTML = "";
    if (this.moreItem)
      this.moreItem.items = [];
  }
  async renderItem(items) {
    const _items = [];
    for (const item of items) {
      const menuItem = await MenuItem.create(__spreadProps(__spreadValues({}, item), { linkTo: this, level: 0 }), this);
      this.menuElm.appendChild(menuItem);
      _items.push(menuItem);
    }
    this._items = _items;
    if (this._mode === "horizontal")
      this.handleResize();
  }
  async handleUpdateMode(mode) {
    if (this._mode === "horizontal") {
      if (!this.moreItem) {
        this.moreItem = await MenuItem.create({ title: "\u22EF", linkTo: this, level: 0 });
        this.moreItem.classList.add("more-menu-item", "hide-arrow-icon");
      }
      window.addEventListener("resize", this.handleResize);
    } else {
      window.removeEventListener("resize", this.handleResize);
      if (this.moreItem)
        this.menuElm.removeChild(this.moreItem);
    }
  }
  onResize() {
    const newWidth = Math.ceil(window.innerWidth);
    let offsetWidth = Math.ceil(this.menuElm.offsetWidth);
    let scrollWidth = Math.ceil(this.menuElm.scrollWidth);
    if (this._oldWidth >= newWidth) {
      let i = this._items.length - 1;
      const tmpItems = [];
      while (scrollWidth > offsetWidth && i >= 0) {
        if (!this.menuElm.contains(this.moreItem)) {
          this.menuElm.appendChild(this.moreItem);
        }
        this.itemsWidth.push(this._items[i].offsetWidth);
        tmpItems.push(this._items[i]);
        this._items[i].level = 1;
        this.menuElm.removeChild(this._items[i]);
        this._items.splice(i, 1);
        offsetWidth = Math.ceil(this.menuElm.offsetWidth);
        scrollWidth = Math.ceil(this.menuElm.scrollWidth);
        i--;
      }
      if (tmpItems.length) {
        const moreItems = this.moreItem.items;
        this.moreItem.items = [...moreItems, ...tmpItems];
      }
    } else if (this._oldWidth <= newWidth && this.moreItem.items.length) {
      let i = this.moreItem.items.length - 1 || 0;
      let totalItemsWidth = this._items.reduce((prev, curr) => prev + Math.ceil(curr.offsetWidth), 0) + this.moreItem.offsetWidth + this.itemsWidth[0];
      let index = -1;
      while (totalItemsWidth <= offsetWidth && i >= 0) {
        index = i;
        const menuItem = this.moreItem.items[i];
        this.menuElm.insertBefore(menuItem, this.moreItem);
        this._items.push(menuItem);
        menuItem.level = 0;
        offsetWidth = Math.ceil(this.menuElm.offsetWidth);
        totalItemsWidth += this.itemsWidth.shift() || 0;
        i--;
      }
      if (index != -1) {
        this.moreItem.items = this.moreItem.items.slice(0, index);
      }
      if (!this.moreItem.items.length && this.menuElm.contains(this.moreItem)) {
        this.menuElm.removeChild(this.moreItem);
      }
    }
    this._oldWidth = newWidth;
  }
  handleResize() {
    setTimeout(() => {
      this.onResize();
    }, 200);
  }
  init() {
    if (!this.initialized) {
      super.init();
      this.classList.add(menuStyle);
      this.itemsWidth = [];
      this.handleResize = this.handleResize.bind(this);
      this.onResize = this.onResize.bind(this);
      this.menuElm = this.createElement("ul", this);
      this.menuElm.classList.add("menu");
      this.mode = this.getAttribute("mode", true, "horizontal");
      this.data = this.getAttribute("data", true, []);
      const items = this.getAttribute("items", true, []);
      if (items && items.length)
        this.items = items;
    }
  }
  disconnectedCallback() {
    window.removeEventListener("resize", this.handleResize);
    clearTimeout();
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Menu = __decorateClass([
  customElements2("i-menu")
], Menu);
var MenuItem = class extends Control {
  constructor(parent, options) {
    super(parent, options);
  }
  get title() {
    return this.captionElm.innerHTML;
  }
  set title(value) {
    this.captionElm.innerHTML = value || "";
  }
  get link() {
    if (!this._link) {
      this._link = Link.create({
        href: "#",
        target: "_self",
        font: this.font
      }, this);
    }
    return this._link;
  }
  set link(value) {
    if (this._link) {
      this._link.prepend(this.itemWrapperElm);
      this._link.remove();
    }
    this._link = value;
    if (this._link) {
      this._link.append(this.itemWrapperElm);
      this.itemElm.appendChild(this._link);
    }
  }
  get icon() {
    if (!this._icon) {
      this._icon = Icon.create({
        width: 16,
        height: 16
      }, this);
    }
    ;
    return this._icon;
  }
  set icon(elm) {
    if (this._icon)
      this.itemWrapperElm.removeChild(this._icon);
    this._icon = elm;
    this.icon.classList.add("menu-item-icon");
    if (this._icon)
      this.itemWrapperElm.prepend(this._icon);
  }
  get items() {
    return this._items;
  }
  set items(items) {
    this._items = items;
    this.renderArrowIcon();
    this.renderSubMenuItem();
  }
  set level(value) {
    this.updateLevel(value);
  }
  get selected() {
    return this.itemWrapperElm.classList.contains("menu-selected");
  }
  set selected(isSelected) {
    if (!this.itemWrapperElm)
      return;
    if (isSelected) {
      this.itemWrapperElm.classList.add("menu-selected");
    } else {
      this.itemWrapperElm.classList.remove("menu-selected");
    }
  }
  updateLevel(level) {
    if (this._linkTo) {
      this._level = level;
      if (this.modal) {
        this.modal.popupPlacement = this.getModalPlacement();
        if (this._level > 0) {
          this.modal.position = "absolute";
          this.appendChild(this.modal);
        } else {
          this.modal.position = "fixed";
          this.getModalContainer().appendChild(this.modal);
        }
      }
    }
  }
  menuMode() {
    let mode = "horizontal";
    if (this._linkTo) {
      mode = this._linkTo.mode;
    }
    return mode;
  }
  async renderArrowIcon() {
    if (!this.arrowIcon) {
      this.arrowIcon = await Icon.create({
        width: 12,
        height: 12,
        name: "chevron-down",
        fill: "currentColor"
      });
      this.arrowIcon.classList.add("menu-item-arrow");
    }
    if (this._items && this._items.length) {
      if (!this.itemWrapperElm.contains(this.arrowIcon))
        this.itemWrapperElm.appendChild(this.arrowIcon);
      this.itemWrapperElm.classList.add("has-children");
    } else {
      if (this.itemWrapperElm.contains(this.arrowIcon))
        this.itemWrapperElm.removeChild(this.arrowIcon);
      this.itemWrapperElm.classList.remove("has-children");
    }
  }
  renderSubMenuItem() {
    let mode = this.menuMode();
    if (mode === "inline") {
      this.itemWrapperElm.style.setProperty("--menu-item-level", this._level.toString());
      if (!this._items.length && !this.subMenu)
        return;
      this.itemElm.removeEventListener("mouseenter", this.handleModalOpen);
      this.itemElm.removeEventListener("mouseleave", this.handleModalClose);
      if (this.modal) {
        this.modal.removeEventListener("mouseenter", this.handleModalOpen);
        this.modal.removeEventListener("mouseleave", this.handleModalClose);
        this.modal.remove();
      }
      if (!this.subMenu) {
        this.subMenu = this.createElement("div", this);
        this.subMenu.classList.add("sub-menu");
        this.subMenu.style.display = "none";
      }
      this.subMenu.append(...this.items);
    } else {
      if (this.items && this.items.length) {
        this.itemElm.addEventListener("mouseenter", this.handleModalOpen);
        this.itemElm.addEventListener("mouseleave", this.handleModalClose);
      } else {
        this.itemElm.removeEventListener("mouseenter", this.handleModalOpen);
        this.itemElm.removeEventListener("mouseleave", this.handleModalClose);
      }
      if (this.subMenu) {
        this.subMenu.remove();
      }
      this.itemWrapperElm.style.removeProperty("--menu-item-level");
    }
  }
  async renderItemModal() {
    if (!this.modal) {
      const placement = this.getModalPlacement();
      this.modal = await Modal.create({
        showBackdrop: false,
        height: "auto",
        width: "auto",
        popupPlacement: placement
      });
      this.modal.linkTo = this;
      this.modal.visible = false;
      this.modal.classList.add("menu-item-modal", modalStyle2);
      this.modal.addEventListener("mouseenter", this.handleModalOpen);
      this.modal.addEventListener("mouseleave", this.handleModalClose);
      if (this._level > 0) {
        this.appendChild(this.modal);
      } else {
        this.modal.position = "fixed";
        this.getModalContainer().appendChild(this.modal);
      }
    }
    if (!this.itemPanel) {
      this.itemPanel = await Panel.create();
      if (this.className.includes("more-menu-item")) {
        this.itemPanel.classList.add("reverse-menu");
      }
    }
    this.itemPanel.innerHTML = "";
    if (this._items && this._items.length) {
      this.itemPanel.append(...this.items);
    }
    this.modal.item = this.itemPanel;
  }
  getModalPlacement() {
    let mode = this.menuMode();
    let placement = "bottomLeft";
    switch (mode) {
      case "vertical":
        placement = "rightTop";
        break;
      case "horizontal":
        placement = this._level > 0 ? "rightTop" : "bottomLeft";
    }
    return placement;
  }
  getModalContainer() {
    let span = document.getElementById("modal-container");
    if (!span) {
      span = this.createElement("span", document.body);
      span.id = "modal-container";
    }
    return span;
  }
  setSelectedItem() {
    if (this._linkTo) {
      let mode = this._linkTo.mode;
      this.selected = this.items && this.items.length ? !this.selected : true;
      if (this.subMenu) {
        this.subMenu.style.display = this.selected ? "block" : "none";
      }
      this.handleSelectItem(this._linkTo, mode);
    } else {
      this.selected = true;
    }
  }
  handleSelectItem(menu, mode) {
    menu.items.forEach((item) => {
      const isCurrItem = item.isSameNode(this);
      if (isCurrItem)
        return;
      const containsItem = item.contains(this);
      if (!isCurrItem)
        item.selected = containsItem ? this.selected : false;
      if (mode === "inline" && item.subMenu && !containsItem) {
        item.subMenu.style.display = "none";
      }
      if (item.items)
        this.handleSelectItem(item, mode);
    });
  }
  _handleClick(event) {
    this.setSelectedItem();
    if (this._linkTo.onItemClick)
      this._linkTo.onItemClick(this._linkTo, this);
    return super._handleClick(event, true);
  }
  async handleModalOpen(event) {
    await this.renderItemModal();
    clearTimeout(this.closeTimeout);
    this.itemWrapperElm.classList.add("menu-active");
    this.openTimeout = setTimeout(() => {
      if (this._items && this._items.length)
        this.modal.visible = true;
    }, menuPopupTimeout);
  }
  handleModalClose(event) {
    clearTimeout(this.openTimeout);
    this.itemWrapperElm.classList.remove("menu-active");
    this.closeTimeout = setTimeout(() => {
      if (this.modal)
        this.modal.visible = false;
    }, menuPopupTimeout);
  }
  init() {
    if (!this.initialized) {
      super.init();
      this.classList.add(meunItemStyle);
      this.handleModalOpen = this.handleModalOpen.bind(this);
      this.handleModalClose = this.handleModalClose.bind(this);
      this.itemElm = this.createElement("li", this);
      this.itemWrapperElm = this.createElement("div", this.itemElm);
      this.itemWrapperElm.classList.add("menu-item");
      this.captionElm = this.createElement("span", this.itemWrapperElm);
      this.level = this.getAttribute("level", true, 0);
      this.title = this.getAttribute("title", true);
      const link = this.getAttribute("link", true);
      if (link) {
        link.target = link.target || "_self";
        this.link = new Link(this, link);
      }
      const icon = this.getAttribute("icon", true);
      if (icon) {
        icon.height = icon.height || "16px";
        icon.width = icon.width || "16px";
        this.icon = new Icon(this, icon);
      }
      ;
      const _items = this.getAttribute("items", true, []);
      const menuItems = [];
      for (const item of _items) {
        const menuItem = new MenuItem(void 0, __spreadProps(__spreadValues({}, item), { linkTo: this._linkTo, level: this._level + 1 }));
        menuItems.push(menuItem);
      }
      this.items = menuItems;
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
MenuItem = __decorateClass([
  customElements2("i-menu-item")
], MenuItem);

// packages/module/src/module.ts
function ProxySetter(obj, prop, value) {
  obj["__target"][prop] = value;
  return true;
}
function ProxyGetter(target, prop) {
  if (typeof target.__target[prop] == "function")
    return target.__target[prop].bind(target.__target);
  if (prop == "__target")
    return target["__target"];
  else if (prop == "__path")
    return target["__path"];
  else if (prop == "$renderElms" && target.__target)
    return target.__target["$renderElms"];
  let path;
  if (target.__root)
    path = [];
  else
    path = target.__path || [];
  path.push(prop);
  return ProxyObject({
    __target: target.__target,
    __path: path
  });
}
function ProxyObject(target, root) {
  if (target.__root)
    root = true;
  let path;
  if (root)
    path = [];
  else
    path = target.__path || [];
  if (target.__target)
    target = target.__target;
  return new Proxy({ __root: root, __target: target, __path: path }, {
    get: ProxyGetter,
    set: ProxySetter
  });
}
function getObservable(target, paths) {
  if (isObservable(target))
    return target;
  let path = paths.shift();
  if (paths.length == 0) {
    if (typeof target["observables"] == "function")
      return target["observables"](path);
    else if (path && typeof target == "object")
      return target[path];
  } else
    return getObservable(target[path], paths);
}
function bindObservable(elm, prop) {
  return function(changes) {
    elm[prop] = changes[0].value;
  };
}
var Module = class extends Container {
  constructor(parent, options, defaults) {
    super(parent, options, defaults);
    this.$renderElms = [];
    let proxy = ProxyObject(this, true);
    this.$render = this._render.bind(proxy);
  }
  static async create(options, parent, defaults) {
    let self = new this(parent, options, defaults);
    await self.ready();
    return self;
  }
  init() {
    super.init();
    this.$renderElms = [];
    let proxy = ProxyObject(this, true);
    let render = this.render.bind(proxy);
    let r = window["Render"];
    window["Render"] = this._render.bind(proxy);
    render();
    for (let i = 0; i < this.$renderElms.length; i++) {
      let elm = this.$renderElms[i].elm;
      let options = this.$renderElms[i].options;
      for (let prop in options) {
        let value = options[prop];
        if (value == null ? void 0 : value.__target) {
          let target = value.__target;
          let paths = value.__path;
          let targetValue = this.getValue(target, paths);
          let observable4 = getObservable(target, paths);
          if (isObservable(observable4)) {
            if (paths.length > 0)
              Observe(observable4, bindObservable(elm, prop), { path: paths.join(".") });
            else {
              Observe(observable4, bindObservable(elm, prop));
            }
          }
          elm[prop] = targetValue;
        }
      }
    }
    this.$renderElms = [];
    window["Render"] = r;
  }
  flattenArray(arr) {
    return arr.reduce((result, item) => {
      if (Array.isArray(item)) {
        const temp = this.flattenArray(item);
        result = result.concat(temp);
      } else {
        result.push(item);
      }
      return result;
    }, []);
  }
  _render(...params) {
    let tag = params[0];
    let options = params[1];
    let elm = this.createElement(tag);
    if (options) {
      this.$renderElms.push({
        elm,
        options
      });
      elm.attrs = options;
      for (let v in options) {
        if (v == "id") {
          this[options[v]] = elm;
          elm.id = options[v];
        } else if (typeof options[v] == "function")
          elm[v] = options[v].bind(this);
        else if (typeof options[v] != "object")
          elm.setAttribute(v, options[v]);
      }
    }
    const newParams = this.flattenArray(params);
    for (let i = 2; i < newParams.length; i++) {
      elm.appendChild(newParams[i]);
    }
    this.appendChild(elm);
    return elm;
  }
  render() {
  }
  onLoad() {
  }
};
Module = __decorateClass([
  customElements2("i-module")
], Module);

// packages/label/src/style/label.css.ts
var Theme19 = theme_exports.ThemeVars;
var captionStyle2 = style({
  display: "inline-block",
  color: Theme19.text.primary,
  fontFamily: Theme19.typography.fontFamily,
  fontSize: Theme19.typography.fontSize
});

// packages/label/src/label.ts
var Label = class extends Control {
  constructor(parent, options) {
    super(parent, options);
  }
  get caption() {
    return this.captionSpan.innerHTML;
  }
  set caption(value) {
    this.captionSpan.innerHTML = value || "";
  }
  get link() {
    if (!this._link) {
      this._link = new Link(this, {
        href: "#",
        target: "_blank",
        font: this.font
      });
      this._link.append(this.captionSpan);
      this.appendChild(this._link);
    }
    return this._link;
  }
  set link(value) {
    if (this._link) {
      this._link.prepend(this.captionSpan);
      this._link.remove();
    }
    this._link = value;
    if (this._link) {
      this._link.append(this.captionSpan);
      this.appendChild(this._link);
    }
  }
  set height(value) {
    if (this.captionSpan)
      this.captionSpan.style.height = value + "px";
  }
  set width(value) {
    if (this.captionSpan)
      this.captionSpan.style.width = value + "px";
  }
  init() {
    if (!this.captionSpan) {
      let childNodes = [];
      for (let i = 0; i < this.childNodes.length; i++) {
        childNodes.push(this.childNodes[i]);
      }
      this.captionSpan = this.createElement("span", this);
      this.classList.add(captionStyle2);
      this.caption = this.getAttribute("caption", true) || "";
      if (childNodes && childNodes.length) {
        for (let i = 0; i < childNodes.length; i++) {
          this.captionSpan.appendChild(childNodes[i]);
        }
      }
      const linkAttr = this.getAttribute("link", true);
      if (linkAttr) {
        const link = new Link(this, __spreadProps(__spreadValues({}, linkAttr), {
          font: this.font
        }));
        this.link = link;
      }
      super.init();
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Label = __decorateClass([
  customElements2("i-label")
], Label);

// packages/tree-view/src/style/treeView.css.ts
var Theme20 = theme_exports.ThemeVars;
cssRule("i-tree-view", {
  display: "block",
  overflowY: "auto",
  overflowX: "hidden",
  fontFamily: Theme20.typography.fontFamily,
  fontSize: Theme20.typography.fontSize,
  $nest: {
    ".i-tree-node_content": {
      display: "flex",
      alignItems: "center",
      paddingLeft: "1em",
      border: "1px solid transparent"
    },
    "> i-tree-node > .i-tree-node_content": {
      paddingLeft: 0
    },
    "i-tree-node": {
      display: "block",
      position: "relative"
    },
    "> i-tree-node:not(.has-children) .i-tree-node_icon": {
      display: "none"
    },
    "i-tree-node.is-checked > .i-tree-node_children": {
      display: "block"
    },
    "i-tree-node.is-checked > .i-tree-node_content > .i-tree-node_icon": {
      transform: "rotate(90deg)"
    },
    'input[type="checkbox"]': {
      position: "absolute",
      clip: "rect(0, 0, 0, 0)"
    },
    ".i-tree-node_children": {
      display: "none"
    },
    ".i-tree-node_label": {
      position: "relative",
      display: "inline-block",
      color: Theme20.text.primary,
      cursor: "pointer",
      fontSize: 14
    },
    ".i-tree-node_icon": {
      display: "inline-block",
      transition: "all ease 0.4s",
      visibility: "hidden",
      $nest: {
        "svg": {
          width: 14,
          height: 14
        },
        "i-image": {
          display: "flex"
        }
      }
    },
    "input ~ .i-tree-node_icon, input ~ .is-right > .i-tree-node_icon": {
      visibility: "visible"
    },
    "input ~ .i-tree-node_label": {
      maxWidth: "calc(100% - 15px)"
    },
    "&.i-tree-view": {
      padding: 0,
      position: "relative",
      $nest: {
        ".is-checked:before": {
          borderLeft: `1px solid ${Theme20.divider}`,
          height: "calc(100% - 1em)",
          top: "1em"
        },
        ".i-tree-node_children > .is-checked:before": {
          height: "calc(100% - 25px)",
          top: 25
        },
        "i-tree-node.active > .i-tree-node_content": {
          backgroundColor: Theme20.action.selected,
          border: `1px solid ${Theme20.colors.info.dark}`,
          color: Theme20.text.primary
        },
        ".i-tree-node_content:hover": {
          backgroundColor: Theme20.action.hover,
          $nest: {
            "> .is-right .button-group *": {
              display: "inline-flex"
            },
            ".hide-on-show": {
              display: "none !important"
            }
          }
        },
        'input[type="checkbox"]': {
          margin: 0
        },
        ".i-tree-node_label": {
          padding: ".2rem .3rem",
          maxWidth: "calc(100% - 30px)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }
      }
    },
    "&.shown-line": {
      $nest: {
        "> i-tree-node.has-children": {
          marginLeft: "1em"
        },
        "input ~ .i-tree-node_label:before": {
          background: Theme20.colors.primary.main,
          color: Theme20.colors.primary.contrastText,
          position: "relative",
          zIndex: "1",
          float: "left",
          margin: "0 1em 0 -2em",
          width: "1em",
          height: "1em",
          borderRadius: "0.2em",
          content: "'+'",
          textAlign: "center",
          lineHeight: ".9em"
        },
        "input:checked ~ .i-tree-node_label:before": {
          content: "'\u2013'"
        },
        "i-tree-node": {
          padding: "0 0 1em 1em",
          $nest: {
            "&.active": {
              $nest: {
                "> .i-tree-node_label": {
                  color: "#55f"
                }
              }
            }
          }
        },
        ".i-tree-node_children i-tree-node": {
          padding: ".5em 0 0 .9em"
        },
        "i-tree-node:last-of-type:before": {
          height: "1em",
          bottom: "auto"
        },
        " i-tree-node:before": {
          position: "absolute",
          top: "0",
          bottom: "0",
          left: "-.1em",
          display: "block",
          width: "1px",
          borderLeft: `1px solid ${Theme20.divider}`,
          content: "''"
        },
        ".i-tree-node_icon": {
          display: "none"
        },
        ".i-tree-node_content": {
          paddingLeft: `0 !important`
        },
        "i-tree-node .i-tree-node_label:after": {
          position: "absolute",
          top: ".25em",
          left: "-1em",
          display: "block",
          height: "0.5em",
          width: "1em",
          borderBottom: `1px solid ${Theme20.divider}`,
          borderLeft: `1px solid ${Theme20.divider}`,
          borderRadius: " 0 0 0 0",
          content: "''"
        },
        "i-tree-node input:checked ~ .i-tree-node_label:after": {
          borderRadius: "0 .1em 0 0",
          borderTop: `1px solid ${Theme20.divider}`,
          borderRight: `0.5px solid ${Theme20.divider}`,
          borderBottom: "0",
          borderLeft: "0",
          bottom: "0",
          height: "auto",
          top: ".5em"
        },
        ".i-tree-node_label": {
          overflow: "unset"
        }
      }
    },
    ".text-input": {
      border: "none",
      outline: "0",
      height: "100%",
      width: "100%",
      $nest: {
        "&:focus": {
          borderBottom: `2px solid ${Theme20.colors.primary.main}`
        }
      }
    },
    ".button-group": {
      display: "inline-flex",
      alignItems: "center",
      position: "relative",
      zIndex: 999,
      transition: ".3s all ease",
      gap: 5,
      cursor: "pointer",
      marginLeft: 5,
      $nest: {
        "*": {
          display: "none"
        }
      }
    },
    ".is-right": {
      marginLeft: "auto",
      width: "auto"
    }
  }
});

// packages/tree-view/src/treeView.ts
var Theme21 = theme_exports.ThemeVars;
var beforeExpandEvent = new Event("beforeExpand");
var defaultIcon3 = {
  name: "caret-right",
  fill: Theme21.text.secondary,
  width: 12,
  height: 12
};
var TreeView = class extends Control {
  constructor(parent, options) {
    super(parent, options, {
      editable: false
    });
    this._items = [];
  }
  get activeItem() {
    return this._activeItem;
  }
  set activeItem(value) {
    this._activeItem = value;
    const treeNodes = Array.from(this.querySelectorAll("i-tree-node"));
    treeNodes.forEach((treeNode) => treeNode.active = false);
    if (value)
      value.active = true;
  }
  get data() {
    return this._items.map((node) => node.data);
  }
  set data(value) {
    this.clear();
    this.renderTree(value);
  }
  get items() {
    return this._items || [];
  }
  get editable() {
    return this._editable;
  }
  set editable(value) {
    this._editable = value;
  }
  get actionButtons() {
    return this._actionButtons;
  }
  set actionButtons(value) {
    this._actionButtons = value;
    const groups = Array.from(this.querySelectorAll(".button-group"));
    if (groups && groups.length) {
      groups.forEach((group) => {
        this.renderActions(group);
      });
    }
  }
  async add(parentNode, caption) {
    const childData = { caption, children: [] };
    const childNode = await TreeNode.create(__spreadValues({}, childData), this);
    await this.initNode(childNode);
    childNode.editable = this.editable;
    if (this.onRenderNode && typeof this.onRenderNode === "function")
      this.onRenderNode(this, childNode);
    if (parentNode)
      parentNode.appendNode(childNode);
    else
      this.appendChild(childNode);
    return childNode;
  }
  delete(node) {
    node.remove();
  }
  clear() {
    this.clearInnerHTML();
    this._items = [];
  }
  _setActiveItem(node, event) {
    const prevNode = this.activeItem;
    this.activeItem = node;
    if (event && typeof this.onActiveChange === "function") {
      this.onActiveChange(this, prevNode, event);
    }
    ;
  }
  handleMouseEnter(node) {
    const fn = this.onMouseEnterNode;
    if (fn && typeof fn === "function")
      fn(this, node);
  }
  handleMouseLeave(node) {
    const fn = this.onMouseLeaveNode;
    if (fn && typeof fn === "function")
      fn(this, node);
  }
  handleLazyLoad(node) {
    const fn = this.onLazyLoad;
    if (fn && typeof fn === "function")
      fn(this, node);
  }
  async initNode(node) {
    this.registerEvents(node);
    const groupElm = node.querySelector(".button-group");
    if (this.actionButtons)
      await this.renderActions(groupElm);
  }
  registerEvents(node) {
    node.addEventListener("mouseenter", () => this.handleMouseEnter(node));
    node.addEventListener("mouseleave", () => this.handleMouseLeave(node));
    node.addEventListener("beforeExpand", (event) => this.handleLazyLoad(node));
    if (this.onRenderNode && typeof this.onRenderNode === "function")
      this.onRenderNode(this, node);
  }
  async renderTreeNode(node, parent) {
    const treeNode = await TreeNode.create(node, parent);
    treeNode.editable = this.editable;
    await this.initNode(treeNode);
    if (node.children && !node.isLazyLoad) {
      for (const child2 of node.children) {
        const childWrapper = treeNode.querySelector(".i-tree-node_children");
        if (childWrapper) {
          const childNode = await this.renderTreeNode(child2, parent);
          childWrapper && childWrapper.appendChild(childNode);
        }
      }
    }
    return treeNode;
  }
  async renderTree(value) {
    if (!value || !value.length)
      return;
    for (const node of value) {
      let treeNode = await this.renderTreeNode(node, this);
      this.appendChild(treeNode);
      const activedNode = treeNode.querySelector(".active");
      if (activedNode) {
        treeNode.classList.add("is-checked");
        const inputArr = Array.from(treeNode.querySelectorAll('input[type="checkbox"]'));
        inputArr.forEach((input) => input.checked = true);
        this.activeItem = activedNode;
      }
      this._items.push(treeNode);
    }
  }
  async renderActions(group) {
    if (!group)
      return;
    group.innerHTML = "";
    this.actionButtons.forEach(async (button) => {
      const buttonElm = await Button.create(button);
      if (this.onActionButtonClick && typeof this.onActionButtonClick === "function")
        buttonElm.onClick = (source, event) => {
          var _a;
          event.preventDefault();
          event.stopImmediatePropagation();
          const node = buttonElm.closest("i-tree-node");
          if (node && !((_a = this.activeItem) == null ? void 0 : _a.isSameNode(node)))
            this.activeItem = node;
          this.onActionButtonClick(this, buttonElm, event);
        };
      group.appendChild(buttonElm);
    });
  }
  init() {
    if (!this.initialized) {
      super.init();
      this.classList.add("i-tree-view");
      this.editable = this.getAttribute("editable", true);
      this.actionButtons = this.getAttribute("actionButtons", true);
      this.data = this.attrs["data"];
      const activeAttr = this.attrs["activeItem"];
      activeAttr && (this.activeItem = activeAttr);
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
TreeView = __decorateClass([
  customElements2("i-tree-view")
], TreeView);
var TreeNode = class extends Control {
  constructor(parent, options) {
    super(parent, options);
    this._editable = false;
    options && (this.data = options);
    this.handleEdit = this.handleEdit.bind(this);
  }
  get data() {
    return this._data;
  }
  set data(value) {
    this._data = value;
  }
  get caption() {
    return this._caption;
  }
  set caption(value) {
    this._caption = value;
    if (this._captionElm)
      this._captionElm.innerHTML = value;
  }
  get collapsible() {
    return this._collapsible;
  }
  set collapsible(value) {
    if (typeof value === "boolean") {
      this._collapsible = value;
    } else {
      this._collapsible = true;
    }
  }
  get expanded() {
    return this._expanded;
  }
  set expanded(value) {
    if (typeof value === "boolean") {
      this._expanded = value;
      if (this._expandElm)
        this._expandElm.checked = value;
      if (this._expanded)
        this.classList.add("is-checked");
      else
        this.classList.remove("is-checked");
    } else {
      this._expanded = false;
      if (this._expandElm)
        this._expandElm.checked = false;
      this.classList.remove("is-checked");
    }
  }
  get active() {
    return this._active;
  }
  set active(value) {
    if (typeof value === "boolean") {
      this._active = value;
      this.active ? this.classList.add("active") : this.classList.remove("active");
    } else {
      this._active = false;
      this.classList.remove("active");
    }
  }
  get isLazyLoad() {
    return this._isLazyLoad;
  }
  set isLazyLoad(value) {
    this._isLazyLoad = value;
  }
  get order() {
    return this._order;
  }
  set order(value) {
    this._order = value;
  }
  get editable() {
    return this._editable;
  }
  set editable(value) {
    this._editable = value;
  }
  get rootParent() {
    return this.closest("i-tree-view");
  }
  get icon() {
    if (!this._iconElm) {
      this._iconElm = Icon.create(defaultIcon3);
    }
    ;
    return this._iconElm;
  }
  get rightIcon() {
    if (!this._iconRightElm) {
      this._iconRightElm = Icon.create(defaultIcon3);
    }
    ;
    return this._iconRightElm;
  }
  handleChange(target, oldValue, newValue) {
    const fn = this.rootParent.onChange;
    if (fn && typeof fn === "function")
      fn(this.rootParent, target, oldValue, newValue);
  }
  handleEdit(event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    const captionInput = this.createElement("input");
    captionInput.value = this.caption;
    captionInput.classList.add("text-input");
    this._captionElm.innerHTML = "";
    this._captionElm.appendChild(captionInput);
    captionInput.focus();
    this.click();
    captionInput.addEventListener("blur", (event2) => {
      event2.preventDefault();
      const newValue = captionInput.value;
      this.handleChange(this, this.caption, newValue);
      this._captionElm.innerHTML = "";
      this._captionElm.textContent = newValue;
    });
  }
  edit() {
    this.editable = true;
  }
  appendNode(childNode) {
    if (!this._childNodeElm)
      this.initChildNodeElm();
    this._childNodeElm.appendChild(childNode);
    if (!this.data.children)
      this.data.children = [];
    this.data.children.push(childNode.data);
  }
  initChildNodeElm() {
    this.classList.add("has-children");
    this._expandElm = this.createElement("input", this._wrapperElm);
    this._expandElm.type = "checkbox";
    if (this.expanded)
      this._expandElm.checked = true;
    if (this._iconElm)
      this._wrapperElm.insertBefore(this._expandElm, this._iconElm);
    else
      this._wrapperElm.insertBefore(this._expandElm, this._captionElm);
    this._childNodeElm = this.createElement("div", this);
    this._childNodeElm.classList.add("i-tree-node_children");
  }
  _handleClick(event) {
    const target = event.target;
    if (this.collapsible && this._expandElm) {
      this._expandElm.checked = !this._expandElm.checked;
      if (this._expandElm.checked)
        this.classList.add("is-checked");
      else
        this.classList.remove("is-checked");
    }
    ;
    const parent = this._parent || target.closest("i-tree-view");
    if (parent instanceof TreeView) {
      parent._setActiveItem(this, event);
      if (parent.onClick)
        parent.onClick(parent, event);
    }
    return super._handleClick(event, true);
  }
  _handleDblClick(event) {
    if (this.editable) {
      this.handleEdit(event);
    } else if (this._parent instanceof TreeView) {
      if (this._parent.onDblClick)
        this._parent.onDblClick(this._parent, event);
    }
    ;
    return super._handleClick(event, true);
  }
  init() {
    var _a, _b;
    if (!this._captionElm) {
      this.classList.add("i-tree-node");
      this.data = this.options;
      let caption = this.getAttribute("caption", true);
      let iconAttr = this.getAttribute("icon", true);
      let rightIcon = this.getAttribute("rightIcon", true);
      let collapsible = this.getAttribute("collapsible", true);
      let expanded = this.getAttribute("expanded", true);
      let active = this.getAttribute("active", true);
      let isLazyLoad = this.getAttribute("isLazyLoad", true);
      this.collapsible = collapsible;
      this.expanded = expanded;
      this.active = active;
      this.isLazyLoad = isLazyLoad;
      this._wrapperElm = this.createElement("div", this);
      this._wrapperElm.classList.add("i-tree-node_content");
      const iconData = iconAttr || defaultIcon3;
      iconData.height = iconData.height || "12px";
      iconData.width = iconData.width || "12px";
      this._iconElm = new Icon(void 0, iconData);
      this._iconElm.classList.add("i-tree-node_icon");
      this._wrapperElm.appendChild(this._iconElm);
      this._captionElm = this.createElement("label", this._wrapperElm);
      this._captionElm.classList.add("i-tree-node_label");
      this.caption = caption;
      const rightWrap = this.createElement("div", this._wrapperElm);
      rightWrap.classList.add("is-right");
      const actionGroup = this.createElement("div", rightWrap);
      actionGroup.classList.add("button-group");
      if (rightIcon) {
        rightIcon.height = rightIcon.height || "12px";
        rightIcon.width = rightIcon.width || "12px";
        this._iconRightElm = new Icon(void 0, rightIcon);
        this._iconRightElm.classList.add("i-tree-node_icon");
        rightWrap.appendChild(this._iconRightElm);
        rightWrap.insertBefore(this._iconRightElm, actionGroup);
      }
      if ((_b = (_a = this.data) == null ? void 0 : _a.children) == null ? void 0 : _b.length)
        this.initChildNodeElm();
    }
    super.init();
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
TreeNode = __decorateClass([
  customElements2("i-tree-node")
], TreeNode);

// packages/search/src/style/search.css.ts
var Theme22 = theme_exports.ThemeVars;
cssRule("i-search", {
  fontFamily: Theme22.typography.fontFamily,
  fontSize: Theme22.typography.fontSize,
  position: "relative",
  $nest: {
    ".search": {
      position: "relative",
      display: "inline-block",
      direction: "ltr"
    },
    "i-icon": {
      position: "absolute",
      top: "50%",
      left: "10px",
      display: "inline-block",
      width: "18px",
      height: "18px",
      transform: "translateY(-50%)"
    },
    input: {
      position: "relative",
      verticalAlign: "top",
      height: "2.5rem",
      background: "none",
      border: "1px solid #c5d1db",
      color: "#28333d",
      fontWeight: 400,
      fontSize: "15px",
      borderRadius: "20px",
      lineHeight: "20px",
      outline: "none",
      transition: "width .5s ease",
      width: "170px",
      padding: "12px 8px 8px 38px",
      $nest: {
        "&::placeholder": {
          color: "#28333d",
          opacity: 1
        },
        "&:focus": {
          width: "220px"
        }
      }
    },
    ".dropdown": {
      display: "none",
      position: "absolute",
      top: "100%",
      left: "auto",
      right: 0,
      zIndex: 100,
      fontSize: "14px",
      lineHeight: "1.2em",
      minWidth: "600px",
      padding: "1rem",
      margin: "6px 0 0",
      border: "none",
      borderRadius: "1rem",
      boxShadow: "0 4px 16px rgb(0 0 0 / 25%)",
      background: "#fff",
      $nest: {
        "&.show": {
          display: "block"
        }
      }
    },
    ".suggestion": {
      display: "table",
      width: "100%",
      whiteSpace: "normal",
      border: "none",
      color: "#333",
      cursor: "pointer",
      overflow: "hidden",
      $nest: {
        ".header": {
          display: "block",
          fontSize: "14px",
          fontWeight: 400,
          background: "#ebeff3",
          color: "#28333d",
          borderRadius: "1rem",
          padding: "5px 10px"
        },
        ".column": {
          display: "table-cell",
          borderRight: "1px solid rgba(57,57,57,.3)",
          color: "#555",
          overflow: "hidden",
          padding: "5px 7px 5px 5px",
          textAlign: "right",
          textOverflow: "ellipsis",
          verticalAlign: "top",
          width: "135px",
          maxWidth: "135px",
          minWidth: "135px"
        },
        ".content": {
          display: "table-cell",
          padding: "5px 10px",
          width: "100%"
        },
        ".content-text": {
          display: "block",
          fontWeight: 600
        },
        ".content-paragraph-text": {
          display: "-webkit-box",
          "-webkit-line-clamp": 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        },
        ".highlight": {
          color: "#55f",
          padding: 0,
          background: "none",
          fontWeight: 600
        }
      }
    }
  }
});

// packages/search/src/search.ts
var Search = class extends Control {
  constructor() {
    super(...arguments);
    this.isDropdownShown = false;
    this._keyword = "";
  }
  get keyword() {
    return this._keyword;
  }
  set keyword(value) {
    this._keyword = value;
  }
  buildIndex(documents, fields, storeFields) {
    this.miniSearch = new this.MiniSearch({
      fields,
      storeFields,
      searchOptions: {
        fuzzy: 0.2
      }
    });
    this.miniSearch.addAll(documents);
  }
  search(keyword) {
    return this.miniSearch.search(keyword).slice(0, 5);
  }
  autoSuggest(keyword) {
    return this.miniSearch.autoSuggest(keyword);
  }
  renderSuggestion(data) {
    if (data.length) {
      if (!this.dropdownElm) {
        this.dropdownElm = this.createElement("span", this.wrapperElm);
        this.dropdownElm.classList.add("dropdown", "dataset");
      }
      this.dropdownElm.innerHTML = "";
      const suggestionElm = this.createElement("div", this.dropdownElm);
      suggestionElm.classList.add("suggestion");
      data.map((row) => {
        const suggestionHeader = this.createElement("div", suggestionElm);
        suggestionHeader.classList.add("header");
        suggestionHeader.innerText = row[0].title;
        row.map((item) => {
          const suggestionWrapper = this.createElement("div", suggestionElm);
          suggestionWrapper.classList.add("wrapper");
          suggestionWrapper.addEventListener("click", () => {
            window.location.hash = item.slug;
            this.dropdownElm.classList.remove("show");
          });
          const suggestionColumn = this.createElement("div", suggestionWrapper);
          suggestionColumn.classList.add("column");
          const suggestionColumnText = this.createElement("span", suggestionColumn);
          suggestionColumnText.classList.add("column-text");
          suggestionColumnText.innerHTML = item.subTitle;
          const suggestionContent = this.createElement("div", suggestionWrapper);
          suggestionContent.classList.add("content");
          const suggestionContentText = this.createElement("span", suggestionContent);
          suggestionContentText.classList.add("content-text");
          suggestionContentText.innerHTML = item.subTitle;
          const suggestionParagraphText = this.createElement("span", suggestionContent);
          suggestionParagraphText.classList.add("content-paragraph-text");
          const rgxp = new RegExp("(\\S*.{0,10})?(" + Object.keys(item.match)[0] + ")(.{0,10}\\S*)?", "ig");
          const results = [];
          item.paragraph.replace(rgxp, function(match, $1, $2, $3) {
            results.push(($1 ? "\u2026" + $1 : "") + "<b class='highlight'>" + $2 + "</b>" + ($3 ? $3 + "\u2026" : ""));
          });
          suggestionParagraphText.innerHTML = results.join(" ");
        });
      });
      this.dropdownElm.classList.add("show");
    }
  }
  async initMiniSearch() {
    return new Promise((resolve, reject) => {
      try {
        RequireJS.require([`${LibPath}lib/minisearch/index.min.js`], (minisearch) => {
          this.MiniSearch = minisearch;
          resolve();
        });
      } catch (err) {
        reject(err);
      }
    });
  }
  async init() {
    if (!this.wrapperElm) {
      this.wrapperElm = this.createElement("span", this);
      this.wrapperElm.classList.add("search", "autocomplete");
      const icon = new Icon(this, { name: "search", fill: "#55f" });
      this.wrapperElm.appendChild(icon);
      this.inputElm = this.createElement("input", this.wrapperElm);
      this.inputElm.setAttribute("placeholder", "Search");
      this.inputElm.setAttribute("autocomplete", "off");
      this.inputElm.addEventListener("input", () => {
        const input = document.querySelector("i-search input");
        const results = this.search(input.value);
        const groupResult = Object.values(results.reduce((acc, result) => {
          acc[result.id] = acc[result.id] || [];
          acc[result.id].push(result);
          return acc;
        }, Object.create(null)));
        this.renderSuggestion(groupResult);
      });
      await this.initMiniSearch();
      document.addEventListener("click", (e) => {
        if (!this._enabled)
          return false;
        if (!this.contains(e.target)) {
          if (this.dropdownElm)
            this.dropdownElm.classList.remove("show");
        }
      });
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Search = __decorateClass([
  customElements2("i-search")
], Search);

// packages/switch/src/style/switch.css.ts
var Theme23 = theme_exports.ThemeVars;
cssRule("i-switch", {
  display: "block",
  fontFamily: Theme23.typography.fontFamily,
  fontSize: Theme23.typography.fontSize,
  $nest: {
    ".wrapper": {
      width: "48px",
      height: "22px",
      position: "relative",
      display: "inline-flex",
      flexShrink: 0,
      overflow: "hidden",
      zIndex: 0,
      verticalAlign: "middle"
    },
    ".switch-base": {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      outline: 0,
      border: 0,
      margin: 0,
      cursor: "pointer",
      userSelect: "none",
      verticalAlign: "middle",
      textDecoration: "none",
      padding: "1px",
      borderRadius: "50%",
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      zIndex: 1,
      color: "#fff",
      transition: "left 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      $nest: {
        "&.checked": {
          transform: "translateX(26px)",
          $nest: {
            ".thumb:before": {
              backgroundImage: "var(--checked-background)"
            },
            ".thumb-text:before": {
              content: "var(--thumb-checked-text)"
            },
            "+.track": {
              backgroundColor: "#1976d2",
              $nest: {
                "&::before": {
                  opacity: 1
                },
                "&::after": {
                  opacity: 0
                }
              }
            }
          }
        }
      }
    },
    input: {
      position: "absolute",
      top: 0,
      left: "-100%",
      width: "300%",
      height: "100%",
      opacity: 0,
      margin: 0,
      padding: 0,
      cursor: "inherit",
      zIndex: 1
    },
    ".thumb": {
      width: "16px",
      height: "16px",
      margin: "2px",
      backgroundColor: "currentColor",
      borderRadius: "50%",
      boxShadow: "none"
    },
    ".thumb:before": {
      content: '""',
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "14px",
      backgroundImage: "var(--background)"
    },
    ".thumb.thumb-text:before": {
      content: "var(--thumb-text)",
      position: "absolute",
      width: "inherit",
      height: "inherit",
      top: "auto",
      left: "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff"
    },
    ".track": {
      width: "100%",
      height: "100%",
      zIndex: -1,
      borderRadius: "11px",
      backgroundColor: "#000",
      transition: "opacity 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      $nest: {
        "&::before": {
          content: "var(--checked-text)",
          position: "absolute",
          left: "4px",
          top: "calc(50% - 0.6px)",
          transform: "translateY(-50%)",
          fontSize: "10px",
          color: "white",
          opacity: 0
        },
        "&::after": {
          content: "var(--text)",
          position: "absolute",
          right: "6px",
          top: "calc(50% - 0.6px)",
          transform: "translateY(-50%)",
          fontSize: "10px",
          color: "white",
          opacity: 1
        }
      }
    }
  }
});

// packages/switch/src/switch.ts
var Switch = class extends Control {
  constructor(parent, options) {
    super(parent, options);
  }
  get checked() {
    return this._checked;
  }
  set checked(value) {
    if (this._checked === value)
      return;
    this._checked = value;
    this._checked ? this.switchBaseElm.classList.add("checked") : this.switchBaseElm.classList.remove("checked");
    if (this._checked) {
      if (this.checkedThumbColor)
        this.switchBaseElm.style.color = this.checkedThumbColor;
      if (this.checkedTrackColor)
        this.trackElm.style.backgroundColor = this.checkedTrackColor;
    } else {
      if (this.uncheckedThumbColor)
        this.switchBaseElm.style.color = this.uncheckedThumbColor;
      if (this.uncheckedTrackColor)
        this.trackElm.style.backgroundColor = this.uncheckedTrackColor;
    }
  }
  get checkedThumbColor() {
    return this._checkedThumbColor;
  }
  set checkedThumbColor(value) {
    if (this._checkedThumbColor === value)
      return;
    this._checkedThumbColor = value;
    if (this._checked) {
      this.switchBaseElm.style.color = this.checkedThumbColor;
    }
  }
  get uncheckedThumbColor() {
    return this._uncheckedThumbColor;
  }
  set uncheckedThumbColor(value) {
    if (this._uncheckedThumbColor === value)
      return;
    this._uncheckedThumbColor = value;
    if (!this._checked) {
      this.switchBaseElm.style.color = value;
    }
  }
  get checkedTrackColor() {
    return this._checkedTrackColor;
  }
  set checkedTrackColor(value) {
    if (this._checkedTrackColor === value)
      return;
    this._checkedTrackColor = value;
    if (this._checked) {
      this.trackElm.style.backgroundColor = value;
    }
  }
  get uncheckedTrackColor() {
    return this._uncheckedTrackColor;
  }
  set uncheckedTrackColor(value) {
    if (this._uncheckedTrackColor === value)
      return;
    this._uncheckedTrackColor = value;
    if (!this._checked) {
      this.trackElm.style.backgroundColor = value;
    }
  }
  get checkedText() {
    return this._checkedText;
  }
  set checkedText(value) {
    this._checkedText = value;
    this.trackElm.style.setProperty("--checked-text", `"${value}"`);
  }
  get uncheckedText() {
    return this._uncheckedText;
  }
  set uncheckedText(value) {
    this._uncheckedText = value;
    this.trackElm.style.setProperty("--text", `"${value}"`);
  }
  get checkedThumbText() {
    return this._checkedThumbText;
  }
  set checkedThumbText(value) {
    this._checkedThumbText = value;
    this.thumbElm.classList.add("thumb-text");
    this.thumbElm.style.setProperty("--thumb-text", `'${value || ""}'`);
  }
  get uncheckedThumbText() {
    return this._uncheckedThumbText;
  }
  set uncheckedThumbText(value) {
    this._uncheckedThumbText = value;
    this.thumbElm.classList.add("thumb-text");
    this.thumbElm.style.setProperty("--thumb-checked-text", `'${value || ""}'`);
  }
  setAttributeToProperty(propertyName) {
    const prop = this.getAttribute(propertyName, true);
    if (prop)
      this[propertyName] = prop;
  }
  _handleClick(event) {
    if (!this.onClick) {
      this.checked = !this.checked;
      if (this.onChanged)
        this.onChanged(this, event);
    }
    return super._handleClick(event, true);
  }
  init() {
    if (!this.wrapperElm) {
      this.wrapperElm = this.createElement("div", this);
      this.wrapperElm.classList.add("wrapper");
      this.switchBaseElm = this.createElement("div");
      this.switchBaseElm.classList.add("switch-base");
      this.wrapperElm.appendChild(this.switchBaseElm);
      this.trackElm = this.createElement("div");
      this.trackElm.classList.add("track");
      this.wrapperElm.appendChild(this.trackElm);
      this.inputElm = this.createElement("input");
      this.inputElm.setAttribute("type", "checkbox");
      this.switchBaseElm.appendChild(this.inputElm);
      this.thumbElm = this.createElement("div");
      this.thumbElm.classList.add("thumb");
      this.switchBaseElm.appendChild(this.thumbElm);
      this.rippleElm = this.createElement("div");
      this.rippleElm.classList.add("ripple");
      this.switchBaseElm.appendChild(this.rippleElm);
      this.checked = this.getAttribute("checked", true) || false;
      this.setAttributeToProperty("checkedThumbColor");
      this.setAttributeToProperty("uncheckedThumbColor");
      this.setAttributeToProperty("checkedTrackColor");
      this.setAttributeToProperty("uncheckedTrackColor");
      this.setAttributeToProperty("checkedText");
      this.setAttributeToProperty("uncheckedText");
      this.setAttributeToProperty("checkedThumbText");
      this.setAttributeToProperty("uncheckedThumbText");
      super.init();
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Switch = __decorateClass([
  customElements2("i-switch")
], Switch);

// packages/chart/src/chart.ts
var Chart = class extends Control {
  constructor(parent, options) {
    super(parent, options);
  }
  get data() {
    return this._data;
  }
  set data(value) {
    this._data = value;
    this.drawChart();
  }
  get dataObj() {
    try {
      return JSON.parse(JSON.stringify(this.data));
    } catch (e) {
      return null;
    }
  }
  showLoading() {
    this._chartIns && this._chartIns.showLoading();
  }
  drawChart() {
    if (this._chartIns) {
      this.updateChartOptions();
      return;
    }
    RequireJS.require([`${LibPath}lib/echarts/echarts.min.js`], (echart) => {
      const chartDom = document.getElementById(`main-${this._timeCreated}`);
      if (chartDom) {
        this._chartIns = echart.init(chartDom);
        this.updateChartOptions();
      }
    });
  }
  updateChartOptions() {
    this._chartIns.hideLoading();
    this.dataObj && this._chartIns.setOption(this.dataObj);
  }
  resize() {
    this.dataObj && this._chartIns.resize();
  }
  init() {
    this._timeCreated = Date.now();
    super.init();
    this.style.display = "inline-block";
    let captionDiv = this.createElement("div", this);
    captionDiv.id = `main-${this._timeCreated}`;
    captionDiv.style.display = "inline-block";
    captionDiv.style.height = "100%";
    captionDiv.style.width = "100%";
    this.data = this.getAttribute("data", true);
  }
};

// packages/chart/src/lineChart.ts
var LineChart = class extends Chart {
  constructor(parent, options) {
    super(parent, options);
  }
  init() {
    super.init();
  }
};
LineChart = __decorateClass([
  customElements2("i-line-chart")
], LineChart);

// packages/chart/src/barChart.ts
var BarChart = class extends Chart {
  constructor(parent, options) {
    super(parent, options);
  }
  init() {
    super.init();
  }
};
BarChart = __decorateClass([
  customElements2("i-bar-chart")
], BarChart);

// packages/chart/src/barStackChart.ts
var BarStackChart = class extends Chart {
  constructor(parent, options) {
    super(parent, options);
  }
  init() {
    super.init();
  }
};
BarStackChart = __decorateClass([
  customElements2("i-bar-stack-chart")
], BarStackChart);

// packages/chart/src/pieChart.ts
var PieChart = class extends Chart {
  constructor(parent, options) {
    super(parent, options);
  }
  init() {
    super.init();
  }
};
PieChart = __decorateClass([
  customElements2("i-pie-chart")
], PieChart);

// packages/chart/src/scatterChart.ts
var ScatterChart = class extends Chart {
  constructor(parent, options) {
    super(parent, options);
  }
  init() {
    super.init();
  }
};
ScatterChart = __decorateClass([
  customElements2("i-scatter-chart")
], ScatterChart);

// packages/chart/src/scatterLineChart.ts
var ScatterLineChart = class extends Chart {
  constructor(parent, options) {
    super(parent, options);
  }
  init() {
    super.init();
  }
};
ScatterLineChart = __decorateClass([
  customElements2("i-scatter-line-chart")
], ScatterLineChart);

// packages/upload/src/style/upload.css.ts
var Theme24 = theme_exports.ThemeVars;
cssRule("i-upload", {
  margin: "1rem 0",
  listStyle: "none",
  minHeight: 200,
  minWidth: 200,
  height: "100%",
  width: "100%",
  display: "flex",
  flexWrap: "wrap",
  $nest: {
    ".i-upload-wrapper": {
      position: "relative",
      border: `2px dashed ${Theme24.divider}`,
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "1rem"
    },
    "i-upload-drag": {
      position: "absolute",
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    ".i-upload-drag_area": {
      marginTop: "4rem"
    },
    ".i-upload-dragger_active": {
      border: `2px dashed ${Theme24.colors.primary.main}`,
      backgroundColor: Theme24.colors.info.light,
      opacity: "0.8"
    },
    'input[type="file"]': {
      display: "none"
    },
    ".i-upload_preview": {
      display: "none",
      minHeight: 200,
      position: "relative",
      overflow: "hidden",
      width: "100%",
      height: "100%"
    },
    ".i-upload_preview img": {
      maxHeight: "inherit",
      maxWidth: "100%"
    },
    ".i-upload_preview-img": {
      maxHeight: "inherit",
      maxWidth: "100%",
      display: "table"
    },
    ".i-upload_preview-crop": {
      position: "absolute",
      border: `1px dashed ${Theme24.background.paper}`,
      width: 150,
      height: 150,
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      boxSizing: "border-box",
      boxShadow: "0 0 0 9999em",
      color: "rgba(0, 0, 0, 0.5)",
      overflow: "hidden",
      cursor: "crosshair"
    },
    ".i-upload_preview-remove": {
      position: "absolute",
      top: 0,
      left: 0,
      visibility: "hidden",
      opacity: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0, 0, 0, 0.58)",
      cursor: "pointer",
      $nest: {
        "> span": {
          padding: "1rem",
          border: "2px solid #fff",
          borderRadius: "5px",
          color: "#fff",
          fontWeight: "bold"
        }
      }
    },
    ".i-upload_preview:hover .i-upload_preview-remove.active": {
      visibility: "visible",
      opacity: 1
    },
    ".i-upload_list": {
      margin: "1rem 0 2rem",
      display: "flex",
      gap: 7,
      width: "100%"
    },
    ".i-upload_list.i-upload_list-picture": {
      flexDirection: "row"
    },
    ".i-upload_list.i-upload_list-text": {
      flexDirection: "column",
      alignContent: "center"
    },
    ".i-upload_list.i-upload_list-text i-icon": {
      position: "unset"
    },
    ".i-upload_list-item": {
      display: "inline-flex",
      position: "relative",
      justifyContent: "space-between"
    },
    ".i-upload_list-item:hover i-icon": {
      display: "block"
    },
    ".i-upload_list.i-upload_list-text .i-upload_list-item:hover": {
      backgroundColor: ThemeVars.background.default
    },
    ".i-upload_list.i-upload_list-text .i-upload_list-item": {
      width: "100%",
      padding: ".25rem"
    },
    ".i-upload_list-item .i-upload_list-img": {
      width: 100,
      height: 50,
      objectFit: "cover"
    },
    ".i-upload_list-item i-icon": {
      cursor: "pointer",
      position: "absolute",
      right: -5,
      top: -5,
      display: "none"
    }
  }
});

// packages/upload/src/upload.ts
var Theme25 = theme_exports.ThemeVars;
var fileId = 1;
var genFileId = () => Date.now() + fileId++;
var UploadDrag = class extends Control {
  constructor(parent, options) {
    super(parent, options);
    this.counter = 0;
  }
  get caption() {
    return this._caption;
  }
  set caption(value) {
    this._caption = value;
    this._labelElm.textContent = this._caption || "";
    if (!value)
      this._labelElm.style.display = "none";
    else
      this._labelElm.style.display = "";
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = value;
  }
  handleOnDragEnter(source, event) {
    var _a;
    source.preventDefault();
    if (this.disabled)
      return;
    this.counter++;
    (_a = this.parentElement) == null ? void 0 : _a.classList.add("i-upload-dragger_active");
  }
  handleOnDragOver(source, event) {
    source.preventDefault();
  }
  handleOnDragLeave(source, event) {
    var _a;
    if (this.disabled)
      return;
    this.counter--;
    if (this.counter === 0) {
      (_a = this.parentElement) == null ? void 0 : _a.classList.remove("i-upload-dragger_active");
    }
  }
  handleOnDrop(source, event) {
    var _a, _b;
    source.preventDefault();
    if (this.disabled)
      return;
    this.counter = 0;
    (_a = this.parentElement) == null ? void 0 : _a.classList.remove("i-upload-dragger_active");
    const accept = (_b = this.parentElement) == null ? void 0 : _b.getAttribute("accept");
    if (!accept) {
      if (this.onDrop)
        this.onDrop(this, source.dataTransfer.files);
      return;
    }
    const valids = [].slice.call(source.dataTransfer.files).filter((file) => {
      const { type, name } = file;
      const extension = name.indexOf(".") > -1 ? `.${name.split(".").pop()}` : "";
      const baseType = type.replace(/\/.*$/, "");
      return accept.split(",").map((type2) => type2.trim()).filter((type2) => type2).some((acceptedType) => {
        if (/\..+$/.test(acceptedType)) {
          return extension === acceptedType;
        }
        if (/\/\*$/.test(acceptedType)) {
          return baseType === acceptedType.replace(/\/\*$/, "");
        }
        if (/^[^\/]+\/[^\/]+$/.test(acceptedType)) {
          return type === acceptedType;
        }
        return false;
      });
    });
    if (this.onDrop)
      this.onDrop(this, valids);
  }
  init() {
    if (!this._wrapperElm) {
      super.init();
      this._wrapperElm = this.createElement("div", this);
      this._wrapperElm.classList.add("i-upload-drag_area");
      this._labelElm = this.createElement("span", this._wrapperElm);
      this._labelElm.style.color = Theme25.text.primary;
      this.caption = this.getAttribute("caption", true);
      this.disabled = this.getAttribute("disabled", true);
      this.addEventListener("dragenter", this.handleOnDragEnter.bind(this));
      this.addEventListener("dragover", this.handleOnDragOver.bind(this));
      this.addEventListener("dragleave", this.handleOnDragLeave.bind(this));
      this.addEventListener("drop", this.handleOnDrop.bind(this));
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
UploadDrag = __decorateClass([
  customElements2("i-upload-drag")
], UploadDrag);
var Upload = class extends Control {
  constructor(parent, options) {
    super(parent, options, {
      multiple: false
    });
    this._dt = new DataTransfer();
    this._fileList = [];
    this.handleRemoveImagePreview = (event) => {
      if (!this.isPreviewing || !this.enabled)
        return;
      event.stopPropagation();
      const file = this._dt.files.length ? this._dt.files[0] : null;
      this.clear();
      if (this.onRemoved && file)
        this.onRemoved(this, file);
    };
    this.toBase64 = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  get caption() {
    return this._caption;
  }
  set caption(value) {
    this._caption = value;
  }
  get accept() {
    return this._accept;
  }
  set accept(value) {
    this._accept = value;
    this._fileElm && value && this._fileElm.setAttribute("accept", `${value}`);
  }
  get draggable() {
    return this._draggable;
  }
  set draggable(value) {
    this._draggable = value;
    if (value)
      this.classList.add("el-upload-dragger");
    else
      this.classList.remove("el-upload-dragger");
  }
  get multiple() {
    return this._multiple;
  }
  set multiple(value) {
    this._multiple = value;
    if (this._fileElm && value)
      this._fileElm.setAttribute("multiple", `${value}`);
  }
  get fileList() {
    return this._fileList;
  }
  set fileList(value) {
    this._fileList = value;
    if (value && value.length) {
      value.forEach((f) => {
        this._dt.items.add(f);
      });
      if (this._fileElm) {
        this._fileElm.files = this._dt.files;
        this.updateFileListUI(this._fileElm.files);
      }
    }
  }
  get enabled() {
    return super.enabled;
  }
  set enabled(value) {
    super.enabled = value;
    if (this._uploadDragElm)
      this._uploadDragElm.disabled = !value || !this.draggable;
    if (!this._previewRemoveElm)
      return;
    if (value)
      this._previewRemoveElm.classList.add("active");
    else
      this._previewRemoveElm.classList.remove("active");
  }
  addFile(file) {
    this._dt.items.add(file);
    this._fileList.push(file);
    if (this.onAdded)
      this.onAdded(this, file);
  }
  previewFile(files) {
    if (!files || !files.length)
      return;
    const imgUrl = URL.createObjectURL(files[files.length - 1]);
    this.preview(imgUrl);
  }
  handleUpload(source, event) {
    const files = source.target.files;
    this.proccessFiles(files);
  }
  async proccessFiles(files) {
    if (!files || !files.length)
      return;
    if (!this.fileList)
      this._dt = new DataTransfer();
    for (let file of files) {
      const rawFile = file;
      rawFile.uid = genFileId();
      if (!!this.onUploading)
        await this.checkBeforeUpload(rawFile);
      else
        this.addFile(rawFile);
    }
    this.updateFileListUI(this._dt.files);
    this.previewFile(this._dt.files);
    if (this.onChanged)
      this.onChanged(this, this.fileList);
  }
  async checkBeforeUpload(file) {
    const before = this.onUploading(this, file);
    if (before && before.then) {
      before.then((value) => {
        if (value)
          this.addFile(file);
      }, () => {
        if (this.onRemoved)
          this.onRemoved(this, file);
      });
    } else {
      if (this.onRemoved)
        this.onRemoved(this, file);
    }
  }
  updateFileListUI(files) {
    if (this._fileListElm) {
      this._fileListElm.innerHTML = "";
      for (let file of files) {
        const itemElm = this.createElement("div", this._fileListElm);
        itemElm.classList.add("i-upload_list-item");
        if (file.type.includes("image/")) {
          this._fileListElm.classList.add("i-upload_list-picture");
          const imgElm = new Image();
          imgElm.src = URL.createObjectURL(file);
          imgElm.classList.add("i-upload_list-img");
          imgElm.onload = function() {
            URL.revokeObjectURL(imgElm.src);
          };
          itemElm.appendChild(imgElm);
        } else {
          this._fileListElm.classList.add("i-upload_list-text");
          const spanElm = this.createElement("span", itemElm);
          spanElm.textContent = file.name;
        }
        const removeIcon = new Icon(void 0, {
          width: 12,
          height: 12,
          fill: Theme25.action.active,
          name: "trash"
        });
        itemElm.appendChild(removeIcon);
        removeIcon.addEventListener("click", () => this.handleRemove(file));
      }
      this._fileListElm.style.display = files.length ? "flex" : "none";
    }
  }
  renderPreview() {
    this._previewElm = this.createElement("div", this._wrapperElm);
    this._previewElm.classList.add("i-upload_preview");
    this._wrapImgElm = this.createElement("div", this._previewElm);
    this._wrapImgElm.classList.add("i-upload_preview-img");
    this._previewRemoveElm = this.createElement("div", this._previewElm);
    if (this.enabled) {
      this._previewRemoveElm.classList.add("active");
    } else {
      this._previewRemoveElm.classList.remove("active");
    }
    this._previewRemoveElm.classList.add("i-upload_preview-remove");
    this._previewRemoveElm.onclick = this.handleRemoveImagePreview;
    const span = this.createElement("span", this._previewRemoveElm);
    span.innerHTML = "Click to remove";
  }
  handleRemove(file) {
    const rawFile = file;
    for (let i = 0; i < this._dt.items.length; i++) {
      if (rawFile.uid === this._dt.files[i].uid) {
        this._dt.items.remove(i);
        this.fileList = this._fileList.filter((f) => f.uid !== rawFile.uid);
        if (this.onRemoved)
          this.onRemoved(this, file);
        break;
      }
    }
    this._fileElm.files = this._dt.files;
    this.updateFileListUI(this._dt.files);
    if (!this._dt.items.length)
      this.clear();
  }
  preview(uri) {
    if (!uri)
      return;
    this.isPreviewing = true;
    this._wrapImgElm.innerHTML = "";
    this._previewImgElm = new Image2();
    this._wrapImgElm.appendChild(this._previewImgElm);
    this._previewImgElm.url = uri;
    this._previewElm.style.display = "block";
    this._wrapperFileElm.style.display = "none";
    if (this._uploadDragElm)
      this._uploadDragElm.style.display = "none";
  }
  clear() {
    this._fileElm.value = "";
    this._wrapperFileElm.style.display = "block";
    if (this._uploadDragElm)
      this._uploadDragElm.style.display = this.draggable ? "flex" : "none";
    if (this._previewElm)
      this._previewElm.style.display = "none";
    this._wrapImgElm && (this._wrapImgElm.innerHTML = "");
    if (this._fileListElm)
      this._fileListElm.style.display = "none";
    this._dt = new DataTransfer();
    this.isPreviewing = false;
    this._fileList = [];
  }
  addFiles() {
  }
  addFolder() {
  }
  init() {
    if (!this.initialized) {
      super.init();
      this._wrapperElm = this.createElement("div", this);
      this._wrapperElm.classList.add("i-upload-wrapper");
      this._wrapperFileElm = this.createElement("div", this._wrapperElm);
      this.caption = this.getAttribute("caption", true);
      this.draggable = this.getAttribute("draggable", true, false);
      this._uploadDragElm = new UploadDrag();
      this._wrapperElm.appendChild(this._uploadDragElm);
      this._uploadDragElm.caption = this.caption;
      this._uploadDragElm.disabled = !this.enabled || !this.draggable;
      this._uploadDragElm.onDrop = (source, value) => {
        value && this.proccessFiles(value);
      };
      this._fileElm = this.createElement("input", this._wrapperFileElm);
      this._fileElm.type = "file";
      this.multiple = this.getAttribute("multiple", true);
      this.accept = this.getAttribute("accept");
      if (!this.enabled)
        this._fileElm.setAttribute("disabled", "");
      const btn = new Button(this, {
        caption: "Choose an image"
      });
      btn.className = `i-upload_btn ${!this.enabled && "disabled"}`;
      this._wrapperFileElm.appendChild(btn);
      const fileListAttr = this.getAttribute("showFileList", true);
      if (fileListAttr && !this._fileListElm) {
        this._fileListElm = this.createElement("div", this);
        this._fileListElm.classList.add("i-upload_list");
        this._fileListElm.style.display = "none";
      }
      this.renderPreview();
      const fileList = this.getAttribute("fileList", true);
      fileList && (this.fileList = fileList);
      this._wrapperElm.addEventListener("click", (event) => {
        event.stopPropagation();
        if (!this.enabled)
          return;
        if (!this.isPreviewing)
          this._fileElm.click();
      });
      this._fileElm.addEventListener("change", this.handleUpload.bind(this));
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Upload = __decorateClass([
  customElements2("i-upload")
], Upload);

// packages/iframe/src/iframe.ts
var Iframe = class extends Control {
  constructor(parent, options) {
    super(parent, options, {
      width: 800,
      height: 600
    });
    window.addEventListener("mousedown", () => {
      if (this.iframeElm)
        this.iframeElm.style.pointerEvents = "none";
    });
    window.addEventListener("mouseup", () => {
      if (this.iframeElm)
        this.iframeElm.style.pointerEvents = "auto";
    });
  }
  reload() {
    let iframe = this.iframeElm;
    return new Promise((resolve) => {
      iframe.src = iframe.src;
      iframe.onload = function() {
        resolve();
        iframe.onload = null;
      };
    });
  }
  get url() {
    return this._url;
  }
  set url(value) {
    this._url = value;
    if (value && !this.iframeElm) {
      this.iframeElm = this.createElement("iframe", this);
    }
    if (this.iframeElm) {
      this.iframeElm.src = value;
      this.iframeElm.width = "100%";
      this.iframeElm.height = "100%";
      this.iframeElm.setAttribute("frameBorder", "0");
    }
  }
  init() {
    super.init();
    this.url = this.getAttribute("url", true);
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Iframe = __decorateClass([
  customElements2("i-iframe")
], Iframe);

// packages/pagination/src/style/pagination.css.ts
var Theme26 = theme_exports.ThemeVars;
cssRule("i-pagination", {
  display: "block",
  width: "100%",
  maxWidth: "100%",
  verticalAlign: "baseline",
  fontFamily: Theme26.typography.fontFamily,
  fontSize: Theme26.typography.fontSize,
  lineHeight: "25px",
  color: Theme26.text.primary,
  "$nest": {
    ".pagination": {
      display: "inline-flex"
    },
    ".pagination a": {
      color: Theme26.text.primary,
      float: "left",
      padding: "8px 16px",
      textDecoration: "none",
      transition: "background-color .3s",
      border: "1px solid #ddd"
    },
    ".pagination a.active": {
      backgroundColor: "#4CAF50",
      color: "white",
      border: "1px solid #4CAF50"
    },
    ".pagination a.disabled": {
      color: Theme26.text.disabled,
      pointerEvents: "none"
    },
    ".pagination-main": {
      display: "flex"
    }
  }
});

// packages/pagination/src/pagination.ts
var pagerCount = 7;
var defaultCurrentPage = 1;
var pageSize = 10;
var Pagination = class extends Control {
  constructor(parent, options) {
    super(parent, options, { pageSize });
    this._showPrevMore = false;
    this._showNextMore = false;
  }
  get totalPage() {
    return this._totalPage;
  }
  set totalPage(value) {
    if (this._totalPage === value)
      return;
    this._totalPage = value;
    this.hideNexPrev();
    this.renderPageItem(value);
  }
  get currentPage() {
    return this._curPage;
  }
  set currentPage(value) {
    const oldData = this._curPage;
    this._curPage = value || defaultCurrentPage;
    const index = value - 1;
    this.pageItems[index] && this.onActiveItem(this.pageItems[index]);
    if (this.onPageChanged && oldData !== this._curPage)
      this.onPageChanged(this, oldData);
  }
  get pageSize() {
    return this._pageSize || pageSize;
  }
  set pageSize(value) {
    this._pageSize = value;
  }
  onActiveItem(item) {
    if (this.activeItem) {
      this.activeItem.classList.remove("active");
    }
    if (item) {
      item.classList.add("active");
      this.activeItem = item;
    }
  }
  onDisablePrevNext() {
    if (this._prevElm)
      this.currentPage <= 1 ? this._prevElm.classList.add("disabled") : this._prevElm.classList.remove("disabled");
    if (this._nextElm)
      this.currentPage >= this.totalPage ? this._nextElm.classList.add("disabled") : this._nextElm.classList.remove("disabled");
  }
  _handleOnClickIndex(value, event) {
    if (!this.enabled)
      return;
    this.currentPage = value;
    this.onActiveItem(event.target);
    this.onDisablePrevNext();
  }
  _handleOnClickMore(value, event) {
    this.currentPage = this.currentPage + value * (pagerCount - 2);
    this.renderPageItem(this.totalPage);
  }
  _handleOnNext(event) {
    if (!this.enabled || this.currentPage >= this.totalPage)
      return;
    const nextPage = Number(this._curPage) <= 0 ? 1 : Number(this._curPage) + 1;
    this.currentPage = nextPage;
    this.renderPageItem(this.totalPage);
    this.onDisablePrevNext();
  }
  _handleOnPrev(event) {
    if (!this.enabled || this.currentPage <= 1)
      return;
    const prevPage = Number(this._curPage) - 1;
    this.currentPage = prevPage;
    this.renderPageItem(this.totalPage);
    this.onDisablePrevNext();
  }
  onMouseenter(direction, event) {
    if (!this.enabled)
      return;
    const target = event.target;
    target.innerHTML = direction === -1 ? "<<" : ">>";
  }
  renderEllipsis(step) {
    let item = this.createElement("a", this._mainPagiElm);
    item.id = step === -1 ? "prevMoreElm" : "nextMoreElm";
    item.setAttribute("href", "#");
    item.innerHTML = "...";
    item.classList.add("paginate_button");
    item.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._handleOnClickMore(step, e);
    });
    item.addEventListener("mouseenter", (e) => {
      e.preventDefault();
      this.onMouseenter(step, e);
    });
    item.addEventListener("mouseout", (e) => {
      e.preventDefault();
      item.innerHTML = "...";
    });
  }
  renderPage(index) {
    let item = this.createElement("a", this._mainPagiElm);
    this.pageItems.push(item);
    item.setAttribute("href", "#");
    item.innerHTML = `${index}`;
    item.classList.add("paginate_button");
    item.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._handleOnClickIndex(index, e);
    });
    if (index === this.currentPage)
      this.onActiveItem(item);
  }
  updatePagers() {
    const halfPagerCount = (pagerCount - 1) / 2;
    const currentPage = Number(this.currentPage);
    const pageCount = Number(this.totalPage);
    let showPrevMore = false;
    let showNextMore = false;
    if (pageCount > pagerCount) {
      if (currentPage > pagerCount - halfPagerCount) {
        showPrevMore = true;
      }
      if (currentPage < pageCount - halfPagerCount) {
        showNextMore = true;
      }
    }
    const array = [];
    if (showPrevMore && !showNextMore) {
      const startPage = pageCount - (pagerCount - 2);
      for (let i = startPage; i < pageCount; i++) {
        array.push(i);
      }
    } else if (!showPrevMore && showNextMore) {
      for (let i = 2; i < pagerCount; i++) {
        array.push(i);
      }
    } else if (showPrevMore && showNextMore) {
      const offset = Math.floor(pagerCount / 2) - 1;
      for (let i = currentPage - offset; i <= currentPage + offset; i++) {
        array.push(i);
      }
    } else {
      for (let i = 2; i < pageCount; i++) {
        array.push(i);
      }
    }
    this.pagers = array;
    this._showPrevMore = showPrevMore;
    this._showNextMore = showNextMore;
  }
  renderPageItem(size) {
    this.visible = size !== 0;
    this._mainPagiElm.innerHTML = "";
    this.pageItems = [];
    if (size > 0) {
      if (size > pagerCount) {
        this.updatePagers();
        this.renderPage(1);
        this._showPrevMore && this.renderEllipsis(-1);
        for (let i = 0; i < this.pagers.length; i++) {
          this.renderPage(this.pagers[i]);
        }
        this._showNextMore && this.renderEllipsis(1);
        this.renderPage(size);
      } else {
        for (let i = 1; i <= size; i++) {
          this.renderPage(i);
        }
      }
    } else if (size < 0) {
      const _s = this.pageItems.length + size;
      for (let i = this.pageItems.length - 1; i >= _s; i--) {
        this._mainPagiElm.removeChild(this.pageItems[i]);
        this.pageItems.pop();
      }
    }
  }
  hideNexPrev() {
    if (this.totalPage >= 1) {
      this._prevElm && this._prevElm.classList.remove("hidden");
      this._nextElm && this._nextElm.classList.remove("hidden");
      this.onDisablePrevNext();
    }
  }
  init() {
    if (!this._paginationDiv) {
      this.pageItems = [];
      this._paginationDiv = this.createElement("div", this);
      this._paginationDiv.classList.add("pagination");
      this._prevElm = this.createElement("a", this._paginationDiv);
      this._prevElm.setAttribute("href", "#");
      this._prevElm.innerHTML = "&laquo;";
      this._prevElm.classList.add("paginate_button", "previous", "hidden");
      this._prevElm.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this._handleOnPrev(e);
      });
      this._mainPagiElm = this.createElement("div", this._paginationDiv);
      this._mainPagiElm.classList.add("pagination-main");
      this.currentPage = +this.getAttribute("currentPage", true, defaultCurrentPage);
      this.totalPage = +this.getAttribute("totalPage", true, 0);
      this.pageSize = +this.getAttribute("pageSize", true, pageSize);
      this._nextElm = this.createElement("a", this._paginationDiv);
      this._nextElm.setAttribute("href", "#");
      this._nextElm.innerHTML = "&raquo;";
      this._nextElm.classList.add("paginate_button", "next", "hidden");
      this._nextElm.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this._handleOnNext(e);
      });
      this.onDisablePrevNext();
    }
    super.init();
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Pagination = __decorateClass([
  customElements2("i-pagination")
], Pagination);

// packages/progress/src/style/progress.css.ts
var Theme27 = theme_exports.ThemeVars;
var loading = keyframes({
  "0%": {
    left: "-100%"
  },
  "100%": {
    left: "100%"
  }
});
cssRule("i-progress", {
  display: "block",
  maxWidth: "100%",
  verticalAlign: "baseline",
  fontFamily: Theme27.typography.fontFamily,
  fontSize: Theme27.typography.fontSize,
  color: Theme27.text.primary,
  position: "relative",
  $nest: {
    "&.is-loading .i-progress_overlay": {
      transform: "translateZ(0)",
      animation: `${loading} 3s infinite`
    },
    ".i-progress": {
      boxSizing: "border-box",
      margin: 0,
      minWidth: 0,
      width: "100%",
      display: "block"
    },
    ".i-progress--grid": {
      display: "grid",
      gap: 20,
      gridTemplateColumns: "auto 1fr 80px",
      alignItems: "center"
    },
    ".i-progress--exception": {
      $nest: {
        "> .i-progress_wrapbar > .i-progress_overlay": {
          backgroundColor: Theme27.colors.error.light
        },
        "> .i-progress_wrapbar > .i-progress_bar .i-progress_bar-item": {
          backgroundColor: Theme27.colors.error.light
        },
        ".i-progress_item.i-progress_item-start": {
          borderColor: Theme27.colors.error.light
        },
        ".i-progress_item.i-progress_item-end": {}
      }
    },
    ".i-progress--success": {
      $nest: {
        "> .i-progress_wrapbar > .i-progress_overlay": {
          backgroundColor: Theme27.colors.success.light
        },
        "> .i-progress_wrapbar > .i-progress_bar .i-progress_bar-item": {
          backgroundColor: Theme27.colors.success.light
        },
        ".i-progress_item.i-progress_item-start": {
          borderColor: Theme27.colors.success.light
        },
        ".i-progress_item.i-progress_item-end": {}
      }
    },
    ".i-progress--warning": {
      $nest: {
        "> .i-progress_wrapbar > .i-progress_overlay": {
          backgroundColor: Theme27.colors.warning.light
        },
        "> .i-progress_wrapbar > .i-progress_bar .i-progress_bar-item": {
          backgroundColor: Theme27.colors.warning.light
        },
        ".i-progress_item.i-progress_item-start": {
          borderColor: Theme27.colors.warning.light
        },
        ".i-progress_item.i-progress_item-end": {}
      }
    },
    ".i-progress--active": {
      $nest: {
        "> .i-progress_wrapbar > .i-progress_overlay": {
          backgroundColor: Theme27.colors.primary.light
        },
        "> .i-progress_wrapbar > .i-progress_bar .i-progress_bar-item": {
          backgroundColor: Theme27.colors.primary.light
        },
        ".i-progress_item.i-progress_item-start": {
          backgroundColor: "transparent",
          borderColor: Theme27.colors.primary.light
        }
      }
    },
    ".i-progress_wrapbar": {
      position: "relative",
      overflow: "hidden",
      boxSizing: "border-box",
      minWidth: 0,
      order: 2,
      minHeight: 2,
      $nest: {
        ".i-progress_bar": {
          boxSizing: "border-box",
          width: "100%",
          height: "100%",
          position: "absolute",
          display: "flex",
          alignItems: "center",
          gap: "1px",
          $nest: {
            "&.has-bg": {
              backgroundColor: Theme27.divider
            },
            ".i-progress_bar-item": {
              flex: "auto",
              backgroundColor: Theme27.divider
            }
          }
        },
        ".i-progress_overlay": {
          position: "absolute",
          minWidth: 0,
          height: "100%"
        }
      }
    },
    ".i-progress_item": {
      boxSizing: "border-box",
      margin: "0px -1.2px 0px 0px",
      minWidth: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      $nest: {
        "&.i-progress_item-start": {
          borderWidth: 1,
          borderStyle: "solid",
          borderImage: "initial",
          borderRadius: 14,
          borderColor: Theme27.divider,
          padding: "4px 12px",
          order: 1
        },
        "&.i-progress_item-end": {
          boxSizing: "border-box",
          margin: 0,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          cursor: "default",
          position: "relative",
          order: 3,
          alignItems: "flex-start"
        }
      }
    },
    "&.i-progress--stretch": {
      $nest: {
        "@media only screen and (max-width: 768px)": {
          $nest: {
            ".i-progress_wrapbar": {
              display: "none !important"
            },
            ".i-progress_item-end": {
              display: "none !important"
            },
            ".is-mobile": {
              display: "inline-block"
            },
            ".i-progress--grid": {
              gridTemplateColumns: "auto",
              justifyContent: "center"
            }
          }
        }
      }
    },
    ".i-progress--circle ~ .i-progress_text": {
      position: "absolute",
      top: "50%",
      left: 0,
      width: "100%",
      textAlign: "center",
      transform: "translateY(-50%)"
    },
    ".i-progress--line ~ .i-progress_text": {
      display: "inline-block",
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)"
    }
  }
});

// packages/progress/src/progress.ts
var Theme28 = theme_exports.ThemeVars;
var defaultVals = {
  percent: 0,
  height: 20,
  loading: false,
  steps: 1,
  type: "line"
};
var Progress = class extends Control {
  constructor(parent, options) {
    super(parent, options, __spreadValues({}, defaultVals));
    if (options == null ? void 0 : options.onRenderStart)
      this.onRenderStart = options.onRenderStart;
    if (options == null ? void 0 : options.onRenderEnd)
      this.onRenderEnd = options.onRenderEnd;
  }
  get percent() {
    return this._percent;
  }
  set percent(value) {
    this._percent = +value < 0 ? 0 : +value > 100 ? 100 : +value;
    const overlayElm = this.querySelector(".i-progress_overlay");
    if (overlayElm)
      overlayElm.style.width = `${this._percent}%`;
    if (this._percent > 0 && this._percent < 100)
      this._wrapperElm.classList.add("i-progress--active");
    else if (this._percent === 100)
      this._wrapperElm.classList.add("i-progress--success");
    if (this.format) {
      if (!this._textElm) {
        this._textElm = this.createElement("span", this);
        this._textElm.classList.add("i-progress_text");
        this._textElm.style.fontSize = this.progressTextSize + "px";
        this._textElm.style.color = this.strokeColor;
      }
      this._textElm.innerHTML = this.format(this._percent);
    }
    if (this.type === "circle") {
      this.updateCircleInner();
    }
  }
  get strokeColor() {
    return this._strokeColor || Theme28.colors.primary.main;
  }
  set strokeColor(value) {
    this._strokeColor = value;
  }
  get loading() {
    return this._loading;
  }
  set loading(value) {
    this._loading = value;
    if (value)
      this.classList.add("is-loading");
    else
      this.classList.remove("is-loading");
  }
  get steps() {
    return this._steps;
  }
  set steps(value) {
    this._steps = +value;
    const wrapbarElm = this.querySelector(".i-progress_bar");
    const overlayElm = this.querySelector(".i-progress_overlay");
    wrapbarElm.innerHTML = "";
    if (this._steps > 1) {
      const unitStep = 100 / this._steps;
      const percentStep = Math.ceil(this.percent / unitStep);
      const remainder = this.percent % unitStep;
      for (let i = 0; i < this._steps; i++) {
        const barItem = this.createElement("div");
        barItem.style.width = unitStep + "%";
        barItem.style.height = `${i + 1}px`;
        if (i === percentStep - 1 && remainder !== 0) {
          const childElm = this.createElement("div");
          childElm.classList.add("i-progress_bar-item");
          childElm.style.width = remainder * 100 / unitStep + "%";
          childElm.style.height = `${i + 1}px`;
          barItem.appendChild(childElm);
        } else if (i < percentStep) {
          barItem.classList.add("i-progress_bar-item");
        }
        wrapbarElm.appendChild(barItem);
      }
      wrapbarElm.classList.remove("has-bg");
      overlayElm && (overlayElm.style.display = "none");
    } else {
      wrapbarElm.classList.add("has-bg");
      overlayElm && (overlayElm.style.display = "block");
    }
  }
  get type() {
    return this._type;
  }
  set type(value) {
    this._type = value;
    if (value === "circle") {
      this.renderCircle();
    } else {
      this.renderLine();
    }
  }
  get strokeWidth() {
    return this._strokeWidth;
  }
  set strokeWidth(value) {
    this._strokeWidth = value || 2;
    const overlayElm = this.querySelector(".i-progress_wrapbar");
    if (overlayElm)
      overlayElm.style.height = `${this._strokeWidth}px`;
  }
  get font() {
    return {
      color: this._textElm.style.color,
      name: this._textElm.style.fontFamily,
      size: this._textElm.style.fontSize,
      bold: this._textElm.style.fontStyle.indexOf("bold") >= 0,
      style: this._textElm.style.fontStyle
    };
  }
  set font(value) {
    if (this._textElm) {
      this._textElm.style.color = value.color || "";
      this._textElm.style.fontSize = value.size || "";
      this._textElm.style.fontWeight = value.bold ? "bold" : "";
      this._textElm.style.fontFamily = value.name || "";
      this._textElm.style.fontStyle = value.style || "";
    }
  }
  get relativeStrokeWidth() {
    return (this.strokeWidth / +this.width * 100).toFixed(1);
  }
  get radius() {
    if (this.type === "circle") {
      const value = 50 - parseFloat(this.relativeStrokeWidth) / 2;
      return parseInt(value.toFixed(1), 10);
    } else {
      return 0;
    }
  }
  get trackPath() {
    const radius = this.radius;
    return `
          M 50 50
          m 0 -${radius}
          a ${radius} ${radius} 0 1 1 0 ${radius * 2}
          a ${radius} ${radius} 0 1 1 0 -${radius * 2}
          `;
  }
  get perimeter() {
    return 2 * Math.PI * this.radius;
  }
  get rate() {
    return 1;
  }
  get strokeDashoffset() {
    const offset = -1 * this.perimeter * (1 - this.rate) / 2;
    return `${offset}px`;
  }
  get trailPathStyle() {
    const strokeDasharray = `${this.perimeter * this.rate}px, ${this.perimeter}px`;
    const strokeDashoffset = this.strokeDashoffset;
    return `stroke-dasharray: ${strokeDasharray}; stroke-dashoffset: ${strokeDashoffset};`;
  }
  get circlePathStyle() {
    const strokeDasharray = `${this.perimeter * this.rate * (this.percent / 100)}px, ${this.perimeter}px`;
    const strokeDashoffset = this.strokeDashoffset;
    const transition = "stroke-dasharray 0.6s ease 0s, stroke 0.6s ease";
    return `stroke-dasharray: ${strokeDasharray}; stroke-dashoffset: ${strokeDashoffset}; transition: ${transition};`;
  }
  get stroke() {
    let ret = this.strokeColor;
    if (this.percent === 100)
      ret = Theme28.colors.success.main;
    return ret;
  }
  get trackColor() {
    return Theme28.divider;
  }
  get progressTextSize() {
    return this.type === "line" ? 12 + this.strokeWidth * 0.4 : +this.width * 0.111111 + 2;
  }
  renderLine() {
    this._wrapperElm.classList.add("i-progress--line");
    this._barElm = this.createElement("div", this._wrapperElm);
    this._barElm.classList.add("i-progress_wrapbar");
    this._barElm.innerHTML = `<div class="i-progress_bar"></div><div class="i-progress_overlay" style="background-color:${this.strokeColor}"></div>`;
  }
  renderCircle() {
    this._wrapperElm.classList.add("i-progress--circle");
    if (this.width)
      this.height = this.width;
  }
  renderCircleInner() {
    const templateHtml = `<svg viewBox="0 0 100 100">
            <path class="i-progress-circle__track"
            d="${this.trackPath}"
            stroke="${this.trackColor}"
            stroke-width="${this.relativeStrokeWidth}"
            fill="none"
            style="${this.trailPathStyle}"></path>
            <path
            class="i-progress-circle__path"
            d="${this.trackPath}"
            stroke="${this.stroke}"
            fill="none"
            stroke-linecap="round"
            stroke-width="${this.percent ? this.relativeStrokeWidth : 0}"
            style="${this.circlePathStyle}"></path>
        </svg>`;
    this._wrapperElm.innerHTML = "";
    this._wrapperElm.innerHTML = templateHtml;
  }
  updateCircleInner() {
    const svgPath = this._wrapperElm.querySelector(".i-progress-circle__path");
    if (svgPath) {
      svgPath.style.strokeDasharray = `${this.perimeter * this.rate * (this.percent / 100)}px, ${this.perimeter}px`;
      svgPath.setAttribute("stroke-width", `${this.percent ? this.relativeStrokeWidth : 0}`);
    }
  }
  init() {
    if (!this.initialized) {
      super.init();
      this.loading = this.getAttribute("loading", true);
      this.strokeColor = this.getAttribute("strokeColor", true);
      this._wrapperElm = this.createElement("div", this);
      this._wrapperElm.classList.add("i-progress");
      this.type = this.getAttribute("type", true);
      this.percent = this.getAttribute("percent", true);
      this.strokeWidth = this.getAttribute("strokeWidth", true);
      if (this.type === "line") {
        this.steps = this.getAttribute("steps", true);
        if (this.onRenderStart && typeof this.onRenderStart === "function") {
          this._wrapperElm.classList.add("i-progress--grid");
          this._startElm = this.createElement("div", this._wrapperElm);
          this._startElm.classList.add("i-progress_item", "i-progress_item-start");
          this.onRenderStart(this._startElm);
        }
        if (this.onRenderEnd && typeof this.onRenderEnd === "function") {
          this._wrapperElm.classList.add("i-progress--grid");
          this._endElm = this.createElement("div", this._wrapperElm);
          this._endElm.classList.add("i-progress_item", "i-progress_item-end");
          this.onRenderEnd(this._endElm);
        }
      }
      if (this.type === "circle")
        this.renderCircleInner();
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Progress = __decorateClass([
  customElements2("i-progress")
], Progress);

// packages/table/src/style/table.css.ts
var Theme29 = theme_exports.ThemeVars;
var tableStyle = style({
  fontFamily: Theme29.typography.fontFamily,
  fontSize: Theme29.typography.fontSize,
  color: Theme29.text.primary,
  display: "block",
  $nest: {
    "> .i-table-container": {
      overflowX: "auto"
    },
    ".i-table-cell": {
      padding: "1rem",
      overflowWrap: "break-word",
      position: "relative",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "normal"
    },
    "> .i-table-container > table": {
      width: "100%",
      textAlign: "left",
      borderCollapse: "separate",
      borderSpacing: 0
    },
    ".i-table-header>tr>th": {
      fontWeight: 600,
      transition: "background .3s ease",
      borderBottom: `1px solid ${Theme29.divider}`
    },
    ".i-table-body>tr>td": {
      borderBottom: `1px solid ${Theme29.divider}`,
      transition: "background .3s ease"
    },
    "tr:hover td": {
      background: Theme29.background.paper,
      color: Theme29.text.secondary
    },
    "&.i-table--bordered": {
      $nest: {
        "> .i-table-container > table": {
          borderTop: `1px solid ${Theme29.divider}`,
          borderLeft: `1px solid ${Theme29.divider}`,
          borderRadius: "2px"
        },
        "> .i-table-container > table .i-table-cell": {
          borderRight: `1px solid ${Theme29.divider} !important`,
          borderBottom: `1px solid ${Theme29.divider}`
        }
      }
    },
    ".i-table-header i-table-column": {
      display: "inline-flex",
      gap: 10,
      alignItems: "center"
    },
    ".i-table-sort": {
      position: "relative",
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      width: 20,
      $nest: {
        ".sort-icon": {
          display: "block",
          cursor: "pointer"
        },
        ".sort-icon.sort-icon--active > svg": {
          fill: Theme29.colors.primary.main
        },
        ".sort-icon.sort-icon--desc": {
          marginTop: -5
        }
      }
    },
    ".i-table-pagi": {
      display: "flex",
      width: "100%",
      $nest: {
        "&.is--left": {
          justifyContent: "flex-start"
        },
        "&.is--right": {
          justifyContent: "flex-end"
        },
        "&.is--center": {
          justifyContent: "center"
        }
      }
    },
    ".i-table-cell--expand": {
      cursor: "pointer",
      $nest: {
        "i-icon": {
          display: "inline-block"
        },
        "i-icon svg": {
          fill: Theme29.text.primary
        }
      }
    },
    ".i-table-row--child > td": {
      borderRight: `1px solid ${Theme29.divider}`
    },
    "@media (max-width: 767px)": {
      $nest: {
        ".hidden-mobile": {
          display: "none !important"
        }
      }
    },
    "@media (min-width: 768px)": {
      $nest: {
        ".hidden-desktop": {
          display: "none !important"
        }
      }
    }
  }
});
var getTableMediaQueriesStyleClass = (columns, mediaQueries) => {
  let styleObj = {
    $nest: {}
  };
  for (let mediaQuery of mediaQueries) {
    let mediaQueryRule;
    if (mediaQuery.minWidth && mediaQuery.maxWidth) {
      mediaQueryRule = `@media (min-width: ${mediaQuery.minWidth}) and (max-width: ${mediaQuery.maxWidth})`;
    } else if (mediaQuery.minWidth) {
      mediaQueryRule = `@media (min-width: ${mediaQuery.minWidth})`;
    } else if (mediaQuery.maxWidth) {
      mediaQueryRule = `@media (max-width: ${mediaQuery.maxWidth})`;
    }
    if (mediaQueryRule) {
      styleObj["$nest"][mediaQueryRule] = {
        $nest: {}
      };
      if (mediaQuery.properties.fieldNames) {
        const fieldNames = mediaQuery.properties.fieldNames;
        const filterColumns = columns.filter((column) => !fieldNames.includes(column.fieldName));
        filterColumns.forEach((column) => {
          const fieldName = column.fieldName || "action";
          styleObj["$nest"][mediaQueryRule]["$nest"][`[data-fieldname="${fieldName}"]`] = {
            display: "none"
          };
        });
      }
      if (mediaQuery.properties.expandable) {
        const expandable = mediaQuery.properties.expandable;
        styleObj["$nest"][mediaQueryRule]["$nest"][".i-table-row--child"] = {
          display: expandable.rowExpandable ? "none" : "none !important"
        };
      }
    }
  }
  return style(styleObj);
};

// packages/table/src/tableColumn.ts
var Theme30 = theme_exports.ThemeVars;
var TableColumn = class extends Control {
  constructor(parent, options) {
    super(parent, options);
    this.title = options.title;
    this.fieldName = options.fieldName;
    if (options.key)
      this.key = options.key;
    if (options.sortable)
      this.sortable = options.sortable;
    if (options.sorter)
      this.sorter = options.sorter;
    this.sortOrder = options.sortOrder;
    if (this.options.onRenderCell)
      this.onRenderCell = this.options.onRenderCell;
    if (options.grid)
      this.grid = options.grid;
    if (options.display)
      this.display = options.display;
    if (options.textAlign)
      this.textAlign = options.textAlign;
  }
  get data() {
    return this._data;
  }
  set data(value) {
    this._data = value;
    this.columnElm.innerHTML = `${value}`;
  }
  get rowData() {
    return this._rowData;
  }
  set rowData(value) {
    this._rowData = value;
  }
  get sortOrder() {
    return this._sortOrder;
  }
  set sortOrder(value) {
    this._sortOrder = value;
    if (value === "asc") {
      this.ascElm && this.ascElm.classList.add("sort-icon--active");
      this.descElm && this.descElm.classList.remove("sort-icon--active");
    } else if (value === "desc") {
      this.ascElm && this.ascElm.classList.remove("sort-icon--active");
      this.descElm && this.descElm.classList.add("sort-icon--active");
    } else {
      this.ascElm && this.ascElm.classList.remove("sort-icon--active");
      this.descElm && this.descElm.classList.remove("sort-icon--active");
    }
    if (typeof this.onSortChange === "function")
      this.onSortChange(this, this.fieldName, value);
  }
  get textAlign() {
    return this._textAlign;
  }
  set textAlign(value) {
    this._textAlign = value || "left";
    this.style.textAlign = value;
  }
  renderSort() {
    if (!this.sortable) {
      this.sortElm && (this.sortElm.style.display = "none");
      return;
    }
    if (!this.sortElm) {
      this.sortElm = this.createElement("div", this);
      this.sortElm.classList.add("i-table-sort");
      this.ascElm = new Icon(void 0, {
        name: "caret-up",
        width: 14,
        height: 14,
        fill: Theme30.text.primary
      });
      this.ascElm.classList.add("sort-icon", "sort-icon--asc");
      this.ascElm.onClick = () => this.sortOrder = this.sortOrder === "asc" ? "none" : "asc";
      this.descElm = new Icon(void 0, {
        name: "caret-down",
        width: 14,
        height: 14,
        fill: Theme30.text.primary
      });
      this.descElm.classList.add("sort-icon", "sort-icon--desc");
      this.descElm.onClick = () => this.sortOrder = this.sortOrder === "desc" ? "none" : "desc";
      this.sortElm.appendChild(this.ascElm);
      this.sortElm.appendChild(this.descElm);
    }
    this.sortElm.style.display = "block";
  }
  async init() {
    if (!this.columnElm) {
      this.isHeader = this.options.header || false;
      this.columnElm = this.createElement("div", this);
      this.data = this.getAttribute("data", true);
      this.rowData = this.getAttribute("rowData", true);
      if (typeof this.onRenderCell === "function" && !this.isHeader) {
        const renderedElm = await this.onRenderCell(this, this.data, this.rowData);
        if (typeof renderedElm === "string") {
          this.columnElm.innerHTML = renderedElm;
        } else {
          this.columnElm.innerHTML = "";
          this.columnElm.appendChild(renderedElm);
        }
      }
      if (this.isHeader) {
        this.columnElm.innerHTML = this.title;
        this.sortable = this.sortable || false;
        this.renderSort();
      }
    }
  }
};
TableColumn = __decorateClass([
  customElements2("i-table-column")
], TableColumn);

// packages/table/src/utils.ts
var paginate = (array, pageSize2, pageNumber) => {
  return array.slice((pageNumber - 1) * pageSize2, pageNumber * pageSize2);
};
var getSorter = (columns, key2) => {
  const findedColumn = columns.find((column) => column.fieldName === key2);
  return findedColumn ? findedColumn.sorter : null;
};
var getValueByPath = function(object, prop) {
  prop = prop || "";
  const paths = prop.split(".");
  let current = object;
  let result = null;
  for (let i = 0, j = paths.length; i < j; i++) {
    const path = paths[i];
    if (!current)
      break;
    if (i === j - 1) {
      result = current[path];
      break;
    }
    current = current[path];
  }
  return result;
};
var orderBy = (list, sortBy, sortValue, sorter) => {
  const getKey = sorter ? null : (value, key2) => {
    console.log(sortBy);
    if (sortBy) {
      if (!Array.isArray(sortBy)) {
        sortBy = [sortBy];
      }
      return sortBy.map((by) => getValueByPath(value, by));
    }
  };
  const compare = (a, b) => {
    if (sorter) {
      return sorter(a.value, b.value);
    }
    for (let i = 0, len = a.key.length; i < len; i++) {
      if (a.key[i] < b.key[i]) {
        return -1;
      }
      if (a.key[i] > b.key[i]) {
        return 1;
      }
    }
    return 0;
  };
  const reverse = sortValue === "asc" ? 1 : -1;
  let sortedList = list.map((value, index) => {
    return {
      value,
      index,
      key: getKey ? getKey(value, index) : null
    };
  }).sort((a, b) => {
    let order = compare(a, b);
    if (!order) {
      order = a.index - b.index;
    }
    return order * reverse;
  }).map((data) => data.value);
  return sortedList;
};

// packages/table/src/tableRow.ts
var TableRow = class {
  constructor(cells) {
    this.cells = cells;
  }
  get cells() {
    return this._cells;
  }
  set cells(value) {
    this._cells = value;
  }
};

// packages/table/src/tableCell.ts
var TableCell = class {
  constructor(options) {
    this.rowSpan = options.rowSpan;
    this.columnSpan = options.columnSpan;
    this.value = options.value;
  }
  get rowSpan() {
    return this._rowSpan;
  }
  set rowSpan(value) {
    this._rowSpan = value;
  }
  get columnSpan() {
    return this._columnSpan;
  }
  set columnSpan(value) {
    this._columnSpan = value;
  }
  get value() {
    return this._value;
  }
  set value(data) {
    this._value = data;
  }
};

// packages/table/src/table.ts
var Table = class extends Control {
  constructor(parent, options) {
    super(parent, options, {
      heading: true
    });
    this._rows = [];
    this.firstLoad = true;
    this.sortConfig = { key: "", value: null };
  }
  get data() {
    var _a;
    if (this.sortConfig.key && this.sortConfig.value !== null) {
      const sorter = getSorter(this.columns, (_a = this.sortConfig) == null ? void 0 : _a.key);
      const orderList = orderBy([...this._data], this.sortConfig.key, this.sortConfig.value, sorter);
      return orderList;
    }
    return this._data;
  }
  set data(value) {
    this._data = value;
    this._filteredData = this.data;
    if (this.pagination)
      this.pagination.totalPage = Math.ceil(value.length / this.pagination.pageSize);
    this.renderBody();
  }
  get columns() {
    return this._columns || [];
  }
  set columns(value) {
    this._columns = value;
    this._heading && this.renderHeader();
    !this.firstLoad && this.renderBody();
  }
  get rows() {
    return this._rows;
  }
  get pagination() {
    return this._pagination;
  }
  set pagination(value) {
    if (typeof value === "string") {
      const elm = document.querySelector(`#${value}`);
      if (elm instanceof Pagination) {
        this._pagination = elm;
      }
    } else if (value) {
      this._pagination = value;
      this.pagingElm.innerHTML = "";
      this.pagingElm.appendChild(this.pagination);
      this.renderBody();
    }
    if (this._pagination) {
      this.pagingElm.style.display = "flex";
      this._pagination.onPageChanged = this.onPageChange.bind(this);
    } else {
      this.pagingElm.style.display = "none";
    }
  }
  get expandable() {
    return this._expandable;
  }
  set expandable(value) {
    this._expandable = value;
  }
  get hasExpandColumn() {
    return this.expandable && !!this.expandable.onRenderExpandIcon;
  }
  get columnLength() {
    return this.columns.length;
  }
  get mediaQueries() {
    return this._mediaQueries;
  }
  set mediaQueries(value) {
    this._mediaQueries = value;
    const style2 = getTableMediaQueriesStyleClass(this.columns, this._mediaQueries);
    this.classList.add(style2);
  }
  onPageChange(source, value) {
    !this.firstLoad && this.renderBody();
  }
  onSortChange(source, key2, value) {
    this.sortConfig = { key: key2, value };
    if (this._filteredData)
      this.renderBody();
    if (this.onColumnSort)
      this.onColumnSort(this, key2, value);
  }
  renderHeader() {
    this.tHeadElm.innerHTML = "";
    const rowElm = this.createElement("tr", this.tHeadElm);
    if (this.hasExpandColumn) {
      const thElm = this.createElement("th", rowElm);
      thElm.classList.add("i-table-cell", "i-table-cell--expand", "text-center");
    }
    this.columns.forEach((column, colIndex) => {
      const thElm = this.createElement("th", rowElm);
      thElm.classList.add("i-table-cell");
      thElm.setAttribute("data-fieldname", column.fieldName || "action");
      if (column.width)
        thElm.style.width = typeof column.width === "number" ? `${column.width}px` : column.width;
      column.textAlign && (thElm.style.textAlign = column.textAlign);
      const columnElm = new TableColumn(void 0, __spreadProps(__spreadValues({}, column), { header: true }));
      columnElm.onSortChange = this.onSortChange.bind(this);
      thElm.appendChild(columnElm);
      rowElm.appendChild(thElm);
    });
  }
  _handleClick(event) {
    const target = event.target;
    if (target) {
      const rowElm = target.closest(".i-table-row");
      let colElm = target.closest("i-table-column");
      if (!colElm)
        colElm = target.firstChild;
      const tdElm = target.closest("td");
      const rowData = colElm ? colElm.rowData : null;
      const rowIndex = (rowElm == null ? void 0 : rowElm.getAttribute("data-index")) || -1;
      const colIndex = (tdElm == null ? void 0 : tdElm.getAttribute("data-index")) || -1;
      if (typeof this.onCellClick === "function")
        this.onCellClick(this, +rowIndex, +colIndex, rowData);
      if (this.expandable && rowElm) {
        const expandTd = rowElm.querySelector(".i-table-cell--expand");
        this.expandRow(rowElm, expandTd);
      }
    }
    return super._handleClick(event, true);
  }
  expandRow(rowElm, expandTd) {
    rowElm.classList.toggle("is--expanded");
    const expandElm = rowElm.nextElementSibling;
    if (expandElm) {
      const hidden = expandElm.style.display === "none";
      if (expandTd && this.expandable.onRenderExpandIcon) {
        expandTd.innerHTML = "";
        expandTd.appendChild(this.expandable.onRenderExpandIcon(this, hidden));
      }
      expandElm.style.display = hidden ? "table-row" : "none";
    }
  }
  renderRow(rowElm, rowData, rowIndex) {
    if (this.expandable) {
      const expandIcon = this.expandable.onRenderExpandIcon;
      if (expandIcon) {
        const expandTd = this.createElement("td", rowElm);
        expandTd.appendChild(expandIcon(this, false));
        expandTd.classList.add("i-table-cell", "i-table-cell--expand", "text-center");
      }
    }
    let row = [];
    this.columns.forEach((column, colIndex) => {
      var _a;
      let spanData;
      if (typeof column.onCell === "function")
        spanData = column.onCell(rowData, rowIndex);
      if ((spanData == null ? void 0 : spanData.rowSpan) === 0 || (spanData == null ? void 0 : spanData.columnSpan) === 0)
        return;
      const tdElm = this.createElement("td", rowElm);
      tdElm.classList.add("i-table-cell");
      tdElm.setAttribute("data-index", colIndex.toString());
      tdElm.setAttribute("data-fieldname", column.fieldName || "action");
      (spanData == null ? void 0 : spanData.columnSpan) !== void 0 && tdElm.setAttribute("colspan", spanData == null ? void 0 : spanData.columnSpan);
      (spanData == null ? void 0 : spanData.rowSpan) !== void 0 && tdElm.setAttribute("rowspan", spanData == null ? void 0 : spanData.rowSpan);
      if (column.width)
        tdElm.style.width = typeof column.width === "number" ? `${column.width}px` : column.width;
      column.textAlign && (tdElm.style.textAlign = column.textAlign);
      const columnData = rowData[column.fieldName];
      const columnElm = new TableColumn(void 0, __spreadProps(__spreadValues({}, column), {
        data: columnData != null ? columnData : "--",
        rowData
      }));
      tdElm.appendChild(columnElm);
      row.push(new TableCell(__spreadProps(__spreadValues({}, spanData), {
        value: (_a = rowData[column.fieldName]) != null ? _a : "--"
      })));
    });
    this._rows.push(new TableRow(row));
  }
  renderBody() {
    var _a, _b;
    this.tBodyElm.innerHTML = "";
    this._rows = [];
    if (this._filteredData && this._filteredData.length) {
      const currentPage = ((_a = this.pagination) == null ? void 0 : _a.currentPage) || 1;
      const pageSize2 = ((_b = this.pagination) == null ? void 0 : _b.pageSize) || 10;
      const dataList = this.pagination ? paginate(this._filteredData, pageSize2, currentPage) : this._filteredData;
      dataList.forEach(async (row, rowIndex) => {
        const rowElm = this.createElement("tr", this.tBodyElm);
        rowElm.classList.add("i-table-row");
        const orderClass = (rowIndex + 1) % 2 === 0 ? "even" : "odd";
        rowElm.classList.add(orderClass);
        const rIndex = rowIndex + (currentPage - 1) * pageSize2;
        rowElm.setAttribute("data-index", rIndex.toString());
        this.renderRow(rowElm, row, rowIndex);
        if (this.expandable && this.expandable.onRenderExpandedRow) {
          const childElm = this.createElement("tr", this.tBodyElm);
          childElm.classList.add("i-table-row--child");
          childElm.style.display = "none";
          const tdChild = this.createElement("td", childElm);
          tdChild.setAttribute("colspan", `${this.columnLength + (this.hasExpandColumn ? 1 : 0)}`);
          const expandElm = await this.expandable.onRenderExpandedRow(row);
          if (typeof expandElm === "string")
            tdChild.innerHTML = expandElm;
          else
            tdChild.appendChild(expandElm);
          const hideExpanded = this.expandable.rowExpandable === false;
          if (hideExpanded)
            childElm.classList.add("hidden-desktop");
        }
      });
    } else {
      const rowElm = this.createElement("tr", this.tBodyElm);
      const tdElm = this.createElement("td", rowElm);
      tdElm.setAttribute("colspan", `${this.columnLength + (this.hasExpandColumn ? 1 : 0)}`);
      tdElm.classList.add("text-center");
      if (this.onRenderEmptyTable) {
        this.onRenderEmptyTable(this);
      } else {
        const label = this.createElement("span");
        label.textContent = "No data";
        tdElm.appendChild(label);
      }
    }
    this.firstLoad = false;
  }
  createTable() {
    const tableID = "TTable_" + Date.now();
    this._tableID = tableID;
    this.tableElm = this.createElement("table", this.wrapperElm);
    this.tableElm.id = tableID;
    this.tableElm.style.width = "100%";
    if (this._heading) {
      this.tHeadElm = this.createElement("thead", this.tableElm);
      this.tHeadElm.classList.add("i-table-header");
    }
    this.tBodyElm = this.createElement("tbody", this.tableElm);
    this.tBodyElm.classList.add("i-table-body");
  }
  filter(predicate) {
    const dataList = [...this.data];
    this._filteredData = dataList.filter(predicate);
    this.renderBody();
  }
  init() {
    var _a;
    if (!this.tableElm) {
      this.classList.add(tableStyle);
      if ((_a = this.options) == null ? void 0 : _a.onRenderEmptyTable)
        this.onRenderEmptyTable = this.options.onRenderEmptyTable;
      this.classList.add("i-table");
      this.wrapperElm = this.createElement("div", this);
      this.wrapperElm.classList.add("i-table-container");
      this._heading = this.getAttribute("heading", true, false);
      this.createTable();
      this.expandable = this.getAttribute("expandable", true);
      this.columns = this.getAttribute("columns", true, []);
      this.pagingElm = this.createElement("div", this.wrapperElm);
      this.pagingElm.classList.add("i-table-pagi");
      this.pagingElm.style.display = "none";
      const paginationAttr = this.getAttribute("pagination", true);
      paginationAttr && (this.pagination = paginationAttr);
      this.data = this.getAttribute("data", true, []);
      this._filteredData = this.data;
      const mediaQueries = this.getAttribute("mediaQueries", true);
      if (mediaQueries)
        this.mediaQueries = mediaQueries;
      this.firstLoad = false;
      super.init();
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Table = __decorateClass([
  customElements2("i-table")
], Table);

// packages/carousel/src/style/carousel.css.ts
var Theme31 = theme_exports.ThemeVars;
cssRule("i-carousel-slider", {
  display: "block",
  position: "relative",
  width: "100%",
  overflow: "hidden",
  margin: 0,
  padding: 0,
  $nest: {
    ".slider-list": {
      display: "flex",
      position: "relative",
      transition: "transform 500ms ease"
    },
    ".slider-list > *": {
      flexShrink: "0"
    },
    ".dots-pagination": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "1rem",
      listStyle: "none",
      gap: "0.4rem",
      $nest: {
        ".--dot": {
          display: "flex",
          cursor: "pointer"
        },
        ".--dot > span": {
          display: "inline-block",
          minWidth: "0.8rem",
          minHeight: "0.8rem",
          backgroundColor: "transparent",
          border: `2px solid ${Theme31.colors.primary.main}`,
          borderRadius: "50%",
          transition: "background-color 0.35s ease-in-out",
          textAlign: "center",
          fontSize: ".75rem",
          width: "auto",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        },
        ".--active > span": {
          backgroundColor: Theme31.colors.primary.main
        }
      }
    }
  }
});

// packages/carousel/src/carousel.ts
var CarouselSlider = class extends Control {
  constructor(parent, options) {
    super(parent, options, { activeSlide: 0 });
  }
  get slidesToShow() {
    return this._slidesToShow;
  }
  set slidesToShow(value) {
    this._slidesToShow = value;
  }
  get transitionSpeed() {
    return this._transitionSpeed;
  }
  set transitionSpeed(value) {
    this._transitionSpeed = value;
    this.sliderListElm.style.transitionDuration = value + "ms";
  }
  get autoplay() {
    return this._autoplay;
  }
  set autoplay(value) {
    this._autoplay = value;
    this.setAutoplay();
  }
  get autoplaySpeed() {
    return this._autoplaySpeed;
  }
  set autoplaySpeed(value) {
    this._autoplaySpeed = value;
    this.setAutoplay();
  }
  get activeSlide() {
    return this._activeSlide || 0;
  }
  set activeSlide(value) {
    this._activeSlide = value;
    const currentActive = this.dotPagination.querySelector("li.--active");
    const dot = this.dotsElm[value];
    currentActive && currentActive.classList.remove("--active");
    dot && dot.classList.add("--active");
    const tx = -this.offsetWidth * value;
    this.sliderListElm.style.transform = `translateX(${tx}px)`;
  }
  get items() {
    return this._items;
  }
  set items(nodes) {
    this.renderItems(nodes);
    this.renderDotPagination();
    this.setAutoplay();
  }
  renderItems(items) {
    this._items = items;
    this.sliderListElm.innerHTML = "";
    if (!items)
      return;
    let list = [];
    items.forEach((item, index) => {
      const carouselItem = new CarouselItem(this, item);
      carouselItem.style.width = 100 / this.slidesToShow + "%";
      list.push(carouselItem);
      this._slider = list;
      this.sliderListElm.appendChild(carouselItem);
    });
  }
  renderDotPagination() {
    this.dotPagination.innerHTML = "";
    this.dotsElm = [];
    if (this.hasChildNodes() && this.sliderListElm.childNodes.length) {
      const childLength = this.sliderListElm.childNodes.length;
      const totalDots = this.slidesToShow > 0 ? Math.ceil(childLength / this.slidesToShow) : childLength;
      for (let i = 0; i < totalDots; i++) {
        const dotElm = this.createElement("li", this.dotPagination);
        dotElm.classList.add("--dot");
        if (this.activeSlide === i)
          dotElm.classList.add("--active");
        const spanInner = this.createElement("span", dotElm);
        dotElm.addEventListener("click", () => {
          this.onDotClick(i);
          this.setAutoplay();
        });
        this.dotsElm.push(dotElm);
      }
    }
  }
  onDotClick(index) {
    this.activeSlide = index;
  }
  setAutoplay() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.autoplay && this.dotsElm.length > 1) {
      this.timer = setInterval(() => {
        const index = this.activeSlide + 1 >= this.dotsElm.length ? 0 : this.activeSlide + 1;
        this.onDotClick(index);
      }, this.autoplaySpeed);
    }
  }
  prev() {
    const index = this.activeSlide - 1 < 0 ? this._slider.length - 1 : this.activeSlide - 1;
    this.onDotClick(index);
  }
  next() {
    const index = this.activeSlide + 1 >= this._slider.length ? 0 : this.activeSlide + 1;
    this.onDotClick(index);
  }
  init() {
    super.init();
    this.slidesToShow = this.getAttribute("slidesToShow", true, 1);
    this.sliderListElm = this.createElement("div", this);
    this.sliderListElm.classList.add("slider-list");
    this.transitionSpeed = this.getAttribute("transitionSpeed", true, 500);
    this.dotPagination = this.createElement("ul", this);
    this.dotPagination.classList.add("dots-pagination");
    this.renderDotPagination();
    this.autoplaySpeed = this.getAttribute("autoplaySpeed", true, 3e3);
    this.autoplay = this.getAttribute("autoplay", true);
    this.items = this.getAttribute("items", true);
    this.activeSlide = this.getAttribute("activeSlide", true, 0);
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
CarouselSlider = __decorateClass([
  customElements2("i-carousel-slider")
], CarouselSlider);
var CarouselItem = class extends Container {
  constructor(parent, options) {
    super(parent, options);
  }
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
  addChildControl(control) {
    this.appendChild(control);
  }
  init() {
    this.name = this.options.name;
    this._controls = this.options.controls || [];
    super.init();
    this._controls.forEach((child2) => {
      this.addChildControl(child2);
    });
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
CarouselItem = __decorateClass([
  customElements2("i-carousel-item")
], CarouselItem);
  
});