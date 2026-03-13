"use strict";
// Copyright (c) .NET Foundation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlKernel = void 0;
exports.htmlDomFragmentInserter = htmlDomFragmentInserter;
exports.createHtmlKernelForBrowser = createHtmlKernelForBrowser;
const commandsAndEvents = require("./commandsAndEvents");
const kernel_1 = require("./kernel");
const logger_1 = require("./logger");
const promiseCompletionSource_1 = require("./promiseCompletionSource");
// This is a workaround for rollup warnings. See their documentation for more details: https://rollupjs.org/troubleshooting/#avoiding-eval
const eval2 = eval;
class HtmlKernel extends kernel_1.Kernel {
    constructor(kernelName, htmlFragmentInserter, languageName, languageVersion) {
        super(kernelName !== null && kernelName !== void 0 ? kernelName : "html", languageName !== null && languageName !== void 0 ? languageName : "HTML", languageVersion !== null && languageVersion !== void 0 ? languageVersion : "5");
        this.htmlFragmentInserter = htmlFragmentInserter;
        this.kernelInfo.displayName = 'HTML';
        this.kernelInfo.description = `Write and display HTML`;
        if (!this.htmlFragmentInserter) {
            this.htmlFragmentInserter = htmlDomFragmentInserter;
        }
        this.registerCommandHandler({ commandType: commandsAndEvents.SubmitCodeType, handle: invocation => this.handleSubmitCode(invocation) });
    }
    async handleSubmitCode(invocation) {
        const submitCode = invocation.commandEnvelope.command;
        const code = submitCode.code;
        const codeSubmissionReceivedEvent = new commandsAndEvents.KernelEventEnvelope(commandsAndEvents.CodeSubmissionReceivedType, { code }, invocation.commandEnvelope);
        invocation.context.publish(codeSubmissionReceivedEvent);
        if (!this.htmlFragmentInserter) {
            throw new Error("No HTML fragment processor registered");
        }
        try {
            const formattedValue = await this.htmlFragmentInserter(code);
            const displayedValueProduced = {
                formattedValues: [{
                        mimeType: "text/html",
                        value: formattedValue,
                        suppressDisplay: false
                    }]
            };
            const valueProducedEvent = new commandsAndEvents.KernelEventEnvelope(commandsAndEvents.DisplayedValueProducedType, { formattedValues: displayedValueProduced.formattedValues }, invocation.commandEnvelope);
            invocation.context.publish(valueProducedEvent);
        }
        catch (e) {
            throw e; //?
        }
    }
}
exports.HtmlKernel = HtmlKernel;
;
function htmlDomFragmentInserter(htmlFragment, configuration) {
    var _a, _b, _c, _d;
    const getOrCreateContainer = (_a = configuration === null || configuration === void 0 ? void 0 : configuration.getOrCreateContainer) !== null && _a !== void 0 ? _a : (() => {
        const container = document.createElement("div");
        document.body.appendChild(container);
        return container;
    });
    const nomarliseFragment = (_b = configuration === null || configuration === void 0 ? void 0 : configuration.normalizeHtmlFragment) !== null && _b !== void 0 ? _b : ((htmlFragment) => {
        const container = document.createElement("div");
        container.innerHTML = htmlFragment;
        return container.innerHTML;
    });
    const updateContainerContent = (_c = configuration === null || configuration === void 0 ? void 0 : configuration.updateContainerContent) !== null && _c !== void 0 ? _c : ((container, htmlFragment) => container.innerHTML = htmlFragment);
    const createMutationObserver = (_d = configuration === null || configuration === void 0 ? void 0 : configuration.createMutationObserver) !== null && _d !== void 0 ? _d : (callback => new MutationObserver(callback));
    let jsEvaluator;
    if (configuration === null || configuration === void 0 ? void 0 : configuration.jsEvaluator) {
        jsEvaluator = configuration.jsEvaluator;
    }
    else {
        const AsyncFunction = eval2(`Object.getPrototypeOf(async function(){}).constructor`);
        jsEvaluator = (code) => {
            const evaluator = AsyncFunction(code);
            return evaluator();
        };
    }
    let container = getOrCreateContainer();
    const normalisedHtmlFragment = nomarliseFragment(htmlFragment);
    const completionPromise = new promiseCompletionSource_1.PromiseCompletionSource();
    const mutationObserver = createMutationObserver((mutations, observer) => {
        for (const mutation of mutations) {
            if (mutation.type === "childList") {
                const done = container.innerHTML.includes(normalisedHtmlFragment);
                done; //?
                if (done) {
                    completionPromise.resolve();
                    mutationObserver.disconnect();
                    return;
                }
            }
        }
    });
    mutationObserver.observe(container, { childList: true, subtree: true });
    updateContainerContent(container, normalisedHtmlFragment);
    return completionPromise.promise.then(() => {
        container.querySelectorAll("script").forEach(async (script) => {
            var _a;
            if (script.textContent) {
                try {
                    await jsEvaluator(script.textContent);
                }
                catch (e) {
                    logger_1.Logger.default.error((_a = e === null || e === void 0 ? void 0 : e.message) !== null && _a !== void 0 ? _a : e);
                }
            }
        });
        return container.innerHTML;
    });
}
function createHtmlKernelForBrowser(config) {
    if (withfragmentInserterConfiguration(config)) {
        return new HtmlKernel(config.kernelName, (fragment) => htmlDomFragmentInserter(fragment, config.htmlDomFragmentInserterConfiguration));
    }
    else {
        const kernel = new HtmlKernel(config.kernelName, (htmlFragment) => htmlDomFragmentInserter(htmlFragment, {
            getOrCreateContainer: () => {
                if (isHtmlElement(config.container)) {
                    return config.container;
                }
                else {
                    const container = document.querySelector(config.container);
                    if (!container) {
                        throw new Error(`Container ${config.container} not found`);
                    }
                    return container;
                }
            },
            updateContainerContent: (container, htmlFragment) => {
                if (config.contentBehaviour === "append") {
                    container.innerHTML += htmlFragment;
                }
                else {
                    container.innerHTML = htmlFragment;
                }
            }
        }));
        return kernel;
    }
}
function isHtmlElement(element) {
    return typeof element === "object";
}
function withfragmentInserterConfiguration(config) {
    return (config === null || config === void 0 ? void 0 : config.htmlDomFragmentInserterConfiguration) !== undefined;
}
//# sourceMappingURL=htmlKernel.js.map