"use strict";
// Copyright (c) .NET Foundation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceNotebookCells = replaceNotebookCells;
exports.updateNotebookCellMetadata = updateNotebookCellMetadata;
exports.updateNotebookMetadata = updateNotebookMetadata;
exports.handleCustomInputRequest = handleCustomInputRequest;
exports.isNotebookDirty = isNotebookDirty;
exports.hashBangConnect = hashBangConnect;
const vscode = require("vscode");
const logger_1 = require("./polyglot-notebooks/logger");
const polyglot_notebooks_1 = require("./polyglot-notebooks");
const rxjs = require("rxjs");
const connection = require("./polyglot-notebooks/connection");
const commandsAndEvents = require("./polyglot-notebooks/commandsAndEvents");
const metadataUtilities_1 = require("./metadataUtilities");
async function replaceNotebookCells(notebookUri, range, cells) {
    const notebookEdit = vscode.NotebookEdit.replaceCells(range, cells);
    const edit = new vscode.WorkspaceEdit();
    edit.set(notebookUri, [notebookEdit]);
    const succeeded = await vscode.workspace.applyEdit(edit);
    return succeeded;
}
async function updateNotebookCellMetadata(notebookUri, cellIndex, newCellMetadata) {
    // This is a workaround for a bug in VSCode's .ipynb handling which responds the same notification and races with this code, clobbering our metadata change. Yielding to the event loop seems to help.
    await new Promise(resolve => setTimeout(resolve, 0));
    const notebookEdit = vscode.NotebookEdit.updateCellMetadata(cellIndex, newCellMetadata);
    const edit = new vscode.WorkspaceEdit();
    edit.set(notebookUri, [notebookEdit]);
    const succeeded = await vscode.workspace.applyEdit(edit);
    return succeeded;
}
async function updateNotebookMetadata(notebookUri, documentMetadata) {
    const notebook = vscode.workspace.notebookDocuments.find(d => d.uri === notebookUri);
    if (notebook) {
        const metadata = notebook.metadata;
        const shouldUpdate = !(0, metadataUtilities_1.areEquivalentObjects)(metadata, documentMetadata);
        if (shouldUpdate) {
            const notebookEdit = vscode.NotebookEdit.updateNotebookMetadata(documentMetadata);
            const edit = new vscode.WorkspaceEdit();
            edit.set(notebookUri, [notebookEdit]);
            const succeeded = await vscode.workspace.applyEdit(edit);
        }
    }
}
async function handleCustomInputRequest(prompt, inputTypeHint, password) {
    return { handled: false, result: undefined };
}
function isNotebookDirty(notebookUri) {
    const notebook = vscode.workspace.notebookDocuments.find(d => d.uri === notebookUri);
    if (!notebook) {
        throw new Error(`Notebook with URI ${notebookUri.toString()} not found`);
    }
    return notebook.isDirty;
}
function hashBangConnect(clientMapper, hostUri, kernelInfos, messageHandlerMap, controllerPostMessage, documentUri) {
    logger_1.Logger.default.info(`handling #!connect for ${documentUri.toString()}`);
    hashBangConnectPrivate(clientMapper, hostUri, kernelInfos, messageHandlerMap, controllerPostMessage, documentUri);
}
function hashBangConnectPrivate(clientMapper, hostUri, kernelInfos, messageHandlerMap, controllerPostMessage, documentUri) {
    logger_1.Logger.default.info(`handling #!connect from '${hostUri}' for notebook: ${documentUri.toString()}`);
    const documentUriString = documentUri.toString();
    clientMapper.getOrAddClient(documentUri).then(client => {
        let messageHandler = messageHandlerMap.get(documentUriString);
        if (!messageHandler) {
            messageHandler = new rxjs.Subject();
            messageHandlerMap.set(documentUriString, messageHandler);
        }
        let extensionHostToWebviewSender = polyglot_notebooks_1.KernelCommandAndEventSender.FromFunction(envelope => {
            const commandOrEventForWebview = { envelope: envelope.toJson() };
            controllerPostMessage(commandOrEventForWebview);
        });
        let WebviewToExtensionHostReceiver = polyglot_notebooks_1.KernelCommandAndEventReceiver.FromObservable(messageHandler);
        logger_1.Logger.default.info(`configuring routing for host '${hostUri}'`);
        let subscriptionToExtensionHost = client.channel.receiver.subscribe({
            next: envelope => {
                if ((0, polyglot_notebooks_1.isKernelEventEnvelope)(envelope)) {
                    logger_1.Logger.default.info(`forwarding event to '${hostUri}' ${JSON.stringify(envelope.toJson())}`);
                    extensionHostToWebviewSender.send(envelope);
                }
            }
        });
        let subscriptionToWebView = WebviewToExtensionHostReceiver.subscribe({
            next: envelope => {
                var _a, _b, _c;
                if ((0, polyglot_notebooks_1.isKernelCommandEnvelope)(envelope)) {
                    // handle command routing
                    if (envelope.command.destinationUri) {
                        if (envelope.command.destinationUri.startsWith("kernel://vscode")) {
                            // wants to go to vscode
                            logger_1.Logger.default.info(`routing command from '${hostUri}' ${JSON.stringify(envelope)} to extension host`);
                            const kernel = client.kernelHost.getKernel(envelope);
                            kernel.send(envelope);
                        }
                        else {
                            const host = (0, polyglot_notebooks_1.extractHostAndNomalize)(envelope.command.destinationUri);
                            const connector = client.kernelHost.tryGetConnector(host);
                            if (connector) {
                                // route to interactive
                                logger_1.Logger.default.info(`routing command from '${hostUri}' ${JSON.stringify(envelope)} to '${host}'`);
                                connector.sender.send(envelope);
                            }
                            else {
                                logger_1.Logger.default.error(`cannot find connector to reach${envelope.command.destinationUri}`);
                            }
                        }
                    }
                    else {
                        const kernel = client.kernelHost.getKernel(envelope);
                        kernel.send(envelope);
                    }
                }
                if ((0, polyglot_notebooks_1.isKernelEventEnvelope)(envelope)) {
                    if (envelope.eventType === commandsAndEvents.KernelInfoProducedType) {
                        const kernelInfoProduced = envelope.event;
                        if (!connection.isKernelInfoForProxy(kernelInfoProduced.kernelInfo)) {
                            connection.ensureOrUpdateProxyForKernelInfo(kernelInfoProduced.kernelInfo, client.kernel);
                        }
                    }
                    if ((_a = envelope.command) === null || _a === void 0 ? void 0 : _a.command.originUri) {
                        const host = (0, polyglot_notebooks_1.extractHostAndNomalize)((_b = envelope.command) === null || _b === void 0 ? void 0 : _b.command.originUri);
                        const connector = client.kernelHost.tryGetConnector(host);
                        if (connector) {
                            // route to interactive
                            logger_1.Logger.default.info(`routing event from webview ${JSON.stringify(envelope)} to host ${host}`);
                            connector.sender.send(envelope);
                        }
                        else {
                            logger_1.Logger.default.error(`cannot find connector to reach ${(_c = envelope.command) === null || _c === void 0 ? void 0 : _c.command.originUri}`);
                        }
                    }
                }
            }
        });
        client.kernelHost.tryAddConnector({
            sender: extensionHostToWebviewSender,
            receiver: WebviewToExtensionHostReceiver,
            remoteUris: ["kernel://webview"]
        });
        client.registerForDisposal(() => {
            messageHandlerMap.delete(documentUriString);
            client.kernelHost.tryRemoveConnector({ remoteUris: ["kernel://webview"] });
            subscriptionToExtensionHost.unsubscribe();
            subscriptionToWebView.unsubscribe();
        });
        for (const kernelInfo of kernelInfos) {
            const remoteUri = kernelInfo.isProxy ? kernelInfo.remoteUri : kernelInfo.uri;
            if (!client.kernelHost.tryGetConnector(remoteUri)) {
                client.kernelHost.defaultConnector.addRemoteHostUri(remoteUri);
            }
            connection.ensureOrUpdateProxyForKernelInfo(kernelInfo, client.kernel);
        }
    });
}
//# sourceMappingURL=vscodeNotebookManagement.js.map