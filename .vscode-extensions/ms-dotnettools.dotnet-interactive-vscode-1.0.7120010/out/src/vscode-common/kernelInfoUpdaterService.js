"use strict";
// Copyright (c) .NET Foundation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.KernelInfoUpdaterService = void 0;
const vscode = require("vscode");
const connection = require("./polyglot-notebooks/connection");
class KernelInfoUpdaterService {
    constructor(clientMapper) {
        this.clientMapper = clientMapper;
        this._callbacks = [];
        this._compositeKernelToNotebookUri = new Map();
        clientMapper.onClientCreate((uri, client) => {
            this._compositeKernelToNotebookUri.set(client.kernel, uri);
        });
        connection.registerForKernelInfoUpdates(async (compositeKernel) => {
            const notebookUri = this._compositeKernelToNotebookUri.get(compositeKernel);
            if (notebookUri) {
                const notebookDocument = vscode.workspace.notebookDocuments.find(document => document.uri.fsPath === notebookUri.fsPath);
                if (notebookDocument) {
                    const client = await this.clientMapper.getOrAddClient(notebookDocument.uri);
                    this.notifyOfKernelInfoUpdates(notebookDocument, client);
                }
            }
        });
    }
    notifyOfKernelInfoUpdates(notebook, client) {
        for (const callback of this._callbacks) {
            try {
                callback(notebook, client);
            }
            catch (_a) {
                // don't care
            }
        }
    }
    onKernelInfoUpdated(callback) {
        this._callbacks.push(callback);
        return {
            dispose: () => {
                this._callbacks = this._callbacks.filter(d => d !== callback);
            }
        };
    }
}
exports.KernelInfoUpdaterService = KernelInfoUpdaterService;
//# sourceMappingURL=kernelInfoUpdaterService.js.map