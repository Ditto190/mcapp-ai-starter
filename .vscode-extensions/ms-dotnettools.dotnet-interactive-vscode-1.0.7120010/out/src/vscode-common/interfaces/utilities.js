"use strict";
// Copyright (c) .NET Foundation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isErrorOutput = isErrorOutput;
exports.isDisplayOutput = isDisplayOutput;
exports.isTextOutput = isTextOutput;
exports.reshapeOutputValueForVsCode = reshapeOutputValueForVsCode;
exports.isUint8Array = isUint8Array;
exports.isNotebookParserServerResponse = isNotebookParserServerResponse;
exports.isNotebookParseResponse = isNotebookParseResponse;
exports.isNotebookSerializeResponse = isNotebookSerializeResponse;
const vscodeLike = require("./vscode-like");
function isErrorOutput(arg) {
    return arg
        && typeof arg.errorName === 'string'
        && typeof arg.errorValue === 'string'
        && Array.isArray(arg.stackTrace);
}
function isDisplayOutput(arg) {
    return arg
        && typeof arg.data === 'object';
}
function isTextOutput(arg) {
    return arg
        && typeof arg.text === 'string';
}
function reshapeOutputValueForVsCode(value, mime) {
    if (typeof value === 'string') {
        const encoder = new TextEncoder();
        const dataString = mime === vscodeLike.ErrorOutputMimeType
            ? JSON.stringify({
                ename: 'Error',
                evalue: value,
                traceback: [],
            })
            : value;
        const data = encoder.encode(dataString);
        return data;
    }
    else {
        return value;
    }
}
function isUint8Array(arg) {
    return arg
        && (typeof arg.length === 'number' || arg.type === 'Buffer');
}
function isNotebookParserServerResponse(arg) {
    return arg
        && typeof arg.id === 'string';
}
function isNotebookParseResponse(arg) {
    return arg
        && typeof arg.id === 'string'
        && typeof arg.document === 'object';
}
function isNotebookSerializeResponse(arg) {
    return arg
        && typeof arg.id === 'string'
        && isUint8Array(arg.rawData);
}
//# sourceMappingURL=utilities.js.map