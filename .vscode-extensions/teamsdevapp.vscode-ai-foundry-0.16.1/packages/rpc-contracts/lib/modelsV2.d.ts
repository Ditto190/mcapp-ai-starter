export interface AgentV2 {
    object: 'agent';
    id: string;
    name: string;
    description?: string;
    metadata?: Record<string, string>;
    labels?: AgentLabel[];
}
export interface AgentLabel {
    object: 'agent.label';
    id?: string;
    label: string;
    name: string;
    version: string;
    createdAt: Date;
    agentVersion?: string;
}
export interface AgentVersion {
    object: 'agent.version';
    id: string;
    name: string;
    version: string;
    createdAt: Date;
    description?: string;
    metadata?: Record<string, string>;
    labels?: string[];
    definition?: AgentDefinitionUnion;
}
export interface AgentDefinition {
    kind: AgentKind;
}
export type AgentDefinitionUnion = WorkflowDefinition | CustomAgentDefinition | PromptAgentDefinition | HostedAgentDefinition | AgentDefinition;
export type AgentKind = 'prompt' | 'custom_agent' | 'workflow' | 'Workflow' | 'hosted';
export interface WorkflowDefinition extends AgentDefinition {
    kind: 'Workflow' | 'workflow';
    id?: string;
    name?: string;
    description?: string;
    workflow: string;
}
export interface CustomAgentDefinition extends AgentDefinition {
    kind: 'custom_agent';
}
export interface PromptAgentDefinition extends AgentDefinition {
    kind: 'prompt';
    model?: ModelIdsResponses;
    instructions?: string | null;
    temperature?: number | null;
    topP?: number | null;
    reasoning?: Reasoning | null;
    tools?: ToolUnion[];
    text?: {
        format?: ResponseTextFormatConfigurationUnion;
    };
    structuredInputs?: Record<string, StructuredInputDefinition>;
}
export interface HostedAgentDefinition extends AgentDefinition {
    kind: 'hosted';
    containerProtocolVersions: {
        protocol: string;
        version: string;
    }[];
    cpu: string;
    memory: string;
    image: string;
    environmentVariables?: Record<string, string>;
}
export interface ResponseTextFormatConfiguration {
    type: ResponseTextFormatConfigurationType;
}
export type ResponseTextFormatConfigurationUnion = ResponseTextFormatConfigurationText | ResponseTextFormatConfigurationJsonObject | ResponseTextFormatConfigurationJsonSchema | ResponseTextFormatConfiguration;
export type ResponseTextFormatConfigurationType = 'text' | 'json_schema' | 'json_object';
export interface ResponseTextFormatConfigurationText extends ResponseTextFormatConfiguration {
    type: 'text';
}
export interface ResponseTextFormatConfigurationJsonObject extends ResponseTextFormatConfiguration {
    type: 'json_object';
}
export interface ResponseTextFormatConfigurationJsonSchema extends ResponseTextFormatConfiguration {
    type: 'json_schema';
    description?: string;
    name: string;
    schema: ResponseFormatJsonSchemaSchema;
    strict?: boolean | null;
}
export interface ResponseFormatJsonSchemaSchema {
    additionalProperties?: Record<string, any>;
}
export interface _PromptAgentDefinitionText {
    format?: ResponseTextFormatConfigurationUnion;
}
export interface Tool {
    type: ToolType;
}
export type ToolUnion = FunctionTool | FileSearchTool | ComputerUsePreviewTool | WebSearchPreviewTool | CodeInterpreterTool | ImageGenTool | LocalShellTool | MCPTool | CaptureStructuredOutputsTool | CaptureSemanticEventsTool | Tool;
export type ToolType = 'file_search' | 'function' | 'computer_use_preview' | 'web_search_preview' | 'mcp' | 'code_interpreter' | 'image_generation' | 'local_shell' | 'capture_structured_outputs' | 'capture_semantic_events';
export interface FunctionTool extends Tool {
    type: 'function';
    name: string;
    description?: string | null;
    parameters: any | null;
    strict: boolean | null;
}
export interface FileSearchTool extends Tool {
    type: 'file_search';
    vectorStoreIds: string[];
    maxNumResults?: number;
    rankingOptions?: RankingOptions;
    filters?: Filters | null;
}
export interface RankingOptions {
    ranker?: 'auto' | 'default-2024-11-15';
    scoreThreshold?: number;
}
export type Filters = ComparisonFilter | CompoundFilter;
export interface ComparisonFilter {
    type: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte';
    key: string;
    value: string | number | boolean;
}
export type _ComparisonFilterValue = string | number | boolean;
export interface CompoundFilter {
    type: 'and' | 'or';
    filters: (ComparisonFilter | CompoundFilter)[];
}
export type _CompoundFilterFilter = ComparisonFilter | CompoundFilter;
export interface ComputerUsePreviewTool extends Tool {
    type: 'computer_use_preview';
    environment: 'windows' | 'mac' | 'linux' | 'ubuntu' | 'browser';
    displayWidth: number;
    displayHeight: number;
}
export interface WebSearchPreviewTool extends Tool {
    type: 'web_search_preview';
    userLocation?: LocationUnion | null;
    searchContextSize?: 'low' | 'medium' | 'high';
}
export interface Location {
    type: LocationType;
}
export type LocationUnion = ApproximateLocation | Location;
export type LocationType = 'approximate';
export interface ApproximateLocation extends Location {
    type: 'approximate';
    country?: string | null;
    region?: string | null;
    city?: string | null;
    timezone?: string | null;
}
export interface CodeInterpreterTool extends Tool {
    type: 'code_interpreter';
    container: string | CodeInterpreterToolAuto;
}
export type _CodeInterpreterToolContainer = string | CodeInterpreterToolAuto;
export interface CodeInterpreterToolAuto {
    type: 'auto';
    file_ids?: string[];
}
export interface ImageGenTool extends Tool {
    type: 'image_generation';
    model?: 'gpt-image-1';
    quality?: 'low' | 'medium' | 'high' | 'auto';
    size?: '1024x1024' | '1024x1536' | '1536x1024' | 'auto';
    output_format?: 'png' | 'webp' | 'jpeg';
    output_compression?: number;
    moderation?: 'auto' | 'low';
    background?: 'transparent' | 'opaque' | 'auto';
    input_image_mask?: {
        image_url?: string;
        file_id?: string;
    };
    partial_images?: number;
}
export interface _ImageGenToolInputImageMask {
    image_url?: string;
    file_id?: string;
}
export interface LocalShellTool extends Tool {
    type: 'local_shell';
}
export interface MCPTool extends Tool {
    type: 'mcp';
    server_label: string;
    server_url: string;
    headers?: Record<string, string> | null;
    allowed_tools?: (string[] | {
        tool_names?: string[];
    }) | null;
    require_approval?: {
        always?: {
            tool_names?: string[];
        };
        never?: {
            tool_names?: string[];
        };
    } | 'always' | 'never' | null;
}
export type _MCPToolAllowedTools = string[] | {
    tool_names?: string[];
};
export interface _MCPToolAllowedTools1 {
    tool_names?: string[];
}
export type _MCPToolRequireApproval = {
    always?: {
        tool_names?: string[];
    };
    never?: {
        tool_names?: string[];
    };
} | 'always' | 'never';
export interface _MCPToolRequireApproval1 {
    always?: {
        tool_names?: string[];
    };
    never?: {
        tool_names?: string[];
    };
}
export interface _MCPToolRequireApprovalAlways {
    tool_names?: string[];
}
export interface _MCPToolRequireApprovalNever {
    tool_names?: string[];
}
export interface CaptureStructuredOutputsTool extends Tool {
    type: 'capture_structured_outputs';
    outputs: Record<string, StructuredOutputDefinition>;
}
export interface StructuredOutputDefinition {
    description?: string;
    schema: Record<string, any>;
}
export interface CaptureSemanticEventsTool extends Tool {
    type: 'capture_semantic_events';
    events: Record<string, SemanticEventDefinition>;
}
export interface SemanticEventDefinition {
    condition: string;
}
export interface StructuredInputDefinition {
    description?: string;
    default_value?: any;
    tool_argument_bindings?: ToolArgumentBinding[];
    schema?: any;
    required?: boolean;
}
export interface ToolArgumentBinding {
    tool_name: string;
    argument_name: string;
}
export interface Reasoning {
    effort?: ReasoningEffort | null;
    summary?: ('auto' | 'concise' | 'detailed') | null;
    generateSummary?: ('auto' | 'concise' | 'detailed') | null;
}
export type ReasoningEffort = 'low' | 'medium' | 'high';
export type ModelIdsResponses = ModelIdsShared | 'o1-pro' | 'o1-pro-2025-03-19' | 'o3-pro' | 'o3-pro-2025-06-10' | 'o3-deep-research' | 'o3-deep-research-2025-06-26' | 'o4-mini-deep-research' | 'o4-mini-deep-research-2025-06-26' | 'computer-use-preview' | 'computer-use-preview-2025-03-11';
export type ModelIdsShared = 'gpt-4.1' | 'gpt-4.1-mini' | 'gpt-4.1-nano' | 'gpt-4.1-2025-04-14' | 'gpt-4.1-mini-2025-04-14' | 'gpt-4.1-nano-2025-04-14' | 'o4-mini' | 'o4-mini-2025-04-16' | 'o3' | 'o3-2025-04-16' | 'o3-mini' | 'o3-mini-2025-01-31' | 'o1' | 'o1-2024-12-17' | 'o1-preview' | 'o1-preview-2024-09-12' | 'o1-mini' | 'o1-mini-2024-09-12' | 'gpt-4o' | 'gpt-4o-2024-11-20' | 'gpt-4o-2024-08-06' | 'gpt-4o-2024-05-13' | 'gpt-4o-audio-preview' | 'gpt-4o-audio-preview-2024-10-01' | 'gpt-4o-audio-preview-2024-12-17' | 'gpt-4o-audio-preview-2025-06-03' | 'gpt-4o-mini-audio-preview' | 'gpt-4o-mini-audio-preview-2024-12-17' | 'gpt-4o-search-preview' | 'gpt-4o-mini-search-preview' | 'gpt-4o-search-preview-2025-03-11' | 'gpt-4o-mini-search-preview-2025-03-11' | 'chatgpt-4o-latest' | 'codex-mini-latest' | 'gpt-4o-mini' | 'gpt-4o-mini-2024-07-18' | 'gpt-4-turbo' | 'gpt-4-turbo-2024-04-09' | 'gpt-4-0125-preview' | 'gpt-4-turbo-preview' | 'gpt-4-1106-preview' | 'gpt-4-vision-preview' | 'gpt-4' | 'gpt-4-0314' | 'gpt-4-0613' | 'gpt-4-32k' | 'gpt-4-32k-0314' | 'gpt-4-32k-0613' | 'gpt-3.5-turbo' | 'gpt-3.5-turbo-16k' | 'gpt-3.5-turbo-0301' | 'gpt-3.5-turbo-0613' | 'gpt-3.5-turbo-1106' | 'gpt-3.5-turbo-0125' | 'gpt-3.5-turbo-16k-0613';
export type ItemType = 'message' | 'file_search_call' | 'function_call' | 'function_call_output' | 'remote_function_call' | 'remote_function_call_output' | 'computer_call' | 'computer_call_output' | 'web_search_call' | 'reasoning' | 'item_reference' | 'image_generation_call' | 'code_interpreter_call' | 'local_shell_call' | 'local_shell_call_output' | 'mcp_list_tools' | 'mcp_approval_request' | 'mcp_approval_response' | 'mcp_call' | 'structured_outputs' | 'structured_inputs' | 'workflow_action' | 'semantic_event';
export interface ItemResource {
    type: ItemType;
    id: string;
    object?: string;
    status?: 'completed' | 'in_progress' | 'incomplete' | 'failed' | 'cancelled';
    createdAt?: Date;
    createdBy?: {
        agent?: AgentId;
        responseId?: string;
    } | null;
}
export type ResponsesMessageRole = 'system' | 'developer' | 'user' | 'assistant';
export interface ItemContent {
    type: ItemContentType;
}
export type ItemContentUnion = ItemContentInputAudio | ItemContentOutputAudio | ItemContentRefusal | ItemContentInputText | ItemContentInputImage | ItemContentInputFile | ItemContentOutputText | ItemContent;
export type ItemContentType = 'input_text' | 'input_audio' | 'input_image' | 'input_file' | 'output_text' | 'output_audio' | 'refusal';
export interface ItemContentInputAudio extends ItemContent {
    type: 'input_audio';
    data: string;
    format: 'mp3' | 'wav';
}
export interface ItemContentOutputAudio extends ItemContent {
    type: 'output_audio';
    data: string;
    transcript: string;
}
export interface ItemContentRefusal extends ItemContent {
    type: 'refusal';
    refusal: string;
}
export interface ItemContentInputText extends ItemContent {
    type: 'input_text';
    text: string;
}
export interface ItemContentInputImage extends ItemContent {
    type: 'input_image';
    image_url?: string | null;
    file_id?: string | null;
    detail?: 'low' | 'high' | 'auto';
}
export interface ItemContentInputFile extends ItemContent {
    type: 'input_file';
    file_id?: string | null;
    filename?: string;
    file_data?: string;
}
export interface ItemContentOutputText extends ItemContent {
    type: 'output_text';
    text: string;
    annotations: AnnotationUnion[];
    logprobs?: LogProb[];
}
export interface Annotation {
    type: AnnotationType;
}
export type AnnotationUnion = AnnotationFileCitation | AnnotationUrlCitation | AnnotationFilePath | Annotation;
export type AnnotationType = 'file_citation' | 'url_citation' | 'file_path' | 'container_file_citation';
export interface AnnotationFileCitation extends Annotation {
    type: 'file_citation';
    file_id: string;
    index: number;
    filename: string;
}
export interface AnnotationUrlCitation extends Annotation {
    type: 'url_citation';
    url: string;
    start_index: number;
    end_index: number;
    title: string;
}
export interface AnnotationFilePath extends Annotation {
    type: 'file_path';
    file_id: string;
    index: number;
}
export interface LogProb {
    token: string;
    logprob: number;
    bytes: number[];
    top_logprobs: TopLogProb[];
}
export interface TopLogProb {
    token: string;
    logprob: number;
    bytes: number[];
}
export interface _FileSearchToolCallItemParamResult {
    file_id?: string;
    text?: string;
    filename?: string;
    attributes?: VectorStoreFileAttributes;
    score?: number;
    vector_store_id?: string;
}
export interface VectorStoreFileAttributes {
    additionalProperties?: Record<string, string | boolean | number>;
}
export interface ComputerAction {
    type: ComputerActionType;
}
export type ComputerActionUnion = ComputerActionClick | ComputerActionDoubleClick | ComputerActionDrag | ComputerActionMove | ComputerActionScreenshot | ComputerActionScroll | ComputerActionTypeKeys | ComputerActionWait | ComputerActionKeyPress | ComputerAction;
export type ComputerActionType = 'screenshot' | 'click' | 'double_click' | 'scroll' | 'type' | 'wait' | 'keypress' | 'drag' | 'move';
export interface ComputerActionClick extends ComputerAction {
    type: 'click';
    button: 'left' | 'right' | 'wheel' | 'back' | 'forward';
    x: number;
    y: number;
}
export interface ComputerActionDoubleClick extends ComputerAction {
    type: 'double_click';
    x: number;
    y: number;
}
export interface ComputerActionDrag extends ComputerAction {
    type: 'drag';
    path: Coordinate[];
}
export interface Coordinate {
    x: number;
    y: number;
}
export interface ComputerActionMove extends ComputerAction {
    type: 'move';
    x: number;
    y: number;
}
export interface ComputerActionScreenshot extends ComputerAction {
    type: 'screenshot';
}
export interface ComputerActionScroll extends ComputerAction {
    type: 'scroll';
    x: number;
    y: number;
    scroll_x: number;
    scroll_y: number;
}
export interface ComputerActionTypeKeys extends ComputerAction {
    type: 'type';
    text: string;
}
export interface ComputerActionWait extends ComputerAction {
    type: 'wait';
}
export interface ComputerActionKeyPress extends ComputerAction {
    type: 'keypress';
    keys: string[];
}
export interface ComputerToolCallSafetyCheck {
    id: string;
    code: string;
    message: string;
}
export interface ItemParam {
    type: ItemType;
}
export interface ComputerToolCallOutputItemParam extends ItemParam {
    type: 'computer_call_output';
    call_id: string;
    acknowledged_safety_checks?: ComputerToolCallSafetyCheck[];
    output: ComputerToolCallOutputItemOutputUnion;
}
export interface ComputerToolCallOutputItemOutput {
    type: ComputerToolCallOutputItemOutputType;
}
export type ComputerToolCallOutputItemOutputUnion = ComputerToolCallOutputItemOutputComputerScreenshot | ComputerToolCallOutputItemOutput;
export type ComputerToolCallOutputItemOutputType = 'computer_screenshot';
export interface ComputerToolCallOutputItemOutputComputerScreenshot extends ComputerToolCallOutputItemOutput {
    type: 'computer_screenshot';
    image_url?: string;
    file_id?: string;
}
export type ItemResourceUnion = ResponsesMessageItemResource | FunctionToolCallOutputItemResource | FileSearchToolCallItemResource | ComputerToolCallItemResource | ComputerToolCallOutputItemResource | WebSearchToolCallItemResource | FunctionToolCallItemResource | RemoteFunctionCallItemResource | RemoteFunctionCallOutputItemResource | ReasoningItemResource | ItemReferenceItemResource | ImageGenToolCallItemResource | CodeInterpreterToolCallItemResource | LocalShellToolCallItemResource | LocalShellToolCallOutputItemResource | MCPListToolsItemResource | MCPApprovalRequestItemResource | MCPApprovalResponseItemResource | MCPCallItemResource | StructuredInputsItemResource | StructuredOutputsItemResource | SemanticEventsOutputItemResource | WorkflowActionOutputItemResource;
export interface ResponsesMessageItemResource extends ItemResource {
    type: 'message';
    status: 'completed' | 'in_progress' | 'incomplete';
    role: ResponsesMessageRole;
    content?: ItemContentUnion[];
}
export interface FunctionToolCallOutputItemResource extends ItemResource {
    type: 'function_call_output';
    status: 'completed' | 'in_progress' | 'incomplete';
    callId: string;
    output: string;
}
export interface FileSearchToolCallItemResource extends ItemResource {
    type: 'file_search_call';
    status: 'completed' | 'in_progress' | 'incomplete';
    queries: string[];
    results?: _FileSearchToolCallItemParamResult[] | null;
}
export interface ComputerToolCallItemResource extends ItemResource {
    type: 'computer_call';
    status: 'completed' | 'in_progress' | 'incomplete';
    callId: string;
    action: ComputerActionUnion;
    pendingSafetyChecks?: ComputerToolCallSafetyCheck[];
}
export interface ComputerToolCallOutputItemResource extends ItemResource {
    type: 'computer_call_output';
    status: 'completed' | 'in_progress' | 'incomplete';
    callId: string;
    acknowledged_safety_checks?: ComputerToolCallSafetyCheck[];
    output: ComputerToolCallOutputItemOutputUnion;
}
export interface WebSearchAction {
    type: WebSearchActionType;
}
export type WebSearchActionUnion = WebSearchActionFind | WebSearchActionOpenPage | WebSearchActionSearch | WebSearchAction;
export type WebSearchActionType = 'search' | 'open_page' | 'find';
export interface WebSearchActionFind extends WebSearchAction {
    type: 'find';
    url: string;
    pattern: string;
}
export interface WebSearchActionOpenPage extends WebSearchAction {
    type: 'open_page';
    url: string;
}
export interface WebSearchActionSearch extends WebSearchAction {
    type: 'search';
    query: string;
}
export interface WebSearchToolCallItemResource extends ItemResource {
    type: 'web_search_call';
    status: 'completed' | 'in_progress' | 'incomplete';
    action: WebSearchActionUnion;
}
export interface FunctionToolCallItemResource extends ItemResource {
    type: 'function_call';
    status: 'completed' | 'in_progress' | 'incomplete';
    callId: string;
    name: string;
    arguments: string;
}
export interface RemoteFunctionCallItemResource extends ItemResource {
    type: 'remote_function_call';
    status: 'completed' | 'in_progress' | 'incomplete';
    callId: string;
    name: string;
    arguments: string;
}
export interface RemoteFunctionCallOutputItemResource extends ItemResource {
    type: 'remote_function_call_output';
    status: 'completed' | 'in_progress' | 'incomplete';
    callId: string;
    output: string;
}
export interface ReasoningItemSummaryPart {
    type: ReasoningItemSummaryPartType;
}
export type ReasoningItemSummaryPartUnion = ReasoningItemSummaryTextPart | ReasoningItemSummaryPart;
export type ReasoningItemSummaryPartType = 'summary_text';
export interface ReasoningItemSummaryTextPart extends ReasoningItemSummaryPart {
    type: 'summary_text';
    text: string;
}
export interface ReasoningItemResource extends ItemResource {
    type: 'reasoning';
    encryptedContent?: string | null;
    summary: ReasoningItemSummaryPartUnion[];
}
export interface ItemReferenceItemResource extends ItemResource {
    type: 'item_reference';
    status: 'completed' | 'in_progress' | 'incomplete';
    refId: string;
}
export interface ImageGenToolCallItemResource extends ItemResource {
    type: 'image_generation_call';
    status: 'completed' | 'in_progress' | 'incomplete';
    result: string | null;
}
export type CodeInterpreterOutputUnion = CodeInterpreterLogOutput | CodeInterpreterImageOutput | CodeInterpreterOutputUnionBase;
export interface CodeInterpreterOutputUnionBase {
    type: string;
}
export interface CodeInterpreterLogOutput extends CodeInterpreterOutputUnionBase {
    type: 'logs';
    logs: string;
}
export interface CodeInterpreterImageOutput extends CodeInterpreterOutputUnionBase {
    type: 'image';
    image: CodeInterpreterImageOutputImage;
}
export interface CodeInterpreterImageOutputImage {
    format: 'png' | 'jpeg' | 'gif' | 'webp';
    data: string;
}
export interface CodeInterpreterToolCallItemResource extends ItemResource {
    type: 'code_interpreter_call';
    status: 'completed' | 'in_progress' | 'incomplete';
    containerId: string;
    code: string | null;
    outputs: CodeInterpreterOutputUnion[] | null;
}
export interface LocalShellExecAction {
    type: 'execute';
    command: string[];
    timeout_ms?: number;
    working_directory?: string;
    env?: Record<string, string>;
    user?: string;
}
export interface LocalShellToolCallItemResource extends ItemResource {
    type: 'local_shell_call';
    status: 'in_progress' | 'completed' | 'incomplete';
    callId: string;
    action: LocalShellExecAction;
}
export interface LocalShellToolCallOutputItemResource extends ItemResource {
    type: 'local_shell_call_output';
    status: 'in_progress' | 'completed' | 'incomplete';
    output: string;
}
export interface MCPListToolsItemResource extends ItemResource {
    type: 'mcp_list_tools';
    serverLabel: string;
    tools: MCPListToolsTool[];
    error?: string | null;
}
export interface MCPListToolsTool {
    name: string;
    description?: string;
    inputSchema?: any;
    annotations?: any;
}
export interface MCPApprovalRequestItemResource extends ItemResource {
    type: 'mcp_approval_request';
    serverLabel: string;
    name: string;
    arguments: string;
}
export interface MCPApprovalResponseItemResource extends ItemResource {
    type: 'mcp_approval_response';
    approvalRequestId: string;
    approve: boolean;
    reason?: string;
}
export interface MCPCallItemResource extends ItemResource {
    type: 'mcp_call';
    serverLabel: string;
    name: string;
    arguments: string;
    output?: string | null;
    error?: string | null;
}
export interface StructuredInputsItemResource extends ItemResource {
    type: 'structured_inputs';
    inputs?: Record<string, any>;
}
export interface StructuredOutputsItemResource extends ItemResource {
    type: 'structured_outputs';
    outputs?: Record<string, any>;
}
export interface SemanticEventsOutputItemResource extends ItemResource {
    type: 'semantic_event';
    name: string;
}
export interface WorkflowActionOutputItemResource extends ItemResource {
    type: 'workflow_action';
    kind: string;
    parentActionId?: string;
    previousActionId?: string;
    status: 'completed' | 'failed' | 'in_progress' | 'cancelled';
}
export type WorkflowActionOutputItemResourceUnion = InvokeAzureAgentWorkflowActionOutputItemResource | WorkflowActionOutputItemResource;
export interface InvokeAzureAgentWorkflowActionOutputItemResource extends WorkflowActionOutputItemResource {
    kind: 'InvokeAzureAgent';
    agent: AgentId;
    conversationId?: string;
    responseId: string;
}
export interface AgentId {
    type: 'agent_id';
    name: string;
    version?: string;
}
//# sourceMappingURL=modelsV2.d.ts.map