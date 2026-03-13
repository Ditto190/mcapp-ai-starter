"use strict";
// Copyright (c) .NET Foundation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInsidersBuild = isInsidersBuild;
exports.isStableBuild = isStableBuild;
exports.convertToRange = convertToRange;
exports.toVsCodeDiagnostic = toVsCodeDiagnostic;
exports.getEol = getEol;
exports.toNotebookDocument = toNotebookDocument;
exports.getCellKernelName = getCellKernelName;
exports.setCellKernelName = setCellKernelName;
exports.ensureCellIsCodeCell = ensureCellIsCodeCell;
exports.ensureCellLanguageId = ensureCellLanguageId;
exports.toInteractiveDocumentElement = toInteractiveDocumentElement;
exports.vsCodeCellOutputToContractCellOutput = vsCodeCellOutputToContractCellOutput;
const os = require("os");
const vscode = require("vscode");
const interfaces_1 = require("./interfaces");
const contracts_1 = require("./polyglot-notebooks/contracts");
const metadataUtilities = require("./metadataUtilities");
const vscodeLike = require("./interfaces/vscode-like");
const constants = require("./constants");
const vscodeNotebookManagement = require("./vscodeNotebookManagement");
function isInsidersBuild() {
    return vscode.version.indexOf('-insider') >= 0;
}
function isStableBuild() {
    return !isInsidersBuild();
}
function convertToPosition(linePosition) {
    return new vscode.Position(linePosition.line, linePosition.character);
}
function convertToRange(linePositionSpan) {
    if (linePositionSpan === undefined) {
        return undefined;
    }
    return new vscode.Range(convertToPosition(linePositionSpan.start), convertToPosition(linePositionSpan.end));
}
function toVsCodeDiagnostic(diagnostic) {
    return {
        range: convertToRange(diagnostic.linePositionSpan),
        message: diagnostic.message,
        severity: toDiagnosticSeverity(diagnostic.severity)
    };
}
function toDiagnosticSeverity(severity) {
    switch (severity) {
        case contracts_1.DiagnosticSeverity.Error:
            return vscode.DiagnosticSeverity.Error;
        case contracts_1.DiagnosticSeverity.Info:
            return vscode.DiagnosticSeverity.Information;
        case contracts_1.DiagnosticSeverity.Warning:
            return vscode.DiagnosticSeverity.Warning;
        default:
            return vscode.DiagnosticSeverity.Error;
    }
}
function getEol() {
    const fileConfig = vscode.workspace.getConfiguration('files');
    const eol = fileConfig.get('eol');
    switch (eol) {
        case interfaces_1.NonWindowsEol:
            return interfaces_1.NonWindowsEol;
        case interfaces_1.WindowsEol:
            return interfaces_1.WindowsEol;
        default:
            // could be `undefined` or 'auto'
            if (os.platform() === 'win32') {
                return interfaces_1.WindowsEol;
            }
            else {
                return interfaces_1.NonWindowsEol;
            }
    }
}
function toNotebookDocument(document) {
    const metadata = metadataUtilities.getNotebookDocumentMetadataFromNotebookDocument(document);
    return {
        elements: document.getCells().map(toInteractiveDocumentElement),
        metadata: document.metadata
    };
}
function getCellKernelName(cell) {
    var _a;
    const cellMetadata = metadataUtilities.getNotebookCellMetadataFromNotebookCellElement(cell);
    return (_a = cellMetadata.kernelName) !== null && _a !== void 0 ? _a : 'csharp';
}
async function setCellKernelName(cell, kernelName) {
    const cellMetadata = {
        kernelName
    };
    const rawCellMetadata = metadataUtilities.getRawNotebookCellMetadataFromNotebookCellMetadata(cellMetadata);
    const mergedMetadata = metadataUtilities.mergeRawMetadata(cell.metadata, rawCellMetadata);
    await vscodeNotebookManagement.updateNotebookCellMetadata(cell.notebook.uri, cell.index, mergedMetadata);
}
async function ensureCellIsCodeCell(cell) {
    if (cell.kind === vscode.NotebookCellKind.Code) {
        return cell;
    }
    // FIX Replacing the cell here is likely the cause of https://github.com/dotnet/interactive/issues/3430. If the cell is created as a Markup cell from the outset, it might avoid this.
    const newCellData = {
        kind: vscode.NotebookCellKind.Code,
        languageId: constants.CellLanguageIdentifier,
        value: cell.document.getText(),
        metadata: cell.metadata,
    };
    const cellIndex = cell.index; // this gets reset to -1 when the cell is replaced so we have to capture it here
    await vscodeNotebookManagement.replaceNotebookCells(cell.notebook.uri, new vscode.NotebookRange(cellIndex, cellIndex + 1), [newCellData]);
    const cells = cell.notebook.getCells();
    const newCell = cells[cellIndex];
    return newCell;
}
async function ensureCellLanguageId(cell) {
    // The NotebookCellData.languageId is needed to associate the various cell languages with Polyglot Notebooks. If this isn't set, the cell can't be run.
    // Since the field is immutable, any cells that don't have it set have to replaced, which will mark the notebook as dirty, but once saved, it should open clean afterwards.
    if (cell.kind === vscode.NotebookCellKind.Code) {
        if (cell.document.languageId !== constants.CellLanguageIdentifier) {
            await vscode.languages.setTextDocumentLanguage(cell.document, constants.CellLanguageIdentifier);
        }
    }
}
function toInteractiveDocumentElement(cell) {
    var _a, _b, _c;
    const cellMetadata = metadataUtilities.getNotebookCellMetadataFromNotebookCellElement(cell);
    return {
        executionOrder: (_b = (_a = cell.executionSummary) === null || _a === void 0 ? void 0 : _a.executionOrder) !== null && _b !== void 0 ? _b : 0,
        kernelName: cell.kind === vscode.NotebookCellKind.Code
            ? (_c = cellMetadata.kernelName) !== null && _c !== void 0 ? _c : 'csharp'
            : 'markdown',
        contents: cell.document.getText(),
        outputs: cell.outputs.map(vsCodeCellOutputToContractCellOutput)
    };
}
function vsCodeCellOutputToContractCellOutput(output) {
    const outputItems = output.items;
    const errorOutputItems = outputItems.filter(oi => oi.mime === vscodeLike.ErrorOutputMimeType);
    if (errorOutputItems.length > 0) {
        // any error-like output takes precedence
        const errorOutputItem = errorOutputItems[0];
        const error = {
            errorName: 'Error',
            errorValue: '' + errorOutputItem.data,
            stackTrace: [],
        };
        return error;
    }
    else {
        //otherwise build the mime=>value dictionary
        const data = {};
        for (const outputItem of outputItems) {
            data[outputItem.mime] = outputItem.data;
        }
        const cellOutput = {
            data,
            metadata: {}
        };
        return cellOutput;
    }
}
//# sourceMappingURL=vscodeUtilities.js.map