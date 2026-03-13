"use strict";
// Copyright (c) .NET Foundation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageClient = void 0;
const commonUtilities = require("./utilities");
// A `MessageClient` wraps a `LineAdapter` by writing JSON objects with an `id` field and returns the corresponding JSON line with the same `id` field.
class MessageClient {
    constructor(lineAdapter) {
        this.lineAdapter = lineAdapter;
        this.requestListeners = new Map();
        this.lineAdapter.subscribeToLines((line) => {
            try {
                const message = commonUtilities.parse(line);
                if (typeof message.id === 'string') {
                    const responseId = message.id;
                    const responseCallback = this.requestListeners.get(responseId);
                    if (responseCallback) {
                        responseCallback(message);
                    }
                }
            }
            catch (_) {
            }
        });
    }
    sendMessageAndGetResponse(message) {
        return new Promise(async (resolve, reject) => {
            this.requestListeners.set(message.id, (response) => {
                this.requestListeners.delete(message.id);
                resolve(response);
            });
            try {
                const body = commonUtilities.stringify(message);
                this.lineAdapter.writeLine(body);
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
exports.MessageClient = MessageClient;
//# sourceMappingURL=messageClient.js.map