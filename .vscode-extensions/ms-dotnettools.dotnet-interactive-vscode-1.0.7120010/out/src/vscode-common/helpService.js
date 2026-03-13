"use strict";
// Copyright (c) .NET Foundation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpService = exports.Deprecation = exports.DotNetVersion = void 0;
const path = require("path");
const vscode = require("vscode");
exports.DotNetVersion = 'DotNetVersion';
exports.Deprecation = 'Polyglot Notebooks Deprecation';
class HelpService {
    constructor(context) {
        this.context = context;
    }
    async showHelpPage(page) {
        const helpPagePath = getHelpPagePath(this.context, page);
        const helpPageUri = vscode.Uri.file(helpPagePath);
        await vscode.commands.executeCommand('markdown.showPreview', helpPageUri);
    }
    async showHelpPageAndThrow(page) {
        await this.showHelpPage(page);
        throw new Error('Error activating extension, see the displayed help page for more details.');
    }
}
exports.HelpService = HelpService;
function getHelpPagePath(context, page) {
    const basePath = path.join(context.extensionPath, 'help');
    const helpPagePath = path.join(basePath, `${page}.md`);
    return helpPagePath;
}
//# sourceMappingURL=helpService.js.map