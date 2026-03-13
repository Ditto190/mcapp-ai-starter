"use strict";
// Copyright (c) .NET Foundation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.provideHover = provideHover;
const utilities_1 = require("../utilities");
function provideHover(clientMapper, language, documentUri, documentText, position, languageServiceDelay) {
    return (0, utilities_1.debounceAndReject)(`hover-${documentUri.toString()}`, languageServiceDelay, async () => {
        const client = await clientMapper.getOrAddClient(documentUri);
        const hoverText = await client.hover(language, documentText, position.line, position.character);
        if (hoverText.content.length > 0) {
            const content = hoverText.content.sort((a, b) => mimeTypeToPriority(a.mimeType) - mimeTypeToPriority(b.mimeType))[0];
            const hoverResult = {
                contents: content.value,
                isMarkdown: content.mimeType === 'text/markdown' || content.mimeType === 'text/x-markdown',
                range: hoverText.linePositionSpan
            };
            return hoverResult;
        }
        return {
            contents: "",
            isMarkdown: false,
            range: undefined
        };
    });
}
function mimeTypeToPriority(mimeType) {
    switch (mimeType) {
        case 'text/markdown':
        case 'text/x-markdown':
            return 1;
        case 'text/plain':
            return 2;
        default:
            return 99;
    }
}
//# sourceMappingURL=hover.js.map