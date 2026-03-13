"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.availableAgentsChanged = exports.getAvailableAgents = exports.createThread = exports.downloadFile = exports.openJsonFileForStepDetails = exports.addStepDetails = exports.openJsonFileForRun = exports.retrieveThreadAgents = exports.retrieveThreadMessagesAndRuns = exports.cancelModelDeployment = exports.switchAiService = exports.submitModelDeployment = exports.viewJson = exports.updateModel = exports.getModelViewData = exports.createBingConnectionWithNewBingResource = exports.createBingConnectionsWithAAD = exports.createBingConnectionsWithManualKey = exports.createBingConnectionsWithAutoKey = exports.listGroundingWithBingResources = exports.listBingConnections = exports.notifyVectorStoreCreated = exports.notifyModelsChanged = exports.getCustomKeys = exports.getModels = exports.createVectorStore = exports.listVectorStores = exports.syncToWorkflowVisualizer = exports.cancelContainerWorkflow = exports.uploadVectorStoreFiles = exports.uploadCodeInterpreterFiles = exports.attachOpenAPISchema = exports.attachFiles = exports.yamlError = exports.syncToDesigner = exports.syncToFile = exports.addTool = exports.switchToEditMode = exports.openPlayground = exports.openModelCatalog = exports.openCodeFile = exports.deployAgent = exports.openExternalUrl = exports.openModelInPortal = exports.deployModel = exports.getModelList = exports.onError = exports.onThemeChanged = exports.getInitialized = exports.jsonRpcCommand = void 0;
exports.hasSpansAvailable = exports.spanProcessed = exports.pullNextSpan = exports.getAgentOperationStatus = exports.stopAgentContainer = exports.startAgentContainer = exports.getAgentContainerDetails = exports.runCode = exports.listMcpTools = exports.requestWorkflowModel = exports.clearHighlights = exports.highlightNode = exports.updateWorkflowModel = exports.clearWorkflowRequest = exports.clearWorkflow = exports.animateWorkflowEdge = exports.openAsJson = exports.transformTools = exports.closeWebview = exports.listFiles = exports.listVectorStoreFiles = exports.getVectorStoreDetails = exports.getBingConnectionDetails = exports.getRunMessage = exports.submitToolApproval = exports.openAgentInspector = exports.deployHostedAgent = exports.containerWorkflowVersionChanged = exports.promptAgentVersionsUpdated = exports.promptAgentsUpdated = exports.workflowVersionsUpdated = exports.workflowsUpdated = exports.containerWorkflowChanged = exports.yamlWorkflowChanged = exports.yamlWorkflowVersionChanged = exports.getYamlWorkflowVersions = exports.getYamlWorkflows = exports.promptAgentChanged = exports.promptAgentVersionChanged = exports.getPromptAgentVersions = exports.getPromptAgents = exports.getContainerWorkflowVersions = exports.getContainerWorkflows = exports.removeFile = exports.uploadFile = exports.attachFile = exports.agentEvent = exports.receiveStreamingMessage = exports.sendMessage = exports.agentChanged = void 0;
exports.saveLogsToFile = exports.streamingLogData = exports.stopStreamingLogs = exports.startStreamingLogs = exports.openConversationHistory = exports.getConversationHistory = exports.listAgentConversations = exports.openJsonFileForStepDetail = exports.openJsonFileForResponse = exports.openPromptAgentFile = exports.resolveErrorsWithCopilot = exports.askCopilotForVisualizationSetup = exports.generateCodeFromWorkflow = exports.createConversation = exports.openYamlWorkflowFile = exports.getSelectedWorkflowModel = exports.onWorkflowsUpdated = exports.selectWorkflow = exports.getAvailableWorkflowInfos = void 0;
const rpc = __importStar(require("vscode-jsonrpc"));
/**
 * Command name used to route JSON-RPC messages between host and webview
 */
exports.jsonRpcCommand = 'json-rpc-message';
// Generic webview RPCs (forwarded from extension webview rpcContracts)
// jsonRpcCommand already declared above; no re-export needed here.
// Initialization / common
exports.getInitialized = new rpc.RequestType0('initialized');
exports.onThemeChanged = new rpc.NotificationType('themeChanged');
exports.onError = new rpc.NotificationType('onError');
// Model catalog
exports.getModelList = new rpc.RequestType0('getModelList');
exports.deployModel = new rpc.NotificationType('deployModel');
exports.openModelInPortal = new rpc.NotificationType('openModelInPortal');
exports.openExternalUrl = new rpc.NotificationType('openExternalUrl');
// agent designer
exports.deployAgent = new rpc.RequestType0('deployAgent');
exports.openCodeFile = new rpc.NotificationType0('openCodeFile');
exports.openModelCatalog = new rpc.NotificationType0('openModelCatalog');
exports.openPlayground = new rpc.NotificationType('openPlayground');
exports.switchToEditMode = new rpc.RequestType('switchToEditMode');
exports.addTool = new rpc.RequestType0('addTool');
exports.syncToFile = new rpc.NotificationType('syncToFile');
exports.syncToDesigner = new rpc.NotificationType('syncToDesigner');
exports.yamlError = new rpc.NotificationType('yamlError');
exports.attachFiles = new rpc.RequestType('attachFiles');
exports.attachOpenAPISchema = new rpc.RequestType0('attachOpenAPISchema');
exports.uploadCodeInterpreterFiles = new rpc.RequestType('uploadCodeInterpreterFiles');
exports.uploadVectorStoreFiles = new rpc.RequestType2('uploadVectorStoreFiles');
exports.cancelContainerWorkflow = new rpc.RequestType('cancelContainerWorkflow');
exports.syncToWorkflowVisualizer = new rpc.NotificationType('syncToWorkflowVisualizer');
exports.listVectorStores = new rpc.RequestType0('listVectorStores');
exports.createVectorStore = new rpc.RequestType('createVectorStore');
exports.getModels = new rpc.RequestType0('getModels');
exports.getCustomKeys = new rpc.RequestType0('getCustomKeys');
exports.notifyModelsChanged = new rpc.NotificationType('notifyModelsChanged');
exports.notifyVectorStoreCreated = new rpc.NotificationType('notifyVectorStoreCreated');
exports.listBingConnections = new rpc.RequestType0('listBingConnections');
exports.listGroundingWithBingResources = new rpc.RequestType0('listGroundingWithBingResources');
exports.createBingConnectionsWithAutoKey = new rpc.RequestType('createBingConnectionsWithAutoKey');
exports.createBingConnectionsWithManualKey = new rpc.RequestType('createBingConnectionsWithManualKey');
exports.createBingConnectionsWithAAD = new rpc.RequestType('createBingConnectionsWithAAD');
exports.createBingConnectionWithNewBingResource = new rpc.RequestType('createBingConnectionWithNewBingResource');
// Model webview
exports.getModelViewData = new rpc.RequestType0('getModelViewData');
exports.updateModel = new rpc.RequestType('updateModel');
exports.viewJson = new rpc.NotificationType0('viewJson');
// Model deployment webview
exports.submitModelDeployment = new rpc.RequestType('submitModelDeployment');
exports.switchAiService = new rpc.RequestType('switchAiService');
exports.cancelModelDeployment = new rpc.NotificationType0('cancelModelDeployment');
// threads webview
exports.retrieveThreadMessagesAndRuns = new rpc.RequestType0('retrieveThreadMessagesAndRuns');
exports.retrieveThreadAgents = new rpc.RequestType0('retrieveThreadAgents');
exports.openJsonFileForRun = new rpc.NotificationType('openJsonFileForRun');
exports.addStepDetails = new rpc.RequestType('addStepDetails');
exports.openJsonFileForStepDetails = new rpc.NotificationType('openJsonFileForStepDetails');
exports.downloadFile = new rpc.RequestType('downloadFile');
// playground webview
exports.createThread = new rpc.RequestType0('createThread');
exports.getAvailableAgents = new rpc.RequestType0('getAvailableAgents');
exports.availableAgentsChanged = new rpc.NotificationType('availableAgentsChanged');
exports.agentChanged = new rpc.NotificationType('agentChanged');
exports.sendMessage = new rpc.RequestType('sendMessage');
exports.receiveStreamingMessage = new rpc.NotificationType('receiveStreamingMessage');
exports.agentEvent = new rpc.NotificationType('agentEvent');
exports.attachFile = new rpc.RequestType0('attachFile');
exports.uploadFile = new rpc.RequestType('uploadFile');
exports.removeFile = new rpc.RequestType('removeFile');
exports.getContainerWorkflows = new rpc.RequestType0('getContainerWorkflows');
exports.getContainerWorkflowVersions = new rpc.RequestType1('getContainerWorkflowVersions');
exports.getPromptAgents = new rpc.RequestType0('getPromptAgents');
exports.getPromptAgentVersions = new rpc.RequestType1('getPromptAgentVersions');
exports.promptAgentVersionChanged = new rpc.RequestType1('promptAgentVersionChanged');
exports.promptAgentChanged = new rpc.NotificationType('promptAgentChanged');
exports.getYamlWorkflows = new rpc.RequestType0('getYamlWorkflows');
exports.getYamlWorkflowVersions = new rpc.RequestType1('getYamlWorkflowVersions');
exports.yamlWorkflowVersionChanged = new rpc.RequestType1('yamlWorkflowVersionChanged');
exports.yamlWorkflowChanged = new rpc.NotificationType('yamlWorkflowChanged');
exports.containerWorkflowChanged = new rpc.NotificationType('containerWorkflowChanged');
exports.workflowsUpdated = new rpc.NotificationType('workflowsUpdated');
exports.workflowVersionsUpdated = new rpc.NotificationType('workflowVersionsUpdated');
exports.promptAgentsUpdated = new rpc.NotificationType('promptAgentsUpdated');
exports.promptAgentVersionsUpdated = new rpc.NotificationType('promptAgentVersionsUpdated');
exports.containerWorkflowVersionChanged = new rpc.NotificationType('containerWorkflowVersionChanged');
// Deploy hosted agent from container playground webview
exports.deployHostedAgent = new rpc.RequestType0('deployHostedAgent');
// Open Agent Inspector from local playground
exports.openAgentInspector = new rpc.RequestType0('openAgentInspector');
// Tool approval
exports.submitToolApproval = new rpc.RequestType('submitToolApproval');
exports.getRunMessage = new rpc.RequestType('getRunMessage');
// Asset webview
exports.getBingConnectionDetails = new rpc.RequestType0('getBingConnectionDetails');
exports.getVectorStoreDetails = new rpc.RequestType0('getVectorStoreDetails');
exports.listVectorStoreFiles = new rpc.RequestType('listVectorStoreFiles');
exports.listFiles = new rpc.RequestType0('listFiles');
// Common webview commands
exports.closeWebview = new rpc.NotificationType0('closeWebview');
exports.transformTools = new rpc.RequestType1('transformTools');
exports.openAsJson = new rpc.NotificationType('openAsJson');
// workflow visualization
exports.animateWorkflowEdge = new rpc.NotificationType('animateWorkflowEdge');
exports.clearWorkflow = new rpc.NotificationType0('clearWorkflow');
exports.clearWorkflowRequest = new rpc.RequestType0('clearWorkflowRequest');
exports.updateWorkflowModel = new rpc.NotificationType('updateWorkflowModel');
exports.highlightNode = new rpc.NotificationType('highlightNode');
exports.clearHighlights = new rpc.NotificationType0('clearHighlights');
exports.requestWorkflowModel = new rpc.RequestType0('requestWorkflowModel');
// MCP tooling
exports.listMcpTools = new rpc.RequestType('listMcpTools');
// Code execution
exports.runCode = new rpc.NotificationType0('runCode');
// Code Workflow Container
exports.getAgentContainerDetails = new rpc.RequestType('getAgentContainerDetails');
exports.startAgentContainer = new rpc.RequestType('startAgentContainer');
exports.stopAgentContainer = new rpc.RequestType('stopAgentContainer');
exports.getAgentOperationStatus = new rpc.RequestType('getAgentOperationStatus');
// Span management - Pull mode
exports.pullNextSpan = new rpc.RequestType('pullNextSpan');
exports.spanProcessed = new rpc.NotificationType0('spanProcessed');
exports.hasSpansAvailable = new rpc.RequestType('hasSpansAvailable');
// Workflow selection for multi-workflow support
exports.getAvailableWorkflowInfos = new rpc.RequestType0('getAvailableWorkflowInfos');
exports.selectWorkflow = new rpc.NotificationType('selectWorkflow');
exports.onWorkflowsUpdated = new rpc.NotificationType('onWorkflowsUpdated');
exports.getSelectedWorkflowModel = new rpc.RequestType('getSelectedWorkflowModel');
//YAML Workflow Playground
exports.openYamlWorkflowFile = new rpc.NotificationType('openYamlWorkflowFile');
exports.createConversation = new rpc.RequestType0('createConversation');
exports.generateCodeFromWorkflow = new rpc.NotificationType('generateCodeFromWorkflow');
exports.askCopilotForVisualizationSetup = new rpc.RequestType0('askCopilotForVisualizationSetup');
exports.resolveErrorsWithCopilot = new rpc.RequestType('resolveErrorsWithCopilot');
//Prompt Agent Playground
exports.openPromptAgentFile = new rpc.NotificationType('openPromptAgentFile');
// conversation list
exports.openJsonFileForResponse = new rpc.NotificationType('openJsonFileForResponse');
exports.openJsonFileForStepDetail = new rpc.NotificationType('openJsonFileForStepDetail');
exports.listAgentConversations = new rpc.RequestType('listAgentConversations');
exports.getConversationHistory = new rpc.RequestType('getConversationHistory');
exports.openConversationHistory = new rpc.NotificationType('openConversationHistory');
exports.startStreamingLogs = new rpc.RequestType('startStreamingLogs');
exports.stopStreamingLogs = new rpc.RequestType('stopStreamingLogs');
exports.streamingLogData = new rpc.NotificationType('streamingLogData');
exports.saveLogsToFile = new rpc.RequestType('saveLogsToFile');
//# sourceMappingURL=contracts.js.map