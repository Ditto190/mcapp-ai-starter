"use strict";
// Copyright (c) .NET Foundation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.provideCompletion = provideCompletion;
const utilities_1 = require("../utilities");
function provideCompletion(clientMapper, kernelName, documentUri, documentText, position, languageServiceDelay) {
    return (0, utilities_1.debounceAndReject)(`completion-${documentUri.toString()}`, languageServiceDelay, async () => {
        const client = await clientMapper.getOrAddClient(documentUri);
        const completion = await client.completion(kernelName, documentText, position.line, position.character);
        return completion;
    });
}
//# sourceMappingURL=completion.js.map