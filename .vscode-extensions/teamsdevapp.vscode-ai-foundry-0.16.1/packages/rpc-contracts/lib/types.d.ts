import { RunStepDeltaDetailUnion } from './models';
import { ItemResourceUnion } from './modelsV2';
export { MessageContentUnion, MessageImageFileContentWithContent, MessageTextContent, MessageTextFileCitationAnnotation, MessageTextUrlCitationAnnotation, RunStepDeltaToolCallObject as RunStepToolCallDetails, RunStepFileSearchToolCallResult } from './models';
export { AgentV2, AgentVersion, ItemResourceUnion, HostedAgentDefinition, PromptAgentDefinition, WorkflowDefinition } from './modelsV2';
export type Theme = 'dark' | 'light';
export type AgentLogStreamKind = 'console' | 'system';
export interface InitializedInfo {
    state: string;
    theme: Theme;
    payload: any;
}
export interface CatalogModel {
    name: string;
    publisher: string;
    versions: string[];
    inferenceTasks: string[];
    registryName: string;
    popularity: number;
}
export interface IModel {
    name: string;
    id: string;
}
export interface IUsage {
    name: string;
    limit: number;
    currentValue: number;
}
export interface IPutDeployment {
    properties: {
        model: {
            format: string;
            name: string;
            version: string;
        };
        raiPolicyName: string;
        versionUpgradeOption: string;
    };
    sku: {
        capacity: number;
        name: string;
    };
}
export interface ModelSku {
    name: string;
    capacity?: {
        default?: number;
    };
}
export interface IModelDeploymentWebviewState {
    projectName: string;
    projectLocation: string;
    aiServiceNames: string[];
    models: IModelDeploymentModel[];
    selectedAiService: string;
    raiPolicyNames: string[];
    selectedModelName?: string;
    inputDeploymentName: string;
    selectedModel: IModelDeploymentModel;
    selectedSku: ModelSku;
    selectedVersionUpgradeOption: string;
    selectedRaiPolicyName: string;
    usages: IUsage[];
    modelNames?: string[];
    modelVersions?: string[];
    deploymentTypes?: {
        key: string;
        label: string;
    }[];
}
export interface IModelDeploymentModel {
    name: string;
    format?: string;
    version: string;
    skus: ModelSku[];
}
export interface IModelDeploymentInputs {
    inputDeploymentName: string;
    selectedModel: IModelDeploymentModel;
    selectedSku: ModelSku;
    selectedVersionUpgradeOption?: string;
    selectedRaiPolicyName?: string;
}
export interface AgentThread {
    id: string;
    createdAt: number;
}
export { ThreadMessage } from './models';
export interface ThreadRun {
    id: string;
    threadId: string;
    createdAt: number;
    completedAt: number | null;
    cancelledAt: number | null;
    failedAt: number | null;
    tools: {
        type: string;
    }[];
    usage: {
        completionTokens: number;
        promptTokens: number;
        totalTokens: number;
    } | null;
    status: string;
}
export interface RunStepCompletionUsage {
    completionTokens: number;
    promptTokens: number;
    totalTokens: number;
    promptTokenDetails?: PromptTokenDetails;
}
export interface PromptTokenDetails {
    cachedTokens: number;
}
export interface RunStep {
    id: string;
    createdAt: number;
    type: string;
    stepDetails: RunStepDeltaDetailUnion;
    usage?: RunStepCompletionUsage | null;
}
export interface RunStepToolCallConcrete {
    id: string;
    type: string;
    [key: string]: any;
}
export declare enum FileToolType {
    FileSearch = "file_search",
    CodeInterpreter = "code_interpreter",
    OpenAPI = "openapi"
}
export interface AttachedFile {
    id?: string;
    toolType: 'file_search' | 'code_interpreter';
    name: string;
    path: string;
    isUploading?: boolean;
    isRemoving?: boolean;
}
export interface AttachedOpenAPISchema {
    content: string;
    path: string;
}
export interface CustomKey {
    id: string;
    name: string;
}
export interface TextMessageData {
    message: string;
    annotations: any[];
    item_id?: string;
    agentName?: string;
}
export interface ImageFileData {
    contentBase64: string;
}
export interface ImageUrlData {
    imageUrl: string;
}
export interface ToolCallData {
    toolCall: any;
}
export interface ActionData {
    runId: string;
    callId: string;
    toolType: string;
    toolName?: string;
    args?: string;
    serverLabel?: string;
}
export interface RunCreatedData {
    runId: string;
}
export interface WorkflowData {
    status: 'created' | 'in_progress' | 'completed' | 'failed';
    name?: string;
    rawData?: any;
    id?: string;
}
export type StreamingMessage = {
    type: 'text';
    data: TextMessageData;
} | {
    type: 'url_citation';
    data: TextMessageData;
} | {
    type: 'image_file';
    data: ImageFileData;
} | {
    type: 'image_url';
    data: ImageUrlData;
} | {
    type: 'tool_calls';
    data: ToolCallData;
} | {
    type: 'action';
    data: ActionData;
} | {
    type: 'complete';
    data: TextMessageData;
} | {
    type: 'workflow';
    data: WorkflowData;
};
export type StreamingMessageData = TextMessageData | ImageFileData | ImageUrlData | ToolCallData;
export interface MessageAttachment {
    fileId?: string;
    tools: {
        type: string;
    }[];
}
export interface PlaygroundMessage {
    message: string;
    threadId?: string;
    attachments?: MessageAttachment[];
}
export interface Agent {
    id: string;
    object: 'assistant';
    createdAt: number;
    name: string | null;
    description: string | null;
    model: string;
    instructions: string | null;
    tools: any[];
    toolResources: any | null;
    temperature: number | null;
    topP: number | null;
    responseFormat?: any | null;
    metadata: Record<string, string> | null;
}
export interface VectorStore {
    id: string;
    name: string;
}
export interface VectorStoreDetails extends VectorStore {
    status: string;
    usageBytes: number;
    createdAt: number;
}
export interface VectorStoreFile {
    id: string;
    usageBytes: number;
    status: string;
    createdAt: Date;
}
export interface FileInfo {
    id: string;
    filename: string;
}
export interface BingItem {
    id: string;
    name: string;
    resourceGroup: string;
    properties: {
        endpoint?: string;
    };
}
export interface BingConnection {
    id: string;
    name: string;
    target: string;
    location: string;
    createdBy?: string;
}
export interface IGroundingWithBingConnectionDetail extends BingConnection {
    resource?: string;
    service?: string;
    key?: string;
    addedOn?: string;
    modifiedOn?: string;
    addedBy?: string;
    sharedToAll?: boolean;
    authentication?: string;
    accessDetails?: string;
}
/**
 * Command name used to route JSON-RPC messages between host and webview
 */
export type OtlpAttributeValue = {
    string_value?: string;
    bool_value?: boolean;
    int_value?: number;
    double_value?: number;
    array_value?: any[];
    kvlist_value?: {
        [key: string]: any;
    };
    value?: string;
};
export type OtlpAttribute = {
    key: string;
    value: OtlpAttributeValue;
};
export type FlattenedSpan = {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
    startTime: number;
    endTime: number;
    attributes?: OtlpAttribute[];
    executorId?: string;
    executorType?: string;
    messageType?: string;
    workflowId?: string;
    messageDestinationExecutorId?: string;
    workflowDefinition?: {
        id?: string;
        name?: string;
        maxIterations?: number;
        startExecutorId?: string;
        executors?: {
            [key: string]: {
                id: string;
                type: string;
                name?: string;
                description?: string;
            };
        };
        edgeGroups?: {
            id: string;
            type: string;
            edges: {
                sourceId: string;
                targetId: string;
                conditionName?: string;
            }[];
        }[];
    };
    messageSourceId?: string;
    messageTargetId?: string;
    edgeGroupId?: string;
    edgeGroupType?: string;
    edgeGroupDelivered?: boolean;
    edgeGroupDeliverStatus?: string;
};
/**
 * Represents different types of span events that can be queued
 */
export interface SpanEvent {
    type: 'workflow.build' | 'executor.process' | 'workflow.run' | 'edge_group.process';
    data: FlattenedSpan;
    timestamp: number;
    workflowId?: string;
}
/**
 * Workflow info for frontend dropdown selector
 */
export interface WorkflowInfo {
    id: string;
    name?: string;
}
/**
 * Response status type - matches V2Responses.status from Azure AI Foundry API
 */
export type ResponseStatus = 'completed' | 'failed' | 'in_progress' | 'cancelled' | 'queued' | 'incomplete';
export interface ConversationListItem {
    /** Conversation ID */
    conversationId: string;
    /** Status of the most recent response */
    status?: ResponseStatus;
    /** Total input tokens across all responses in this conversation */
    tokensIn?: number;
    /** Total output tokens across all responses in this conversation */
    tokensOut?: number;
    /** Start time of the first response in this conversation */
    startTime?: Date;
}
/**
 * Defines which API type is used for agent deployments
 */
export type AgentDeploymentApiType = 'control-plane' | 'data-plane';
/**
 * Details about a container's deployment and status
 */
export interface AgentContainerDetails {
    object?: 'agent.container';
    agentName: string;
    agentVersion: string;
    status: AgentOperationStatus;
    minReplicas?: number;
    maxReplicas?: number;
    endpointUrl?: string;
    errorMessage?: string;
    createdAt?: Date;
    updatedAt?: Date;
    /** Tracks which API this container was retrieved from, used for subsequent operations */
    deploymentApiType: AgentDeploymentApiType;
}
/**
 * Union of operation status across both control-plane and data-plane APIs
 */
export type AgentOperationStatus = 'Deleted' | 'Deleting' | 'Failed' | 'InProgress' | 'Running' | 'Starting' | 'Stopped' | 'Stopping' | 'Updating';
export interface AgentOperationId {
    apiType: AgentDeploymentApiType;
    id: string;
    agentName: string;
}
export interface V2Responses {
    agent?: {
        name: string;
    } | null;
    id: string;
    status?: string;
    output: ItemResourceUnion[];
    createdAt?: Date;
    createdBy?: {
        responseId?: string;
    } | null;
    usage?: {
        total_tokens: number;
        input_tokens: number;
        output_tokens: number;
    };
}
export interface ConversationDetail {
    conversationId: string;
    conversationItems: ItemResourceUnion[];
    responses: V2Responses[];
}
//# sourceMappingURL=types.d.ts.map