var LIB;(()=>{var t={470:t=>{function e(t){if("string"!=typeof t)throw new TypeError("Path must be a string. Received "+JSON.stringify(t))}function r(t,e){for(var r,n="",o=0,i=-1,a=0,h=0;h<=t.length;++h){if(h<t.length)r=t.charCodeAt(h);else {if(47===r)break;r=47;}if(47===r){if(i===h-1||1===a);else if(i!==h-1&&2===a){if(n.length<2||2!==o||46!==n.charCodeAt(n.length-1)||46!==n.charCodeAt(n.length-2))if(n.length>2){var s=n.lastIndexOf("/");if(s!==n.length-1){-1===s?(n="",o=0):o=(n=n.slice(0,s)).length-1-n.lastIndexOf("/"),i=h,a=0;continue}}else if(2===n.length||1===n.length){n="",o=0,i=h,a=0;continue}e&&(n.length>0?n+="/..":n="..",o=2);}else n.length>0?n+="/"+t.slice(i+1,h):n=t.slice(i+1,h),o=h-i-1;i=h,a=0;}else 46===r&&-1!==a?++a:a=-1;}return n}var n={resolve:function(){for(var t,n="",o=!1,i=arguments.length-1;i>=-1&&!o;i--){var a;i>=0?a=arguments[i]:(void 0===t&&(t=process.cwd()),a=t),e(a),0!==a.length&&(n=a+"/"+n,o=47===a.charCodeAt(0));}return n=r(n,!o),o?n.length>0?"/"+n:"/":n.length>0?n:"."},normalize:function(t){if(e(t),0===t.length)return ".";var n=47===t.charCodeAt(0),o=47===t.charCodeAt(t.length-1);return 0!==(t=r(t,!n)).length||n||(t="."),t.length>0&&o&&(t+="/"),n?"/"+t:t},isAbsolute:function(t){return e(t),t.length>0&&47===t.charCodeAt(0)},join:function(){if(0===arguments.length)return ".";for(var t,r=0;r<arguments.length;++r){var o=arguments[r];e(o),o.length>0&&(void 0===t?t=o:t+="/"+o);}return void 0===t?".":n.normalize(t)},relative:function(t,r){if(e(t),e(r),t===r)return "";if((t=n.resolve(t))===(r=n.resolve(r)))return "";for(var o=1;o<t.length&&47===t.charCodeAt(o);++o);for(var i=t.length,a=i-o,h=1;h<r.length&&47===r.charCodeAt(h);++h);for(var s=r.length-h,c=a<s?a:s,f=-1,u=0;u<=c;++u){if(u===c){if(s>c){if(47===r.charCodeAt(h+u))return r.slice(h+u+1);if(0===u)return r.slice(h+u)}else a>c&&(47===t.charCodeAt(o+u)?f=u:0===u&&(f=0));break}var l=t.charCodeAt(o+u);if(l!==r.charCodeAt(h+u))break;47===l&&(f=u);}var p="";for(u=o+f+1;u<=i;++u)u!==i&&47!==t.charCodeAt(u)||(0===p.length?p+="..":p+="/..");return p.length>0?p+r.slice(h+f):(h+=f,47===r.charCodeAt(h)&&++h,r.slice(h))},_makeLong:function(t){return t},dirname:function(t){if(e(t),0===t.length)return ".";for(var r=t.charCodeAt(0),n=47===r,o=-1,i=!0,a=t.length-1;a>=1;--a)if(47===(r=t.charCodeAt(a))){if(!i){o=a;break}}else i=!1;return -1===o?n?"/":".":n&&1===o?"//":t.slice(0,o)},basename:function(t,r){if(void 0!==r&&"string"!=typeof r)throw new TypeError('"ext" argument must be a string');e(t);var n,o=0,i=-1,a=!0;if(void 0!==r&&r.length>0&&r.length<=t.length){if(r.length===t.length&&r===t)return "";var h=r.length-1,s=-1;for(n=t.length-1;n>=0;--n){var c=t.charCodeAt(n);if(47===c){if(!a){o=n+1;break}}else -1===s&&(a=!1,s=n+1),h>=0&&(c===r.charCodeAt(h)?-1==--h&&(i=n):(h=-1,i=s));}return o===i?i=s:-1===i&&(i=t.length),t.slice(o,i)}for(n=t.length-1;n>=0;--n)if(47===t.charCodeAt(n)){if(!a){o=n+1;break}}else -1===i&&(a=!1,i=n+1);return -1===i?"":t.slice(o,i)},extname:function(t){e(t);for(var r=-1,n=0,o=-1,i=!0,a=0,h=t.length-1;h>=0;--h){var s=t.charCodeAt(h);if(47!==s)-1===o&&(i=!1,o=h+1),46===s?-1===r?r=h:1!==a&&(a=1):-1!==r&&(a=-1);else if(!i){n=h+1;break}}return -1===r||-1===o||0===a||1===a&&r===o-1&&r===n+1?"":t.slice(r,o)},format:function(t){if(null===t||"object"!=typeof t)throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof t);return function(t,e){var r=e.dir||e.root,n=e.base||(e.name||"")+(e.ext||"");return r?r===e.root?r+n:r+"/"+n:n}(0,t)},parse:function(t){e(t);var r={root:"",dir:"",base:"",ext:"",name:""};if(0===t.length)return r;var n,o=t.charCodeAt(0),i=47===o;i?(r.root="/",n=1):n=0;for(var a=-1,h=0,s=-1,c=!0,f=t.length-1,u=0;f>=n;--f)if(47!==(o=t.charCodeAt(f)))-1===s&&(c=!1,s=f+1),46===o?-1===a?a=f:1!==u&&(u=1):-1!==a&&(u=-1);else if(!c){h=f+1;break}return -1===a||-1===s||0===u||1===u&&a===s-1&&a===h+1?-1!==s&&(r.base=r.name=0===h&&i?t.slice(1,s):t.slice(h,s)):(0===h&&i?(r.name=t.slice(1,a),r.base=t.slice(1,s)):(r.name=t.slice(h,a),r.base=t.slice(h,s)),r.ext=t.slice(a,s)),h>0?r.dir=t.slice(0,h-1):i&&(r.dir="/"),r},sep:"/",delimiter:":",win32:null,posix:null};n.posix=n,t.exports=n;}},e={};function r(n){var o=e[n];if(void 0!==o)return o.exports;var i=e[n]={exports:{}};return t[n](i,i.exports,r),i.exports}r.d=(t,e)=>{for(var n in e)r.o(e,n)&&!r.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]});},r.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0});};var n={};(()=>{var t;if(r.r(n),r.d(n,{URI:()=>p,Utils:()=>_}),"object"==typeof process)t="win32"===process.platform;else if("object"==typeof navigator){var e=navigator.userAgent;t=e.indexOf("Windows")>=0;}var o,i,a=(o=function(t,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);},o(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function r(){this.constructor=t;}o(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r);}),h=/^\w[\w\d+.-]*$/,s=/^\//,c=/^\/\//,f="",u="/",l=/^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/,p=function(){function e(t,e,r,n,o,i){void 0===i&&(i=!1),"object"==typeof t?(this.scheme=t.scheme||f,this.authority=t.authority||f,this.path=t.path||f,this.query=t.query||f,this.fragment=t.fragment||f):(this.scheme=function(t,e){return t||e?t:"file"}(t,i),this.authority=e||f,this.path=function(t,e){switch(t){case"https":case"http":case"file":e?e[0]!==u&&(e=u+e):e=u;}return e}(this.scheme,r||f),this.query=n||f,this.fragment=o||f,function(t,e){if(!t.scheme&&e)throw new Error('[UriError]: Scheme is missing: {scheme: "", authority: "'.concat(t.authority,'", path: "').concat(t.path,'", query: "').concat(t.query,'", fragment: "').concat(t.fragment,'"}'));if(t.scheme&&!h.test(t.scheme))throw new Error("[UriError]: Scheme contains illegal characters.");if(t.path)if(t.authority){if(!s.test(t.path))throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character')}else if(c.test(t.path))throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")')}(this,i));}return e.isUri=function(t){return t instanceof e||!!t&&"string"==typeof t.authority&&"string"==typeof t.fragment&&"string"==typeof t.path&&"string"==typeof t.query&&"string"==typeof t.scheme&&"string"==typeof t.fsPath&&"function"==typeof t.with&&"function"==typeof t.toString},Object.defineProperty(e.prototype,"fsPath",{get:function(){return b(this,!1)},enumerable:!1,configurable:!0}),e.prototype.with=function(t){if(!t)return this;var e=t.scheme,r=t.authority,n=t.path,o=t.query,i=t.fragment;return void 0===e?e=this.scheme:null===e&&(e=f),void 0===r?r=this.authority:null===r&&(r=f),void 0===n?n=this.path:null===n&&(n=f),void 0===o?o=this.query:null===o&&(o=f),void 0===i?i=this.fragment:null===i&&(i=f),e===this.scheme&&r===this.authority&&n===this.path&&o===this.query&&i===this.fragment?this:new d(e,r,n,o,i)},e.parse=function(t,e){void 0===e&&(e=!1);var r=l.exec(t);return r?new d(r[2]||f,x(r[4]||f),x(r[5]||f),x(r[7]||f),x(r[9]||f),e):new d(f,f,f,f,f)},e.file=function(e){var r=f;if(t&&(e=e.replace(/\\/g,u)),e[0]===u&&e[1]===u){var n=e.indexOf(u,2);-1===n?(r=e.substring(2),e=u):(r=e.substring(2,n),e=e.substring(n)||u);}return new d("file",r,e,f,f)},e.from=function(t){return new d(t.scheme,t.authority,t.path,t.query,t.fragment)},e.prototype.toString=function(t){return void 0===t&&(t=!1),C(this,t)},e.prototype.toJSON=function(){return this},e.revive=function(t){if(t){if(t instanceof e)return t;var r=new d(t);return r._formatted=t.external,r._fsPath=t._sep===g?t.fsPath:null,r}return t},e}(),g=t?1:void 0,d=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e._formatted=null,e._fsPath=null,e}return a(e,t),Object.defineProperty(e.prototype,"fsPath",{get:function(){return this._fsPath||(this._fsPath=b(this,!1)),this._fsPath},enumerable:!1,configurable:!0}),e.prototype.toString=function(t){return void 0===t&&(t=!1),t?C(this,!0):(this._formatted||(this._formatted=C(this,!1)),this._formatted)},e.prototype.toJSON=function(){var t={$mid:1};return this._fsPath&&(t.fsPath=this._fsPath,t._sep=g),this._formatted&&(t.external=this._formatted),this.path&&(t.path=this.path),this.scheme&&(t.scheme=this.scheme),this.authority&&(t.authority=this.authority),this.query&&(t.query=this.query),this.fragment&&(t.fragment=this.fragment),t},e}(p),v=((i={})[58]="%3A",i[47]="%2F",i[63]="%3F",i[35]="%23",i[91]="%5B",i[93]="%5D",i[64]="%40",i[33]="%21",i[36]="%24",i[38]="%26",i[39]="%27",i[40]="%28",i[41]="%29",i[42]="%2A",i[43]="%2B",i[44]="%2C",i[59]="%3B",i[61]="%3D",i[32]="%20",i);function y(t,e){for(var r=void 0,n=-1,o=0;o<t.length;o++){var i=t.charCodeAt(o);if(i>=97&&i<=122||i>=65&&i<=90||i>=48&&i<=57||45===i||46===i||95===i||126===i||e&&47===i)-1!==n&&(r+=encodeURIComponent(t.substring(n,o)),n=-1),void 0!==r&&(r+=t.charAt(o));else {void 0===r&&(r=t.substr(0,o));var a=v[i];void 0!==a?(-1!==n&&(r+=encodeURIComponent(t.substring(n,o)),n=-1),r+=a):-1===n&&(n=o);}}return -1!==n&&(r+=encodeURIComponent(t.substring(n))),void 0!==r?r:t}function m(t){for(var e=void 0,r=0;r<t.length;r++){var n=t.charCodeAt(r);35===n||63===n?(void 0===e&&(e=t.substr(0,r)),e+=v[n]):void 0!==e&&(e+=t[r]);}return void 0!==e?e:t}function b(e,r){var n;return n=e.authority&&e.path.length>1&&"file"===e.scheme?"//".concat(e.authority).concat(e.path):47===e.path.charCodeAt(0)&&(e.path.charCodeAt(1)>=65&&e.path.charCodeAt(1)<=90||e.path.charCodeAt(1)>=97&&e.path.charCodeAt(1)<=122)&&58===e.path.charCodeAt(2)?r?e.path.substr(1):e.path[1].toLowerCase()+e.path.substr(2):e.path,t&&(n=n.replace(/\//g,"\\")),n}function C(t,e){var r=e?m:y,n="",o=t.scheme,i=t.authority,a=t.path,h=t.query,s=t.fragment;if(o&&(n+=o,n+=":"),(i||"file"===o)&&(n+=u,n+=u),i){var c=i.indexOf("@");if(-1!==c){var f=i.substr(0,c);i=i.substr(c+1),-1===(c=f.indexOf(":"))?n+=r(f,!1):(n+=r(f.substr(0,c),!1),n+=":",n+=r(f.substr(c+1),!1)),n+="@";}-1===(c=(i=i.toLowerCase()).indexOf(":"))?n+=r(i,!1):(n+=r(i.substr(0,c),!1),n+=i.substr(c));}if(a){if(a.length>=3&&47===a.charCodeAt(0)&&58===a.charCodeAt(2))(l=a.charCodeAt(1))>=65&&l<=90&&(a="/".concat(String.fromCharCode(l+32),":").concat(a.substr(3)));else if(a.length>=2&&58===a.charCodeAt(1)){var l;(l=a.charCodeAt(0))>=65&&l<=90&&(a="".concat(String.fromCharCode(l+32),":").concat(a.substr(2)));}n+=r(a,!0);}return h&&(n+="?",n+=r(h,!1)),s&&(n+="#",n+=e?s:y(s,!1)),n}function A(t){try{return decodeURIComponent(t)}catch(e){return t.length>3?t.substr(0,3)+A(t.substr(3)):t}}var w=/(%[0-9A-Za-z][0-9A-Za-z])+/g;function x(t){return t.match(w)?t.replace(w,(function(t){return A(t)})):t}var _,O=r(470),P=function(t,e,r){if(r||2===arguments.length)for(var n,o=0,i=e.length;o<i;o++)!n&&o in e||(n||(n=Array.prototype.slice.call(e,0,o)),n[o]=e[o]);return t.concat(n||Array.prototype.slice.call(e))},j=O.posix||O,U="/";!function(t){t.joinPath=function(t){for(var e=[],r=1;r<arguments.length;r++)e[r-1]=arguments[r];return t.with({path:j.join.apply(j,P([t.path],e,!1))})},t.resolvePath=function(t){for(var e=[],r=1;r<arguments.length;r++)e[r-1]=arguments[r];var n=t.path,o=!1;n[0]!==U&&(n=U+n,o=!0);var i=j.resolve.apply(j,P([n],e,!1));return o&&i[0]===U&&!t.authority&&(i=i.substring(1)),t.with({path:i})},t.dirname=function(t){if(0===t.path.length||t.path===U)return t;var e=j.dirname(t.path);return 1===e.length&&46===e.charCodeAt(0)&&(e=""),t.with({path:e})},t.basename=function(t){return j.basename(t.path)},t.extname=function(t){return j.extname(t.path)};}(_||(_={}));})(),LIB=n;})();const{URI,Utils}=LIB;

// Copyright (c) .NET Foundation and contributors. All rights reserved.
function createKernelUri(kernelUri) {
    const uri = URI.parse(kernelUri);
    uri.authority;
    uri.path;
    let absoluteUri = `${uri.scheme}://${uri.authority}${uri.path || "/"}`;
    return absoluteUri;
}
function createKernelUriWithQuery(kernelUri) {
    const uri = URI.parse(kernelUri);
    uri.authority;
    uri.path;
    let absoluteUri = `${uri.scheme}://${uri.authority}${uri.path || "/"}`;
    if (uri.query) {
        absoluteUri += `?${uri.query}`;
    }
    return absoluteUri;
}
function getTag(kernelUri) {
    const uri = URI.parse(kernelUri);
    if (uri.query) { //?
        const parts = uri.query.split("tag=");
        if (parts.length > 1) {
            return parts[1];
        }
    }
    return undefined;
}
function createRoutingSlip(kernelUris) {
    return Array.from(new Set(kernelUris.map(e => createKernelUriWithQuery(e))));
}
function routingSlipStartsWith(thisKernelUris, otherKernelUris) {
    let startsWith = true;
    if (otherKernelUris.length > 0 && thisKernelUris.length >= otherKernelUris.length) {
        for (let i = 0; i < otherKernelUris.length; i++) {
            if (createKernelUri(otherKernelUris[i]) !== createKernelUri(thisKernelUris[i])) {
                startsWith = false;
                break;
            }
        }
    }
    else {
        startsWith = false;
    }
    return startsWith;
}
function routingSlipContains(routingSlip, kernelUri, ignoreQuery = false) {
    const normalizedUri = ignoreQuery ? createKernelUri(kernelUri) : createKernelUriWithQuery(kernelUri);
    return routingSlip.find(e => normalizedUri === (!ignoreQuery ? createKernelUriWithQuery(e) : createKernelUri(e))) !== undefined;
}
class RoutingSlip {
    constructor() {
        this._uris = [];
    }
    get uris() {
        return this._uris;
    }
    set uris(value) {
        this._uris = value;
    }
    contains(kernelUri, ignoreQuery = false) {
        return routingSlipContains(this._uris, kernelUri, ignoreQuery);
    }
    startsWith(other) {
        if (other instanceof Array) {
            return routingSlipStartsWith(this._uris, other);
        }
        else {
            return routingSlipStartsWith(this._uris, other._uris);
        }
    }
    continueWith(other) {
        let otherUris = (other instanceof Array ? other : other._uris) || [];
        if (otherUris.length > 0) {
            if (routingSlipStartsWith(otherUris, this._uris)) {
                otherUris = otherUris.slice(this._uris.length);
            }
        }
        for (let i = 0; i < otherUris.length; i++) {
            if (!this.contains(otherUris[i])) {
                this._uris.push(otherUris[i]);
            }
            else {
                throw new Error(`The uri ${otherUris[i]} is already in the routing slip [${this._uris}], cannot continue with routing slip [${otherUris}]`);
            }
        }
    }
    toArray() {
        return [...this._uris];
    }
}
class CommandRoutingSlip extends RoutingSlip {
    constructor() {
        super();
    }
    static fromUris(uris) {
        const routingSlip = new CommandRoutingSlip();
        routingSlip.uris = uris;
        return routingSlip;
    }
    stampAsArrived(kernelUri) {
        this.stampAs(kernelUri, "arrived");
    }
    stamp(kernelUri) {
        this.stampAs(kernelUri);
    }
    stampAs(kernelUri, tag) {
        if (tag) {
            const absoluteUriWithQuery = `${createKernelUri(kernelUri)}?tag=${tag}`;
            const absoluteUriWithoutQuery = createKernelUri(kernelUri);
            if (this.uris.find(e => e.startsWith(absoluteUriWithoutQuery))) {
                throw new Error(`The uri ${absoluteUriWithQuery} is already in the routing slip [${this.uris}]`);
            }
            else {
                this.uris.push(absoluteUriWithQuery);
            }
        }
        else {
            const absoluteUriWithQuery = `${createKernelUri(kernelUri)}?tag=arrived`;
            const absoluteUriWithoutQuery = createKernelUri(kernelUri);
            if (!this.uris.find(e => e.startsWith(absoluteUriWithQuery))) {
                throw new Error(`The uri ${absoluteUriWithQuery} is not in the routing slip [${this.uris}]`);
            }
            else if (this.uris.find(e => e === absoluteUriWithoutQuery)) {
                throw new Error(`The uri ${absoluteUriWithoutQuery} is already in the routing slip [${this.uris}]`);
            }
            else {
                this.uris.push(absoluteUriWithoutQuery);
            }
        }
    }
}
class EventRoutingSlip extends RoutingSlip {
    constructor() {
        super();
    }
    static fromUris(uris) {
        const routingSlip = new EventRoutingSlip();
        routingSlip.uris = uris;
        return routingSlip;
    }
    stamp(kernelUri) {
        const normalizedUri = createKernelUriWithQuery(kernelUri);
        const canAdd = !this.uris.find(e => createKernelUriWithQuery(e) === normalizedUri);
        if (canAdd) {
            this.uris.push(normalizedUri);
            this.uris;
        }
        else {
            throw new Error(`The uri ${normalizedUri} is already in the routing slip [${this.uris}]`);
        }
    }
}

// Copyright (c) .NET Foundation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Generated TypeScript interfaces and types.
// --------------------------------------------- Kernel Commands
const AddPackageType = "AddPackage";
const AddPackageSourceType = "AddPackageSource";
const CancelType = "Cancel";
const ClearValuesType = "ClearValues";
const CompileProjectType = "CompileProject";
const ConnectJupyterKernelType = "ConnectJupyterKernel";
const ConnectSignalRType = "ConnectSignalR";
const ConnectStdioType = "ConnectStdio";
const DisplayErrorType = "DisplayError";
const DisplayValueType = "DisplayValue";
const ExpandCodeType = "ExpandCode";
const ImportDocumentType = "ImportDocument";
const OpenDocumentType = "OpenDocument";
const OpenProjectType = "OpenProject";
const QuitType = "Quit";
const RequestCodeExpansionInfosType = "RequestCodeExpansionInfos";
const RequestCompletionsType = "RequestCompletions";
const RequestDiagnosticsType = "RequestDiagnostics";
const RequestHoverTextType = "RequestHoverText";
const RequestInputType = "RequestInput";
const RequestInputsType = "RequestInputs";
const RequestKernelInfoType = "RequestKernelInfo";
const RequestSignatureHelpType = "RequestSignatureHelp";
const RequestValueType = "RequestValue";
const RequestValueInfosType = "RequestValueInfos";
const SendEditableCodeType = "SendEditableCode";
const SendValueType = "SendValue";
const SubmitCodeType = "SubmitCode";
const UpdateDisplayedValueType = "UpdateDisplayedValue";
// --------------------------------------------- Kernel events
const AssemblyProducedType = "AssemblyProduced";
const CodeExpansionInfosProducedType = "CodeExpansionInfosProduced";
const CodeSubmissionReceivedType = "CodeSubmissionReceived";
const CommandFailedType = "CommandFailed";
const CommandSucceededType = "CommandSucceeded";
const CompleteCodeSubmissionReceivedType = "CompleteCodeSubmissionReceived";
const CompletionsProducedType = "CompletionsProduced";
const DiagnosticsProducedType = "DiagnosticsProduced";
const DisplayedValueProducedType = "DisplayedValueProduced";
const DisplayedValueUpdatedType = "DisplayedValueUpdated";
const DocumentOpenedType = "DocumentOpened";
const ErrorProducedType = "ErrorProduced";
const HoverTextProducedType = "HoverTextProduced";
const IncompleteCodeSubmissionReceivedType = "IncompleteCodeSubmissionReceived";
const InputProducedType = "InputProduced";
const InputsProducedType = "InputsProduced";
const KernelExtensionLoadedType = "KernelExtensionLoaded";
const KernelInfoProducedType = "KernelInfoProduced";
const KernelReadyType = "KernelReady";
const PackageAddedType = "PackageAdded";
const ProjectOpenedType = "ProjectOpened";
const ReturnValueProducedType = "ReturnValueProduced";
const SignatureHelpProducedType = "SignatureHelpProduced";
const StandardErrorValueProducedType = "StandardErrorValueProduced";
const StandardOutputValueProducedType = "StandardOutputValueProduced";
const ValueInfosProducedType = "ValueInfosProduced";
const ValueProducedType = "ValueProduced";
var InsertTextFormat;
(function (InsertTextFormat) {
    InsertTextFormat["PlainText"] = "plaintext";
    InsertTextFormat["Snippet"] = "snippet";
})(InsertTextFormat || (InsertTextFormat = {}));
var DiagnosticSeverity;
(function (DiagnosticSeverity) {
    DiagnosticSeverity["Hidden"] = "hidden";
    DiagnosticSeverity["Info"] = "info";
    DiagnosticSeverity["Warning"] = "warning";
    DiagnosticSeverity["Error"] = "error";
})(DiagnosticSeverity || (DiagnosticSeverity = {}));
var DocumentSerializationType;
(function (DocumentSerializationType) {
    DocumentSerializationType["Dib"] = "dib";
    DocumentSerializationType["Ipynb"] = "ipynb";
})(DocumentSerializationType || (DocumentSerializationType = {}));
var RequestType;
(function (RequestType) {
    RequestType["Parse"] = "parse";
    RequestType["Serialize"] = "serialize";
})(RequestType || (RequestType = {}));

// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

function validate(uuid) {
  return typeof uuid === 'string' && REGEX.test(uuid);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!validate(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

function parse(uuid) {
  if (!validate(uuid)) {
    throw TypeError('Invalid UUID');
  }

  var v;
  var arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return stringify(rnds);
}

// Copyright (c) .NET Foundation and contributors. All rights reserved.
function toBase64String(value) {
    const wnd = globalThis.window;
    if (wnd) {
        return wnd.btoa(String.fromCharCode(...value));
    }
    else {
        return Buffer.from(value).toString('base64');
    }
}
class KernelCommandEnvelope {
    constructor(commandType, command) {
        this.commandType = commandType;
        this.command = command;
        this._childCommandCounter = 1;
        this._routingSlip = new CommandRoutingSlip();
    }
    get routingSlip() {
        return this._routingSlip;
    }
    get parentCommand() {
        return this._parentCommand;
    }
    static isKernelCommandEnvelopeModel(arg) {
        return !arg.getOrCreateToken;
    }
    setParent(parentCommand) {
        if (this._parentCommand && this._parentCommand !== parentCommand) {
            throw new Error("Parent cannot be changed.");
        }
        if ((this._token !== undefined && this._token !== null) &&
            ((parentCommand === null || parentCommand === void 0 ? void 0 : parentCommand._token) !== undefined && (parentCommand === null || parentCommand === void 0 ? void 0 : parentCommand._token) !== null) &&
            KernelCommandEnvelope.getRootToken(this._token) !== KernelCommandEnvelope.getRootToken(parentCommand._token)) {
            throw new Error("Token of parented command cannot be changed.");
        }
        if (this._parentCommand === null || this._parentCommand === undefined) {
            {
                // todo: do we need to override the token? Should this throw if parenting happens after token is set?
                if (this._token) {
                    this._token = undefined;
                }
                this._parentCommand = parentCommand;
                this.getOrCreateToken();
            }
        }
    }
    static areCommandsTheSame(envelope1, envelope2) {
        // reference equality
        if (envelope1 === envelope2) {
            return true;
        }
        // commandType equality
        const sameCommandType = (envelope1 === null || envelope1 === void 0 ? void 0 : envelope1.commandType) === (envelope2 === null || envelope2 === void 0 ? void 0 : envelope2.commandType); //?
        if (!sameCommandType) {
            return false;
        }
        // both must have tokens
        if ((!(envelope1 === null || envelope1 === void 0 ? void 0 : envelope1._token)) || (!(envelope2 === null || envelope2 === void 0 ? void 0 : envelope2._token))) {
            return false;
        }
        // token equality
        const sameToken = (envelope1 === null || envelope1 === void 0 ? void 0 : envelope1._token) === (envelope2 === null || envelope2 === void 0 ? void 0 : envelope2._token); //?
        if (!sameToken) {
            return false;
        }
        return true;
    }
    getOrCreateToken() {
        if (this._token) {
            return this._token;
        }
        if (this._parentCommand) {
            this._token = `${this._parentCommand.getOrCreateToken()}.${this._parentCommand.getNextChildToken()}`;
            return this._token;
        }
        const guidBytes = parse(v4());
        const data = new Uint8Array(guidBytes);
        this._token = toBase64String(data);
        // this._token = `${KernelCommandEnvelope._counter++}`;
        return this._token;
    }
    getToken() {
        if (this._token) {
            return this._token;
        }
        throw new Error('token not set');
    }
    isSelforDescendantOf(otherCommand) {
        const otherToken = otherCommand._token;
        const thisToken = this._token;
        if (thisToken && otherToken) {
            return thisToken.startsWith(otherToken);
        }
        throw new Error('both commands must have tokens');
    }
    hasSameRootCommandAs(otherCommand) {
        const otherToken = otherCommand._token;
        const thisToken = this._token;
        if (thisToken && otherToken) {
            const otherRootToken = KernelCommandEnvelope.getRootToken(otherToken);
            const thisRootToken = KernelCommandEnvelope.getRootToken(thisToken);
            return thisRootToken === otherRootToken;
        }
        throw new Error('both commands must have tokens');
    }
    static getRootToken(token) {
        const parts = token.split('.');
        return parts[0];
    }
    toJson() {
        const model = {
            commandType: this.commandType,
            command: this.command,
            routingSlip: this._routingSlip.toArray(),
            token: this.getOrCreateToken()
        };
        return model;
    }
    static fromJson(model) {
        const command = new KernelCommandEnvelope(model.commandType, model.command);
        command._routingSlip = CommandRoutingSlip.fromUris(model.routingSlip || []);
        command._token = model.token;
        return command;
    }
    clone() {
        return KernelCommandEnvelope.fromJson(this.toJson());
    }
    getNextChildToken() {
        return this._childCommandCounter++;
    }
}
KernelCommandEnvelope._counter = 1;
class KernelEventEnvelope {
    constructor(eventType, event, command) {
        this.eventType = eventType;
        this.event = event;
        this.command = command;
        this._routingSlip = new EventRoutingSlip();
    }
    get routingSlip() {
        return this._routingSlip;
    }
    toJson() {
        var _a;
        const model = {
            eventType: this.eventType,
            event: this.event,
            command: (_a = this.command) === null || _a === void 0 ? void 0 : _a.toJson(),
            routingSlip: this._routingSlip.toArray()
        };
        return model;
    }
    static fromJson(model) {
        const event = new KernelEventEnvelope(model.eventType, model.event, model.command ? KernelCommandEnvelope.fromJson(model.command) : undefined);
        event._routingSlip = EventRoutingSlip.fromUris(model.routingSlip || []);
        return event;
    }
    clone() {
        return KernelEventEnvelope.fromJson(this.toJson());
    }
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function isFunction(value) {
    return typeof value === 'function';
}

function createErrorClass(createImpl) {
    var _super = function (instance) {
        Error.call(instance);
        instance.stack = new Error().stack;
    };
    var ctorFunc = createImpl(_super);
    ctorFunc.prototype = Object.create(Error.prototype);
    ctorFunc.prototype.constructor = ctorFunc;
    return ctorFunc;
}

var UnsubscriptionError = createErrorClass(function (_super) {
    return function UnsubscriptionErrorImpl(errors) {
        _super(this);
        this.message = errors
            ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ')
            : '';
        this.name = 'UnsubscriptionError';
        this.errors = errors;
    };
});

function arrRemove(arr, item) {
    if (arr) {
        var index = arr.indexOf(item);
        0 <= index && arr.splice(index, 1);
    }
}

var Subscription = (function () {
    function Subscription(initialTeardown) {
        this.initialTeardown = initialTeardown;
        this.closed = false;
        this._parentage = null;
        this._finalizers = null;
    }
    Subscription.prototype.unsubscribe = function () {
        var e_1, _a, e_2, _b;
        var errors;
        if (!this.closed) {
            this.closed = true;
            var _parentage = this._parentage;
            if (_parentage) {
                this._parentage = null;
                if (Array.isArray(_parentage)) {
                    try {
                        for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
                            var parent_1 = _parentage_1_1.value;
                            parent_1.remove(this);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return)) _a.call(_parentage_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                else {
                    _parentage.remove(this);
                }
            }
            var initialFinalizer = this.initialTeardown;
            if (isFunction(initialFinalizer)) {
                try {
                    initialFinalizer();
                }
                catch (e) {
                    errors = e instanceof UnsubscriptionError ? e.errors : [e];
                }
            }
            var _finalizers = this._finalizers;
            if (_finalizers) {
                this._finalizers = null;
                try {
                    for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
                        var finalizer = _finalizers_1_1.value;
                        try {
                            execFinalizer(finalizer);
                        }
                        catch (err) {
                            errors = errors !== null && errors !== void 0 ? errors : [];
                            if (err instanceof UnsubscriptionError) {
                                errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
                            }
                            else {
                                errors.push(err);
                            }
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return)) _b.call(_finalizers_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            if (errors) {
                throw new UnsubscriptionError(errors);
            }
        }
    };
    Subscription.prototype.add = function (teardown) {
        var _a;
        if (teardown && teardown !== this) {
            if (this.closed) {
                execFinalizer(teardown);
            }
            else {
                if (teardown instanceof Subscription) {
                    if (teardown.closed || teardown._hasParent(this)) {
                        return;
                    }
                    teardown._addParent(this);
                }
                (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
            }
        }
    };
    Subscription.prototype._hasParent = function (parent) {
        var _parentage = this._parentage;
        return _parentage === parent || (Array.isArray(_parentage) && _parentage.includes(parent));
    };
    Subscription.prototype._addParent = function (parent) {
        var _parentage = this._parentage;
        this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
    };
    Subscription.prototype._removeParent = function (parent) {
        var _parentage = this._parentage;
        if (_parentage === parent) {
            this._parentage = null;
        }
        else if (Array.isArray(_parentage)) {
            arrRemove(_parentage, parent);
        }
    };
    Subscription.prototype.remove = function (teardown) {
        var _finalizers = this._finalizers;
        _finalizers && arrRemove(_finalizers, teardown);
        if (teardown instanceof Subscription) {
            teardown._removeParent(this);
        }
    };
    Subscription.EMPTY = (function () {
        var empty = new Subscription();
        empty.closed = true;
        return empty;
    })();
    return Subscription;
}());
var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
function isSubscription(value) {
    return (value instanceof Subscription ||
        (value && 'closed' in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe)));
}
function execFinalizer(finalizer) {
    if (isFunction(finalizer)) {
        finalizer();
    }
    else {
        finalizer.unsubscribe();
    }
}

var config = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: undefined,
    useDeprecatedSynchronousErrorHandling: false,
    useDeprecatedNextContext: false,
};

var timeoutProvider = {
    setTimeout: function (handler, timeout) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var delegate = timeoutProvider.delegate;
        if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) {
            return delegate.setTimeout.apply(delegate, __spreadArray([handler, timeout], __read(args)));
        }
        return setTimeout.apply(void 0, __spreadArray([handler, timeout], __read(args)));
    },
    clearTimeout: function (handle) {
        var delegate = timeoutProvider.delegate;
        return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
    },
    delegate: undefined,
};

function reportUnhandledError(err) {
    timeoutProvider.setTimeout(function () {
        {
            throw err;
        }
    });
}

function noop() { }

var context = null;
function errorContext(cb) {
    if (config.useDeprecatedSynchronousErrorHandling) {
        var isRoot = !context;
        if (isRoot) {
            context = { errorThrown: false, error: null };
        }
        cb();
        if (isRoot) {
            var _a = context, errorThrown = _a.errorThrown, error = _a.error;
            context = null;
            if (errorThrown) {
                throw error;
            }
        }
    }
    else {
        cb();
    }
}

var Subscriber = (function (_super) {
    __extends(Subscriber, _super);
    function Subscriber(destination) {
        var _this = _super.call(this) || this;
        _this.isStopped = false;
        if (destination) {
            _this.destination = destination;
            if (isSubscription(destination)) {
                destination.add(_this);
            }
        }
        else {
            _this.destination = EMPTY_OBSERVER;
        }
        return _this;
    }
    Subscriber.create = function (next, error, complete) {
        return new SafeSubscriber(next, error, complete);
    };
    Subscriber.prototype.next = function (value) {
        if (this.isStopped) ;
        else {
            this._next(value);
        }
    };
    Subscriber.prototype.error = function (err) {
        if (this.isStopped) ;
        else {
            this.isStopped = true;
            this._error(err);
        }
    };
    Subscriber.prototype.complete = function () {
        if (this.isStopped) ;
        else {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (!this.closed) {
            this.isStopped = true;
            _super.prototype.unsubscribe.call(this);
            this.destination = null;
        }
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        try {
            this.destination.error(err);
        }
        finally {
            this.unsubscribe();
        }
    };
    Subscriber.prototype._complete = function () {
        try {
            this.destination.complete();
        }
        finally {
            this.unsubscribe();
        }
    };
    return Subscriber;
}(Subscription));
var _bind = Function.prototype.bind;
function bind(fn, thisArg) {
    return _bind.call(fn, thisArg);
}
var ConsumerObserver = (function () {
    function ConsumerObserver(partialObserver) {
        this.partialObserver = partialObserver;
    }
    ConsumerObserver.prototype.next = function (value) {
        var partialObserver = this.partialObserver;
        if (partialObserver.next) {
            try {
                partialObserver.next(value);
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
    };
    ConsumerObserver.prototype.error = function (err) {
        var partialObserver = this.partialObserver;
        if (partialObserver.error) {
            try {
                partialObserver.error(err);
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
        else {
            handleUnhandledError(err);
        }
    };
    ConsumerObserver.prototype.complete = function () {
        var partialObserver = this.partialObserver;
        if (partialObserver.complete) {
            try {
                partialObserver.complete();
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
    };
    return ConsumerObserver;
}());
var SafeSubscriber = (function (_super) {
    __extends(SafeSubscriber, _super);
    function SafeSubscriber(observerOrNext, error, complete) {
        var _this = _super.call(this) || this;
        var partialObserver;
        if (isFunction(observerOrNext) || !observerOrNext) {
            partialObserver = {
                next: (observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : undefined),
                error: error !== null && error !== void 0 ? error : undefined,
                complete: complete !== null && complete !== void 0 ? complete : undefined,
            };
        }
        else {
            var context_1;
            if (_this && config.useDeprecatedNextContext) {
                context_1 = Object.create(observerOrNext);
                context_1.unsubscribe = function () { return _this.unsubscribe(); };
                partialObserver = {
                    next: observerOrNext.next && bind(observerOrNext.next, context_1),
                    error: observerOrNext.error && bind(observerOrNext.error, context_1),
                    complete: observerOrNext.complete && bind(observerOrNext.complete, context_1),
                };
            }
            else {
                partialObserver = observerOrNext;
            }
        }
        _this.destination = new ConsumerObserver(partialObserver);
        return _this;
    }
    return SafeSubscriber;
}(Subscriber));
function handleUnhandledError(error) {
    {
        reportUnhandledError(error);
    }
}
function defaultErrorHandler(err) {
    throw err;
}
var EMPTY_OBSERVER = {
    closed: true,
    next: noop,
    error: defaultErrorHandler,
    complete: noop,
};

var observable = (function () { return (typeof Symbol === 'function' && Symbol.observable) || '@@observable'; })();

function identity(x) {
    return x;
}

function pipeFromArray(fns) {
    if (fns.length === 0) {
        return identity;
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce(function (prev, fn) { return fn(prev); }, input);
    };
}

var Observable = (function () {
    function Observable(subscribe) {
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    Observable.prototype.lift = function (operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var _this = this;
        var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
        errorContext(function () {
            var _a = _this, operator = _a.operator, source = _a.source;
            subscriber.add(operator
                ?
                    operator.call(subscriber, source)
                : source
                    ?
                        _this._subscribe(subscriber)
                    :
                        _this._trySubscribe(subscriber));
        });
        return subscriber;
    };
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            sink.error(err);
        }
    };
    Observable.prototype.forEach = function (next, promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var subscriber = new SafeSubscriber({
                next: function (value) {
                    try {
                        next(value);
                    }
                    catch (err) {
                        reject(err);
                        subscriber.unsubscribe();
                    }
                },
                error: reject,
                complete: resolve,
            });
            _this.subscribe(subscriber);
        });
    };
    Observable.prototype._subscribe = function (subscriber) {
        var _a;
        return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
    };
    Observable.prototype[observable] = function () {
        return this;
    };
    Observable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        return pipeFromArray(operations)(this);
    };
    Observable.prototype.toPromise = function (promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var value;
            _this.subscribe(function (x) { return (value = x); }, function (err) { return reject(err); }, function () { return resolve(value); });
        });
    };
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}());
function getPromiseCtor(promiseCtor) {
    var _a;
    return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a !== void 0 ? _a : Promise;
}
function isObserver(value) {
    return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
}
function isSubscriber(value) {
    return (value && value instanceof Subscriber) || (isObserver(value) && isSubscription(value));
}

function hasLift(source) {
    return isFunction(source === null || source === void 0 ? void 0 : source.lift);
}
function operate(init) {
    return function (source) {
        if (hasLift(source)) {
            return source.lift(function (liftedSource) {
                try {
                    return init(liftedSource, this);
                }
                catch (err) {
                    this.error(err);
                }
            });
        }
        throw new TypeError('Unable to lift unknown Observable type');
    };
}

function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
    return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
}
var OperatorSubscriber = (function (_super) {
    __extends(OperatorSubscriber, _super);
    function OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
        var _this = _super.call(this, destination) || this;
        _this.onFinalize = onFinalize;
        _this.shouldUnsubscribe = shouldUnsubscribe;
        _this._next = onNext
            ? function (value) {
                try {
                    onNext(value);
                }
                catch (err) {
                    destination.error(err);
                }
            }
            : _super.prototype._next;
        _this._error = onError
            ? function (err) {
                try {
                    onError(err);
                }
                catch (err) {
                    destination.error(err);
                }
                finally {
                    this.unsubscribe();
                }
            }
            : _super.prototype._error;
        _this._complete = onComplete
            ? function () {
                try {
                    onComplete();
                }
                catch (err) {
                    destination.error(err);
                }
                finally {
                    this.unsubscribe();
                }
            }
            : _super.prototype._complete;
        return _this;
    }
    OperatorSubscriber.prototype.unsubscribe = function () {
        var _a;
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            var closed_1 = this.closed;
            _super.prototype.unsubscribe.call(this);
            !closed_1 && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
        }
    };
    return OperatorSubscriber;
}(Subscriber));

var ObjectUnsubscribedError = createErrorClass(function (_super) {
    return function ObjectUnsubscribedErrorImpl() {
        _super(this);
        this.name = 'ObjectUnsubscribedError';
        this.message = 'object unsubscribed';
    };
});

var Subject = (function (_super) {
    __extends(Subject, _super);
    function Subject() {
        var _this = _super.call(this) || this;
        _this.closed = false;
        _this.currentObservers = null;
        _this.observers = [];
        _this.isStopped = false;
        _this.hasError = false;
        _this.thrownError = null;
        return _this;
    }
    Subject.prototype.lift = function (operator) {
        var subject = new AnonymousSubject(this, this);
        subject.operator = operator;
        return subject;
    };
    Subject.prototype._throwIfClosed = function () {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
    };
    Subject.prototype.next = function (value) {
        var _this = this;
        errorContext(function () {
            var e_1, _a;
            _this._throwIfClosed();
            if (!_this.isStopped) {
                if (!_this.currentObservers) {
                    _this.currentObservers = Array.from(_this.observers);
                }
                try {
                    for (var _b = __values(_this.currentObservers), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var observer = _c.value;
                        observer.next(value);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
        });
    };
    Subject.prototype.error = function (err) {
        var _this = this;
        errorContext(function () {
            _this._throwIfClosed();
            if (!_this.isStopped) {
                _this.hasError = _this.isStopped = true;
                _this.thrownError = err;
                var observers = _this.observers;
                while (observers.length) {
                    observers.shift().error(err);
                }
            }
        });
    };
    Subject.prototype.complete = function () {
        var _this = this;
        errorContext(function () {
            _this._throwIfClosed();
            if (!_this.isStopped) {
                _this.isStopped = true;
                var observers = _this.observers;
                while (observers.length) {
                    observers.shift().complete();
                }
            }
        });
    };
    Subject.prototype.unsubscribe = function () {
        this.isStopped = this.closed = true;
        this.observers = this.currentObservers = null;
    };
    Object.defineProperty(Subject.prototype, "observed", {
        get: function () {
            var _a;
            return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
        },
        enumerable: false,
        configurable: true
    });
    Subject.prototype._trySubscribe = function (subscriber) {
        this._throwIfClosed();
        return _super.prototype._trySubscribe.call(this, subscriber);
    };
    Subject.prototype._subscribe = function (subscriber) {
        this._throwIfClosed();
        this._checkFinalizedStatuses(subscriber);
        return this._innerSubscribe(subscriber);
    };
    Subject.prototype._innerSubscribe = function (subscriber) {
        var _this = this;
        var _a = this, hasError = _a.hasError, isStopped = _a.isStopped, observers = _a.observers;
        if (hasError || isStopped) {
            return EMPTY_SUBSCRIPTION;
        }
        this.currentObservers = null;
        observers.push(subscriber);
        return new Subscription(function () {
            _this.currentObservers = null;
            arrRemove(observers, subscriber);
        });
    };
    Subject.prototype._checkFinalizedStatuses = function (subscriber) {
        var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, isStopped = _a.isStopped;
        if (hasError) {
            subscriber.error(thrownError);
        }
        else if (isStopped) {
            subscriber.complete();
        }
    };
    Subject.prototype.asObservable = function () {
        var observable = new Observable();
        observable.source = this;
        return observable;
    };
    Subject.create = function (destination, source) {
        return new AnonymousSubject(destination, source);
    };
    return Subject;
}(Observable));
var AnonymousSubject = (function (_super) {
    __extends(AnonymousSubject, _super);
    function AnonymousSubject(destination, source) {
        var _this = _super.call(this) || this;
        _this.destination = destination;
        _this.source = source;
        return _this;
    }
    AnonymousSubject.prototype.next = function (value) {
        var _a, _b;
        (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
    };
    AnonymousSubject.prototype.error = function (err) {
        var _a, _b;
        (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
    };
    AnonymousSubject.prototype.complete = function () {
        var _a, _b;
        (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    AnonymousSubject.prototype._subscribe = function (subscriber) {
        var _a, _b;
        return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : EMPTY_SUBSCRIPTION;
    };
    return AnonymousSubject;
}(Subject));

function map(project, thisArg) {
    return operate(function (source, subscriber) {
        var index = 0;
        source.subscribe(createOperatorSubscriber(subscriber, function (value) {
            subscriber.next(project.call(thisArg, value, index++));
        }));
    });
}

// Copyright (c) .NET Foundation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
function isPromiseCompletionSource(obj) {
    return obj.promise
        && obj.resolve
        && obj.reject;
}
class PromiseCompletionSource {
    constructor() {
        this._resolve = () => { };
        this._reject = () => { };
        this.promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }
    resolve(value) {
        this._resolve(value);
    }
    reject(reason) {
        this._reject(reason);
    }
}

// Copyright (c) .NET Foundation and contributors. All rights reserved.
class KernelInvocationContext {
    constructor(kernelCommandInvocation) {
        this._childCommands = [];
        this._eventSubject = new Subject();
        this._isComplete = false;
        this._handlingKernel = null;
        this._completionSource = new PromiseCompletionSource();
        this._commandEnvelope = kernelCommandInvocation;
    }
    get handlingKernel() {
        return this._handlingKernel;
    }
    ;
    get kernelEvents() {
        return this._eventSubject.asObservable();
    }
    ;
    set handlingKernel(value) {
        this._handlingKernel = value;
    }
    get promise() {
        return this._completionSource.promise;
    }
    static getOrCreateAmbientContext(command) {
        let current = KernelInvocationContext._current;
        if (!current || current._isComplete) {
            command.getOrCreateToken();
            KernelInvocationContext._current = new KernelInvocationContext(command);
        }
        else {
            if (!KernelCommandEnvelope.areCommandsTheSame(command, current._commandEnvelope)) {
                const found = current._childCommands.includes(command);
                if (!found) {
                    if (command.parentCommand === null || command.parentCommand === undefined) {
                        command.setParent(current._commandEnvelope);
                    }
                    current._childCommands.push(command);
                }
            }
        }
        return KernelInvocationContext._current;
    }
    static get current() { return this._current; }
    get command() { return this._commandEnvelope.command; }
    get commandEnvelope() { return this._commandEnvelope; }
    complete(command) {
        if (KernelCommandEnvelope.areCommandsTheSame(command, this._commandEnvelope)) {
            this._isComplete = true;
            let succeeded = {};
            let eventEnvelope = new KernelEventEnvelope(CommandSucceededType, succeeded, this._commandEnvelope);
            this.internalPublish(eventEnvelope);
            this._completionSource.resolve();
        }
        else {
            let pos = this._childCommands.indexOf(command);
            delete this._childCommands[pos];
        }
    }
    fail(message) {
        // The C# code accepts a message and/or an exception. Do we need to add support
        // for exceptions? (The TS CommandFailed interface doesn't have a place for it right now.)
        this._isComplete = true;
        let failed = { message: message !== null && message !== void 0 ? message : "Command Failed" };
        let eventEnvelope = new KernelEventEnvelope(CommandFailedType, failed, this._commandEnvelope);
        this.internalPublish(eventEnvelope);
        this._completionSource.resolve();
    }
    publish(kernelEvent) {
        if (!this._isComplete) {
            this.internalPublish(kernelEvent);
        }
    }
    internalPublish(kernelEvent) {
        if (!kernelEvent.command) {
            kernelEvent.command = this._commandEnvelope;
        }
        let command = kernelEvent.command;
        if (this.handlingKernel) {
            const kernelUri = getKernelUri(this.handlingKernel);
            if (!kernelEvent.routingSlip.contains(kernelUri)) {
                kernelEvent.routingSlip.stamp(kernelUri);
                kernelEvent.routingSlip; //?
            }
        }
        this._commandEnvelope; //?
        if (command === null ||
            command === undefined ||
            KernelCommandEnvelope.areCommandsTheSame(command, this._commandEnvelope) ||
            this._childCommands.includes(command)) {
            this._eventSubject.next(kernelEvent);
        }
        else if (command.isSelforDescendantOf(this._commandEnvelope)) {
            this._eventSubject.next(kernelEvent);
        }
        else if (command.hasSameRootCommandAs(this._commandEnvelope)) {
            this._eventSubject.next(kernelEvent);
        }
    }
    isParentOfCommand(commandEnvelope) {
        const childFound = this._childCommands.includes(commandEnvelope);
        return childFound;
    }
    dispose() {
        if (!this._isComplete) {
            this.complete(this._commandEnvelope);
        }
        KernelInvocationContext._current = null;
    }
}
KernelInvocationContext._current = null;

// Copyright (c) .NET Foundation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Info"] = 0] = "Info";
    LogLevel[LogLevel["Warn"] = 1] = "Warn";
    LogLevel[LogLevel["Error"] = 2] = "Error";
    LogLevel[LogLevel["None"] = 3] = "None";
})(LogLevel || (LogLevel = {}));
class Logger {
    constructor(source, write) {
        this.source = source;
        this.write = write;
    }
    info(message) {
        this.write({ logLevel: LogLevel.Info, source: this.source, message });
    }
    warn(message) {
        this.write({ logLevel: LogLevel.Warn, source: this.source, message });
    }
    error(message) {
        this.write({ logLevel: LogLevel.Error, source: this.source, message });
    }
    static configure(source, writer) {
        const logger = new Logger(source, writer);
        Logger._default = logger;
    }
    static get default() {
        if (Logger._default) {
            return Logger._default;
        }
        throw new Error('No logger has been configured for this context');
    }
}
Logger._default = new Logger('default', (_entry) => { });

// Copyright (c) .NET Foundation and contributors. All rights reserved.
class KernelScheduler {
    setMustTrampoline(predicate) {
        this._mustTrampoline = predicate !== null && predicate !== void 0 ? predicate : ((_c) => false);
    }
    constructor() {
        this._operationQueue = [];
        this._mustTrampoline = (_c) => false;
    }
    cancelCurrentOperation() {
        var _a;
        (_a = this._inFlightOperation) === null || _a === void 0 ? void 0 : _a.promiseCompletionSource.reject(new Error("Operation cancelled"));
    }
    runAsync(value, executor) {
        const operation = {
            value,
            executor,
            promiseCompletionSource: new PromiseCompletionSource(),
        };
        const mustTrampoline = this._mustTrampoline(value);
        if (this._inFlightOperation && !mustTrampoline) {
            Logger.default.info(`kernelScheduler: starting immediate execution of ${JSON.stringify(operation.value)}`);
            // invoke immediately
            return operation.executor(operation.value)
                .then(() => {
                Logger.default.info(`kernelScheduler: immediate execution completed: ${JSON.stringify(operation.value)}`);
                operation.promiseCompletionSource.resolve();
            })
                .catch(e => {
                Logger.default.info(`kernelScheduler: immediate execution failed: ${JSON.stringify(e)} - ${JSON.stringify(operation.value)}`);
                operation.promiseCompletionSource.reject(e);
            });
        }
        Logger.default.info(`kernelScheduler: scheduling execution of ${JSON.stringify(operation.value)}`);
        this._operationQueue.push(operation);
        if (this._operationQueue.length === 1) {
            setTimeout(() => {
                this.executeNextCommand();
            }, 0);
        }
        return operation.promiseCompletionSource.promise;
    }
    executeNextCommand() {
        const nextOperation = this._operationQueue.length > 0 ? this._operationQueue[0] : undefined;
        if (nextOperation) {
            this._inFlightOperation = nextOperation;
            Logger.default.info(`kernelScheduler: starting scheduled execution of ${JSON.stringify(nextOperation.value)}`);
            nextOperation.executor(nextOperation.value)
                .then(() => {
                this._inFlightOperation = undefined;
                Logger.default.info(`kernelScheduler: completing inflight operation: success ${JSON.stringify(nextOperation.value)}`);
                nextOperation.promiseCompletionSource.resolve();
            })
                .catch(e => {
                this._inFlightOperation = undefined;
                Logger.default.info(`kernelScheduler: completing inflight operation: failure ${JSON.stringify(e)} - ${JSON.stringify(nextOperation.value)}`);
                nextOperation.promiseCompletionSource.reject(e);
            })
                .finally(() => {
                this._inFlightOperation = undefined;
                setTimeout(() => {
                    this._operationQueue.shift();
                    this.executeNextCommand();
                }, 0);
            });
        }
    }
}

// Copyright (c) .NET Foundation and contributors. All rights reserved.
class Kernel {
    get kernelInfo() {
        return this._kernelInfo;
    }
    get kernelEvents() {
        return this._eventSubject.asObservable();
    }
    constructor(name, languageName, languageVersion, displayName) {
        this.name = name;
        this._commandHandlers = new Map();
        this._eventSubject = new Subject();
        this.rootKernel = this;
        this.parentKernel = null;
        this._scheduler = null;
        this._kernelInfo = {
            isProxy: false,
            isComposite: false,
            localName: name,
            languageName: languageName,
            aliases: [],
            uri: createKernelUri(`kernel://local/${name}`),
            languageVersion: languageVersion,
            displayName: displayName !== null && displayName !== void 0 ? displayName : name,
            supportedKernelCommands: []
        };
        this._internalRegisterCommandHandler({
            commandType: RequestKernelInfoType, handle: async (invocation) => {
                await this.handleRequestKernelInfo(invocation);
            }
        });
    }
    async handleRequestKernelInfo(invocation) {
        const eventEnvelope = new KernelEventEnvelope(KernelInfoProducedType, { kernelInfo: this._kernelInfo }, invocation.commandEnvelope); //?
        invocation.context.publish(eventEnvelope);
        return Promise.resolve();
    }
    getScheduler() {
        var _a, _b;
        if (!this._scheduler) {
            this._scheduler = (_b = (_a = this.parentKernel) === null || _a === void 0 ? void 0 : _a.getScheduler()) !== null && _b !== void 0 ? _b : new KernelScheduler();
        }
        return this._scheduler;
    }
    static get current() {
        if (KernelInvocationContext.current) {
            return KernelInvocationContext.current.handlingKernel;
        }
        return null;
    }
    static get root() {
        if (Kernel.current) {
            return Kernel.current.rootKernel;
        }
        return null;
    }
    // Is it worth us going to efforts to ensure that the Promise returned here accurately reflects
    // the command's progress? The only thing that actually calls this is the kernel channel, through
    // the callback set up by attachKernelToChannel, and the callback is expected to return void, so
    // nothing is ever going to look at the promise we return here.
    async send(commandEnvelopeOrModel) {
        let commandEnvelope = commandEnvelopeOrModel;
        if (KernelCommandEnvelope.isKernelCommandEnvelopeModel(commandEnvelopeOrModel)) {
            Logger.default.warn(`Converting command envelope model to command envelope for backawards compatibility.`);
            commandEnvelope = KernelCommandEnvelope.fromJson(commandEnvelopeOrModel);
        }
        const context = KernelInvocationContext.getOrCreateAmbientContext(commandEnvelope);
        if (context.commandEnvelope) {
            if (!KernelCommandEnvelope.areCommandsTheSame(context.commandEnvelope, commandEnvelope)) {
                commandEnvelope.setParent(context.commandEnvelope);
            }
        }
        const kernelUri = getKernelUri(this);
        if (!commandEnvelope.routingSlip.contains(kernelUri)) {
            commandEnvelope.routingSlip.stampAsArrived(kernelUri);
        }
        else {
            Logger.default.warn(`Trying to stamp ${commandEnvelope.commandType} as arrived but uri ${kernelUri} is already present.`);
        }
        return this.getScheduler().runAsync(commandEnvelope, (value) => this.executeCommand(value).finally(() => {
            if (!commandEnvelope.routingSlip.contains(kernelUri)) {
                commandEnvelope.routingSlip.stamp(kernelUri);
            }
            else {
                Logger.default.warn(`Trying to stamp ${commandEnvelope.commandType} as completed but uri ${kernelUri} is already present.`);
            }
        }));
    }
    async executeCommand(commandEnvelope) {
        let context = KernelInvocationContext.getOrCreateAmbientContext(commandEnvelope);
        let previousHandlingKernel = context.handlingKernel;
        try {
            await this.handleCommand(commandEnvelope);
        }
        catch (e) {
            context.fail((e === null || e === void 0 ? void 0 : e.message) || JSON.stringify(e));
        }
        finally {
            context.handlingKernel = previousHandlingKernel;
        }
    }
    getCommandHandler(commandType) {
        return this._commandHandlers.get(commandType);
    }
    handleCommand(commandEnvelope) {
        return new Promise(async (resolve, reject) => {
            let context = KernelInvocationContext.getOrCreateAmbientContext(commandEnvelope);
            const previoudHendlingKernel = context.handlingKernel;
            context.handlingKernel = this;
            let isRootCommand = KernelCommandEnvelope.areCommandsTheSame(context.commandEnvelope, commandEnvelope);
            let eventSubscription = undefined;
            if (isRootCommand) {
                const kernelType = (this.kernelInfo.isProxy ? "proxy" : "") + (this.kernelInfo.isComposite ? "composite" : "");
                Logger.default.info(`kernel ${this.name} of type ${kernelType} subscribing to context events`);
                eventSubscription = context.kernelEvents.pipe(map(e => {
                    var _a;
                    const message = `kernel ${this.name} of type ${kernelType} saw event ${e.eventType} with token ${(_a = e.command) === null || _a === void 0 ? void 0 : _a.getToken()}`;
                    Logger.default.info(message);
                    const kernelUri = getKernelUri(this);
                    if (!e.routingSlip.contains(kernelUri)) {
                        e.routingSlip.stamp(kernelUri);
                    }
                    return e;
                }))
                    .subscribe(this.publishEvent.bind(this));
            }
            let handler = this.getCommandHandler(commandEnvelope.commandType);
            if (handler) {
                try {
                    Logger.default.info(`kernel ${this.name} about to handle command: ${JSON.stringify(commandEnvelope)}`);
                    await handler.handle({ commandEnvelope: commandEnvelope, context }).catch(e => {
                        Logger.default.error(`Error when handing command ${commandEnvelope}: ${e}`);
                    });
                    context.complete(commandEnvelope);
                    context.handlingKernel = previoudHendlingKernel;
                    if (isRootCommand) {
                        eventSubscription === null || eventSubscription === void 0 ? void 0 : eventSubscription.unsubscribe();
                        context.dispose();
                    }
                    Logger.default.info(`kernel ${this.name} done handling command: ${JSON.stringify(commandEnvelope)}`);
                    resolve();
                }
                catch (e) {
                    context.fail((e === null || e === void 0 ? void 0 : e.message) || JSON.stringify(e));
                    context.handlingKernel = previoudHendlingKernel;
                    if (isRootCommand) {
                        eventSubscription === null || eventSubscription === void 0 ? void 0 : eventSubscription.unsubscribe();
                        context.dispose();
                    }
                    reject(e);
                }
            }
            else {
                // hack like there is no tomorrow
                const shouldNoop = this.shouldNoopCommand(commandEnvelope, context);
                if (shouldNoop) {
                    context.complete(commandEnvelope);
                }
                context.handlingKernel = previoudHendlingKernel;
                if (isRootCommand) {
                    eventSubscription === null || eventSubscription === void 0 ? void 0 : eventSubscription.unsubscribe();
                    context.dispose();
                }
                if (!shouldNoop) {
                    reject(new Error(`No handler found for command type ${commandEnvelope.commandType}`));
                }
                else {
                    Logger.default.warn(`kernel ${this.name} done noop handling command: ${JSON.stringify(commandEnvelope)}`);
                    resolve();
                }
            }
        });
    }
    shouldNoopCommand(commandEnvelope, context) {
        let shouldNoop = false;
        switch (commandEnvelope.commandType) {
            case RequestCompletionsType:
            case RequestSignatureHelpType:
            case RequestDiagnosticsType:
            case RequestHoverTextType:
                shouldNoop = true;
                break;
            default:
                shouldNoop = false;
                break;
        }
        return shouldNoop;
    }
    subscribeToKernelEvents(observer) {
        const sub = this._eventSubject.subscribe(observer);
        return {
            dispose: () => { sub.unsubscribe(); }
        };
    }
    canHandle(commandEnvelope) {
        if (commandEnvelope.command.targetKernelName && commandEnvelope.command.targetKernelName !== this.name) {
            return false;
        }
        if (commandEnvelope.command.destinationUri) {
            const normalizedUri = createKernelUri(commandEnvelope.command.destinationUri);
            if (this.kernelInfo.uri !== normalizedUri) {
                return false;
            }
        }
        return this.supportsCommand(commandEnvelope.commandType);
    }
    supportsCommand(commandType) {
        return this._commandHandlers.has(commandType);
    }
    registerCommandHandler(handler) {
        // When a registration already existed, we want to overwrite it because we want users to
        // be able to develop handlers iteratively, and it would be unhelpful for handler registration
        // for any particular command to be cumulative.
        var _a;
        const shouldNotify = !this._commandHandlers.has(handler.commandType);
        this._internalRegisterCommandHandler(handler);
        if (shouldNotify) {
            const event = {
                kernelInfo: this._kernelInfo,
            };
            const envelope = new KernelEventEnvelope(KernelInfoProducedType, event, (_a = KernelInvocationContext.current) === null || _a === void 0 ? void 0 : _a.commandEnvelope);
            envelope.routingSlip.stamp(getKernelUri(this));
            const context = KernelInvocationContext.current;
            if (context) {
                envelope.command = context.commandEnvelope;
                context.publish(envelope);
            }
            else {
                this.publishEvent(envelope);
            }
        }
    }
    _internalRegisterCommandHandler(handler) {
        this._commandHandlers.set(handler.commandType, handler);
        this._kernelInfo.supportedKernelCommands = Array.from(this._commandHandlers.keys()).map(commandName => ({ name: commandName }));
    }
    getHandlingKernel(commandEnvelope, context) {
        if (this.canHandle(commandEnvelope)) {
            return this;
        }
        else {
            context === null || context === void 0 ? void 0 : context.fail(`Command ${commandEnvelope.commandType} is not supported by Kernel ${this.name}`);
            return null;
        }
    }
    publishEvent(kernelEvent) {
        this._eventSubject.next(kernelEvent);
    }
}
async function submitCommandAndGetResult(kernel, commandEnvelope, expectedEventType) {
    let completionSource = new PromiseCompletionSource();
    let handled = false;
    let disposable = kernel.subscribeToKernelEvents(eventEnvelope => {
        var _a;
        if (((_a = eventEnvelope.command) === null || _a === void 0 ? void 0 : _a.getToken()) === commandEnvelope.getToken()) {
            switch (eventEnvelope.eventType) {
                case CommandFailedType:
                    if (!handled) {
                        handled = true;
                        let err = eventEnvelope.event;
                        completionSource.reject(err);
                    }
                    break;
                case CommandSucceededType:
                    if (KernelCommandEnvelope.areCommandsTheSame(eventEnvelope.command, commandEnvelope)) {
                        if (!handled) { //? ($ ? eventEnvelope : {})
                            handled = true;
                            completionSource.reject('Command was handled before reporting expected result.');
                        }
                        break;
                    }
                default:
                    if (eventEnvelope.eventType === expectedEventType) {
                        handled = true;
                        let event = eventEnvelope.event; //? ($ ? eventEnvelope : {})
                        completionSource.resolve(event);
                    }
                    break;
            }
        }
    });
    try {
        await kernel.send(commandEnvelope);
    }
    finally {
        disposable.dispose();
    }
    return completionSource.promise;
}
function getKernelUri(kernel) {
    var _a;
    return (_a = kernel.kernelInfo.uri) !== null && _a !== void 0 ? _a : `kernel://local/${kernel.kernelInfo.localName}`;
}

// Copyright (c) .NET Foundation and contributors. All rights reserved.
class CompositeKernel extends Kernel {
    constructor(name) {
        super(name);
        this._host = null;
        this._defaultKernelNamesByCommandType = new Map();
        this.kernelInfo.isComposite = true;
        this._childKernels = new KernelCollection(this);
    }
    get childKernels() {
        return Array.from(this._childKernels);
    }
    get host() {
        return this._host;
    }
    set host(host) {
        this._host = host;
        if (this._host) {
            this.kernelInfo.uri = this._host.uri;
            this._childKernels.notifyThatHostWasSet();
        }
    }
    async handleRequestKernelInfo(invocation) {
        const eventEnvelope = new KernelEventEnvelope(KernelInfoProducedType, { kernelInfo: this.kernelInfo }, invocation.commandEnvelope); //?
        invocation.context.publish(eventEnvelope);
        for (let kernel of this._childKernels) {
            if (kernel.supportsCommand(invocation.commandEnvelope.commandType)) {
                const childCommand = new KernelCommandEnvelope(RequestKernelInfoType, {
                    targetKernelName: kernel.kernelInfo.localName
                });
                childCommand.setParent(invocation.commandEnvelope);
                childCommand.routingSlip.continueWith(invocation.commandEnvelope.routingSlip);
                await kernel.handleCommand(childCommand);
            }
        }
    }
    add(kernel, aliases) {
        if (!kernel) {
            throw new Error("kernel cannot be null or undefined");
        }
        if (!this.defaultKernelName) {
            // default to first kernel
            this.defaultKernelName = kernel.name;
        }
        kernel.parentKernel = this;
        kernel.rootKernel = this.rootKernel;
        kernel.kernelEvents.subscribe({
            next: (event) => {
                const kernelUri = getKernelUri(this);
                if (!event.routingSlip.contains(kernelUri)) {
                    event.routingSlip.stamp(kernelUri);
                }
                this.publishEvent(event);
            }
        });
        if (aliases) {
            let set = new Set(aliases);
            if (kernel.kernelInfo.aliases) {
                for (let alias in kernel.kernelInfo.aliases) {
                    set.add(alias);
                }
            }
            kernel.kernelInfo.aliases = Array.from(set);
        }
        this._childKernels.add(kernel, aliases);
        const invocationContext = KernelInvocationContext.current;
        if (invocationContext) {
            invocationContext.commandEnvelope;
            const event = new KernelEventEnvelope(KernelInfoProducedType, {
                kernelInfo: kernel.kernelInfo
            }, invocationContext.commandEnvelope);
            invocationContext.publish(event);
        }
        else {
            const event = new KernelEventEnvelope(KernelInfoProducedType, {
                kernelInfo: kernel.kernelInfo
            });
            this.publishEvent(event);
        }
    }
    findKernelByUri(uri) {
        const normalized = createKernelUri(uri);
        if (this.kernelInfo.uri === normalized) {
            return this;
        }
        return this._childKernels.tryGetByUri(normalized);
    }
    findKernelByName(name) {
        if (this.kernelInfo.localName === name || this.kernelInfo.aliases.find(a => a === name)) {
            return this;
        }
        return this._childKernels.tryGetByAlias(name);
    }
    findKernels(predicate) {
        var results = [];
        if (predicate(this)) {
            results.push(this);
        }
        for (let kernel of this.childKernels) {
            if (predicate(kernel)) {
                results.push(kernel);
            }
        }
        return results;
    }
    findKernel(predicate) {
        if (predicate(this)) {
            return this;
        }
        return this.childKernels.find(predicate);
    }
    setDefaultTargetKernelNameForCommand(commandType, kernelName) {
        this._defaultKernelNamesByCommandType.set(commandType, kernelName);
    }
    handleCommand(commandEnvelope) {
        var _a;
        const invocationContext = KernelInvocationContext.current;
        let kernel = commandEnvelope.command.targetKernelName === this.name
            ? this
            : this.getHandlingKernel(commandEnvelope, invocationContext);
        const previusoHandlingKernel = (_a = invocationContext === null || invocationContext === void 0 ? void 0 : invocationContext.handlingKernel) !== null && _a !== void 0 ? _a : null;
        if (kernel === this) {
            if (invocationContext !== null) {
                invocationContext.handlingKernel = kernel;
            }
            return super.handleCommand(commandEnvelope).finally(() => {
                if (invocationContext !== null) {
                    invocationContext.handlingKernel = previusoHandlingKernel;
                }
            });
        }
        else if (kernel) {
            if (invocationContext !== null) {
                invocationContext.handlingKernel = kernel;
            }
            const kernelUri = getKernelUri(kernel);
            if (!commandEnvelope.routingSlip.contains(kernelUri)) {
                commandEnvelope.routingSlip.stampAsArrived(kernelUri);
            }
            else {
                Logger.default.warn(`Trying to stamp ${commandEnvelope.commandType} as arrived but uri ${kernelUri} is already present.`);
            }
            return kernel.handleCommand(commandEnvelope)
                .catch(e => {
                Logger.default.error(`Error when handing command ${commandEnvelope}: ${e}`);
            })
                .finally(() => {
                if (invocationContext !== null) {
                    invocationContext.handlingKernel = previusoHandlingKernel;
                }
                if (!commandEnvelope.routingSlip.contains(kernelUri)) {
                    commandEnvelope.routingSlip.stamp(kernelUri);
                }
                else {
                    Logger.default.warn(`Trying to stamp ${commandEnvelope.commandType} as completed but uri ${kernelUri} is already present.`);
                }
            });
        }
        if (invocationContext !== null) {
            invocationContext.handlingKernel = previusoHandlingKernel;
        }
        return Promise.reject(new Error("Kernel not found: " + commandEnvelope.command.targetKernelName));
    }
    getHandlingKernel(commandEnvelope, context) {
        var _a, _b, _c, _d, _e;
        let kernel = null;
        if (commandEnvelope.command.destinationUri) {
            const normalized = createKernelUri(commandEnvelope.command.destinationUri);
            kernel = (_a = this._childKernels.tryGetByUri(normalized)) !== null && _a !== void 0 ? _a : null;
            if (kernel) {
                return kernel;
            }
        }
        let targetKernelName = commandEnvelope.command.targetKernelName;
        if (targetKernelName === undefined || targetKernelName === null) {
            if (this.canHandle(commandEnvelope)) {
                return this;
            }
            targetKernelName = (_b = this._defaultKernelNamesByCommandType.get(commandEnvelope.commandType)) !== null && _b !== void 0 ? _b : this.defaultKernelName;
        }
        if (targetKernelName !== undefined && targetKernelName !== null) {
            kernel = (_c = this._childKernels.tryGetByAlias(targetKernelName)) !== null && _c !== void 0 ? _c : null;
        }
        if (targetKernelName && !kernel) {
            const errorMessage = `Kernel not found: ${targetKernelName}`;
            Logger.default.error(errorMessage);
            throw new Error(errorMessage);
        }
        if (!kernel) {
            if (this._childKernels.count === 1) {
                kernel = (_d = this._childKernels.single()) !== null && _d !== void 0 ? _d : null;
            }
        }
        if (!kernel) {
            kernel = (_e = context === null || context === void 0 ? void 0 : context.handlingKernel) !== null && _e !== void 0 ? _e : null;
        }
        return kernel !== null && kernel !== void 0 ? kernel : this;
    }
}
class KernelCollection {
    constructor(compositeKernel) {
        this._kernels = [];
        this._nameAndAliasesByKernel = new Map();
        this._kernelsByNameOrAlias = new Map();
        this._kernelsByLocalUri = new Map();
        this._kernelsByRemoteUri = new Map();
        this._compositeKernel = compositeKernel;
    }
    [Symbol.iterator]() {
        let counter = 0;
        return {
            next: () => {
                return {
                    value: this._kernels[counter++],
                    done: counter > this._kernels.length
                };
            }
        };
    }
    single() {
        return this._kernels.length === 1 ? this._kernels[0] : undefined;
    }
    add(kernel, aliases) {
        if (this._kernelsByNameOrAlias.has(kernel.name)) {
            throw new Error(`kernel with name ${kernel.name} already exists`);
        }
        this.updateKernelInfoAndIndex(kernel, aliases);
        this._kernels.push(kernel);
    }
    get count() {
        return this._kernels.length;
    }
    updateKernelInfoAndIndex(kernel, aliases) {
        var _a, _b;
        if (aliases) {
            for (let alias of aliases) {
                if (this._kernelsByNameOrAlias.has(alias)) {
                    throw new Error(`kernel with alias ${alias} already exists`);
                }
            }
        }
        if (!this._nameAndAliasesByKernel.has(kernel)) {
            let set = new Set();
            for (let alias of kernel.kernelInfo.aliases) {
                set.add(alias);
            }
            kernel.kernelInfo.aliases = Array.from(set);
            set.add(kernel.kernelInfo.localName);
            this._nameAndAliasesByKernel.set(kernel, set);
        }
        if (aliases) {
            for (let alias of aliases) {
                this._nameAndAliasesByKernel.get(kernel).add(alias);
            }
        }
        (_a = this._nameAndAliasesByKernel.get(kernel)) === null || _a === void 0 ? void 0 : _a.forEach(alias => {
            this._kernelsByNameOrAlias.set(alias, kernel);
        });
        let baseUri = ((_b = this._compositeKernel.host) === null || _b === void 0 ? void 0 : _b.uri) || this._compositeKernel.kernelInfo.uri;
        if (!baseUri.endsWith("/")) {
            baseUri += "/";
        }
        kernel.kernelInfo.uri = createKernelUri(`${baseUri}${kernel.kernelInfo.localName}`);
        this._kernelsByLocalUri.set(kernel.kernelInfo.uri, kernel);
        if (kernel.kernelInfo.isProxy) {
            this._kernelsByRemoteUri.set(kernel.kernelInfo.remoteUri, kernel);
        }
    }
    tryGetByAlias(alias) {
        return this._kernelsByNameOrAlias.get(alias);
    }
    tryGetByUri(uri) {
        let kernel = this._kernelsByLocalUri.get(uri) || this._kernelsByRemoteUri.get(uri);
        return kernel;
    }
    notifyThatHostWasSet() {
        for (let kernel of this._kernels) {
            this.updateKernelInfoAndIndex(kernel);
        }
    }
}

// Copyright (c) .NET Foundation and contributors. All rights reserved.
function isKernelCommandEnvelope(commandOrEvent) {
    return commandOrEvent.commandType !== undefined;
}
function isKernelCommandEnvelopeModel(commandOrEvent) {
    return commandOrEvent.commandType !== undefined;
}
function isKernelEventEnvelope(commandOrEvent) {
    return commandOrEvent.eventType !== undefined;
}
function isKernelEventEnvelopeModel(commandOrEvent) {
    return commandOrEvent.eventType !== undefined;
}
class KernelCommandAndEventReceiver {
    constructor(observer) {
        this._disposables = [];
        this._observable = observer;
    }
    subscribe(observer) {
        return this._observable.subscribe(observer);
    }
    dispose() {
        for (let disposable of this._disposables) {
            disposable.dispose();
        }
    }
    static FromObservable(observable) {
        return new KernelCommandAndEventReceiver(observable);
    }
    static FromEventListener(args) {
        let subject = new Subject();
        const listener = (e) => {
            let mapped = args.map(e);
            subject.next(mapped);
        };
        args.eventTarget.addEventListener(args.event, listener);
        const ret = new KernelCommandAndEventReceiver(subject);
        ret._disposables.push({
            dispose: () => {
                args.eventTarget.removeEventListener(args.event, listener);
            }
        });
        args.eventTarget.removeEventListener(args.event, listener);
        return ret;
    }
}
function isObservable(source) {
    return source.next !== undefined;
}
class KernelCommandAndEventSender {
    constructor() {
    }
    send(kernelCommandOrEventEnvelope) {
        if (this._sender) {
            try {
                const clone = kernelCommandOrEventEnvelope.clone();
                if (typeof this._sender === "function") {
                    this._sender(clone);
                }
                else if (isObservable(this._sender)) {
                    if (isKernelCommandEnvelope(kernelCommandOrEventEnvelope)) {
                        this._sender.next(clone);
                    }
                    else {
                        this._sender.next(clone);
                    }
                }
                else {
                    return Promise.reject(new Error("Sender is not set"));
                }
            }
            catch (error) {
                return Promise.reject(error);
            }
            return Promise.resolve();
        }
        return Promise.reject(new Error("Sender is not set"));
    }
    static FromObserver(observer) {
        const sender = new KernelCommandAndEventSender();
        sender._sender = observer;
        return sender;
    }
    static FromFunction(send) {
        const sender = new KernelCommandAndEventSender();
        sender._sender = send;
        return sender;
    }
}
function isSetOfString(collection) {
    return typeof (collection) !== typeof (new Set());
}
function isArrayOfString(collection) {
    return Array.isArray(collection) && collection.length > 0 && typeof (collection[0]) === typeof ("");
}
const onKernelInfoUpdates = [];
function registerForKernelInfoUpdates(callback) {
    onKernelInfoUpdates.push(callback);
}
function notifyOfKernelInfoUpdates(compositeKernel) {
    for (const updater of onKernelInfoUpdates) {
        updater(compositeKernel);
    }
}
function ensureOrUpdateProxyForKernelInfo(kernelInfo, compositeKernel) {
    if (kernelInfo.isProxy) {
        const host = extractHostAndNomalize(kernelInfo.remoteUri);
        if (host === extractHostAndNomalize(compositeKernel.kernelInfo.uri)) {
            Logger.default.warn(`skippin creation of proxy for a proxy kernel : [${JSON.stringify(kernelInfo)}]`);
            return;
        }
    }
    const uriToLookup = kernelInfo.isProxy ? kernelInfo.remoteUri : kernelInfo.uri;
    if (uriToLookup) {
        let kernel = compositeKernel.findKernelByUri(uriToLookup);
        if (!kernel) {
            // add
            if (compositeKernel.host) {
                Logger.default.info(`creating proxy for uri[${uriToLookup}]with info ${JSON.stringify(kernelInfo)}`);
                // check for clash with `kernelInfo.localName`
                kernel = compositeKernel.host.connectProxyKernel(kernelInfo.localName, uriToLookup, kernelInfo.aliases);
                updateKernelInfo(kernel.kernelInfo, kernelInfo);
            }
            else {
                throw new Error('no kernel host found');
            }
        }
        else {
            Logger.default.info(`patching proxy for uri[${uriToLookup}]with info ${JSON.stringify(kernelInfo)} `);
        }
        if (kernel.kernelInfo.isProxy) {
            // patch
            updateKernelInfo(kernel.kernelInfo, kernelInfo);
        }
        notifyOfKernelInfoUpdates(compositeKernel);
    }
}
function isKernelInfoForProxy(kernelInfo) {
    return kernelInfo.isProxy;
}
function updateKernelInfo(destination, source) {
    var _a, _b;
    destination.languageName = (_a = source.languageName) !== null && _a !== void 0 ? _a : destination.languageName;
    destination.languageVersion = (_b = source.languageVersion) !== null && _b !== void 0 ? _b : destination.languageVersion;
    destination.displayName = source.displayName;
    destination.isComposite = source.isComposite;
    if (destination.description === undefined || destination.description === null || destination.description.match(/^\s*$/)) {
        destination.description = source.description;
    }
    if (source.displayName) {
        destination.displayName = source.displayName;
    }
    const supportedCommands = new Set();
    if (!destination.supportedKernelCommands) {
        destination.supportedKernelCommands = [];
    }
    for (const supportedCommand of destination.supportedKernelCommands) {
        supportedCommands.add(supportedCommand.name);
    }
    for (const supportedCommand of source.supportedKernelCommands) {
        if (!supportedCommands.has(supportedCommand.name)) {
            supportedCommands.add(supportedCommand.name);
            destination.supportedKernelCommands.push(supportedCommand);
        }
    }
}
class Connector {
    get remoteHostUris() {
        return Array.from(this._remoteUris.values());
    }
    get sender() {
        return this._sender;
    }
    get receiver() {
        return this._receiver;
    }
    constructor(configuration) {
        this._remoteUris = new Set();
        this._receiver = configuration.receiver;
        this._sender = configuration.sender;
        if (configuration.remoteUris) {
            for (const remoteUri of configuration.remoteUris) {
                const uri = extractHostAndNomalize(remoteUri);
                if (uri) {
                    this._remoteUris.add(uri);
                }
            }
        }
        this._listener = this._receiver.subscribe({
            next: (kernelCommandOrEventEnvelope) => {
                var _a;
                if (isKernelEventEnvelope(kernelCommandOrEventEnvelope)) {
                    if (kernelCommandOrEventEnvelope.eventType === KernelInfoProducedType) {
                        const event = kernelCommandOrEventEnvelope.event;
                        if (!event.kernelInfo.remoteUri) {
                            const uri = extractHostAndNomalize(event.kernelInfo.uri);
                            if (uri) {
                                this._remoteUris.add(uri);
                            }
                        }
                    }
                    const eventRoutingSlip = kernelCommandOrEventEnvelope.routingSlip.toArray();
                    if (((_a = eventRoutingSlip.length) !== null && _a !== void 0 ? _a : 0) > 0) {
                        const eventOrigin = eventRoutingSlip[0];
                        const uri = extractHostAndNomalize(eventOrigin);
                        if (uri) {
                            this._remoteUris.add(uri);
                        }
                    }
                }
            }
        });
    }
    addRemoteHostUri(remoteUri) {
        const uri = extractHostAndNomalize(remoteUri);
        if (uri) {
            this._remoteUris.add(uri);
        }
    }
    canReach(remoteUri) {
        const host = extractHostAndNomalize(remoteUri); //?
        if (host) {
            return this._remoteUris.has(host);
        }
        return false;
    }
    dispose() {
        this._listener.unsubscribe();
    }
}
function extractHostAndNomalize(kernelUri) {
    var _a;
    const filter = /(?<host>.+:\/\/[^\/]+)(\/[^\/])*/gi;
    const match = filter.exec(kernelUri); //?
    if ((_a = match === null || match === void 0 ? void 0 : match.groups) === null || _a === void 0 ? void 0 : _a.host) {
        const host = match.groups.host;
        return host; //?
    }
    return "";
}
function Serialize(source) {
    return JSON.stringify(source, function (key, value) {
        //handling NaN, Infinity and -Infinity
        const processed = SerializeNumberLiterals(value);
        return processed;
    });
}
function SerializeNumberLiterals(value) {
    if (value !== value) {
        return "NaN";
    }
    else if (value === Infinity) {
        return "Infinity";
    }
    else if (value === -Infinity) {
        return "-Infinity";
    }
    return value;
}
function Deserialize(json) {
    return JSON.parse(json, function (key, value) {
        //handling NaN, Infinity and -Infinity
        const deserialized = DeserializeNumberLiterals(value);
        return deserialized;
    });
}
function DeserializeNumberLiterals(value) {
    if (value === "NaN") {
        return NaN;
    }
    else if (value === "Infinity") {
        return Infinity;
    }
    else if (value === "-Infinity") {
        return -Infinity;
    }
    return value;
}

// Copyright (c) .NET Foundation and contributors. All rights reserved.
class ConsoleCapture {
    constructor() {
        this.originalConsole = console;
        console = this;
    }
    set kernelInvocationContext(value) {
        this._kernelInvocationContext = value;
    }
    assert(value, message, ...optionalParams) {
        this.originalConsole.assert(value, message, optionalParams);
    }
    clear() {
        this.originalConsole.clear();
    }
    count(label) {
        this.originalConsole.count(label);
    }
    countReset(label) {
        this.originalConsole.countReset(label);
    }
    debug(message, ...optionalParams) {
        this.originalConsole.debug(message, optionalParams);
    }
    dir(obj, options) {
        this.originalConsole.dir(obj, options);
    }
    dirxml(...data) {
        this.originalConsole.dirxml(data);
    }
    error(message, ...optionalParams) {
        this.redirectAndPublish(this.originalConsole.error, ...[message, ...optionalParams]);
    }
    group(...label) {
        this.originalConsole.group(label);
    }
    groupCollapsed(...label) {
        this.originalConsole.groupCollapsed(label);
    }
    groupEnd() {
        this.originalConsole.groupEnd();
    }
    info(message, ...optionalParams) {
        this.redirectAndPublish(this.originalConsole.info, ...[message, ...optionalParams]);
    }
    log(message, ...optionalParams) {
        this.redirectAndPublish(this.originalConsole.log, ...[message, ...optionalParams]);
    }
    table(tabularData, properties) {
        this.originalConsole.table(tabularData, properties);
    }
    time(label) {
        this.originalConsole.time(label);
    }
    timeEnd(label) {
        this.originalConsole.timeEnd(label);
    }
    timeLog(label, ...data) {
        this.originalConsole.timeLog(label, data);
    }
    timeStamp(label) {
        this.originalConsole.timeStamp(label);
    }
    trace(message, ...optionalParams) {
        this.redirectAndPublish(this.originalConsole.trace, ...[message, ...optionalParams]);
    }
    warn(message, ...optionalParams) {
        this.originalConsole.warn(message, optionalParams);
    }
    profile(label) {
        this.originalConsole.profile(label);
    }
    profileEnd(label) {
        this.originalConsole.profileEnd(label);
    }
    dispose() {
        console = this.originalConsole;
    }
    redirectAndPublish(target, ...args) {
        if (this._kernelInvocationContext) {
            for (const arg of args) {
                let mimeType;
                let value;
                if (typeof arg !== 'object' && !Array.isArray(arg)) {
                    mimeType = 'text/plain';
                    value = arg === null || arg === void 0 ? void 0 : arg.toString();
                }
                else {
                    mimeType = 'application/json';
                    value = Serialize(arg);
                }
                const displayedValue = {
                    formattedValues: [
                        {
                            mimeType,
                            value,
                            suppressDisplay: false
                        }
                    ]
                };
                const eventEnvelope = new KernelEventEnvelope(DisplayedValueProducedType, displayedValue, this._kernelInvocationContext.commandEnvelope);
                this._kernelInvocationContext.publish(eventEnvelope);
            }
        }
        if (target) {
            target(...args);
        }
    }
}

// Copyright (c) .NET Foundation and contributors. All rights reserved.
class ProxyKernel extends Kernel {
    constructor(name, _sender, _receiver, languageName, languageVersion) {
        super(name, languageName, languageVersion);
        this.name = name;
        this._sender = _sender;
        this._receiver = _receiver;
        this.kernelInfo.isProxy = true;
    }
    getCommandHandler(commandType) {
        return {
            commandType,
            handle: (invocation) => {
                return this._commandHandler(invocation);
            }
        };
    }
    delegatePublication(envelope, invocationContext) {
        let alreadyBeenSeen = false;
        const kernelUri = getKernelUri(this);
        if (kernelUri && !envelope.routingSlip.contains(kernelUri)) {
            envelope.routingSlip.stamp(kernelUri);
        }
        else {
            alreadyBeenSeen = true;
        }
        if (this.hasSameOrigin(envelope)) {
            if (!alreadyBeenSeen) {
                invocationContext.publish(envelope);
            }
        }
    }
    hasSameOrigin(envelope) {
        var _a, _b, _c;
        let commandOriginUri = (_c = (_b = (_a = envelope.command) === null || _a === void 0 ? void 0 : _a.command) === null || _b === void 0 ? void 0 : _b.originUri) !== null && _c !== void 0 ? _c : this.kernelInfo.uri;
        if (commandOriginUri === this.kernelInfo.uri) {
            return true;
        }
        return commandOriginUri === null;
    }
    updateKernelInfoFromEvent(kernelInfoProduced) {
        updateKernelInfo(this.kernelInfo, kernelInfoProduced.kernelInfo);
    }
    async _commandHandler(commandInvocation) {
        var _a, _b;
        var _c, _d;
        const commandToken = commandInvocation.commandEnvelope.getOrCreateToken();
        const completionSource = new PromiseCompletionSource();
        // fix : is this the right way? We are trying to avoid forwarding events we just did forward
        let eventSubscription = this._receiver.subscribe({
            next: (envelope) => {
                var _a, _b, _c;
                if (isKernelEventEnvelope(envelope)) {
                    if (envelope.eventType === KernelInfoProducedType &&
                        (envelope.command === null || envelope.command === undefined)) {
                        const kernelInfoProduced = envelope.event;
                        kernelInfoProduced.kernelInfo; //?
                        this.kernelInfo; //?
                        if (kernelInfoProduced.kernelInfo.uri === this.kernelInfo.remoteUri) {
                            this.updateKernelInfoFromEvent(kernelInfoProduced);
                            const event = new KernelEventEnvelope(KernelInfoProducedType, { kernelInfo: this.kernelInfo });
                            this.publishEvent(event);
                        }
                    }
                    else if (envelope.command.getToken() === commandToken) {
                        Logger.default.info(`proxy name=${this.name}[local uri:${this.kernelInfo.uri}, remote uri:${this.kernelInfo.remoteUri}] processing event, envelopeToken=${envelope.command.getToken()}, commandToken=${commandToken}`);
                        Logger.default.info(`proxy name=${this.name}[local uri:${this.kernelInfo.uri}, remote uri:${this.kernelInfo.remoteUri}] processing event, ${JSON.stringify(envelope)}`);
                        try {
                            const original = [...(_b = (_a = commandInvocation.commandEnvelope) === null || _a === void 0 ? void 0 : _a.routingSlip.toArray()) !== null && _b !== void 0 ? _b : []];
                            commandInvocation.commandEnvelope.routingSlip.continueWith(envelope.command.routingSlip);
                            //envelope.command!.routingSlip = [...commandInvocation.commandEnvelope.routingSlip ?? []];//?
                            Logger.default.info(`proxy name=${this.name}[local uri:${this.kernelInfo.uri}, command routingSlip :${original}] has changed to: ${JSON.stringify((_c = commandInvocation.commandEnvelope.routingSlip) !== null && _c !== void 0 ? _c : [])}`);
                        }
                        catch (e) {
                            Logger.default.error(`proxy name=${this.name}[local uri:${this.kernelInfo.uri}, error ${e === null || e === void 0 ? void 0 : e.message}`);
                        }
                        switch (envelope.eventType) {
                            case KernelInfoProducedType:
                                {
                                    const kernelInfoProduced = envelope.event;
                                    if (kernelInfoProduced.kernelInfo.uri === this.kernelInfo.remoteUri) {
                                        this.updateKernelInfoFromEvent(kernelInfoProduced);
                                        const event = new KernelEventEnvelope(KernelInfoProducedType, { kernelInfo: this.kernelInfo }, commandInvocation.commandEnvelope);
                                        event.routingSlip.continueWith(envelope.routingSlip);
                                        this.delegatePublication(event, commandInvocation.context);
                                        this.delegatePublication(envelope, commandInvocation.context);
                                    }
                                    else {
                                        this.delegatePublication(envelope, commandInvocation.context);
                                    }
                                }
                                break;
                            case CommandFailedType:
                            case CommandSucceededType:
                                Logger.default.info(`proxy name=${this.name}[local uri:${this.kernelInfo.uri}, remote uri:${this.kernelInfo.remoteUri}] finished, token=${envelope.command.getToken()}, commandToken=${commandToken}`);
                                if (envelope.command.getToken() === commandToken) {
                                    Logger.default.info(`proxy name=${this.name}[local uri:${this.kernelInfo.uri}, remote uri:${this.kernelInfo.remoteUri}] resolving promise, envelopeToken=${envelope.command.getToken()}, commandToken=${commandToken}`);
                                    completionSource.resolve(envelope);
                                }
                                else {
                                    Logger.default.info(`proxy name=${this.name}[local uri:${this.kernelInfo.uri}, remote uri:${this.kernelInfo.remoteUri}] not resolving promise, envelopeToken=${envelope.command.getToken()}, commandToken=${commandToken}`);
                                    this.delegatePublication(envelope, commandInvocation.context);
                                }
                                break;
                            default:
                                this.delegatePublication(envelope, commandInvocation.context);
                                break;
                        }
                    }
                }
            }
        });
        try {
            if (!commandInvocation.commandEnvelope.command.destinationUri || !commandInvocation.commandEnvelope.command.originUri) {
                (_a = (_c = commandInvocation.commandEnvelope.command).originUri) !== null && _a !== void 0 ? _a : (_c.originUri = this.kernelInfo.uri);
                (_b = (_d = commandInvocation.commandEnvelope.command).destinationUri) !== null && _b !== void 0 ? _b : (_d.destinationUri = this.kernelInfo.remoteUri);
            }
            commandInvocation.commandEnvelope.routingSlip;
            if (commandInvocation.commandEnvelope.commandType === RequestKernelInfoType) {
                const destinationUri = this.kernelInfo.remoteUri;
                if (commandInvocation.commandEnvelope.routingSlip.contains(destinationUri, true)) {
                    return Promise.resolve();
                }
            }
            Logger.default.info(`proxy ${this.name}[local uri:${this.kernelInfo.uri}, remote uri:${this.kernelInfo.remoteUri}] forwarding command ${commandInvocation.commandEnvelope.commandType} to ${commandInvocation.commandEnvelope.command.destinationUri}`);
            this._sender.send(commandInvocation.commandEnvelope);
            Logger.default.info(`proxy ${this.name}[local uri:${this.kernelInfo.uri}, remote uri:${this.kernelInfo.remoteUri}] about to await with token ${commandToken}`);
            const enventEnvelope = await completionSource.promise;
            if (enventEnvelope.eventType === CommandFailedType) {
                commandInvocation.context.fail(enventEnvelope.event.message);
            }
            Logger.default.info(`proxy ${this.name}[local uri:${this.kernelInfo.uri}, remote uri:${this.kernelInfo.remoteUri}] done awaiting with token ${commandToken}}`);
        }
        catch (e) {
            commandInvocation.context.fail(e.message);
        }
        finally {
            eventSubscription.unsubscribe();
        }
    }
}

// Copyright (c) .NET Foundation and contributors. All rights reserved.
class KernelHost {
    constructor(kernel, sender, receiver, hostUri) {
        this._remoteUriToKernel = new Map();
        this._uriToKernel = new Map();
        this._kernelToKernelInfo = new Map();
        this._connectors = [];
        this._kernel = kernel;
        this._uri = createKernelUri(hostUri || "kernel://vscode");
        this._kernel.host = this;
        this._scheduler = new KernelScheduler();
        this._scheduler.setMustTrampoline((c => {
            return (c.commandType === RequestInputType) || (c.commandType === SendEditableCodeType);
        }));
        this._defaultConnector = new Connector({ sender, receiver });
        this._connectors.push(this._defaultConnector);
    }
    get defaultConnector() {
        return this._defaultConnector;
    }
    get uri() {
        return this._uri;
    }
    get kernel() {
        return this._kernel;
    }
    tryGetKernelByRemoteUri(remoteUri) {
        return this._remoteUriToKernel.get(remoteUri);
    }
    trygetKernelByOriginUri(originUri) {
        return this._uriToKernel.get(originUri);
    }
    tryGetKernelInfo(kernel) {
        return this._kernelToKernelInfo.get(kernel);
    }
    addKernelInfo(kernel, kernelInfo) {
        kernelInfo.uri = createKernelUri(`${this._uri}${kernel.name}`);
        this._kernelToKernelInfo.set(kernel, kernelInfo);
        this._uriToKernel.set(kernelInfo.uri, kernel);
    }
    getKernel(kernelCommandEnvelope) {
        var _a;
        const uriToLookup = (_a = kernelCommandEnvelope.command.destinationUri) !== null && _a !== void 0 ? _a : kernelCommandEnvelope.command.originUri;
        let kernel = undefined;
        if (uriToLookup) {
            kernel = this._kernel.findKernelByUri(uriToLookup);
        }
        if (!kernel) {
            if (kernelCommandEnvelope.command.targetKernelName) {
                kernel = this._kernel.findKernelByName(kernelCommandEnvelope.command.targetKernelName);
            }
        }
        kernel !== null && kernel !== void 0 ? kernel : (kernel = this._kernel);
        Logger.default.info(`Using Kernel ${kernel.name}`);
        return kernel;
    }
    connectProxyKernelOnDefaultConnector(localName, remoteKernelUri, aliases) {
        return this.connectProxyKernelOnConnector(localName, this._defaultConnector.sender, this._defaultConnector.receiver, remoteKernelUri, aliases);
    }
    tryAddConnector(connector) {
        if (!connector.remoteUris) {
            this._connectors.push(new Connector(connector));
            return true;
        }
        else {
            const found = connector.remoteUris.find(uri => this._connectors.find(c => c.canReach(uri)));
            if (!found) {
                this._connectors.push(new Connector(connector));
                return true;
            }
            return false;
        }
    }
    tryRemoveConnector(connector) {
        if (!connector.remoteUris) {
            for (let uri of connector.remoteUris) {
                const index = this._connectors.findIndex(c => c.canReach(uri));
                if (index >= 0) {
                    this._connectors.splice(index, 1);
                }
            }
            return true;
        }
        else {
            return false;
        }
    }
    connectProxyKernel(localName, remoteKernelUri, aliases) {
        this._connectors; //?
        const connector = this._connectors.find(c => c.canReach(remoteKernelUri));
        if (!connector) {
            throw new Error(`Cannot find connector to reach ${remoteKernelUri}`);
        }
        let kernel = new ProxyKernel(localName, connector.sender, connector.receiver);
        kernel.kernelInfo.remoteUri = remoteKernelUri;
        this._kernel.add(kernel, aliases);
        return kernel;
    }
    connectProxyKernelOnConnector(localName, sender, receiver, remoteKernelUri, aliases) {
        let kernel = new ProxyKernel(localName, sender, receiver);
        kernel.kernelInfo.remoteUri = remoteKernelUri;
        this._kernel.add(kernel, aliases);
        return kernel;
    }
    tryGetConnector(remoteUri) {
        return this._connectors.find(c => c.canReach(remoteUri));
    }
    async connect() {
        this._kernel.subscribeToKernelEvents(e => {
            Logger.default.info(`KernelHost forwarding event: ${JSON.stringify(e)}`);
            this._defaultConnector.sender.send(e);
        });
        this._defaultConnector.receiver.subscribe({
            next: (kernelCommandOrEventEnvelope) => {
                if (isKernelCommandEnvelope(kernelCommandOrEventEnvelope)) {
                    Logger.default.info(`KernelHost dispacthing command: ${JSON.stringify(kernelCommandOrEventEnvelope)}`);
                    this._scheduler.runAsync(kernelCommandOrEventEnvelope, commandEnvelope => {
                        const kernel = this._kernel;
                        return kernel.send(commandEnvelope);
                    });
                }
            }
        });
        const kernelInfos = [this._kernel.kernelInfo, ...Array.from(this._kernel.childKernels.map(k => k.kernelInfo).filter(ki => ki.isProxy === false))];
        const kernekReady = {
            kernelInfos: kernelInfos
        };
        const event = new KernelEventEnvelope(KernelReadyType, kernekReady);
        event.routingSlip.stamp(this._kernel.kernelInfo.uri);
        await this._defaultConnector.sender.send(event);
        return kernekReady;
    }
    getKernelInfos() {
        let kernelInfos = [this._kernel.kernelInfo];
        for (let kernel of this._kernel.childKernels) {
            kernelInfos.push(kernel.kernelInfo);
        }
        return kernelInfos;
    }
    getKernelInfoProduced() {
        let events = Array.from(this.getKernelInfos().map(kernelInfo => {
            const event = new KernelEventEnvelope(KernelInfoProducedType, { kernelInfo: kernelInfo });
            event.routingSlip.stamp(kernelInfo.uri);
            return event;
        }));
        return events;
    }
}

// Copyright (c) .NET Foundation and contributors. All rights reserved.

var polyglotNotebooksApi = /*#__PURE__*/Object.freeze({
    __proto__: null,
    CompositeKernel: CompositeKernel,
    isKernelCommandEnvelope: isKernelCommandEnvelope,
    isKernelCommandEnvelopeModel: isKernelCommandEnvelopeModel,
    isKernelEventEnvelope: isKernelEventEnvelope,
    isKernelEventEnvelopeModel: isKernelEventEnvelopeModel,
    KernelCommandAndEventReceiver: KernelCommandAndEventReceiver,
    KernelCommandAndEventSender: KernelCommandAndEventSender,
    isSetOfString: isSetOfString,
    isArrayOfString: isArrayOfString,
    registerForKernelInfoUpdates: registerForKernelInfoUpdates,
    ensureOrUpdateProxyForKernelInfo: ensureOrUpdateProxyForKernelInfo,
    isKernelInfoForProxy: isKernelInfoForProxy,
    updateKernelInfo: updateKernelInfo,
    Connector: Connector,
    extractHostAndNomalize: extractHostAndNomalize,
    Serialize: Serialize,
    SerializeNumberLiterals: SerializeNumberLiterals,
    Deserialize: Deserialize,
    DeserializeNumberLiterals: DeserializeNumberLiterals,
    ConsoleCapture: ConsoleCapture,
    AddPackageType: AddPackageType,
    AddPackageSourceType: AddPackageSourceType,
    CancelType: CancelType,
    ClearValuesType: ClearValuesType,
    CompileProjectType: CompileProjectType,
    ConnectJupyterKernelType: ConnectJupyterKernelType,
    ConnectSignalRType: ConnectSignalRType,
    ConnectStdioType: ConnectStdioType,
    DisplayErrorType: DisplayErrorType,
    DisplayValueType: DisplayValueType,
    ExpandCodeType: ExpandCodeType,
    ImportDocumentType: ImportDocumentType,
    OpenDocumentType: OpenDocumentType,
    OpenProjectType: OpenProjectType,
    QuitType: QuitType,
    RequestCodeExpansionInfosType: RequestCodeExpansionInfosType,
    RequestCompletionsType: RequestCompletionsType,
    RequestDiagnosticsType: RequestDiagnosticsType,
    RequestHoverTextType: RequestHoverTextType,
    RequestInputType: RequestInputType,
    RequestInputsType: RequestInputsType,
    RequestKernelInfoType: RequestKernelInfoType,
    RequestSignatureHelpType: RequestSignatureHelpType,
    RequestValueType: RequestValueType,
    RequestValueInfosType: RequestValueInfosType,
    SendEditableCodeType: SendEditableCodeType,
    SendValueType: SendValueType,
    SubmitCodeType: SubmitCodeType,
    UpdateDisplayedValueType: UpdateDisplayedValueType,
    AssemblyProducedType: AssemblyProducedType,
    CodeExpansionInfosProducedType: CodeExpansionInfosProducedType,
    CodeSubmissionReceivedType: CodeSubmissionReceivedType,
    CommandFailedType: CommandFailedType,
    CommandSucceededType: CommandSucceededType,
    CompleteCodeSubmissionReceivedType: CompleteCodeSubmissionReceivedType,
    CompletionsProducedType: CompletionsProducedType,
    DiagnosticsProducedType: DiagnosticsProducedType,
    DisplayedValueProducedType: DisplayedValueProducedType,
    DisplayedValueUpdatedType: DisplayedValueUpdatedType,
    DocumentOpenedType: DocumentOpenedType,
    ErrorProducedType: ErrorProducedType,
    HoverTextProducedType: HoverTextProducedType,
    IncompleteCodeSubmissionReceivedType: IncompleteCodeSubmissionReceivedType,
    InputProducedType: InputProducedType,
    InputsProducedType: InputsProducedType,
    KernelExtensionLoadedType: KernelExtensionLoadedType,
    KernelInfoProducedType: KernelInfoProducedType,
    KernelReadyType: KernelReadyType,
    PackageAddedType: PackageAddedType,
    ProjectOpenedType: ProjectOpenedType,
    ReturnValueProducedType: ReturnValueProducedType,
    SignatureHelpProducedType: SignatureHelpProducedType,
    StandardErrorValueProducedType: StandardErrorValueProducedType,
    StandardOutputValueProducedType: StandardOutputValueProducedType,
    ValueInfosProducedType: ValueInfosProducedType,
    ValueProducedType: ValueProducedType,
    get InsertTextFormat () { return InsertTextFormat; },
    get DiagnosticSeverity () { return DiagnosticSeverity; },
    get DocumentSerializationType () { return DocumentSerializationType; },
    get RequestType () { return RequestType; },
    KernelCommandEnvelope: KernelCommandEnvelope,
    KernelEventEnvelope: KernelEventEnvelope,
    Kernel: Kernel,
    submitCommandAndGetResult: submitCommandAndGetResult,
    getKernelUri: getKernelUri,
    KernelHost: KernelHost,
    KernelInvocationContext: KernelInvocationContext,
    KernelScheduler: KernelScheduler,
    get LogLevel () { return LogLevel; },
    Logger: Logger,
    isPromiseCompletionSource: isPromiseCompletionSource,
    PromiseCompletionSource: PromiseCompletionSource,
    ProxyKernel: ProxyKernel,
    createKernelUri: createKernelUri,
    createKernelUriWithQuery: createKernelUriWithQuery,
    getTag: getTag,
    createRoutingSlip: createRoutingSlip,
    RoutingSlip: RoutingSlip,
    CommandRoutingSlip: CommandRoutingSlip,
    EventRoutingSlip: EventRoutingSlip
});

// Copyright (c) .NET Foundation and contributors. All rights reserved.
// This is a workaround for rollup warnings. See their documentation for more details: https://rollupjs.org/troubleshooting/#avoiding-eval
const eval2 = eval;
class JavascriptKernel extends Kernel {
    constructor(name) {
        super(name !== null && name !== void 0 ? name : "javascript", "JavaScript");
        this.kernelInfo.displayName = `${this.kernelInfo.localName} - ${this.kernelInfo.languageName}`;
        this.kernelInfo.description = `Run JavaScript code`;
        this.suppressedLocals = new Set(this.allLocalVariableNames());
        this.registerCommandHandler({ commandType: SubmitCodeType, handle: invocation => this.handleSubmitCode(invocation) });
        this.registerCommandHandler({ commandType: RequestValueInfosType, handle: invocation => this.handleRequestValueInfos(invocation) });
        this.registerCommandHandler({ commandType: RequestValueType, handle: invocation => this.handleRequestValue(invocation) });
        this.registerCommandHandler({ commandType: SendValueType, handle: invocation => this.handleSendValue(invocation) });
        this.capture = new ConsoleCapture();
    }
    handleSendValue(invocation) {
        const sendValue = invocation.commandEnvelope.command;
        if (sendValue.formattedValue) {
            switch (sendValue.formattedValue.mimeType) {
                case 'application/json':
                    globalThis[sendValue.name] = Deserialize(sendValue.formattedValue.value);
                    break;
                default:
                    globalThis[sendValue.name] = sendValue.formattedValue.value;
                    break;
            }
            return Promise.resolve();
        }
        throw new Error("formattedValue is required");
    }
    async handleSubmitCode(invocation) {
        const submitCode = invocation.commandEnvelope.command;
        const code = submitCode.code;
        super.kernelInfo.localName;
        super.kernelInfo.uri;
        super.kernelInfo.remoteUri;
        const codeSubmissionReceivedEvent = new KernelEventEnvelope(CodeSubmissionReceivedType, { code }, invocation.commandEnvelope);
        invocation.context.publish(codeSubmissionReceivedEvent);
        invocation.context.commandEnvelope.routingSlip;
        this.capture.kernelInvocationContext = invocation.context;
        let result = undefined;
        try {
            const AsyncFunction = eval2(`Object.getPrototypeOf(async function(){}).constructor`);
            const evaluator = AsyncFunction("console", "polyglotNotebooks", code);
            result = await evaluator(this.capture, polyglotNotebooksApi);
            if (result !== undefined) {
                const formattedValue = formatValue(result, 'application/json');
                const event = {
                    formattedValues: [formattedValue]
                };
                const returnValueProducedEvent = new KernelEventEnvelope(ReturnValueProducedType, event, invocation.commandEnvelope);
                invocation.context.publish(returnValueProducedEvent);
            }
        }
        catch (e) {
            const errorProduced = new KernelEventEnvelope(ErrorProducedType, {
                message: `${e.message}

                    ${e.stack}`
            }, invocation.commandEnvelope);
            invocation.context.publish(errorProduced);
        }
        finally {
            this.capture.kernelInvocationContext = undefined;
        }
    }
    handleRequestValueInfos(invocation) {
        const valueInfos = [];
        this.allLocalVariableNames().filter(v => !this.suppressedLocals.has(v)).forEach(v => {
            const variableValue = this.getLocalVariable(v);
            try {
                const valueInfo = {
                    name: v,
                    typeName: getType(variableValue),
                    formattedValue: formatValue(variableValue, "text/plain"),
                    preferredMimeTypes: []
                };
                valueInfos.push(valueInfo);
            }
            catch (e) {
                Logger.default.error(`error formatting value ${v} : ${e}`);
            }
        });
        const event = {
            valueInfos
        };
        const valueInfosProducedEvent = new KernelEventEnvelope(ValueInfosProducedType, event, invocation.commandEnvelope);
        invocation.context.publish(valueInfosProducedEvent);
        return Promise.resolve();
    }
    handleRequestValue(invocation) {
        const requestValue = invocation.commandEnvelope.command;
        const rawValue = this.getLocalVariable(requestValue.name);
        const formattedValue = formatValue(rawValue, requestValue.mimeType || 'application/json');
        Logger.default.info(`returning ${JSON.stringify(formattedValue)} for ${requestValue.name}`);
        const event = {
            name: requestValue.name,
            formattedValue
        };
        const valueProducedEvent = new KernelEventEnvelope(ValueProducedType, event, invocation.commandEnvelope);
        invocation.context.publish(valueProducedEvent);
        return Promise.resolve();
    }
    allLocalVariableNames() {
        const result = [];
        try {
            for (const key in globalThis) {
                try {
                    if (typeof globalThis[key] !== 'function') {
                        result.push(key);
                    }
                }
                catch (e) {
                    Logger.default.error(`error getting value for ${key} : ${e}`);
                }
            }
        }
        catch (e) {
            Logger.default.error(`error scanning globla variables : ${e}`);
        }
        return result;
    }
    getLocalVariable(name) {
        return globalThis[name];
    }
}
function formatValue(arg, mimeType) {
    let value;
    switch (mimeType) {
        case 'text/plain':
            value = (arg === null || arg === void 0 ? void 0 : arg.toString()) || 'undefined';
            if (Array.isArray(arg)) {
                value = `[${value}]`;
            }
            break;
        case 'application/json':
            value = Serialize(arg);
            break;
        default:
            throw new Error(`unsupported mime type: ${mimeType}`);
    }
    return {
        mimeType,
        value,
        suppressDisplay: false
    };
}
function getType(arg) {
    let type = arg ? typeof (arg) : ""; //?
    if (Array.isArray(arg)) {
        type = `${typeof (arg[0])}[]`; //?
    }
    if (arg === Infinity || arg === -Infinity || (arg !== arg)) {
        type = "number";
    }
    return type; //?
}

// Copyright (c) .NET Foundation and contributors. All rights reserved.
function createHost(global, compositeKernelName, configureRequire, logMessage, localToRemote, remoteToLocal, onReady) {
    Logger.configure(compositeKernelName, logMessage);
    global.interactive = {};
    configureRequire(global.interactive);
    const compositeKernel = new CompositeKernel(compositeKernelName);
    const kernelHost = new KernelHost(compositeKernel, KernelCommandAndEventSender.FromObserver(localToRemote), KernelCommandAndEventReceiver.FromObservable(remoteToLocal), `kernel://${compositeKernelName}`);
    kernelHost.defaultConnector.receiver.subscribe({
        next: (envelope) => {
            if (isKernelEventEnvelope(envelope) && envelope.eventType === KernelInfoProducedType) {
                const kernelInfoProduced = envelope.event;
                ensureOrUpdateProxyForKernelInfo(kernelInfoProduced.kernelInfo, compositeKernel);
            }
        }
    });
    // use composite kernel as root
    global.kernel = {
        get root() {
            return compositeKernel;
        }
    };
    global.sendSendValueCommand = (form) => {
        let formValues = {};
        for (var i = 0; i < form.elements.length; i++) {
            var e = form.elements[i];
            if (e.name && e.name !== '') {
                let name = e.name.replace('-', '');
                formValues[name] = e.value;
            }
        }
        let command = {
            formattedValue: {
                mimeType: 'application/json',
                value: JSON.stringify(formValues)
            },
            name: form.id,
            targetKernelName: '.NET'
        };
        let envelope = new KernelCommandEnvelope(SendValueType, command);
        form.remove();
        compositeKernel.send(envelope);
    };
    global[compositeKernelName] = {
        compositeKernel,
        kernelHost,
    };
    const jsKernel = new JavascriptKernel();
    compositeKernel.add(jsKernel, ["js"]);
    kernelHost.connect();
    onReady();
}

// Copyright (c) .NET Foundation and contributors. All rights reserved.
function activate(context) {
    configure(window, context);
    Logger.default.info(`set up 'webview' host module complete`);
}
function configure(global, context) {
    if (!global) {
        global = window;
    }
    const remoteToLocal = new Subject();
    const localToRemote = new Subject();
    localToRemote.subscribe({
        next: envelope => {
            const envelopeJson = envelope.toJson();
            context.postKernelMessage({ envelope: envelopeJson });
        }
    });
    const webViewId = v4();
    context.onDidReceiveKernelMessage((arg) => {
        var _a;
        if (arg.envelope && arg.webViewId === webViewId) {
            const envelope = arg.envelope;
            if (isKernelEventEnvelopeModel(envelope)) {
                Logger.default.info(`channel got ${envelope.eventType} with token ${(_a = envelope.command) === null || _a === void 0 ? void 0 : _a.token}`);
                const event = KernelEventEnvelope.fromJson(envelope);
                remoteToLocal.next(event);
            }
            else {
                const command = KernelCommandEnvelope.fromJson(envelope);
                remoteToLocal.next(command);
            }
        }
        else if (arg.webViewId === webViewId) {
            const kernelHost = (global['webview'].kernelHost);
            if (kernelHost) {
                switch (arg.preloadCommand) {
                    case '#!connect': {
                        Logger.default.info(`connecting to kernels from extension host`);
                        const kernelInfos = arg.kernelInfos;
                        for (const kernelInfo of kernelInfos) {
                            const remoteUri = kernelInfo.isProxy ? kernelInfo.remoteUri : kernelInfo.uri;
                            if (!kernelHost.tryGetConnector(remoteUri)) {
                                kernelHost.defaultConnector.addRemoteHostUri(remoteUri);
                            }
                            ensureOrUpdateProxyForKernelInfo(kernelInfo, kernelHost.kernel);
                        }
                    }
                }
            }
        }
    });
    createHost(global, 'webview', configureRequire, entry => {
        context.postKernelMessage({ logEntry: entry });
    }, localToRemote, remoteToLocal, () => {
        const kernelInfos = global['webview'].kernelHost.getKernelInfos();
        const hostUri = global['webview'].kernelHost.uri;
        context.postKernelMessage({ preloadCommand: '#!connect', kernelInfos, hostUri, webViewId });
    });
}
function configureRequire(interactive) {
    if ((typeof (require) !== typeof (Function)) || (typeof (require.config) !== typeof (Function))) {
        let require_script = document.createElement('script');
        require_script.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js');
        require_script.setAttribute('type', 'text/javascript');
        require_script.onload = function () {
            interactive.configureRequire = (confing) => {
                return require.config(confing) || require;
            };
        };
        document.getElementsByTagName('head')[0].appendChild(require_script);
    }
    else {
        interactive.configureRequire = (confing) => {
            return require.config(confing) || require;
        };
    }
}

export { activate };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aXZhdGlvbi5qcyIsInNvdXJjZXMiOlsiLi4vbm9kZV9tb2R1bGVzL3ZzY29kZS11cmkvbGliL2VzbS9pbmRleC5qcyIsIi4uL3NyYy9yb3V0aW5nc2xpcC50cyIsIi4uL3NyYy9jb250cmFjdHMudHMiLCIuLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3JuZy5qcyIsIi4uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvcmVnZXguanMiLCIuLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3ZhbGlkYXRlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9zdHJpbmdpZnkuanMiLCIuLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3BhcnNlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92NC5qcyIsIi4uL3NyYy9jb21tYW5kc0FuZEV2ZW50cy50cyIsIi4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC91dGlsL2lzRnVuY3Rpb24uanMiLCIuLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvdXRpbC9jcmVhdGVFcnJvckNsYXNzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3V0aWwvVW5zdWJzY3JpcHRpb25FcnJvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC91dGlsL2FyclJlbW92ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC9TdWJzY3JpcHRpb24uanMiLCIuLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvY29uZmlnLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3NjaGVkdWxlci90aW1lb3V0UHJvdmlkZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvdXRpbC9yZXBvcnRVbmhhbmRsZWRFcnJvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC91dGlsL25vb3AuanMiLCIuLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvdXRpbC9lcnJvckNvbnRleHQuanMiLCIuLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvU3Vic2NyaWJlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC9zeW1ib2wvb2JzZXJ2YWJsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC91dGlsL2lkZW50aXR5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3V0aWwvcGlwZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC9PYnNlcnZhYmxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3V0aWwvbGlmdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC9vcGVyYXRvcnMvT3BlcmF0b3JTdWJzY3JpYmVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3V0aWwvT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IuanMiLCIuLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvU3ViamVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC9vcGVyYXRvcnMvbWFwLmpzIiwiLi4vc3JjL3Byb21pc2VDb21wbGV0aW9uU291cmNlLnRzIiwiLi4vc3JjL2tlcm5lbEludm9jYXRpb25Db250ZXh0LnRzIiwiLi4vc3JjL2xvZ2dlci50cyIsIi4uL3NyYy9rZXJuZWxTY2hlZHVsZXIudHMiLCIuLi9zcmMva2VybmVsLnRzIiwiLi4vc3JjL2NvbXBvc2l0ZUtlcm5lbC50cyIsIi4uL3NyYy9jb25uZWN0aW9uLnRzIiwiLi4vc3JjL2NvbnNvbGVDYXB0dXJlLnRzIiwiLi4vc3JjL3Byb3h5S2VybmVsLnRzIiwiLi4vc3JjL2tlcm5lbEhvc3QudHMiLCIuLi9zcmMvYXBpLnRzIiwiLi4vc3JjL2phdmFzY3JpcHRLZXJuZWwudHMiLCIuLi9zcmMvd2Vidmlldy9mcm9udEVuZEhvc3QudHMiLCIuLi9zcmMvd2Vidmlldy9hY3RpdmF0aW9uLnRzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBMSUI7KCgpPT57XCJ1c2Ugc3RyaWN0XCI7dmFyIHQ9ezQ3MDp0PT57ZnVuY3Rpb24gZSh0KXtpZihcInN0cmluZ1wiIT10eXBlb2YgdCl0aHJvdyBuZXcgVHlwZUVycm9yKFwiUGF0aCBtdXN0IGJlIGEgc3RyaW5nLiBSZWNlaXZlZCBcIitKU09OLnN0cmluZ2lmeSh0KSl9ZnVuY3Rpb24gcih0LGUpe2Zvcih2YXIgcixuPVwiXCIsbz0wLGk9LTEsYT0wLGg9MDtoPD10Lmxlbmd0aDsrK2gpe2lmKGg8dC5sZW5ndGgpcj10LmNoYXJDb2RlQXQoaCk7ZWxzZXtpZig0Nz09PXIpYnJlYWs7cj00N31pZig0Nz09PXIpe2lmKGk9PT1oLTF8fDE9PT1hKTtlbHNlIGlmKGkhPT1oLTEmJjI9PT1hKXtpZihuLmxlbmd0aDwyfHwyIT09b3x8NDYhPT1uLmNoYXJDb2RlQXQobi5sZW5ndGgtMSl8fDQ2IT09bi5jaGFyQ29kZUF0KG4ubGVuZ3RoLTIpKWlmKG4ubGVuZ3RoPjIpe3ZhciBzPW4ubGFzdEluZGV4T2YoXCIvXCIpO2lmKHMhPT1uLmxlbmd0aC0xKXstMT09PXM/KG49XCJcIixvPTApOm89KG49bi5zbGljZSgwLHMpKS5sZW5ndGgtMS1uLmxhc3RJbmRleE9mKFwiL1wiKSxpPWgsYT0wO2NvbnRpbnVlfX1lbHNlIGlmKDI9PT1uLmxlbmd0aHx8MT09PW4ubGVuZ3RoKXtuPVwiXCIsbz0wLGk9aCxhPTA7Y29udGludWV9ZSYmKG4ubGVuZ3RoPjA/bis9XCIvLi5cIjpuPVwiLi5cIixvPTIpfWVsc2Ugbi5sZW5ndGg+MD9uKz1cIi9cIit0LnNsaWNlKGkrMSxoKTpuPXQuc2xpY2UoaSsxLGgpLG89aC1pLTE7aT1oLGE9MH1lbHNlIDQ2PT09ciYmLTEhPT1hPysrYTphPS0xfXJldHVybiBufXZhciBuPXtyZXNvbHZlOmZ1bmN0aW9uKCl7Zm9yKHZhciB0LG49XCJcIixvPSExLGk9YXJndW1lbnRzLmxlbmd0aC0xO2k+PS0xJiYhbztpLS0pe3ZhciBhO2k+PTA/YT1hcmd1bWVudHNbaV06KHZvaWQgMD09PXQmJih0PXByb2Nlc3MuY3dkKCkpLGE9dCksZShhKSwwIT09YS5sZW5ndGgmJihuPWErXCIvXCIrbixvPTQ3PT09YS5jaGFyQ29kZUF0KDApKX1yZXR1cm4gbj1yKG4sIW8pLG8/bi5sZW5ndGg+MD9cIi9cIituOlwiL1wiOm4ubGVuZ3RoPjA/bjpcIi5cIn0sbm9ybWFsaXplOmZ1bmN0aW9uKHQpe2lmKGUodCksMD09PXQubGVuZ3RoKXJldHVyblwiLlwiO3ZhciBuPTQ3PT09dC5jaGFyQ29kZUF0KDApLG89NDc9PT10LmNoYXJDb2RlQXQodC5sZW5ndGgtMSk7cmV0dXJuIDAhPT0odD1yKHQsIW4pKS5sZW5ndGh8fG58fCh0PVwiLlwiKSx0Lmxlbmd0aD4wJiZvJiYodCs9XCIvXCIpLG4/XCIvXCIrdDp0fSxpc0Fic29sdXRlOmZ1bmN0aW9uKHQpe3JldHVybiBlKHQpLHQubGVuZ3RoPjAmJjQ3PT09dC5jaGFyQ29kZUF0KDApfSxqb2luOmZ1bmN0aW9uKCl7aWYoMD09PWFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuXCIuXCI7Zm9yKHZhciB0LHI9MDtyPGFyZ3VtZW50cy5sZW5ndGg7KytyKXt2YXIgbz1hcmd1bWVudHNbcl07ZShvKSxvLmxlbmd0aD4wJiYodm9pZCAwPT09dD90PW86dCs9XCIvXCIrbyl9cmV0dXJuIHZvaWQgMD09PXQ/XCIuXCI6bi5ub3JtYWxpemUodCl9LHJlbGF0aXZlOmZ1bmN0aW9uKHQscil7aWYoZSh0KSxlKHIpLHQ9PT1yKXJldHVyblwiXCI7aWYoKHQ9bi5yZXNvbHZlKHQpKT09PShyPW4ucmVzb2x2ZShyKSkpcmV0dXJuXCJcIjtmb3IodmFyIG89MTtvPHQubGVuZ3RoJiY0Nz09PXQuY2hhckNvZGVBdChvKTsrK28pO2Zvcih2YXIgaT10Lmxlbmd0aCxhPWktbyxoPTE7aDxyLmxlbmd0aCYmNDc9PT1yLmNoYXJDb2RlQXQoaCk7KytoKTtmb3IodmFyIHM9ci5sZW5ndGgtaCxjPWE8cz9hOnMsZj0tMSx1PTA7dTw9YzsrK3Upe2lmKHU9PT1jKXtpZihzPmMpe2lmKDQ3PT09ci5jaGFyQ29kZUF0KGgrdSkpcmV0dXJuIHIuc2xpY2UoaCt1KzEpO2lmKDA9PT11KXJldHVybiByLnNsaWNlKGgrdSl9ZWxzZSBhPmMmJig0Nz09PXQuY2hhckNvZGVBdChvK3UpP2Y9dTowPT09dSYmKGY9MCkpO2JyZWFrfXZhciBsPXQuY2hhckNvZGVBdChvK3UpO2lmKGwhPT1yLmNoYXJDb2RlQXQoaCt1KSlicmVhazs0Nz09PWwmJihmPXUpfXZhciBwPVwiXCI7Zm9yKHU9bytmKzE7dTw9aTsrK3UpdSE9PWkmJjQ3IT09dC5jaGFyQ29kZUF0KHUpfHwoMD09PXAubGVuZ3RoP3ArPVwiLi5cIjpwKz1cIi8uLlwiKTtyZXR1cm4gcC5sZW5ndGg+MD9wK3Iuc2xpY2UoaCtmKTooaCs9Ziw0Nz09PXIuY2hhckNvZGVBdChoKSYmKytoLHIuc2xpY2UoaCkpfSxfbWFrZUxvbmc6ZnVuY3Rpb24odCl7cmV0dXJuIHR9LGRpcm5hbWU6ZnVuY3Rpb24odCl7aWYoZSh0KSwwPT09dC5sZW5ndGgpcmV0dXJuXCIuXCI7Zm9yKHZhciByPXQuY2hhckNvZGVBdCgwKSxuPTQ3PT09cixvPS0xLGk9ITAsYT10Lmxlbmd0aC0xO2E+PTE7LS1hKWlmKDQ3PT09KHI9dC5jaGFyQ29kZUF0KGEpKSl7aWYoIWkpe289YTticmVha319ZWxzZSBpPSExO3JldHVybi0xPT09bz9uP1wiL1wiOlwiLlwiOm4mJjE9PT1vP1wiLy9cIjp0LnNsaWNlKDAsbyl9LGJhc2VuYW1lOmZ1bmN0aW9uKHQscil7aWYodm9pZCAwIT09ciYmXCJzdHJpbmdcIiE9dHlwZW9mIHIpdGhyb3cgbmV3IFR5cGVFcnJvcignXCJleHRcIiBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJyk7ZSh0KTt2YXIgbixvPTAsaT0tMSxhPSEwO2lmKHZvaWQgMCE9PXImJnIubGVuZ3RoPjAmJnIubGVuZ3RoPD10Lmxlbmd0aCl7aWYoci5sZW5ndGg9PT10Lmxlbmd0aCYmcj09PXQpcmV0dXJuXCJcIjt2YXIgaD1yLmxlbmd0aC0xLHM9LTE7Zm9yKG49dC5sZW5ndGgtMTtuPj0wOy0tbil7dmFyIGM9dC5jaGFyQ29kZUF0KG4pO2lmKDQ3PT09Yyl7aWYoIWEpe289bisxO2JyZWFrfX1lbHNlLTE9PT1zJiYoYT0hMSxzPW4rMSksaD49MCYmKGM9PT1yLmNoYXJDb2RlQXQoaCk/LTE9PS0taCYmKGk9bik6KGg9LTEsaT1zKSl9cmV0dXJuIG89PT1pP2k9czotMT09PWkmJihpPXQubGVuZ3RoKSx0LnNsaWNlKG8saSl9Zm9yKG49dC5sZW5ndGgtMTtuPj0wOy0tbilpZig0Nz09PXQuY2hhckNvZGVBdChuKSl7aWYoIWEpe289bisxO2JyZWFrfX1lbHNlLTE9PT1pJiYoYT0hMSxpPW4rMSk7cmV0dXJuLTE9PT1pP1wiXCI6dC5zbGljZShvLGkpfSxleHRuYW1lOmZ1bmN0aW9uKHQpe2UodCk7Zm9yKHZhciByPS0xLG49MCxvPS0xLGk9ITAsYT0wLGg9dC5sZW5ndGgtMTtoPj0wOy0taCl7dmFyIHM9dC5jaGFyQ29kZUF0KGgpO2lmKDQ3IT09cyktMT09PW8mJihpPSExLG89aCsxKSw0Nj09PXM/LTE9PT1yP3I9aDoxIT09YSYmKGE9MSk6LTEhPT1yJiYoYT0tMSk7ZWxzZSBpZighaSl7bj1oKzE7YnJlYWt9fXJldHVybi0xPT09cnx8LTE9PT1vfHwwPT09YXx8MT09PWEmJnI9PT1vLTEmJnI9PT1uKzE/XCJcIjp0LnNsaWNlKHIsbyl9LGZvcm1hdDpmdW5jdGlvbih0KXtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9dHlwZW9mIHQpdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwicGF0aE9iamVjdFwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBPYmplY3QuIFJlY2VpdmVkIHR5cGUgJyt0eXBlb2YgdCk7cmV0dXJuIGZ1bmN0aW9uKHQsZSl7dmFyIHI9ZS5kaXJ8fGUucm9vdCxuPWUuYmFzZXx8KGUubmFtZXx8XCJcIikrKGUuZXh0fHxcIlwiKTtyZXR1cm4gcj9yPT09ZS5yb290P3IrbjpyK1wiL1wiK246bn0oMCx0KX0scGFyc2U6ZnVuY3Rpb24odCl7ZSh0KTt2YXIgcj17cm9vdDpcIlwiLGRpcjpcIlwiLGJhc2U6XCJcIixleHQ6XCJcIixuYW1lOlwiXCJ9O2lmKDA9PT10Lmxlbmd0aClyZXR1cm4gcjt2YXIgbixvPXQuY2hhckNvZGVBdCgwKSxpPTQ3PT09bztpPyhyLnJvb3Q9XCIvXCIsbj0xKTpuPTA7Zm9yKHZhciBhPS0xLGg9MCxzPS0xLGM9ITAsZj10Lmxlbmd0aC0xLHU9MDtmPj1uOy0tZilpZig0NyE9PShvPXQuY2hhckNvZGVBdChmKSkpLTE9PT1zJiYoYz0hMSxzPWYrMSksNDY9PT1vPy0xPT09YT9hPWY6MSE9PXUmJih1PTEpOi0xIT09YSYmKHU9LTEpO2Vsc2UgaWYoIWMpe2g9ZisxO2JyZWFrfXJldHVybi0xPT09YXx8LTE9PT1zfHwwPT09dXx8MT09PXUmJmE9PT1zLTEmJmE9PT1oKzE/LTEhPT1zJiYoci5iYXNlPXIubmFtZT0wPT09aCYmaT90LnNsaWNlKDEscyk6dC5zbGljZShoLHMpKTooMD09PWgmJmk/KHIubmFtZT10LnNsaWNlKDEsYSksci5iYXNlPXQuc2xpY2UoMSxzKSk6KHIubmFtZT10LnNsaWNlKGgsYSksci5iYXNlPXQuc2xpY2UoaCxzKSksci5leHQ9dC5zbGljZShhLHMpKSxoPjA/ci5kaXI9dC5zbGljZSgwLGgtMSk6aSYmKHIuZGlyPVwiL1wiKSxyfSxzZXA6XCIvXCIsZGVsaW1pdGVyOlwiOlwiLHdpbjMyOm51bGwscG9zaXg6bnVsbH07bi5wb3NpeD1uLHQuZXhwb3J0cz1ufX0sZT17fTtmdW5jdGlvbiByKG4pe3ZhciBvPWVbbl07aWYodm9pZCAwIT09bylyZXR1cm4gby5leHBvcnRzO3ZhciBpPWVbbl09e2V4cG9ydHM6e319O3JldHVybiB0W25dKGksaS5leHBvcnRzLHIpLGkuZXhwb3J0c31yLmQ9KHQsZSk9Pntmb3IodmFyIG4gaW4gZSlyLm8oZSxuKSYmIXIubyh0LG4pJiZPYmplY3QuZGVmaW5lUHJvcGVydHkodCxuLHtlbnVtZXJhYmxlOiEwLGdldDplW25dfSl9LHIubz0odCxlKT0+T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsZSksci5yPXQ9PntcInVuZGVmaW5lZFwiIT10eXBlb2YgU3ltYm9sJiZTeW1ib2wudG9TdHJpbmdUYWcmJk9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFN5bWJvbC50b1N0cmluZ1RhZyx7dmFsdWU6XCJNb2R1bGVcIn0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfTt2YXIgbj17fTsoKCk9Pnt2YXIgdDtpZihyLnIobiksci5kKG4se1VSSTooKT0+cCxVdGlsczooKT0+X30pLFwib2JqZWN0XCI9PXR5cGVvZiBwcm9jZXNzKXQ9XCJ3aW4zMlwiPT09cHJvY2Vzcy5wbGF0Zm9ybTtlbHNlIGlmKFwib2JqZWN0XCI9PXR5cGVvZiBuYXZpZ2F0b3Ipe3ZhciBlPW5hdmlnYXRvci51c2VyQWdlbnQ7dD1lLmluZGV4T2YoXCJXaW5kb3dzXCIpPj0wfXZhciBvLGksYT0obz1mdW5jdGlvbih0LGUpe3JldHVybiBvPU9iamVjdC5zZXRQcm90b3R5cGVPZnx8e19fcHJvdG9fXzpbXX1pbnN0YW5jZW9mIEFycmF5JiZmdW5jdGlvbih0LGUpe3QuX19wcm90b19fPWV9fHxmdW5jdGlvbih0LGUpe2Zvcih2YXIgciBpbiBlKU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChlLHIpJiYodFtyXT1lW3JdKX0sbyh0LGUpfSxmdW5jdGlvbih0LGUpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGUmJm51bGwhPT1lKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiK1N0cmluZyhlKStcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO2Z1bmN0aW9uIHIoKXt0aGlzLmNvbnN0cnVjdG9yPXR9byh0LGUpLHQucHJvdG90eXBlPW51bGw9PT1lP09iamVjdC5jcmVhdGUoZSk6KHIucHJvdG90eXBlPWUucHJvdG90eXBlLG5ldyByKX0pLGg9L15cXHdbXFx3XFxkKy4tXSokLyxzPS9eXFwvLyxjPS9eXFwvXFwvLyxmPVwiXCIsdT1cIi9cIixsPS9eKChbXjovPyNdKz8pOik/KFxcL1xcLyhbXi8/I10qKSk/KFtePyNdKikoXFw/KFteI10qKSk/KCMoLiopKT8vLHA9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsZSxyLG4sbyxpKXt2b2lkIDA9PT1pJiYoaT0hMSksXCJvYmplY3RcIj09dHlwZW9mIHQ/KHRoaXMuc2NoZW1lPXQuc2NoZW1lfHxmLHRoaXMuYXV0aG9yaXR5PXQuYXV0aG9yaXR5fHxmLHRoaXMucGF0aD10LnBhdGh8fGYsdGhpcy5xdWVyeT10LnF1ZXJ5fHxmLHRoaXMuZnJhZ21lbnQ9dC5mcmFnbWVudHx8Zik6KHRoaXMuc2NoZW1lPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHR8fGU/dDpcImZpbGVcIn0odCxpKSx0aGlzLmF1dGhvcml0eT1lfHxmLHRoaXMucGF0aD1mdW5jdGlvbih0LGUpe3N3aXRjaCh0KXtjYXNlXCJodHRwc1wiOmNhc2VcImh0dHBcIjpjYXNlXCJmaWxlXCI6ZT9lWzBdIT09dSYmKGU9dStlKTplPXV9cmV0dXJuIGV9KHRoaXMuc2NoZW1lLHJ8fGYpLHRoaXMucXVlcnk9bnx8Zix0aGlzLmZyYWdtZW50PW98fGYsZnVuY3Rpb24odCxlKXtpZighdC5zY2hlbWUmJmUpdGhyb3cgbmV3IEVycm9yKCdbVXJpRXJyb3JdOiBTY2hlbWUgaXMgbWlzc2luZzoge3NjaGVtZTogXCJcIiwgYXV0aG9yaXR5OiBcIicuY29uY2F0KHQuYXV0aG9yaXR5LCdcIiwgcGF0aDogXCInKS5jb25jYXQodC5wYXRoLCdcIiwgcXVlcnk6IFwiJykuY29uY2F0KHQucXVlcnksJ1wiLCBmcmFnbWVudDogXCInKS5jb25jYXQodC5mcmFnbWVudCwnXCJ9JykpO2lmKHQuc2NoZW1lJiYhaC50ZXN0KHQuc2NoZW1lKSl0aHJvdyBuZXcgRXJyb3IoXCJbVXJpRXJyb3JdOiBTY2hlbWUgY29udGFpbnMgaWxsZWdhbCBjaGFyYWN0ZXJzLlwiKTtpZih0LnBhdGgpaWYodC5hdXRob3JpdHkpe2lmKCFzLnRlc3QodC5wYXRoKSl0aHJvdyBuZXcgRXJyb3IoJ1tVcmlFcnJvcl06IElmIGEgVVJJIGNvbnRhaW5zIGFuIGF1dGhvcml0eSBjb21wb25lbnQsIHRoZW4gdGhlIHBhdGggY29tcG9uZW50IG11c3QgZWl0aGVyIGJlIGVtcHR5IG9yIGJlZ2luIHdpdGggYSBzbGFzaCAoXCIvXCIpIGNoYXJhY3RlcicpfWVsc2UgaWYoYy50ZXN0KHQucGF0aCkpdGhyb3cgbmV3IEVycm9yKCdbVXJpRXJyb3JdOiBJZiBhIFVSSSBkb2VzIG5vdCBjb250YWluIGFuIGF1dGhvcml0eSBjb21wb25lbnQsIHRoZW4gdGhlIHBhdGggY2Fubm90IGJlZ2luIHdpdGggdHdvIHNsYXNoIGNoYXJhY3RlcnMgKFwiLy9cIiknKX0odGhpcyxpKSl9cmV0dXJuIGUuaXNVcmk9ZnVuY3Rpb24odCl7cmV0dXJuIHQgaW5zdGFuY2VvZiBlfHwhIXQmJlwic3RyaW5nXCI9PXR5cGVvZiB0LmF1dGhvcml0eSYmXCJzdHJpbmdcIj09dHlwZW9mIHQuZnJhZ21lbnQmJlwic3RyaW5nXCI9PXR5cGVvZiB0LnBhdGgmJlwic3RyaW5nXCI9PXR5cGVvZiB0LnF1ZXJ5JiZcInN0cmluZ1wiPT10eXBlb2YgdC5zY2hlbWUmJlwic3RyaW5nXCI9PXR5cGVvZiB0LmZzUGF0aCYmXCJmdW5jdGlvblwiPT10eXBlb2YgdC53aXRoJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiB0LnRvU3RyaW5nfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJmc1BhdGhcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGIodGhpcywhMSl9LGVudW1lcmFibGU6ITEsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUud2l0aD1mdW5jdGlvbih0KXtpZighdClyZXR1cm4gdGhpczt2YXIgZT10LnNjaGVtZSxyPXQuYXV0aG9yaXR5LG49dC5wYXRoLG89dC5xdWVyeSxpPXQuZnJhZ21lbnQ7cmV0dXJuIHZvaWQgMD09PWU/ZT10aGlzLnNjaGVtZTpudWxsPT09ZSYmKGU9Ziksdm9pZCAwPT09cj9yPXRoaXMuYXV0aG9yaXR5Om51bGw9PT1yJiYocj1mKSx2b2lkIDA9PT1uP249dGhpcy5wYXRoOm51bGw9PT1uJiYobj1mKSx2b2lkIDA9PT1vP289dGhpcy5xdWVyeTpudWxsPT09byYmKG89Ziksdm9pZCAwPT09aT9pPXRoaXMuZnJhZ21lbnQ6bnVsbD09PWkmJihpPWYpLGU9PT10aGlzLnNjaGVtZSYmcj09PXRoaXMuYXV0aG9yaXR5JiZuPT09dGhpcy5wYXRoJiZvPT09dGhpcy5xdWVyeSYmaT09PXRoaXMuZnJhZ21lbnQ/dGhpczpuZXcgZChlLHIsbixvLGkpfSxlLnBhcnNlPWZ1bmN0aW9uKHQsZSl7dm9pZCAwPT09ZSYmKGU9ITEpO3ZhciByPWwuZXhlYyh0KTtyZXR1cm4gcj9uZXcgZChyWzJdfHxmLHgocls0XXx8ZikseChyWzVdfHxmKSx4KHJbN118fGYpLHgocls5XXx8ZiksZSk6bmV3IGQoZixmLGYsZixmKX0sZS5maWxlPWZ1bmN0aW9uKGUpe3ZhciByPWY7aWYodCYmKGU9ZS5yZXBsYWNlKC9cXFxcL2csdSkpLGVbMF09PT11JiZlWzFdPT09dSl7dmFyIG49ZS5pbmRleE9mKHUsMik7LTE9PT1uPyhyPWUuc3Vic3RyaW5nKDIpLGU9dSk6KHI9ZS5zdWJzdHJpbmcoMixuKSxlPWUuc3Vic3RyaW5nKG4pfHx1KX1yZXR1cm4gbmV3IGQoXCJmaWxlXCIscixlLGYsZil9LGUuZnJvbT1mdW5jdGlvbih0KXtyZXR1cm4gbmV3IGQodC5zY2hlbWUsdC5hdXRob3JpdHksdC5wYXRoLHQucXVlcnksdC5mcmFnbWVudCl9LGUucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKHQpe3JldHVybiB2b2lkIDA9PT10JiYodD0hMSksQyh0aGlzLHQpfSxlLnByb3RvdHlwZS50b0pTT049ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30sZS5yZXZpdmU9ZnVuY3Rpb24odCl7aWYodCl7aWYodCBpbnN0YW5jZW9mIGUpcmV0dXJuIHQ7dmFyIHI9bmV3IGQodCk7cmV0dXJuIHIuX2Zvcm1hdHRlZD10LmV4dGVybmFsLHIuX2ZzUGF0aD10Ll9zZXA9PT1nP3QuZnNQYXRoOm51bGwscn1yZXR1cm4gdH0sZX0oKSxnPXQ/MTp2b2lkIDAsZD1mdW5jdGlvbih0KXtmdW5jdGlvbiBlKCl7dmFyIGU9bnVsbCE9PXQmJnQuYXBwbHkodGhpcyxhcmd1bWVudHMpfHx0aGlzO3JldHVybiBlLl9mb3JtYXR0ZWQ9bnVsbCxlLl9mc1BhdGg9bnVsbCxlfXJldHVybiBhKGUsdCksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiZnNQYXRoXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9mc1BhdGh8fCh0aGlzLl9mc1BhdGg9Yih0aGlzLCExKSksdGhpcy5fZnNQYXRofSxlbnVtZXJhYmxlOiExLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKHQpe3JldHVybiB2b2lkIDA9PT10JiYodD0hMSksdD9DKHRoaXMsITApOih0aGlzLl9mb3JtYXR0ZWR8fCh0aGlzLl9mb3JtYXR0ZWQ9Qyh0aGlzLCExKSksdGhpcy5fZm9ybWF0dGVkKX0sZS5wcm90b3R5cGUudG9KU09OPWZ1bmN0aW9uKCl7dmFyIHQ9eyRtaWQ6MX07cmV0dXJuIHRoaXMuX2ZzUGF0aCYmKHQuZnNQYXRoPXRoaXMuX2ZzUGF0aCx0Ll9zZXA9ZyksdGhpcy5fZm9ybWF0dGVkJiYodC5leHRlcm5hbD10aGlzLl9mb3JtYXR0ZWQpLHRoaXMucGF0aCYmKHQucGF0aD10aGlzLnBhdGgpLHRoaXMuc2NoZW1lJiYodC5zY2hlbWU9dGhpcy5zY2hlbWUpLHRoaXMuYXV0aG9yaXR5JiYodC5hdXRob3JpdHk9dGhpcy5hdXRob3JpdHkpLHRoaXMucXVlcnkmJih0LnF1ZXJ5PXRoaXMucXVlcnkpLHRoaXMuZnJhZ21lbnQmJih0LmZyYWdtZW50PXRoaXMuZnJhZ21lbnQpLHR9LGV9KHApLHY9KChpPXt9KVs1OF09XCIlM0FcIixpWzQ3XT1cIiUyRlwiLGlbNjNdPVwiJTNGXCIsaVszNV09XCIlMjNcIixpWzkxXT1cIiU1QlwiLGlbOTNdPVwiJTVEXCIsaVs2NF09XCIlNDBcIixpWzMzXT1cIiUyMVwiLGlbMzZdPVwiJTI0XCIsaVszOF09XCIlMjZcIixpWzM5XT1cIiUyN1wiLGlbNDBdPVwiJTI4XCIsaVs0MV09XCIlMjlcIixpWzQyXT1cIiUyQVwiLGlbNDNdPVwiJTJCXCIsaVs0NF09XCIlMkNcIixpWzU5XT1cIiUzQlwiLGlbNjFdPVwiJTNEXCIsaVszMl09XCIlMjBcIixpKTtmdW5jdGlvbiB5KHQsZSl7Zm9yKHZhciByPXZvaWQgMCxuPS0xLG89MDtvPHQubGVuZ3RoO28rKyl7dmFyIGk9dC5jaGFyQ29kZUF0KG8pO2lmKGk+PTk3JiZpPD0xMjJ8fGk+PTY1JiZpPD05MHx8aT49NDgmJmk8PTU3fHw0NT09PWl8fDQ2PT09aXx8OTU9PT1pfHwxMjY9PT1pfHxlJiY0Nz09PWkpLTEhPT1uJiYocis9ZW5jb2RlVVJJQ29tcG9uZW50KHQuc3Vic3RyaW5nKG4sbykpLG49LTEpLHZvaWQgMCE9PXImJihyKz10LmNoYXJBdChvKSk7ZWxzZXt2b2lkIDA9PT1yJiYocj10LnN1YnN0cigwLG8pKTt2YXIgYT12W2ldO3ZvaWQgMCE9PWE/KC0xIT09biYmKHIrPWVuY29kZVVSSUNvbXBvbmVudCh0LnN1YnN0cmluZyhuLG8pKSxuPS0xKSxyKz1hKTotMT09PW4mJihuPW8pfX1yZXR1cm4tMSE9PW4mJihyKz1lbmNvZGVVUklDb21wb25lbnQodC5zdWJzdHJpbmcobikpKSx2b2lkIDAhPT1yP3I6dH1mdW5jdGlvbiBtKHQpe2Zvcih2YXIgZT12b2lkIDAscj0wO3I8dC5sZW5ndGg7cisrKXt2YXIgbj10LmNoYXJDb2RlQXQocik7MzU9PT1ufHw2Mz09PW4/KHZvaWQgMD09PWUmJihlPXQuc3Vic3RyKDAscikpLGUrPXZbbl0pOnZvaWQgMCE9PWUmJihlKz10W3JdKX1yZXR1cm4gdm9pZCAwIT09ZT9lOnR9ZnVuY3Rpb24gYihlLHIpe3ZhciBuO3JldHVybiBuPWUuYXV0aG9yaXR5JiZlLnBhdGgubGVuZ3RoPjEmJlwiZmlsZVwiPT09ZS5zY2hlbWU/XCIvL1wiLmNvbmNhdChlLmF1dGhvcml0eSkuY29uY2F0KGUucGF0aCk6NDc9PT1lLnBhdGguY2hhckNvZGVBdCgwKSYmKGUucGF0aC5jaGFyQ29kZUF0KDEpPj02NSYmZS5wYXRoLmNoYXJDb2RlQXQoMSk8PTkwfHxlLnBhdGguY2hhckNvZGVBdCgxKT49OTcmJmUucGF0aC5jaGFyQ29kZUF0KDEpPD0xMjIpJiY1OD09PWUucGF0aC5jaGFyQ29kZUF0KDIpP3I/ZS5wYXRoLnN1YnN0cigxKTplLnBhdGhbMV0udG9Mb3dlckNhc2UoKStlLnBhdGguc3Vic3RyKDIpOmUucGF0aCx0JiYobj1uLnJlcGxhY2UoL1xcLy9nLFwiXFxcXFwiKSksbn1mdW5jdGlvbiBDKHQsZSl7dmFyIHI9ZT9tOnksbj1cIlwiLG89dC5zY2hlbWUsaT10LmF1dGhvcml0eSxhPXQucGF0aCxoPXQucXVlcnkscz10LmZyYWdtZW50O2lmKG8mJihuKz1vLG4rPVwiOlwiKSwoaXx8XCJmaWxlXCI9PT1vKSYmKG4rPXUsbis9dSksaSl7dmFyIGM9aS5pbmRleE9mKFwiQFwiKTtpZigtMSE9PWMpe3ZhciBmPWkuc3Vic3RyKDAsYyk7aT1pLnN1YnN0cihjKzEpLC0xPT09KGM9Zi5pbmRleE9mKFwiOlwiKSk/bis9cihmLCExKToobis9cihmLnN1YnN0cigwLGMpLCExKSxuKz1cIjpcIixuKz1yKGYuc3Vic3RyKGMrMSksITEpKSxuKz1cIkBcIn0tMT09PShjPShpPWkudG9Mb3dlckNhc2UoKSkuaW5kZXhPZihcIjpcIikpP24rPXIoaSwhMSk6KG4rPXIoaS5zdWJzdHIoMCxjKSwhMSksbis9aS5zdWJzdHIoYykpfWlmKGEpe2lmKGEubGVuZ3RoPj0zJiY0Nz09PWEuY2hhckNvZGVBdCgwKSYmNTg9PT1hLmNoYXJDb2RlQXQoMikpKGw9YS5jaGFyQ29kZUF0KDEpKT49NjUmJmw8PTkwJiYoYT1cIi9cIi5jb25jYXQoU3RyaW5nLmZyb21DaGFyQ29kZShsKzMyKSxcIjpcIikuY29uY2F0KGEuc3Vic3RyKDMpKSk7ZWxzZSBpZihhLmxlbmd0aD49MiYmNTg9PT1hLmNoYXJDb2RlQXQoMSkpe3ZhciBsOyhsPWEuY2hhckNvZGVBdCgwKSk+PTY1JiZsPD05MCYmKGE9XCJcIi5jb25jYXQoU3RyaW5nLmZyb21DaGFyQ29kZShsKzMyKSxcIjpcIikuY29uY2F0KGEuc3Vic3RyKDIpKSl9bis9cihhLCEwKX1yZXR1cm4gaCYmKG4rPVwiP1wiLG4rPXIoaCwhMSkpLHMmJihuKz1cIiNcIixuKz1lP3M6eShzLCExKSksbn1mdW5jdGlvbiBBKHQpe3RyeXtyZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHQpfWNhdGNoKGUpe3JldHVybiB0Lmxlbmd0aD4zP3Quc3Vic3RyKDAsMykrQSh0LnN1YnN0cigzKSk6dH19dmFyIHc9LyglWzAtOUEtWmEtel1bMC05QS1aYS16XSkrL2c7ZnVuY3Rpb24geCh0KXtyZXR1cm4gdC5tYXRjaCh3KT90LnJlcGxhY2UodywoZnVuY3Rpb24odCl7cmV0dXJuIEEodCl9KSk6dH12YXIgXyxPPXIoNDcwKSxQPWZ1bmN0aW9uKHQsZSxyKXtpZihyfHwyPT09YXJndW1lbnRzLmxlbmd0aClmb3IodmFyIG4sbz0wLGk9ZS5sZW5ndGg7bzxpO28rKykhbiYmbyBpbiBlfHwobnx8KG49QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZSwwLG8pKSxuW29dPWVbb10pO3JldHVybiB0LmNvbmNhdChufHxBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChlKSl9LGo9Ty5wb3NpeHx8TyxVPVwiL1wiOyFmdW5jdGlvbih0KXt0LmpvaW5QYXRoPWZ1bmN0aW9uKHQpe2Zvcih2YXIgZT1bXSxyPTE7cjxhcmd1bWVudHMubGVuZ3RoO3IrKyllW3ItMV09YXJndW1lbnRzW3JdO3JldHVybiB0LndpdGgoe3BhdGg6ai5qb2luLmFwcGx5KGosUChbdC5wYXRoXSxlLCExKSl9KX0sdC5yZXNvbHZlUGF0aD1mdW5jdGlvbih0KXtmb3IodmFyIGU9W10scj0xO3I8YXJndW1lbnRzLmxlbmd0aDtyKyspZVtyLTFdPWFyZ3VtZW50c1tyXTt2YXIgbj10LnBhdGgsbz0hMTtuWzBdIT09VSYmKG49VStuLG89ITApO3ZhciBpPWoucmVzb2x2ZS5hcHBseShqLFAoW25dLGUsITEpKTtyZXR1cm4gbyYmaVswXT09PVUmJiF0LmF1dGhvcml0eSYmKGk9aS5zdWJzdHJpbmcoMSkpLHQud2l0aCh7cGF0aDppfSl9LHQuZGlybmFtZT1mdW5jdGlvbih0KXtpZigwPT09dC5wYXRoLmxlbmd0aHx8dC5wYXRoPT09VSlyZXR1cm4gdDt2YXIgZT1qLmRpcm5hbWUodC5wYXRoKTtyZXR1cm4gMT09PWUubGVuZ3RoJiY0Nj09PWUuY2hhckNvZGVBdCgwKSYmKGU9XCJcIiksdC53aXRoKHtwYXRoOmV9KX0sdC5iYXNlbmFtZT1mdW5jdGlvbih0KXtyZXR1cm4gai5iYXNlbmFtZSh0LnBhdGgpfSx0LmV4dG5hbWU9ZnVuY3Rpb24odCl7cmV0dXJuIGouZXh0bmFtZSh0LnBhdGgpfX0oX3x8KF89e30pKX0pKCksTElCPW59KSgpO2V4cG9ydCBjb25zdHtVUkksVXRpbHN9PUxJQjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgLk5FVCBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS4gU2VlIExJQ0VOU0UgZmlsZSBpbiB0aGUgcHJvamVjdCByb290IGZvciBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24uXHJcblxyXG5pbXBvcnQgKiBhcyBjb21tYW5kc0FuZEV2ZW50cyBmcm9tICcuL2NvbW1hbmRzQW5kRXZlbnRzJztcclxuaW1wb3J0IHsgVVJJIH0gZnJvbSAndnNjb2RlLXVyaSc7XHJcbmltcG9ydCB7IEtlcm5lbENvbW1hbmRPckV2ZW50RW52ZWxvcGUsIGlzS2VybmVsQ29tbWFuZEVudmVsb3BlIH0gZnJvbSAnLi9jb25uZWN0aW9uJztcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlS2VybmVsVXJpKGtlcm5lbFVyaTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHVyaSA9IFVSSS5wYXJzZShrZXJuZWxVcmkpO1xyXG4gICAgdXJpLmF1dGhvcml0eTtcclxuICAgIHVyaS5wYXRoO1xyXG4gICAgbGV0IGFic29sdXRlVXJpID0gYCR7dXJpLnNjaGVtZX06Ly8ke3VyaS5hdXRob3JpdHl9JHt1cmkucGF0aCB8fCBcIi9cIn1gO1xyXG4gICAgcmV0dXJuIGFic29sdXRlVXJpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlS2VybmVsVXJpV2l0aFF1ZXJ5KGtlcm5lbFVyaTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHVyaSA9IFVSSS5wYXJzZShrZXJuZWxVcmkpO1xyXG4gICAgdXJpLmF1dGhvcml0eTtcclxuICAgIHVyaS5wYXRoO1xyXG4gICAgbGV0IGFic29sdXRlVXJpID0gYCR7dXJpLnNjaGVtZX06Ly8ke3VyaS5hdXRob3JpdHl9JHt1cmkucGF0aCB8fCBcIi9cIn1gO1xyXG4gICAgaWYgKHVyaS5xdWVyeSkge1xyXG4gICAgICAgIGFic29sdXRlVXJpICs9IGA/JHt1cmkucXVlcnl9YDtcclxuICAgIH1cclxuICAgIHJldHVybiBhYnNvbHV0ZVVyaTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGFnKGtlcm5lbFVyaTogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcclxuICAgIGNvbnN0IHVyaSA9IFVSSS5wYXJzZShrZXJuZWxVcmkpO1xyXG4gICAgaWYgKHVyaS5xdWVyeSkgey8vP1xyXG4gICAgICAgIGNvbnN0IHBhcnRzID0gdXJpLnF1ZXJ5LnNwbGl0KFwidGFnPVwiKTtcclxuICAgICAgICBpZiAocGFydHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcGFydHNbMV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVJvdXRpbmdTbGlwKGtlcm5lbFVyaXM6IHN0cmluZ1tdKTogc3RyaW5nW10ge1xyXG4gICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChrZXJuZWxVcmlzLm1hcChlID0+IGNyZWF0ZUtlcm5lbFVyaVdpdGhRdWVyeShlKSkpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcm91dGluZ1NsaXBTdGFydHNXaXRoKHRoaXNLZXJuZWxVcmlzOiBzdHJpbmdbXSwgb3RoZXJLZXJuZWxVcmlzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xyXG4gICAgbGV0IHN0YXJ0c1dpdGggPSB0cnVlO1xyXG5cclxuICAgIGlmIChvdGhlcktlcm5lbFVyaXMubGVuZ3RoID4gMCAmJiB0aGlzS2VybmVsVXJpcy5sZW5ndGggPj0gb3RoZXJLZXJuZWxVcmlzLmxlbmd0aCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3RoZXJLZXJuZWxVcmlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChjcmVhdGVLZXJuZWxVcmkob3RoZXJLZXJuZWxVcmlzW2ldKSAhPT0gY3JlYXRlS2VybmVsVXJpKHRoaXNLZXJuZWxVcmlzW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgc3RhcnRzV2l0aCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBzdGFydHNXaXRoID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHN0YXJ0c1dpdGg7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJvdXRpbmdTbGlwQ29udGFpbnMocm91dGluZ1NsaXA6IHN0cmluZ1tdLCBrZXJuZWxVcmk6IHN0cmluZywgaWdub3JlUXVlcnk6IGJvb2xlYW4gPSBmYWxzZSk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3Qgbm9ybWFsaXplZFVyaSA9IGlnbm9yZVF1ZXJ5ID8gY3JlYXRlS2VybmVsVXJpKGtlcm5lbFVyaSkgOiBjcmVhdGVLZXJuZWxVcmlXaXRoUXVlcnkoa2VybmVsVXJpKTtcclxuICAgIHJldHVybiByb3V0aW5nU2xpcC5maW5kKGUgPT4gbm9ybWFsaXplZFVyaSA9PT0gKCFpZ25vcmVRdWVyeSA/IGNyZWF0ZUtlcm5lbFVyaVdpdGhRdWVyeShlKSA6IGNyZWF0ZUtlcm5lbFVyaShlKSkpICE9PSB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSb3V0aW5nU2xpcCB7XHJcbiAgICBwcml2YXRlIF91cmlzOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgIHByb3RlY3RlZCBnZXQgdXJpcygpOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VyaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHNldCB1cmlzKHZhbHVlOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIHRoaXMuX3VyaXMgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29udGFpbnMoa2VybmVsVXJpOiBzdHJpbmcsIGlnbm9yZVF1ZXJ5OiBib29sZWFuID0gZmFsc2UpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gcm91dGluZ1NsaXBDb250YWlucyh0aGlzLl91cmlzLCBrZXJuZWxVcmksIGlnbm9yZVF1ZXJ5KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnRzV2l0aChvdGhlcjogc3RyaW5nW10gfCBSb3V0aW5nU2xpcCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByb3V0aW5nU2xpcFN0YXJ0c1dpdGgodGhpcy5fdXJpcywgb3RoZXIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiByb3V0aW5nU2xpcFN0YXJ0c1dpdGgodGhpcy5fdXJpcywgb3RoZXIuX3VyaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29udGludWVXaXRoKG90aGVyOiBzdHJpbmdbXSB8IFJvdXRpbmdTbGlwKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IG90aGVyVXJpcyA9IChvdGhlciBpbnN0YW5jZW9mIEFycmF5ID8gb3RoZXIgOiBvdGhlci5fdXJpcykgfHwgW107XHJcbiAgICAgICAgaWYgKG90aGVyVXJpcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGlmIChyb3V0aW5nU2xpcFN0YXJ0c1dpdGgob3RoZXJVcmlzLCB0aGlzLl91cmlzKSkge1xyXG4gICAgICAgICAgICAgICAgb3RoZXJVcmlzID0gb3RoZXJVcmlzLnNsaWNlKHRoaXMuX3VyaXMubGVuZ3RoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdGhlclVyaXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNvbnRhaW5zKG90aGVyVXJpc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3VyaXMucHVzaChvdGhlclVyaXNbaV0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgdXJpICR7b3RoZXJVcmlzW2ldfSBpcyBhbHJlYWR5IGluIHRoZSByb3V0aW5nIHNsaXAgWyR7dGhpcy5fdXJpc31dLCBjYW5ub3QgY29udGludWUgd2l0aCByb3V0aW5nIHNsaXAgWyR7b3RoZXJVcmlzfV1gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9BcnJheSgpOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgcmV0dXJuIFsuLi50aGlzLl91cmlzXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3Qgc3RhbXAoa2VybmVsVXJpOiBzdHJpbmcpOiB2b2lkO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ29tbWFuZFJvdXRpbmdTbGlwIGV4dGVuZHMgUm91dGluZ1NsaXAge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGZyb21VcmlzKHVyaXM6IHN0cmluZ1tdKTogQ29tbWFuZFJvdXRpbmdTbGlwIHtcclxuICAgICAgICBjb25zdCByb3V0aW5nU2xpcCA9IG5ldyBDb21tYW5kUm91dGluZ1NsaXAoKTtcclxuICAgICAgICByb3V0aW5nU2xpcC51cmlzID0gdXJpcztcclxuICAgICAgICByZXR1cm4gcm91dGluZ1NsaXA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YW1wQXNBcnJpdmVkKGtlcm5lbFVyaTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zdGFtcEFzKGtlcm5lbFVyaSwgXCJhcnJpdmVkXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvdmVycmlkZSBzdGFtcChrZXJuZWxVcmk6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuc3RhbXBBcyhrZXJuZWxVcmkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhbXBBcyhrZXJuZWxVcmk6IHN0cmluZywgdGFnPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRhZykge1xyXG4gICAgICAgICAgICBjb25zdCBhYnNvbHV0ZVVyaVdpdGhRdWVyeSA9IGAke2NyZWF0ZUtlcm5lbFVyaShrZXJuZWxVcmkpfT90YWc9JHt0YWd9YDtcclxuICAgICAgICAgICAgY29uc3QgYWJzb2x1dGVVcmlXaXRob3V0UXVlcnkgPSBjcmVhdGVLZXJuZWxVcmkoa2VybmVsVXJpKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMudXJpcy5maW5kKGUgPT4gZS5zdGFydHNXaXRoKGFic29sdXRlVXJpV2l0aG91dFF1ZXJ5KSkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIHVyaSAke2Fic29sdXRlVXJpV2l0aFF1ZXJ5fSBpcyBhbHJlYWR5IGluIHRoZSByb3V0aW5nIHNsaXAgWyR7dGhpcy51cmlzfV1gKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXJpcy5wdXNoKGFic29sdXRlVXJpV2l0aFF1ZXJ5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFic29sdXRlVXJpV2l0aFF1ZXJ5ID0gYCR7Y3JlYXRlS2VybmVsVXJpKGtlcm5lbFVyaSl9P3RhZz1hcnJpdmVkYDtcclxuICAgICAgICAgICAgY29uc3QgYWJzb2x1dGVVcmlXaXRob3V0UXVlcnkgPSBjcmVhdGVLZXJuZWxVcmkoa2VybmVsVXJpKTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnVyaXMuZmluZChlID0+IGUuc3RhcnRzV2l0aChhYnNvbHV0ZVVyaVdpdGhRdWVyeSkpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSB1cmkgJHthYnNvbHV0ZVVyaVdpdGhRdWVyeX0gaXMgbm90IGluIHRoZSByb3V0aW5nIHNsaXAgWyR7dGhpcy51cmlzfV1gKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnVyaXMuZmluZChlID0+IGUgPT09IGFic29sdXRlVXJpV2l0aG91dFF1ZXJ5KSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgdXJpICR7YWJzb2x1dGVVcmlXaXRob3V0UXVlcnl9IGlzIGFscmVhZHkgaW4gdGhlIHJvdXRpbmcgc2xpcCBbJHt0aGlzLnVyaXN9XWApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cmlzLnB1c2goYWJzb2x1dGVVcmlXaXRob3V0UXVlcnkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRXZlbnRSb3V0aW5nU2xpcCBleHRlbmRzIFJvdXRpbmdTbGlwIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBmcm9tVXJpcyh1cmlzOiBzdHJpbmdbXSk6IEV2ZW50Um91dGluZ1NsaXAge1xyXG4gICAgICAgIGNvbnN0IHJvdXRpbmdTbGlwID0gbmV3IEV2ZW50Um91dGluZ1NsaXAoKTtcclxuICAgICAgICByb3V0aW5nU2xpcC51cmlzID0gdXJpcztcclxuICAgICAgICByZXR1cm4gcm91dGluZ1NsaXA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG92ZXJyaWRlIHN0YW1wKGtlcm5lbFVyaTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZFVyaSA9IGNyZWF0ZUtlcm5lbFVyaVdpdGhRdWVyeShrZXJuZWxVcmkpO1xyXG4gICAgICAgIGNvbnN0IGNhbkFkZCA9ICF0aGlzLnVyaXMuZmluZChlID0+IGNyZWF0ZUtlcm5lbFVyaVdpdGhRdWVyeShlKSA9PT0gbm9ybWFsaXplZFVyaSk7XHJcbiAgICAgICAgaWYgKGNhbkFkZCkge1xyXG4gICAgICAgICAgICB0aGlzLnVyaXMucHVzaChub3JtYWxpemVkVXJpKTtcclxuICAgICAgICAgICAgdGhpcy51cmlzO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIHVyaSAke25vcm1hbGl6ZWRVcml9IGlzIGFscmVhZHkgaW4gdGhlIHJvdXRpbmcgc2xpcCBbJHt0aGlzLnVyaXN9XWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vIENvcHlyaWdodCAoYykgLk5FVCBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS4gU2VlIExJQ0VOU0UgZmlsZSBpbiB0aGUgcHJvamVjdCByb290IGZvciBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24uXHJcblxyXG4vLyBHZW5lcmF0ZWQgVHlwZVNjcmlwdCBpbnRlcmZhY2VzIGFuZCB0eXBlcy5cclxuXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBLZXJuZWwgQ29tbWFuZHNcclxuXHJcbmV4cG9ydCBjb25zdCBBZGRQYWNrYWdlVHlwZSA9IFwiQWRkUGFja2FnZVwiO1xyXG5leHBvcnQgY29uc3QgQWRkUGFja2FnZVNvdXJjZVR5cGUgPSBcIkFkZFBhY2thZ2VTb3VyY2VcIjtcclxuZXhwb3J0IGNvbnN0IENhbmNlbFR5cGUgPSBcIkNhbmNlbFwiO1xyXG5leHBvcnQgY29uc3QgQ2xlYXJWYWx1ZXNUeXBlID0gXCJDbGVhclZhbHVlc1wiO1xyXG5leHBvcnQgY29uc3QgQ29tcGlsZVByb2plY3RUeXBlID0gXCJDb21waWxlUHJvamVjdFwiO1xyXG5leHBvcnQgY29uc3QgQ29ubmVjdEp1cHl0ZXJLZXJuZWxUeXBlID0gXCJDb25uZWN0SnVweXRlcktlcm5lbFwiO1xyXG5leHBvcnQgY29uc3QgQ29ubmVjdFNpZ25hbFJUeXBlID0gXCJDb25uZWN0U2lnbmFsUlwiO1xyXG5leHBvcnQgY29uc3QgQ29ubmVjdFN0ZGlvVHlwZSA9IFwiQ29ubmVjdFN0ZGlvXCI7XHJcbmV4cG9ydCBjb25zdCBEaXNwbGF5RXJyb3JUeXBlID0gXCJEaXNwbGF5RXJyb3JcIjtcclxuZXhwb3J0IGNvbnN0IERpc3BsYXlWYWx1ZVR5cGUgPSBcIkRpc3BsYXlWYWx1ZVwiO1xyXG5leHBvcnQgY29uc3QgRXhwYW5kQ29kZVR5cGUgPSBcIkV4cGFuZENvZGVcIjtcclxuZXhwb3J0IGNvbnN0IEltcG9ydERvY3VtZW50VHlwZSA9IFwiSW1wb3J0RG9jdW1lbnRcIjtcclxuZXhwb3J0IGNvbnN0IE9wZW5Eb2N1bWVudFR5cGUgPSBcIk9wZW5Eb2N1bWVudFwiO1xyXG5leHBvcnQgY29uc3QgT3BlblByb2plY3RUeXBlID0gXCJPcGVuUHJvamVjdFwiO1xyXG5leHBvcnQgY29uc3QgUXVpdFR5cGUgPSBcIlF1aXRcIjtcclxuZXhwb3J0IGNvbnN0IFJlcXVlc3RDb2RlRXhwYW5zaW9uSW5mb3NUeXBlID0gXCJSZXF1ZXN0Q29kZUV4cGFuc2lvbkluZm9zXCI7XHJcbmV4cG9ydCBjb25zdCBSZXF1ZXN0Q29tcGxldGlvbnNUeXBlID0gXCJSZXF1ZXN0Q29tcGxldGlvbnNcIjtcclxuZXhwb3J0IGNvbnN0IFJlcXVlc3REaWFnbm9zdGljc1R5cGUgPSBcIlJlcXVlc3REaWFnbm9zdGljc1wiO1xyXG5leHBvcnQgY29uc3QgUmVxdWVzdEhvdmVyVGV4dFR5cGUgPSBcIlJlcXVlc3RIb3ZlclRleHRcIjtcclxuZXhwb3J0IGNvbnN0IFJlcXVlc3RJbnB1dFR5cGUgPSBcIlJlcXVlc3RJbnB1dFwiO1xyXG5leHBvcnQgY29uc3QgUmVxdWVzdElucHV0c1R5cGUgPSBcIlJlcXVlc3RJbnB1dHNcIjtcclxuZXhwb3J0IGNvbnN0IFJlcXVlc3RLZXJuZWxJbmZvVHlwZSA9IFwiUmVxdWVzdEtlcm5lbEluZm9cIjtcclxuZXhwb3J0IGNvbnN0IFJlcXVlc3RTaWduYXR1cmVIZWxwVHlwZSA9IFwiUmVxdWVzdFNpZ25hdHVyZUhlbHBcIjtcclxuZXhwb3J0IGNvbnN0IFJlcXVlc3RWYWx1ZVR5cGUgPSBcIlJlcXVlc3RWYWx1ZVwiO1xyXG5leHBvcnQgY29uc3QgUmVxdWVzdFZhbHVlSW5mb3NUeXBlID0gXCJSZXF1ZXN0VmFsdWVJbmZvc1wiO1xyXG5leHBvcnQgY29uc3QgU2VuZEVkaXRhYmxlQ29kZVR5cGUgPSBcIlNlbmRFZGl0YWJsZUNvZGVcIjtcclxuZXhwb3J0IGNvbnN0IFNlbmRWYWx1ZVR5cGUgPSBcIlNlbmRWYWx1ZVwiO1xyXG5leHBvcnQgY29uc3QgU3VibWl0Q29kZVR5cGUgPSBcIlN1Ym1pdENvZGVcIjtcclxuZXhwb3J0IGNvbnN0IFVwZGF0ZURpc3BsYXllZFZhbHVlVHlwZSA9IFwiVXBkYXRlRGlzcGxheWVkVmFsdWVcIjtcclxuXHJcbmV4cG9ydCB0eXBlIEtlcm5lbENvbW1hbmRUeXBlID1cclxuICAgICAgdHlwZW9mIEFkZFBhY2thZ2VUeXBlXHJcbiAgICB8IHR5cGVvZiBBZGRQYWNrYWdlU291cmNlVHlwZVxyXG4gICAgfCB0eXBlb2YgQ2FuY2VsVHlwZVxyXG4gICAgfCB0eXBlb2YgQ2xlYXJWYWx1ZXNUeXBlXHJcbiAgICB8IHR5cGVvZiBDb21waWxlUHJvamVjdFR5cGVcclxuICAgIHwgdHlwZW9mIENvbm5lY3RKdXB5dGVyS2VybmVsVHlwZVxyXG4gICAgfCB0eXBlb2YgQ29ubmVjdFNpZ25hbFJUeXBlXHJcbiAgICB8IHR5cGVvZiBDb25uZWN0U3RkaW9UeXBlXHJcbiAgICB8IHR5cGVvZiBEaXNwbGF5RXJyb3JUeXBlXHJcbiAgICB8IHR5cGVvZiBEaXNwbGF5VmFsdWVUeXBlXHJcbiAgICB8IHR5cGVvZiBFeHBhbmRDb2RlVHlwZVxyXG4gICAgfCB0eXBlb2YgSW1wb3J0RG9jdW1lbnRUeXBlXHJcbiAgICB8IHR5cGVvZiBPcGVuRG9jdW1lbnRUeXBlXHJcbiAgICB8IHR5cGVvZiBPcGVuUHJvamVjdFR5cGVcclxuICAgIHwgdHlwZW9mIFF1aXRUeXBlXHJcbiAgICB8IHR5cGVvZiBSZXF1ZXN0Q29kZUV4cGFuc2lvbkluZm9zVHlwZVxyXG4gICAgfCB0eXBlb2YgUmVxdWVzdENvbXBsZXRpb25zVHlwZVxyXG4gICAgfCB0eXBlb2YgUmVxdWVzdERpYWdub3N0aWNzVHlwZVxyXG4gICAgfCB0eXBlb2YgUmVxdWVzdEhvdmVyVGV4dFR5cGVcclxuICAgIHwgdHlwZW9mIFJlcXVlc3RJbnB1dFR5cGVcclxuICAgIHwgdHlwZW9mIFJlcXVlc3RJbnB1dHNUeXBlXHJcbiAgICB8IHR5cGVvZiBSZXF1ZXN0S2VybmVsSW5mb1R5cGVcclxuICAgIHwgdHlwZW9mIFJlcXVlc3RTaWduYXR1cmVIZWxwVHlwZVxyXG4gICAgfCB0eXBlb2YgUmVxdWVzdFZhbHVlVHlwZVxyXG4gICAgfCB0eXBlb2YgUmVxdWVzdFZhbHVlSW5mb3NUeXBlXHJcbiAgICB8IHR5cGVvZiBTZW5kRWRpdGFibGVDb2RlVHlwZVxyXG4gICAgfCB0eXBlb2YgU2VuZFZhbHVlVHlwZVxyXG4gICAgfCB0eXBlb2YgU3VibWl0Q29kZVR5cGVcclxuICAgIHwgdHlwZW9mIFVwZGF0ZURpc3BsYXllZFZhbHVlVHlwZTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQWRkUGFja2FnZSBleHRlbmRzIEtlcm5lbENvbW1hbmQge1xyXG4gICAgcGFja2FnZU5hbWU6IHN0cmluZztcclxuICAgIHBhY2thZ2VWZXJzaW9uOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgS2VybmVsQ29tbWFuZCB7XHJcbiAgICBkZXN0aW5hdGlvblVyaT86IHN0cmluZztcclxuICAgIG9yaWdpblVyaT86IHN0cmluZztcclxuICAgIHRhcmdldEtlcm5lbE5hbWU/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQWRkUGFja2FnZVNvdXJjZSBleHRlbmRzIEtlcm5lbENvbW1hbmQge1xyXG4gICAgcGFja2FnZVNvdXJjZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENhbmNlbCBleHRlbmRzIEtlcm5lbENvbW1hbmQge1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENsZWFyVmFsdWVzIGV4dGVuZHMgS2VybmVsQ29tbWFuZCB7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ29tcGlsZVByb2plY3QgZXh0ZW5kcyBLZXJuZWxDb21tYW5kIHtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDb25uZWN0SnVweXRlcktlcm5lbCBleHRlbmRzIENvbm5lY3RLZXJuZWxDb21tYW5kIHtcclxuICAgIGNvbmRhRW52OiBzdHJpbmc7XHJcbiAgICBpbml0U2NyaXB0OiBzdHJpbmc7XHJcbiAgICBrZXJuZWxTcGVjOiBzdHJpbmc7XHJcbiAgICB1cmw6IHN0cmluZztcclxuICAgIHRva2VuOiBzdHJpbmc7XHJcbiAgICBiZWFyZXI6IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ29ubmVjdEtlcm5lbENvbW1hbmQgZXh0ZW5kcyBLZXJuZWxEaXJlY3RpdmVDb21tYW5kIHtcclxuICAgIGtlcm5lbE5hbWU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBLZXJuZWxEaXJlY3RpdmVDb21tYW5kIGV4dGVuZHMgS2VybmVsQ29tbWFuZCB7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ29ubmVjdFNpZ25hbFIgZXh0ZW5kcyBDb25uZWN0S2VybmVsQ29tbWFuZCB7XHJcbiAgICBodWJVcmw6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDb25uZWN0U3RkaW8gZXh0ZW5kcyBDb25uZWN0S2VybmVsQ29tbWFuZCB7XHJcbiAgICBjb21tYW5kOiBBcnJheTxzdHJpbmc+O1xyXG4gICAga2VybmVsSG9zdDogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERpc3BsYXlFcnJvciBleHRlbmRzIEtlcm5lbENvbW1hbmQge1xyXG4gICAgbWVzc2FnZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERpc3BsYXlWYWx1ZSBleHRlbmRzIEtlcm5lbENvbW1hbmQge1xyXG4gICAgZm9ybWF0dGVkVmFsdWU6IEZvcm1hdHRlZFZhbHVlO1xyXG4gICAgdmFsdWVJZDogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEV4cGFuZENvZGUgZXh0ZW5kcyBLZXJuZWxDb21tYW5kIHtcclxuICAgIGluc2VydEF0UG9zaXRpb24/OiBudW1iZXI7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSW1wb3J0RG9jdW1lbnQgZXh0ZW5kcyBLZXJuZWxDb21tYW5kIHtcclxuICAgIGZpbGU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBPcGVuRG9jdW1lbnQgZXh0ZW5kcyBLZXJuZWxDb21tYW5kIHtcclxuICAgIHJlZ2lvbk5hbWU/OiBzdHJpbmc7XHJcbiAgICByZWxhdGl2ZUZpbGVQYXRoOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgT3BlblByb2plY3QgZXh0ZW5kcyBLZXJuZWxDb21tYW5kIHtcclxuICAgIHByb2plY3Q6IFByb2plY3Q7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUXVpdCBleHRlbmRzIEtlcm5lbENvbW1hbmQge1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJlcXVlc3RDb2RlRXhwYW5zaW9uSW5mb3MgZXh0ZW5kcyBLZXJuZWxDb21tYW5kIHtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSZXF1ZXN0Q29tcGxldGlvbnMgZXh0ZW5kcyBMYW5ndWFnZVNlcnZpY2VDb21tYW5kIHtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBMYW5ndWFnZVNlcnZpY2VDb21tYW5kIGV4dGVuZHMgS2VybmVsQ29tbWFuZCB7XHJcbiAgICBjb2RlOiBzdHJpbmc7XHJcbiAgICBsaW5lUG9zaXRpb246IExpbmVQb3NpdGlvbjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSZXF1ZXN0RGlhZ25vc3RpY3MgZXh0ZW5kcyBLZXJuZWxDb21tYW5kIHtcclxuICAgIGNvZGU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSZXF1ZXN0SG92ZXJUZXh0IGV4dGVuZHMgTGFuZ3VhZ2VTZXJ2aWNlQ29tbWFuZCB7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVxdWVzdElucHV0IGV4dGVuZHMgS2VybmVsQ29tbWFuZCB7XHJcbiAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICBpc1Bhc3N3b3JkOiBib29sZWFuO1xyXG4gICAgcGFyYW1ldGVyTmFtZTogc3RyaW5nO1xyXG4gICAgcHJvbXB0OiBzdHJpbmc7XHJcbiAgICBzYXZlQXM6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSZXF1ZXN0SW5wdXRzIGV4dGVuZHMgS2VybmVsQ29tbWFuZCB7XHJcbiAgICBpbnB1dHM6IEFycmF5PElucHV0RGVzY3JpcHRpb24+O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJlcXVlc3RLZXJuZWxJbmZvIGV4dGVuZHMgS2VybmVsQ29tbWFuZCB7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVxdWVzdFNpZ25hdHVyZUhlbHAgZXh0ZW5kcyBMYW5ndWFnZVNlcnZpY2VDb21tYW5kIHtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSZXF1ZXN0VmFsdWUgZXh0ZW5kcyBLZXJuZWxDb21tYW5kIHtcclxuICAgIG1pbWVUeXBlOiBzdHJpbmc7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVxdWVzdFZhbHVlSW5mb3MgZXh0ZW5kcyBLZXJuZWxDb21tYW5kIHtcclxuICAgIG1pbWVUeXBlOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU2VuZEVkaXRhYmxlQ29kZSBleHRlbmRzIEtlcm5lbENvbW1hbmQge1xyXG4gICAgY29kZTogc3RyaW5nO1xyXG4gICAgaW5zZXJ0QXRQb3NpdGlvbj86IG51bWJlcjtcclxuICAgIGtlcm5lbE5hbWU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTZW5kVmFsdWUgZXh0ZW5kcyBLZXJuZWxDb21tYW5kIHtcclxuICAgIGZvcm1hdHRlZFZhbHVlOiBGb3JtYXR0ZWRWYWx1ZTtcclxuICAgIG5hbWU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTdWJtaXRDb2RlIGV4dGVuZHMgS2VybmVsQ29tbWFuZCB7XHJcbiAgICBjb2RlOiBzdHJpbmc7XHJcbiAgICBwYXJhbWV0ZXJzPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmc7IH07XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVXBkYXRlRGlzcGxheWVkVmFsdWUgZXh0ZW5kcyBLZXJuZWxDb21tYW5kIHtcclxuICAgIGZvcm1hdHRlZFZhbHVlOiBGb3JtYXR0ZWRWYWx1ZTtcclxuICAgIHZhbHVlSWQ6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBLZXJuZWxFdmVudCB7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRGlzcGxheUVsZW1lbnQgZXh0ZW5kcyBJbnRlcmFjdGl2ZURvY3VtZW50T3V0cHV0RWxlbWVudCB7XHJcbiAgICBkYXRhOiB7IFtrZXk6IHN0cmluZ106IGFueTsgfTtcclxuICAgIG1ldGFkYXRhOiB7IFtrZXk6IHN0cmluZ106IGFueTsgfTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJbnRlcmFjdGl2ZURvY3VtZW50T3V0cHV0RWxlbWVudCB7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmV0dXJuVmFsdWVFbGVtZW50IGV4dGVuZHMgSW50ZXJhY3RpdmVEb2N1bWVudE91dHB1dEVsZW1lbnQge1xyXG4gICAgZGF0YTogeyBba2V5OiBzdHJpbmddOiBhbnk7IH07XHJcbiAgICBleGVjdXRpb25PcmRlcjogbnVtYmVyO1xyXG4gICAgbWV0YWRhdGE6IHsgW2tleTogc3RyaW5nXTogYW55OyB9O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFRleHRFbGVtZW50IGV4dGVuZHMgSW50ZXJhY3RpdmVEb2N1bWVudE91dHB1dEVsZW1lbnQge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgdGV4dDogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEVycm9yRWxlbWVudCBleHRlbmRzIEludGVyYWN0aXZlRG9jdW1lbnRPdXRwdXRFbGVtZW50IHtcclxuICAgIGVycm9yTmFtZTogc3RyaW5nO1xyXG4gICAgZXJyb3JWYWx1ZTogc3RyaW5nO1xyXG4gICAgc3RhY2tUcmFjZTogQXJyYXk8c3RyaW5nPjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBEb2N1bWVudEtlcm5lbEluZm8ge1xyXG4gICAgYWxpYXNlczogQXJyYXk8c3RyaW5nPjtcclxuICAgIGxhbmd1YWdlTmFtZT86IHN0cmluZztcclxuICAgIG5hbWU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBOb3RlYm9va1BhcnNlUmVxdWVzdCBleHRlbmRzIE5vdGVib29rUGFyc2VPclNlcmlhbGl6ZVJlcXVlc3Qge1xyXG4gICAgcmF3RGF0YTogVWludDhBcnJheTtcclxuICAgIHR5cGU6IFJlcXVlc3RUeXBlO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE5vdGVib29rUGFyc2VPclNlcmlhbGl6ZVJlcXVlc3Qge1xyXG4gICAgZGVmYXVsdExhbmd1YWdlOiBzdHJpbmc7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgc2VyaWFsaXphdGlvblR5cGU6IERvY3VtZW50U2VyaWFsaXphdGlvblR5cGU7XHJcbiAgICB0eXBlOiBSZXF1ZXN0VHlwZTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBOb3RlYm9va1NlcmlhbGl6ZVJlcXVlc3QgZXh0ZW5kcyBOb3RlYm9va1BhcnNlT3JTZXJpYWxpemVSZXF1ZXN0IHtcclxuICAgIGRvY3VtZW50OiBJbnRlcmFjdGl2ZURvY3VtZW50O1xyXG4gICAgbmV3TGluZTogc3RyaW5nO1xyXG4gICAgdHlwZTogUmVxdWVzdFR5cGU7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTm90ZWJvb2tQYXJzZVJlc3BvbnNlIGV4dGVuZHMgTm90ZWJvb2tQYXJzZXJTZXJ2ZXJSZXNwb25zZSB7XHJcbiAgICBkb2N1bWVudDogSW50ZXJhY3RpdmVEb2N1bWVudDtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBOb3RlYm9va1BhcnNlclNlcnZlclJlc3BvbnNlIHtcclxuICAgIGlkOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTm90ZWJvb2tTZXJpYWxpemVSZXNwb25zZSBleHRlbmRzIE5vdGVib29rUGFyc2VyU2VydmVyUmVzcG9uc2Uge1xyXG4gICAgcmF3RGF0YTogVWludDhBcnJheTtcclxufVxyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEtlcm5lbCBldmVudHNcclxuXHJcbmV4cG9ydCBjb25zdCBBc3NlbWJseVByb2R1Y2VkVHlwZSA9IFwiQXNzZW1ibHlQcm9kdWNlZFwiO1xyXG5leHBvcnQgY29uc3QgQ29kZUV4cGFuc2lvbkluZm9zUHJvZHVjZWRUeXBlID0gXCJDb2RlRXhwYW5zaW9uSW5mb3NQcm9kdWNlZFwiO1xyXG5leHBvcnQgY29uc3QgQ29kZVN1Ym1pc3Npb25SZWNlaXZlZFR5cGUgPSBcIkNvZGVTdWJtaXNzaW9uUmVjZWl2ZWRcIjtcclxuZXhwb3J0IGNvbnN0IENvbW1hbmRGYWlsZWRUeXBlID0gXCJDb21tYW5kRmFpbGVkXCI7XHJcbmV4cG9ydCBjb25zdCBDb21tYW5kU3VjY2VlZGVkVHlwZSA9IFwiQ29tbWFuZFN1Y2NlZWRlZFwiO1xyXG5leHBvcnQgY29uc3QgQ29tcGxldGVDb2RlU3VibWlzc2lvblJlY2VpdmVkVHlwZSA9IFwiQ29tcGxldGVDb2RlU3VibWlzc2lvblJlY2VpdmVkXCI7XHJcbmV4cG9ydCBjb25zdCBDb21wbGV0aW9uc1Byb2R1Y2VkVHlwZSA9IFwiQ29tcGxldGlvbnNQcm9kdWNlZFwiO1xyXG5leHBvcnQgY29uc3QgRGlhZ25vc3RpY3NQcm9kdWNlZFR5cGUgPSBcIkRpYWdub3N0aWNzUHJvZHVjZWRcIjtcclxuZXhwb3J0IGNvbnN0IERpc3BsYXllZFZhbHVlUHJvZHVjZWRUeXBlID0gXCJEaXNwbGF5ZWRWYWx1ZVByb2R1Y2VkXCI7XHJcbmV4cG9ydCBjb25zdCBEaXNwbGF5ZWRWYWx1ZVVwZGF0ZWRUeXBlID0gXCJEaXNwbGF5ZWRWYWx1ZVVwZGF0ZWRcIjtcclxuZXhwb3J0IGNvbnN0IERvY3VtZW50T3BlbmVkVHlwZSA9IFwiRG9jdW1lbnRPcGVuZWRcIjtcclxuZXhwb3J0IGNvbnN0IEVycm9yUHJvZHVjZWRUeXBlID0gXCJFcnJvclByb2R1Y2VkXCI7XHJcbmV4cG9ydCBjb25zdCBIb3ZlclRleHRQcm9kdWNlZFR5cGUgPSBcIkhvdmVyVGV4dFByb2R1Y2VkXCI7XHJcbmV4cG9ydCBjb25zdCBJbmNvbXBsZXRlQ29kZVN1Ym1pc3Npb25SZWNlaXZlZFR5cGUgPSBcIkluY29tcGxldGVDb2RlU3VibWlzc2lvblJlY2VpdmVkXCI7XHJcbmV4cG9ydCBjb25zdCBJbnB1dFByb2R1Y2VkVHlwZSA9IFwiSW5wdXRQcm9kdWNlZFwiO1xyXG5leHBvcnQgY29uc3QgSW5wdXRzUHJvZHVjZWRUeXBlID0gXCJJbnB1dHNQcm9kdWNlZFwiO1xyXG5leHBvcnQgY29uc3QgS2VybmVsRXh0ZW5zaW9uTG9hZGVkVHlwZSA9IFwiS2VybmVsRXh0ZW5zaW9uTG9hZGVkXCI7XHJcbmV4cG9ydCBjb25zdCBLZXJuZWxJbmZvUHJvZHVjZWRUeXBlID0gXCJLZXJuZWxJbmZvUHJvZHVjZWRcIjtcclxuZXhwb3J0IGNvbnN0IEtlcm5lbFJlYWR5VHlwZSA9IFwiS2VybmVsUmVhZHlcIjtcclxuZXhwb3J0IGNvbnN0IFBhY2thZ2VBZGRlZFR5cGUgPSBcIlBhY2thZ2VBZGRlZFwiO1xyXG5leHBvcnQgY29uc3QgUHJvamVjdE9wZW5lZFR5cGUgPSBcIlByb2plY3RPcGVuZWRcIjtcclxuZXhwb3J0IGNvbnN0IFJldHVyblZhbHVlUHJvZHVjZWRUeXBlID0gXCJSZXR1cm5WYWx1ZVByb2R1Y2VkXCI7XHJcbmV4cG9ydCBjb25zdCBTaWduYXR1cmVIZWxwUHJvZHVjZWRUeXBlID0gXCJTaWduYXR1cmVIZWxwUHJvZHVjZWRcIjtcclxuZXhwb3J0IGNvbnN0IFN0YW5kYXJkRXJyb3JWYWx1ZVByb2R1Y2VkVHlwZSA9IFwiU3RhbmRhcmRFcnJvclZhbHVlUHJvZHVjZWRcIjtcclxuZXhwb3J0IGNvbnN0IFN0YW5kYXJkT3V0cHV0VmFsdWVQcm9kdWNlZFR5cGUgPSBcIlN0YW5kYXJkT3V0cHV0VmFsdWVQcm9kdWNlZFwiO1xyXG5leHBvcnQgY29uc3QgVmFsdWVJbmZvc1Byb2R1Y2VkVHlwZSA9IFwiVmFsdWVJbmZvc1Byb2R1Y2VkXCI7XHJcbmV4cG9ydCBjb25zdCBWYWx1ZVByb2R1Y2VkVHlwZSA9IFwiVmFsdWVQcm9kdWNlZFwiO1xyXG5cclxuZXhwb3J0IHR5cGUgS2VybmVsRXZlbnRUeXBlID1cclxuICAgICAgdHlwZW9mIEFzc2VtYmx5UHJvZHVjZWRUeXBlXHJcbiAgICB8IHR5cGVvZiBDb2RlRXhwYW5zaW9uSW5mb3NQcm9kdWNlZFR5cGVcclxuICAgIHwgdHlwZW9mIENvZGVTdWJtaXNzaW9uUmVjZWl2ZWRUeXBlXHJcbiAgICB8IHR5cGVvZiBDb21tYW5kRmFpbGVkVHlwZVxyXG4gICAgfCB0eXBlb2YgQ29tbWFuZFN1Y2NlZWRlZFR5cGVcclxuICAgIHwgdHlwZW9mIENvbXBsZXRlQ29kZVN1Ym1pc3Npb25SZWNlaXZlZFR5cGVcclxuICAgIHwgdHlwZW9mIENvbXBsZXRpb25zUHJvZHVjZWRUeXBlXHJcbiAgICB8IHR5cGVvZiBEaWFnbm9zdGljc1Byb2R1Y2VkVHlwZVxyXG4gICAgfCB0eXBlb2YgRGlzcGxheWVkVmFsdWVQcm9kdWNlZFR5cGVcclxuICAgIHwgdHlwZW9mIERpc3BsYXllZFZhbHVlVXBkYXRlZFR5cGVcclxuICAgIHwgdHlwZW9mIERvY3VtZW50T3BlbmVkVHlwZVxyXG4gICAgfCB0eXBlb2YgRXJyb3JQcm9kdWNlZFR5cGVcclxuICAgIHwgdHlwZW9mIEhvdmVyVGV4dFByb2R1Y2VkVHlwZVxyXG4gICAgfCB0eXBlb2YgSW5jb21wbGV0ZUNvZGVTdWJtaXNzaW9uUmVjZWl2ZWRUeXBlXHJcbiAgICB8IHR5cGVvZiBJbnB1dFByb2R1Y2VkVHlwZVxyXG4gICAgfCB0eXBlb2YgSW5wdXRzUHJvZHVjZWRUeXBlXHJcbiAgICB8IHR5cGVvZiBLZXJuZWxFeHRlbnNpb25Mb2FkZWRUeXBlXHJcbiAgICB8IHR5cGVvZiBLZXJuZWxJbmZvUHJvZHVjZWRUeXBlXHJcbiAgICB8IHR5cGVvZiBLZXJuZWxSZWFkeVR5cGVcclxuICAgIHwgdHlwZW9mIFBhY2thZ2VBZGRlZFR5cGVcclxuICAgIHwgdHlwZW9mIFByb2plY3RPcGVuZWRUeXBlXHJcbiAgICB8IHR5cGVvZiBSZXR1cm5WYWx1ZVByb2R1Y2VkVHlwZVxyXG4gICAgfCB0eXBlb2YgU2lnbmF0dXJlSGVscFByb2R1Y2VkVHlwZVxyXG4gICAgfCB0eXBlb2YgU3RhbmRhcmRFcnJvclZhbHVlUHJvZHVjZWRUeXBlXHJcbiAgICB8IHR5cGVvZiBTdGFuZGFyZE91dHB1dFZhbHVlUHJvZHVjZWRUeXBlXHJcbiAgICB8IHR5cGVvZiBWYWx1ZUluZm9zUHJvZHVjZWRUeXBlXHJcbiAgICB8IHR5cGVvZiBWYWx1ZVByb2R1Y2VkVHlwZTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQXNzZW1ibHlQcm9kdWNlZCBleHRlbmRzIEtlcm5lbEV2ZW50IHtcclxuICAgIGFzc2VtYmx5OiBCYXNlNjRFbmNvZGVkQXNzZW1ibHk7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ29kZUV4cGFuc2lvbkluZm9zUHJvZHVjZWQgZXh0ZW5kcyBLZXJuZWxFdmVudCB7XHJcbiAgICBjb2RlRXhwYW5zaW9uSW5mb3M6IEFycmF5PENvZGVFeHBhbnNpb25JbmZvPjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDb2RlU3VibWlzc2lvblJlY2VpdmVkIGV4dGVuZHMgS2VybmVsRXZlbnQge1xyXG4gICAgY29kZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENvbW1hbmRGYWlsZWQgZXh0ZW5kcyBLZXJuZWxDb21tYW5kQ29tcGxldGlvbkV2ZW50IHtcclxuICAgIG1lc3NhZ2U6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBLZXJuZWxDb21tYW5kQ29tcGxldGlvbkV2ZW50IGV4dGVuZHMgS2VybmVsRXZlbnQge1xyXG4gICAgZXhlY3V0aW9uT3JkZXI/OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ29tbWFuZFN1Y2NlZWRlZCBleHRlbmRzIEtlcm5lbENvbW1hbmRDb21wbGV0aW9uRXZlbnQge1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENvbXBsZXRlQ29kZVN1Ym1pc3Npb25SZWNlaXZlZCBleHRlbmRzIEtlcm5lbEV2ZW50IHtcclxuICAgIGNvZGU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDb21wbGV0aW9uc1Byb2R1Y2VkIGV4dGVuZHMgS2VybmVsRXZlbnQge1xyXG4gICAgY29tcGxldGlvbnM6IEFycmF5PENvbXBsZXRpb25JdGVtPjtcclxuICAgIGxpbmVQb3NpdGlvblNwYW4/OiBMaW5lUG9zaXRpb25TcGFuO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERpYWdub3N0aWNzUHJvZHVjZWQgZXh0ZW5kcyBLZXJuZWxFdmVudCB7XHJcbiAgICBkaWFnbm9zdGljczogQXJyYXk8RGlhZ25vc3RpYz47XHJcbiAgICBmb3JtYXR0ZWREaWFnbm9zdGljczogQXJyYXk8Rm9ybWF0dGVkVmFsdWU+O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERpc3BsYXllZFZhbHVlUHJvZHVjZWQgZXh0ZW5kcyBEaXNwbGF5RXZlbnQge1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERpc3BsYXlFdmVudCBleHRlbmRzIEtlcm5lbEV2ZW50IHtcclxuICAgIGZvcm1hdHRlZFZhbHVlczogQXJyYXk8Rm9ybWF0dGVkVmFsdWU+O1xyXG4gICAgdmFsdWVJZD86IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBEaXNwbGF5ZWRWYWx1ZVVwZGF0ZWQgZXh0ZW5kcyBEaXNwbGF5RXZlbnQge1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERvY3VtZW50T3BlbmVkIGV4dGVuZHMgS2VybmVsRXZlbnQge1xyXG4gICAgY29udGVudDogc3RyaW5nO1xyXG4gICAgcmVnaW9uTmFtZT86IHN0cmluZztcclxuICAgIHJlbGF0aXZlRmlsZVBhdGg6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBFcnJvclByb2R1Y2VkIGV4dGVuZHMgRGlzcGxheUV2ZW50IHtcclxuICAgIG1lc3NhZ2U6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBIb3ZlclRleHRQcm9kdWNlZCBleHRlbmRzIEtlcm5lbEV2ZW50IHtcclxuICAgIGNvbnRlbnQ6IEFycmF5PEZvcm1hdHRlZFZhbHVlPjtcclxuICAgIGxpbmVQb3NpdGlvblNwYW4/OiBMaW5lUG9zaXRpb25TcGFuO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEluY29tcGxldGVDb2RlU3VibWlzc2lvblJlY2VpdmVkIGV4dGVuZHMgS2VybmVsRXZlbnQge1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElucHV0UHJvZHVjZWQgZXh0ZW5kcyBLZXJuZWxFdmVudCB7XHJcbiAgICB2YWx1ZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElucHV0c1Byb2R1Y2VkIGV4dGVuZHMgS2VybmVsRXZlbnQge1xyXG4gICAgdmFsdWVzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZzsgfTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBLZXJuZWxFeHRlbnNpb25Mb2FkZWQgZXh0ZW5kcyBLZXJuZWxFdmVudCB7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgS2VybmVsSW5mb1Byb2R1Y2VkIGV4dGVuZHMgS2VybmVsRXZlbnQge1xyXG4gICAga2VybmVsSW5mbzogS2VybmVsSW5mbztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBLZXJuZWxSZWFkeSBleHRlbmRzIEtlcm5lbEV2ZW50IHtcclxuICAgIGtlcm5lbEluZm9zOiBBcnJheTxLZXJuZWxJbmZvPjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQYWNrYWdlQWRkZWQgZXh0ZW5kcyBLZXJuZWxFdmVudCB7XHJcbiAgICBwYWNrYWdlUmVmZXJlbmNlOiBSZXNvbHZlZFBhY2thZ2VSZWZlcmVuY2U7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUHJvamVjdE9wZW5lZCBleHRlbmRzIEtlcm5lbEV2ZW50IHtcclxuICAgIHByb2plY3RJdGVtczogQXJyYXk8UHJvamVjdEl0ZW0+O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJldHVyblZhbHVlUHJvZHVjZWQgZXh0ZW5kcyBEaXNwbGF5RXZlbnQge1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNpZ25hdHVyZUhlbHBQcm9kdWNlZCBleHRlbmRzIEtlcm5lbEV2ZW50IHtcclxuICAgIGFjdGl2ZVBhcmFtZXRlckluZGV4OiBudW1iZXI7XHJcbiAgICBhY3RpdmVTaWduYXR1cmVJbmRleDogbnVtYmVyO1xyXG4gICAgc2lnbmF0dXJlczogQXJyYXk8U2lnbmF0dXJlSW5mb3JtYXRpb24+O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFN0YW5kYXJkRXJyb3JWYWx1ZVByb2R1Y2VkIGV4dGVuZHMgRGlzcGxheUV2ZW50IHtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTdGFuZGFyZE91dHB1dFZhbHVlUHJvZHVjZWQgZXh0ZW5kcyBEaXNwbGF5RXZlbnQge1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFZhbHVlSW5mb3NQcm9kdWNlZCBleHRlbmRzIEtlcm5lbEV2ZW50IHtcclxuICAgIHZhbHVlSW5mb3M6IEFycmF5PEtlcm5lbFZhbHVlSW5mbz47XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVmFsdWVQcm9kdWNlZCBleHRlbmRzIEtlcm5lbEV2ZW50IHtcclxuICAgIGZvcm1hdHRlZFZhbHVlOiBGb3JtYXR0ZWRWYWx1ZTtcclxuICAgIG5hbWU6IHN0cmluZztcclxufVxyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFJlcXVpcmVkIFR5cGVzXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEJhc2U2NEVuY29kZWRBc3NlbWJseSB7XHJcbiAgICB2YWx1ZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENvZGVFeHBhbnNpb25JbmZvIHtcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgICBraW5kOiBzdHJpbmc7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ29tcGxldGlvbkl0ZW0ge1xyXG4gICAgZGlzcGxheVRleHQ6IHN0cmluZztcclxuICAgIGRvY3VtZW50YXRpb246IHN0cmluZztcclxuICAgIGZpbHRlclRleHQ6IHN0cmluZztcclxuICAgIGluc2VydFRleHQ6IHN0cmluZztcclxuICAgIGluc2VydFRleHRGb3JtYXQ/OiBJbnNlcnRUZXh0Rm9ybWF0O1xyXG4gICAga2luZDogc3RyaW5nO1xyXG4gICAgc29ydFRleHQ6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGVudW0gSW5zZXJ0VGV4dEZvcm1hdCB7XHJcbiAgICBQbGFpblRleHQgPSBcInBsYWludGV4dFwiLFxyXG4gICAgU25pcHBldCA9IFwic25pcHBldFwiLFxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERpYWdub3N0aWMge1xyXG4gICAgY29kZTogc3RyaW5nO1xyXG4gICAgbGluZVBvc2l0aW9uU3BhbjogTGluZVBvc2l0aW9uU3BhbjtcclxuICAgIG1lc3NhZ2U6IHN0cmluZztcclxuICAgIHNldmVyaXR5OiBEaWFnbm9zdGljU2V2ZXJpdHk7XHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIERpYWdub3N0aWNTZXZlcml0eSB7XHJcbiAgICBIaWRkZW4gPSBcImhpZGRlblwiLFxyXG4gICAgSW5mbyA9IFwiaW5mb1wiLFxyXG4gICAgV2FybmluZyA9IFwid2FybmluZ1wiLFxyXG4gICAgRXJyb3IgPSBcImVycm9yXCIsXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTGluZVBvc2l0aW9uU3BhbiB7XHJcbiAgICBlbmQ6IExpbmVQb3NpdGlvbjtcclxuICAgIHN0YXJ0OiBMaW5lUG9zaXRpb247XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTGluZVBvc2l0aW9uIHtcclxuICAgIGNoYXJhY3RlcjogbnVtYmVyO1xyXG4gICAgbGluZTogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgZW51bSBEb2N1bWVudFNlcmlhbGl6YXRpb25UeXBlIHtcclxuICAgIERpYiA9IFwiZGliXCIsXHJcbiAgICBJcHluYiA9IFwiaXB5bmJcIixcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBGb3JtYXR0ZWRWYWx1ZSB7XHJcbiAgICBtaW1lVHlwZTogc3RyaW5nO1xyXG4gICAgc3VwcHJlc3NEaXNwbGF5OiBib29sZWFuO1xyXG4gICAgdmFsdWU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJbnB1dERlc2NyaXB0aW9uIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHByb21wdDogc3RyaW5nO1xyXG4gICAgc2F2ZUFzOiBzdHJpbmc7XHJcbiAgICB0eXBlOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSW50ZXJhY3RpdmVEb2N1bWVudCB7XHJcbiAgICBlbGVtZW50czogQXJyYXk8SW50ZXJhY3RpdmVEb2N1bWVudEVsZW1lbnQ+O1xyXG4gICAgbWV0YWRhdGE6IHsgW2tleTogc3RyaW5nXTogYW55OyB9O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEludGVyYWN0aXZlRG9jdW1lbnRFbGVtZW50IHtcclxuICAgIGNvbnRlbnRzOiBzdHJpbmc7XHJcbiAgICBleGVjdXRpb25PcmRlcjogbnVtYmVyO1xyXG4gICAgaWQ/OiBzdHJpbmc7XHJcbiAgICBrZXJuZWxOYW1lPzogc3RyaW5nO1xyXG4gICAgbWV0YWRhdGE/OiB7IFtrZXk6IHN0cmluZ106IGFueTsgfTtcclxuICAgIG91dHB1dHM6IEFycmF5PEludGVyYWN0aXZlRG9jdW1lbnRPdXRwdXRFbGVtZW50PjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBLZXJuZWxJbmZvIHtcclxuICAgIGFsaWFzZXM6IEFycmF5PHN0cmluZz47XHJcbiAgICBkZXNjcmlwdGlvbj86IHN0cmluZztcclxuICAgIGRpc3BsYXlOYW1lOiBzdHJpbmc7XHJcbiAgICBpc0NvbXBvc2l0ZTogYm9vbGVhbjtcclxuICAgIGlzUHJveHk6IGJvb2xlYW47XHJcbiAgICBsYW5ndWFnZU5hbWU/OiBzdHJpbmc7XHJcbiAgICBsYW5ndWFnZVZlcnNpb24/OiBzdHJpbmc7XHJcbiAgICBsb2NhbE5hbWU6IHN0cmluZztcclxuICAgIHJlbW90ZVVyaT86IHN0cmluZztcclxuICAgIHN1cHBvcnRlZEtlcm5lbENvbW1hbmRzOiBBcnJheTxLZXJuZWxDb21tYW5kSW5mbz47XHJcbiAgICB1cmk6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBLZXJuZWxDb21tYW5kSW5mbyB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgS2VybmVsVmFsdWVJbmZvIHtcclxuICAgIGZvcm1hdHRlZFZhbHVlOiBGb3JtYXR0ZWRWYWx1ZTtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHByZWZlcnJlZE1pbWVUeXBlczogQXJyYXk8c3RyaW5nPjtcclxuICAgIHR5cGVOYW1lOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUHJvamVjdCB7XHJcbiAgICBmaWxlczogQXJyYXk8UHJvamVjdEZpbGU+O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFByb2plY3RGaWxlIHtcclxuICAgIGNvbnRlbnQ6IHN0cmluZztcclxuICAgIHJlbGF0aXZlRmlsZVBhdGg6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQcm9qZWN0SXRlbSB7XHJcbiAgICByZWdpb25OYW1lczogQXJyYXk8c3RyaW5nPjtcclxuICAgIHJlZ2lvbnNDb250ZW50OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZzsgfTtcclxuICAgIHJlbGF0aXZlRmlsZVBhdGg6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGVudW0gUmVxdWVzdFR5cGUge1xyXG4gICAgUGFyc2UgPSBcInBhcnNlXCIsXHJcbiAgICBTZXJpYWxpemUgPSBcInNlcmlhbGl6ZVwiLFxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJlc29sdmVkUGFja2FnZVJlZmVyZW5jZSBleHRlbmRzIFBhY2thZ2VSZWZlcmVuY2Uge1xyXG4gICAgYXNzZW1ibHlQYXRoczogQXJyYXk8c3RyaW5nPjtcclxuICAgIHBhY2thZ2VSb290OiBzdHJpbmc7XHJcbiAgICBwcm9iaW5nUGF0aHM6IEFycmF5PHN0cmluZz47XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUGFja2FnZVJlZmVyZW5jZSB7XHJcbiAgICBpc1BhY2thZ2VWZXJzaW9uU3BlY2lmaWVkOiBib29sZWFuO1xyXG4gICAgcGFja2FnZU5hbWU6IHN0cmluZztcclxuICAgIHBhY2thZ2VWZXJzaW9uOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU2lnbmF0dXJlSW5mb3JtYXRpb24ge1xyXG4gICAgZG9jdW1lbnRhdGlvbjogRm9ybWF0dGVkVmFsdWU7XHJcbiAgICBsYWJlbDogc3RyaW5nO1xyXG4gICAgcGFyYW1ldGVyczogQXJyYXk8UGFyYW1ldGVySW5mb3JtYXRpb24+O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFBhcmFtZXRlckluZm9ybWF0aW9uIHtcclxuICAgIGRvY3VtZW50YXRpb246IEZvcm1hdHRlZFZhbHVlO1xyXG4gICAgbGFiZWw6IHN0cmluZztcclxufVxyXG5cclxuIiwiLy8gVW5pcXVlIElEIGNyZWF0aW9uIHJlcXVpcmVzIGEgaGlnaCBxdWFsaXR5IHJhbmRvbSAjIGdlbmVyYXRvci4gSW4gdGhlIGJyb3dzZXIgd2UgdGhlcmVmb3JlXG4vLyByZXF1aXJlIHRoZSBjcnlwdG8gQVBJIGFuZCBkbyBub3Qgc3VwcG9ydCBidWlsdC1pbiBmYWxsYmFjayB0byBsb3dlciBxdWFsaXR5IHJhbmRvbSBudW1iZXJcbi8vIGdlbmVyYXRvcnMgKGxpa2UgTWF0aC5yYW5kb20oKSkuXG52YXIgZ2V0UmFuZG9tVmFsdWVzO1xudmFyIHJuZHM4ID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcm5nKCkge1xuICAvLyBsYXp5IGxvYWQgc28gdGhhdCBlbnZpcm9ubWVudHMgdGhhdCBuZWVkIHRvIHBvbHlmaWxsIGhhdmUgYSBjaGFuY2UgdG8gZG8gc29cbiAgaWYgKCFnZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAvLyBnZXRSYW5kb21WYWx1ZXMgbmVlZHMgdG8gYmUgaW52b2tlZCBpbiBhIGNvbnRleHQgd2hlcmUgXCJ0aGlzXCIgaXMgYSBDcnlwdG8gaW1wbGVtZW50YXRpb24uIEFsc28sXG4gICAgLy8gZmluZCB0aGUgY29tcGxldGUgaW1wbGVtZW50YXRpb24gb2YgY3J5cHRvIChtc0NyeXB0bykgb24gSUUxMS5cbiAgICBnZXRSYW5kb21WYWx1ZXMgPSB0eXBlb2YgY3J5cHRvICE9PSAndW5kZWZpbmVkJyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChjcnlwdG8pIHx8IHR5cGVvZiBtc0NyeXB0byAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcyA9PT0gJ2Z1bmN0aW9uJyAmJiBtc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChtc0NyeXB0byk7XG5cbiAgICBpZiAoIWdldFJhbmRvbVZhbHVlcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKCkgbm90IHN1cHBvcnRlZC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91dWlkanMvdXVpZCNnZXRyYW5kb212YWx1ZXMtbm90LXN1cHBvcnRlZCcpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBnZXRSYW5kb21WYWx1ZXMocm5kczgpO1xufSIsImV4cG9ydCBkZWZhdWx0IC9eKD86WzAtOWEtZl17OH0tWzAtOWEtZl17NH0tWzEtNV1bMC05YS1mXXszfS1bODlhYl1bMC05YS1mXXszfS1bMC05YS1mXXsxMn18MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwKSQvaTsiLCJpbXBvcnQgUkVHRVggZnJvbSAnLi9yZWdleC5qcyc7XG5cbmZ1bmN0aW9uIHZhbGlkYXRlKHV1aWQpIHtcbiAgcmV0dXJuIHR5cGVvZiB1dWlkID09PSAnc3RyaW5nJyAmJiBSRUdFWC50ZXN0KHV1aWQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2YWxpZGF0ZTsiLCJpbXBvcnQgdmFsaWRhdGUgZnJvbSAnLi92YWxpZGF0ZS5qcyc7XG4vKipcbiAqIENvbnZlcnQgYXJyYXkgb2YgMTYgYnl0ZSB2YWx1ZXMgdG8gVVVJRCBzdHJpbmcgZm9ybWF0IG9mIHRoZSBmb3JtOlxuICogWFhYWFhYWFgtWFhYWC1YWFhYLVhYWFgtWFhYWFhYWFhYWFhYXG4gKi9cblxudmFyIGJ5dGVUb0hleCA9IFtdO1xuXG5mb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gIGJ5dGVUb0hleC5wdXNoKChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSkpO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnkoYXJyKSB7XG4gIHZhciBvZmZzZXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDA7XG4gIC8vIE5vdGU6IEJlIGNhcmVmdWwgZWRpdGluZyB0aGlzIGNvZGUhICBJdCdzIGJlZW4gdHVuZWQgZm9yIHBlcmZvcm1hbmNlXG4gIC8vIGFuZCB3b3JrcyBpbiB3YXlzIHlvdSBtYXkgbm90IGV4cGVjdC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91dWlkanMvdXVpZC9wdWxsLzQzNFxuICB2YXIgdXVpZCA9IChieXRlVG9IZXhbYXJyW29mZnNldCArIDBdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMV1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAyXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDNdXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA1XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDZdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgN11dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA4XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDldXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTBdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTFdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTJdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTNdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTRdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTVdXSkudG9Mb3dlckNhc2UoKTsgLy8gQ29uc2lzdGVuY3kgY2hlY2sgZm9yIHZhbGlkIFVVSUQuICBJZiB0aGlzIHRocm93cywgaXQncyBsaWtlbHkgZHVlIHRvIG9uZVxuICAvLyBvZiB0aGUgZm9sbG93aW5nOlxuICAvLyAtIE9uZSBvciBtb3JlIGlucHV0IGFycmF5IHZhbHVlcyBkb24ndCBtYXAgdG8gYSBoZXggb2N0ZXQgKGxlYWRpbmcgdG9cbiAgLy8gXCJ1bmRlZmluZWRcIiBpbiB0aGUgdXVpZClcbiAgLy8gLSBJbnZhbGlkIGlucHV0IHZhbHVlcyBmb3IgdGhlIFJGQyBgdmVyc2lvbmAgb3IgYHZhcmlhbnRgIGZpZWxkc1xuXG4gIGlmICghdmFsaWRhdGUodXVpZCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ1N0cmluZ2lmaWVkIFVVSUQgaXMgaW52YWxpZCcpO1xuICB9XG5cbiAgcmV0dXJuIHV1aWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0cmluZ2lmeTsiLCJpbXBvcnQgdmFsaWRhdGUgZnJvbSAnLi92YWxpZGF0ZS5qcyc7XG5cbmZ1bmN0aW9uIHBhcnNlKHV1aWQpIHtcbiAgaWYgKCF2YWxpZGF0ZSh1dWlkKSkge1xuICAgIHRocm93IFR5cGVFcnJvcignSW52YWxpZCBVVUlEJyk7XG4gIH1cblxuICB2YXIgdjtcbiAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KDE2KTsgLy8gUGFyc2UgIyMjIyMjIyMtLi4uLi0uLi4uLS4uLi4tLi4uLi4uLi4uLi4uXG5cbiAgYXJyWzBdID0gKHYgPSBwYXJzZUludCh1dWlkLnNsaWNlKDAsIDgpLCAxNikpID4+PiAyNDtcbiAgYXJyWzFdID0gdiA+Pj4gMTYgJiAweGZmO1xuICBhcnJbMl0gPSB2ID4+PiA4ICYgMHhmZjtcbiAgYXJyWzNdID0gdiAmIDB4ZmY7IC8vIFBhcnNlIC4uLi4uLi4uLSMjIyMtLi4uLi0uLi4uLS4uLi4uLi4uLi4uLlxuXG4gIGFycls0XSA9ICh2ID0gcGFyc2VJbnQodXVpZC5zbGljZSg5LCAxMyksIDE2KSkgPj4+IDg7XG4gIGFycls1XSA9IHYgJiAweGZmOyAvLyBQYXJzZSAuLi4uLi4uLi0uLi4uLSMjIyMtLi4uLi0uLi4uLi4uLi4uLi5cblxuICBhcnJbNl0gPSAodiA9IHBhcnNlSW50KHV1aWQuc2xpY2UoMTQsIDE4KSwgMTYpKSA+Pj4gODtcbiAgYXJyWzddID0gdiAmIDB4ZmY7IC8vIFBhcnNlIC4uLi4uLi4uLS4uLi4tLi4uLi0jIyMjLS4uLi4uLi4uLi4uLlxuXG4gIGFycls4XSA9ICh2ID0gcGFyc2VJbnQodXVpZC5zbGljZSgxOSwgMjMpLCAxNikpID4+PiA4O1xuICBhcnJbOV0gPSB2ICYgMHhmZjsgLy8gUGFyc2UgLi4uLi4uLi4tLi4uLi0uLi4uLS4uLi4tIyMjIyMjIyMjIyMjXG4gIC8vIChVc2UgXCIvXCIgdG8gYXZvaWQgMzItYml0IHRydW5jYXRpb24gd2hlbiBiaXQtc2hpZnRpbmcgaGlnaC1vcmRlciBieXRlcylcblxuICBhcnJbMTBdID0gKHYgPSBwYXJzZUludCh1dWlkLnNsaWNlKDI0LCAzNiksIDE2KSkgLyAweDEwMDAwMDAwMDAwICYgMHhmZjtcbiAgYXJyWzExXSA9IHYgLyAweDEwMDAwMDAwMCAmIDB4ZmY7XG4gIGFyclsxMl0gPSB2ID4+PiAyNCAmIDB4ZmY7XG4gIGFyclsxM10gPSB2ID4+PiAxNiAmIDB4ZmY7XG4gIGFyclsxNF0gPSB2ID4+PiA4ICYgMHhmZjtcbiAgYXJyWzE1XSA9IHYgJiAweGZmO1xuICByZXR1cm4gYXJyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBwYXJzZTsiLCJpbXBvcnQgcm5nIGZyb20gJy4vcm5nLmpzJztcbmltcG9ydCBzdHJpbmdpZnkgZnJvbSAnLi9zdHJpbmdpZnkuanMnO1xuXG5mdW5jdGlvbiB2NChvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIHJuZHMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgcm5nKSgpOyAvLyBQZXIgNC40LCBzZXQgYml0cyBmb3IgdmVyc2lvbiBhbmQgYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgXG5cbiAgcm5kc1s2XSA9IHJuZHNbNl0gJiAweDBmIHwgMHg0MDtcbiAgcm5kc1s4XSA9IHJuZHNbOF0gJiAweDNmIHwgMHg4MDsgLy8gQ29weSBieXRlcyB0byBidWZmZXIsIGlmIHByb3ZpZGVkXG5cbiAgaWYgKGJ1Zikge1xuICAgIG9mZnNldCA9IG9mZnNldCB8fCAwO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxNjsgKytpKSB7XG4gICAgICBidWZbb2Zmc2V0ICsgaV0gPSBybmRzW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBidWY7XG4gIH1cblxuICByZXR1cm4gc3RyaW5naWZ5KHJuZHMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2NDsiLCIvLyBDb3B5cmlnaHQgKGMpIC5ORVQgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIGZpbGUgaW4gdGhlIHByb2plY3Qgcm9vdCBmb3IgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uLlxyXG5cclxuaW1wb3J0ICogYXMgY29udHJhY3RzIGZyb20gXCIuL2NvbnRyYWN0c1wiO1xyXG5pbXBvcnQgeyBDb21tYW5kUm91dGluZ1NsaXAsIEV2ZW50Um91dGluZ1NsaXAgfSBmcm9tIFwiLi9yb3V0aW5nc2xpcFwiO1xyXG5leHBvcnQgKiBmcm9tIFwiLi9jb250cmFjdHNcIjtcclxuaW1wb3J0ICogYXMgdXVpZCBmcm9tIFwidXVpZFwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBEb2N1bWVudEtlcm5lbEluZm9Db2xsZWN0aW9uIHtcclxuICAgIGRlZmF1bHRLZXJuZWxOYW1lOiBzdHJpbmc7XHJcbiAgICBpdGVtczogY29udHJhY3RzLkRvY3VtZW50S2VybmVsSW5mb1tdO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEtlcm5lbEV2ZW50RW52ZWxvcGVNb2RlbCB7XHJcbiAgICBldmVudFR5cGU6IGNvbnRyYWN0cy5LZXJuZWxFdmVudFR5cGU7XHJcbiAgICBldmVudDogY29udHJhY3RzLktlcm5lbEV2ZW50O1xyXG4gICAgY29tbWFuZD86IEtlcm5lbENvbW1hbmRFbnZlbG9wZU1vZGVsO1xyXG4gICAgcm91dGluZ1NsaXA/OiBzdHJpbmdbXTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBLZXJuZWxDb21tYW5kRW52ZWxvcGVNb2RlbCB7XHJcbiAgICB0b2tlbj86IHN0cmluZztcclxuICAgIGNvbW1hbmRUeXBlOiBjb250cmFjdHMuS2VybmVsQ29tbWFuZFR5cGU7XHJcbiAgICBjb21tYW5kOiBjb250cmFjdHMuS2VybmVsQ29tbWFuZDtcclxuICAgIHJvdXRpbmdTbGlwPzogc3RyaW5nW107XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgS2VybmVsRXZlbnRFbnZlbG9wZU9ic2VydmVyIHtcclxuICAgIChldmVudEVudmVsb3BlOiBLZXJuZWxFdmVudEVudmVsb3BlKTogdm9pZDtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBLZXJuZWxDb21tYW5kRW52ZWxvcGVIYW5kbGVyIHtcclxuICAgIChldmVudEVudmVsb3BlOiBLZXJuZWxDb21tYW5kRW52ZWxvcGUpOiBQcm9taXNlPHZvaWQ+O1xyXG59XHJcblxyXG5mdW5jdGlvbiB0b0Jhc2U2NFN0cmluZyh2YWx1ZTogVWludDhBcnJheSk6IHN0cmluZyB7XHJcbiAgICBjb25zdCB3bmQgPSBnbG9iYWxUaGlzLndpbmRvdztcclxuICAgIGlmICh3bmQpIHtcclxuICAgICAgICByZXR1cm4gd25kLmJ0b2EoU3RyaW5nLmZyb21DaGFyQ29kZSguLi52YWx1ZSkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gQnVmZmVyLmZyb20odmFsdWUpLnRvU3RyaW5nKCdiYXNlNjQnKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgS2VybmVsQ29tbWFuZEVudmVsb3BlIHtcclxuXHJcbiAgICBwcml2YXRlIF9jaGlsZENvbW1hbmRDb3VudGVyOiBudW1iZXIgPSAxO1xyXG4gICAgcHJpdmF0ZSBfcm91dGluZ1NsaXA6IENvbW1hbmRSb3V0aW5nU2xpcCA9IG5ldyBDb21tYW5kUm91dGluZ1NsaXAoKTtcclxuICAgIHByaXZhdGUgX3Rva2VuPzogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfcGFyZW50Q29tbWFuZD86IEtlcm5lbENvbW1hbmRFbnZlbG9wZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwdWJsaWMgY29tbWFuZFR5cGU6IGNvbnRyYWN0cy5LZXJuZWxDb21tYW5kVHlwZSxcclxuICAgICAgICBwdWJsaWMgY29tbWFuZDogY29udHJhY3RzLktlcm5lbENvbW1hbmQpIHtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHJvdXRpbmdTbGlwKCk6IENvbW1hbmRSb3V0aW5nU2xpcCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JvdXRpbmdTbGlwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcGFyZW50Q29tbWFuZCgpOiBLZXJuZWxDb21tYW5kRW52ZWxvcGUgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnRDb21tYW5kO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaXNLZXJuZWxDb21tYW5kRW52ZWxvcGVNb2RlbChhcmc6IEtlcm5lbENvbW1hbmRFbnZlbG9wZSB8IEtlcm5lbENvbW1hbmRFbnZlbG9wZU1vZGVsKTogYXJnIGlzIEtlcm5lbENvbW1hbmRFbnZlbG9wZU1vZGVsIHtcclxuICAgICAgICByZXR1cm4gIShhcmcgYXMgYW55KS5nZXRPckNyZWF0ZVRva2VuO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRQYXJlbnQocGFyZW50Q29tbWFuZDogS2VybmVsQ29tbWFuZEVudmVsb3BlIHwgdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudENvbW1hbmQgJiYgdGhpcy5fcGFyZW50Q29tbWFuZCAhPT0gcGFyZW50Q29tbWFuZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQYXJlbnQgY2Fubm90IGJlIGNoYW5nZWQuXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCh0aGlzLl90b2tlbiAhPT0gdW5kZWZpbmVkICYmIHRoaXMuX3Rva2VuICE9PSBudWxsKSAmJlxyXG4gICAgICAgICAgICAocGFyZW50Q29tbWFuZD8uX3Rva2VuICE9PSB1bmRlZmluZWQgJiYgcGFyZW50Q29tbWFuZD8uX3Rva2VuICE9PSBudWxsKSAmJlxyXG4gICAgICAgICAgICBLZXJuZWxDb21tYW5kRW52ZWxvcGUuZ2V0Um9vdFRva2VuKHRoaXMuX3Rva2VuKSAhPT0gS2VybmVsQ29tbWFuZEVudmVsb3BlLmdldFJvb3RUb2tlbihwYXJlbnRDb21tYW5kLl90b2tlbilcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVG9rZW4gb2YgcGFyZW50ZWQgY29tbWFuZCBjYW5ub3QgYmUgY2hhbmdlZC5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnRDb21tYW5kID09PSBudWxsIHx8IHRoaXMuX3BhcmVudENvbW1hbmQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyB0b2RvOiBkbyB3ZSBuZWVkIHRvIG92ZXJyaWRlIHRoZSB0b2tlbj8gU2hvdWxkIHRoaXMgdGhyb3cgaWYgcGFyZW50aW5nIGhhcHBlbnMgYWZ0ZXIgdG9rZW4gaXMgc2V0P1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3Rva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdG9rZW4gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXJlbnRDb21tYW5kID0gcGFyZW50Q29tbWFuZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0T3JDcmVhdGVUb2tlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFyZUNvbW1hbmRzVGhlU2FtZShlbnZlbG9wZTE6IEtlcm5lbENvbW1hbmRFbnZlbG9wZSwgZW52ZWxvcGUyOiBLZXJuZWxDb21tYW5kRW52ZWxvcGUpOiBib29sZWFuIHtcclxuICAgICAgICBlbnZlbG9wZTE7Ly8/XHJcbiAgICAgICAgZW52ZWxvcGUyOy8vP1xyXG4gICAgICAgIGVudmVsb3BlMSA9PT0gZW52ZWxvcGUyOy8vP1xyXG5cclxuICAgICAgICAvLyByZWZlcmVuY2UgZXF1YWxpdHlcclxuICAgICAgICBpZiAoZW52ZWxvcGUxID09PSBlbnZlbG9wZTIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjb21tYW5kVHlwZSBlcXVhbGl0eVxyXG4gICAgICAgIGNvbnN0IHNhbWVDb21tYW5kVHlwZSA9IGVudmVsb3BlMT8uY29tbWFuZFR5cGUgPT09IGVudmVsb3BlMj8uY29tbWFuZFR5cGU7IC8vP1xyXG4gICAgICAgIGlmICghc2FtZUNvbW1hbmRUeXBlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGJvdGggbXVzdCBoYXZlIHRva2Vuc1xyXG4gICAgICAgIGlmICgoIWVudmVsb3BlMT8uX3Rva2VuKSB8fCAoIWVudmVsb3BlMj8uX3Rva2VuKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB0b2tlbiBlcXVhbGl0eVxyXG4gICAgICAgIGNvbnN0IHNhbWVUb2tlbiA9IGVudmVsb3BlMT8uX3Rva2VuID09PSBlbnZlbG9wZTI/Ll90b2tlbjsgLy8/XHJcbiAgICAgICAgaWYgKCFzYW1lVG9rZW4pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgX2NvdW50ZXIgPSAxO1xyXG4gICAgcHVibGljIGdldE9yQ3JlYXRlVG9rZW4oKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAodGhpcy5fdG9rZW4pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Rva2VuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudENvbW1hbmQpIHtcclxuICAgICAgICAgICAgdGhpcy5fdG9rZW4gPSBgJHt0aGlzLl9wYXJlbnRDb21tYW5kLmdldE9yQ3JlYXRlVG9rZW4oKX0uJHt0aGlzLl9wYXJlbnRDb21tYW5kLmdldE5leHRDaGlsZFRva2VuKCl9YDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Rva2VuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZ3VpZEJ5dGVzID0gdXVpZC5wYXJzZSh1dWlkLnY0KCkpO1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBuZXcgVWludDhBcnJheShndWlkQnl0ZXMpO1xyXG4gICAgICAgIHRoaXMuX3Rva2VuID0gdG9CYXNlNjRTdHJpbmcoZGF0YSk7XHJcblxyXG4gICAgICAgIC8vIHRoaXMuX3Rva2VuID0gYCR7S2VybmVsQ29tbWFuZEVudmVsb3BlLl9jb3VudGVyKyt9YDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Rva2VuO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRUb2tlbigpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICh0aGlzLl90b2tlbikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG9rZW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndG9rZW4gbm90IHNldCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc1NlbGZvckRlc2NlbmRhbnRPZihvdGhlckNvbW1hbmQ6IEtlcm5lbENvbW1hbmRFbnZlbG9wZSkge1xyXG4gICAgICAgIGNvbnN0IG90aGVyVG9rZW4gPSBvdGhlckNvbW1hbmQuX3Rva2VuO1xyXG4gICAgICAgIGNvbnN0IHRoaXNUb2tlbiA9IHRoaXMuX3Rva2VuO1xyXG4gICAgICAgIGlmICh0aGlzVG9rZW4gJiYgb3RoZXJUb2tlbikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpc1Rva2VuLnN0YXJ0c1dpdGgob3RoZXJUb2tlbiEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdib3RoIGNvbW1hbmRzIG11c3QgaGF2ZSB0b2tlbnMnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGFzU2FtZVJvb3RDb21tYW5kQXMob3RoZXJDb21tYW5kOiBLZXJuZWxDb21tYW5kRW52ZWxvcGUpIHtcclxuICAgICAgICBjb25zdCBvdGhlclRva2VuID0gb3RoZXJDb21tYW5kLl90b2tlbjtcclxuICAgICAgICBjb25zdCB0aGlzVG9rZW4gPSB0aGlzLl90b2tlbjtcclxuICAgICAgICBpZiAodGhpc1Rva2VuICYmIG90aGVyVG9rZW4pIHtcclxuICAgICAgICAgICAgY29uc3Qgb3RoZXJSb290VG9rZW4gPSBLZXJuZWxDb21tYW5kRW52ZWxvcGUuZ2V0Um9vdFRva2VuKG90aGVyVG9rZW4pO1xyXG4gICAgICAgICAgICBjb25zdCB0aGlzUm9vdFRva2VuID0gS2VybmVsQ29tbWFuZEVudmVsb3BlLmdldFJvb3RUb2tlbih0aGlzVG9rZW4pO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpc1Jvb3RUb2tlbiA9PT0gb3RoZXJSb290VG9rZW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYm90aCBjb21tYW5kcyBtdXN0IGhhdmUgdG9rZW5zJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRSb290VG9rZW4odG9rZW46IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgcGFydHMgPSB0b2tlbi5zcGxpdCgnLicpO1xyXG4gICAgICAgIHJldHVybiBwYXJ0c1swXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9Kc29uKCk6IEtlcm5lbENvbW1hbmRFbnZlbG9wZU1vZGVsIHtcclxuICAgICAgICBjb25zdCBtb2RlbDogS2VybmVsQ29tbWFuZEVudmVsb3BlTW9kZWwgPSB7XHJcbiAgICAgICAgICAgIGNvbW1hbmRUeXBlOiB0aGlzLmNvbW1hbmRUeXBlLFxyXG4gICAgICAgICAgICBjb21tYW5kOiB0aGlzLmNvbW1hbmQsXHJcbiAgICAgICAgICAgIHJvdXRpbmdTbGlwOiB0aGlzLl9yb3V0aW5nU2xpcC50b0FycmF5KCksXHJcbiAgICAgICAgICAgIHRva2VuOiB0aGlzLmdldE9yQ3JlYXRlVG9rZW4oKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBtb2RlbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGZyb21Kc29uKG1vZGVsOiBLZXJuZWxDb21tYW5kRW52ZWxvcGVNb2RlbCk6IEtlcm5lbENvbW1hbmRFbnZlbG9wZSB7XHJcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IG5ldyBLZXJuZWxDb21tYW5kRW52ZWxvcGUobW9kZWwuY29tbWFuZFR5cGUsIG1vZGVsLmNvbW1hbmQpO1xyXG4gICAgICAgIGNvbW1hbmQuX3JvdXRpbmdTbGlwID0gQ29tbWFuZFJvdXRpbmdTbGlwLmZyb21VcmlzKG1vZGVsLnJvdXRpbmdTbGlwIHx8IFtdKTtcclxuICAgICAgICBjb21tYW5kLl90b2tlbiA9IG1vZGVsLnRva2VuO1xyXG4gICAgICAgIHJldHVybiBjb21tYW5kO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbG9uZSgpOiBLZXJuZWxDb21tYW5kRW52ZWxvcGUge1xyXG4gICAgICAgIHJldHVybiBLZXJuZWxDb21tYW5kRW52ZWxvcGUuZnJvbUpzb24odGhpcy50b0pzb24oKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXROZXh0Q2hpbGRUb2tlbigpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jaGlsZENvbW1hbmRDb3VudGVyKys7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBLZXJuZWxFdmVudEVudmVsb3BlIHtcclxuICAgIHByaXZhdGUgX3JvdXRpbmdTbGlwOiBFdmVudFJvdXRpbmdTbGlwID0gbmV3IEV2ZW50Um91dGluZ1NsaXAoKTtcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHB1YmxpYyBldmVudFR5cGU6IGNvbnRyYWN0cy5LZXJuZWxFdmVudFR5cGUsXHJcbiAgICAgICAgcHVibGljIGV2ZW50OiBjb250cmFjdHMuS2VybmVsRXZlbnQsXHJcbiAgICAgICAgcHVibGljIGNvbW1hbmQ/OiBLZXJuZWxDb21tYW5kRW52ZWxvcGUpIHtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHJvdXRpbmdTbGlwKCk6IEV2ZW50Um91dGluZ1NsaXAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yb3V0aW5nU2xpcDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9Kc29uKCk6IEtlcm5lbEV2ZW50RW52ZWxvcGVNb2RlbCB7XHJcbiAgICAgICAgY29uc3QgbW9kZWw6IEtlcm5lbEV2ZW50RW52ZWxvcGVNb2RlbCA9IHtcclxuICAgICAgICAgICAgZXZlbnRUeXBlOiB0aGlzLmV2ZW50VHlwZSxcclxuICAgICAgICAgICAgZXZlbnQ6IHRoaXMuZXZlbnQsXHJcbiAgICAgICAgICAgIGNvbW1hbmQ6IHRoaXMuY29tbWFuZD8udG9Kc29uKCksXHJcbiAgICAgICAgICAgIHJvdXRpbmdTbGlwOiB0aGlzLl9yb3V0aW5nU2xpcC50b0FycmF5KClcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gbW9kZWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBmcm9tSnNvbihtb2RlbDogS2VybmVsRXZlbnRFbnZlbG9wZU1vZGVsKTogS2VybmVsRXZlbnRFbnZlbG9wZSB7XHJcbiAgICAgICAgY29uc3QgZXZlbnQgPSBuZXcgS2VybmVsRXZlbnRFbnZlbG9wZShcclxuICAgICAgICAgICAgbW9kZWwuZXZlbnRUeXBlLFxyXG4gICAgICAgICAgICBtb2RlbC5ldmVudCxcclxuICAgICAgICAgICAgbW9kZWwuY29tbWFuZCA/IEtlcm5lbENvbW1hbmRFbnZlbG9wZS5mcm9tSnNvbihtb2RlbC5jb21tYW5kKSA6IHVuZGVmaW5lZCk7XHJcbiAgICAgICAgZXZlbnQuX3JvdXRpbmdTbGlwID0gRXZlbnRSb3V0aW5nU2xpcC5mcm9tVXJpcyhtb2RlbC5yb3V0aW5nU2xpcCB8fCBbXVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgcmV0dXJuIGV2ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbG9uZSgpOiBLZXJuZWxFdmVudEVudmVsb3BlIHtcclxuICAgICAgICByZXR1cm4gS2VybmVsRXZlbnRFbnZlbG9wZS5mcm9tSnNvbih0aGlzLnRvSnNvbigpKTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pc0Z1bmN0aW9uLmpzLm1hcCIsImV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFcnJvckNsYXNzKGNyZWF0ZUltcGwpIHtcbiAgICB2YXIgX3N1cGVyID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgIEVycm9yLmNhbGwoaW5zdGFuY2UpO1xuICAgICAgICBpbnN0YW5jZS5zdGFjayA9IG5ldyBFcnJvcigpLnN0YWNrO1xuICAgIH07XG4gICAgdmFyIGN0b3JGdW5jID0gY3JlYXRlSW1wbChfc3VwZXIpO1xuICAgIGN0b3JGdW5jLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcbiAgICBjdG9yRnVuYy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yRnVuYztcbiAgICByZXR1cm4gY3RvckZ1bmM7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jcmVhdGVFcnJvckNsYXNzLmpzLm1hcCIsImltcG9ydCB7IGNyZWF0ZUVycm9yQ2xhc3MgfSBmcm9tICcuL2NyZWF0ZUVycm9yQ2xhc3MnO1xuZXhwb3J0IHZhciBVbnN1YnNjcmlwdGlvbkVycm9yID0gY3JlYXRlRXJyb3JDbGFzcyhmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIFVuc3Vic2NyaXB0aW9uRXJyb3JJbXBsKGVycm9ycykge1xuICAgICAgICBfc3VwZXIodGhpcyk7XG4gICAgICAgIHRoaXMubWVzc2FnZSA9IGVycm9yc1xuICAgICAgICAgICAgPyBlcnJvcnMubGVuZ3RoICsgXCIgZXJyb3JzIG9jY3VycmVkIGR1cmluZyB1bnN1YnNjcmlwdGlvbjpcXG5cIiArIGVycm9ycy5tYXAoZnVuY3Rpb24gKGVyciwgaSkgeyByZXR1cm4gaSArIDEgKyBcIikgXCIgKyBlcnIudG9TdHJpbmcoKTsgfSkuam9pbignXFxuICAnKVxuICAgICAgICAgICAgOiAnJztcbiAgICAgICAgdGhpcy5uYW1lID0gJ1Vuc3Vic2NyaXB0aW9uRXJyb3InO1xuICAgICAgICB0aGlzLmVycm9ycyA9IGVycm9ycztcbiAgICB9O1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1VbnN1YnNjcmlwdGlvbkVycm9yLmpzLm1hcCIsImV4cG9ydCBmdW5jdGlvbiBhcnJSZW1vdmUoYXJyLCBpdGVtKSB7XG4gICAgaWYgKGFycikge1xuICAgICAgICB2YXIgaW5kZXggPSBhcnIuaW5kZXhPZihpdGVtKTtcbiAgICAgICAgMCA8PSBpbmRleCAmJiBhcnIuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcnJSZW1vdmUuanMubWFwIiwiaW1wb3J0IHsgX19yZWFkLCBfX3NwcmVhZEFycmF5LCBfX3ZhbHVlcyB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vdXRpbC9pc0Z1bmN0aW9uJztcbmltcG9ydCB7IFVuc3Vic2NyaXB0aW9uRXJyb3IgfSBmcm9tICcuL3V0aWwvVW5zdWJzY3JpcHRpb25FcnJvcic7XG5pbXBvcnQgeyBhcnJSZW1vdmUgfSBmcm9tICcuL3V0aWwvYXJyUmVtb3ZlJztcbnZhciBTdWJzY3JpcHRpb24gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFN1YnNjcmlwdGlvbihpbml0aWFsVGVhcmRvd24pIHtcbiAgICAgICAgdGhpcy5pbml0aWFsVGVhcmRvd24gPSBpbml0aWFsVGVhcmRvd247XG4gICAgICAgIHRoaXMuY2xvc2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3BhcmVudGFnZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX2ZpbmFsaXplcnMgPSBudWxsO1xuICAgIH1cbiAgICBTdWJzY3JpcHRpb24ucHJvdG90eXBlLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZV8xLCBfYSwgZV8yLCBfYjtcbiAgICAgICAgdmFyIGVycm9ycztcbiAgICAgICAgaWYgKCF0aGlzLmNsb3NlZCkge1xuICAgICAgICAgICAgdGhpcy5jbG9zZWQgPSB0cnVlO1xuICAgICAgICAgICAgdmFyIF9wYXJlbnRhZ2UgPSB0aGlzLl9wYXJlbnRhZ2U7XG4gICAgICAgICAgICBpZiAoX3BhcmVudGFnZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BhcmVudGFnZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoX3BhcmVudGFnZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIF9wYXJlbnRhZ2VfMSA9IF9fdmFsdWVzKF9wYXJlbnRhZ2UpLCBfcGFyZW50YWdlXzFfMSA9IF9wYXJlbnRhZ2VfMS5uZXh0KCk7ICFfcGFyZW50YWdlXzFfMS5kb25lOyBfcGFyZW50YWdlXzFfMSA9IF9wYXJlbnRhZ2VfMS5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFyZW50XzEgPSBfcGFyZW50YWdlXzFfMS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRfMS5yZW1vdmUodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVfMV8xKSB7IGVfMSA9IHsgZXJyb3I6IGVfMV8xIH07IH1cbiAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfcGFyZW50YWdlXzFfMSAmJiAhX3BhcmVudGFnZV8xXzEuZG9uZSAmJiAoX2EgPSBfcGFyZW50YWdlXzEucmV0dXJuKSkgX2EuY2FsbChfcGFyZW50YWdlXzEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjsgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfcGFyZW50YWdlLnJlbW92ZSh0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaW5pdGlhbEZpbmFsaXplciA9IHRoaXMuaW5pdGlhbFRlYXJkb3duO1xuICAgICAgICAgICAgaWYgKGlzRnVuY3Rpb24oaW5pdGlhbEZpbmFsaXplcikpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpbml0aWFsRmluYWxpemVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9ycyA9IGUgaW5zdGFuY2VvZiBVbnN1YnNjcmlwdGlvbkVycm9yID8gZS5lcnJvcnMgOiBbZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIF9maW5hbGl6ZXJzID0gdGhpcy5fZmluYWxpemVycztcbiAgICAgICAgICAgIGlmIChfZmluYWxpemVycykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZpbmFsaXplcnMgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIF9maW5hbGl6ZXJzXzEgPSBfX3ZhbHVlcyhfZmluYWxpemVycyksIF9maW5hbGl6ZXJzXzFfMSA9IF9maW5hbGl6ZXJzXzEubmV4dCgpOyAhX2ZpbmFsaXplcnNfMV8xLmRvbmU7IF9maW5hbGl6ZXJzXzFfMSA9IF9maW5hbGl6ZXJzXzEubmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmluYWxpemVyID0gX2ZpbmFsaXplcnNfMV8xLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGVjRmluYWxpemVyKGZpbmFsaXplcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzID0gZXJyb3JzICE9PSBudWxsICYmIGVycm9ycyAhPT0gdm9pZCAwID8gZXJyb3JzIDogW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIFVuc3Vic2NyaXB0aW9uRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzID0gX19zcHJlYWRBcnJheShfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoZXJyb3JzKSksIF9fcmVhZChlcnIuZXJyb3JzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZV8yXzEpIHsgZV8yID0geyBlcnJvcjogZV8yXzEgfTsgfVxuICAgICAgICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9maW5hbGl6ZXJzXzFfMSAmJiAhX2ZpbmFsaXplcnNfMV8xLmRvbmUgJiYgKF9iID0gX2ZpbmFsaXplcnNfMS5yZXR1cm4pKSBfYi5jYWxsKF9maW5hbGl6ZXJzXzEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8yKSB0aHJvdyBlXzIuZXJyb3I7IH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXJyb3JzKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFVuc3Vic2NyaXB0aW9uRXJyb3IoZXJyb3JzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgU3Vic2NyaXB0aW9uLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodGVhcmRvd24pIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAodGVhcmRvd24gJiYgdGVhcmRvd24gIT09IHRoaXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgICAgICAgICAgIGV4ZWNGaW5hbGl6ZXIodGVhcmRvd24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRlYXJkb3duIGluc3RhbmNlb2YgU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZWFyZG93bi5jbG9zZWQgfHwgdGVhcmRvd24uX2hhc1BhcmVudCh0aGlzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRlYXJkb3duLl9hZGRQYXJlbnQodGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICh0aGlzLl9maW5hbGl6ZXJzID0gKF9hID0gdGhpcy5fZmluYWxpemVycykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogW10pLnB1c2godGVhcmRvd24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBTdWJzY3JpcHRpb24ucHJvdG90eXBlLl9oYXNQYXJlbnQgPSBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAgIHZhciBfcGFyZW50YWdlID0gdGhpcy5fcGFyZW50YWdlO1xuICAgICAgICByZXR1cm4gX3BhcmVudGFnZSA9PT0gcGFyZW50IHx8IChBcnJheS5pc0FycmF5KF9wYXJlbnRhZ2UpICYmIF9wYXJlbnRhZ2UuaW5jbHVkZXMocGFyZW50KSk7XG4gICAgfTtcbiAgICBTdWJzY3JpcHRpb24ucHJvdG90eXBlLl9hZGRQYXJlbnQgPSBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAgIHZhciBfcGFyZW50YWdlID0gdGhpcy5fcGFyZW50YWdlO1xuICAgICAgICB0aGlzLl9wYXJlbnRhZ2UgPSBBcnJheS5pc0FycmF5KF9wYXJlbnRhZ2UpID8gKF9wYXJlbnRhZ2UucHVzaChwYXJlbnQpLCBfcGFyZW50YWdlKSA6IF9wYXJlbnRhZ2UgPyBbX3BhcmVudGFnZSwgcGFyZW50XSA6IHBhcmVudDtcbiAgICB9O1xuICAgIFN1YnNjcmlwdGlvbi5wcm90b3R5cGUuX3JlbW92ZVBhcmVudCA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgdmFyIF9wYXJlbnRhZ2UgPSB0aGlzLl9wYXJlbnRhZ2U7XG4gICAgICAgIGlmIChfcGFyZW50YWdlID09PSBwYXJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudGFnZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShfcGFyZW50YWdlKSkge1xuICAgICAgICAgICAgYXJyUmVtb3ZlKF9wYXJlbnRhZ2UsIHBhcmVudCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN1YnNjcmlwdGlvbi5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKHRlYXJkb3duKSB7XG4gICAgICAgIHZhciBfZmluYWxpemVycyA9IHRoaXMuX2ZpbmFsaXplcnM7XG4gICAgICAgIF9maW5hbGl6ZXJzICYmIGFyclJlbW92ZShfZmluYWxpemVycywgdGVhcmRvd24pO1xuICAgICAgICBpZiAodGVhcmRvd24gaW5zdGFuY2VvZiBTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRlYXJkb3duLl9yZW1vdmVQYXJlbnQodGhpcyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN1YnNjcmlwdGlvbi5FTVBUWSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlbXB0eSA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgICAgZW1wdHkuY2xvc2VkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGVtcHR5O1xuICAgIH0pKCk7XG4gICAgcmV0dXJuIFN1YnNjcmlwdGlvbjtcbn0oKSk7XG5leHBvcnQgeyBTdWJzY3JpcHRpb24gfTtcbmV4cG9ydCB2YXIgRU1QVFlfU1VCU0NSSVBUSU9OID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3Vic2NyaXB0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuICh2YWx1ZSBpbnN0YW5jZW9mIFN1YnNjcmlwdGlvbiB8fFxuICAgICAgICAodmFsdWUgJiYgJ2Nsb3NlZCcgaW4gdmFsdWUgJiYgaXNGdW5jdGlvbih2YWx1ZS5yZW1vdmUpICYmIGlzRnVuY3Rpb24odmFsdWUuYWRkKSAmJiBpc0Z1bmN0aW9uKHZhbHVlLnVuc3Vic2NyaWJlKSkpO1xufVxuZnVuY3Rpb24gZXhlY0ZpbmFsaXplcihmaW5hbGl6ZXIpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihmaW5hbGl6ZXIpKSB7XG4gICAgICAgIGZpbmFsaXplcigpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZmluYWxpemVyLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U3Vic2NyaXB0aW9uLmpzLm1hcCIsImV4cG9ydCB2YXIgY29uZmlnID0ge1xuICAgIG9uVW5oYW5kbGVkRXJyb3I6IG51bGwsXG4gICAgb25TdG9wcGVkTm90aWZpY2F0aW9uOiBudWxsLFxuICAgIFByb21pc2U6IHVuZGVmaW5lZCxcbiAgICB1c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nOiBmYWxzZSxcbiAgICB1c2VEZXByZWNhdGVkTmV4dENvbnRleHQ6IGZhbHNlLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbmZpZy5qcy5tYXAiLCJpbXBvcnQgeyBfX3JlYWQsIF9fc3ByZWFkQXJyYXkgfSBmcm9tIFwidHNsaWJcIjtcbmV4cG9ydCB2YXIgdGltZW91dFByb3ZpZGVyID0ge1xuICAgIHNldFRpbWVvdXQ6IGZ1bmN0aW9uIChoYW5kbGVyLCB0aW1lb3V0KSB7XG4gICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMjsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBhcmdzW19pIC0gMl0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IHRpbWVvdXRQcm92aWRlci5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlID09PSBudWxsIHx8IGRlbGVnYXRlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkZWxlZ2F0ZS5zZXRUaW1lb3V0KSB7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGUuc2V0VGltZW91dC5hcHBseShkZWxlZ2F0ZSwgX19zcHJlYWRBcnJheShbaGFuZGxlciwgdGltZW91dF0sIF9fcmVhZChhcmdzKSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0LmFwcGx5KHZvaWQgMCwgX19zcHJlYWRBcnJheShbaGFuZGxlciwgdGltZW91dF0sIF9fcmVhZChhcmdzKSkpO1xuICAgIH0sXG4gICAgY2xlYXJUaW1lb3V0OiBmdW5jdGlvbiAoaGFuZGxlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IHRpbWVvdXRQcm92aWRlci5kZWxlZ2F0ZTtcbiAgICAgICAgcmV0dXJuICgoZGVsZWdhdGUgPT09IG51bGwgfHwgZGVsZWdhdGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGRlbGVnYXRlLmNsZWFyVGltZW91dCkgfHwgY2xlYXJUaW1lb3V0KShoYW5kbGUpO1xuICAgIH0sXG4gICAgZGVsZWdhdGU6IHVuZGVmaW5lZCxcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aW1lb3V0UHJvdmlkZXIuanMubWFwIiwiaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7IHRpbWVvdXRQcm92aWRlciB9IGZyb20gJy4uL3NjaGVkdWxlci90aW1lb3V0UHJvdmlkZXInO1xuZXhwb3J0IGZ1bmN0aW9uIHJlcG9ydFVuaGFuZGxlZEVycm9yKGVycikge1xuICAgIHRpbWVvdXRQcm92aWRlci5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG9uVW5oYW5kbGVkRXJyb3IgPSBjb25maWcub25VbmhhbmRsZWRFcnJvcjtcbiAgICAgICAgaWYgKG9uVW5oYW5kbGVkRXJyb3IpIHtcbiAgICAgICAgICAgIG9uVW5oYW5kbGVkRXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVwb3J0VW5oYW5kbGVkRXJyb3IuanMubWFwIiwiZXhwb3J0IGZ1bmN0aW9uIG5vb3AoKSB7IH1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW5vb3AuanMubWFwIiwiaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcbnZhciBjb250ZXh0ID0gbnVsbDtcbmV4cG9ydCBmdW5jdGlvbiBlcnJvckNvbnRleHQoY2IpIHtcbiAgICBpZiAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgICAgdmFyIGlzUm9vdCA9ICFjb250ZXh0O1xuICAgICAgICBpZiAoaXNSb290KSB7XG4gICAgICAgICAgICBjb250ZXh0ID0geyBlcnJvclRocm93bjogZmFsc2UsIGVycm9yOiBudWxsIH07XG4gICAgICAgIH1cbiAgICAgICAgY2IoKTtcbiAgICAgICAgaWYgKGlzUm9vdCkge1xuICAgICAgICAgICAgdmFyIF9hID0gY29udGV4dCwgZXJyb3JUaHJvd24gPSBfYS5lcnJvclRocm93biwgZXJyb3IgPSBfYS5lcnJvcjtcbiAgICAgICAgICAgIGNvbnRleHQgPSBudWxsO1xuICAgICAgICAgICAgaWYgKGVycm9yVGhyb3duKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNiKCk7XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGNhcHR1cmVFcnJvcihlcnIpIHtcbiAgICBpZiAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcgJiYgY29udGV4dCkge1xuICAgICAgICBjb250ZXh0LmVycm9yVGhyb3duID0gdHJ1ZTtcbiAgICAgICAgY29udGV4dC5lcnJvciA9IGVycjtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1lcnJvckNvbnRleHQuanMubWFwIiwiaW1wb3J0IHsgX19leHRlbmRzIH0gZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi91dGlsL2lzRnVuY3Rpb24nO1xuaW1wb3J0IHsgaXNTdWJzY3JpcHRpb24sIFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IHJlcG9ydFVuaGFuZGxlZEVycm9yIH0gZnJvbSAnLi91dGlsL3JlcG9ydFVuaGFuZGxlZEVycm9yJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuL3V0aWwvbm9vcCc7XG5pbXBvcnQgeyBuZXh0Tm90aWZpY2F0aW9uLCBlcnJvck5vdGlmaWNhdGlvbiwgQ09NUExFVEVfTk9USUZJQ0FUSU9OIH0gZnJvbSAnLi9Ob3RpZmljYXRpb25GYWN0b3JpZXMnO1xuaW1wb3J0IHsgdGltZW91dFByb3ZpZGVyIH0gZnJvbSAnLi9zY2hlZHVsZXIvdGltZW91dFByb3ZpZGVyJztcbmltcG9ydCB7IGNhcHR1cmVFcnJvciB9IGZyb20gJy4vdXRpbC9lcnJvckNvbnRleHQnO1xudmFyIFN1YnNjcmliZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhTdWJzY3JpYmVyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFN1YnNjcmliZXIoZGVzdGluYXRpb24pIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuaXNTdG9wcGVkID0gZmFsc2U7XG4gICAgICAgIGlmIChkZXN0aW5hdGlvbikge1xuICAgICAgICAgICAgX3RoaXMuZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbjtcbiAgICAgICAgICAgIGlmIChpc1N1YnNjcmlwdGlvbihkZXN0aW5hdGlvbikpIHtcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbi5hZGQoX3RoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgX3RoaXMuZGVzdGluYXRpb24gPSBFTVBUWV9PQlNFUlZFUjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIFN1YnNjcmliZXIuY3JlYXRlID0gZnVuY3Rpb24gKG5leHQsIGVycm9yLCBjb21wbGV0ZSkge1xuICAgICAgICByZXR1cm4gbmV3IFNhZmVTdWJzY3JpYmVyKG5leHQsIGVycm9yLCBjb21wbGV0ZSk7XG4gICAgfTtcbiAgICBTdWJzY3JpYmVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgICAgICAgaGFuZGxlU3RvcHBlZE5vdGlmaWNhdGlvbihuZXh0Tm90aWZpY2F0aW9uKHZhbHVlKSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9uZXh0KHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU3Vic2NyaWJlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGlmICh0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgICAgICAgaGFuZGxlU3RvcHBlZE5vdGlmaWNhdGlvbihlcnJvck5vdGlmaWNhdGlvbihlcnIpLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX2Vycm9yKGVycik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN1YnNjcmliZXIucHJvdG90eXBlLmNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgICAgICAgIGhhbmRsZVN0b3BwZWROb3RpZmljYXRpb24oQ09NUExFVEVfTk9USUZJQ0FUSU9OLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX2NvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN1YnNjcmliZXIucHJvdG90eXBlLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICAgICAgICBfc3VwZXIucHJvdG90eXBlLnVuc3Vic2NyaWJlLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU3Vic2NyaWJlci5wcm90b3R5cGUuX25leHQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHZhbHVlKTtcbiAgICB9O1xuICAgIFN1YnNjcmliZXIucHJvdG90eXBlLl9lcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU3Vic2NyaWJlci5wcm90b3R5cGUuX2NvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gU3Vic2NyaWJlcjtcbn0oU3Vic2NyaXB0aW9uKSk7XG5leHBvcnQgeyBTdWJzY3JpYmVyIH07XG52YXIgX2JpbmQgPSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZDtcbmZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcbiAgICByZXR1cm4gX2JpbmQuY2FsbChmbiwgdGhpc0FyZyk7XG59XG52YXIgQ29uc3VtZXJPYnNlcnZlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29uc3VtZXJPYnNlcnZlcihwYXJ0aWFsT2JzZXJ2ZXIpIHtcbiAgICAgICAgdGhpcy5wYXJ0aWFsT2JzZXJ2ZXIgPSBwYXJ0aWFsT2JzZXJ2ZXI7XG4gICAgfVxuICAgIENvbnN1bWVyT2JzZXJ2ZXIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIHBhcnRpYWxPYnNlcnZlciA9IHRoaXMucGFydGlhbE9ic2VydmVyO1xuICAgICAgICBpZiAocGFydGlhbE9ic2VydmVyLm5leHQpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcGFydGlhbE9ic2VydmVyLm5leHQodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlVW5oYW5kbGVkRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBDb25zdW1lck9ic2VydmVyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgdmFyIHBhcnRpYWxPYnNlcnZlciA9IHRoaXMucGFydGlhbE9ic2VydmVyO1xuICAgICAgICBpZiAocGFydGlhbE9ic2VydmVyLmVycm9yKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHBhcnRpYWxPYnNlcnZlci5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlVW5oYW5kbGVkRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaGFuZGxlVW5oYW5kbGVkRXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQ29uc3VtZXJPYnNlcnZlci5wcm90b3R5cGUuY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwYXJ0aWFsT2JzZXJ2ZXIgPSB0aGlzLnBhcnRpYWxPYnNlcnZlcjtcbiAgICAgICAgaWYgKHBhcnRpYWxPYnNlcnZlci5jb21wbGV0ZSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBwYXJ0aWFsT2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGhhbmRsZVVuaGFuZGxlZEVycm9yKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIENvbnN1bWVyT2JzZXJ2ZXI7XG59KCkpO1xudmFyIFNhZmVTdWJzY3JpYmVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU2FmZVN1YnNjcmliZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU2FmZVN1YnNjcmliZXIob2JzZXJ2ZXJPck5leHQsIGVycm9yLCBjb21wbGV0ZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICB2YXIgcGFydGlhbE9ic2VydmVyO1xuICAgICAgICBpZiAoaXNGdW5jdGlvbihvYnNlcnZlck9yTmV4dCkgfHwgIW9ic2VydmVyT3JOZXh0KSB7XG4gICAgICAgICAgICBwYXJ0aWFsT2JzZXJ2ZXIgPSB7XG4gICAgICAgICAgICAgICAgbmV4dDogKG9ic2VydmVyT3JOZXh0ICE9PSBudWxsICYmIG9ic2VydmVyT3JOZXh0ICE9PSB2b2lkIDAgPyBvYnNlcnZlck9yTmV4dCA6IHVuZGVmaW5lZCksXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yICE9PSBudWxsICYmIGVycm9yICE9PSB2b2lkIDAgPyBlcnJvciA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogY29tcGxldGUgIT09IG51bGwgJiYgY29tcGxldGUgIT09IHZvaWQgMCA/IGNvbXBsZXRlIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBjb250ZXh0XzE7XG4gICAgICAgICAgICBpZiAoX3RoaXMgJiYgY29uZmlnLnVzZURlcHJlY2F0ZWROZXh0Q29udGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnRleHRfMSA9IE9iamVjdC5jcmVhdGUob2JzZXJ2ZXJPck5leHQpO1xuICAgICAgICAgICAgICAgIGNvbnRleHRfMS51bnN1YnNjcmliZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLnVuc3Vic2NyaWJlKCk7IH07XG4gICAgICAgICAgICAgICAgcGFydGlhbE9ic2VydmVyID0ge1xuICAgICAgICAgICAgICAgICAgICBuZXh0OiBvYnNlcnZlck9yTmV4dC5uZXh0ICYmIGJpbmQob2JzZXJ2ZXJPck5leHQubmV4dCwgY29udGV4dF8xKSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IG9ic2VydmVyT3JOZXh0LmVycm9yICYmIGJpbmQob2JzZXJ2ZXJPck5leHQuZXJyb3IsIGNvbnRleHRfMSksXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBvYnNlcnZlck9yTmV4dC5jb21wbGV0ZSAmJiBiaW5kKG9ic2VydmVyT3JOZXh0LmNvbXBsZXRlLCBjb250ZXh0XzEpLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXJ0aWFsT2JzZXJ2ZXIgPSBvYnNlcnZlck9yTmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfdGhpcy5kZXN0aW5hdGlvbiA9IG5ldyBDb25zdW1lck9ic2VydmVyKHBhcnRpYWxPYnNlcnZlcik7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIFNhZmVTdWJzY3JpYmVyO1xufShTdWJzY3JpYmVyKSk7XG5leHBvcnQgeyBTYWZlU3Vic2NyaWJlciB9O1xuZnVuY3Rpb24gaGFuZGxlVW5oYW5kbGVkRXJyb3IoZXJyb3IpIHtcbiAgICBpZiAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgICAgY2FwdHVyZUVycm9yKGVycm9yKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJlcG9ydFVuaGFuZGxlZEVycm9yKGVycm9yKTtcbiAgICB9XG59XG5mdW5jdGlvbiBkZWZhdWx0RXJyb3JIYW5kbGVyKGVycikge1xuICAgIHRocm93IGVycjtcbn1cbmZ1bmN0aW9uIGhhbmRsZVN0b3BwZWROb3RpZmljYXRpb24obm90aWZpY2F0aW9uLCBzdWJzY3JpYmVyKSB7XG4gICAgdmFyIG9uU3RvcHBlZE5vdGlmaWNhdGlvbiA9IGNvbmZpZy5vblN0b3BwZWROb3RpZmljYXRpb247XG4gICAgb25TdG9wcGVkTm90aWZpY2F0aW9uICYmIHRpbWVvdXRQcm92aWRlci5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgcmV0dXJuIG9uU3RvcHBlZE5vdGlmaWNhdGlvbihub3RpZmljYXRpb24sIHN1YnNjcmliZXIpOyB9KTtcbn1cbmV4cG9ydCB2YXIgRU1QVFlfT0JTRVJWRVIgPSB7XG4gICAgY2xvc2VkOiB0cnVlLFxuICAgIG5leHQ6IG5vb3AsXG4gICAgZXJyb3I6IGRlZmF1bHRFcnJvckhhbmRsZXIsXG4gICAgY29tcGxldGU6IG5vb3AsXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U3Vic2NyaWJlci5qcy5tYXAiLCJleHBvcnQgdmFyIG9ic2VydmFibGUgPSAoZnVuY3Rpb24gKCkgeyByZXR1cm4gKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLm9ic2VydmFibGUpIHx8ICdAQG9ic2VydmFibGUnOyB9KSgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b2JzZXJ2YWJsZS5qcy5tYXAiLCJleHBvcnQgZnVuY3Rpb24gaWRlbnRpdHkoeCkge1xuICAgIHJldHVybiB4O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aWRlbnRpdHkuanMubWFwIiwiaW1wb3J0IHsgaWRlbnRpdHkgfSBmcm9tICcuL2lkZW50aXR5JztcbmV4cG9ydCBmdW5jdGlvbiBwaXBlKCkge1xuICAgIHZhciBmbnMgPSBbXTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICBmbnNbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgcmV0dXJuIHBpcGVGcm9tQXJyYXkoZm5zKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwaXBlRnJvbUFycmF5KGZucykge1xuICAgIGlmIChmbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBpZGVudGl0eTtcbiAgICB9XG4gICAgaWYgKGZucy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIGZuc1swXTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHBpcGVkKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBmbnMucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCBmbikgeyByZXR1cm4gZm4ocHJldik7IH0sIGlucHV0KTtcbiAgICB9O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGlwZS5qcy5tYXAiLCJpbXBvcnQgeyBTYWZlU3Vic2NyaWJlciwgU3Vic2NyaWJlciB9IGZyb20gJy4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBpc1N1YnNjcmlwdGlvbiB9IGZyb20gJy4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IG9ic2VydmFibGUgYXMgU3ltYm9sX29ic2VydmFibGUgfSBmcm9tICcuL3N5bWJvbC9vYnNlcnZhYmxlJztcbmltcG9ydCB7IHBpcGVGcm9tQXJyYXkgfSBmcm9tICcuL3V0aWwvcGlwZSc7XG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi91dGlsL2lzRnVuY3Rpb24nO1xuaW1wb3J0IHsgZXJyb3JDb250ZXh0IH0gZnJvbSAnLi91dGlsL2Vycm9yQ29udGV4dCc7XG52YXIgT2JzZXJ2YWJsZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gT2JzZXJ2YWJsZShzdWJzY3JpYmUpIHtcbiAgICAgICAgaWYgKHN1YnNjcmliZSkge1xuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlID0gc3Vic2NyaWJlO1xuICAgICAgICB9XG4gICAgfVxuICAgIE9ic2VydmFibGUucHJvdG90eXBlLmxpZnQgPSBmdW5jdGlvbiAob3BlcmF0b3IpIHtcbiAgICAgICAgdmFyIG9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZSgpO1xuICAgICAgICBvYnNlcnZhYmxlLnNvdXJjZSA9IHRoaXM7XG4gICAgICAgIG9ic2VydmFibGUub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGU7XG4gICAgfTtcbiAgICBPYnNlcnZhYmxlLnByb3RvdHlwZS5zdWJzY3JpYmUgPSBmdW5jdGlvbiAob2JzZXJ2ZXJPck5leHQsIGVycm9yLCBjb21wbGV0ZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgc3Vic2NyaWJlciA9IGlzU3Vic2NyaWJlcihvYnNlcnZlck9yTmV4dCkgPyBvYnNlcnZlck9yTmV4dCA6IG5ldyBTYWZlU3Vic2NyaWJlcihvYnNlcnZlck9yTmV4dCwgZXJyb3IsIGNvbXBsZXRlKTtcbiAgICAgICAgZXJyb3JDb250ZXh0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBfYSA9IF90aGlzLCBvcGVyYXRvciA9IF9hLm9wZXJhdG9yLCBzb3VyY2UgPSBfYS5zb3VyY2U7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmFkZChvcGVyYXRvclxuICAgICAgICAgICAgICAgID9cbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0b3IuY2FsbChzdWJzY3JpYmVyLCBzb3VyY2UpXG4gICAgICAgICAgICAgICAgOiBzb3VyY2VcbiAgICAgICAgICAgICAgICAgICAgP1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX3N1YnNjcmliZShzdWJzY3JpYmVyKVxuICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fdHJ5U3Vic2NyaWJlKHN1YnNjcmliZXIpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBzdWJzY3JpYmVyO1xuICAgIH07XG4gICAgT2JzZXJ2YWJsZS5wcm90b3R5cGUuX3RyeVN1YnNjcmliZSA9IGZ1bmN0aW9uIChzaW5rKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3Vic2NyaWJlKHNpbmspO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHNpbmsuZXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgT2JzZXJ2YWJsZS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChuZXh0LCBwcm9taXNlQ3Rvcikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBwcm9taXNlQ3RvciA9IGdldFByb21pc2VDdG9yKHByb21pc2VDdG9yKTtcbiAgICAgICAgcmV0dXJuIG5ldyBwcm9taXNlQ3RvcihmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICB2YXIgc3Vic2NyaWJlciA9IG5ldyBTYWZlU3Vic2NyaWJlcih7XG4gICAgICAgICAgICAgICAgbmV4dDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IHJlamVjdCxcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogcmVzb2x2ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgX3RoaXMuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE9ic2VydmFibGUucHJvdG90eXBlLl9zdWJzY3JpYmUgPSBmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiAoX2EgPSB0aGlzLnNvdXJjZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICB9O1xuICAgIE9ic2VydmFibGUucHJvdG90eXBlW1N5bWJvbF9vYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBPYnNlcnZhYmxlLnByb3RvdHlwZS5waXBlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgb3BlcmF0aW9ucyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgb3BlcmF0aW9uc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwaXBlRnJvbUFycmF5KG9wZXJhdGlvbnMpKHRoaXMpO1xuICAgIH07XG4gICAgT2JzZXJ2YWJsZS5wcm90b3R5cGUudG9Qcm9taXNlID0gZnVuY3Rpb24gKHByb21pc2VDdG9yKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHByb21pc2VDdG9yID0gZ2V0UHJvbWlzZUN0b3IocHJvbWlzZUN0b3IpO1xuICAgICAgICByZXR1cm4gbmV3IHByb21pc2VDdG9yKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZTtcbiAgICAgICAgICAgIF90aGlzLnN1YnNjcmliZShmdW5jdGlvbiAoeCkgeyByZXR1cm4gKHZhbHVlID0geCk7IH0sIGZ1bmN0aW9uIChlcnIpIHsgcmV0dXJuIHJlamVjdChlcnIpOyB9LCBmdW5jdGlvbiAoKSB7IHJldHVybiByZXNvbHZlKHZhbHVlKTsgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgT2JzZXJ2YWJsZS5jcmVhdGUgPSBmdW5jdGlvbiAoc3Vic2NyaWJlKSB7XG4gICAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShzdWJzY3JpYmUpO1xuICAgIH07XG4gICAgcmV0dXJuIE9ic2VydmFibGU7XG59KCkpO1xuZXhwb3J0IHsgT2JzZXJ2YWJsZSB9O1xuZnVuY3Rpb24gZ2V0UHJvbWlzZUN0b3IocHJvbWlzZUN0b3IpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuIChfYSA9IHByb21pc2VDdG9yICE9PSBudWxsICYmIHByb21pc2VDdG9yICE9PSB2b2lkIDAgPyBwcm9taXNlQ3RvciA6IGNvbmZpZy5Qcm9taXNlKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBQcm9taXNlO1xufVxuZnVuY3Rpb24gaXNPYnNlcnZlcih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAmJiBpc0Z1bmN0aW9uKHZhbHVlLm5leHQpICYmIGlzRnVuY3Rpb24odmFsdWUuZXJyb3IpICYmIGlzRnVuY3Rpb24odmFsdWUuY29tcGxldGUpO1xufVxuZnVuY3Rpb24gaXNTdWJzY3JpYmVyKHZhbHVlKSB7XG4gICAgcmV0dXJuICh2YWx1ZSAmJiB2YWx1ZSBpbnN0YW5jZW9mIFN1YnNjcmliZXIpIHx8IChpc09ic2VydmVyKHZhbHVlKSAmJiBpc1N1YnNjcmlwdGlvbih2YWx1ZSkpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9T2JzZXJ2YWJsZS5qcy5tYXAiLCJpbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi9pc0Z1bmN0aW9uJztcbmV4cG9ydCBmdW5jdGlvbiBoYXNMaWZ0KHNvdXJjZSkge1xuICAgIHJldHVybiBpc0Z1bmN0aW9uKHNvdXJjZSA9PT0gbnVsbCB8fCBzb3VyY2UgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNvdXJjZS5saWZ0KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBvcGVyYXRlKGluaXQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgICBpZiAoaGFzTGlmdChzb3VyY2UpKSB7XG4gICAgICAgICAgICByZXR1cm4gc291cmNlLmxpZnQoZnVuY3Rpb24gKGxpZnRlZFNvdXJjZSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbml0KGxpZnRlZFNvdXJjZSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1VuYWJsZSB0byBsaWZ0IHVua25vd24gT2JzZXJ2YWJsZSB0eXBlJyk7XG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpZnQuanMubWFwIiwiaW1wb3J0IHsgX19leHRlbmRzIH0gZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlT3BlcmF0b3JTdWJzY3JpYmVyKGRlc3RpbmF0aW9uLCBvbk5leHQsIG9uQ29tcGxldGUsIG9uRXJyb3IsIG9uRmluYWxpemUpIHtcbiAgICByZXR1cm4gbmV3IE9wZXJhdG9yU3Vic2NyaWJlcihkZXN0aW5hdGlvbiwgb25OZXh0LCBvbkNvbXBsZXRlLCBvbkVycm9yLCBvbkZpbmFsaXplKTtcbn1cbnZhciBPcGVyYXRvclN1YnNjcmliZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhPcGVyYXRvclN1YnNjcmliZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gT3BlcmF0b3JTdWJzY3JpYmVyKGRlc3RpbmF0aW9uLCBvbk5leHQsIG9uQ29tcGxldGUsIG9uRXJyb3IsIG9uRmluYWxpemUsIHNob3VsZFVuc3Vic2NyaWJlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIGRlc3RpbmF0aW9uKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5vbkZpbmFsaXplID0gb25GaW5hbGl6ZTtcbiAgICAgICAgX3RoaXMuc2hvdWxkVW5zdWJzY3JpYmUgPSBzaG91bGRVbnN1YnNjcmliZTtcbiAgICAgICAgX3RoaXMuX25leHQgPSBvbk5leHRcbiAgICAgICAgICAgID8gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgb25OZXh0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogX3N1cGVyLnByb3RvdHlwZS5fbmV4dDtcbiAgICAgICAgX3RoaXMuX2Vycm9yID0gb25FcnJvclxuICAgICAgICAgICAgPyBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgOiBfc3VwZXIucHJvdG90eXBlLl9lcnJvcjtcbiAgICAgICAgX3RoaXMuX2NvbXBsZXRlID0gb25Db21wbGV0ZVxuICAgICAgICAgICAgPyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgb25Db21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgOiBfc3VwZXIucHJvdG90eXBlLl9jb21wbGV0ZTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBPcGVyYXRvclN1YnNjcmliZXIucHJvdG90eXBlLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICghdGhpcy5zaG91bGRVbnN1YnNjcmliZSB8fCB0aGlzLnNob3VsZFVuc3Vic2NyaWJlKCkpIHtcbiAgICAgICAgICAgIHZhciBjbG9zZWRfMSA9IHRoaXMuY2xvc2VkO1xuICAgICAgICAgICAgX3N1cGVyLnByb3RvdHlwZS51bnN1YnNjcmliZS5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgIWNsb3NlZF8xICYmICgoX2EgPSB0aGlzLm9uRmluYWxpemUpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIE9wZXJhdG9yU3Vic2NyaWJlcjtcbn0oU3Vic2NyaWJlcikpO1xuZXhwb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1PcGVyYXRvclN1YnNjcmliZXIuanMubWFwIiwiaW1wb3J0IHsgY3JlYXRlRXJyb3JDbGFzcyB9IGZyb20gJy4vY3JlYXRlRXJyb3JDbGFzcyc7XG5leHBvcnQgdmFyIE9iamVjdFVuc3Vic2NyaWJlZEVycm9yID0gY3JlYXRlRXJyb3JDbGFzcyhmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIE9iamVjdFVuc3Vic2NyaWJlZEVycm9ySW1wbCgpIHtcbiAgICAgICAgX3N1cGVyKHRoaXMpO1xuICAgICAgICB0aGlzLm5hbWUgPSAnT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3InO1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSAnb2JqZWN0IHVuc3Vic2NyaWJlZCc7XG4gICAgfTtcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9T2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IuanMubWFwIiwiaW1wb3J0IHsgX19leHRlbmRzLCBfX3ZhbHVlcyB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24sIEVNUFRZX1NVQlNDUklQVElPTiB9IGZyb20gJy4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yIH0gZnJvbSAnLi91dGlsL09iamVjdFVuc3Vic2NyaWJlZEVycm9yJztcbmltcG9ydCB7IGFyclJlbW92ZSB9IGZyb20gJy4vdXRpbC9hcnJSZW1vdmUnO1xuaW1wb3J0IHsgZXJyb3JDb250ZXh0IH0gZnJvbSAnLi91dGlsL2Vycm9yQ29udGV4dCc7XG52YXIgU3ViamVjdCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFN1YmplY3QsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU3ViamVjdCgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuY2xvc2VkID0gZmFsc2U7XG4gICAgICAgIF90aGlzLmN1cnJlbnRPYnNlcnZlcnMgPSBudWxsO1xuICAgICAgICBfdGhpcy5vYnNlcnZlcnMgPSBbXTtcbiAgICAgICAgX3RoaXMuaXNTdG9wcGVkID0gZmFsc2U7XG4gICAgICAgIF90aGlzLmhhc0Vycm9yID0gZmFsc2U7XG4gICAgICAgIF90aGlzLnRocm93bkVycm9yID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBTdWJqZWN0LnByb3RvdHlwZS5saWZ0ID0gZnVuY3Rpb24gKG9wZXJhdG9yKSB7XG4gICAgICAgIHZhciBzdWJqZWN0ID0gbmV3IEFub255bW91c1N1YmplY3QodGhpcywgdGhpcyk7XG4gICAgICAgIHN1YmplY3Qub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgcmV0dXJuIHN1YmplY3Q7XG4gICAgfTtcbiAgICBTdWJqZWN0LnByb3RvdHlwZS5fdGhyb3dJZkNsb3NlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU3ViamVjdC5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBlcnJvckNvbnRleHQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGVfMSwgX2E7XG4gICAgICAgICAgICBfdGhpcy5fdGhyb3dJZkNsb3NlZCgpO1xuICAgICAgICAgICAgaWYgKCFfdGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIV90aGlzLmN1cnJlbnRPYnNlcnZlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuY3VycmVudE9ic2VydmVycyA9IEFycmF5LmZyb20oX3RoaXMub2JzZXJ2ZXJzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyhfdGhpcy5jdXJyZW50T2JzZXJ2ZXJzKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9ic2VydmVyID0gX2MudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZV8xXzEpIHsgZV8xID0geyBlcnJvcjogZV8xXzEgfTsgfVxuICAgICAgICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9jICYmICFfYy5kb25lICYmIChfYSA9IF9iLnJldHVybikpIF9hLmNhbGwoX2IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7IH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgU3ViamVjdC5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGVycm9yQ29udGV4dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5fdGhyb3dJZkNsb3NlZCgpO1xuICAgICAgICAgICAgaWYgKCFfdGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5oYXNFcnJvciA9IF90aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgX3RoaXMudGhyb3duRXJyb3IgPSBlcnI7XG4gICAgICAgICAgICAgICAgdmFyIG9ic2VydmVycyA9IF90aGlzLm9ic2VydmVycztcbiAgICAgICAgICAgICAgICB3aGlsZSAob2JzZXJ2ZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlcnMuc2hpZnQoKS5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBTdWJqZWN0LnByb3RvdHlwZS5jb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgZXJyb3JDb250ZXh0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLl90aHJvd0lmQ2xvc2VkKCk7XG4gICAgICAgICAgICBpZiAoIV90aGlzLmlzU3RvcHBlZCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdmFyIG9ic2VydmVycyA9IF90aGlzLm9ic2VydmVycztcbiAgICAgICAgICAgICAgICB3aGlsZSAob2JzZXJ2ZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlcnMuc2hpZnQoKS5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBTdWJqZWN0LnByb3RvdHlwZS51bnN1YnNjcmliZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pc1N0b3BwZWQgPSB0aGlzLmNsb3NlZCA9IHRydWU7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzID0gdGhpcy5jdXJyZW50T2JzZXJ2ZXJzID0gbnVsbDtcbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdWJqZWN0LnByb3RvdHlwZSwgXCJvYnNlcnZlZFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgcmV0dXJuICgoX2EgPSB0aGlzLm9ic2VydmVycykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxlbmd0aCkgPiAwO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgU3ViamVjdC5wcm90b3R5cGUuX3RyeVN1YnNjcmliZSA9IGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgICAgIHRoaXMuX3Rocm93SWZDbG9zZWQoKTtcbiAgICAgICAgcmV0dXJuIF9zdXBlci5wcm90b3R5cGUuX3RyeVN1YnNjcmliZS5jYWxsKHRoaXMsIHN1YnNjcmliZXIpO1xuICAgIH07XG4gICAgU3ViamVjdC5wcm90b3R5cGUuX3N1YnNjcmliZSA9IGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgICAgIHRoaXMuX3Rocm93SWZDbG9zZWQoKTtcbiAgICAgICAgdGhpcy5fY2hlY2tGaW5hbGl6ZWRTdGF0dXNlcyhzdWJzY3JpYmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lubmVyU3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgIH07XG4gICAgU3ViamVjdC5wcm90b3R5cGUuX2lubmVyU3Vic2NyaWJlID0gZnVuY3Rpb24gKHN1YnNjcmliZXIpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIF9hID0gdGhpcywgaGFzRXJyb3IgPSBfYS5oYXNFcnJvciwgaXNTdG9wcGVkID0gX2EuaXNTdG9wcGVkLCBvYnNlcnZlcnMgPSBfYS5vYnNlcnZlcnM7XG4gICAgICAgIGlmIChoYXNFcnJvciB8fCBpc1N0b3BwZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBFTVBUWV9TVUJTQ1JJUFRJT047XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdXJyZW50T2JzZXJ2ZXJzID0gbnVsbDtcbiAgICAgICAgb2JzZXJ2ZXJzLnB1c2goc3Vic2NyaWJlcik7XG4gICAgICAgIHJldHVybiBuZXcgU3Vic2NyaXB0aW9uKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLmN1cnJlbnRPYnNlcnZlcnMgPSBudWxsO1xuICAgICAgICAgICAgYXJyUmVtb3ZlKG9ic2VydmVycywgc3Vic2NyaWJlcik7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgU3ViamVjdC5wcm90b3R5cGUuX2NoZWNrRmluYWxpemVkU3RhdHVzZXMgPSBmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xuICAgICAgICB2YXIgX2EgPSB0aGlzLCBoYXNFcnJvciA9IF9hLmhhc0Vycm9yLCB0aHJvd25FcnJvciA9IF9hLnRocm93bkVycm9yLCBpc1N0b3BwZWQgPSBfYS5pc1N0b3BwZWQ7XG4gICAgICAgIGlmIChoYXNFcnJvcikge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5lcnJvcih0aHJvd25FcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNTdG9wcGVkKSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN1YmplY3QucHJvdG90eXBlLmFzT2JzZXJ2YWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZSgpO1xuICAgICAgICBvYnNlcnZhYmxlLnNvdXJjZSA9IHRoaXM7XG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICAgIH07XG4gICAgU3ViamVjdC5jcmVhdGUgPSBmdW5jdGlvbiAoZGVzdGluYXRpb24sIHNvdXJjZSkge1xuICAgICAgICByZXR1cm4gbmV3IEFub255bW91c1N1YmplY3QoZGVzdGluYXRpb24sIHNvdXJjZSk7XG4gICAgfTtcbiAgICByZXR1cm4gU3ViamVjdDtcbn0oT2JzZXJ2YWJsZSkpO1xuZXhwb3J0IHsgU3ViamVjdCB9O1xudmFyIEFub255bW91c1N1YmplY3QgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhBbm9ueW1vdXNTdWJqZWN0LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEFub255bW91c1N1YmplY3QoZGVzdGluYXRpb24sIHNvdXJjZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5kZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uO1xuICAgICAgICBfdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgQW5vbnltb3VzU3ViamVjdC5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAoX2IgPSAoX2EgPSB0aGlzLmRlc3RpbmF0aW9uKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubmV4dCkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwoX2EsIHZhbHVlKTtcbiAgICB9O1xuICAgIEFub255bW91c1N1YmplY3QucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24gKGVycikge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAoX2IgPSAoX2EgPSB0aGlzLmRlc3RpbmF0aW9uKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZXJyb3IpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5jYWxsKF9hLCBlcnIpO1xuICAgIH07XG4gICAgQW5vbnltb3VzU3ViamVjdC5wcm90b3R5cGUuY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIChfYiA9IChfYSA9IHRoaXMuZGVzdGluYXRpb24pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jb21wbGV0ZSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwoX2EpO1xuICAgIH07XG4gICAgQW5vbnltb3VzU3ViamVjdC5wcm90b3R5cGUuX3N1YnNjcmliZSA9IGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIHJldHVybiAoX2IgPSAoX2EgPSB0aGlzLnNvdXJjZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnN1YnNjcmliZShzdWJzY3JpYmVyKSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogRU1QVFlfU1VCU0NSSVBUSU9OO1xuICAgIH07XG4gICAgcmV0dXJuIEFub255bW91c1N1YmplY3Q7XG59KFN1YmplY3QpKTtcbmV4cG9ydCB7IEFub255bW91c1N1YmplY3QgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVN1YmplY3QuanMubWFwIiwiaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBjcmVhdGVPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gbWFwKHByb2plY3QsIHRoaXNBcmcpIHtcbiAgICByZXR1cm4gb3BlcmF0ZShmdW5jdGlvbiAoc291cmNlLCBzdWJzY3JpYmVyKSB7XG4gICAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUoY3JlYXRlT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHByb2plY3QuY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaW5kZXgrKykpO1xuICAgICAgICB9KSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXAuanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSAuTkVUIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLiBTZWUgTElDRU5TRSBmaWxlIGluIHRoZSBwcm9qZWN0IHJvb3QgZm9yIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbi5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1Byb21pc2VDb21wbGV0aW9uU291cmNlPFQ+KG9iajogYW55KTogb2JqIGlzIFByb21pc2VDb21wbGV0aW9uU291cmNlPFQ+IHtcclxuICAgIHJldHVybiBvYmoucHJvbWlzZVxyXG4gICAgICAgICYmIG9iai5yZXNvbHZlXHJcbiAgICAgICAgJiYgb2JqLnJlamVjdDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByb21pc2VDb21wbGV0aW9uU291cmNlPFQ+IHtcclxuICAgIHByaXZhdGUgX3Jlc29sdmU6ICh2YWx1ZTogVCkgPT4gdm9pZCA9ICgpID0+IHsgfTtcclxuICAgIHByaXZhdGUgX3JlamVjdDogKHJlYXNvbjogYW55KSA9PiB2b2lkID0gKCkgPT4geyB9O1xyXG4gICAgcmVhZG9ubHkgcHJvbWlzZTogUHJvbWlzZTxUPjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZTxUPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc29sdmUgPSByZXNvbHZlO1xyXG4gICAgICAgICAgICB0aGlzLl9yZWplY3QgPSByZWplY3Q7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzb2x2ZSh2YWx1ZTogVCkge1xyXG4gICAgICAgIHRoaXMuX3Jlc29sdmUodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlamVjdChyZWFzb246IGFueSkge1xyXG4gICAgICAgIHRoaXMuX3JlamVjdChyZWFzb24pO1xyXG4gICAgfVxyXG59XHJcbiIsIi8vIENvcHlyaWdodCAoYykgLk5FVCBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS4gU2VlIExJQ0VOU0UgZmlsZSBpbiB0aGUgcHJvamVjdCByb290IGZvciBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24uXHJcblxyXG5pbXBvcnQgKiBhcyByeGpzIGZyb20gXCJyeGpzXCI7XHJcbmltcG9ydCAqIGFzIGNvbW1hbmRzQW5kRXZlbnRzIGZyb20gXCIuL2NvbW1hbmRzQW5kRXZlbnRzXCI7XHJcbmltcG9ydCB7IERpc3Bvc2FibGUgfSBmcm9tIFwiLi9kaXNwb3NhYmxlc1wiO1xyXG5pbXBvcnQgeyBnZXRLZXJuZWxVcmksIEtlcm5lbCB9IGZyb20gXCIuL2tlcm5lbFwiO1xyXG5pbXBvcnQgeyBQcm9taXNlQ29tcGxldGlvblNvdXJjZSB9IGZyb20gXCIuL3Byb21pc2VDb21wbGV0aW9uU291cmNlXCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEtlcm5lbEludm9jYXRpb25Db250ZXh0IGltcGxlbWVudHMgRGlzcG9zYWJsZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioa2VybmVsQ29tbWFuZEludm9jYXRpb246IGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbENvbW1hbmRFbnZlbG9wZSkge1xyXG4gICAgICAgIHRoaXMuX2NvbW1hbmRFbnZlbG9wZSA9IGtlcm5lbENvbW1hbmRJbnZvY2F0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIF9jdXJyZW50OiBLZXJuZWxJbnZvY2F0aW9uQ29udGV4dCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfY29tbWFuZEVudmVsb3BlOiBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxDb21tYW5kRW52ZWxvcGU7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9jaGlsZENvbW1hbmRzOiBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxDb21tYW5kRW52ZWxvcGVbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZXZlbnRTdWJqZWN0OiByeGpzLlN1YmplY3Q8Y29tbWFuZHNBbmRFdmVudHMuS2VybmVsRXZlbnRFbnZlbG9wZT4gPSBuZXcgcnhqcy5TdWJqZWN0PGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbEV2ZW50RW52ZWxvcGU+KCk7XHJcblxyXG4gICAgcHJpdmF0ZSBfaXNDb21wbGV0ZSA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfaGFuZGxpbmdLZXJuZWw6IEtlcm5lbCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfY29tcGxldGlvblNvdXJjZSA9IG5ldyBQcm9taXNlQ29tcGxldGlvblNvdXJjZTx2b2lkPigpO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgaGFuZGxpbmdLZXJuZWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hhbmRsaW5nS2VybmVsO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGtlcm5lbEV2ZW50cygpOiByeGpzLk9ic2VydmFibGU8Y29tbWFuZHNBbmRFdmVudHMuS2VybmVsRXZlbnRFbnZlbG9wZT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ldmVudFN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBzZXQgaGFuZGxpbmdLZXJuZWwodmFsdWU6IEtlcm5lbCB8IG51bGwpIHtcclxuICAgICAgICB0aGlzLl9oYW5kbGluZ0tlcm5lbCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcHJvbWlzZSgpOiB2b2lkIHwgUHJvbWlzZUxpa2U8dm9pZD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb21wbGV0aW9uU291cmNlLnByb21pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldE9yQ3JlYXRlQW1iaWVudENvbnRleHQoY29tbWFuZDogY29tbWFuZHNBbmRFdmVudHMuS2VybmVsQ29tbWFuZEVudmVsb3BlKTogS2VybmVsSW52b2NhdGlvbkNvbnRleHQge1xyXG4gICAgICAgIGxldCBjdXJyZW50ID0gS2VybmVsSW52b2NhdGlvbkNvbnRleHQuX2N1cnJlbnQ7XHJcbiAgICAgICAgaWYgKCFjdXJyZW50IHx8IGN1cnJlbnQuX2lzQ29tcGxldGUpIHtcclxuICAgICAgICAgICAgY29tbWFuZC5nZXRPckNyZWF0ZVRva2VuKCk7XHJcbiAgICAgICAgICAgIEtlcm5lbEludm9jYXRpb25Db250ZXh0Ll9jdXJyZW50ID0gbmV3IEtlcm5lbEludm9jYXRpb25Db250ZXh0KGNvbW1hbmQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghY29tbWFuZHNBbmRFdmVudHMuS2VybmVsQ29tbWFuZEVudmVsb3BlLmFyZUNvbW1hbmRzVGhlU2FtZShjb21tYW5kLCBjdXJyZW50Ll9jb21tYW5kRW52ZWxvcGUpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmb3VuZCA9IGN1cnJlbnQuX2NoaWxkQ29tbWFuZHMuaW5jbHVkZXMoY29tbWFuZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWZvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbW1hbmQucGFyZW50Q29tbWFuZCA9PT0gbnVsbCB8fCBjb21tYW5kLnBhcmVudENvbW1hbmQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kLnNldFBhcmVudChjdXJyZW50Ll9jb21tYW5kRW52ZWxvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Ll9jaGlsZENvbW1hbmRzLnB1c2goY29tbWFuZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBLZXJuZWxJbnZvY2F0aW9uQ29udGV4dC5fY3VycmVudCE7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBjdXJyZW50KCk6IEtlcm5lbEludm9jYXRpb25Db250ZXh0IHwgbnVsbCB7IHJldHVybiB0aGlzLl9jdXJyZW50OyB9XHJcbiAgICBnZXQgY29tbWFuZCgpOiBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxDb21tYW5kIHsgcmV0dXJuIHRoaXMuX2NvbW1hbmRFbnZlbG9wZS5jb21tYW5kOyB9XHJcbiAgICBnZXQgY29tbWFuZEVudmVsb3BlKCk6IGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbENvbW1hbmRFbnZlbG9wZSB7IHJldHVybiB0aGlzLl9jb21tYW5kRW52ZWxvcGU7IH1cclxuXHJcbiAgICBjb21wbGV0ZShjb21tYW5kOiBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxDb21tYW5kRW52ZWxvcGUpIHtcclxuICAgICAgICBpZiAoY29tbWFuZHNBbmRFdmVudHMuS2VybmVsQ29tbWFuZEVudmVsb3BlLmFyZUNvbW1hbmRzVGhlU2FtZShjb21tYW5kLCB0aGlzLl9jb21tYW5kRW52ZWxvcGUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzQ29tcGxldGUgPSB0cnVlO1xyXG4gICAgICAgICAgICBsZXQgc3VjY2VlZGVkOiBjb21tYW5kc0FuZEV2ZW50cy5Db21tYW5kU3VjY2VlZGVkID0ge307XHJcbiAgICAgICAgICAgIGxldCBldmVudEVudmVsb3BlOiBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxFdmVudEVudmVsb3BlID0gbmV3IGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbEV2ZW50RW52ZWxvcGUoXHJcbiAgICAgICAgICAgICAgICBjb21tYW5kc0FuZEV2ZW50cy5Db21tYW5kU3VjY2VlZGVkVHlwZSxcclxuICAgICAgICAgICAgICAgIHN1Y2NlZWRlZCxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvbW1hbmRFbnZlbG9wZVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5pbnRlcm5hbFB1Ymxpc2goZXZlbnRFbnZlbG9wZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbXBsZXRpb25Tb3VyY2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHBvcyA9IHRoaXMuX2NoaWxkQ29tbWFuZHMuaW5kZXhPZihjb21tYW5kKTtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2NoaWxkQ29tbWFuZHNbcG9zXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZmFpbChtZXNzYWdlPzogc3RyaW5nKSB7XHJcbiAgICAgICAgLy8gVGhlIEMjIGNvZGUgYWNjZXB0cyBhIG1lc3NhZ2UgYW5kL29yIGFuIGV4Y2VwdGlvbi4gRG8gd2UgbmVlZCB0byBhZGQgc3VwcG9ydFxyXG4gICAgICAgIC8vIGZvciBleGNlcHRpb25zPyAoVGhlIFRTIENvbW1hbmRGYWlsZWQgaW50ZXJmYWNlIGRvZXNuJ3QgaGF2ZSBhIHBsYWNlIGZvciBpdCByaWdodCBub3cuKVxyXG4gICAgICAgIHRoaXMuX2lzQ29tcGxldGUgPSB0cnVlO1xyXG4gICAgICAgIGxldCBmYWlsZWQ6IGNvbW1hbmRzQW5kRXZlbnRzLkNvbW1hbmRGYWlsZWQgPSB7IG1lc3NhZ2U6IG1lc3NhZ2UgPz8gXCJDb21tYW5kIEZhaWxlZFwiIH07XHJcbiAgICAgICAgbGV0IGV2ZW50RW52ZWxvcGU6IGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbEV2ZW50RW52ZWxvcGUgPSBuZXcgY29tbWFuZHNBbmRFdmVudHMuS2VybmVsRXZlbnRFbnZlbG9wZShcclxuICAgICAgICAgICAgY29tbWFuZHNBbmRFdmVudHMuQ29tbWFuZEZhaWxlZFR5cGUsXHJcbiAgICAgICAgICAgIGZhaWxlZCxcclxuICAgICAgICAgICAgdGhpcy5fY29tbWFuZEVudmVsb3BlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbnRlcm5hbFB1Ymxpc2goZXZlbnRFbnZlbG9wZSk7XHJcbiAgICAgICAgdGhpcy5fY29tcGxldGlvblNvdXJjZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGlzaChrZXJuZWxFdmVudDogY29tbWFuZHNBbmRFdmVudHMuS2VybmVsRXZlbnRFbnZlbG9wZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5faXNDb21wbGV0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmludGVybmFsUHVibGlzaChrZXJuZWxFdmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW50ZXJuYWxQdWJsaXNoKGtlcm5lbEV2ZW50OiBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxFdmVudEVudmVsb3BlKSB7XHJcbiAgICAgICAgaWYgKCFrZXJuZWxFdmVudC5jb21tYW5kKSB7XHJcbiAgICAgICAgICAgIGtlcm5lbEV2ZW50LmNvbW1hbmQgPSB0aGlzLl9jb21tYW5kRW52ZWxvcGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY29tbWFuZCA9IGtlcm5lbEV2ZW50LmNvbW1hbmQ7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmhhbmRsaW5nS2VybmVsKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGtlcm5lbFVyaSA9IGdldEtlcm5lbFVyaSh0aGlzLmhhbmRsaW5nS2VybmVsKTtcclxuICAgICAgICAgICAgaWYgKCFrZXJuZWxFdmVudC5yb3V0aW5nU2xpcC5jb250YWlucyhrZXJuZWxVcmkpKSB7XHJcbiAgICAgICAgICAgICAgICBrZXJuZWxFdmVudC5yb3V0aW5nU2xpcC5zdGFtcChrZXJuZWxVcmkpO1xyXG4gICAgICAgICAgICAgICAga2VybmVsRXZlbnQucm91dGluZ1NsaXA7Ly8/XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBcInNob3VsZCBub3QgYmUgaGVyZVwiOy8vP1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGtlcm5lbEV2ZW50Oy8vP1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jb21tYW5kRW52ZWxvcGU7Ly8/XHJcbiAgICAgICAgaWYgKGNvbW1hbmQgPT09IG51bGwgfHxcclxuICAgICAgICAgICAgY29tbWFuZCA9PT0gdW5kZWZpbmVkIHx8XHJcbiAgICAgICAgICAgIGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbENvbW1hbmRFbnZlbG9wZS5hcmVDb21tYW5kc1RoZVNhbWUoY29tbWFuZCEsIHRoaXMuX2NvbW1hbmRFbnZlbG9wZSkgfHxcclxuICAgICAgICAgICAgdGhpcy5fY2hpbGRDb21tYW5kcy5pbmNsdWRlcyhjb21tYW5kISkpIHtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRTdWJqZWN0Lm5leHQoa2VybmVsRXZlbnQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pc1NlbGZvckRlc2NlbmRhbnRPZih0aGlzLl9jb21tYW5kRW52ZWxvcGUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50U3ViamVjdC5uZXh0KGtlcm5lbEV2ZW50KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaGFzU2FtZVJvb3RDb21tYW5kQXModGhpcy5fY29tbWFuZEVudmVsb3BlKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9ldmVudFN1YmplY3QubmV4dChrZXJuZWxFdmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlzUGFyZW50T2ZDb21tYW5kKGNvbW1hbmRFbnZlbG9wZTogY29tbWFuZHNBbmRFdmVudHMuS2VybmVsQ29tbWFuZEVudmVsb3BlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgY2hpbGRGb3VuZCA9IHRoaXMuX2NoaWxkQ29tbWFuZHMuaW5jbHVkZXMoY29tbWFuZEVudmVsb3BlKTtcclxuICAgICAgICByZXR1cm4gY2hpbGRGb3VuZDtcclxuICAgIH1cclxuXHJcbiAgICBkaXNwb3NlKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5faXNDb21wbGV0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbXBsZXRlKHRoaXMuX2NvbW1hbmRFbnZlbG9wZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEtlcm5lbEludm9jYXRpb25Db250ZXh0Ll9jdXJyZW50ID0gbnVsbDtcclxuICAgIH1cclxufVxyXG4iLCIvLyBDb3B5cmlnaHQgKGMpIC5ORVQgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIGZpbGUgaW4gdGhlIHByb2plY3Qgcm9vdCBmb3IgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uLlxyXG5cclxuZXhwb3J0IGVudW0gTG9nTGV2ZWwge1xyXG4gICAgSW5mbyA9IDAsXHJcbiAgICBXYXJuID0gMSxcclxuICAgIEVycm9yID0gMixcclxuICAgIE5vbmUgPSAzLFxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBMb2dFbnRyeSA9IHtcclxuICAgIGxvZ0xldmVsOiBMb2dMZXZlbDtcclxuICAgIHNvdXJjZTogc3RyaW5nO1xyXG4gICAgbWVzc2FnZTogc3RyaW5nO1xyXG59O1xyXG5cclxuZXhwb3J0IGNsYXNzIExvZ2dlciB7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX2RlZmF1bHQ6IExvZ2dlciA9IG5ldyBMb2dnZXIoJ2RlZmF1bHQnLCAoX2VudHJ5OiBMb2dFbnRyeSkgPT4geyB9KTtcclxuXHJcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgc291cmNlOiBzdHJpbmcsIHJlYWRvbmx5IHdyaXRlOiAoZW50cnk6IExvZ0VudHJ5KSA9PiB2b2lkKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluZm8obWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy53cml0ZSh7IGxvZ0xldmVsOiBMb2dMZXZlbC5JbmZvLCBzb3VyY2U6IHRoaXMuc291cmNlLCBtZXNzYWdlIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB3YXJuKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMud3JpdGUoeyBsb2dMZXZlbDogTG9nTGV2ZWwuV2Fybiwgc291cmNlOiB0aGlzLnNvdXJjZSwgbWVzc2FnZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy53cml0ZSh7IGxvZ0xldmVsOiBMb2dMZXZlbC5FcnJvciwgc291cmNlOiB0aGlzLnNvdXJjZSwgbWVzc2FnZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGNvbmZpZ3VyZShzb3VyY2U6IHN0cmluZywgd3JpdGVyOiAoZW50cnk6IExvZ0VudHJ5KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgY29uc3QgbG9nZ2VyID0gbmV3IExvZ2dlcihzb3VyY2UsIHdyaXRlcik7XHJcbiAgICAgICAgTG9nZ2VyLl9kZWZhdWx0ID0gbG9nZ2VyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGRlZmF1bHQoKTogTG9nZ2VyIHtcclxuICAgICAgICBpZiAoTG9nZ2VyLl9kZWZhdWx0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBMb2dnZXIuX2RlZmF1bHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGxvZ2dlciBoYXMgYmVlbiBjb25maWd1cmVkIGZvciB0aGlzIGNvbnRleHQnKTtcclxuICAgIH1cclxufVxyXG4iLCIvLyBDb3B5cmlnaHQgKGMpIC5ORVQgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIGZpbGUgaW4gdGhlIHByb2plY3Qgcm9vdCBmb3IgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uLlxyXG5cclxuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4vbG9nZ2VyXCI7XHJcbmltcG9ydCB7IFByb21pc2VDb21wbGV0aW9uU291cmNlIH0gZnJvbSBcIi4vcHJvbWlzZUNvbXBsZXRpb25Tb3VyY2VcIjtcclxuXHJcbmludGVyZmFjZSBTY2hlZHVsZXJPcGVyYXRpb248VD4ge1xyXG4gICAgdmFsdWU6IFQ7XHJcbiAgICBleGVjdXRvcjogKHZhbHVlOiBUKSA9PiBQcm9taXNlPHZvaWQ+O1xyXG4gICAgcHJvbWlzZUNvbXBsZXRpb25Tb3VyY2U6IFByb21pc2VDb21wbGV0aW9uU291cmNlPHZvaWQ+O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgS2VybmVsU2NoZWR1bGVyPFQ+IHtcclxuICAgIHNldE11c3RUcmFtcG9saW5lKHByZWRpY2F0ZTogKGM6IFQpID0+IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9tdXN0VHJhbXBvbGluZSA9IHByZWRpY2F0ZSA/PyAoKF9jKSA9PiBmYWxzZSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF9vcGVyYXRpb25RdWV1ZTogQXJyYXk8U2NoZWR1bGVyT3BlcmF0aW9uPFQ+PiA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfaW5GbGlnaHRPcGVyYXRpb24/OiBTY2hlZHVsZXJPcGVyYXRpb248VD47XHJcbiAgICBwcml2YXRlIF9tdXN0VHJhbXBvbGluZTogKGM6IFQpID0+IGJvb2xlYW47XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLl9tdXN0VHJhbXBvbGluZSA9IChfYykgPT4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNhbmNlbEN1cnJlbnRPcGVyYXRpb24oKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5faW5GbGlnaHRPcGVyYXRpb24/LnByb21pc2VDb21wbGV0aW9uU291cmNlLnJlamVjdChuZXcgRXJyb3IoXCJPcGVyYXRpb24gY2FuY2VsbGVkXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICBydW5Bc3luYyh2YWx1ZTogVCwgZXhlY3V0b3I6ICh2YWx1ZTogVCkgPT4gUHJvbWlzZTx2b2lkPik6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbiA9IHtcclxuICAgICAgICAgICAgdmFsdWUsXHJcbiAgICAgICAgICAgIGV4ZWN1dG9yLFxyXG4gICAgICAgICAgICBwcm9taXNlQ29tcGxldGlvblNvdXJjZTogbmV3IFByb21pc2VDb21wbGV0aW9uU291cmNlPHZvaWQ+KCksXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgbXVzdFRyYW1wb2xpbmUgPSB0aGlzLl9tdXN0VHJhbXBvbGluZSh2YWx1ZSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pbkZsaWdodE9wZXJhdGlvbiAmJiAhbXVzdFRyYW1wb2xpbmUpIHtcclxuICAgICAgICAgICAgTG9nZ2VyLmRlZmF1bHQuaW5mbyhga2VybmVsU2NoZWR1bGVyOiBzdGFydGluZyBpbW1lZGlhdGUgZXhlY3V0aW9uIG9mICR7SlNPTi5zdHJpbmdpZnkob3BlcmF0aW9uLnZhbHVlKX1gKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGludm9rZSBpbW1lZGlhdGVseVxyXG4gICAgICAgICAgICByZXR1cm4gb3BlcmF0aW9uLmV4ZWN1dG9yKG9wZXJhdGlvbi52YWx1ZSlcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBMb2dnZXIuZGVmYXVsdC5pbmZvKGBrZXJuZWxTY2hlZHVsZXI6IGltbWVkaWF0ZSBleGVjdXRpb24gY29tcGxldGVkOiAke0pTT04uc3RyaW5naWZ5KG9wZXJhdGlvbi52YWx1ZSl9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLnByb21pc2VDb21wbGV0aW9uU291cmNlLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgTG9nZ2VyLmRlZmF1bHQuaW5mbyhga2VybmVsU2NoZWR1bGVyOiBpbW1lZGlhdGUgZXhlY3V0aW9uIGZhaWxlZDogJHtKU09OLnN0cmluZ2lmeShlKX0gLSAke0pTT04uc3RyaW5naWZ5KG9wZXJhdGlvbi52YWx1ZSl9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLnByb21pc2VDb21wbGV0aW9uU291cmNlLnJlamVjdChlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgTG9nZ2VyLmRlZmF1bHQuaW5mbyhga2VybmVsU2NoZWR1bGVyOiBzY2hlZHVsaW5nIGV4ZWN1dGlvbiBvZiAke0pTT04uc3RyaW5naWZ5KG9wZXJhdGlvbi52YWx1ZSl9YCk7XHJcbiAgICAgICAgdGhpcy5fb3BlcmF0aW9uUXVldWUucHVzaChvcGVyYXRpb24pO1xyXG4gICAgICAgIGlmICh0aGlzLl9vcGVyYXRpb25RdWV1ZS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV4ZWN1dGVOZXh0Q29tbWFuZCgpO1xyXG4gICAgICAgICAgICB9LCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvcGVyYXRpb24ucHJvbWlzZUNvbXBsZXRpb25Tb3VyY2UucHJvbWlzZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGV4ZWN1dGVOZXh0Q29tbWFuZCgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBuZXh0T3BlcmF0aW9uID0gdGhpcy5fb3BlcmF0aW9uUXVldWUubGVuZ3RoID4gMCA/IHRoaXMuX29wZXJhdGlvblF1ZXVlWzBdIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIGlmIChuZXh0T3BlcmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luRmxpZ2h0T3BlcmF0aW9uID0gbmV4dE9wZXJhdGlvbjtcclxuICAgICAgICAgICAgTG9nZ2VyLmRlZmF1bHQuaW5mbyhga2VybmVsU2NoZWR1bGVyOiBzdGFydGluZyBzY2hlZHVsZWQgZXhlY3V0aW9uIG9mICR7SlNPTi5zdHJpbmdpZnkobmV4dE9wZXJhdGlvbi52YWx1ZSl9YCk7XHJcbiAgICAgICAgICAgIG5leHRPcGVyYXRpb24uZXhlY3V0b3IobmV4dE9wZXJhdGlvbi52YWx1ZSlcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbkZsaWdodE9wZXJhdGlvbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICBMb2dnZXIuZGVmYXVsdC5pbmZvKGBrZXJuZWxTY2hlZHVsZXI6IGNvbXBsZXRpbmcgaW5mbGlnaHQgb3BlcmF0aW9uOiBzdWNjZXNzICR7SlNPTi5zdHJpbmdpZnkobmV4dE9wZXJhdGlvbi52YWx1ZSl9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dE9wZXJhdGlvbi5wcm9taXNlQ29tcGxldGlvblNvdXJjZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2luRmxpZ2h0T3BlcmF0aW9uID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgIExvZ2dlci5kZWZhdWx0LmluZm8oYGtlcm5lbFNjaGVkdWxlcjogY29tcGxldGluZyBpbmZsaWdodCBvcGVyYXRpb246IGZhaWx1cmUgJHtKU09OLnN0cmluZ2lmeShlKX0gLSAke0pTT04uc3RyaW5naWZ5KG5leHRPcGVyYXRpb24udmFsdWUpfWApO1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHRPcGVyYXRpb24ucHJvbWlzZUNvbXBsZXRpb25Tb3VyY2UucmVqZWN0KGUpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5maW5hbGx5KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbkZsaWdodE9wZXJhdGlvbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fb3BlcmF0aW9uUXVldWUuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5leGVjdXRlTmV4dENvbW1hbmQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCAwKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvLyBDb3B5cmlnaHQgKGMpIC5ORVQgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIGZpbGUgaW4gdGhlIHByb2plY3Qgcm9vdCBmb3IgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uLlxyXG5cclxuaW1wb3J0IHsgS2VybmVsSW52b2NhdGlvbkNvbnRleHQgfSBmcm9tIFwiLi9rZXJuZWxJbnZvY2F0aW9uQ29udGV4dFwiO1xyXG5pbXBvcnQgKiBhcyBjb21tYW5kc0FuZEV2ZW50cyBmcm9tIFwiLi9jb21tYW5kc0FuZEV2ZW50c1wiO1xyXG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiLi9sb2dnZXJcIjtcclxuaW1wb3J0IHsgQ29tcG9zaXRlS2VybmVsIH0gZnJvbSBcIi4vY29tcG9zaXRlS2VybmVsXCI7XHJcbmltcG9ydCB7IEtlcm5lbFNjaGVkdWxlciB9IGZyb20gXCIuL2tlcm5lbFNjaGVkdWxlclwiO1xyXG5pbXBvcnQgeyBQcm9taXNlQ29tcGxldGlvblNvdXJjZSB9IGZyb20gXCIuL3Byb21pc2VDb21wbGV0aW9uU291cmNlXCI7XHJcbmltcG9ydCAqIGFzIGRpc3Bvc2FibGVzIGZyb20gXCIuL2Rpc3Bvc2FibGVzXCI7XHJcbmltcG9ydCAqIGFzIHJvdXRpbmdzbGlwIGZyb20gXCIuL3JvdXRpbmdzbGlwXCI7XHJcbmltcG9ydCAqIGFzIHJ4anMgZnJvbSBcInJ4anNcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUtlcm5lbENvbW1hbmRJbnZvY2F0aW9uIHtcclxuICAgIGNvbW1hbmRFbnZlbG9wZTogY29tbWFuZHNBbmRFdmVudHMuS2VybmVsQ29tbWFuZEVudmVsb3BlO1xyXG4gICAgY29udGV4dDogS2VybmVsSW52b2NhdGlvbkNvbnRleHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUtlcm5lbENvbW1hbmRIYW5kbGVyIHtcclxuICAgIGNvbW1hbmRUeXBlOiBzdHJpbmc7XHJcbiAgICBoYW5kbGU6IChjb21tYW5kSW52b2NhdGlvbjogSUtlcm5lbENvbW1hbmRJbnZvY2F0aW9uKSA9PiBQcm9taXNlPHZvaWQ+O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElLZXJuZWxFdmVudE9ic2VydmVyIHtcclxuICAgIChrZXJuZWxFdmVudDogY29tbWFuZHNBbmRFdmVudHMuS2VybmVsRXZlbnRFbnZlbG9wZSk6IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBLZXJuZWwge1xyXG4gICAgcHJpdmF0ZSBfa2VybmVsSW5mbzogY29tbWFuZHNBbmRFdmVudHMuS2VybmVsSW5mbztcclxuICAgIHByaXZhdGUgX2NvbW1hbmRIYW5kbGVycyA9IG5ldyBNYXA8c3RyaW5nLCBJS2VybmVsQ29tbWFuZEhhbmRsZXI+KCk7XHJcbiAgICBwcml2YXRlIF9ldmVudFN1YmplY3QgPSBuZXcgcnhqcy5TdWJqZWN0PGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbEV2ZW50RW52ZWxvcGU+KCk7XHJcbiAgICBwdWJsaWMgcm9vdEtlcm5lbDogS2VybmVsID0gdGhpcztcclxuICAgIHB1YmxpYyBwYXJlbnRLZXJuZWw6IENvbXBvc2l0ZUtlcm5lbCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfc2NoZWR1bGVyPzogS2VybmVsU2NoZWR1bGVyPGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbENvbW1hbmRFbnZlbG9wZT4gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGtlcm5lbEluZm8oKTogY29tbWFuZHNBbmRFdmVudHMuS2VybmVsSW5mbyB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9rZXJuZWxJbmZvO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQga2VybmVsRXZlbnRzKCk6IHJ4anMuT2JzZXJ2YWJsZTxjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxFdmVudEVudmVsb3BlPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50U3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBuYW1lOiBzdHJpbmcsIGxhbmd1YWdlTmFtZT86IHN0cmluZywgbGFuZ3VhZ2VWZXJzaW9uPzogc3RyaW5nLCBkaXNwbGF5TmFtZT86IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX2tlcm5lbEluZm8gPSB7XHJcbiAgICAgICAgICAgIGlzUHJveHk6IGZhbHNlLFxyXG4gICAgICAgICAgICBpc0NvbXBvc2l0ZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGxvY2FsTmFtZTogbmFtZSxcclxuICAgICAgICAgICAgbGFuZ3VhZ2VOYW1lOiBsYW5ndWFnZU5hbWUsXHJcbiAgICAgICAgICAgIGFsaWFzZXM6IFtdLFxyXG4gICAgICAgICAgICB1cmk6IHJvdXRpbmdzbGlwLmNyZWF0ZUtlcm5lbFVyaShga2VybmVsOi8vbG9jYWwvJHtuYW1lfWApLFxyXG4gICAgICAgICAgICBsYW5ndWFnZVZlcnNpb246IGxhbmd1YWdlVmVyc2lvbixcclxuICAgICAgICAgICAgZGlzcGxheU5hbWU6IGRpc3BsYXlOYW1lID8/IG5hbWUsXHJcbiAgICAgICAgICAgIHN1cHBvcnRlZEtlcm5lbENvbW1hbmRzOiBbXVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5faW50ZXJuYWxSZWdpc3RlckNvbW1hbmRIYW5kbGVyKHtcclxuICAgICAgICAgICAgY29tbWFuZFR5cGU6IGNvbW1hbmRzQW5kRXZlbnRzLlJlcXVlc3RLZXJuZWxJbmZvVHlwZSwgaGFuZGxlOiBhc3luYyBpbnZvY2F0aW9uID0+IHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuaGFuZGxlUmVxdWVzdEtlcm5lbEluZm8oaW52b2NhdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYXN5bmMgaGFuZGxlUmVxdWVzdEtlcm5lbEluZm8oaW52b2NhdGlvbjogSUtlcm5lbENvbW1hbmRJbnZvY2F0aW9uKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgY29uc3QgZXZlbnRFbnZlbG9wZTogY29tbWFuZHNBbmRFdmVudHMuS2VybmVsRXZlbnRFbnZlbG9wZSA9IG5ldyBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxFdmVudEVudmVsb3BlKFxyXG4gICAgICAgICAgICBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxJbmZvUHJvZHVjZWRUeXBlLFxyXG4gICAgICAgICAgICB7IGtlcm5lbEluZm86IHRoaXMuX2tlcm5lbEluZm8gfSBhcyBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxJbmZvUHJvZHVjZWQsXHJcbiAgICAgICAgICAgIGludm9jYXRpb24uY29tbWFuZEVudmVsb3BlXHJcbiAgICAgICAgKTsvLz9cclxuXHJcbiAgICAgICAgaW52b2NhdGlvbi5jb250ZXh0LnB1Ymxpc2goZXZlbnRFbnZlbG9wZSk7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0U2NoZWR1bGVyKCk6IEtlcm5lbFNjaGVkdWxlcjxjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxDb21tYW5kRW52ZWxvcGU+IHtcclxuICAgICAgICBpZiAoIXRoaXMuX3NjaGVkdWxlcikge1xyXG4gICAgICAgICAgICB0aGlzLl9zY2hlZHVsZXIgPSB0aGlzLnBhcmVudEtlcm5lbD8uZ2V0U2NoZWR1bGVyKCkgPz8gbmV3IEtlcm5lbFNjaGVkdWxlcjxjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxDb21tYW5kRW52ZWxvcGU+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fc2NoZWR1bGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgY3VycmVudCgpOiBLZXJuZWwgfCBudWxsIHtcclxuICAgICAgICBpZiAoS2VybmVsSW52b2NhdGlvbkNvbnRleHQuY3VycmVudCkge1xyXG4gICAgICAgICAgICByZXR1cm4gS2VybmVsSW52b2NhdGlvbkNvbnRleHQuY3VycmVudC5oYW5kbGluZ0tlcm5lbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCByb290KCk6IEtlcm5lbCB8IG51bGwge1xyXG4gICAgICAgIGlmIChLZXJuZWwuY3VycmVudCkge1xyXG4gICAgICAgICAgICByZXR1cm4gS2VybmVsLmN1cnJlbnQucm9vdEtlcm5lbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSXMgaXQgd29ydGggdXMgZ29pbmcgdG8gZWZmb3J0cyB0byBlbnN1cmUgdGhhdCB0aGUgUHJvbWlzZSByZXR1cm5lZCBoZXJlIGFjY3VyYXRlbHkgcmVmbGVjdHNcclxuICAgIC8vIHRoZSBjb21tYW5kJ3MgcHJvZ3Jlc3M/IFRoZSBvbmx5IHRoaW5nIHRoYXQgYWN0dWFsbHkgY2FsbHMgdGhpcyBpcyB0aGUga2VybmVsIGNoYW5uZWwsIHRocm91Z2hcclxuICAgIC8vIHRoZSBjYWxsYmFjayBzZXQgdXAgYnkgYXR0YWNoS2VybmVsVG9DaGFubmVsLCBhbmQgdGhlIGNhbGxiYWNrIGlzIGV4cGVjdGVkIHRvIHJldHVybiB2b2lkLCBzb1xyXG4gICAgLy8gbm90aGluZyBpcyBldmVyIGdvaW5nIHRvIGxvb2sgYXQgdGhlIHByb21pc2Ugd2UgcmV0dXJuIGhlcmUuXHJcbiAgICBhc3luYyBzZW5kKGNvbW1hbmRFbnZlbG9wZU9yTW9kZWw6IGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbENvbW1hbmRFbnZlbG9wZSB8IGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbENvbW1hbmRFbnZlbG9wZU1vZGVsKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgbGV0IGNvbW1hbmRFbnZlbG9wZSA9IGNvbW1hbmRFbnZlbG9wZU9yTW9kZWwgYXMgY29tbWFuZHNBbmRFdmVudHMuS2VybmVsQ29tbWFuZEVudmVsb3BlO1xyXG5cclxuICAgICAgICBpZiAoY29tbWFuZHNBbmRFdmVudHMuS2VybmVsQ29tbWFuZEVudmVsb3BlLmlzS2VybmVsQ29tbWFuZEVudmVsb3BlTW9kZWwoY29tbWFuZEVudmVsb3BlT3JNb2RlbCkpIHtcclxuICAgICAgICAgICAgTG9nZ2VyLmRlZmF1bHQud2FybihgQ29udmVydGluZyBjb21tYW5kIGVudmVsb3BlIG1vZGVsIHRvIGNvbW1hbmQgZW52ZWxvcGUgZm9yIGJhY2thd2FyZHMgY29tcGF0aWJpbGl0eS5gKTtcclxuICAgICAgICAgICAgY29tbWFuZEVudmVsb3BlID0gY29tbWFuZHNBbmRFdmVudHMuS2VybmVsQ29tbWFuZEVudmVsb3BlLmZyb21Kc29uKGNvbW1hbmRFbnZlbG9wZU9yTW9kZWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY29udGV4dCA9IEtlcm5lbEludm9jYXRpb25Db250ZXh0LmdldE9yQ3JlYXRlQW1iaWVudENvbnRleHQoY29tbWFuZEVudmVsb3BlKTtcclxuICAgICAgICBpZiAoY29udGV4dC5jb21tYW5kRW52ZWxvcGUpIHtcclxuICAgICAgICAgICAgaWYgKCFjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxDb21tYW5kRW52ZWxvcGUuYXJlQ29tbWFuZHNUaGVTYW1lKGNvbnRleHQuY29tbWFuZEVudmVsb3BlLCBjb21tYW5kRW52ZWxvcGUpKSB7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kRW52ZWxvcGUuc2V0UGFyZW50KGNvbnRleHQuY29tbWFuZEVudmVsb3BlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBrZXJuZWxVcmkgPSBnZXRLZXJuZWxVcmkodGhpcyk7XHJcbiAgICAgICAgaWYgKCFjb21tYW5kRW52ZWxvcGUucm91dGluZ1NsaXAuY29udGFpbnMoa2VybmVsVXJpKSkge1xyXG4gICAgICAgICAgICBjb21tYW5kRW52ZWxvcGUucm91dGluZ1NsaXAuc3RhbXBBc0Fycml2ZWQoa2VybmVsVXJpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBMb2dnZXIuZGVmYXVsdC53YXJuKGBUcnlpbmcgdG8gc3RhbXAgJHtjb21tYW5kRW52ZWxvcGUuY29tbWFuZFR5cGV9IGFzIGFycml2ZWQgYnV0IHVyaSAke2tlcm5lbFVyaX0gaXMgYWxyZWFkeSBwcmVzZW50LmApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U2NoZWR1bGVyKCkucnVuQXN5bmMoY29tbWFuZEVudmVsb3BlLCAodmFsdWUpID0+IHRoaXMuZXhlY3V0ZUNvbW1hbmQodmFsdWUpLmZpbmFsbHkoKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWNvbW1hbmRFbnZlbG9wZS5yb3V0aW5nU2xpcC5jb250YWlucyhrZXJuZWxVcmkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kRW52ZWxvcGUucm91dGluZ1NsaXAuc3RhbXAoa2VybmVsVXJpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIExvZ2dlci5kZWZhdWx0Lndhcm4oYFRyeWluZyB0byBzdGFtcCAke2NvbW1hbmRFbnZlbG9wZS5jb21tYW5kVHlwZX0gYXMgY29tcGxldGVkIGJ1dCB1cmkgJHtrZXJuZWxVcml9IGlzIGFscmVhZHkgcHJlc2VudC5gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFzeW5jIGV4ZWN1dGVDb21tYW5kKGNvbW1hbmRFbnZlbG9wZTogY29tbWFuZHNBbmRFdmVudHMuS2VybmVsQ29tbWFuZEVudmVsb3BlKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgbGV0IGNvbnRleHQgPSBLZXJuZWxJbnZvY2F0aW9uQ29udGV4dC5nZXRPckNyZWF0ZUFtYmllbnRDb250ZXh0KGNvbW1hbmRFbnZlbG9wZSk7XHJcbiAgICAgICAgbGV0IHByZXZpb3VzSGFuZGxpbmdLZXJuZWwgPSBjb250ZXh0LmhhbmRsaW5nS2VybmVsO1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmhhbmRsZUNvbW1hbmQoY29tbWFuZEVudmVsb3BlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgY29udGV4dC5mYWlsKChlIGFzIGFueSk/Lm1lc3NhZ2UgfHwgSlNPTi5zdHJpbmdpZnkoZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHtcclxuICAgICAgICAgICAgY29udGV4dC5oYW5kbGluZ0tlcm5lbCA9IHByZXZpb3VzSGFuZGxpbmdLZXJuZWw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldENvbW1hbmRIYW5kbGVyKGNvbW1hbmRUeXBlOiBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxDb21tYW5kVHlwZSk6IElLZXJuZWxDb21tYW5kSGFuZGxlciB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbW1hbmRIYW5kbGVycy5nZXQoY29tbWFuZFR5cGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUNvbW1hbmQoY29tbWFuZEVudmVsb3BlOiBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxDb21tYW5kRW52ZWxvcGUpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY29udGV4dCA9IEtlcm5lbEludm9jYXRpb25Db250ZXh0LmdldE9yQ3JlYXRlQW1iaWVudENvbnRleHQoY29tbWFuZEVudmVsb3BlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHByZXZpb3VkSGVuZGxpbmdLZXJuZWwgPSBjb250ZXh0LmhhbmRsaW5nS2VybmVsO1xyXG4gICAgICAgICAgICBjb250ZXh0LmhhbmRsaW5nS2VybmVsID0gdGhpcztcclxuICAgICAgICAgICAgbGV0IGlzUm9vdENvbW1hbmQgPSBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxDb21tYW5kRW52ZWxvcGUuYXJlQ29tbWFuZHNUaGVTYW1lKGNvbnRleHQuY29tbWFuZEVudmVsb3BlLCBjb21tYW5kRW52ZWxvcGUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGV2ZW50U3Vic2NyaXB0aW9uOiByeGpzLlN1YnNjcmlwdGlvbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICAgIGlmIChpc1Jvb3RDb21tYW5kKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBrZXJuZWxUeXBlID0gKHRoaXMua2VybmVsSW5mby5pc1Byb3h5ID8gXCJwcm94eVwiIDogXCJcIikgKyAodGhpcy5rZXJuZWxJbmZvLmlzQ29tcG9zaXRlID8gXCJjb21wb3NpdGVcIiA6IFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgTG9nZ2VyLmRlZmF1bHQuaW5mbyhga2VybmVsICR7dGhpcy5uYW1lfSBvZiB0eXBlICR7a2VybmVsVHlwZX0gc3Vic2NyaWJpbmcgdG8gY29udGV4dCBldmVudHNgKTtcclxuICAgICAgICAgICAgICAgIGV2ZW50U3Vic2NyaXB0aW9uID0gY29udGV4dC5rZXJuZWxFdmVudHMucGlwZShyeGpzLm1hcChlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gYGtlcm5lbCAke3RoaXMubmFtZX0gb2YgdHlwZSAke2tlcm5lbFR5cGV9IHNhdyBldmVudCAke2UuZXZlbnRUeXBlfSB3aXRoIHRva2VuICR7ZS5jb21tYW5kPy5nZXRUb2tlbigpfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTsvLz9cclxuICAgICAgICAgICAgICAgICAgICBMb2dnZXIuZGVmYXVsdC5pbmZvKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtlcm5lbFVyaSA9IGdldEtlcm5lbFVyaSh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWUucm91dGluZ1NsaXAuY29udGFpbnMoa2VybmVsVXJpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLnJvdXRpbmdTbGlwLnN0YW1wKGtlcm5lbFVyaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzaG91bGQgbm90IGdldCBoZXJlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlO1xyXG4gICAgICAgICAgICAgICAgfSkpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZSh0aGlzLnB1Ymxpc2hFdmVudC5iaW5kKHRoaXMpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGhhbmRsZXIgPSB0aGlzLmdldENvbW1hbmRIYW5kbGVyKGNvbW1hbmRFbnZlbG9wZS5jb21tYW5kVHlwZSk7XHJcbiAgICAgICAgICAgIGlmIChoYW5kbGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIExvZ2dlci5kZWZhdWx0LmluZm8oYGtlcm5lbCAke3RoaXMubmFtZX0gYWJvdXQgdG8gaGFuZGxlIGNvbW1hbmQ6ICR7SlNPTi5zdHJpbmdpZnkoY29tbWFuZEVudmVsb3BlKX1gKTtcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBoYW5kbGVyLmhhbmRsZSh7IGNvbW1hbmRFbnZlbG9wZTogY29tbWFuZEVudmVsb3BlLCBjb250ZXh0IH0pLmNhdGNoKGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBMb2dnZXIuZGVmYXVsdC5lcnJvcihgRXJyb3Igd2hlbiBoYW5kaW5nIGNvbW1hbmQgJHtjb21tYW5kRW52ZWxvcGV9OiAke2V9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5jb21wbGV0ZShjb21tYW5kRW52ZWxvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuaGFuZGxpbmdLZXJuZWwgPSBwcmV2aW91ZEhlbmRsaW5nS2VybmVsO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1Jvb3RDb21tYW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50U3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmRpc3Bvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgTG9nZ2VyLmRlZmF1bHQuaW5mbyhga2VybmVsICR7dGhpcy5uYW1lfSBkb25lIGhhbmRsaW5nIGNvbW1hbmQ6ICR7SlNPTi5zdHJpbmdpZnkoY29tbWFuZEVudmVsb3BlKX1gKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZmFpbCgoZSBhcyBhbnkpPy5tZXNzYWdlIHx8IEpTT04uc3RyaW5naWZ5KGUpKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmhhbmRsaW5nS2VybmVsID0gcHJldmlvdWRIZW5kbGluZ0tlcm5lbDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNSb290Q29tbWFuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudFN1YnNjcmlwdGlvbj8udW5zdWJzY3JpYmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGhhY2sgbGlrZSB0aGVyZSBpcyBubyB0b21vcnJvd1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hvdWxkTm9vcCA9IHRoaXMuc2hvdWxkTm9vcENvbW1hbmQoY29tbWFuZEVudmVsb3BlLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIGlmIChzaG91bGROb29wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5jb21wbGV0ZShjb21tYW5kRW52ZWxvcGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29udGV4dC5oYW5kbGluZ0tlcm5lbCA9IHByZXZpb3VkSGVuZGxpbmdLZXJuZWw7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNSb290Q29tbWFuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50U3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZGlzcG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFzaG91bGROb29wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgTm8gaGFuZGxlciBmb3VuZCBmb3IgY29tbWFuZCB0eXBlICR7Y29tbWFuZEVudmVsb3BlLmNvbW1hbmRUeXBlfWApKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTG9nZ2VyLmRlZmF1bHQud2Fybihga2VybmVsICR7dGhpcy5uYW1lfSBkb25lIG5vb3AgaGFuZGxpbmcgY29tbWFuZDogJHtKU09OLnN0cmluZ2lmeShjb21tYW5kRW52ZWxvcGUpfWApO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2hvdWxkTm9vcENvbW1hbmQoY29tbWFuZEVudmVsb3BlOiBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxDb21tYW5kRW52ZWxvcGUsIGNvbnRleHQ6IEtlcm5lbEludm9jYXRpb25Db250ZXh0KTogYm9vbGVhbiB7XHJcbiAgICAgICAgbGV0IHNob3VsZE5vb3AgPSBmYWxzZTtcclxuICAgICAgICBzd2l0Y2ggKGNvbW1hbmRFbnZlbG9wZS5jb21tYW5kVHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIGNvbW1hbmRzQW5kRXZlbnRzLlJlcXVlc3RDb21wbGV0aW9uc1R5cGU6XHJcbiAgICAgICAgICAgIGNhc2UgY29tbWFuZHNBbmRFdmVudHMuUmVxdWVzdFNpZ25hdHVyZUhlbHBUeXBlOlxyXG4gICAgICAgICAgICBjYXNlIGNvbW1hbmRzQW5kRXZlbnRzLlJlcXVlc3REaWFnbm9zdGljc1R5cGU6XHJcbiAgICAgICAgICAgIGNhc2UgY29tbWFuZHNBbmRFdmVudHMuUmVxdWVzdEhvdmVyVGV4dFR5cGU6XHJcbiAgICAgICAgICAgICAgICBzaG91bGROb29wID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgc2hvdWxkTm9vcCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzaG91bGROb29wO1xyXG4gICAgfVxyXG5cclxuICAgIHN1YnNjcmliZVRvS2VybmVsRXZlbnRzKG9ic2VydmVyOiBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxFdmVudEVudmVsb3BlT2JzZXJ2ZXIpOiBkaXNwb3NhYmxlcy5EaXNwb3NhYmxlU3Vic2NyaXB0aW9uIHtcclxuICAgICAgICBjb25zdCBzdWIgPSB0aGlzLl9ldmVudFN1YmplY3Quc3Vic2NyaWJlKG9ic2VydmVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZGlzcG9zZTogKCkgPT4geyBzdWIudW5zdWJzY3JpYmUoKTsgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNhbkhhbmRsZShjb21tYW5kRW52ZWxvcGU6IGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbENvbW1hbmRFbnZlbG9wZSkge1xyXG4gICAgICAgIGlmIChjb21tYW5kRW52ZWxvcGUuY29tbWFuZC50YXJnZXRLZXJuZWxOYW1lICYmIGNvbW1hbmRFbnZlbG9wZS5jb21tYW5kLnRhcmdldEtlcm5lbE5hbWUgIT09IHRoaXMubmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNvbW1hbmRFbnZlbG9wZS5jb21tYW5kLmRlc3RpbmF0aW9uVXJpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRVcmkgPSByb3V0aW5nc2xpcC5jcmVhdGVLZXJuZWxVcmkoY29tbWFuZEVudmVsb3BlLmNvbW1hbmQuZGVzdGluYXRpb25VcmkpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5rZXJuZWxJbmZvLnVyaSAhPT0gbm9ybWFsaXplZFVyaSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5zdXBwb3J0c0NvbW1hbmQoY29tbWFuZEVudmVsb3BlLmNvbW1hbmRUeXBlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdXBwb3J0c0NvbW1hbmQoY29tbWFuZFR5cGU6IGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbENvbW1hbmRUeXBlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbW1hbmRIYW5kbGVycy5oYXMoY29tbWFuZFR5cGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlZ2lzdGVyQ29tbWFuZEhhbmRsZXIoaGFuZGxlcjogSUtlcm5lbENvbW1hbmRIYW5kbGVyKTogdm9pZCB7XHJcbiAgICAgICAgLy8gV2hlbiBhIHJlZ2lzdHJhdGlvbiBhbHJlYWR5IGV4aXN0ZWQsIHdlIHdhbnQgdG8gb3ZlcndyaXRlIGl0IGJlY2F1c2Ugd2Ugd2FudCB1c2VycyB0b1xyXG4gICAgICAgIC8vIGJlIGFibGUgdG8gZGV2ZWxvcCBoYW5kbGVycyBpdGVyYXRpdmVseSwgYW5kIGl0IHdvdWxkIGJlIHVuaGVscGZ1bCBmb3IgaGFuZGxlciByZWdpc3RyYXRpb25cclxuICAgICAgICAvLyBmb3IgYW55IHBhcnRpY3VsYXIgY29tbWFuZCB0byBiZSBjdW11bGF0aXZlLlxyXG5cclxuICAgICAgICBjb25zdCBzaG91bGROb3RpZnkgPSAhdGhpcy5fY29tbWFuZEhhbmRsZXJzLmhhcyhoYW5kbGVyLmNvbW1hbmRUeXBlKTtcclxuICAgICAgICB0aGlzLl9pbnRlcm5hbFJlZ2lzdGVyQ29tbWFuZEhhbmRsZXIoaGFuZGxlcik7XHJcbiAgICAgICAgaWYgKHNob3VsZE5vdGlmeSkge1xyXG4gICAgICAgICAgICBjb25zdCBldmVudDogY29tbWFuZHNBbmRFdmVudHMuS2VybmVsSW5mb1Byb2R1Y2VkID0ge1xyXG4gICAgICAgICAgICAgICAga2VybmVsSW5mbzogdGhpcy5fa2VybmVsSW5mbyxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc3QgZW52ZWxvcGUgPSBuZXcgY29tbWFuZHNBbmRFdmVudHMuS2VybmVsRXZlbnRFbnZlbG9wZShcclxuICAgICAgICAgICAgICAgIGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbEluZm9Qcm9kdWNlZFR5cGUsXHJcbiAgICAgICAgICAgICAgICBldmVudCxcclxuICAgICAgICAgICAgICAgIEtlcm5lbEludm9jYXRpb25Db250ZXh0LmN1cnJlbnQ/LmNvbW1hbmRFbnZlbG9wZVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgZW52ZWxvcGUucm91dGluZ1NsaXAuc3RhbXAoZ2V0S2VybmVsVXJpKHRoaXMpKTtcclxuICAgICAgICAgICAgY29uc3QgY29udGV4dCA9IEtlcm5lbEludm9jYXRpb25Db250ZXh0LmN1cnJlbnQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29udGV4dCkge1xyXG4gICAgICAgICAgICAgICAgZW52ZWxvcGUuY29tbWFuZCA9IGNvbnRleHQuY29tbWFuZEVudmVsb3BlO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnRleHQucHVibGlzaChlbnZlbG9wZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnB1Ymxpc2hFdmVudChlbnZlbG9wZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfaW50ZXJuYWxSZWdpc3RlckNvbW1hbmRIYW5kbGVyKGhhbmRsZXI6IElLZXJuZWxDb21tYW5kSGFuZGxlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2NvbW1hbmRIYW5kbGVycy5zZXQoaGFuZGxlci5jb21tYW5kVHlwZSwgaGFuZGxlcik7XHJcbiAgICAgICAgdGhpcy5fa2VybmVsSW5mby5zdXBwb3J0ZWRLZXJuZWxDb21tYW5kcyA9IEFycmF5LmZyb20odGhpcy5fY29tbWFuZEhhbmRsZXJzLmtleXMoKSkubWFwKGNvbW1hbmROYW1lID0+ICh7IG5hbWU6IGNvbW1hbmROYW1lIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0SGFuZGxpbmdLZXJuZWwoY29tbWFuZEVudmVsb3BlOiBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxDb21tYW5kRW52ZWxvcGUsIGNvbnRleHQ/OiBLZXJuZWxJbnZvY2F0aW9uQ29udGV4dCB8IG51bGwpOiBLZXJuZWwgfCBudWxsIHtcclxuICAgICAgICBpZiAodGhpcy5jYW5IYW5kbGUoY29tbWFuZEVudmVsb3BlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb250ZXh0Py5mYWlsKGBDb21tYW5kICR7Y29tbWFuZEVudmVsb3BlLmNvbW1hbmRUeXBlfSBpcyBub3Qgc3VwcG9ydGVkIGJ5IEtlcm5lbCAke3RoaXMubmFtZX1gKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwdWJsaXNoRXZlbnQoa2VybmVsRXZlbnQ6IGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbEV2ZW50RW52ZWxvcGUpIHtcclxuICAgICAgICB0aGlzLl9ldmVudFN1YmplY3QubmV4dChrZXJuZWxFdmVudCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzdWJtaXRDb21tYW5kQW5kR2V0UmVzdWx0PFRFdmVudCBleHRlbmRzIGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbEV2ZW50PihrZXJuZWw6IEtlcm5lbCwgY29tbWFuZEVudmVsb3BlOiBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxDb21tYW5kRW52ZWxvcGUsIGV4cGVjdGVkRXZlbnRUeXBlOiBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxFdmVudFR5cGUpOiBQcm9taXNlPFRFdmVudD4ge1xyXG4gICAgbGV0IGNvbXBsZXRpb25Tb3VyY2UgPSBuZXcgUHJvbWlzZUNvbXBsZXRpb25Tb3VyY2U8VEV2ZW50PigpO1xyXG4gICAgbGV0IGhhbmRsZWQgPSBmYWxzZTtcclxuICAgIGxldCBkaXNwb3NhYmxlID0ga2VybmVsLnN1YnNjcmliZVRvS2VybmVsRXZlbnRzKGV2ZW50RW52ZWxvcGUgPT4ge1xyXG4gICAgICAgIGlmIChldmVudEVudmVsb3BlLmNvbW1hbmQ/LmdldFRva2VuKCkgPT09IGNvbW1hbmRFbnZlbG9wZS5nZXRUb2tlbigpKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoZXZlbnRFbnZlbG9wZS5ldmVudFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgY29tbWFuZHNBbmRFdmVudHMuQ29tbWFuZEZhaWxlZFR5cGU6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFoYW5kbGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXJyID0gZXZlbnRFbnZlbG9wZS5ldmVudCBhcyBjb21tYW5kc0FuZEV2ZW50cy5Db21tYW5kRmFpbGVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0aW9uU291cmNlLnJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgY29tbWFuZHNBbmRFdmVudHMuQ29tbWFuZFN1Y2NlZWRlZFR5cGU6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbENvbW1hbmRFbnZlbG9wZS5hcmVDb21tYW5kc1RoZVNhbWUoZXZlbnRFbnZlbG9wZS5jb21tYW5kISwgY29tbWFuZEVudmVsb3BlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWhhbmRsZWQpIHsvLz8gKCQgPyBldmVudEVudmVsb3BlIDoge30pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRpb25Tb3VyY2UucmVqZWN0KCdDb21tYW5kIHdhcyBoYW5kbGVkIGJlZm9yZSByZXBvcnRpbmcgZXhwZWN0ZWQgcmVzdWx0LicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50RW52ZWxvcGUuZXZlbnRUeXBlID09PSBleHBlY3RlZEV2ZW50VHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGV2ZW50ID0gZXZlbnRFbnZlbG9wZS5ldmVudCBhcyBURXZlbnQ7Ly8/ICgkID8gZXZlbnRFbnZlbG9wZSA6IHt9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0aW9uU291cmNlLnJlc29sdmUoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQga2VybmVsLnNlbmQoY29tbWFuZEVudmVsb3BlKTtcclxuICAgIH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIGRpc3Bvc2FibGUuZGlzcG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjb21wbGV0aW9uU291cmNlLnByb21pc2U7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRLZXJuZWxVcmkoa2VybmVsOiBLZXJuZWwpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGtlcm5lbC5rZXJuZWxJbmZvLnVyaSA/PyBga2VybmVsOi8vbG9jYWwvJHtrZXJuZWwua2VybmVsSW5mby5sb2NhbE5hbWV9YDtcclxufSIsIi8vIENvcHlyaWdodCAoYykgLk5FVCBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS4gU2VlIExJQ0VOU0UgZmlsZSBpbiB0aGUgcHJvamVjdCByb290IGZvciBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24uXHJcblxyXG5pbXBvcnQgKiBhcyByb3V0aW5nc2xpcCBmcm9tIFwiLi9yb3V0aW5nc2xpcFwiO1xyXG5pbXBvcnQgKiBhcyBjb21tYW5kc0FuZEV2ZW50cyBmcm9tIFwiLi9jb21tYW5kc0FuZEV2ZW50c1wiO1xyXG5pbXBvcnQgeyBnZXRLZXJuZWxVcmksIElLZXJuZWxDb21tYW5kSW52b2NhdGlvbiwgS2VybmVsIH0gZnJvbSBcIi4va2VybmVsXCI7XHJcbmltcG9ydCB7IEtlcm5lbEhvc3QgfSBmcm9tIFwiLi9rZXJuZWxIb3N0XCI7XHJcbmltcG9ydCB7IEtlcm5lbEludm9jYXRpb25Db250ZXh0IH0gZnJvbSBcIi4va2VybmVsSW52b2NhdGlvbkNvbnRleHRcIjtcclxuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4vbG9nZ2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29tcG9zaXRlS2VybmVsIGV4dGVuZHMgS2VybmVsIHtcclxuICAgIHByaXZhdGUgX2hvc3Q6IEtlcm5lbEhvc3QgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2RlZmF1bHRLZXJuZWxOYW1lc0J5Q29tbWFuZFR5cGU6IE1hcDxjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxDb21tYW5kVHlwZSwgc3RyaW5nPiA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICBkZWZhdWx0S2VybmVsTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgcHJpdmF0ZSBfY2hpbGRLZXJuZWxzOiBLZXJuZWxDb2xsZWN0aW9uO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIHRoaXMua2VybmVsSW5mby5pc0NvbXBvc2l0ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fY2hpbGRLZXJuZWxzID0gbmV3IEtlcm5lbENvbGxlY3Rpb24odGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNoaWxkS2VybmVscygpIHtcclxuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl9jaGlsZEtlcm5lbHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBob3N0KCk6IEtlcm5lbEhvc3QgfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faG9zdDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgaG9zdChob3N0OiBLZXJuZWxIb3N0IHwgbnVsbCkge1xyXG4gICAgICAgIHRoaXMuX2hvc3QgPSBob3N0O1xyXG4gICAgICAgIGlmICh0aGlzLl9ob3N0KSB7XHJcbiAgICAgICAgICAgIHRoaXMua2VybmVsSW5mby51cmkgPSB0aGlzLl9ob3N0LnVyaTtcclxuICAgICAgICAgICAgdGhpcy5fY2hpbGRLZXJuZWxzLm5vdGlmeVRoYXRIb3N0V2FzU2V0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBvdmVycmlkZSBhc3luYyBoYW5kbGVSZXF1ZXN0S2VybmVsSW5mbyhpbnZvY2F0aW9uOiBJS2VybmVsQ29tbWFuZEludm9jYXRpb24pOiBQcm9taXNlPHZvaWQ+IHtcclxuXHJcbiAgICAgICAgY29uc3QgZXZlbnRFbnZlbG9wZSA9IG5ldyBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxFdmVudEVudmVsb3BlKFxyXG4gICAgICAgICAgICBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxJbmZvUHJvZHVjZWRUeXBlLFxyXG4gICAgICAgICAgICB7IGtlcm5lbEluZm86IHRoaXMua2VybmVsSW5mbyB9IGFzIGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbEluZm9Qcm9kdWNlZCxcclxuICAgICAgICAgICAgaW52b2NhdGlvbi5jb21tYW5kRW52ZWxvcGVcclxuICAgICAgICApOy8vP1xyXG5cclxuICAgICAgICBpbnZvY2F0aW9uLmNvbnRleHQucHVibGlzaChldmVudEVudmVsb3BlKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQga2VybmVsIG9mIHRoaXMuX2NoaWxkS2VybmVscykge1xyXG4gICAgICAgICAgICBpZiAoa2VybmVsLnN1cHBvcnRzQ29tbWFuZChpbnZvY2F0aW9uLmNvbW1hbmRFbnZlbG9wZS5jb21tYW5kVHlwZSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkQ29tbWFuZCA9IG5ldyBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxDb21tYW5kRW52ZWxvcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZHNBbmRFdmVudHMuUmVxdWVzdEtlcm5lbEluZm9UeXBlLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0S2VybmVsTmFtZToga2VybmVsLmtlcm5lbEluZm8ubG9jYWxOYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZENvbW1hbmQuc2V0UGFyZW50KGludm9jYXRpb24uY29tbWFuZEVudmVsb3BlKTtcclxuICAgICAgICAgICAgICAgIGNoaWxkQ29tbWFuZC5yb3V0aW5nU2xpcC5jb250aW51ZVdpdGgoaW52b2NhdGlvbi5jb21tYW5kRW52ZWxvcGUucm91dGluZ1NsaXApO1xyXG4gICAgICAgICAgICAgICAgYXdhaXQga2VybmVsLmhhbmRsZUNvbW1hbmQoY2hpbGRDb21tYW5kKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhZGQoa2VybmVsOiBLZXJuZWwsIGFsaWFzZXM/OiBzdHJpbmdbXSkge1xyXG4gICAgICAgIGlmICgha2VybmVsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImtlcm5lbCBjYW5ub3QgYmUgbnVsbCBvciB1bmRlZmluZWRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuZGVmYXVsdEtlcm5lbE5hbWUpIHtcclxuICAgICAgICAgICAgLy8gZGVmYXVsdCB0byBmaXJzdCBrZXJuZWxcclxuICAgICAgICAgICAgdGhpcy5kZWZhdWx0S2VybmVsTmFtZSA9IGtlcm5lbC5uYW1lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAga2VybmVsLnBhcmVudEtlcm5lbCA9IHRoaXM7XHJcbiAgICAgICAga2VybmVsLnJvb3RLZXJuZWwgPSB0aGlzLnJvb3RLZXJuZWw7XHJcbiAgICAgICAga2VybmVsLmtlcm5lbEV2ZW50cy5zdWJzY3JpYmUoe1xyXG4gICAgICAgICAgICBuZXh0OiAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2ZW50Oy8vP1xyXG4gICAgICAgICAgICAgICAgY29uc3Qga2VybmVsVXJpID0gZ2V0S2VybmVsVXJpKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFldmVudC5yb3V0aW5nU2xpcC5jb250YWlucyhrZXJuZWxVcmkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucm91dGluZ1NsaXAuc3RhbXAoa2VybmVsVXJpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGV2ZW50Oy8vP1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wdWJsaXNoRXZlbnQoZXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChhbGlhc2VzKSB7XHJcbiAgICAgICAgICAgIGxldCBzZXQgPSBuZXcgU2V0KGFsaWFzZXMpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGtlcm5lbC5rZXJuZWxJbmZvLmFsaWFzZXMpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGFsaWFzIGluIGtlcm5lbC5rZXJuZWxJbmZvLmFsaWFzZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXQuYWRkKGFsaWFzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAga2VybmVsLmtlcm5lbEluZm8uYWxpYXNlcyA9IEFycmF5LmZyb20oc2V0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2NoaWxkS2VybmVscy5hZGQoa2VybmVsLCBhbGlhc2VzKTtcclxuXHJcbiAgICAgICAgY29uc3QgaW52b2NhdGlvbkNvbnRleHQgPSBLZXJuZWxJbnZvY2F0aW9uQ29udGV4dC5jdXJyZW50O1xyXG5cclxuICAgICAgICBpZiAoaW52b2NhdGlvbkNvbnRleHQpIHtcclxuICAgICAgICAgICAgaW52b2NhdGlvbkNvbnRleHQuY29tbWFuZEVudmVsb3BlO1xyXG4gICAgICAgICAgICBjb25zdCBldmVudCA9IG5ldyBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxFdmVudEVudmVsb3BlKFxyXG4gICAgICAgICAgICAgICAgY29tbWFuZHNBbmRFdmVudHMuS2VybmVsSW5mb1Byb2R1Y2VkVHlwZSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBrZXJuZWxJbmZvOiBrZXJuZWwua2VybmVsSW5mb1xyXG4gICAgICAgICAgICAgICAgfSBhcyBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxJbmZvUHJvZHVjZWQsXHJcbiAgICAgICAgICAgICAgICBpbnZvY2F0aW9uQ29udGV4dC5jb21tYW5kRW52ZWxvcGVcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgaW52b2NhdGlvbkNvbnRleHQucHVibGlzaChldmVudCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgZXZlbnQgPSBuZXcgY29tbWFuZHNBbmRFdmVudHMuS2VybmVsRXZlbnRFbnZlbG9wZShcclxuICAgICAgICAgICAgICAgIGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbEluZm9Qcm9kdWNlZFR5cGUsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAga2VybmVsSW5mbzoga2VybmVsLmtlcm5lbEluZm9cclxuICAgICAgICAgICAgICAgIH0gYXMgY29tbWFuZHNBbmRFdmVudHMuS2VybmVsSW5mb1Byb2R1Y2VkXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHRoaXMucHVibGlzaEV2ZW50KGV2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZmluZEtlcm5lbEJ5VXJpKHVyaTogc3RyaW5nKTogS2VybmVsIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBjb25zdCBub3JtYWxpemVkID0gcm91dGluZ3NsaXAuY3JlYXRlS2VybmVsVXJpKHVyaSk7XHJcbiAgICAgICAgaWYgKHRoaXMua2VybmVsSW5mby51cmkgPT09IG5vcm1hbGl6ZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jaGlsZEtlcm5lbHMudHJ5R2V0QnlVcmkobm9ybWFsaXplZCk7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZEtlcm5lbEJ5TmFtZShuYW1lOiBzdHJpbmcpOiBLZXJuZWwgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGlmICh0aGlzLmtlcm5lbEluZm8ubG9jYWxOYW1lID09PSBuYW1lIHx8IHRoaXMua2VybmVsSW5mby5hbGlhc2VzLmZpbmQoYSA9PiBhID09PSBuYW1lKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkS2VybmVscy50cnlHZXRCeUFsaWFzKG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmRLZXJuZWxzKHByZWRpY2F0ZTogKGtlcm5lbDogS2VybmVsKSA9PiBib29sZWFuKTogS2VybmVsW10ge1xyXG4gICAgICAgIHZhciByZXN1bHRzOiBLZXJuZWxbXSA9IFtdO1xyXG4gICAgICAgIGlmIChwcmVkaWNhdGUodGhpcykpIHtcclxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBrZXJuZWwgb2YgdGhpcy5jaGlsZEtlcm5lbHMpIHtcclxuICAgICAgICAgICAgaWYgKHByZWRpY2F0ZShrZXJuZWwpKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goa2VybmVsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0cztcclxuICAgIH1cclxuXHJcbiAgICBmaW5kS2VybmVsKHByZWRpY2F0ZTogKGtlcm5lbDogS2VybmVsKSA9PiBib29sZWFuKTogS2VybmVsIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBpZiAocHJlZGljYXRlKHRoaXMpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZEtlcm5lbHMuZmluZChwcmVkaWNhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldERlZmF1bHRUYXJnZXRLZXJuZWxOYW1lRm9yQ29tbWFuZChjb21tYW5kVHlwZTogY29tbWFuZHNBbmRFdmVudHMuS2VybmVsQ29tbWFuZFR5cGUsIGtlcm5lbE5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRLZXJuZWxOYW1lc0J5Q29tbWFuZFR5cGUuc2V0KGNvbW1hbmRUeXBlLCBrZXJuZWxOYW1lKTtcclxuICAgIH1cclxuICAgIG92ZXJyaWRlIGhhbmRsZUNvbW1hbmQoY29tbWFuZEVudmVsb3BlOiBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxDb21tYW5kRW52ZWxvcGUpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBpbnZvY2F0aW9uQ29udGV4dCA9IEtlcm5lbEludm9jYXRpb25Db250ZXh0LmN1cnJlbnQ7XHJcblxyXG4gICAgICAgIGxldCBrZXJuZWwgPSBjb21tYW5kRW52ZWxvcGUuY29tbWFuZC50YXJnZXRLZXJuZWxOYW1lID09PSB0aGlzLm5hbWVcclxuICAgICAgICAgICAgPyB0aGlzXHJcbiAgICAgICAgICAgIDogdGhpcy5nZXRIYW5kbGluZ0tlcm5lbChjb21tYW5kRW52ZWxvcGUsIGludm9jYXRpb25Db250ZXh0KTtcclxuXHJcbiAgICAgICAgY29uc3QgcHJldml1c29IYW5kbGluZ0tlcm5lbCA9IGludm9jYXRpb25Db250ZXh0Py5oYW5kbGluZ0tlcm5lbCA/PyBudWxsO1xyXG5cclxuICAgICAgICBpZiAoa2VybmVsID09PSB0aGlzKSB7XHJcbiAgICAgICAgICAgIGlmIChpbnZvY2F0aW9uQ29udGV4dCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgaW52b2NhdGlvbkNvbnRleHQuaGFuZGxpbmdLZXJuZWwgPSBrZXJuZWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZUNvbW1hbmQoY29tbWFuZEVudmVsb3BlKS5maW5hbGx5KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChpbnZvY2F0aW9uQ29udGV4dCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGludm9jYXRpb25Db250ZXh0LmhhbmRsaW5nS2VybmVsID0gcHJldml1c29IYW5kbGluZ0tlcm5lbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChrZXJuZWwpIHtcclxuICAgICAgICAgICAgaWYgKGludm9jYXRpb25Db250ZXh0ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpbnZvY2F0aW9uQ29udGV4dC5oYW5kbGluZ0tlcm5lbCA9IGtlcm5lbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBrZXJuZWxVcmkgPSBnZXRLZXJuZWxVcmkoa2VybmVsKTtcclxuICAgICAgICAgICAgaWYgKCFjb21tYW5kRW52ZWxvcGUucm91dGluZ1NsaXAuY29udGFpbnMoa2VybmVsVXJpKSkge1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZEVudmVsb3BlLnJvdXRpbmdTbGlwLnN0YW1wQXNBcnJpdmVkKGtlcm5lbFVyaSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBMb2dnZXIuZGVmYXVsdC53YXJuKGBUcnlpbmcgdG8gc3RhbXAgJHtjb21tYW5kRW52ZWxvcGUuY29tbWFuZFR5cGV9IGFzIGFycml2ZWQgYnV0IHVyaSAke2tlcm5lbFVyaX0gaXMgYWxyZWFkeSBwcmVzZW50LmApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBrZXJuZWwuaGFuZGxlQ29tbWFuZChjb21tYW5kRW52ZWxvcGUpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgTG9nZ2VyLmRlZmF1bHQuZXJyb3IoYEVycm9yIHdoZW4gaGFuZGluZyBjb21tYW5kICR7Y29tbWFuZEVudmVsb3BlfTogJHtlfWApO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5maW5hbGx5KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW52b2NhdGlvbkNvbnRleHQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW52b2NhdGlvbkNvbnRleHQuaGFuZGxpbmdLZXJuZWwgPSBwcmV2aXVzb0hhbmRsaW5nS2VybmVsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbW1hbmRFbnZlbG9wZS5yb3V0aW5nU2xpcC5jb250YWlucyhrZXJuZWxVcmkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmRFbnZlbG9wZS5yb3V0aW5nU2xpcC5zdGFtcChrZXJuZWxVcmkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIExvZ2dlci5kZWZhdWx0Lndhcm4oYFRyeWluZyB0byBzdGFtcCAke2NvbW1hbmRFbnZlbG9wZS5jb21tYW5kVHlwZX0gYXMgY29tcGxldGVkIGJ1dCB1cmkgJHtrZXJuZWxVcml9IGlzIGFscmVhZHkgcHJlc2VudC5gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpbnZvY2F0aW9uQ29udGV4dCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpbnZvY2F0aW9uQ29udGV4dC5oYW5kbGluZ0tlcm5lbCA9IHByZXZpdXNvSGFuZGxpbmdLZXJuZWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJLZXJuZWwgbm90IGZvdW5kOiBcIiArIGNvbW1hbmRFbnZlbG9wZS5jb21tYW5kLnRhcmdldEtlcm5lbE5hbWUpKTtcclxuICAgIH1cclxuXHJcbiAgICBvdmVycmlkZSBnZXRIYW5kbGluZ0tlcm5lbChjb21tYW5kRW52ZWxvcGU6IGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbENvbW1hbmRFbnZlbG9wZSwgY29udGV4dD86IEtlcm5lbEludm9jYXRpb25Db250ZXh0IHwgbnVsbCk6IEtlcm5lbCB8IG51bGwge1xyXG5cclxuICAgICAgICBsZXQga2VybmVsOiBLZXJuZWwgfCBudWxsID0gbnVsbDtcclxuICAgICAgICBpZiAoY29tbWFuZEVudmVsb3BlLmNvbW1hbmQuZGVzdGluYXRpb25VcmkpIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IHJvdXRpbmdzbGlwLmNyZWF0ZUtlcm5lbFVyaShjb21tYW5kRW52ZWxvcGUuY29tbWFuZC5kZXN0aW5hdGlvblVyaSk7XHJcbiAgICAgICAgICAgIGtlcm5lbCA9IHRoaXMuX2NoaWxkS2VybmVscy50cnlHZXRCeVVyaShub3JtYWxpemVkKSA/PyBudWxsO1xyXG4gICAgICAgICAgICBpZiAoa2VybmVsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ga2VybmVsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGFyZ2V0S2VybmVsTmFtZSA9IGNvbW1hbmRFbnZlbG9wZS5jb21tYW5kLnRhcmdldEtlcm5lbE5hbWU7XHJcblxyXG4gICAgICAgIGlmICh0YXJnZXRLZXJuZWxOYW1lID09PSB1bmRlZmluZWQgfHwgdGFyZ2V0S2VybmVsTmFtZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYW5IYW5kbGUoY29tbWFuZEVudmVsb3BlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRhcmdldEtlcm5lbE5hbWUgPSB0aGlzLl9kZWZhdWx0S2VybmVsTmFtZXNCeUNvbW1hbmRUeXBlLmdldChjb21tYW5kRW52ZWxvcGUuY29tbWFuZFR5cGUpID8/IHRoaXMuZGVmYXVsdEtlcm5lbE5hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGFyZ2V0S2VybmVsTmFtZSAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEtlcm5lbE5hbWUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAga2VybmVsID0gdGhpcy5fY2hpbGRLZXJuZWxzLnRyeUdldEJ5QWxpYXModGFyZ2V0S2VybmVsTmFtZSkgPz8gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0YXJnZXRLZXJuZWxOYW1lICYmICFrZXJuZWwpIHtcclxuICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gYEtlcm5lbCBub3QgZm91bmQ6ICR7dGFyZ2V0S2VybmVsTmFtZX1gO1xyXG4gICAgICAgICAgICBMb2dnZXIuZGVmYXVsdC5lcnJvcihlcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgha2VybmVsKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fY2hpbGRLZXJuZWxzLmNvdW50ID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBrZXJuZWwgPSB0aGlzLl9jaGlsZEtlcm5lbHMuc2luZ2xlKCkgPz8gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFrZXJuZWwpIHtcclxuICAgICAgICAgICAga2VybmVsID0gY29udGV4dD8uaGFuZGxpbmdLZXJuZWwgPz8gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGtlcm5lbCA/PyB0aGlzO1xyXG5cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgS2VybmVsQ29sbGVjdGlvbiBpbXBsZW1lbnRzIEl0ZXJhYmxlPEtlcm5lbD4ge1xyXG5cclxuICAgIHByaXZhdGUgX2NvbXBvc2l0ZUtlcm5lbDogQ29tcG9zaXRlS2VybmVsO1xyXG4gICAgcHJpdmF0ZSBfa2VybmVsczogS2VybmVsW10gPSBbXTtcclxuICAgIHByaXZhdGUgX25hbWVBbmRBbGlhc2VzQnlLZXJuZWw6IE1hcDxLZXJuZWwsIFNldDxzdHJpbmc+PiA9IG5ldyBNYXA8S2VybmVsLCBTZXQ8c3RyaW5nPj4oKTtcclxuICAgIHByaXZhdGUgX2tlcm5lbHNCeU5hbWVPckFsaWFzOiBNYXA8c3RyaW5nLCBLZXJuZWw+ID0gbmV3IE1hcDxzdHJpbmcsIEtlcm5lbD4oKTtcclxuICAgIHByaXZhdGUgX2tlcm5lbHNCeUxvY2FsVXJpOiBNYXA8c3RyaW5nLCBLZXJuZWw+ID0gbmV3IE1hcDxzdHJpbmcsIEtlcm5lbD4oKTtcclxuICAgIHByaXZhdGUgX2tlcm5lbHNCeVJlbW90ZVVyaTogTWFwPHN0cmluZywgS2VybmVsPiA9IG5ldyBNYXA8c3RyaW5nLCBLZXJuZWw+KCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29tcG9zaXRlS2VybmVsOiBDb21wb3NpdGVLZXJuZWwpIHtcclxuICAgICAgICB0aGlzLl9jb21wb3NpdGVLZXJuZWwgPSBjb21wb3NpdGVLZXJuZWw7XHJcbiAgICB9XHJcblxyXG4gICAgW1N5bWJvbC5pdGVyYXRvcl0oKTogSXRlcmF0b3I8S2VybmVsPiB7XHJcbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG5leHQ6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuX2tlcm5lbHNbY291bnRlcisrXSxcclxuICAgICAgICAgICAgICAgICAgICBkb25lOiBjb3VudGVyID4gdGhpcy5fa2VybmVscy5sZW5ndGhcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHNpbmdsZSgpOiBLZXJuZWwgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9rZXJuZWxzLmxlbmd0aCA9PT0gMSA/IHRoaXMuX2tlcm5lbHNbMF0gOiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBhZGQoa2VybmVsOiBLZXJuZWwsIGFsaWFzZXM/OiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLl9rZXJuZWxzQnlOYW1lT3JBbGlhcy5oYXMoa2VybmVsLm5hbWUpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihga2VybmVsIHdpdGggbmFtZSAke2tlcm5lbC5uYW1lfSBhbHJlYWR5IGV4aXN0c2ApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZUtlcm5lbEluZm9BbmRJbmRleChrZXJuZWwsIGFsaWFzZXMpO1xyXG4gICAgICAgIHRoaXMuX2tlcm5lbHMucHVzaChrZXJuZWwpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXQgY291bnQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fa2VybmVscy5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlS2VybmVsSW5mb0FuZEluZGV4KGtlcm5lbDogS2VybmVsLCBhbGlhc2VzPzogc3RyaW5nW10pOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKGFsaWFzZXMpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgYWxpYXMgb2YgYWxpYXNlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2tlcm5lbHNCeU5hbWVPckFsaWFzLmhhcyhhbGlhcykpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGtlcm5lbCB3aXRoIGFsaWFzICR7YWxpYXN9IGFscmVhZHkgZXhpc3RzYCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fbmFtZUFuZEFsaWFzZXNCeUtlcm5lbC5oYXMoa2VybmVsKSkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHNldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgYWxpYXMgb2Yga2VybmVsLmtlcm5lbEluZm8uYWxpYXNlcykge1xyXG4gICAgICAgICAgICAgICAgc2V0LmFkZChhbGlhcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGtlcm5lbC5rZXJuZWxJbmZvLmFsaWFzZXMgPSBBcnJheS5mcm9tKHNldCk7XHJcblxyXG4gICAgICAgICAgICBzZXQuYWRkKGtlcm5lbC5rZXJuZWxJbmZvLmxvY2FsTmFtZSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9uYW1lQW5kQWxpYXNlc0J5S2VybmVsLnNldChrZXJuZWwsIHNldCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChhbGlhc2VzKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGFsaWFzIG9mIGFsaWFzZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX25hbWVBbmRBbGlhc2VzQnlLZXJuZWwuZ2V0KGtlcm5lbCkhLmFkZChhbGlhcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX25hbWVBbmRBbGlhc2VzQnlLZXJuZWwuZ2V0KGtlcm5lbCk/LmZvckVhY2goYWxpYXMgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9rZXJuZWxzQnlOYW1lT3JBbGlhcy5zZXQoYWxpYXMsIGtlcm5lbCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBiYXNlVXJpID0gdGhpcy5fY29tcG9zaXRlS2VybmVsLmhvc3Q/LnVyaSB8fCB0aGlzLl9jb21wb3NpdGVLZXJuZWwua2VybmVsSW5mby51cmk7XHJcblxyXG4gICAgICAgIGlmICghYmFzZVVyaSEuZW5kc1dpdGgoXCIvXCIpKSB7XHJcbiAgICAgICAgICAgIGJhc2VVcmkgKz0gXCIvXCI7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBrZXJuZWwua2VybmVsSW5mby51cmkgPSByb3V0aW5nc2xpcC5jcmVhdGVLZXJuZWxVcmkoYCR7YmFzZVVyaX0ke2tlcm5lbC5rZXJuZWxJbmZvLmxvY2FsTmFtZX1gKTtcclxuICAgICAgICB0aGlzLl9rZXJuZWxzQnlMb2NhbFVyaS5zZXQoa2VybmVsLmtlcm5lbEluZm8udXJpLCBrZXJuZWwpO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKGtlcm5lbC5rZXJuZWxJbmZvLmlzUHJveHkpIHtcclxuICAgICAgICAgICAgdGhpcy5fa2VybmVsc0J5UmVtb3RlVXJpLnNldChrZXJuZWwua2VybmVsSW5mby5yZW1vdGVVcmkhLCBrZXJuZWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHJ5R2V0QnlBbGlhcyhhbGlhczogc3RyaW5nKTogS2VybmVsIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fa2VybmVsc0J5TmFtZU9yQWxpYXMuZ2V0KGFsaWFzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHJ5R2V0QnlVcmkodXJpOiBzdHJpbmcpOiBLZXJuZWwgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGxldCBrZXJuZWwgPSB0aGlzLl9rZXJuZWxzQnlMb2NhbFVyaS5nZXQodXJpKSB8fCB0aGlzLl9rZXJuZWxzQnlSZW1vdGVVcmkuZ2V0KHVyaSk7XHJcbiAgICAgICAgcmV0dXJuIGtlcm5lbDtcclxuICAgIH1cclxuXHJcbiAgICBub3RpZnlUaGF0SG9zdFdhc1NldCgpIHtcclxuICAgICAgICBmb3IgKGxldCBrZXJuZWwgb2YgdGhpcy5fa2VybmVscykge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUtlcm5lbEluZm9BbmRJbmRleChrZXJuZWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvLyBDb3B5cmlnaHQgKGMpIC5ORVQgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIGZpbGUgaW4gdGhlIHByb2plY3Qgcm9vdCBmb3IgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uLlxyXG5cclxuaW1wb3J0ICogYXMgcnhqcyBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQ29tcG9zaXRlS2VybmVsIH0gZnJvbSAnLi9jb21wb3NpdGVLZXJuZWwnO1xyXG5pbXBvcnQgKiBhcyBjb21tYW5kc0FuZEV2ZW50cyBmcm9tICcuL2NvbW1hbmRzQW5kRXZlbnRzJztcclxuaW1wb3J0ICogYXMgZGlzcG9zYWJsZXMgZnJvbSAnLi9kaXNwb3NhYmxlcyc7XHJcbmltcG9ydCB7IERpc3Bvc2FibGUgfSBmcm9tICcuL2Rpc3Bvc2FibGVzJztcclxuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi9sb2dnZXInO1xyXG5cclxuZXhwb3J0IHR5cGUgS2VybmVsQ29tbWFuZE9yRXZlbnRFbnZlbG9wZSA9IGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbENvbW1hbmRFbnZlbG9wZSB8IGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbEV2ZW50RW52ZWxvcGU7XHJcblxyXG5leHBvcnQgdHlwZSBLZXJuZWxDb21tYW5kT3JFdmVudEVudmVsb3BlTW9kZWwgPSBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxDb21tYW5kRW52ZWxvcGVNb2RlbCB8IGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbEV2ZW50RW52ZWxvcGVNb2RlbDtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0tlcm5lbENvbW1hbmRFbnZlbG9wZShjb21tYW5kT3JFdmVudDogS2VybmVsQ29tbWFuZE9yRXZlbnRFbnZlbG9wZSk6IGNvbW1hbmRPckV2ZW50IGlzIGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbENvbW1hbmRFbnZlbG9wZSB7XHJcbiAgICByZXR1cm4gKGNvbW1hbmRPckV2ZW50IGFzIGFueSkuY29tbWFuZFR5cGUgIT09IHVuZGVmaW5lZDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzS2VybmVsQ29tbWFuZEVudmVsb3BlTW9kZWwoY29tbWFuZE9yRXZlbnQ6IEtlcm5lbENvbW1hbmRPckV2ZW50RW52ZWxvcGVNb2RlbCk6IGNvbW1hbmRPckV2ZW50IGlzIGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbENvbW1hbmRFbnZlbG9wZU1vZGVsIHtcclxuICAgIHJldHVybiAoY29tbWFuZE9yRXZlbnQgYXMgYW55KS5jb21tYW5kVHlwZSAhPT0gdW5kZWZpbmVkO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNLZXJuZWxFdmVudEVudmVsb3BlKGNvbW1hbmRPckV2ZW50OiBLZXJuZWxDb21tYW5kT3JFdmVudEVudmVsb3BlKTogY29tbWFuZE9yRXZlbnQgaXMgY29tbWFuZHNBbmRFdmVudHMuS2VybmVsRXZlbnRFbnZlbG9wZSB7XHJcbiAgICByZXR1cm4gKGNvbW1hbmRPckV2ZW50IGFzIGFueSkuZXZlbnRUeXBlICE9PSB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0tlcm5lbEV2ZW50RW52ZWxvcGVNb2RlbChjb21tYW5kT3JFdmVudDogS2VybmVsQ29tbWFuZE9yRXZlbnRFbnZlbG9wZU1vZGVsKTogY29tbWFuZE9yRXZlbnQgaXMgY29tbWFuZHNBbmRFdmVudHMuS2VybmVsRXZlbnRFbnZlbG9wZU1vZGVsIHtcclxuICAgIHJldHVybiAoY29tbWFuZE9yRXZlbnQgYXMgYW55KS5ldmVudFR5cGUgIT09IHVuZGVmaW5lZDtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJS2VybmVsQ29tbWFuZEFuZEV2ZW50UmVjZWl2ZXIgZXh0ZW5kcyByeGpzLlN1YnNjcmliYWJsZTxLZXJuZWxDb21tYW5kT3JFdmVudEVudmVsb3BlPiB7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUtlcm5lbENvbW1hbmRBbmRFdmVudFNlbmRlciB7XHJcbiAgICBzZW5kKGtlcm5lbENvbW1hbmRPckV2ZW50RW52ZWxvcGU6IEtlcm5lbENvbW1hbmRPckV2ZW50RW52ZWxvcGUpOiBQcm9taXNlPHZvaWQ+O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgS2VybmVsQ29tbWFuZEFuZEV2ZW50UmVjZWl2ZXIgaW1wbGVtZW50cyBJS2VybmVsQ29tbWFuZEFuZEV2ZW50UmVjZWl2ZXIge1xyXG4gICAgcHJpdmF0ZSBfb2JzZXJ2YWJsZTogcnhqcy5TdWJzY3JpYmFibGU8S2VybmVsQ29tbWFuZE9yRXZlbnRFbnZlbG9wZT47XHJcbiAgICBwcml2YXRlIF9kaXNwb3NhYmxlczogZGlzcG9zYWJsZXMuRGlzcG9zYWJsZVtdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihvYnNlcnZlcjogcnhqcy5PYnNlcnZhYmxlPEtlcm5lbENvbW1hbmRPckV2ZW50RW52ZWxvcGU+KSB7XHJcbiAgICAgICAgdGhpcy5fb2JzZXJ2YWJsZSA9IG9ic2VydmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHN1YnNjcmliZShvYnNlcnZlcjogUGFydGlhbDxyeGpzLk9ic2VydmVyPEtlcm5lbENvbW1hbmRPckV2ZW50RW52ZWxvcGU+Pik6IHJ4anMuVW5zdWJzY3JpYmFibGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9vYnNlcnZhYmxlLnN1YnNjcmliZShvYnNlcnZlcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpc3Bvc2UoKTogdm9pZCB7XHJcbiAgICAgICAgZm9yIChsZXQgZGlzcG9zYWJsZSBvZiB0aGlzLl9kaXNwb3NhYmxlcykge1xyXG4gICAgICAgICAgICBkaXNwb3NhYmxlLmRpc3Bvc2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBGcm9tT2JzZXJ2YWJsZShvYnNlcnZhYmxlOiByeGpzLk9ic2VydmFibGU8S2VybmVsQ29tbWFuZE9yRXZlbnRFbnZlbG9wZT4pOiBJS2VybmVsQ29tbWFuZEFuZEV2ZW50UmVjZWl2ZXIge1xyXG4gICAgICAgIHJldHVybiBuZXcgS2VybmVsQ29tbWFuZEFuZEV2ZW50UmVjZWl2ZXIob2JzZXJ2YWJsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBGcm9tRXZlbnRMaXN0ZW5lcihhcmdzOiB7IG1hcDogKGRhdGE6IEV2ZW50KSA9PiBLZXJuZWxDb21tYW5kT3JFdmVudEVudmVsb3BlLCBldmVudFRhcmdldDogRXZlbnRUYXJnZXQsIGV2ZW50OiBzdHJpbmcgfSk6IElLZXJuZWxDb21tYW5kQW5kRXZlbnRSZWNlaXZlciB7XHJcbiAgICAgICAgbGV0IHN1YmplY3QgPSBuZXcgcnhqcy5TdWJqZWN0PEtlcm5lbENvbW1hbmRPckV2ZW50RW52ZWxvcGU+KCk7XHJcbiAgICAgICAgY29uc3QgbGlzdGVuZXIgPSAoZTogRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IG1hcHBlZCA9IGFyZ3MubWFwKGUpO1xyXG4gICAgICAgICAgICBzdWJqZWN0Lm5leHQobWFwcGVkKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGFyZ3MuZXZlbnRUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihhcmdzLmV2ZW50LCBsaXN0ZW5lcik7XHJcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IEtlcm5lbENvbW1hbmRBbmRFdmVudFJlY2VpdmVyKHN1YmplY3QpO1xyXG4gICAgICAgIHJldC5fZGlzcG9zYWJsZXMucHVzaCh7XHJcbiAgICAgICAgICAgIGRpc3Bvc2U6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGFyZ3MuZXZlbnRUYXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihhcmdzLmV2ZW50LCBsaXN0ZW5lcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBhcmdzLmV2ZW50VGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoYXJncy5ldmVudCwgbGlzdGVuZXIpO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzT2JzZXJ2YWJsZShzb3VyY2U6IGFueSk6IHNvdXJjZSBpcyByeGpzLk9ic2VydmVyPEtlcm5lbENvbW1hbmRPckV2ZW50RW52ZWxvcGU+IHtcclxuICAgIHJldHVybiAoc291cmNlIGFzIGFueSkubmV4dCAhPT0gdW5kZWZpbmVkO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgS2VybmVsQ29tbWFuZEFuZEV2ZW50U2VuZGVyIGltcGxlbWVudHMgSUtlcm5lbENvbW1hbmRBbmRFdmVudFNlbmRlciB7XHJcbiAgICBwcml2YXRlIF9zZW5kZXI/OiByeGpzLk9ic2VydmVyPEtlcm5lbENvbW1hbmRPckV2ZW50RW52ZWxvcGU+IHwgKChrZXJuZWxFdmVudEVudmVsb3BlOiBLZXJuZWxDb21tYW5kT3JFdmVudEVudmVsb3BlKSA9PiB2b2lkKTtcclxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcbiAgICBzZW5kKGtlcm5lbENvbW1hbmRPckV2ZW50RW52ZWxvcGU6IEtlcm5lbENvbW1hbmRPckV2ZW50RW52ZWxvcGUpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBpZiAodGhpcy5fc2VuZGVyKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbG9uZSA9IGtlcm5lbENvbW1hbmRPckV2ZW50RW52ZWxvcGUuY2xvbmUoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5fc2VuZGVyID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZW5kZXIoY2xvbmUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc09ic2VydmFibGUodGhpcy5fc2VuZGVyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0tlcm5lbENvbW1hbmRFbnZlbG9wZShrZXJuZWxDb21tYW5kT3JFdmVudEVudmVsb3BlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZW5kZXIubmV4dChjbG9uZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VuZGVyLm5leHQoY2xvbmUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlNlbmRlciBpcyBub3Qgc2V0XCIpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiU2VuZGVyIGlzIG5vdCBzZXRcIikpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgRnJvbU9ic2VydmVyKG9ic2VydmVyOiByeGpzLk9ic2VydmVyPEtlcm5lbENvbW1hbmRPckV2ZW50RW52ZWxvcGU+KTogSUtlcm5lbENvbW1hbmRBbmRFdmVudFNlbmRlciB7XHJcbiAgICAgICAgY29uc3Qgc2VuZGVyID0gbmV3IEtlcm5lbENvbW1hbmRBbmRFdmVudFNlbmRlcigpO1xyXG4gICAgICAgIHNlbmRlci5fc2VuZGVyID0gb2JzZXJ2ZXI7XHJcbiAgICAgICAgcmV0dXJuIHNlbmRlcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIEZyb21GdW5jdGlvbihzZW5kOiAoa2VybmVsRXZlbnRFbnZlbG9wZTogS2VybmVsQ29tbWFuZE9yRXZlbnRFbnZlbG9wZSkgPT4gdm9pZCk6IElLZXJuZWxDb21tYW5kQW5kRXZlbnRTZW5kZXIge1xyXG4gICAgICAgIGNvbnN0IHNlbmRlciA9IG5ldyBLZXJuZWxDb21tYW5kQW5kRXZlbnRTZW5kZXIoKTtcclxuICAgICAgICBzZW5kZXIuX3NlbmRlciA9IHNlbmQ7XHJcbiAgICAgICAgcmV0dXJuIHNlbmRlcjtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzU2V0T2ZTdHJpbmcoY29sbGVjdGlvbjogYW55KTogY29sbGVjdGlvbiBpcyBTZXQ8c3RyaW5nPiB7XHJcbiAgICByZXR1cm4gdHlwZW9mIChjb2xsZWN0aW9uKSAhPT0gdHlwZW9mIChuZXcgU2V0PHN0cmluZz4oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5T2ZTdHJpbmcoY29sbGVjdGlvbjogYW55KTogY29sbGVjdGlvbiBpcyBzdHJpbmdbXSB7XHJcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShjb2xsZWN0aW9uKSAmJiBjb2xsZWN0aW9uLmxlbmd0aCA+IDAgJiYgdHlwZW9mIChjb2xsZWN0aW9uWzBdKSA9PT0gdHlwZW9mIChcIlwiKTtcclxufVxyXG5cclxuY29uc3Qgb25LZXJuZWxJbmZvVXBkYXRlczogKChjb21wb3NpdGVLZXJuZWw6IENvbXBvc2l0ZUtlcm5lbCkgPT4gdm9pZClbXSA9IFtdO1xyXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJGb3JLZXJuZWxJbmZvVXBkYXRlcyhjYWxsYmFjazogKGNvbXBvc2l0ZUtlcm5lbDogQ29tcG9zaXRlS2VybmVsKSA9PiB2b2lkKSB7XHJcbiAgICBvbktlcm5lbEluZm9VcGRhdGVzLnB1c2goY2FsbGJhY2spO1xyXG59XHJcbmZ1bmN0aW9uIG5vdGlmeU9mS2VybmVsSW5mb1VwZGF0ZXMoY29tcG9zaXRlS2VybmVsOiBDb21wb3NpdGVLZXJuZWwpIHtcclxuICAgIGZvciAoY29uc3QgdXBkYXRlciBvZiBvbktlcm5lbEluZm9VcGRhdGVzKSB7XHJcbiAgICAgICAgdXBkYXRlcihjb21wb3NpdGVLZXJuZWwpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlT3JVcGRhdGVQcm94eUZvcktlcm5lbEluZm8oa2VybmVsSW5mbzogY29tbWFuZHNBbmRFdmVudHMuS2VybmVsSW5mbywgY29tcG9zaXRlS2VybmVsOiBDb21wb3NpdGVLZXJuZWwpIHtcclxuICAgIGlmIChrZXJuZWxJbmZvLmlzUHJveHkpIHtcclxuICAgICAgICBjb25zdCBob3N0ID0gZXh0cmFjdEhvc3RBbmROb21hbGl6ZShrZXJuZWxJbmZvLnJlbW90ZVVyaSEpO1xyXG4gICAgICAgIGlmIChob3N0ID09PSBleHRyYWN0SG9zdEFuZE5vbWFsaXplKGNvbXBvc2l0ZUtlcm5lbC5rZXJuZWxJbmZvLnVyaSkpIHtcclxuICAgICAgICAgICAgTG9nZ2VyLmRlZmF1bHQud2Fybihgc2tpcHBpbiBjcmVhdGlvbiBvZiBwcm94eSBmb3IgYSBwcm94eSBrZXJuZWwgOiBbJHtKU09OLnN0cmluZ2lmeShrZXJuZWxJbmZvKX1dYCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCB1cmlUb0xvb2t1cCA9IGtlcm5lbEluZm8uaXNQcm94eSA/IGtlcm5lbEluZm8ucmVtb3RlVXJpISA6IGtlcm5lbEluZm8udXJpO1xyXG4gICAgaWYgKHVyaVRvTG9va3VwKSB7XHJcbiAgICAgICAgbGV0IGtlcm5lbCA9IGNvbXBvc2l0ZUtlcm5lbC5maW5kS2VybmVsQnlVcmkodXJpVG9Mb29rdXApO1xyXG4gICAgICAgIGlmICgha2VybmVsKSB7XHJcbiAgICAgICAgICAgIC8vIGFkZFxyXG4gICAgICAgICAgICBpZiAoY29tcG9zaXRlS2VybmVsLmhvc3QpIHtcclxuICAgICAgICAgICAgICAgIExvZ2dlci5kZWZhdWx0LmluZm8oYGNyZWF0aW5nIHByb3h5IGZvciB1cmlbJHt1cmlUb0xvb2t1cH1dd2l0aCBpbmZvICR7SlNPTi5zdHJpbmdpZnkoa2VybmVsSW5mbyl9YCk7XHJcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3IgY2xhc2ggd2l0aCBga2VybmVsSW5mby5sb2NhbE5hbWVgXHJcbiAgICAgICAgICAgICAgICBrZXJuZWwgPSBjb21wb3NpdGVLZXJuZWwuaG9zdC5jb25uZWN0UHJveHlLZXJuZWwoa2VybmVsSW5mby5sb2NhbE5hbWUsIHVyaVRvTG9va3VwLCBrZXJuZWxJbmZvLmFsaWFzZXMpO1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlS2VybmVsSW5mbyhrZXJuZWwua2VybmVsSW5mbywga2VybmVsSW5mbyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGtlcm5lbCBob3N0IGZvdW5kJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBMb2dnZXIuZGVmYXVsdC5pbmZvKGBwYXRjaGluZyBwcm94eSBmb3IgdXJpWyR7dXJpVG9Mb29rdXB9XXdpdGggaW5mbyAke0pTT04uc3RyaW5naWZ5KGtlcm5lbEluZm8pfSBgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChrZXJuZWwua2VybmVsSW5mby5pc1Byb3h5KSB7XHJcbiAgICAgICAgICAgIC8vIHBhdGNoXHJcbiAgICAgICAgICAgIHVwZGF0ZUtlcm5lbEluZm8oa2VybmVsLmtlcm5lbEluZm8sIGtlcm5lbEluZm8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbm90aWZ5T2ZLZXJuZWxJbmZvVXBkYXRlcyhjb21wb3NpdGVLZXJuZWwpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNLZXJuZWxJbmZvRm9yUHJveHkoa2VybmVsSW5mbzogY29tbWFuZHNBbmRFdmVudHMuS2VybmVsSW5mbyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIGtlcm5lbEluZm8uaXNQcm94eTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUtlcm5lbEluZm8oZGVzdGluYXRpb246IGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbEluZm8sIHNvdXJjZTogY29tbWFuZHNBbmRFdmVudHMuS2VybmVsSW5mbykge1xyXG4gICAgZGVzdGluYXRpb24ubGFuZ3VhZ2VOYW1lID0gc291cmNlLmxhbmd1YWdlTmFtZSA/PyBkZXN0aW5hdGlvbi5sYW5ndWFnZU5hbWU7XHJcbiAgICBkZXN0aW5hdGlvbi5sYW5ndWFnZVZlcnNpb24gPSBzb3VyY2UubGFuZ3VhZ2VWZXJzaW9uID8/IGRlc3RpbmF0aW9uLmxhbmd1YWdlVmVyc2lvbjtcclxuICAgIGRlc3RpbmF0aW9uLmRpc3BsYXlOYW1lID0gc291cmNlLmRpc3BsYXlOYW1lO1xyXG4gICAgZGVzdGluYXRpb24uaXNDb21wb3NpdGUgPSBzb3VyY2UuaXNDb21wb3NpdGU7XHJcblxyXG4gICAgaWYgKGRlc3RpbmF0aW9uLmRlc2NyaXB0aW9uID09PSB1bmRlZmluZWQgfHwgZGVzdGluYXRpb24uZGVzY3JpcHRpb24gPT09IG51bGwgfHwgZGVzdGluYXRpb24uZGVzY3JpcHRpb24ubWF0Y2goL15cXHMqJC8pKSB7XHJcbiAgICAgICAgZGVzdGluYXRpb24uZGVzY3JpcHRpb24gPSBzb3VyY2UuZGVzY3JpcHRpb247XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNvdXJjZS5kaXNwbGF5TmFtZSkge1xyXG4gICAgICAgIGRlc3RpbmF0aW9uLmRpc3BsYXlOYW1lID0gc291cmNlLmRpc3BsYXlOYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHN1cHBvcnRlZENvbW1hbmRzID0gbmV3IFNldDxzdHJpbmc+KCk7XHJcblxyXG4gICAgaWYgKCFkZXN0aW5hdGlvbi5zdXBwb3J0ZWRLZXJuZWxDb21tYW5kcykge1xyXG4gICAgICAgIGRlc3RpbmF0aW9uLnN1cHBvcnRlZEtlcm5lbENvbW1hbmRzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChjb25zdCBzdXBwb3J0ZWRDb21tYW5kIG9mIGRlc3RpbmF0aW9uLnN1cHBvcnRlZEtlcm5lbENvbW1hbmRzKSB7XHJcbiAgICAgICAgc3VwcG9ydGVkQ29tbWFuZHMuYWRkKHN1cHBvcnRlZENvbW1hbmQubmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChjb25zdCBzdXBwb3J0ZWRDb21tYW5kIG9mIHNvdXJjZS5zdXBwb3J0ZWRLZXJuZWxDb21tYW5kcykge1xyXG4gICAgICAgIGlmICghc3VwcG9ydGVkQ29tbWFuZHMuaGFzKHN1cHBvcnRlZENvbW1hbmQubmFtZSkpIHtcclxuICAgICAgICAgICAgc3VwcG9ydGVkQ29tbWFuZHMuYWRkKHN1cHBvcnRlZENvbW1hbmQubmFtZSk7XHJcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uLnN1cHBvcnRlZEtlcm5lbENvbW1hbmRzLnB1c2goc3VwcG9ydGVkQ29tbWFuZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ29ubmVjdG9yIGltcGxlbWVudHMgRGlzcG9zYWJsZSB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9saXN0ZW5lcjogcnhqcy5VbnN1YnNjcmliYWJsZTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3JlY2VpdmVyOiBJS2VybmVsQ29tbWFuZEFuZEV2ZW50UmVjZWl2ZXI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9zZW5kZXI6IElLZXJuZWxDb21tYW5kQW5kRXZlbnRTZW5kZXI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9yZW1vdGVVcmlzOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgcmVtb3RlSG9zdFVyaXMoKTogc3RyaW5nW10ge1xyXG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuX3JlbW90ZVVyaXMudmFsdWVzKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2VuZGVyKCk6IElLZXJuZWxDb21tYW5kQW5kRXZlbnRTZW5kZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zZW5kZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCByZWNlaXZlcigpOiBJS2VybmVsQ29tbWFuZEFuZEV2ZW50UmVjZWl2ZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZWNlaXZlcjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWd1cmF0aW9uOiB7IHJlY2VpdmVyOiBJS2VybmVsQ29tbWFuZEFuZEV2ZW50UmVjZWl2ZXIsIHNlbmRlcjogSUtlcm5lbENvbW1hbmRBbmRFdmVudFNlbmRlciwgcmVtb3RlVXJpcz86IHN0cmluZ1tdIH0pIHtcclxuICAgICAgICB0aGlzLl9yZWNlaXZlciA9IGNvbmZpZ3VyYXRpb24ucmVjZWl2ZXI7XHJcbiAgICAgICAgdGhpcy5fc2VuZGVyID0gY29uZmlndXJhdGlvbi5zZW5kZXI7XHJcbiAgICAgICAgaWYgKGNvbmZpZ3VyYXRpb24ucmVtb3RlVXJpcykge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJlbW90ZVVyaSBvZiBjb25maWd1cmF0aW9uLnJlbW90ZVVyaXMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHVyaSA9IGV4dHJhY3RIb3N0QW5kTm9tYWxpemUocmVtb3RlVXJpKTtcclxuICAgICAgICAgICAgICAgIGlmICh1cmkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdGVVcmlzLmFkZCh1cmkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9saXN0ZW5lciA9IHRoaXMuX3JlY2VpdmVyLnN1YnNjcmliZSh7XHJcbiAgICAgICAgICAgIG5leHQ6IChrZXJuZWxDb21tYW5kT3JFdmVudEVudmVsb3BlOiBLZXJuZWxDb21tYW5kT3JFdmVudEVudmVsb3BlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNLZXJuZWxFdmVudEVudmVsb3BlKGtlcm5lbENvbW1hbmRPckV2ZW50RW52ZWxvcGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtlcm5lbENvbW1hbmRPckV2ZW50RW52ZWxvcGUuZXZlbnRUeXBlID09PSBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxJbmZvUHJvZHVjZWRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50ID0ga2VybmVsQ29tbWFuZE9yRXZlbnRFbnZlbG9wZS5ldmVudCBhcyBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxJbmZvUHJvZHVjZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZXZlbnQua2VybmVsSW5mby5yZW1vdGVVcmkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVyaSA9IGV4dHJhY3RIb3N0QW5kTm9tYWxpemUoZXZlbnQua2VybmVsSW5mby51cmkhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1cmkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdGVVcmlzLmFkZCh1cmkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50Um91dGluZ1NsaXAgPSBrZXJuZWxDb21tYW5kT3JFdmVudEVudmVsb3BlLnJvdXRpbmdTbGlwLnRvQXJyYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoKGV2ZW50Um91dGluZ1NsaXAubGVuZ3RoID8/IDApID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBldmVudE9yaWdpbiA9IGV2ZW50Um91dGluZ1NsaXAhWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1cmkgPSBleHRyYWN0SG9zdEFuZE5vbWFsaXplKGV2ZW50T3JpZ2luKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVyaSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVtb3RlVXJpcy5hZGQodXJpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRSZW1vdGVIb3N0VXJpKHJlbW90ZVVyaTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gZXh0cmFjdEhvc3RBbmROb21hbGl6ZShyZW1vdGVVcmkpO1xyXG4gICAgICAgIGlmICh1cmkpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVtb3RlVXJpcy5hZGQodXJpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNhblJlYWNoKHJlbW90ZVVyaTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgaG9zdCA9IGV4dHJhY3RIb3N0QW5kTm9tYWxpemUocmVtb3RlVXJpKTsvLz9cclxuICAgICAgICBpZiAoaG9zdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVtb3RlVXJpcy5oYXMoaG9zdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGRpc3Bvc2UoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fbGlzdGVuZXIudW5zdWJzY3JpYmUoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RIb3N0QW5kTm9tYWxpemUoa2VybmVsVXJpOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgZmlsdGVyOiBSZWdFeHAgPSAvKD88aG9zdD4uKzpcXC9cXC9bXlxcL10rKShcXC9bXlxcL10pKi9naTtcclxuICAgIGNvbnN0IG1hdGNoID0gZmlsdGVyLmV4ZWMoa2VybmVsVXJpKTsgLy8/XHJcbiAgICBpZiAobWF0Y2g/Lmdyb3Vwcz8uaG9zdCkge1xyXG4gICAgICAgIGNvbnN0IGhvc3QgPSBtYXRjaC5ncm91cHMuaG9zdDtcclxuICAgICAgICByZXR1cm4gaG9zdDsvLz9cclxuICAgIH1cclxuICAgIHJldHVybiBcIlwiO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gU2VyaWFsaXplPFQ+KHNvdXJjZTogVCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoc291cmNlLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgIC8vaGFuZGxpbmcgTmFOLCBJbmZpbml0eSBhbmQgLUluZmluaXR5XHJcbiAgICAgICAgY29uc3QgcHJvY2Vzc2VkID0gU2VyaWFsaXplTnVtYmVyTGl0ZXJhbHModmFsdWUpO1xyXG4gICAgICAgIHJldHVybiBwcm9jZXNzZWQ7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFNlcmlhbGl6ZU51bWJlckxpdGVyYWxzKHZhbHVlOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgaWYgKHZhbHVlICE9PSB2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiBcIk5hTlwiO1xyXG4gICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gSW5maW5pdHkpIHtcclxuICAgICAgICByZXR1cm4gXCJJbmZpbml0eVwiO1xyXG4gICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gLUluZmluaXR5KSB7XHJcbiAgICAgICAgcmV0dXJuIFwiLUluZmluaXR5XCI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBEZXNlcmlhbGl6ZShqc29uOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoanNvbiwgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICAgICAvL2hhbmRsaW5nIE5hTiwgSW5maW5pdHkgYW5kIC1JbmZpbml0eVxyXG4gICAgICAgIGNvbnN0IGRlc2VyaWFsaXplZCA9IERlc2VyaWFsaXplTnVtYmVyTGl0ZXJhbHModmFsdWUpO1xyXG4gICAgICAgIHJldHVybiBkZXNlcmlhbGl6ZWQ7XHJcbiAgICB9KTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBEZXNlcmlhbGl6ZU51bWJlckxpdGVyYWxzKHZhbHVlOiBhbnkpOiBhbnkge1xyXG4gICAgaWYgKHZhbHVlID09PSBcIk5hTlwiKSB7XHJcbiAgICAgICAgcmV0dXJuIE5hTjtcclxuICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IFwiSW5maW5pdHlcIikge1xyXG4gICAgICAgIHJldHVybiBJbmZpbml0eTtcclxuICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IFwiLUluZmluaXR5XCIpIHtcclxuICAgICAgICByZXR1cm4gLUluZmluaXR5O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XHJcbiIsIi8vIENvcHlyaWdodCAoYykgLk5FVCBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS4gU2VlIExJQ0VOU0UgZmlsZSBpbiB0aGUgcHJvamVjdCByb290IGZvciBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24uXHJcblxyXG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gXCJ1dGlsXCI7XHJcbmltcG9ydCAqIGFzIGNvbm5lY3Rpb24gZnJvbSBcIi4vY29ubmVjdGlvblwiO1xyXG5pbXBvcnQgKiBhcyBjb21tYW5kc0FuZEV2ZW50cyBmcm9tIFwiLi9jb21tYW5kc0FuZEV2ZW50c1wiO1xyXG5pbXBvcnQgeyBLZXJuZWxJbnZvY2F0aW9uQ29udGV4dCB9IGZyb20gXCIuL2tlcm5lbEludm9jYXRpb25Db250ZXh0XCI7XHJcbmltcG9ydCAqIGFzIGRpc3Bvc2FibGVzIGZyb20gXCIuL2Rpc3Bvc2FibGVzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29uc29sZUNhcHR1cmUgaW1wbGVtZW50cyBkaXNwb3NhYmxlcy5EaXNwb3NhYmxlIHtcclxuICAgIHByaXZhdGUgb3JpZ2luYWxDb25zb2xlOiBDb25zb2xlO1xyXG4gICAgcHJpdmF0ZSBfa2VybmVsSW52b2NhdGlvbkNvbnRleHQ6IEtlcm5lbEludm9jYXRpb25Db250ZXh0IHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMub3JpZ2luYWxDb25zb2xlID0gY29uc29sZTtcclxuICAgICAgICBjb25zb2xlID0gdGhpcyBhcyBhbnkgYXMgQ29uc29sZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQga2VybmVsSW52b2NhdGlvbkNvbnRleHQodmFsdWU6IEtlcm5lbEludm9jYXRpb25Db250ZXh0IHwgdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5fa2VybmVsSW52b2NhdGlvbkNvbnRleHQgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBhc3NlcnQodmFsdWU6IGFueSwgbWVzc2FnZT86IHN0cmluZywgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbENvbnNvbGUuYXNzZXJ0KHZhbHVlLCBtZXNzYWdlLCBvcHRpb25hbFBhcmFtcyk7XHJcbiAgICB9XHJcbiAgICBjbGVhcigpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm9yaWdpbmFsQ29uc29sZS5jbGVhcigpO1xyXG4gICAgfVxyXG4gICAgY291bnQobGFiZWw/OiBhbnkpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm9yaWdpbmFsQ29uc29sZS5jb3VudChsYWJlbCk7XHJcbiAgICB9XHJcbiAgICBjb3VudFJlc2V0KGxhYmVsPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbENvbnNvbGUuY291bnRSZXNldChsYWJlbCk7XHJcbiAgICB9XHJcbiAgICBkZWJ1ZyhtZXNzYWdlPzogYW55LCAuLi5vcHRpb25hbFBhcmFtczogYW55W10pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm9yaWdpbmFsQ29uc29sZS5kZWJ1ZyhtZXNzYWdlLCBvcHRpb25hbFBhcmFtcyk7XHJcbiAgICB9XHJcbiAgICBkaXIob2JqOiBhbnksIG9wdGlvbnM/OiB1dGlsLkluc3BlY3RPcHRpb25zKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbENvbnNvbGUuZGlyKG9iaiwgb3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBkaXJ4bWwoLi4uZGF0YTogYW55W10pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm9yaWdpbmFsQ29uc29sZS5kaXJ4bWwoZGF0YSk7XHJcbiAgICB9XHJcbiAgICBlcnJvcihtZXNzYWdlPzogYW55LCAuLi5vcHRpb25hbFBhcmFtczogYW55W10pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnJlZGlyZWN0QW5kUHVibGlzaCh0aGlzLm9yaWdpbmFsQ29uc29sZS5lcnJvciwgLi4uW21lc3NhZ2UsIC4uLm9wdGlvbmFsUGFyYW1zXSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ3JvdXAoLi4ubGFiZWw6IGFueVtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbENvbnNvbGUuZ3JvdXAobGFiZWwpO1xyXG4gICAgfVxyXG4gICAgZ3JvdXBDb2xsYXBzZWQoLi4ubGFiZWw6IGFueVtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbENvbnNvbGUuZ3JvdXBDb2xsYXBzZWQobGFiZWwpO1xyXG4gICAgfVxyXG4gICAgZ3JvdXBFbmQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbENvbnNvbGUuZ3JvdXBFbmQoKTtcclxuICAgIH1cclxuICAgIGluZm8obWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZWRpcmVjdEFuZFB1Ymxpc2godGhpcy5vcmlnaW5hbENvbnNvbGUuaW5mbywgLi4uW21lc3NhZ2UsIC4uLm9wdGlvbmFsUGFyYW1zXSk7XHJcbiAgICB9XHJcbiAgICBsb2cobWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZWRpcmVjdEFuZFB1Ymxpc2godGhpcy5vcmlnaW5hbENvbnNvbGUubG9nLCAuLi5bbWVzc2FnZSwgLi4ub3B0aW9uYWxQYXJhbXNdKTtcclxuICAgIH1cclxuXHJcbiAgICB0YWJsZSh0YWJ1bGFyRGF0YTogYW55LCBwcm9wZXJ0aWVzPzogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm9yaWdpbmFsQ29uc29sZS50YWJsZSh0YWJ1bGFyRGF0YSwgcHJvcGVydGllcyk7XHJcbiAgICB9XHJcbiAgICB0aW1lKGxhYmVsPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbENvbnNvbGUudGltZShsYWJlbCk7XHJcbiAgICB9XHJcbiAgICB0aW1lRW5kKGxhYmVsPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbENvbnNvbGUudGltZUVuZChsYWJlbCk7XHJcbiAgICB9XHJcbiAgICB0aW1lTG9nKGxhYmVsPzogc3RyaW5nLCAuLi5kYXRhOiBhbnlbXSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMub3JpZ2luYWxDb25zb2xlLnRpbWVMb2cobGFiZWwsIGRhdGEpO1xyXG4gICAgfVxyXG4gICAgdGltZVN0YW1wKGxhYmVsPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbENvbnNvbGUudGltZVN0YW1wKGxhYmVsKTtcclxuICAgIH1cclxuICAgIHRyYWNlKG1lc3NhZ2U/OiBhbnksIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVkaXJlY3RBbmRQdWJsaXNoKHRoaXMub3JpZ2luYWxDb25zb2xlLnRyYWNlLCAuLi5bbWVzc2FnZSwgLi4ub3B0aW9uYWxQYXJhbXNdKTtcclxuICAgIH1cclxuICAgIHdhcm4obWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbENvbnNvbGUud2FybihtZXNzYWdlLCBvcHRpb25hbFBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvZmlsZShsYWJlbD86IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMub3JpZ2luYWxDb25zb2xlLnByb2ZpbGUobGFiZWwpO1xyXG4gICAgfVxyXG4gICAgcHJvZmlsZUVuZChsYWJlbD86IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMub3JpZ2luYWxDb25zb2xlLnByb2ZpbGVFbmQobGFiZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc3Bvc2UoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZSA9IHRoaXMub3JpZ2luYWxDb25zb2xlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVkaXJlY3RBbmRQdWJsaXNoKHRhcmdldDogKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkLCAuLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9rZXJuZWxJbnZvY2F0aW9uQ29udGV4dCkge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGFyZyBvZiBhcmdzKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWltZVR5cGU6IHN0cmluZztcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZTogc3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmcgIT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KGFyZykpIHtcclxuICAgICAgICAgICAgICAgICAgICBtaW1lVHlwZSA9ICd0ZXh0L3BsYWluJztcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGFyZz8udG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWltZVR5cGUgPSAnYXBwbGljYXRpb24vanNvbic7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjb25uZWN0aW9uLlNlcmlhbGl6ZShhcmcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGRpc3BsYXllZFZhbHVlOiBjb21tYW5kc0FuZEV2ZW50cy5EaXNwbGF5ZWRWYWx1ZVByb2R1Y2VkID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlZFZhbHVlczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW1lVHlwZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VwcHJlc3NEaXNwbGF5OiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50RW52ZWxvcGUgPSBuZXcgY29tbWFuZHNBbmRFdmVudHMuS2VybmVsRXZlbnRFbnZlbG9wZShcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kc0FuZEV2ZW50cy5EaXNwbGF5ZWRWYWx1ZVByb2R1Y2VkVHlwZSxcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5ZWRWYWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXJuZWxJbnZvY2F0aW9uQ29udGV4dC5jb21tYW5kRW52ZWxvcGVcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5fa2VybmVsSW52b2NhdGlvbkNvbnRleHQucHVibGlzaChldmVudEVudmVsb3BlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRhcmdldCguLi5hcmdzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLyBDb3B5cmlnaHQgKGMpIC5ORVQgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIGZpbGUgaW4gdGhlIHByb2plY3Qgcm9vdCBmb3IgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uLlxyXG5cclxuaW1wb3J0ICogYXMgY29tbWFuZHNBbmRFdmVudHMgZnJvbSBcIi4vY29tbWFuZHNBbmRFdmVudHNcIjtcclxuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4vbG9nZ2VyXCI7XHJcbmltcG9ydCB7IEtlcm5lbCwgSUtlcm5lbENvbW1hbmRIYW5kbGVyLCBJS2VybmVsQ29tbWFuZEludm9jYXRpb24sIGdldEtlcm5lbFVyaSB9IGZyb20gXCIuL2tlcm5lbFwiO1xyXG5pbXBvcnQgKiBhcyBjb25uZWN0aW9uIGZyb20gXCIuL2Nvbm5lY3Rpb25cIjtcclxuaW1wb3J0ICogYXMgcm91dGluZ1NsaXAgZnJvbSBcIi4vcm91dGluZ3NsaXBcIjtcclxuaW1wb3J0IHsgUHJvbWlzZUNvbXBsZXRpb25Tb3VyY2UgfSBmcm9tIFwiLi9wcm9taXNlQ29tcGxldGlvblNvdXJjZVwiO1xyXG5pbXBvcnQgeyBLZXJuZWxJbnZvY2F0aW9uQ29udGV4dCB9IGZyb20gXCIuL2tlcm5lbEludm9jYXRpb25Db250ZXh0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUHJveHlLZXJuZWwgZXh0ZW5kcyBLZXJuZWwge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG92ZXJyaWRlIHJlYWRvbmx5IG5hbWU6IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSBfc2VuZGVyOiBjb25uZWN0aW9uLklLZXJuZWxDb21tYW5kQW5kRXZlbnRTZW5kZXIsIHByaXZhdGUgcmVhZG9ubHkgX3JlY2VpdmVyOiBjb25uZWN0aW9uLklLZXJuZWxDb21tYW5kQW5kRXZlbnRSZWNlaXZlciwgbGFuZ3VhZ2VOYW1lPzogc3RyaW5nLCBsYW5ndWFnZVZlcnNpb24/OiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihuYW1lLCBsYW5ndWFnZU5hbWUsIGxhbmd1YWdlVmVyc2lvbik7XHJcbiAgICAgICAgdGhpcy5rZXJuZWxJbmZvLmlzUHJveHkgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIG92ZXJyaWRlIGdldENvbW1hbmRIYW5kbGVyKGNvbW1hbmRUeXBlOiBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxDb21tYW5kVHlwZSk6IElLZXJuZWxDb21tYW5kSGFuZGxlciB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY29tbWFuZFR5cGUsXHJcbiAgICAgICAgICAgIGhhbmRsZTogKGludm9jYXRpb24pID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb21tYW5kSGFuZGxlcihpbnZvY2F0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZWxlZ2F0ZVB1YmxpY2F0aW9uKGVudmVsb3BlOiBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxFdmVudEVudmVsb3BlLCBpbnZvY2F0aW9uQ29udGV4dDogS2VybmVsSW52b2NhdGlvbkNvbnRleHQpOiB2b2lkIHtcclxuICAgICAgICBsZXQgYWxyZWFkeUJlZW5TZWVuID0gZmFsc2U7XHJcbiAgICAgICAgY29uc3Qga2VybmVsVXJpID0gZ2V0S2VybmVsVXJpKHRoaXMpO1xyXG4gICAgICAgIGlmIChrZXJuZWxVcmkgJiYgIWVudmVsb3BlLnJvdXRpbmdTbGlwLmNvbnRhaW5zKGtlcm5lbFVyaSkpIHtcclxuICAgICAgICAgICAgZW52ZWxvcGUucm91dGluZ1NsaXAuc3RhbXAoa2VybmVsVXJpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhbHJlYWR5QmVlblNlZW4gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaGFzU2FtZU9yaWdpbihlbnZlbG9wZSkpIHtcclxuICAgICAgICAgICAgaWYgKCFhbHJlYWR5QmVlblNlZW4pIHtcclxuICAgICAgICAgICAgICAgIGludm9jYXRpb25Db250ZXh0LnB1Ymxpc2goZW52ZWxvcGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGFzU2FtZU9yaWdpbihlbnZlbG9wZTogY29tbWFuZHNBbmRFdmVudHMuS2VybmVsRXZlbnRFbnZlbG9wZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCBjb21tYW5kT3JpZ2luVXJpID0gZW52ZWxvcGUuY29tbWFuZD8uY29tbWFuZD8ub3JpZ2luVXJpID8/IHRoaXMua2VybmVsSW5mby51cmk7XHJcbiAgICAgICAgaWYgKGNvbW1hbmRPcmlnaW5VcmkgPT09IHRoaXMua2VybmVsSW5mby51cmkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY29tbWFuZE9yaWdpblVyaSA9PT0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZUtlcm5lbEluZm9Gcm9tRXZlbnQoa2VybmVsSW5mb1Byb2R1Y2VkOiBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxJbmZvUHJvZHVjZWQpIHtcclxuICAgICAgICBjb25uZWN0aW9uLnVwZGF0ZUtlcm5lbEluZm8odGhpcy5rZXJuZWxJbmZvLCBrZXJuZWxJbmZvUHJvZHVjZWQua2VybmVsSW5mbyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhc3luYyBfY29tbWFuZEhhbmRsZXIoY29tbWFuZEludm9jYXRpb246IElLZXJuZWxDb21tYW5kSW52b2NhdGlvbik6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IGNvbW1hbmRUb2tlbiA9IGNvbW1hbmRJbnZvY2F0aW9uLmNvbW1hbmRFbnZlbG9wZS5nZXRPckNyZWF0ZVRva2VuKCk7XHJcbiAgICAgICAgY29uc3QgY29tcGxldGlvblNvdXJjZSA9IG5ldyBQcm9taXNlQ29tcGxldGlvblNvdXJjZTxjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxFdmVudEVudmVsb3BlPigpO1xyXG5cclxuICAgICAgICAvLyBmaXggOiBpcyB0aGlzIHRoZSByaWdodCB3YXk/IFdlIGFyZSB0cnlpbmcgdG8gYXZvaWQgZm9yd2FyZGluZyBldmVudHMgd2UganVzdCBkaWQgZm9yd2FyZFxyXG4gICAgICAgIGxldCBldmVudFN1YnNjcmlwdGlvbiA9IHRoaXMuX3JlY2VpdmVyLnN1YnNjcmliZSh7XHJcbiAgICAgICAgICAgIG5leHQ6IChlbnZlbG9wZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbm5lY3Rpb24uaXNLZXJuZWxFdmVudEVudmVsb3BlKGVudmVsb3BlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbnZlbG9wZS5ldmVudFR5cGUgPT09IGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbEluZm9Qcm9kdWNlZFR5cGUgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGVudmVsb3BlLmNvbW1hbmQgPT09IG51bGwgfHwgZW52ZWxvcGUuY29tbWFuZCA9PT0gdW5kZWZpbmVkKSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qga2VybmVsSW5mb1Byb2R1Y2VkID0gZW52ZWxvcGUuZXZlbnQgYXMgY29tbWFuZHNBbmRFdmVudHMuS2VybmVsSW5mb1Byb2R1Y2VkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXJuZWxJbmZvUHJvZHVjZWQua2VybmVsSW5mbzsvLz9cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5rZXJuZWxJbmZvOy8vP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2VybmVsSW5mb1Byb2R1Y2VkLmtlcm5lbEluZm8udXJpID09PSB0aGlzLmtlcm5lbEluZm8ucmVtb3RlVXJpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVLZXJuZWxJbmZvRnJvbUV2ZW50KGtlcm5lbEluZm9Qcm9kdWNlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBldmVudCA9IG5ldyBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxFdmVudEVudmVsb3BlKGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbEluZm9Qcm9kdWNlZFR5cGUsIHsga2VybmVsSW5mbzogdGhpcy5rZXJuZWxJbmZvIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdWJsaXNoRXZlbnQoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGVudmVsb3BlLmNvbW1hbmQhLmdldFRva2VuKCkgPT09IGNvbW1hbmRUb2tlbikge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgTG9nZ2VyLmRlZmF1bHQuaW5mbyhgcHJveHkgbmFtZT0ke3RoaXMubmFtZX1bbG9jYWwgdXJpOiR7dGhpcy5rZXJuZWxJbmZvLnVyaX0sIHJlbW90ZSB1cmk6JHt0aGlzLmtlcm5lbEluZm8ucmVtb3RlVXJpfV0gcHJvY2Vzc2luZyBldmVudCwgZW52ZWxvcGVUb2tlbj0ke2VudmVsb3BlLmNvbW1hbmQhLmdldFRva2VuKCl9LCBjb21tYW5kVG9rZW49JHtjb21tYW5kVG9rZW59YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIExvZ2dlci5kZWZhdWx0LmluZm8oYHByb3h5IG5hbWU9JHt0aGlzLm5hbWV9W2xvY2FsIHVyaToke3RoaXMua2VybmVsSW5mby51cml9LCByZW1vdGUgdXJpOiR7dGhpcy5rZXJuZWxJbmZvLnJlbW90ZVVyaX1dIHByb2Nlc3NpbmcgZXZlbnQsICR7SlNPTi5zdHJpbmdpZnkoZW52ZWxvcGUpfWApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsID0gWy4uLmNvbW1hbmRJbnZvY2F0aW9uLmNvbW1hbmRFbnZlbG9wZT8ucm91dGluZ1NsaXAudG9BcnJheSgpID8/IFtdXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmRJbnZvY2F0aW9uLmNvbW1hbmRFbnZlbG9wZS5yb3V0aW5nU2xpcC5jb250aW51ZVdpdGgoZW52ZWxvcGUuY29tbWFuZCEucm91dGluZ1NsaXApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9lbnZlbG9wZS5jb21tYW5kIS5yb3V0aW5nU2xpcCA9IFsuLi5jb21tYW5kSW52b2NhdGlvbi5jb21tYW5kRW52ZWxvcGUucm91dGluZ1NsaXAgPz8gW11dOy8vP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTG9nZ2VyLmRlZmF1bHQuaW5mbyhgcHJveHkgbmFtZT0ke3RoaXMubmFtZX1bbG9jYWwgdXJpOiR7dGhpcy5rZXJuZWxJbmZvLnVyaX0sIGNvbW1hbmQgcm91dGluZ1NsaXAgOiR7b3JpZ2luYWx9XSBoYXMgY2hhbmdlZCB0bzogJHtKU09OLnN0cmluZ2lmeShjb21tYW5kSW52b2NhdGlvbi5jb21tYW5kRW52ZWxvcGUucm91dGluZ1NsaXAgPz8gW10pfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIExvZ2dlci5kZWZhdWx0LmVycm9yKGBwcm94eSBuYW1lPSR7dGhpcy5uYW1lfVtsb2NhbCB1cmk6JHt0aGlzLmtlcm5lbEluZm8udXJpfSwgZXJyb3IgJHtlPy5tZXNzYWdlfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGVudmVsb3BlLmV2ZW50VHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxJbmZvUHJvZHVjZWRUeXBlOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qga2VybmVsSW5mb1Byb2R1Y2VkID0gZW52ZWxvcGUuZXZlbnQgYXMgY29tbWFuZHNBbmRFdmVudHMuS2VybmVsSW5mb1Byb2R1Y2VkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2VybmVsSW5mb1Byb2R1Y2VkLmtlcm5lbEluZm8udXJpID09PSB0aGlzLmtlcm5lbEluZm8ucmVtb3RlVXJpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUtlcm5lbEluZm9Gcm9tRXZlbnQoa2VybmVsSW5mb1Byb2R1Y2VkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50ID0gbmV3IGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbEV2ZW50RW52ZWxvcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZHNBbmRFdmVudHMuS2VybmVsSW5mb1Byb2R1Y2VkVHlwZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGtlcm5lbEluZm86IHRoaXMua2VybmVsSW5mbyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmRJbnZvY2F0aW9uLmNvbW1hbmRFbnZlbG9wZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5yb3V0aW5nU2xpcC5jb250aW51ZVdpdGgoZW52ZWxvcGUucm91dGluZ1NsaXApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsZWdhdGVQdWJsaWNhdGlvbihldmVudCwgY29tbWFuZEludm9jYXRpb24uY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlbGVnYXRlUHVibGljYXRpb24oZW52ZWxvcGUsIGNvbW1hbmRJbnZvY2F0aW9uLmNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxlZ2F0ZVB1YmxpY2F0aW9uKGVudmVsb3BlLCBjb21tYW5kSW52b2NhdGlvbi5jb250ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgY29tbWFuZHNBbmRFdmVudHMuQ29tbWFuZEZhaWxlZFR5cGU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIGNvbW1hbmRzQW5kRXZlbnRzLkNvbW1hbmRTdWNjZWVkZWRUeXBlOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIExvZ2dlci5kZWZhdWx0LmluZm8oYHByb3h5IG5hbWU9JHt0aGlzLm5hbWV9W2xvY2FsIHVyaToke3RoaXMua2VybmVsSW5mby51cml9LCByZW1vdGUgdXJpOiR7dGhpcy5rZXJuZWxJbmZvLnJlbW90ZVVyaX1dIGZpbmlzaGVkLCB0b2tlbj0ke2VudmVsb3BlLmNvbW1hbmQhLmdldFRva2VuKCl9LCBjb21tYW5kVG9rZW49JHtjb21tYW5kVG9rZW59YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVudmVsb3BlLmNvbW1hbmQhLmdldFRva2VuKCkgPT09IGNvbW1hbmRUb2tlbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBMb2dnZXIuZGVmYXVsdC5pbmZvKGBwcm94eSBuYW1lPSR7dGhpcy5uYW1lfVtsb2NhbCB1cmk6JHt0aGlzLmtlcm5lbEluZm8udXJpfSwgcmVtb3RlIHVyaToke3RoaXMua2VybmVsSW5mby5yZW1vdGVVcml9XSByZXNvbHZpbmcgcHJvbWlzZSwgZW52ZWxvcGVUb2tlbj0ke2VudmVsb3BlLmNvbW1hbmQhLmdldFRva2VuKCl9LCBjb21tYW5kVG9rZW49JHtjb21tYW5kVG9rZW59YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRpb25Tb3VyY2UucmVzb2x2ZShlbnZlbG9wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTG9nZ2VyLmRlZmF1bHQuaW5mbyhgcHJveHkgbmFtZT0ke3RoaXMubmFtZX1bbG9jYWwgdXJpOiR7dGhpcy5rZXJuZWxJbmZvLnVyaX0sIHJlbW90ZSB1cmk6JHt0aGlzLmtlcm5lbEluZm8ucmVtb3RlVXJpfV0gbm90IHJlc29sdmluZyBwcm9taXNlLCBlbnZlbG9wZVRva2VuPSR7ZW52ZWxvcGUuY29tbWFuZCEuZ2V0VG9rZW4oKX0sIGNvbW1hbmRUb2tlbj0ke2NvbW1hbmRUb2tlbn1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxlZ2F0ZVB1YmxpY2F0aW9uKGVudmVsb3BlLCBjb21tYW5kSW52b2NhdGlvbi5jb250ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsZWdhdGVQdWJsaWNhdGlvbihlbnZlbG9wZSwgY29tbWFuZEludm9jYXRpb24uY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKCFjb21tYW5kSW52b2NhdGlvbi5jb21tYW5kRW52ZWxvcGUuY29tbWFuZC5kZXN0aW5hdGlvblVyaSB8fCAhY29tbWFuZEludm9jYXRpb24uY29tbWFuZEVudmVsb3BlLmNvbW1hbmQub3JpZ2luVXJpKSB7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kSW52b2NhdGlvbi5jb21tYW5kRW52ZWxvcGUuY29tbWFuZC5vcmlnaW5VcmkgPz89IHRoaXMua2VybmVsSW5mby51cmk7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kSW52b2NhdGlvbi5jb21tYW5kRW52ZWxvcGUuY29tbWFuZC5kZXN0aW5hdGlvblVyaSA/Pz0gdGhpcy5rZXJuZWxJbmZvLnJlbW90ZVVyaTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29tbWFuZEludm9jYXRpb24uY29tbWFuZEVudmVsb3BlLnJvdXRpbmdTbGlwO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbW1hbmRJbnZvY2F0aW9uLmNvbW1hbmRFbnZlbG9wZS5jb21tYW5kVHlwZSA9PT0gY29tbWFuZHNBbmRFdmVudHMuUmVxdWVzdEtlcm5lbEluZm9UeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkZXN0aW5hdGlvblVyaSA9IHRoaXMua2VybmVsSW5mby5yZW1vdGVVcmkhO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbW1hbmRJbnZvY2F0aW9uLmNvbW1hbmRFbnZlbG9wZS5yb3V0aW5nU2xpcC5jb250YWlucyhkZXN0aW5hdGlvblVyaSwgdHJ1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgTG9nZ2VyLmRlZmF1bHQuaW5mbyhgcHJveHkgJHt0aGlzLm5hbWV9W2xvY2FsIHVyaToke3RoaXMua2VybmVsSW5mby51cml9LCByZW1vdGUgdXJpOiR7dGhpcy5rZXJuZWxJbmZvLnJlbW90ZVVyaX1dIGZvcndhcmRpbmcgY29tbWFuZCAke2NvbW1hbmRJbnZvY2F0aW9uLmNvbW1hbmRFbnZlbG9wZS5jb21tYW5kVHlwZX0gdG8gJHtjb21tYW5kSW52b2NhdGlvbi5jb21tYW5kRW52ZWxvcGUuY29tbWFuZC5kZXN0aW5hdGlvblVyaX1gKTtcclxuICAgICAgICAgICAgdGhpcy5fc2VuZGVyLnNlbmQoY29tbWFuZEludm9jYXRpb24uY29tbWFuZEVudmVsb3BlKTtcclxuICAgICAgICAgICAgTG9nZ2VyLmRlZmF1bHQuaW5mbyhgcHJveHkgJHt0aGlzLm5hbWV9W2xvY2FsIHVyaToke3RoaXMua2VybmVsSW5mby51cml9LCByZW1vdGUgdXJpOiR7dGhpcy5rZXJuZWxJbmZvLnJlbW90ZVVyaX1dIGFib3V0IHRvIGF3YWl0IHdpdGggdG9rZW4gJHtjb21tYW5kVG9rZW59YCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGVudmVudEVudmVsb3BlID0gYXdhaXQgY29tcGxldGlvblNvdXJjZS5wcm9taXNlO1xyXG4gICAgICAgICAgICBpZiAoZW52ZW50RW52ZWxvcGUuZXZlbnRUeXBlID09PSBjb21tYW5kc0FuZEV2ZW50cy5Db21tYW5kRmFpbGVkVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZEludm9jYXRpb24uY29udGV4dC5mYWlsKChlbnZlbnRFbnZlbG9wZS5ldmVudCBhcyBjb21tYW5kc0FuZEV2ZW50cy5Db21tYW5kRmFpbGVkKS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBMb2dnZXIuZGVmYXVsdC5pbmZvKGBwcm94eSAke3RoaXMubmFtZX1bbG9jYWwgdXJpOiR7dGhpcy5rZXJuZWxJbmZvLnVyaX0sIHJlbW90ZSB1cmk6JHt0aGlzLmtlcm5lbEluZm8ucmVtb3RlVXJpfV0gZG9uZSBhd2FpdGluZyB3aXRoIHRva2VuICR7Y29tbWFuZFRva2VufX1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgY29tbWFuZEludm9jYXRpb24uY29udGV4dC5mYWlsKChlIGFzIGFueSkubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICBldmVudFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvLyBDb3B5cmlnaHQgKGMpIC5ORVQgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIGZpbGUgaW4gdGhlIHByb2plY3Qgcm9vdCBmb3IgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uLlxyXG5cclxuaW1wb3J0IHsgQ29tcG9zaXRlS2VybmVsIH0gZnJvbSAnLi9jb21wb3NpdGVLZXJuZWwnO1xyXG5pbXBvcnQgKiBhcyBjb21tYW5kc0FuZEV2ZW50cyBmcm9tICcuL2NvbW1hbmRzQW5kRXZlbnRzJztcclxuaW1wb3J0ICogYXMgY29ubmVjdGlvbiBmcm9tICcuL2Nvbm5lY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyByb3V0aW5nU2xpcCBmcm9tICcuL3JvdXRpbmdzbGlwJztcclxuaW1wb3J0IHsgS2VybmVsIH0gZnJvbSAnLi9rZXJuZWwnO1xyXG5pbXBvcnQgeyBQcm94eUtlcm5lbCB9IGZyb20gJy4vcHJveHlLZXJuZWwnO1xyXG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuL2xvZ2dlcic7XHJcbmltcG9ydCB7IEtlcm5lbFNjaGVkdWxlciB9IGZyb20gJy4va2VybmVsU2NoZWR1bGVyJztcclxuXHJcbmV4cG9ydCBjbGFzcyBLZXJuZWxIb3N0IHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3JlbW90ZVVyaVRvS2VybmVsID0gbmV3IE1hcDxzdHJpbmcsIEtlcm5lbD4oKTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3VyaVRvS2VybmVsID0gbmV3IE1hcDxzdHJpbmcsIEtlcm5lbD4oKTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2tlcm5lbFRvS2VybmVsSW5mbyA9IG5ldyBNYXA8S2VybmVsLCBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxJbmZvPigpO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdXJpOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9zY2hlZHVsZXI6IEtlcm5lbFNjaGVkdWxlcjxjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxDb21tYW5kRW52ZWxvcGU+O1xyXG4gICAgcHJpdmF0ZSBfa2VybmVsOiBDb21wb3NpdGVLZXJuZWw7XHJcbiAgICBwcml2YXRlIF9kZWZhdWx0Q29ubmVjdG9yOiBjb25uZWN0aW9uLkNvbm5lY3RvcjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2Nvbm5lY3RvcnM6IGNvbm5lY3Rpb24uQ29ubmVjdG9yW10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihrZXJuZWw6IENvbXBvc2l0ZUtlcm5lbCwgc2VuZGVyOiBjb25uZWN0aW9uLklLZXJuZWxDb21tYW5kQW5kRXZlbnRTZW5kZXIsIHJlY2VpdmVyOiBjb25uZWN0aW9uLklLZXJuZWxDb21tYW5kQW5kRXZlbnRSZWNlaXZlciwgaG9zdFVyaTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5fa2VybmVsID0ga2VybmVsO1xyXG4gICAgICAgIHRoaXMuX3VyaSA9IHJvdXRpbmdTbGlwLmNyZWF0ZUtlcm5lbFVyaShob3N0VXJpIHx8IFwia2VybmVsOi8vdnNjb2RlXCIpO1xyXG5cclxuICAgICAgICB0aGlzLl9rZXJuZWwuaG9zdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5fc2NoZWR1bGVyID0gbmV3IEtlcm5lbFNjaGVkdWxlcjxjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxDb21tYW5kRW52ZWxvcGU+KCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3NjaGVkdWxlci5zZXRNdXN0VHJhbXBvbGluZSgoYyA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAoYy5jb21tYW5kVHlwZSA9PT0gY29tbWFuZHNBbmRFdmVudHMuUmVxdWVzdElucHV0VHlwZSkgfHwgKGMuY29tbWFuZFR5cGUgPT09IGNvbW1hbmRzQW5kRXZlbnRzLlNlbmRFZGl0YWJsZUNvZGVUeXBlKTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRDb25uZWN0b3IgPSBuZXcgY29ubmVjdGlvbi5Db25uZWN0b3IoeyBzZW5kZXIsIHJlY2VpdmVyIH0pO1xyXG4gICAgICAgIHRoaXMuX2Nvbm5lY3RvcnMucHVzaCh0aGlzLl9kZWZhdWx0Q29ubmVjdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGRlZmF1bHRDb25uZWN0b3IoKTogY29ubmVjdGlvbi5Db25uZWN0b3Ige1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kZWZhdWx0Q29ubmVjdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdXJpKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VyaTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGtlcm5lbCgpOiBDb21wb3NpdGVLZXJuZWwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9rZXJuZWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyeUdldEtlcm5lbEJ5UmVtb3RlVXJpKHJlbW90ZVVyaTogc3RyaW5nKTogS2VybmVsIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVtb3RlVXJpVG9LZXJuZWwuZ2V0KHJlbW90ZVVyaSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyeWdldEtlcm5lbEJ5T3JpZ2luVXJpKG9yaWdpblVyaTogc3RyaW5nKTogS2VybmVsIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdXJpVG9LZXJuZWwuZ2V0KG9yaWdpblVyaSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyeUdldEtlcm5lbEluZm8oa2VybmVsOiBLZXJuZWwpOiBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxJbmZvIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fa2VybmVsVG9LZXJuZWxJbmZvLmdldChrZXJuZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRLZXJuZWxJbmZvKGtlcm5lbDogS2VybmVsLCBrZXJuZWxJbmZvOiBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxJbmZvKSB7XHJcbiAgICAgICAga2VybmVsSW5mby51cmkgPSByb3V0aW5nU2xpcC5jcmVhdGVLZXJuZWxVcmkoYCR7dGhpcy5fdXJpfSR7a2VybmVsLm5hbWV9YCk7XHJcbiAgICAgICAgdGhpcy5fa2VybmVsVG9LZXJuZWxJbmZvLnNldChrZXJuZWwsIGtlcm5lbEluZm8pO1xyXG4gICAgICAgIHRoaXMuX3VyaVRvS2VybmVsLnNldChrZXJuZWxJbmZvLnVyaSwga2VybmVsKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0S2VybmVsKGtlcm5lbENvbW1hbmRFbnZlbG9wZTogY29tbWFuZHNBbmRFdmVudHMuS2VybmVsQ29tbWFuZEVudmVsb3BlKTogS2VybmVsIHtcclxuXHJcbiAgICAgICAgY29uc3QgdXJpVG9Mb29rdXAgPSBrZXJuZWxDb21tYW5kRW52ZWxvcGUuY29tbWFuZC5kZXN0aW5hdGlvblVyaSA/PyBrZXJuZWxDb21tYW5kRW52ZWxvcGUuY29tbWFuZC5vcmlnaW5Vcmk7XHJcbiAgICAgICAgbGV0IGtlcm5lbDogS2VybmVsIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGlmICh1cmlUb0xvb2t1cCkge1xyXG4gICAgICAgICAgICBrZXJuZWwgPSB0aGlzLl9rZXJuZWwuZmluZEtlcm5lbEJ5VXJpKHVyaVRvTG9va3VwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgha2VybmVsKSB7XHJcbiAgICAgICAgICAgIGlmIChrZXJuZWxDb21tYW5kRW52ZWxvcGUuY29tbWFuZC50YXJnZXRLZXJuZWxOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBrZXJuZWwgPSB0aGlzLl9rZXJuZWwuZmluZEtlcm5lbEJ5TmFtZShrZXJuZWxDb21tYW5kRW52ZWxvcGUuY29tbWFuZC50YXJnZXRLZXJuZWxOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAga2VybmVsID8/PSB0aGlzLl9rZXJuZWw7XHJcbiAgICAgICAgTG9nZ2VyLmRlZmF1bHQuaW5mbyhgVXNpbmcgS2VybmVsICR7a2VybmVsLm5hbWV9YCk7XHJcbiAgICAgICAgcmV0dXJuIGtlcm5lbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29ubmVjdFByb3h5S2VybmVsT25EZWZhdWx0Q29ubmVjdG9yKGxvY2FsTmFtZTogc3RyaW5nLCByZW1vdGVLZXJuZWxVcmk/OiBzdHJpbmcsIGFsaWFzZXM/OiBzdHJpbmdbXSk6IFByb3h5S2VybmVsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0UHJveHlLZXJuZWxPbkNvbm5lY3Rvcihsb2NhbE5hbWUsIHRoaXMuX2RlZmF1bHRDb25uZWN0b3Iuc2VuZGVyLCB0aGlzLl9kZWZhdWx0Q29ubmVjdG9yLnJlY2VpdmVyLCByZW1vdGVLZXJuZWxVcmksIGFsaWFzZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0cnlBZGRDb25uZWN0b3IoY29ubmVjdG9yOiB7IHNlbmRlcjogY29ubmVjdGlvbi5JS2VybmVsQ29tbWFuZEFuZEV2ZW50U2VuZGVyLCByZWNlaXZlcjogY29ubmVjdGlvbi5JS2VybmVsQ29tbWFuZEFuZEV2ZW50UmVjZWl2ZXIsIHJlbW90ZVVyaXM/OiBzdHJpbmdbXSB9KSB7XHJcbiAgICAgICAgaWYgKCFjb25uZWN0b3IucmVtb3RlVXJpcykge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0b3JzLnB1c2gobmV3IGNvbm5lY3Rpb24uQ29ubmVjdG9yKGNvbm5lY3RvcikpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBmb3VuZCA9IGNvbm5lY3Rvci5yZW1vdGVVcmlzIS5maW5kKHVyaSA9PiB0aGlzLl9jb25uZWN0b3JzLmZpbmQoYyA9PiBjLmNhblJlYWNoKHVyaSkpKTtcclxuICAgICAgICAgICAgaWYgKCFmb3VuZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29ubmVjdG9ycy5wdXNoKG5ldyBjb25uZWN0aW9uLkNvbm5lY3Rvcihjb25uZWN0b3IpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyeVJlbW92ZUNvbm5lY3Rvcihjb25uZWN0b3I6IHsgcmVtb3RlVXJpcz86IHN0cmluZ1tdIH0pIHtcclxuICAgICAgICBpZiAoIWNvbm5lY3Rvci5yZW1vdGVVcmlzKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHVyaSBvZiBjb25uZWN0b3IucmVtb3RlVXJpcyEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fY29ubmVjdG9ycy5maW5kSW5kZXgoYyA9PiBjLmNhblJlYWNoKHVyaSkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb25uZWN0b3JzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvbm5lY3RQcm94eUtlcm5lbChsb2NhbE5hbWU6IHN0cmluZywgcmVtb3RlS2VybmVsVXJpOiBzdHJpbmcsIGFsaWFzZXM/OiBzdHJpbmdbXSk6IFByb3h5S2VybmVsIHtcclxuICAgICAgICB0aGlzLl9jb25uZWN0b3JzOy8vP1xyXG4gICAgICAgIGNvbnN0IGNvbm5lY3RvciA9IHRoaXMuX2Nvbm5lY3RvcnMuZmluZChjID0+IGMuY2FuUmVhY2gocmVtb3RlS2VybmVsVXJpKSk7XHJcbiAgICAgICAgaWYgKCFjb25uZWN0b3IpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZmluZCBjb25uZWN0b3IgdG8gcmVhY2ggJHtyZW1vdGVLZXJuZWxVcml9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBrZXJuZWwgPSBuZXcgUHJveHlLZXJuZWwobG9jYWxOYW1lLCBjb25uZWN0b3Iuc2VuZGVyLCBjb25uZWN0b3IucmVjZWl2ZXIpO1xyXG4gICAgICAgIGtlcm5lbC5rZXJuZWxJbmZvLnJlbW90ZVVyaSA9IHJlbW90ZUtlcm5lbFVyaTtcclxuICAgICAgICB0aGlzLl9rZXJuZWwuYWRkKGtlcm5lbCwgYWxpYXNlcyk7XHJcbiAgICAgICAgcmV0dXJuIGtlcm5lbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNvbm5lY3RQcm94eUtlcm5lbE9uQ29ubmVjdG9yKGxvY2FsTmFtZTogc3RyaW5nLCBzZW5kZXI6IGNvbm5lY3Rpb24uSUtlcm5lbENvbW1hbmRBbmRFdmVudFNlbmRlciwgcmVjZWl2ZXI6IGNvbm5lY3Rpb24uSUtlcm5lbENvbW1hbmRBbmRFdmVudFJlY2VpdmVyLCByZW1vdGVLZXJuZWxVcmk/OiBzdHJpbmcsIGFsaWFzZXM/OiBzdHJpbmdbXSk6IFByb3h5S2VybmVsIHtcclxuICAgICAgICBsZXQga2VybmVsID0gbmV3IFByb3h5S2VybmVsKGxvY2FsTmFtZSwgc2VuZGVyLCByZWNlaXZlcik7XHJcbiAgICAgICAga2VybmVsLmtlcm5lbEluZm8ucmVtb3RlVXJpID0gcmVtb3RlS2VybmVsVXJpO1xyXG4gICAgICAgIHRoaXMuX2tlcm5lbC5hZGQoa2VybmVsLCBhbGlhc2VzKTtcclxuICAgICAgICByZXR1cm4ga2VybmVsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0cnlHZXRDb25uZWN0b3IocmVtb3RlVXJpOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29ubmVjdG9ycy5maW5kKGMgPT4gYy5jYW5SZWFjaChyZW1vdGVVcmkpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgY29ubmVjdCgpOiBQcm9taXNlPGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbFJlYWR5PiB7XHJcbiAgICAgICAgdGhpcy5fa2VybmVsLnN1YnNjcmliZVRvS2VybmVsRXZlbnRzKGUgPT4ge1xyXG4gICAgICAgICAgICBMb2dnZXIuZGVmYXVsdC5pbmZvKGBLZXJuZWxIb3N0IGZvcndhcmRpbmcgZXZlbnQ6ICR7SlNPTi5zdHJpbmdpZnkoZSl9YCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlZmF1bHRDb25uZWN0b3Iuc2VuZGVyLnNlbmQoZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRDb25uZWN0b3IucmVjZWl2ZXIuc3Vic2NyaWJlKHtcclxuICAgICAgICAgICAgbmV4dDogKGtlcm5lbENvbW1hbmRPckV2ZW50RW52ZWxvcGU6IGNvbm5lY3Rpb24uS2VybmVsQ29tbWFuZE9yRXZlbnRFbnZlbG9wZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjb25uZWN0aW9uLmlzS2VybmVsQ29tbWFuZEVudmVsb3BlKGtlcm5lbENvbW1hbmRPckV2ZW50RW52ZWxvcGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTG9nZ2VyLmRlZmF1bHQuaW5mbyhgS2VybmVsSG9zdCBkaXNwYWN0aGluZyBjb21tYW5kOiAke0pTT04uc3RyaW5naWZ5KGtlcm5lbENvbW1hbmRPckV2ZW50RW52ZWxvcGUpfWApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlci5ydW5Bc3luYyhrZXJuZWxDb21tYW5kT3JFdmVudEVudmVsb3BlLCBjb21tYW5kRW52ZWxvcGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXJuZWwgPSB0aGlzLl9rZXJuZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXJuZWwuc2VuZChjb21tYW5kRW52ZWxvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGtlcm5lbEluZm9zID0gW3RoaXMuX2tlcm5lbC5rZXJuZWxJbmZvLCAuLi5BcnJheS5mcm9tKHRoaXMuX2tlcm5lbC5jaGlsZEtlcm5lbHMubWFwKGsgPT4gay5rZXJuZWxJbmZvKS5maWx0ZXIoa2kgPT4ga2kuaXNQcm94eSA9PT0gZmFsc2UpKV07XHJcblxyXG4gICAgICAgIGNvbnN0IGtlcm5la1JlYWR5OiBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxSZWFkeSA9IHtcclxuICAgICAgICAgICAga2VybmVsSW5mb3M6IGtlcm5lbEluZm9zXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgZXZlbnQgPSBuZXcgY29tbWFuZHNBbmRFdmVudHMuS2VybmVsRXZlbnRFbnZlbG9wZShjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxSZWFkeVR5cGUsIGtlcm5la1JlYWR5KTtcclxuICAgICAgICBldmVudC5yb3V0aW5nU2xpcC5zdGFtcCh0aGlzLl9rZXJuZWwua2VybmVsSW5mby51cmkhKTtcclxuXHJcbiAgICAgICAgYXdhaXQgdGhpcy5fZGVmYXVsdENvbm5lY3Rvci5zZW5kZXIuc2VuZChldmVudCk7XHJcblxyXG4gICAgICAgIHJldHVybiBrZXJuZWtSZWFkeTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0S2VybmVsSW5mb3MoKTogY29tbWFuZHNBbmRFdmVudHMuS2VybmVsSW5mb1tdIHtcclxuICAgICAgICBsZXQga2VybmVsSW5mb3MgPSBbdGhpcy5fa2VybmVsLmtlcm5lbEluZm9dO1xyXG4gICAgICAgIGZvciAobGV0IGtlcm5lbCBvZiB0aGlzLl9rZXJuZWwuY2hpbGRLZXJuZWxzKSB7XHJcbiAgICAgICAgICAgIGtlcm5lbEluZm9zLnB1c2goa2VybmVsLmtlcm5lbEluZm8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ga2VybmVsSW5mb3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEtlcm5lbEluZm9Qcm9kdWNlZCgpOiBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxFdmVudEVudmVsb3BlW10ge1xyXG4gICAgICAgIGxldCBldmVudHM6IGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbEV2ZW50RW52ZWxvcGVbXSA9IEFycmF5LmZyb20odGhpcy5nZXRLZXJuZWxJbmZvcygpLm1hcChrZXJuZWxJbmZvID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZXZlbnQgPSBuZXcgY29tbWFuZHNBbmRFdmVudHMuS2VybmVsRXZlbnRFbnZlbG9wZShjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxJbmZvUHJvZHVjZWRUeXBlLCB7IGtlcm5lbEluZm86IGtlcm5lbEluZm8gfSBhcyBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxJbmZvUHJvZHVjZWQpO1xyXG4gICAgICAgICAgICBldmVudC5yb3V0aW5nU2xpcC5zdGFtcChrZXJuZWxJbmZvLnVyaSEpO1xyXG4gICAgICAgICAgICByZXR1cm4gZXZlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICkpO1xyXG5cclxuICAgICAgICByZXR1cm4gZXZlbnRzO1xyXG4gICAgfVxyXG59XHJcbiIsIi8vIENvcHlyaWdodCAoYykgLk5FVCBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS4gU2VlIExJQ0VOU0UgZmlsZSBpbiB0aGUgcHJvamVjdCByb290IGZvciBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24uXHJcblxyXG5leHBvcnQgKiBmcm9tICcuL2NvbXBvc2l0ZUtlcm5lbCc7XHJcbmV4cG9ydCAqIGZyb20gJy4vY29ubmVjdGlvbic7XHJcbmV4cG9ydCAqIGZyb20gJy4vY29uc29sZUNhcHR1cmUnO1xyXG5leHBvcnQgKiBmcm9tICcuL2NvbW1hbmRzQW5kRXZlbnRzJztcclxuZXhwb3J0ICogZnJvbSAnLi9kaXNwb3NhYmxlcyc7XHJcbmV4cG9ydCAqIGZyb20gJy4va2VybmVsJztcclxuZXhwb3J0ICogZnJvbSAnLi9rZXJuZWxIb3N0JztcclxuZXhwb3J0ICogZnJvbSAnLi9rZXJuZWxJbnZvY2F0aW9uQ29udGV4dCc7XHJcbmV4cG9ydCAqIGZyb20gJy4va2VybmVsU2NoZWR1bGVyJztcclxuZXhwb3J0ICogZnJvbSAnLi9sb2dnZXInO1xyXG5leHBvcnQgKiBmcm9tICcuL3Byb21pc2VDb21wbGV0aW9uU291cmNlJztcclxuZXhwb3J0ICogZnJvbSAnLi9wcm94eUtlcm5lbCc7XHJcbmV4cG9ydCAqIGZyb20gJy4vcm91dGluZ3NsaXAnO1xyXG4iLCIvLyBDb3B5cmlnaHQgKGMpIC5ORVQgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIGZpbGUgaW4gdGhlIHByb2plY3Qgcm9vdCBmb3IgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uLlxyXG5cclxuaW1wb3J0ICogYXMgY29tbWFuZHNBbmRFdmVudHMgZnJvbSBcIi4vY29tbWFuZHNBbmRFdmVudHNcIjtcclxuaW1wb3J0ICogYXMgY29ubmVjdGlvbiBmcm9tIFwiLi9jb25uZWN0aW9uXCI7XHJcbmltcG9ydCB7IENvbnNvbGVDYXB0dXJlIH0gZnJvbSBcIi4vY29uc29sZUNhcHR1cmVcIjtcclxuaW1wb3J0IHsgS2VybmVsLCBJS2VybmVsQ29tbWFuZEludm9jYXRpb24gfSBmcm9tIFwiLi9rZXJuZWxcIjtcclxuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4vbG9nZ2VyXCI7XHJcbmltcG9ydCAqIGFzIHBvbHlnbG90Tm90ZWJvb2tzQXBpIGZyb20gXCIuL2FwaVwiO1xyXG5cclxuLy8gVGhpcyBpcyBhIHdvcmthcm91bmQgZm9yIHJvbGx1cCB3YXJuaW5ncy4gU2VlIHRoZWlyIGRvY3VtZW50YXRpb24gZm9yIG1vcmUgZGV0YWlsczogaHR0cHM6Ly9yb2xsdXBqcy5vcmcvdHJvdWJsZXNob290aW5nLyNhdm9pZGluZy1ldmFsXHJcbmNvbnN0IGV2YWwyID0gZXZhbDtcclxuXHJcbmV4cG9ydCBjbGFzcyBKYXZhc2NyaXB0S2VybmVsIGV4dGVuZHMgS2VybmVsIHtcclxuICAgIHByaXZhdGUgc3VwcHJlc3NlZExvY2FsczogU2V0PHN0cmluZz47XHJcbiAgICBwcml2YXRlIGNhcHR1cmU6IENvbnNvbGVDYXB0dXJlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU/OiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihuYW1lID8/IFwiamF2YXNjcmlwdFwiLCBcIkphdmFTY3JpcHRcIik7XHJcbiAgICAgICAgdGhpcy5rZXJuZWxJbmZvLmRpc3BsYXlOYW1lID0gYCR7dGhpcy5rZXJuZWxJbmZvLmxvY2FsTmFtZX0gLSAke3RoaXMua2VybmVsSW5mby5sYW5ndWFnZU5hbWV9YDtcclxuICAgICAgICB0aGlzLmtlcm5lbEluZm8uZGVzY3JpcHRpb24gPSBgUnVuIEphdmFTY3JpcHQgY29kZWA7XHJcbiAgICAgICAgdGhpcy5zdXBwcmVzc2VkTG9jYWxzID0gbmV3IFNldDxzdHJpbmc+KHRoaXMuYWxsTG9jYWxWYXJpYWJsZU5hbWVzKCkpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJDb21tYW5kSGFuZGxlcih7IGNvbW1hbmRUeXBlOiBjb21tYW5kc0FuZEV2ZW50cy5TdWJtaXRDb2RlVHlwZSwgaGFuZGxlOiBpbnZvY2F0aW9uID0+IHRoaXMuaGFuZGxlU3VibWl0Q29kZShpbnZvY2F0aW9uKSB9KTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyQ29tbWFuZEhhbmRsZXIoeyBjb21tYW5kVHlwZTogY29tbWFuZHNBbmRFdmVudHMuUmVxdWVzdFZhbHVlSW5mb3NUeXBlLCBoYW5kbGU6IGludm9jYXRpb24gPT4gdGhpcy5oYW5kbGVSZXF1ZXN0VmFsdWVJbmZvcyhpbnZvY2F0aW9uKSB9KTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyQ29tbWFuZEhhbmRsZXIoeyBjb21tYW5kVHlwZTogY29tbWFuZHNBbmRFdmVudHMuUmVxdWVzdFZhbHVlVHlwZSwgaGFuZGxlOiBpbnZvY2F0aW9uID0+IHRoaXMuaGFuZGxlUmVxdWVzdFZhbHVlKGludm9jYXRpb24pIH0pO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJDb21tYW5kSGFuZGxlcih7IGNvbW1hbmRUeXBlOiBjb21tYW5kc0FuZEV2ZW50cy5TZW5kVmFsdWVUeXBlLCBoYW5kbGU6IGludm9jYXRpb24gPT4gdGhpcy5oYW5kbGVTZW5kVmFsdWUoaW52b2NhdGlvbikgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY2FwdHVyZSA9IG5ldyBDb25zb2xlQ2FwdHVyZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGFuZGxlU2VuZFZhbHVlKGludm9jYXRpb246IElLZXJuZWxDb21tYW5kSW52b2NhdGlvbik6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IHNlbmRWYWx1ZSA9IGludm9jYXRpb24uY29tbWFuZEVudmVsb3BlLmNvbW1hbmQgYXMgY29tbWFuZHNBbmRFdmVudHMuU2VuZFZhbHVlO1xyXG4gICAgICAgIGlmIChzZW5kVmFsdWUuZm9ybWF0dGVkVmFsdWUpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChzZW5kVmFsdWUuZm9ybWF0dGVkVmFsdWUubWltZVR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2FwcGxpY2F0aW9uL2pzb24nOlxyXG4gICAgICAgICAgICAgICAgICAgIChnbG9iYWxUaGlzIGFzIGFueSlbc2VuZFZhbHVlLm5hbWVdID0gY29ubmVjdGlvbi5EZXNlcmlhbGl6ZShzZW5kVmFsdWUuZm9ybWF0dGVkVmFsdWUudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAoZ2xvYmFsVGhpcyBhcyBhbnkpW3NlbmRWYWx1ZS5uYW1lXSA9IHNlbmRWYWx1ZS5mb3JtYXR0ZWRWYWx1ZS52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImZvcm1hdHRlZFZhbHVlIGlzIHJlcXVpcmVkXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgaGFuZGxlU3VibWl0Q29kZShpbnZvY2F0aW9uOiBJS2VybmVsQ29tbWFuZEludm9jYXRpb24pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBzdWJtaXRDb2RlID0gaW52b2NhdGlvbi5jb21tYW5kRW52ZWxvcGUuY29tbWFuZCBhcyBjb21tYW5kc0FuZEV2ZW50cy5TdWJtaXRDb2RlO1xyXG4gICAgICAgIGNvbnN0IGNvZGUgPSBzdWJtaXRDb2RlLmNvZGU7XHJcblxyXG4gICAgICAgIHN1cGVyLmtlcm5lbEluZm8ubG9jYWxOYW1lO1xyXG4gICAgICAgIHN1cGVyLmtlcm5lbEluZm8udXJpO1xyXG4gICAgICAgIHN1cGVyLmtlcm5lbEluZm8ucmVtb3RlVXJpO1xyXG4gICAgICAgIGNvbnN0IGNvZGVTdWJtaXNzaW9uUmVjZWl2ZWRFdmVudCA9IG5ldyBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxFdmVudEVudmVsb3BlKGNvbW1hbmRzQW5kRXZlbnRzLkNvZGVTdWJtaXNzaW9uUmVjZWl2ZWRUeXBlLCB7IGNvZGUgfSwgaW52b2NhdGlvbi5jb21tYW5kRW52ZWxvcGUpO1xyXG4gICAgICAgIGludm9jYXRpb24uY29udGV4dC5wdWJsaXNoKGNvZGVTdWJtaXNzaW9uUmVjZWl2ZWRFdmVudCk7XHJcbiAgICAgICAgaW52b2NhdGlvbi5jb250ZXh0LmNvbW1hbmRFbnZlbG9wZS5yb3V0aW5nU2xpcDtcclxuICAgICAgICB0aGlzLmNhcHR1cmUua2VybmVsSW52b2NhdGlvbkNvbnRleHQgPSBpbnZvY2F0aW9uLmNvbnRleHQ7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogYW55ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBBc3luY0Z1bmN0aW9uID0gZXZhbDIoYE9iamVjdC5nZXRQcm90b3R5cGVPZihhc3luYyBmdW5jdGlvbigpe30pLmNvbnN0cnVjdG9yYCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGV2YWx1YXRvciA9IEFzeW5jRnVuY3Rpb24oXCJjb25zb2xlXCIsIFwicG9seWdsb3ROb3RlYm9va3NcIiwgY29kZSk7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGF3YWl0IGV2YWx1YXRvcih0aGlzLmNhcHR1cmUsIHBvbHlnbG90Tm90ZWJvb2tzQXBpKTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmb3JtYXR0ZWRWYWx1ZSA9IGZvcm1hdFZhbHVlKHJlc3VsdCwgJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50OiBjb21tYW5kc0FuZEV2ZW50cy5SZXR1cm5WYWx1ZVByb2R1Y2VkID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlZFZhbHVlczogW2Zvcm1hdHRlZFZhbHVlXVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJldHVyblZhbHVlUHJvZHVjZWRFdmVudCA9IG5ldyBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxFdmVudEVudmVsb3BlKGNvbW1hbmRzQW5kRXZlbnRzLlJldHVyblZhbHVlUHJvZHVjZWRUeXBlLCBldmVudCwgaW52b2NhdGlvbi5jb21tYW5kRW52ZWxvcGUpO1xyXG4gICAgICAgICAgICAgICAgaW52b2NhdGlvbi5jb250ZXh0LnB1Ymxpc2gocmV0dXJuVmFsdWVQcm9kdWNlZEV2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvclByb2R1Y2VkID0gbmV3IGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbEV2ZW50RW52ZWxvcGUoXHJcbiAgICAgICAgICAgICAgICBjb21tYW5kc0FuZEV2ZW50cy5FcnJvclByb2R1Y2VkVHlwZSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBgJHtlLm1lc3NhZ2V9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICR7ZS5zdGFja31gXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgaW52b2NhdGlvbi5jb21tYW5kRW52ZWxvcGUpO1xyXG4gICAgICAgICAgICBpbnZvY2F0aW9uLmNvbnRleHQucHVibGlzaChlcnJvclByb2R1Y2VkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FwdHVyZS5rZXJuZWxJbnZvY2F0aW9uQ29udGV4dCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBoYW5kbGVSZXF1ZXN0VmFsdWVJbmZvcyhpbnZvY2F0aW9uOiBJS2VybmVsQ29tbWFuZEludm9jYXRpb24pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCB2YWx1ZUluZm9zOiBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxWYWx1ZUluZm9bXSA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmFsbExvY2FsVmFyaWFibGVOYW1lcygpLmZpbHRlcih2ID0+ICF0aGlzLnN1cHByZXNzZWRMb2NhbHMuaGFzKHYpKS5mb3JFYWNoKHYgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB2YXJpYWJsZVZhbHVlID0gdGhpcy5nZXRMb2NhbFZhcmlhYmxlKHYpO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWVJbmZvID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHYsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZU5hbWU6IGdldFR5cGUodmFyaWFibGVWYWx1ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0dGVkVmFsdWU6IGZvcm1hdFZhbHVlKHZhcmlhYmxlVmFsdWUsIFwidGV4dC9wbGFpblwiKSxcclxuICAgICAgICAgICAgICAgICAgICBwcmVmZXJyZWRNaW1lVHlwZXM6IFtdXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdmFsdWVJbmZvcy5wdXNoKHZhbHVlSW5mbyk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIExvZ2dlci5kZWZhdWx0LmVycm9yKGBlcnJvciBmb3JtYXR0aW5nIHZhbHVlICR7dn0gOiAke2V9YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgZXZlbnQ6IGNvbW1hbmRzQW5kRXZlbnRzLlZhbHVlSW5mb3NQcm9kdWNlZCA9IHtcclxuICAgICAgICAgICAgdmFsdWVJbmZvc1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IHZhbHVlSW5mb3NQcm9kdWNlZEV2ZW50ID0gbmV3IGNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbEV2ZW50RW52ZWxvcGUoY29tbWFuZHNBbmRFdmVudHMuVmFsdWVJbmZvc1Byb2R1Y2VkVHlwZSwgZXZlbnQsIGludm9jYXRpb24uY29tbWFuZEVudmVsb3BlKTtcclxuICAgICAgICBpbnZvY2F0aW9uLmNvbnRleHQucHVibGlzaCh2YWx1ZUluZm9zUHJvZHVjZWRFdmVudCk7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGFuZGxlUmVxdWVzdFZhbHVlKGludm9jYXRpb246IElLZXJuZWxDb21tYW5kSW52b2NhdGlvbik6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IHJlcXVlc3RWYWx1ZSA9IGludm9jYXRpb24uY29tbWFuZEVudmVsb3BlLmNvbW1hbmQgYXMgY29tbWFuZHNBbmRFdmVudHMuUmVxdWVzdFZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHJhd1ZhbHVlID0gdGhpcy5nZXRMb2NhbFZhcmlhYmxlKHJlcXVlc3RWYWx1ZS5uYW1lKTtcclxuICAgICAgICBjb25zdCBmb3JtYXR0ZWRWYWx1ZSA9IGZvcm1hdFZhbHVlKHJhd1ZhbHVlLCByZXF1ZXN0VmFsdWUubWltZVR5cGUgfHwgJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuICAgICAgICBMb2dnZXIuZGVmYXVsdC5pbmZvKGByZXR1cm5pbmcgJHtKU09OLnN0cmluZ2lmeShmb3JtYXR0ZWRWYWx1ZSl9IGZvciAke3JlcXVlc3RWYWx1ZS5uYW1lfWApO1xyXG4gICAgICAgIGNvbnN0IGV2ZW50OiBjb21tYW5kc0FuZEV2ZW50cy5WYWx1ZVByb2R1Y2VkID0ge1xyXG4gICAgICAgICAgICBuYW1lOiByZXF1ZXN0VmFsdWUubmFtZSxcclxuICAgICAgICAgICAgZm9ybWF0dGVkVmFsdWVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCB2YWx1ZVByb2R1Y2VkRXZlbnQgPSBuZXcgY29tbWFuZHNBbmRFdmVudHMuS2VybmVsRXZlbnRFbnZlbG9wZShjb21tYW5kc0FuZEV2ZW50cy5WYWx1ZVByb2R1Y2VkVHlwZSwgZXZlbnQsIGludm9jYXRpb24uY29tbWFuZEVudmVsb3BlKTtcclxuICAgICAgICBpbnZvY2F0aW9uLmNvbnRleHQucHVibGlzaCh2YWx1ZVByb2R1Y2VkRXZlbnQpO1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWxsTG9jYWxWYXJpYWJsZU5hbWVzKCk6IHN0cmluZ1tdIHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IHN0cmluZ1tdID0gW107XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gZ2xvYmFsVGhpcykge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIChnbG9iYWxUaGlzIGFzIGFueSlba2V5XSAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBMb2dnZXIuZGVmYXVsdC5lcnJvcihgZXJyb3IgZ2V0dGluZyB2YWx1ZSBmb3IgJHtrZXl9IDogJHtlfWApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBMb2dnZXIuZGVmYXVsdC5lcnJvcihgZXJyb3Igc2Nhbm5pbmcgZ2xvYmxhIHZhcmlhYmxlcyA6ICR7ZX1gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldExvY2FsVmFyaWFibGUobmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICByZXR1cm4gKGdsb2JhbFRoaXMgYXMgYW55KVtuYW1lXTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFZhbHVlKGFyZzogYW55LCBtaW1lVHlwZTogc3RyaW5nKTogY29tbWFuZHNBbmRFdmVudHMuRm9ybWF0dGVkVmFsdWUge1xyXG4gICAgbGV0IHZhbHVlOiBzdHJpbmc7XHJcblxyXG4gICAgc3dpdGNoIChtaW1lVHlwZSkge1xyXG4gICAgICAgIGNhc2UgJ3RleHQvcGxhaW4nOlxyXG4gICAgICAgICAgICB2YWx1ZSA9IGFyZz8udG9TdHJpbmcoKSB8fCAndW5kZWZpbmVkJztcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBgWyR7dmFsdWV9XWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnYXBwbGljYXRpb24vanNvbic6XHJcbiAgICAgICAgICAgIHZhbHVlID0gY29ubmVjdGlvbi5TZXJpYWxpemUoYXJnKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bnN1cHBvcnRlZCBtaW1lIHR5cGU6ICR7bWltZVR5cGV9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBtaW1lVHlwZSxcclxuICAgICAgICB2YWx1ZSxcclxuICAgICAgICBzdXBwcmVzc0Rpc3BsYXk6IGZhbHNlXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHlwZShhcmc6IGFueSk6IHN0cmluZyB7XHJcbiAgICBsZXQgdHlwZTogc3RyaW5nID0gYXJnID8gdHlwZW9mIChhcmcpIDogXCJcIjsvLz9cclxuXHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XHJcbiAgICAgICAgdHlwZSA9IGAke3R5cGVvZiAoYXJnWzBdKX1bXWA7Ly8/XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGFyZyA9PT0gSW5maW5pdHkgfHwgYXJnID09PSAtSW5maW5pdHkgfHwgKGFyZyAhPT0gYXJnKSkge1xyXG4gICAgICAgIHR5cGUgPSBcIm51bWJlclwiO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0eXBlOyAvLz9cclxufVxyXG5cclxuIiwiLy8gQ29weXJpZ2h0IChjKSAuTkVUIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLiBTZWUgTElDRU5TRSBmaWxlIGluIHRoZSBwcm9qZWN0IHJvb3QgZm9yIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbi5cclxuXHJcbmltcG9ydCB7IENvbXBvc2l0ZUtlcm5lbCB9IGZyb20gXCIuLi9jb21wb3NpdGVLZXJuZWxcIjtcclxuaW1wb3J0IHsgSmF2YXNjcmlwdEtlcm5lbCB9IGZyb20gXCIuLi9qYXZhc2NyaXB0S2VybmVsXCI7XHJcbmltcG9ydCB7IExvZ0VudHJ5LCBMb2dnZXIgfSBmcm9tIFwiLi4vbG9nZ2VyXCI7XHJcbmltcG9ydCB7IEtlcm5lbEhvc3QgfSBmcm9tIFwiLi4va2VybmVsSG9zdFwiO1xyXG5pbXBvcnQgKiBhcyByeGpzIGZyb20gXCJyeGpzXCI7XHJcbmltcG9ydCAqIGFzIGNvbm5lY3Rpb24gZnJvbSBcIi4uL2Nvbm5lY3Rpb25cIjtcclxuaW1wb3J0ICogYXMgY29tbWFuZHNBbmRFdmVudHMgZnJvbSBcIi4uL2NvbW1hbmRzQW5kRXZlbnRzXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSG9zdChcclxuICAgIGdsb2JhbDogYW55LFxyXG4gICAgY29tcG9zaXRlS2VybmVsTmFtZTogc3RyaW5nLFxyXG4gICAgY29uZmlndXJlUmVxdWlyZTogKGludGVyYWN0aXZlOiBhbnkpID0+IHZvaWQsXHJcbiAgICBsb2dNZXNzYWdlOiAoZW50cnk6IExvZ0VudHJ5KSA9PiB2b2lkLFxyXG4gICAgbG9jYWxUb1JlbW90ZTogcnhqcy5PYnNlcnZlcjxjb25uZWN0aW9uLktlcm5lbENvbW1hbmRPckV2ZW50RW52ZWxvcGU+LFxyXG4gICAgcmVtb3RlVG9Mb2NhbDogcnhqcy5PYnNlcnZhYmxlPGNvbm5lY3Rpb24uS2VybmVsQ29tbWFuZE9yRXZlbnRFbnZlbG9wZT4sXHJcbiAgICBvblJlYWR5OiAoKSA9PiB2b2lkKSB7XHJcbiAgICBMb2dnZXIuY29uZmlndXJlKGNvbXBvc2l0ZUtlcm5lbE5hbWUsIGxvZ01lc3NhZ2UpO1xyXG5cclxuICAgIGdsb2JhbC5pbnRlcmFjdGl2ZSA9IHt9O1xyXG4gICAgY29uZmlndXJlUmVxdWlyZShnbG9iYWwuaW50ZXJhY3RpdmUpO1xyXG5cclxuICAgIGNvbnN0IGNvbXBvc2l0ZUtlcm5lbCA9IG5ldyBDb21wb3NpdGVLZXJuZWwoY29tcG9zaXRlS2VybmVsTmFtZSk7XHJcbiAgICBjb25zdCBrZXJuZWxIb3N0ID0gbmV3IEtlcm5lbEhvc3QoY29tcG9zaXRlS2VybmVsLCBjb25uZWN0aW9uLktlcm5lbENvbW1hbmRBbmRFdmVudFNlbmRlci5Gcm9tT2JzZXJ2ZXIobG9jYWxUb1JlbW90ZSksIGNvbm5lY3Rpb24uS2VybmVsQ29tbWFuZEFuZEV2ZW50UmVjZWl2ZXIuRnJvbU9ic2VydmFibGUocmVtb3RlVG9Mb2NhbCksIGBrZXJuZWw6Ly8ke2NvbXBvc2l0ZUtlcm5lbE5hbWV9YCk7XHJcblxyXG4gICAga2VybmVsSG9zdC5kZWZhdWx0Q29ubmVjdG9yLnJlY2VpdmVyLnN1YnNjcmliZSh7XHJcbiAgICAgICAgbmV4dDogKGVudmVsb3BlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjb25uZWN0aW9uLmlzS2VybmVsRXZlbnRFbnZlbG9wZShlbnZlbG9wZSkgJiYgZW52ZWxvcGUuZXZlbnRUeXBlID09PSBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxJbmZvUHJvZHVjZWRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBrZXJuZWxJbmZvUHJvZHVjZWQgPSBlbnZlbG9wZS5ldmVudCBhcyBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxJbmZvUHJvZHVjZWQ7XHJcbiAgICAgICAgICAgICAgICBjb25uZWN0aW9uLmVuc3VyZU9yVXBkYXRlUHJveHlGb3JLZXJuZWxJbmZvKGtlcm5lbEluZm9Qcm9kdWNlZC5rZXJuZWxJbmZvLCBjb21wb3NpdGVLZXJuZWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gdXNlIGNvbXBvc2l0ZSBrZXJuZWwgYXMgcm9vdFxyXG4gICAgZ2xvYmFsLmtlcm5lbCA9IHtcclxuICAgICAgICBnZXQgcm9vdCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvc2l0ZUtlcm5lbDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGdsb2JhbC5zZW5kU2VuZFZhbHVlQ29tbWFuZCA9IChmb3JtOiBhbnkpID0+IHtcclxuICAgICAgICBsZXQgZm9ybVZhbHVlczogYW55ID0ge307XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZm9ybS5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgZSA9IGZvcm0uZWxlbWVudHNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoZS5uYW1lICYmIGUubmFtZSAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgIGxldCBuYW1lID0gZS5uYW1lLnJlcGxhY2UoJy0nLCAnJyk7XHJcbiAgICAgICAgICAgICAgICBmb3JtVmFsdWVzW25hbWVdID0gZS52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNvbW1hbmQgPSB7XHJcbiAgICAgICAgICAgIGZvcm1hdHRlZFZhbHVlOiB7XHJcbiAgICAgICAgICAgICAgICBtaW1lVHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IEpTT04uc3RyaW5naWZ5KGZvcm1WYWx1ZXMpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG5hbWU6IGZvcm0uaWQsXHJcbiAgICAgICAgICAgIHRhcmdldEtlcm5lbE5hbWU6ICcuTkVUJ1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBlbnZlbG9wZSA9IG5ldyBjb21tYW5kc0FuZEV2ZW50cy5LZXJuZWxDb21tYW5kRW52ZWxvcGUoY29tbWFuZHNBbmRFdmVudHMuU2VuZFZhbHVlVHlwZSwgY29tbWFuZCk7XHJcblxyXG4gICAgICAgIGZvcm0ucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIGNvbXBvc2l0ZUtlcm5lbC5zZW5kKGVudmVsb3BlKTtcclxuICAgIH07XHJcblxyXG4gICAgZ2xvYmFsW2NvbXBvc2l0ZUtlcm5lbE5hbWVdID0ge1xyXG4gICAgICAgIGNvbXBvc2l0ZUtlcm5lbCxcclxuICAgICAgICBrZXJuZWxIb3N0LFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBqc0tlcm5lbCA9IG5ldyBKYXZhc2NyaXB0S2VybmVsKCk7XHJcbiAgICBjb21wb3NpdGVLZXJuZWwuYWRkKGpzS2VybmVsLCBbXCJqc1wiXSk7XHJcblxyXG4gICAga2VybmVsSG9zdC5jb25uZWN0KCk7XHJcblxyXG4gICAgb25SZWFkeSgpO1xyXG59XHJcbiIsIi8vIENvcHlyaWdodCAoYykgLk5FVCBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS4gU2VlIExJQ0VOU0UgZmlsZSBpbiB0aGUgcHJvamVjdCByb290IGZvciBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24uXHJcblxyXG5pbXBvcnQgKiBhcyBmcm9udEVuZEhvc3QgZnJvbSAnLi9mcm9udEVuZEhvc3QnO1xyXG5pbXBvcnQgKiBhcyByeGpzIGZyb20gXCJyeGpzXCI7XHJcbmltcG9ydCAqIGFzIGNvbm5lY3Rpb24gZnJvbSBcIi4uL2Nvbm5lY3Rpb25cIjtcclxuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4uL2xvZ2dlclwiO1xyXG5pbXBvcnQgeyBLZXJuZWxIb3N0IH0gZnJvbSAnLi4va2VybmVsSG9zdCc7XHJcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcclxuaW1wb3J0IHsgS2VybmVsSW5mbyB9IGZyb20gJy4uL2NvbnRyYWN0cyc7XHJcbmltcG9ydCB7IEtlcm5lbENvbW1hbmRFbnZlbG9wZSwgS2VybmVsRXZlbnRFbnZlbG9wZSB9IGZyb20gJy4uL2NvbW1hbmRzQW5kRXZlbnRzJztcclxuXHJcbnR5cGUgS2VybmVsTWVzc2FnaW5nQXBpID0ge1xyXG4gICAgb25EaWRSZWNlaXZlS2VybmVsTWVzc2FnZTogKGFyZzogYW55KSA9PiBhbnk7XHJcbiAgICBwb3N0S2VybmVsTWVzc2FnZTogKGRhdGE6IHVua25vd24pID0+IHZvaWQ7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWN0aXZhdGUoY29udGV4dDogS2VybmVsTWVzc2FnaW5nQXBpKSB7XHJcbiAgICBjb25maWd1cmUod2luZG93LCBjb250ZXh0KTtcclxuICAgIExvZ2dlci5kZWZhdWx0LmluZm8oYHNldCB1cCAnd2VidmlldycgaG9zdCBtb2R1bGUgY29tcGxldGVgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY29uZmlndXJlKGdsb2JhbDogYW55LCBjb250ZXh0OiBLZXJuZWxNZXNzYWdpbmdBcGkpIHtcclxuICAgIGlmICghZ2xvYmFsKSB7XHJcbiAgICAgICAgZ2xvYmFsID0gd2luZG93O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJlbW90ZVRvTG9jYWwgPSBuZXcgcnhqcy5TdWJqZWN0PGNvbm5lY3Rpb24uS2VybmVsQ29tbWFuZE9yRXZlbnRFbnZlbG9wZT4oKTtcclxuICAgIGNvbnN0IGxvY2FsVG9SZW1vdGUgPSBuZXcgcnhqcy5TdWJqZWN0PGNvbm5lY3Rpb24uS2VybmVsQ29tbWFuZE9yRXZlbnRFbnZlbG9wZT4oKTtcclxuXHJcbiAgICBsb2NhbFRvUmVtb3RlLnN1YnNjcmliZSh7XHJcbiAgICAgICAgbmV4dDogZW52ZWxvcGUgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBlbnZlbG9wZUpzb24gPSBlbnZlbG9wZS50b0pzb24oKTtcclxuICAgICAgICAgICAgY29udGV4dC5wb3N0S2VybmVsTWVzc2FnZSh7IGVudmVsb3BlOiBlbnZlbG9wZUpzb24gfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3Qgd2ViVmlld0lkID0gdXVpZCgpO1xyXG4gICAgY29udGV4dC5vbkRpZFJlY2VpdmVLZXJuZWxNZXNzYWdlKChhcmc6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmIChhcmcuZW52ZWxvcGUgJiYgYXJnLndlYlZpZXdJZCA9PT0gd2ViVmlld0lkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVudmVsb3BlID0gYXJnLmVudmVsb3BlIGFzIGNvbm5lY3Rpb24uS2VybmVsQ29tbWFuZE9yRXZlbnRFbnZlbG9wZU1vZGVsO1xyXG4gICAgICAgICAgICBpZiAoY29ubmVjdGlvbi5pc0tlcm5lbEV2ZW50RW52ZWxvcGVNb2RlbChlbnZlbG9wZSkpIHtcclxuICAgICAgICAgICAgICAgIExvZ2dlci5kZWZhdWx0LmluZm8oYGNoYW5uZWwgZ290ICR7ZW52ZWxvcGUuZXZlbnRUeXBlfSB3aXRoIHRva2VuICR7ZW52ZWxvcGUuY29tbWFuZD8udG9rZW59YCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBldmVudCA9IEtlcm5lbEV2ZW50RW52ZWxvcGUuZnJvbUpzb24oZW52ZWxvcGUpO1xyXG4gICAgICAgICAgICAgICAgcmVtb3RlVG9Mb2NhbC5uZXh0KGV2ZW50KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbW1hbmQgPSBLZXJuZWxDb21tYW5kRW52ZWxvcGUuZnJvbUpzb24oZW52ZWxvcGUpO1xyXG4gICAgICAgICAgICAgICAgcmVtb3RlVG9Mb2NhbC5uZXh0KGNvbW1hbmQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoYXJnLndlYlZpZXdJZCA9PT0gd2ViVmlld0lkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGtlcm5lbEhvc3QgPSAoZ2xvYmFsWyd3ZWJ2aWV3J10ua2VybmVsSG9zdCkgYXMgS2VybmVsSG9zdDtcclxuICAgICAgICAgICAgaWYgKGtlcm5lbEhvc3QpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoYXJnLnByZWxvYWRDb21tYW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnIyFjb25uZWN0Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBMb2dnZXIuZGVmYXVsdC5pbmZvKGBjb25uZWN0aW5nIHRvIGtlcm5lbHMgZnJvbSBleHRlbnNpb24gaG9zdGApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXJuZWxJbmZvcyA9IGFyZy5rZXJuZWxJbmZvcyBhcyBLZXJuZWxJbmZvW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qga2VybmVsSW5mbyBvZiBrZXJuZWxJbmZvcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVtb3RlVXJpID0ga2VybmVsSW5mby5pc1Byb3h5ID8ga2VybmVsSW5mby5yZW1vdGVVcmkhIDoga2VybmVsSW5mby51cmk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWtlcm5lbEhvc3QudHJ5R2V0Q29ubmVjdG9yKHJlbW90ZVVyaSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXJuZWxIb3N0LmRlZmF1bHRDb25uZWN0b3IuYWRkUmVtb3RlSG9zdFVyaShyZW1vdGVVcmkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdGlvbi5lbnN1cmVPclVwZGF0ZVByb3h5Rm9yS2VybmVsSW5mbyhrZXJuZWxJbmZvLCBrZXJuZWxIb3N0Lmtlcm5lbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBmcm9udEVuZEhvc3QuY3JlYXRlSG9zdChcclxuICAgICAgICBnbG9iYWwsXHJcbiAgICAgICAgJ3dlYnZpZXcnLFxyXG4gICAgICAgIGNvbmZpZ3VyZVJlcXVpcmUsXHJcbiAgICAgICAgZW50cnkgPT4ge1xyXG4gICAgICAgICAgICBjb250ZXh0LnBvc3RLZXJuZWxNZXNzYWdlKHsgbG9nRW50cnk6IGVudHJ5IH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbG9jYWxUb1JlbW90ZSxcclxuICAgICAgICByZW1vdGVUb0xvY2FsLFxyXG4gICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qga2VybmVsSW5mb3MgPSAoZ2xvYmFsWyd3ZWJ2aWV3J10ua2VybmVsSG9zdCBhcyBLZXJuZWxIb3N0KS5nZXRLZXJuZWxJbmZvcygpO1xyXG4gICAgICAgICAgICBjb25zdCBob3N0VXJpID0gKGdsb2JhbFsnd2VidmlldyddLmtlcm5lbEhvc3QgYXMgS2VybmVsSG9zdCkudXJpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnBvc3RLZXJuZWxNZXNzYWdlKHsgcHJlbG9hZENvbW1hbmQ6ICcjIWNvbm5lY3QnLCBrZXJuZWxJbmZvcywgaG9zdFVyaSwgd2ViVmlld0lkIH0pO1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbmZpZ3VyZVJlcXVpcmUoaW50ZXJhY3RpdmU6IGFueSkge1xyXG4gICAgaWYgKCh0eXBlb2YgKHJlcXVpcmUpICE9PSB0eXBlb2YgKEZ1bmN0aW9uKSkgfHwgKHR5cGVvZiAoKHJlcXVpcmUgYXMgYW55KS5jb25maWcpICE9PSB0eXBlb2YgKEZ1bmN0aW9uKSkpIHtcclxuICAgICAgICBsZXQgcmVxdWlyZV9zY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgICAgICByZXF1aXJlX3NjcmlwdC5zZXRBdHRyaWJ1dGUoJ3NyYycsICdodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9yZXF1aXJlLmpzLzIuMy42L3JlcXVpcmUubWluLmpzJyk7XHJcbiAgICAgICAgcmVxdWlyZV9zY3JpcHQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvamF2YXNjcmlwdCcpO1xyXG4gICAgICAgIHJlcXVpcmVfc2NyaXB0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaW50ZXJhY3RpdmUuY29uZmlndXJlUmVxdWlyZSA9IChjb25maW5nOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAocmVxdWlyZSBhcyBhbnkpLmNvbmZpZyhjb25maW5nKSB8fCByZXF1aXJlO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICB9O1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQocmVxdWlyZV9zY3JpcHQpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaW50ZXJhY3RpdmUuY29uZmlndXJlUmVxdWlyZSA9IChjb25maW5nOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIChyZXF1aXJlIGFzIGFueSkuY29uZmlnKGNvbmZpbmcpIHx8IHJlcXVpcmU7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG4iXSwibmFtZXMiOlsidXVpZC5wYXJzZSIsInV1aWQudjQiLCJTeW1ib2xfb2JzZXJ2YWJsZSIsInJ4anMuU3ViamVjdCIsImNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbENvbW1hbmRFbnZlbG9wZSIsImNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbEV2ZW50RW52ZWxvcGUiLCJjb21tYW5kc0FuZEV2ZW50cy5Db21tYW5kU3VjY2VlZGVkVHlwZSIsImNvbW1hbmRzQW5kRXZlbnRzLkNvbW1hbmRGYWlsZWRUeXBlIiwicm91dGluZ3NsaXAuY3JlYXRlS2VybmVsVXJpIiwiY29tbWFuZHNBbmRFdmVudHMuUmVxdWVzdEtlcm5lbEluZm9UeXBlIiwiY29tbWFuZHNBbmRFdmVudHMuS2VybmVsSW5mb1Byb2R1Y2VkVHlwZSIsInJ4anMubWFwIiwiY29tbWFuZHNBbmRFdmVudHMuUmVxdWVzdENvbXBsZXRpb25zVHlwZSIsImNvbW1hbmRzQW5kRXZlbnRzLlJlcXVlc3RTaWduYXR1cmVIZWxwVHlwZSIsImNvbW1hbmRzQW5kRXZlbnRzLlJlcXVlc3REaWFnbm9zdGljc1R5cGUiLCJjb21tYW5kc0FuZEV2ZW50cy5SZXF1ZXN0SG92ZXJUZXh0VHlwZSIsImNvbm5lY3Rpb24uU2VyaWFsaXplIiwiY29tbWFuZHNBbmRFdmVudHMuRGlzcGxheWVkVmFsdWVQcm9kdWNlZFR5cGUiLCJjb25uZWN0aW9uLnVwZGF0ZUtlcm5lbEluZm8iLCJjb25uZWN0aW9uLmlzS2VybmVsRXZlbnRFbnZlbG9wZSIsInJvdXRpbmdTbGlwLmNyZWF0ZUtlcm5lbFVyaSIsImNvbW1hbmRzQW5kRXZlbnRzLlJlcXVlc3RJbnB1dFR5cGUiLCJjb21tYW5kc0FuZEV2ZW50cy5TZW5kRWRpdGFibGVDb2RlVHlwZSIsImNvbm5lY3Rpb24uQ29ubmVjdG9yIiwiY29ubmVjdGlvbi5pc0tlcm5lbENvbW1hbmRFbnZlbG9wZSIsImNvbW1hbmRzQW5kRXZlbnRzLktlcm5lbFJlYWR5VHlwZSIsImNvbW1hbmRzQW5kRXZlbnRzLlN1Ym1pdENvZGVUeXBlIiwiY29tbWFuZHNBbmRFdmVudHMuUmVxdWVzdFZhbHVlSW5mb3NUeXBlIiwiY29tbWFuZHNBbmRFdmVudHMuUmVxdWVzdFZhbHVlVHlwZSIsImNvbW1hbmRzQW5kRXZlbnRzLlNlbmRWYWx1ZVR5cGUiLCJjb25uZWN0aW9uLkRlc2VyaWFsaXplIiwiY29tbWFuZHNBbmRFdmVudHMuQ29kZVN1Ym1pc3Npb25SZWNlaXZlZFR5cGUiLCJjb21tYW5kc0FuZEV2ZW50cy5SZXR1cm5WYWx1ZVByb2R1Y2VkVHlwZSIsImNvbW1hbmRzQW5kRXZlbnRzLkVycm9yUHJvZHVjZWRUeXBlIiwiY29tbWFuZHNBbmRFdmVudHMuVmFsdWVJbmZvc1Byb2R1Y2VkVHlwZSIsImNvbW1hbmRzQW5kRXZlbnRzLlZhbHVlUHJvZHVjZWRUeXBlIiwiY29ubmVjdGlvbi5LZXJuZWxDb21tYW5kQW5kRXZlbnRTZW5kZXIiLCJjb25uZWN0aW9uLktlcm5lbENvbW1hbmRBbmRFdmVudFJlY2VpdmVyIiwiY29ubmVjdGlvbi5lbnN1cmVPclVwZGF0ZVByb3h5Rm9yS2VybmVsSW5mbyIsInV1aWQiLCJjb25uZWN0aW9uLmlzS2VybmVsRXZlbnRFbnZlbG9wZU1vZGVsIiwiZnJvbnRFbmRIb3N0LmNyZWF0ZUhvc3QiXSwibWFwcGluZ3MiOiJBQUFBLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFjLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLE1BQU0sSUFBSSxTQUFTLENBQUMsa0NBQWtDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLE1BQU0sSUFBSSxTQUFTLENBQUMsa0VBQWtFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLE9BQU8sTUFBTSxFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsUUFBUSxFQUFFLE9BQU8sU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsV0FBVyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sSUFBSSxTQUFTLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLCtCQUErQixDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsOERBQThELENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQywwREFBMEQsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxpREFBaUQsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQywwSUFBMEksQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLDJIQUEySCxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsNkJBQTZCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQyxHQUFHLENBQVEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHOztBQ0F2cVg7QUFRTSxTQUFVLGVBQWUsQ0FBQyxTQUFpQixFQUFBO0lBQzdDLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDakMsR0FBRyxDQUFDLFNBQVMsQ0FBQztJQUNkLEdBQUcsQ0FBQyxJQUFJLENBQUM7QUFDVCxJQUFBLElBQUksV0FBVyxHQUFHLENBQUEsRUFBRyxHQUFHLENBQUMsTUFBTSxDQUFNLEdBQUEsRUFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxJQUFJLElBQUksR0FBRyxF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TSxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyRjtBQUNBO0FBQ0EsRUFBRSxJQUFJLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDO0FBQ3pnQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3ZCLElBQUksTUFBTSxTQUFTLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUNuRCxHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQ2Q7O0FDekJBLFNBQVMsS0FBSyxDQUFDLElBQUksRUFBRTtBQUNyQixFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDdkIsSUFBSSxNQUFNLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNwQyxHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ1IsRUFBRSxJQUFJLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMvQjtBQUNBLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDdkQsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDM0IsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDMUIsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUNwQjtBQUNBLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdkQsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUNwQjtBQUNBLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDeEQsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUNwQjtBQUNBLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDeEQsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUNwQjtBQUNBO0FBQ0EsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUM7QUFDMUUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDbkMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDNUIsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDNUIsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDM0Is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
