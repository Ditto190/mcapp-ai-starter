"use strict";
// Copyright (c) .NET Foundation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseCompletionSource = void 0;
exports.isPromiseCompletionSource = isPromiseCompletionSource;
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
exports.PromiseCompletionSource = PromiseCompletionSource;
//# sourceMappingURL=promiseCompletionSource.js.map