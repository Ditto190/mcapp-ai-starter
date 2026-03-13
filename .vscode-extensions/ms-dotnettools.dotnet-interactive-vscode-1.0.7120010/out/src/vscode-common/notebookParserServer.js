"use strict";
// Copyright (c) .NET Foundation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotebookParserServer = void 0;
const commandsAndEvents = require("./polyglot-notebooks/commandsAndEvents");
const utilities_1 = require("./interfaces/utilities");
const constants = require("./constants");
class NotebookParserServer {
    constructor(messageClient) {
        this.messageClient = messageClient;
        this.nextId = 1;
    }
    async parseInteractiveDocument(serializationType, rawData) {
        const request = {
            type: commandsAndEvents.RequestType.Parse,
            id: this.getNextId(),
            serializationType,
            defaultLanguage: constants.CellLanguageIdentifier,
            rawData,
        };
        let errorMessage = 'unknown';
        const response = await this.messageClient.sendMessageAndGetResponse(request);
        if ((0, utilities_1.isNotebookParserServerResponse)(response)) {
            if ((0, utilities_1.isNotebookParseResponse)(response)) {
                const responseDocument = response.document;
                const notebookCells = responseDocument.elements;
                if (notebookCells.length === 0) {
                    // ensure at least one cell
                    notebookCells.push({
                        executionOrder: 0,
                        kernelName: 'csharp',
                        contents: '',
                        outputs: [],
                    });
                }
                return responseDocument;
            }
        }
        errorMessage = `Unexpected response: ${JSON.stringify(response)}`;
        throw new Error(`Error parsing interactive document: ${errorMessage}`);
    }
    async serializeNotebook(serializationType, eol, document) {
        const request = {
            type: commandsAndEvents.RequestType.Serialize,
            id: this.getNextId(),
            serializationType,
            defaultLanguage: 'csharp',
            newLine: eol,
            document,
        };
        let errorMessage = 'unknown';
        const response = await this.messageClient.sendMessageAndGetResponse(request);
        if ((0, utilities_1.isNotebookParserServerResponse)(response)) {
            if ((0, utilities_1.isNotebookSerializeResponse)(response)) {
                return response.rawData;
            }
        }
        errorMessage = `Unexepcted response: ${JSON.stringify(response)}`;
        throw new Error(`Error serializing interactive document: ${errorMessage}`);
    }
    getNextId() {
        return `${this.nextId++}`;
    }
}
exports.NotebookParserServer = NotebookParserServer;
//# sourceMappingURL=notebookParserServer.js.map