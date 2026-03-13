import * as rpc from 'vscode-jsonrpc';
import type { InitializedInfo, Theme, CatalogModel, IUsage, IPutDeployment, Agent, PlaygroundMessage, StreamingMessage, AttachedFile, FileToolType, AttachedOpenAPISchema, CustomKey, IModel, BingItem, VectorStore, BingConnection, FlattenedSpan, SpanEvent, WorkflowInfo, AgentDeploymentApiType, AgentContainerDetails, AgentOperationId, AgentOperationStatus, IGroundingWithBingConnectionDetail, VectorStoreDetails, FileInfo, VectorStoreFile, ThreadMessage, ThreadRun, RunStep, AgentV2, AgentVersion, ConversationListItem, ItemResourceUnion, V2Responses, ConversationDetail, AgentLogStreamKind, IModelDeploymentInputs, IModelDeploymentWebviewState } from './types';
import type { Tool } from './schema';
/**
 * Command name used to route JSON-RPC messages between host and webview
 */
export declare const jsonRpcCommand = "json-rpc-message";
export declare const getInitialized: rpc.RequestType0<InitializedInfo, void>;
export declare const onThemeChanged: rpc.NotificationType<Theme>;
export declare const onError: rpc.NotificationType<{
    command: string;
    errorMessage: string;
}>;
export declare const getModelList: rpc.RequestType0<CatalogModel[], void>;
export declare const deployModel: rpc.NotificationType<string>;
export declare const openModelInPortal: rpc.NotificationType<string>;
export declare const openExternalUrl: rpc.NotificationType<string>;
export declare const deployAgent: rpc.RequestType0<string | undefined, void>;
export declare const openCodeFile: rpc.NotificationType0;
export declare const openModelCatalog: rpc.NotificationType0;
export declare const openPlayground: rpc.NotificationType<import("./schema/AgentSchema1D0D0").AgentSchema1D0D0>;
export declare const switchToEditMode: rpc.RequestType<import("./schema/AgentSchema1D0D0").AgentSchema1D0D0, string | undefined, void>;
export declare const addTool: rpc.RequestType0<Tool | undefined, void>;
export declare const syncToFile: rpc.NotificationType<import("./schema/AgentSchema1D0D0").AgentSchema1D0D0>;
export declare const syncToDesigner: rpc.NotificationType<import("./schema/AgentSchema1D0D0").AgentSchema1D0D0>;
export declare const yamlError: rpc.NotificationType<string>;
export declare const attachFiles: rpc.RequestType<FileToolType, AttachedFile[] | undefined, void>;
export declare const attachOpenAPISchema: rpc.RequestType0<AttachedOpenAPISchema | undefined, void>;
export declare const uploadCodeInterpreterFiles: rpc.RequestType<AttachedFile[], AttachedFile[] | undefined, void>;
export declare const uploadVectorStoreFiles: rpc.RequestType2<AttachedFile[], string, AttachedFile[] | undefined, void>;
export declare const cancelContainerWorkflow: rpc.RequestType<string, void | undefined, void>;
export declare const syncToWorkflowVisualizer: rpc.NotificationType<string>;
export declare const listVectorStores: rpc.RequestType0<VectorStore[] | undefined, void>;
export declare const createVectorStore: rpc.RequestType<string, VectorStore | undefined, void>;
export declare const getModels: rpc.RequestType0<IModel[], void>;
export declare const getCustomKeys: rpc.RequestType0<CustomKey[] | undefined, void>;
export declare const notifyModelsChanged: rpc.NotificationType<void>;
export declare const notifyVectorStoreCreated: rpc.NotificationType<VectorStore>;
export declare const listBingConnections: rpc.RequestType0<BingConnection[] | undefined, void>;
export declare const listGroundingWithBingResources: rpc.RequestType0<BingItem[] | undefined, void>;
export declare const createBingConnectionsWithAutoKey: rpc.RequestType<BingItem, BingConnection, void>;
export declare const createBingConnectionsWithManualKey: rpc.RequestType<{
    apiKey: string;
    connectionName: string;
    isSharedToAll: boolean;
}, BingConnection, void>;
export declare const createBingConnectionsWithAAD: rpc.RequestType<BingItem, BingConnection, void>;
export declare const createBingConnectionWithNewBingResource: rpc.RequestType<string, BingConnection, void>;
export declare const getModelViewData: rpc.RequestType0<{
    usage: IUsage | undefined;
    raiPolicies: string[];
    availableVersions: string[];
}, void>;
export declare const updateModel: rpc.RequestType<{
    deployment: IPutDeployment;
}, boolean, void>;
export declare const viewJson: rpc.NotificationType0;
export declare const submitModelDeployment: rpc.RequestType<IModelDeploymentInputs, void, void>;
export declare const switchAiService: rpc.RequestType<string, IModelDeploymentWebviewState, void>;
export declare const cancelModelDeployment: rpc.NotificationType0;
export declare const retrieveThreadMessagesAndRuns: rpc.RequestType0<{
    messages: ThreadMessage[];
    runs: ThreadRun[];
} | undefined, void>;
export declare const retrieveThreadAgents: rpc.RequestType0<Agent[] | undefined, void>;
export declare const openJsonFileForRun: rpc.NotificationType<ThreadRun>;
export declare const addStepDetails: rpc.RequestType<{
    runId: string;
}, RunStep[] | undefined, void>;
export declare const openJsonFileForStepDetails: rpc.NotificationType<RunStep[]>;
export declare const downloadFile: rpc.RequestType<{
    fileId: string;
    run: ThreadRun;
}, string | undefined, void>;
export declare const createThread: rpc.RequestType0<string | undefined, void>;
export declare const getAvailableAgents: rpc.RequestType0<Agent[] | undefined, void>;
export declare const availableAgentsChanged: rpc.NotificationType<Agent[]>;
export declare const agentChanged: rpc.NotificationType<Agent>;
export declare const sendMessage: rpc.RequestType<PlaygroundMessage, void, void>;
export declare const receiveStreamingMessage: rpc.NotificationType<StreamingMessage>;
export declare const agentEvent: rpc.NotificationType<{
    eventType: string;
    data: any;
}>;
export declare const attachFile: rpc.RequestType0<AttachedFile | undefined, void>;
export declare const uploadFile: rpc.RequestType<AttachedFile, AttachedFile | undefined, void>;
export declare const removeFile: rpc.RequestType<string, boolean | undefined, void>;
export declare const getContainerWorkflows: rpc.RequestType0<AgentV2[] | undefined, void>;
export declare const getContainerWorkflowVersions: rpc.RequestType1<string, AgentVersion[] | undefined, void>;
export declare const getPromptAgents: rpc.RequestType0<string[] | undefined, void>;
export declare const getPromptAgentVersions: rpc.RequestType1<string, string[] | undefined, void>;
export declare const promptAgentVersionChanged: rpc.RequestType1<string, AgentVersion, void>;
export declare const promptAgentChanged: rpc.NotificationType<string>;
export declare const getYamlWorkflows: rpc.RequestType0<string[] | undefined, void>;
export declare const getYamlWorkflowVersions: rpc.RequestType1<string, string[] | undefined, void>;
export declare const yamlWorkflowVersionChanged: rpc.RequestType1<string, AgentVersion, void>;
export declare const yamlWorkflowChanged: rpc.NotificationType<string>;
export declare const containerWorkflowChanged: rpc.NotificationType<AgentV2>;
export declare const workflowsUpdated: rpc.NotificationType<AgentV2[]>;
export declare const workflowVersionsUpdated: rpc.NotificationType<AgentVersion[]>;
export declare const promptAgentsUpdated: rpc.NotificationType<AgentV2[]>;
export declare const promptAgentVersionsUpdated: rpc.NotificationType<AgentVersion[]>;
export declare const containerWorkflowVersionChanged: rpc.NotificationType<AgentVersion>;
export declare const deployHostedAgent: rpc.RequestType0<void, void>;
export declare const openAgentInspector: rpc.RequestType0<void, void>;
export declare const submitToolApproval: rpc.RequestType<{
    threadId: string;
    runId: string;
    toolCallId: string;
    serverLabel: string;
    approved: boolean;
}, void, void>;
export declare const getRunMessage: rpc.RequestType<{
    threadId: string;
    runId: string;
}, StreamingMessage[] | undefined, void>;
export declare const getBingConnectionDetails: rpc.RequestType0<IGroundingWithBingConnectionDetail | undefined, void>;
export declare const getVectorStoreDetails: rpc.RequestType0<VectorStoreDetails, void>;
export declare const listVectorStoreFiles: rpc.RequestType<string, VectorStoreFile[] | undefined, void>;
export declare const listFiles: rpc.RequestType0<FileInfo[] | undefined, void>;
export declare const closeWebview: rpc.NotificationType0;
export declare const transformTools: rpc.RequestType1<any[], Tool[], void>;
export declare const openAsJson: rpc.NotificationType<{
    data: any;
    fileName: string;
}>;
export declare const animateWorkflowEdge: rpc.NotificationType<{
    source: string;
    target: string;
    animated: boolean;
}>;
export declare const clearWorkflow: rpc.NotificationType0;
export declare const clearWorkflowRequest: rpc.RequestType0<void, void>;
export declare const updateWorkflowModel: rpc.NotificationType<FlattenedSpan>;
export declare const highlightNode: rpc.NotificationType<{
    executorId: string;
}>;
export declare const clearHighlights: rpc.NotificationType0;
export declare const requestWorkflowModel: rpc.RequestType0<FlattenedSpan | undefined, void>;
export declare const listMcpTools: rpc.RequestType<string, string[] | undefined, void>;
export declare const runCode: rpc.NotificationType0;
export declare const getAgentContainerDetails: rpc.RequestType<{
    agentName: string;
    agentVersion: string;
}, AgentContainerDetails | undefined, void>;
export declare const startAgentContainer: rpc.RequestType<{
    agentName: string;
    agentVersion: string;
}, AgentOperationId, void>;
export declare const stopAgentContainer: rpc.RequestType<{
    agentName: string;
    agentVersion: string;
    deploymentApiType: AgentDeploymentApiType;
}, AgentOperationId, void>;
export declare const getAgentOperationStatus: rpc.RequestType<AgentOperationId, AgentOperationStatus, void>;
export declare const pullNextSpan: rpc.RequestType<string, SpanEvent | null, void>;
export declare const spanProcessed: rpc.NotificationType0;
export declare const hasSpansAvailable: rpc.RequestType<string, boolean, void>;
export declare const getAvailableWorkflowInfos: rpc.RequestType0<WorkflowInfo[], void>;
export declare const selectWorkflow: rpc.NotificationType<string>;
export declare const onWorkflowsUpdated: rpc.NotificationType<WorkflowInfo[]>;
export declare const getSelectedWorkflowModel: rpc.RequestType<string, FlattenedSpan | undefined, void>;
export declare const openYamlWorkflowFile: rpc.NotificationType<{
    workflowString: string;
    workflowName: string;
}>;
export declare const createConversation: rpc.RequestType0<string, void>;
export declare const generateCodeFromWorkflow: rpc.NotificationType<{
    workflowString: string;
    workflowName: string;
}>;
export declare const askCopilotForVisualizationSetup: rpc.RequestType0<void, void>;
export declare const resolveErrorsWithCopilot: rpc.RequestType<{
    errorLogs: string[];
}, void, void>;
export declare const openPromptAgentFile: rpc.NotificationType<{
    agentString: string;
    agentName: string;
}>;
export declare const openJsonFileForResponse: rpc.NotificationType<V2Responses>;
export declare const openJsonFileForStepDetail: rpc.NotificationType<ItemResourceUnion>;
export declare const listAgentConversations: rpc.RequestType<{
    agentName: string;
    agentVersion?: string;
}, ConversationListItem[], void>;
export declare const getConversationHistory: rpc.RequestType<{
    conversationId: string;
}, ConversationDetail, void>;
export declare const openConversationHistory: rpc.NotificationType<{
    conversationId: string;
}>;
export interface StreamingLogLine {
    id: string;
    content: string;
    timestamp: number;
}
export interface StreamingLogEvent {
    type: 'data' | 'connected' | 'disconnected' | 'error';
    kind?: AgentLogStreamKind;
    line?: StreamingLogLine;
    error?: string;
}
export declare const startStreamingLogs: rpc.RequestType<{
    agentName: string;
    agentVersion: string;
    kind: AgentLogStreamKind;
    tail?: number;
}, boolean, void>;
export declare const stopStreamingLogs: rpc.RequestType<{
    kind?: AgentLogStreamKind;
}, boolean, void>;
export declare const streamingLogData: rpc.NotificationType<StreamingLogEvent>;
export declare const saveLogsToFile: rpc.RequestType<{
    content: string;
    defaultFileName: string;
}, boolean, void>;
//# sourceMappingURL=contracts.d.ts.map