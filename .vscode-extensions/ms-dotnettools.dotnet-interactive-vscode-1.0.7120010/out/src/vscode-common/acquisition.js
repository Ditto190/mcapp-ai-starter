"use strict";
// Copyright (c) .NET Foundation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.acquireDotnetInteractive = acquireDotnetInteractive;
const fs = require("fs");
const path = require("path");
const utilities_1 = require("./utilities");
// The acquisition function.  Uses predefined callbacks for external command invocations to make testing easier.
async function acquireDotnetInteractive(args, requiredDotNetInteractiveVersion, globalStoragePath, getInteractiveVersion, createToolManifest, reportInstallationStarted, installInteractive, reportInstallationFinished) {
    var _a;
    // Ensure `globalStoragePath` exists.  This prevents a bunch of issues with spawned processes and working directories.
    if (!fs.existsSync(globalStoragePath)) {
        fs.mkdirSync(globalStoragePath);
    }
    // create tool manifest if necessary
    const toolManifestFile = path.join(globalStoragePath, '.config', 'dotnet-tools.json');
    if (!fs.existsSync(toolManifestFile)) {
        await createToolManifest(args.dotnetPath, globalStoragePath);
    }
    const launchOptions = {
        workingDirectory: globalStoragePath
    };
    // determine if acquisition is necessary
    const requiredVersion = (_a = args.toolVersion) !== null && _a !== void 0 ? _a : requiredDotNetInteractiveVersion;
    const currentVersion = await getInteractiveVersion(args.dotnetPath, globalStoragePath);
    if (currentVersion && (0, utilities_1.isVersionExactlyEqual)(currentVersion, requiredVersion)) {
        // current is acceptable
        return launchOptions;
    }
    // no current version installed or it's incorrect
    reportInstallationStarted(requiredVersion);
    await installInteractive({
        dotnetPath: args.dotnetPath,
        toolVersion: requiredVersion
    }, globalStoragePath);
    reportInstallationFinished();
    return launchOptions;
}
//# sourceMappingURL=acquisition.js.map