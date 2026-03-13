"use strict";
// Copyright (c) .NET Foundation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.provideSignatureHelp = provideSignatureHelp;
const utilities_1 = require("../utilities");
function provideSignatureHelp(clientMapper, language, documentUri, documentText, position, languageServiceDelay) {
    return (0, utilities_1.debounceAndReject)(`sighelp-${documentUri.toString()}`, languageServiceDelay, async () => {
        const client = await clientMapper.getOrAddClient(documentUri);
        const sigHelp = await client.signatureHelp(language, documentText, position.line, position.character);
        return sigHelp;
    });
}
//# sourceMappingURL=signatureHelp.js.map