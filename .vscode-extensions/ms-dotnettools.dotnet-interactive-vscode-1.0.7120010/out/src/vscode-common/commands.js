"use strict";
// Copyright (c) .NET Foundation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAcquisitionCommands = registerAcquisitionCommands;
exports.registerKernelCommands = registerKernelCommands;
exports.registerFileCommands = registerFileCommands;
exports.selectDotNetInteractiveKernelForJupyter = selectDotNetInteractiveKernelForJupyter;
const vscode = require("vscode");
const path = require("path");
const acquisition_1 = require("./acquisition");
const vscodeUtilities_1 = require("./vscodeUtilities");
const extension_1 = require("./extension");
const utilities_1 = require("./utilities");
const notebookControllers = require("./notebookControllers");
const metadataUtilities = require("./metadataUtilities");
const promiseCompletionSource_1 = require("./polyglot-notebooks/promiseCompletionSource");
const constants = require("./constants");
async function registerAcquisitionCommands(context, diagnosticChannel) {
    const dotnetConfig = vscode.workspace.getConfiguration(constants.DotnetConfigurationSectionName);
    const requiredDotNetInteractiveVersion = dotnetConfig.get('requiredInteractiveToolVersion');
    const interactiveToolSource = dotnetConfig.get('interactiveToolSource');
    if (!requiredDotNetInteractiveVersion) {
        const errorTitle = 'Polyglot Notebooks extension will not work.';
        const errorDetails = `Incorrect value for option "${constants.DotnetConfigurationSectionName}.requiredInteractiveToolVersion" in settings.json.  Please remove this value and restart VS Code.`;
        await vscode.window.showErrorMessage(errorTitle, { modal: true, detail: errorDetails });
        throw new Error(errorDetails);
    }
    let acquirePromise = undefined;
    context.subscriptions.push(vscode.commands.registerCommand('dotnet-interactive.acquire', async (args) => {
        try {
            const installArgs = (0, utilities_1.computeToolInstallArguments)(args);
            extension_1.DotNetPathManager.setDotNetPath(installArgs.dotnetPath);
            if (!acquirePromise) {
                const installationPromiseCompletionSource = new promiseCompletionSource_1.PromiseCompletionSource();
                acquirePromise = (0, acquisition_1.acquireDotnetInteractive)(installArgs, requiredDotNetInteractiveVersion, context.globalStorageUri.fsPath, getInteractiveVersion, createToolManifest, (version) => {
                    vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: `Installing .NET Interactive version ${version}...` }, (_progress, _token) => installationPromiseCompletionSource.promise);
                }, installInteractiveTool, () => { installationPromiseCompletionSource.resolve(); });
            }
            const launchOptions = await acquirePromise;
            return launchOptions;
        }
        catch (err) {
            diagnosticChannel.appendLine(`Error acquiring dotnet-interactive tool: ${err}`);
        }
    }));
    async function createToolManifest(dotnetPath, globalStoragePath) {
        const result = await (0, utilities_1.executeSafeAndLog)(diagnosticChannel, 'create-tool-manifest', dotnetPath, ['new', 'tool-manifest'], globalStoragePath);
        if (result.code !== 0) {
            throw new Error(`Unable to create local tool manifest.  Command failed with code ${result.code}.\n\nSTDOUT:\n${result.output}\n\nSTDERR:\n${result.error}`);
        }
    }
    async function installInteractiveTool(args, globalStoragePath) {
        // remove previous tool; swallow errors in case it's not already installed
        let uninstallArgs = [
            'tool',
            'uninstall',
            'Microsoft.dotnet-interactive'
        ];
        await (0, utilities_1.executeSafeAndLog)(diagnosticChannel, 'tool-uninstall', args.dotnetPath, uninstallArgs, globalStoragePath);
        let toolArgs = [
            'tool',
            'install',
            '--add-source',
            interactiveToolSource,
            '--ignore-failed-sources',
            'Microsoft.dotnet-interactive'
        ];
        if (args.toolVersion) {
            toolArgs.push('--version', args.toolVersion);
        }
        return new Promise(async (resolve, reject) => {
            const result = await (0, utilities_1.executeSafeAndLog)(diagnosticChannel, 'tool-install', args.dotnetPath, toolArgs, globalStoragePath);
            if (result.code === 0) {
                resolve();
            }
            else {
                reject();
            }
        });
    }
}
function getCurrentNotebookDocument() {
    if (!vscode.window.activeNotebookEditor) {
        return undefined;
    }
    return vscode.window.activeNotebookEditor.notebook;
}
function registerKernelCommands(context, clientMapper) {
    context.subscriptions.push(vscode.commands.registerCommand('polyglot-notebook.notebookEditor.restartKernel', async (_notebookEditor) => {
        await vscode.commands.executeCommand('polyglot-notebook.restartCurrentNotebookKernel');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('polyglot-notebook.notebookEditor.openValueViewer', async () => {
        // vscode creates a command named `<viewId>.focus` for all contributed views, so we need to match the id
        await vscode.commands.executeCommand('polyglot-notebook-panel-values.focus');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('polyglot-notebook.notebookEditor.connectSubkernel', async (notebook) => {
        var _a;
        notebook = notebook || getCurrentNotebookDocument();
        if (!notebook) {
            return;
        }
        const client = await clientMapper.getOrAddClient(notebook.uri);
        const result = await client.requestCodeExpansionInfos();
        const dataConnectionOptions = mapCodeExpansionInfosToQuickPickOptions(result.codeExpansionInfos
            .filter(i => i.kind === "DataConnection"));
        const kernelspecConnectionOptions = mapCodeExpansionInfosToQuickPickOptions(result.codeExpansionInfos
            .filter(i => i.kind === "KernelSpecConnection"));
        const recentlyUsedConnectionOptions = mapCodeExpansionInfosToQuickPickOptions(result.codeExpansionInfos
            .filter(i => i.kind === "RecentConnection"));
        const allOptions = [
            { kind: vscode.QuickPickItemKind.Separator, label: 'Data kernels', description: '' },
            ...dataConnectionOptions,
            { kind: vscode.QuickPickItemKind.Separator, label: 'Jupyter kernels', description: '' },
            ...kernelspecConnectionOptions,
            { kind: vscode.QuickPickItemKind.Separator, label: 'Recent kernels', description: '' },
            ...recentlyUsedConnectionOptions
        ];
        const selectedOption = await vscode.window.showQuickPick(allOptions, { title: 'Connect to new cell kernel' });
        if (selectedOption) {
            const selection = (_a = vscode.window.activeNotebookEditor) === null || _a === void 0 ? void 0 : _a.selection;
            client.execute(`#!expand "${selectedOption.label}"`, { kernelName: ".NET", index: selection === null || selection === void 0 ? void 0 : selection.end }, output => { }, _ => { });
        }
        function mapCodeExpansionInfosToQuickPickOptions(infos) {
            return infos.map(i => {
                return {
                    label: i.name,
                    description: i.description,
                    iconPath: new vscode.ThemeIcon('plug')
                };
            });
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('polyglot-notebook.restartCurrentNotebookKernel', async (notebook) => {
        notebook = notebook || getCurrentNotebookDocument();
        if (notebook) {
            // notifty the client that the kernel is about to restart
            const restartCompletionSource = new promiseCompletionSource_1.PromiseCompletionSource();
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Restarting kernel...'
            }, (_progress, _token) => restartCompletionSource.promise);
            await vscode.commands.executeCommand('polyglot-notebook.stopCurrentNotebookKernel', notebook);
            await vscode.commands.executeCommand('polyglot-notebook.resetNotebookKernelCollection', notebook);
            const _client = await clientMapper.getOrAddClient(notebook.uri);
            restartCompletionSource.resolve();
            await vscode.commands.executeCommand('workbench.notebook.layout.webview.reset', notebook.uri);
            vscode.window.showInformationMessage('Kernel restarted.');
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('polyglot-notebook.stopCurrentNotebookKernel', async (notebook) => {
        notebook = notebook || getCurrentNotebookDocument();
        if (notebook) {
            for (const cell of notebook.getCells()) {
                notebookControllers.endExecution(undefined, cell, false);
            }
            const client = await clientMapper.tryGetClient(notebook.uri);
            if (client) {
                client.resetExecutionCount();
            }
            clientMapper.closeClient(notebook.uri);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('polyglot-notebook.stopAllNotebookKernels', async () => {
        vscode.workspace.notebookDocuments
            .filter(document => clientMapper.isDotNetClient(document.uri))
            .forEach(async (document) => await vscode.commands.executeCommand('polyglot-notebook.stopCurrentNotebookKernel', document));
    }));
}
function registerFileCommands(context, parserServer, clientMapper) {
    const eol = (0, vscodeUtilities_1.getEol)();
    const notebookFileFilters = {
        'Polyglot Notebook Script': ['dib'],
        'Jupyter Notebook': ['ipynb'],
    };
    async function newNotebookCommandHandler(preferDefaults) {
        const extension = await getNewNotebookExtension(preferDefaults);
        if (!extension) {
            return;
        }
        const language = await getNewNotebookLanguage(preferDefaults);
        if (!language) {
            return;
        }
        await newNotebookWithLanguage(extension, language);
        if (preferDefaults) {
            // if the defaults were even in play, ask the user if they want to save them
            // don't await this, since it's not critical
            promptToSaveDefaults(extension, language);
        }
    }
    async function promptToSaveDefaults(extension, language) {
        const polyglotConfig = vscode.workspace.getConfiguration(constants.PolyglotConfigurationSectionName);
        // check to see if the user doesn't want to see this
        const suppressPromptToSaveDefaults = polyglotConfig.get('suppressPromptToSaveDefaults');
        if (suppressPromptToSaveDefaults) {
            return;
        }
        // if some default settings were missing...
        const defaultExtension = polyglotConfig.get('defaultNotebookExtension');
        const defaultLanguage = polyglotConfig.get('defaultNotebookLanguage');
        if (!defaultExtension || !defaultLanguage) {
            // ...ask if they want to save the defaults
            const setDefaultsOption = 'Set defaults';
            const dontAskOption = "Don't ask again";
            const saveDefaults = await vscode.window.showInformationMessage('Would you like to set default values for future notebooks?', setDefaultsOption, 'Dismiss', dontAskOption);
            if (saveDefaults === setDefaultsOption) {
                // set the values the user just selected...
                await polyglotConfig.update('defaultNotebookExtension', extension, vscode.ConfigurationTarget.Global);
                await polyglotConfig.update('defaultNotebookLanguage', language, vscode.ConfigurationTarget.Global);
                // ...then open the settings so they can make any additional changes
                vscode.commands.executeCommand('polyglot-notebook.setNewNotebookDefaults');
            }
            else if (saveDefaults === dontAskOption) {
                // set the value to suppress the prompt
                await polyglotConfig.update('suppressPromptToSaveDefaults', true, vscode.ConfigurationTarget.Global);
            }
            else {
                // anything else was either 'Dismiss' or the dialog was closed
            }
        }
    }
    async function getNewNotebookExtension(preferDefault) {
        const polyglotConfig = vscode.workspace.getConfiguration(constants.PolyglotConfigurationSectionName);
        if (preferDefault) {
            // try to get the default notebook type
            const defaultNotebookExtension = polyglotConfig.get('defaultNotebookExtension');
            if (defaultNotebookExtension) {
                return defaultNotebookExtension;
            }
        }
        // either wanted a fresh value, or no default was set; directly ask the user
        const availableNotebookExtensions = ['.dib', '.ipynb'];
        const selectedExtension = await vscode.window.showQuickPick(availableNotebookExtensions, { title: 'Create as...' });
        if (selectedExtension) {
            return selectedExtension;
        }
        return undefined;
    }
    async function getNewNotebookLanguage(preferDefault) {
        const polyglotConfig = vscode.workspace.getConfiguration(constants.PolyglotConfigurationSectionName);
        if (preferDefault) {
            // try to get the default notebook type
            const defaultNotebookLanguage = polyglotConfig.get('defaultNotebookLanguage');
            if (defaultNotebookLanguage) {
                return defaultNotebookLanguage;
            }
        }
        // either wanted a fresh value, or no default was set; directly ask the user
        const languagesAndKernelNames = {
            'C#': 'csharp',
            'F#': 'fsharp',
            'HTML': 'html',
            'JavaScript': 'javascript',
            'Markdown': 'markdown',
            'Mermaid': 'mermaid',
            'PowerShell': 'pwsh'
        };
        const newLanguageOptions = [];
        for (const languageName in languagesAndKernelNames) {
            newLanguageOptions.push(languageName);
        }
        const notebookLanguage = await vscode.window.showQuickPick(newLanguageOptions, { title: 'Default Language' });
        if (notebookLanguage) {
            return languagesAndKernelNames[notebookLanguage];
        }
        return undefined;
    }
    async function newNotebookFromExtension(extension) {
        const language = await getNewNotebookLanguage(true);
        if (!language) {
            return;
        }
        await newNotebookWithLanguage(extension, language);
    }
    async function newNotebookWithLanguage(extension, kernelName) {
        const extensionViewTypeMap = {
            '.dib': constants.NotebookViewType,
            '.ipynb': constants.JupyterViewType,
        };
        const viewType = extensionViewTypeMap[extension];
        const isMarkdown = kernelName.toLowerCase() === 'markdown';
        // the metadata needs an actual kernel name, not the special-cased 'markdown'
        const kernelNameInMetadata = isMarkdown ? 'csharp' : kernelName;
        const notebookCellMetadata = {
            kernelName: kernelNameInMetadata,
        };
        const rawCellMetadata = metadataUtilities.getRawNotebookCellMetadataFromNotebookCellMetadata(notebookCellMetadata);
        const [cellKind, cellLanguage] = isMarkdown ? [vscode.NotebookCellKind.Markup, 'markdown'] : [vscode.NotebookCellKind.Code, constants.CellLanguageIdentifier];
        const cell = new vscode.NotebookCellData(cellKind, '', cellLanguage);
        cell.metadata = rawCellMetadata;
        const notebookDocumentMetadata = {
            kernelInfo: {
                defaultKernelName: kernelNameInMetadata,
                items: [
                    {
                        name: kernelNameInMetadata,
                        aliases: [],
                        languageName: kernelNameInMetadata // it just happens that the kernel names we allow are also the language names
                    }
                ]
            }
        };
        const createForIpynb = viewType === constants.JupyterViewType;
        const rawNotebookMetadata = metadataUtilities.getMergedRawNotebookDocumentMetadataFromNotebookDocumentMetadata(notebookDocumentMetadata, {}, createForIpynb);
        const content = new vscode.NotebookData([cell]);
        content.metadata = rawNotebookMetadata;
        const notebook = await vscode.workspace.openNotebookDocument(viewType, content);
        const _editor = await vscode.window.showNotebookDocument(notebook);
        if (createForIpynb) {
            await selectDotNetInteractiveKernelForJupyter();
        }
    }
    context.subscriptions.push(vscode.commands.registerCommand('polyglot-notebook.setNewNotebookDefaults', async () => {
        await vscode.commands.executeCommand('workbench.action.openGlobalSettings', { query: 'polyglot-notebook.defaultNotebook' });
    }));
    context.subscriptions.push(vscode.commands.registerCommand('polyglot-notebook.newNotebook', async () => {
        await newNotebookCommandHandler(true);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('polyglot-notebook.newNotebookNoDefaults', async () => {
        await newNotebookCommandHandler(false);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('polyglot-notebook.fileNew', async () => {
        // this command exists purely to forward to the polyglot-notebook.newNotebook command, but we need a separate `title`/`shortTitle` for the command palette
        await vscode.commands.executeCommand('polyglot-notebook.newNotebook');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('polyglot-notebook.newNotebookDib', async () => {
        await newNotebookFromExtension('.dib');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('polyglot-notebook.newNotebookIpynb', async () => {
        await newNotebookFromExtension('.ipynb');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('polyglot-notebook.openNotebook', async (notebookUri) => {
        // ensure we have a notebook uri
        if (!notebookUri) {
            const uris = await vscode.window.showOpenDialog({
                filters: notebookFileFilters
            });
            if (uris && uris.length > 0) {
                notebookUri = uris[0];
            }
            if (!notebookUri) {
                // no appropriate uri
                return;
            }
        }
        await openNotebook(notebookUri);
    }));
    async function openNotebook(uri) {
        const extension = path.extname(uri.toString());
        const viewType = extension === '.dib'
            ? constants.NotebookViewType
            : constants.JupyterViewType;
        await vscode.commands.executeCommand('vscode.openWith', uri, viewType);
    }
    context.subscriptions.push(vscode.commands.registerCommand('polyglot-notebook.saveAsNotebook', async () => {
        if (vscode.window.activeNotebookEditor) {
            const uri = await vscode.window.showSaveDialog({
                filters: notebookFileFilters
            });
            if (!uri) {
                return;
            }
            const notebook = vscode.window.activeNotebookEditor.notebook;
            const interactiveDocument = (0, vscodeUtilities_1.toNotebookDocument)(notebook);
            const uriPath = uri.toString();
            const extension = path.extname(uriPath);
            const documentType = (0, utilities_1.extensionToDocumentType)(extension);
            const buffer = await parserServer.serializeNotebook(documentType, eol, interactiveDocument);
            await vscode.workspace.fs.writeFile(uri, buffer);
            switch (path.extname(uriPath)) {
                case '.dib':
                    await vscode.commands.executeCommand('polyglot-notebook.openNotebook', uri);
                    break;
            }
        }
    }));
}
async function selectDotNetInteractiveKernelForJupyter() {
    const extension = 'ms-dotnettools.dotnet-interactive-vscode';
    const id = constants.JupyterKernelId;
    await vscode.commands.executeCommand('notebook.selectKernel', { extension, id });
}
// callbacks used to install interactive tool
async function getInteractiveVersion(dotnetPath, globalStoragePath) {
    const result = await (0, utilities_1.executeSafe)(dotnetPath, ['tool', 'run', 'dotnet-interactive', '--', '--version'], globalStoragePath);
    if (result.code === 0) {
        const versionString = (0, utilities_1.getVersionNumber)(result.output);
        return versionString;
    }
    return undefined;
}
//# sourceMappingURL=commands.js.map