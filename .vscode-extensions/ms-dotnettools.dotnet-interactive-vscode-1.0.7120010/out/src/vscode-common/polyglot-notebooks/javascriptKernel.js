"use strict";
// Copyright (c) .NET Foundation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavascriptKernel = void 0;
exports.formatValue = formatValue;
exports.getType = getType;
const commandsAndEvents = require("./commandsAndEvents");
const connection = require("./connection");
const consoleCapture_1 = require("./consoleCapture");
const kernel_1 = require("./kernel");
const logger_1 = require("./logger");
const polyglotNotebooksApi = require("./api");
// This is a workaround for rollup warnings. See their documentation for more details: https://rollupjs.org/troubleshooting/#avoiding-eval
const eval2 = eval;
class JavascriptKernel extends kernel_1.Kernel {
    constructor(name) {
        super(name !== null && name !== void 0 ? name : "javascript", "JavaScript");
        this.kernelInfo.displayName = `${this.kernelInfo.localName} - ${this.kernelInfo.languageName}`;
        this.kernelInfo.description = `Run JavaScript code`;
        this.suppressedLocals = new Set(this.allLocalVariableNames());
        this.registerCommandHandler({ commandType: commandsAndEvents.SubmitCodeType, handle: invocation => this.handleSubmitCode(invocation) });
        this.registerCommandHandler({ commandType: commandsAndEvents.RequestValueInfosType, handle: invocation => this.handleRequestValueInfos(invocation) });
        this.registerCommandHandler({ commandType: commandsAndEvents.RequestValueType, handle: invocation => this.handleRequestValue(invocation) });
        this.registerCommandHandler({ commandType: commandsAndEvents.SendValueType, handle: invocation => this.handleSendValue(invocation) });
        this.capture = new consoleCapture_1.ConsoleCapture();
    }
    handleSendValue(invocation) {
        const sendValue = invocation.commandEnvelope.command;
        if (sendValue.formattedValue) {
            switch (sendValue.formattedValue.mimeType) {
                case 'application/json':
                    globalThis[sendValue.name] = connection.Deserialize(sendValue.formattedValue.value);
                    break;
                default:
                    globalThis[sendValue.name] = sendValue.formattedValue.value;
                    break;
            }
            return Promise.resolve();
        }
        throw new Error("formattedValue is required");
    }
    async handleSubmitCode(invocation) {
        const submitCode = invocation.commandEnvelope.command;
        const code = submitCode.code;
        super.kernelInfo.localName;
        super.kernelInfo.uri;
        super.kernelInfo.remoteUri;
        const codeSubmissionReceivedEvent = new commandsAndEvents.KernelEventEnvelope(commandsAndEvents.CodeSubmissionReceivedType, { code }, invocation.commandEnvelope);
        invocation.context.publish(codeSubmissionReceivedEvent);
        invocation.context.commandEnvelope.routingSlip;
        this.capture.kernelInvocationContext = invocation.context;
        let result = undefined;
        try {
            const AsyncFunction = eval2(`Object.getPrototypeOf(async function(){}).constructor`);
            const evaluator = AsyncFunction("console", "polyglotNotebooks", code);
            result = await evaluator(this.capture, polyglotNotebooksApi);
            if (result !== undefined) {
                const formattedValue = formatValue(result, 'application/json');
                const event = {
                    formattedValues: [formattedValue]
                };
                const returnValueProducedEvent = new commandsAndEvents.KernelEventEnvelope(commandsAndEvents.ReturnValueProducedType, event, invocation.commandEnvelope);
                invocation.context.publish(returnValueProducedEvent);
            }
        }
        catch (e) {
            const errorProduced = new commandsAndEvents.KernelEventEnvelope(commandsAndEvents.ErrorProducedType, {
                message: `${e.message}

                    ${e.stack}`
            }, invocation.commandEnvelope);
            invocation.context.publish(errorProduced);
        }
        finally {
            this.capture.kernelInvocationContext = undefined;
        }
    }
    handleRequestValueInfos(invocation) {
        const valueInfos = [];
        this.allLocalVariableNames().filter(v => !this.suppressedLocals.has(v)).forEach(v => {
            const variableValue = this.getLocalVariable(v);
            try {
                const valueInfo = {
                    name: v,
                    typeName: getType(variableValue),
                    formattedValue: formatValue(variableValue, "text/plain"),
                    preferredMimeTypes: []
                };
                valueInfos.push(valueInfo);
            }
            catch (e) {
                logger_1.Logger.default.error(`error formatting value ${v} : ${e}`);
            }
        });
        const event = {
            valueInfos
        };
        const valueInfosProducedEvent = new commandsAndEvents.KernelEventEnvelope(commandsAndEvents.ValueInfosProducedType, event, invocation.commandEnvelope);
        invocation.context.publish(valueInfosProducedEvent);
        return Promise.resolve();
    }
    handleRequestValue(invocation) {
        const requestValue = invocation.commandEnvelope.command;
        const rawValue = this.getLocalVariable(requestValue.name);
        const formattedValue = formatValue(rawValue, requestValue.mimeType || 'application/json');
        logger_1.Logger.default.info(`returning ${JSON.stringify(formattedValue)} for ${requestValue.name}`);
        const event = {
            name: requestValue.name,
            formattedValue
        };
        const valueProducedEvent = new commandsAndEvents.KernelEventEnvelope(commandsAndEvents.ValueProducedType, event, invocation.commandEnvelope);
        invocation.context.publish(valueProducedEvent);
        return Promise.resolve();
    }
    allLocalVariableNames() {
        const result = [];
        try {
            for (const key in globalThis) {
                try {
                    if (typeof globalThis[key] !== 'function') {
                        result.push(key);
                    }
                }
                catch (e) {
                    logger_1.Logger.default.error(`error getting value for ${key} : ${e}`);
                }
            }
        }
        catch (e) {
            logger_1.Logger.default.error(`error scanning globla variables : ${e}`);
        }
        return result;
    }
    getLocalVariable(name) {
        return globalThis[name];
    }
}
exports.JavascriptKernel = JavascriptKernel;
function formatValue(arg, mimeType) {
    let value;
    switch (mimeType) {
        case 'text/plain':
            value = (arg === null || arg === void 0 ? void 0 : arg.toString()) || 'undefined';
            if (Array.isArray(arg)) {
                value = `[${value}]`;
            }
            break;
        case 'application/json':
            value = connection.Serialize(arg);
            break;
        default:
            throw new Error(`unsupported mime type: ${mimeType}`);
    }
    return {
        mimeType,
        value,
        suppressDisplay: false
    };
}
function getType(arg) {
    let type = arg ? typeof (arg) : ""; //?
    if (Array.isArray(arg)) {
        type = `${typeof (arg[0])}[]`; //?
    }
    if (arg === Infinity || arg === -Infinity || (arg !== arg)) {
        type = "number";
    }
    return type; //?
}
//# sourceMappingURL=javascriptKernel.js.map