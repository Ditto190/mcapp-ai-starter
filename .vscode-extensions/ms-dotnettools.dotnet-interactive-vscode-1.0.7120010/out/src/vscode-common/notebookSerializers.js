"use strict";
// Copyright (c) .NET Foundation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAndRegisterNotebookSerializers = createAndRegisterNotebookSerializers;
exports.createAndRegisterFallbackNotebookSerializers = createAndRegisterFallbackNotebookSerializers;
exports.outputElementToVsCodeCellOutput = outputElementToVsCodeCellOutput;
const vscode = require("vscode");
const commandsAndEvents = require("./polyglot-notebooks/commandsAndEvents");
const utilities = require("./interfaces/utilities");
const vscodeLike = require("./interfaces/vscode-like");
const interactiveNotebook_1 = require("./interactiveNotebook");
const vscodeUtilities = require("./vscodeUtilities");
const metadataUtilities = require("./metadataUtilities");
const constants = require("./constants");
function toInteractiveDocumentElement(cell) {
    var _a, _b, _c, _d;
    // just need to match the shape
    const tempCell = {
        kind: vscodeLike.NotebookCellKind.Code,
        metadata: (_a = cell.metadata) !== null && _a !== void 0 ? _a : {}
    };
    const notebookCellMetadata = metadataUtilities.getNotebookCellMetadataFromNotebookCellElement(tempCell);
    const outputs = cell.outputs || [];
    const kernelName = cell.languageId === 'markdown' ? 'markdown' : (_b = notebookCellMetadata.kernelName) !== null && _b !== void 0 ? _b : 'csharp';
    const interactiveDocumentElement = {
        executionOrder: (_d = (_c = cell.executionSummary) === null || _c === void 0 ? void 0 : _c.executionOrder) !== null && _d !== void 0 ? _d : 0,
        kernelName: kernelName,
        contents: cell.value,
        outputs: outputs.map(vscodeUtilities.vsCodeCellOutputToContractCellOutput)
    };
    return interactiveDocumentElement;
}
async function deserializeNotebookByType(parserServer, serializationType, rawData) {
    const interactiveDocument = await parserServer.parseInteractiveDocument(serializationType, rawData);
    const notebookMetadata = metadataUtilities.getNotebookDocumentMetadataFromInteractiveDocument(interactiveDocument);
    const createForIpynb = serializationType === commandsAndEvents.DocumentSerializationType.Ipynb;
    const rawNotebookDocumentMetadata = metadataUtilities.getMergedRawNotebookDocumentMetadataFromNotebookDocumentMetadata(notebookMetadata, {}, createForIpynb);
    const notebookData = {
        cells: interactiveDocument.elements.map(element => toVsCodeNotebookCellData(element)),
        metadata: rawNotebookDocumentMetadata
    };
    return notebookData;
}
async function serializeNotebookByType(parserServer, serializationType, eol, data) {
    var _a;
    // just need to match the shape
    const fakeNotebookDocument = {
        uri: {
            fsPath: 'unused',
            scheme: 'unused'
        },
        metadata: (_a = data.metadata) !== null && _a !== void 0 ? _a : {}
    };
    const notebookMetadata = metadataUtilities.getNotebookDocumentMetadataFromNotebookDocument(fakeNotebookDocument);
    const interactiveDocument = {
        elements: data.cells.map(toInteractiveDocumentElement),
        metadata: notebookMetadata
    };
    const rawData = await parserServer.serializeNotebook(serializationType, eol, interactiveDocument);
    return rawData;
}
function createAndRegisterNotebookSerializers(context, parserServer) {
    const eol = vscodeUtilities.getEol();
    const createAndRegisterSerializer = (serializationType, notebookType) => {
        const serializer = {
            deserializeNotebook(content, _token) {
                return deserializeNotebookByType(parserServer, serializationType, content);
            },
            serializeNotebook(data, _token) {
                return serializeNotebookByType(parserServer, serializationType, eol, data);
            },
        };
        const notebookoptions = notebookType === commandsAndEvents.DocumentSerializationType.Dib
            // This is intended to prevent .dib files from being marked dirty when cells are run, since outputs aren't preserved.
            // FIX: This doesn't prevent the notebook from being marked dirty when the cell is run.
            ? {
                transientOutputs: true,
                transientDocumentMetadata: { custom: true },
                transientCellMetadata: { custom: true }
            }
            // .ipynb is handled directly by VS Code
            : {};
        const notebookSerializer = vscode.workspace.registerNotebookSerializer(notebookType, serializer, notebookoptions);
        context.subscriptions.push(notebookSerializer);
        return serializer;
    };
    const serializers = new Map();
    serializers.set(constants.NotebookViewType, createAndRegisterSerializer(commandsAndEvents.DocumentSerializationType.Dib, constants.NotebookViewType));
    serializers.set(constants.JupyterViewType, createAndRegisterSerializer(commandsAndEvents.DocumentSerializationType.Ipynb, constants.JupyterNotebookViewType));
    return serializers;
}
function createAndRegisterFallbackNotebookSerializers(context, activationError) {
    const serializer = {
        deserializeNotebook(_content, _token) {
            const cellData = new vscode.NotebookCellData(vscode.NotebookCellKind.Markup, `## Polyglot Notebooks failed to activate\n\n${activationError}\n\nPlease check the **Polyglot Notebook : diagnostics** output channel for more details.`, 'markdown');
            return Promise.resolve(new vscode.NotebookData([cellData]));
        },
        serializeNotebook(_data, _token) {
            throw new Error('The Polyglot Notebooks extension failed to activate. Saving is disabled to prevent data loss.');
        },
    };
    const notebookSerializer = vscode.workspace.registerNotebookSerializer(constants.NotebookViewType, serializer);
    context.subscriptions.push(notebookSerializer);
}
function toVsCodeNotebookCellData(cell) {
    const cellData = new vscode.NotebookCellData((0, interactiveNotebook_1.languageToCellKind)(cell.kernelName), cell.contents, cell.kernelName === 'markdown' ? 'markdown' : constants.CellLanguageIdentifier);
    const notebookCellMetadata = {
        kernelName: cell.kernelName
    };
    const rawNotebookCellMetadata = metadataUtilities.getRawNotebookCellMetadataFromNotebookCellMetadata(notebookCellMetadata);
    cellData.metadata = rawNotebookCellMetadata;
    cellData.outputs = cell.outputs.map(outputElementToVsCodeCellOutput);
    return cellData;
}
function outputElementToVsCodeCellOutput(output) {
    const outputItems = [];
    if (utilities.isDisplayOutput(output)) {
        for (const mimeKey in output.data) {
            outputItems.push(generateVsCodeNotebookCellOutputItem(output.data[mimeKey], mimeKey));
        }
    }
    else if (utilities.isErrorOutput(output)) {
        outputItems.push(generateVsCodeNotebookCellOutputItem(output.errorValue, vscodeLike.ErrorOutputMimeType));
    }
    else if (utilities.isTextOutput(output)) {
        outputItems.push(generateVsCodeNotebookCellOutputItem(output.text, 'text/plain'));
    }
    return new vscode.NotebookCellOutput(outputItems);
}
function generateVsCodeNotebookCellOutputItem(value, mime) {
    const displayValue = utilities.reshapeOutputValueForVsCode(value, mime);
    return new vscode.NotebookCellOutputItem(displayValue, mime);
}
//# sourceMappingURL=notebookSerializers.js.map