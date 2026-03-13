"use strict";
// Copyright (c) .NET Foundation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DotNetNotebookKernel = void 0;
exports.endExecution = endExecution;
const vscode = require("vscode");
const commandsAndEvents = require("./polyglot-notebooks/commandsAndEvents");
const diagnostics = require("./diagnostics");
const vscodeUtilities = require("./vscodeUtilities");
const utilities_1 = require("./interfaces/utilities");
const commands_1 = require("./commands");
const logger_1 = require("./polyglot-notebooks/logger");
const connection_1 = require("./polyglot-notebooks/connection");
const metadataUtilities = require("./metadataUtilities");
const constants = require("./constants");
const vscodeNotebookManagement = require("./vscodeNotebookManagement");
const serviceCollection_1 = require("./serviceCollection");
const executionTasks = new Map();
const standardOutputMimeType = 'application/vnd.code.notebook.stdout';
const standardErrorMimeType = 'application/vnd.code.notebook.stderr';
class DotNetNotebookKernel {
    constructor(config, tokensProvider) {
        this.config = config;
        this.tokensProvider = tokensProvider;
        this.trackedOutputIds = new Map(); // tracks notebookUri => [trackedOutputId]
        this.disposables = [];
        this.uriMessageHandlerMap = new Map();
        // ensure the tracked output ids are always fresh
        serviceCollection_1.ServiceCollection.Instance.NotebookWatcher.onNotebookDocumentOpened((notebook, _client) => this.trackedOutputIds.delete(notebook.uri));
        serviceCollection_1.ServiceCollection.Instance.NotebookWatcher.onNotebookDocumentClosed((notebook, _client) => this.trackedOutputIds.delete(notebook.uri));
        const preloads = config.preloadUris.map(uri => new vscode.NotebookRendererScript(uri));
        // .dib execution
        const dibController = vscode.notebooks.createNotebookController(constants.NotebookControllerId, constants.NotebookViewType, '.NET Interactive', this.executeHandler.bind(this), preloads);
        this.commonControllerInit(dibController);
        // .ipynb execution via Jupyter extension (optional)
        const jupyterController = vscode.notebooks.createNotebookController(constants.JupyterNotebookControllerId, constants.JupyterViewType, '.NET Interactive', this.executeHandler.bind(this), preloads);
        jupyterController.onDidChangeSelectedNotebooks(async (e) => {
            // update metadata
            if (e.selected) {
                // await updateNotebookMetadata(e.notebook, this.config.clientMapper);
            }
        });
        this.commonControllerInit(jupyterController);
        this.disposables.push(vscode.workspace.onDidOpenNotebookDocument(async (notebook) => {
            await this.onNotebookOpen(notebook, config.clientMapper, jupyterController);
        }));
        this.disposables.push(vscode.workspace.onDidCloseNotebookDocument(notebook => {
            stopTrackingNotebook(notebook);
        }));
        // ...but we may have to look at already opened ones if we were activated late
        for (const notebook of vscode.workspace.notebookDocuments) {
            this.onNotebookOpen(notebook, config.clientMapper, jupyterController);
        }
        this.disposables.push(vscode.workspace.onDidOpenTextDocument(async (textDocument) => {
            const notebook = vscode.workspace.notebookDocuments.find(n => n.getCells().find(c => c.document === textDocument) !== undefined);
            if (notebook) {
                const isDotNetNotebook = metadataUtilities.isDotNetNotebook(notebook);
                if (isDotNetNotebook) {
                    // only look at the cell metadata if the notebook is fully open
                    const isOpenComplete = isNotebookOpenComplete(notebook);
                    if (isOpenComplete) {
                        const cell = notebook.getCells().find(c => c.document === textDocument);
                        if (cell) {
                            ensureCellKernelMetadata(cell, { preferPreviousCellMetadata: true });
                        }
                    }
                }
            }
        }));
    }
    dispose() {
        this.disposables.forEach(d => d.dispose());
    }
    async onNotebookOpen(notebook, clientMapper, jupyterController) {
        if (metadataUtilities.isDotNetNotebook(notebook)) {
            // prepare initial grammar
            const kernelInfos = metadataUtilities.getKernelInfosFromNotebookDocument(notebook);
            this.tokensProvider.dynamicTokenProvider.rebuildNotebookGrammar(notebook.uri, kernelInfos);
            // eagerly spin up the backing process
            const client = await clientMapper.getOrAddClient(notebook.uri);
            client.resetExecutionCount();
            if (notebook.notebookType === constants.JupyterViewType) {
                jupyterController.updateNotebookAffinity(notebook, vscode.NotebookControllerAffinity.Preferred);
                await (0, commands_1.selectDotNetInteractiveKernelForJupyter)();
            }
            await updateNotebookMetadata(notebook, this.config.clientMapper);
        }
    }
    commonControllerInit(controller) {
        controller.supportedLanguages = [constants.CellLanguageIdentifier];
        controller.supportsExecutionOrder = true;
        this.disposables.push(controller.onDidReceiveMessage(e => {
            const notebookUri = e.editor.notebook.uri;
            const notebookUriString = notebookUri.toString();
            if (e.message.envelope) {
                let messageHandler = this.uriMessageHandlerMap.get(notebookUriString);
                if ((0, connection_1.isKernelEventEnvelopeModel)(e.message.envelope)) {
                    const event = commandsAndEvents.KernelEventEnvelope.fromJson(e.message.envelope);
                    messageHandler === null || messageHandler === void 0 ? void 0 : messageHandler.next(event);
                }
                else if ((0, connection_1.isKernelCommandEnvelopeModel)(e.message.envelope)) {
                    const command = commandsAndEvents.KernelCommandEnvelope.fromJson(e.message.envelope);
                    messageHandler === null || messageHandler === void 0 ? void 0 : messageHandler.next(command);
                }
            }
            switch (e.message.preloadCommand) {
                case '#!connect':
                    this.config.clientMapper.getOrAddClient(notebookUri).then(() => {
                        const hostUri = e.message.hostUri;
                        vscodeNotebookManagement.hashBangConnect(this.config.clientMapper, hostUri, e.message.kernelInfos, this.uriMessageHandlerMap, (arg) => {
                            controller.postMessage({ ...arg, webViewId: e.message.webViewId });
                        }, notebookUri);
                        this.config.clientMapper.getOrAddClient(notebookUri).then(client => {
                            const kernelInfos = client.kernelHost.getKernelInfos();
                            controller.postMessage({ webViewId: e.message.webViewId, preloadCommand: "#!connect", kernelInfos });
                        });
                    });
                    break;
            }
            if (e.message.logEntry) {
                logger_1.Logger.default.write(e.message.logEntry);
            }
        }));
        this.disposables.push(controller);
    }
    async executeHandler(cells, document, controller) {
        for (const cell of cells) {
            await this.executeCell(cell, controller);
        }
    }
    async executeCell(cell, controller) {
        const executionTask = controller.createNotebookCellExecution(cell);
        if (executionTask) {
            executionTasks.set(cell.document.uri.toString(), executionTask);
            let outputUpdatePromise = Promise.resolve();
            try {
                const startTime = Date.now();
                executionTask.start(startTime);
                executionTask.executionOrder = undefined;
                await executionTask.clearOutput(cell);
                const outputObserver = (output) => {
                    outputUpdatePromise = outputUpdatePromise.catch(ex => {
                        logger_1.Logger.default.error(`Failed to update output: ${ex}`);
                    }).finally(() => this.applyCellOutput(executionTask, output).catch(ex => {
                        logger_1.Logger.default.error(`Failed to update output: ${ex}`);
                    }));
                };
                const client = await this.config.clientMapper.getOrAddClient(cell.notebook.uri);
                executionTask.token.onCancellationRequested(() => {
                    client.cancel().catch(async (err) => {
                        // command failed to cancel
                        const cancelFailureMessage = typeof (err === null || err === void 0 ? void 0 : err.message) === 'string' ? err.message : '' + err;
                        const errorOutput = new vscode.NotebookCellOutput(this.config.createErrorOutput(cancelFailureMessage).items.map(oi => generateVsCodeNotebookCellOutputItem(oi.data, oi.mime, oi.stream)));
                        await executionTask.appendOutput(errorOutput);
                    });
                });
                const source = cell.document.getText();
                const diagnosticCollection = diagnostics.getDiagnosticCollection(cell.document.uri);
                function diagnosticObserver(diags) {
                    diagnosticCollection.set(cell.document.uri, diags.filter(d => d.severity !== commandsAndEvents.DiagnosticSeverity.Hidden).map(vscodeUtilities.toVsCodeDiagnostic));
                }
                return client.execute(source, { kernelName: vscodeUtilities.getCellKernelName(cell), index: cell.index }, outputObserver, diagnosticObserver, { id: cell.document.uri.toString() })
                    .then(async (success) => {
                    await outputUpdatePromise;
                    const isIpynb = metadataUtilities.isIpynbNotebook(cell.notebook);
                    const notebookDocumentMetadata = metadataUtilities.getNotebookDocumentMetadataFromNotebookDocument(cell.notebook);
                    const kernelNotebookMetadata = metadataUtilities.getNotebookDocumentMetadataFromCompositeKernel(client.kernel);
                    const mergedMetadata = metadataUtilities.mergeNotebookDocumentMetadata(notebookDocumentMetadata, kernelNotebookMetadata);
                    const rawNotebookDocumentMetadata = metadataUtilities.getMergedRawNotebookDocumentMetadataFromNotebookDocumentMetadata(mergedMetadata, cell.notebook.metadata, isIpynb);
                    await vscodeNotebookManagement.updateNotebookMetadata(cell.notebook.uri, rawNotebookDocumentMetadata);
                    endExecution(client, cell, success);
                }).catch(async () => {
                    await outputUpdatePromise;
                    endExecution(client, cell, false);
                });
            }
            catch (err) {
                const errorOutput = new vscode.NotebookCellOutput(this.config.createErrorOutput(`Error executing cell: ${err}`).items.map(oi => generateVsCodeNotebookCellOutputItem(oi.data, oi.mime, oi.stream)));
                await executionTask.appendOutput(errorOutput);
                await outputUpdatePromise;
                endExecution(undefined, cell, false);
                throw err;
            }
        }
    }
    async applyCellOutput(executionTask, output) {
        var _a;
        const streamMimetypes = new Set([standardOutputMimeType, standardErrorMimeType]);
        // ensure we're tracking output ids
        const cell = executionTask.cell;
        const trackedOutputs = (_a = this.trackedOutputIds.get(cell.notebook.uri)) !== null && _a !== void 0 ? _a : new Set();
        this.trackedOutputIds.set(cell.notebook.uri, trackedOutputs);
        if (trackedOutputs.has(output.id)) {
            // if already tracking this output, build a new collection and update them all
            const newOutputs = cell.outputs.map(o => {
                var _a;
                if (((_a = o.metadata) === null || _a === void 0 ? void 0 : _a.id) === output.id) {
                    return generateVsCodeNotebookCellOutput(output);
                }
                else {
                    return o;
                }
            });
            await executionTask.replaceOutput(newOutputs);
        }
        else {
            // if the very last output item is stdout/stderr, append to it's parent
            let appendItems = false;
            if (cell.outputs.length > 0 && output.items.length === 1) {
                const lastOutput = cell.outputs[cell.outputs.length - 1];
                if (lastOutput.items.length > 0) {
                    const lastOutputItem = lastOutput.items[lastOutput.items.length - 1];
                    const vsCodeMimeType = getVsCodeMimeTypeFromStreamType(output.items[0].stream);
                    if (streamMimetypes.has(lastOutputItem.mime) && lastOutputItem.mime === vsCodeMimeType) {
                        // last mime type matches the incomming one; append the items
                        appendItems = true;
                    }
                }
            }
            const outputItems = output.items.map(i => generateVsCodeNotebookCellOutputItem(i.data, i.mime, i.stream));
            if (appendItems) {
                const lastOutput = cell.outputs[cell.outputs.length - 1];
                await executionTask.appendOutputItems(outputItems, lastOutput);
            }
            else {
                // couldn't append to last output item, so just create a new output and track it
                const newOutput = createVsCodeNotebookCellOutput(outputItems, output.id);
                trackedOutputs.add(output.id);
                await executionTask.appendOutput(newOutput);
            }
        }
    }
}
exports.DotNetNotebookKernel = DotNetNotebookKernel;
// When a new notebook cell is discovered via `onDidOpenTextDocument` and if the cell metadata doesn't have a kernel name,
// we need to know what value to use.  If we've never seen the notebook before, then the user opened a new one and the correct
// kernel is the notebook's default.  If we _have_ seen the notebook before, then the user added a new cell and we need to
// look at the previous cell's metadata to determine the correct kernel name.
const openedNotebooks = new Set();
function markNotebookAsOpened(notebook) {
    openedNotebooks.add(notebook.uri.fsPath);
}
function isNotebookOpenComplete(notebook) {
    return openedNotebooks.has(notebook.uri.fsPath);
}
function stopTrackingNotebook(notebook) {
    openedNotebooks.delete(notebook.uri.fsPath);
}
async function ensureCellKernelMetadata(cell, options) {
    // markdown cells should not have metadata, so if we find it, remove it.
    if (cell.document.languageId === 'markdown') {
        const existingCellMetadata = metadataUtilities.getCellMetadata(cell);
        if ((existingCellMetadata === null || existingCellMetadata === void 0 ? void 0 : existingCellMetadata.polyglot_notebook) || (existingCellMetadata === null || existingCellMetadata === void 0 ? void 0 : existingCellMetadata.dotnet_interactive)) {
            const updatedCellMetadata = { ...cell.metadata };
            delete updatedCellMetadata.dotnet_interactive;
            delete updatedCellMetadata.polyglot_notebook;
            await vscodeNotebookManagement.updateNotebookCellMetadata(cell.notebook.uri, cell.index, updatedCellMetadata);
        }
        return;
    }
    // if we found the cell ensure it has kernel metadata
    const cellMetadata = metadataUtilities.getNotebookCellMetadataFromNotebookCellElement(cell);
    if (!cellMetadata.kernelName) {
        // no kernel name found; if asked, set from previous cell, otherwise set it from the notebook metadata
        let kernelNameToSet = undefined;
        if (options.preferPreviousCellMetadata && cell.index > 0) {
            const previousCell = cell.notebook.cellAt(cell.index - 1);
            const previousCellMetadata = metadataUtilities.getNotebookCellMetadataFromNotebookCellElement(previousCell);
            kernelNameToSet = previousCellMetadata.kernelName;
        }
        if (!kernelNameToSet) {
            // couldn't get it from the previous cell, or we weren't supposed to
            const notebookMetadata = metadataUtilities.getNotebookDocumentMetadataFromNotebookDocument(cell.notebook);
            kernelNameToSet = notebookMetadata.kernelInfo.defaultKernelName;
        }
        await vscodeUtilities.setCellKernelName(cell, kernelNameToSet);
    }
}
function getVsCodeMimeTypeFromStreamType(stream) {
    switch (stream) {
        case 'stdout':
            return standardOutputMimeType;
        case 'stderr':
            return standardErrorMimeType;
        default:
            return undefined;
    }
}
async function updateNotebookMetadata(notebook, clientMapper) {
    try {
        // update various metadata
        await updateDocumentKernelspecMetadata(notebook);
        for (let cell of notebook.getCells()) {
            await vscodeUtilities.ensureCellLanguageId(cell);
            // the previous call might have replaced the cell in the notebook, so we need to fetch it again to make sure it's fresh
            cell = notebook.cellAt(cell.index);
            await ensureCellKernelMetadata(cell, { preferPreviousCellMetadata: false });
        }
        markNotebookAsOpened(notebook);
        // force creation of the client so we don't have to wait for the user to execute a cell to get the tool
        const client = await clientMapper.getOrAddClient(notebook.uri);
        await updateKernelInfoMetadata(client, notebook);
    }
    catch (err) {
        vscode.window.showErrorMessage(`Failed to set document metadata for '${notebook.uri}': ${err}`);
    }
}
async function updateKernelInfoMetadata(client, document) {
    const isIpynb = metadataUtilities.isIpynbNotebook(document);
    client.channel.receiver.subscribe({
        next: async (commandOrEventEnvelope) => {
            if ((0, connection_1.isKernelEventEnvelope)(commandOrEventEnvelope) && commandOrEventEnvelope.eventType === commandsAndEvents.KernelInfoProducedType) {
                // got info about a kernel; either update an existing entry, or add a new one
                let metadataChanged = false;
                const kernelInfoProduced = commandOrEventEnvelope.event;
                const notebookMetadata = metadataUtilities.getNotebookDocumentMetadataFromNotebookDocument(document);
                for (const item of notebookMetadata.kernelInfo.items) {
                    if (item.name === kernelInfoProduced.kernelInfo.localName) {
                        metadataChanged = true;
                        if (kernelInfoProduced.kernelInfo.languageName) {
                            item.languageName = kernelInfoProduced.kernelInfo.languageName;
                        }
                        item.aliases = kernelInfoProduced.kernelInfo.aliases;
                    }
                }
                if (!metadataChanged) {
                    if (kernelInfoProduced.kernelInfo.supportedKernelCommands.find(ci => ci.name === commandsAndEvents.SubmitCodeType)) {
                        const kernelInfo = {
                            name: kernelInfoProduced.kernelInfo.localName,
                            aliases: kernelInfoProduced.kernelInfo.aliases
                        };
                        if (kernelInfoProduced.kernelInfo.languageName !== undefined && kernelInfoProduced.kernelInfo.languageName !== null) {
                            kernelInfo.languageName = kernelInfoProduced.kernelInfo.languageName;
                        }
                        // nothing changed, must be a new kernel
                        notebookMetadata.kernelInfo.items.push(kernelInfo);
                    }
                }
                const existingRawNotebookDocumentMetadata = document.metadata;
                const updatedRawNotebookDocumentMetadata = metadataUtilities.getMergedRawNotebookDocumentMetadataFromNotebookDocumentMetadata(notebookMetadata, existingRawNotebookDocumentMetadata, isIpynb);
                const newRawNotebookDocumentMetadata = metadataUtilities.mergeRawMetadata(existingRawNotebookDocumentMetadata, updatedRawNotebookDocumentMetadata);
                await vscodeNotebookManagement.updateNotebookMetadata(document.uri, newRawNotebookDocumentMetadata);
            }
        }
    });
    if (isIpynb &&
        !document.metadata.metadata.language_info) {
        document.metadata.metadata.language_info = { name: "polyglot-notebook" };
    }
}
function endExecution(client, cell, success) {
    const key = cell.document.uri.toString();
    const executionTask = executionTasks.get(key);
    if (executionTask) {
        executionTasks.delete(key);
        executionTask.executionOrder = client === null || client === void 0 ? void 0 : client.getNextExecutionCount();
        const endTime = Date.now();
        executionTask.end(success, endTime);
    }
}
function createVsCodeNotebookCellOutput(outputItems, id) {
    return new vscode.NotebookCellOutput(outputItems, { id });
}
function generateVsCodeNotebookCellOutput(output) {
    const items = output.items.map(i => generateVsCodeNotebookCellOutputItem(i.data, i.mime, i.stream));
    return createVsCodeNotebookCellOutput(items, output.id);
}
function generateVsCodeNotebookCellOutputItem(data, mime, stream) {
    const displayData = (0, utilities_1.reshapeOutputValueForVsCode)(data, mime);
    switch (stream) {
        case 'stdout':
            return vscode.NotebookCellOutputItem.stdout(new TextDecoder().decode(displayData));
        case 'stderr':
            return vscode.NotebookCellOutputItem.stderr(new TextDecoder().decode(displayData));
        default:
            return new vscode.NotebookCellOutputItem(displayData, mime);
    }
}
async function updateDocumentKernelspecMetadata(document) {
    const newMetadata = { ...document.metadata };
    await vscodeNotebookManagement.updateNotebookMetadata(document.uri, newMetadata);
}
//# sourceMappingURL=notebookControllers.js.map