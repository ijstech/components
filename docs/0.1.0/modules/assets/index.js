define("@modules/assets", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assets = void 0;
    const moduleDir = components_1.application.currentModuleDir;
    class Assets {
        static get instance() {
            if (!this._instance)
                this._instance = new this();
            return this._instance;
        }
        get logo() {
            const themeType = document.body.style.getPropertyValue('--theme');
            let currentTheme = components_1.Styles.Theme.currentTheme;
            let theme = themeType || (currentTheme === components_1.Styles.Theme.defaultTheme ? "light" : "dark");
            let _logo = this._getLogo(this.viewport, theme);
            return _logo;
        }
        set breakpoints(value) {
            this._breakpoints = value;
        }
        get breakpoints() {
            return this._breakpoints;
        }
        get viewport() {
            if (window.innerWidth > this._breakpoints?.tablet)
                return "desktop";
            else if (window.innerWidth > this._breakpoints?.mobile)
                return "tablet";
            else
                return "mobile";
        }
        _getLogoPath(viewport, theme) {
            let asset = components_1.application.assets(`logo/header`) || components_1.application.assets(`logo`);
            let path;
            if (typeof asset === 'object') {
                if (typeof asset[viewport] === 'object') {
                    path = asset[viewport][theme];
                }
                else if (typeof asset[viewport] === 'string') {
                    path = asset[viewport];
                }
                else if (asset[theme]) {
                    path = asset[theme];
                }
            }
            else if (typeof asset === 'string') {
                path = asset;
            }
            return path;
        }
        _getLogo(viewport, theme) {
            const header = this._getLogoPath(viewport, theme);
            return { header };
        }
    }
    exports.assets = Assets.instance;
    function fullPath(path) {
        return `${moduleDir}/${path}`;
    }
    ;
    exports.default = {
        fullPath
    };
});
