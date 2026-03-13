"use strict";
// Copyright (c) .NET Foundation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJupyterNotebookViewType = isJupyterNotebookViewType;
exports.languageToCellKind = languageToCellKind;
exports.backupNotebook = backupNotebook;
exports.notebookCellChanged = notebookCellChanged;
const fs = require("fs");
const path = require("path");
const utilities_1 = require("./utilities");
const vscode_like_1 = require("./interfaces/vscode-like");
const constants = require("./constants");
function isJupyterNotebookViewType(viewType) {
    return viewType === constants.JupyterViewType;
}
function languageToCellKind(language) {
    switch (language) {
        case 'markdown':
            return vscode_like_1.NotebookCellKind.Markup;
        default:
            return vscode_like_1.NotebookCellKind.Code;
    }
}
function backupNotebook(rawData, location) {
    return new Promise((resolve, reject) => {
        // ensure backup directory exists
        const parsedPath = path.parse(location);
        fs.mkdir(parsedPath.dir, { recursive: true }, async (err, _path) => {
            if (err) {
                reject(err);
                return;
            }
            // save notebook to location
            fs.writeFile(location, rawData, () => {
                resolve({
                    id: location,
                    delete: () => {
                        fs.unlinkSync(location);
                    }
                });
            });
        });
    });
}
function notebookCellChanged(clientMapper, documentUri, documentText, kernelName, diagnosticDelay, callback) {
    (0, utilities_1.debounce)(`diagnostics-${documentUri.toString()}`, diagnosticDelay, async () => {
        let diagnostics = [];
        try {
            const client = await clientMapper.getOrAddClient(documentUri);
            diagnostics = await client.getDiagnostics(kernelName, documentText);
        }
        finally {
            callback(diagnostics);
        }
    });
}
//# sourceMappingURL=interactiveNotebook.js.map