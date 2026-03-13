/** The possible execution status values for a thread message. */
export type MessageStatus = 'in_progress' | 'incomplete' | 'completed';
/** Information providing additional detail about a message entering an incomplete status. */
export interface MessageIncompleteDetails {
    /** The provided reason describing why the message was marked as incomplete. */
    reason: MessageIncompleteDetailsReason;
}
/** A set of reasons describing why a message is marked as incomplete. */
export type MessageIncompleteDetailsReason = 'content_filter' | 'max_tokens' | 'run_cancelled' | 'run_failed' | 'run_expired';
/** The possible values for roles attributed to messages in a thread. */
export type MessageRole = 'user' | 'assistant';
export interface MessageContent {
    /** The object type. */
    /** The discriminator possible values: text, image_file */
    type: string;
}
/** Alias for MessageContentUnion */
export type MessageContentUnion = MessageTextContent | MessageImageFileContent | MessageContent;
export type MessageContentConcrete = MessageTextContent | MessageImageFileContent;
/** A representation of a textual item of thread message content. */
export interface MessageTextContent extends MessageContent {
    /** The object type, which is always 'text'. */
    type: 'text';
    /** The text and associated annotations for this thread message content item. */
    text: MessageTextDetails;
}
/** The text and associated annotations for a single item of agent thread message content. */
export interface MessageTextDetails {
    /** The text data. */
    value: string;
    /** A list of annotations associated with this text. */
    annotations: MessageTextAnnotationUnion[];
}
/** An abstract representation of an annotation to text thread message content. */
export interface MessageTextAnnotation {
    /** The object type. */
    /** The discriminator possible values: url_citation, file_citation, file_path */
    type: string;
    /** The textual content associated with this text annotation item. */
    text: string;
}
/** Alias for MessageTextAnnotationUnion */
export type MessageTextAnnotationUnion = MessageTextUrlCitationAnnotation | MessageTextFileCitationAnnotation | MessageTextFilePathAnnotation | MessageTextAnnotation;
export type MessageTextAnnotationConcrete = MessageTextUrlCitationAnnotation | MessageTextFileCitationAnnotation | MessageTextFilePathAnnotation;
/** A citation within the message that points to a specific URL associated with the message. Generated when the agent uses tools such as 'bing_grounding' to search the Internet. */
export interface MessageTextUrlCitationAnnotation extends MessageTextAnnotation {
    /** The object type, which is always 'url_citation'. */
    type: 'url_citation';
    /** The details of the URL citation. */
    urlCitation: MessageTextUrlCitationDetails;
    /** The first text index associated with this text annotation. */
    startIndex?: number;
    /** The last text index associated with this text annotation. */
    endIndex?: number;
}
/** A representation of a URL citation, as used in text thread message content. */
export interface MessageTextUrlCitationDetails {
    /** The URL associated with this citation. */
    url: string;
    /** The title of the URL. */
    title?: string;
}
/** A citation within the message that points to a specific quote from a specific File associated with the agent or the message. Generated when the agent uses the 'file_search' tool to search files. */
export interface MessageTextFileCitationAnnotation extends MessageTextAnnotation {
    /** The object type, which is always 'file_citation'. */
    type: 'file_citation';
    /**
     * A citation within the message that points to a specific quote from a specific file.
     * Generated when the agent uses the "file_search" tool to search files.
     */
    fileCitation: MessageTextFileCitationDetails;
    /** The first text index associated with this text annotation. */
    startIndex?: number;
    /** The last text index associated with this text annotation. */
    endIndex?: number;
}
/** A representation of a file-based text citation, as used in a file-based annotation of text thread message content. */
export interface MessageTextFileCitationDetails {
    /** The ID of the file associated with this citation. */
    fileId: string;
    /** The name of the file, inferred from fileId*/
    fileName?: string;
    /** The specific quote cited in the associated file. */
    quote: string;
}
/** A citation within the message that points to a file located at a specific path. */
export interface MessageTextFilePathAnnotation extends MessageTextAnnotation {
    /** The object type, which is always 'file_path'. */
    type: 'file_path';
    /** A URL for the file that's generated when the agent used the code_interpreter tool to generate a file. */
    filePath: MessageTextFilePathDetails;
    /** The first text index associated with this text annotation. */
    startIndex?: number;
    /** The last text index associated with this text annotation. */
    endIndex?: number;
}
/** An encapsulation of an image file ID, as used by message image content. */
export interface MessageTextFilePathDetails {
    /** The ID of the specific file that the citation is from. */
    fileId: string;
}
/** A representation of image file content in a thread message. */
export interface MessageImageFileContent extends MessageContent {
    /** The object type, which is always 'image_file'. */
    type: 'image_file';
    /** The image file for this thread message content item. */
    imageFile: MessageImageFileDetails;
}
/** Extended image file content that includes base64 content for display purposes. */
export interface MessageImageFileContentWithContent extends MessageContent {
    /** The object type, which is always 'image_file'. */
    type: 'image_file';
    /** The image file for this thread message content item with base64 content. */
    imageFile: MessageImageFileDetailsWithContent;
}
/** An image reference, as represented in thread message content. */
export interface MessageImageFileDetails {
    /** The ID for the file associated with this image. */
    fileId: string;
}
/** Extended image file details that include base64 content for display purposes. */
export interface MessageImageFileDetailsWithContent extends MessageImageFileDetails {
    /** The base64-encoded content of the image file. */
    contentBase64?: string;
}
export interface ThreadMessage {
    /** The identifier, which can be referenced in API endpoints. */
    id: string;
    /** The object type, which is always 'thread.message'. */
    object: 'thread.message';
    /** The Unix timestamp, in seconds, representing when this object was created. */
    createdAt: number;
    /** The ID of the thread that this message belongs to. */
    threadId: string;
    /** The status of the message. */
    status: MessageStatus;
    /** On an incomplete message, details about why the message is incomplete. */
    incompleteDetails: MessageIncompleteDetails | null;
    /** The Unix timestamp (in seconds) for when the message was completed. */
    completedAt: number | null;
    /** The Unix timestamp (in seconds) for when the message was marked as incomplete. */
    incompleteAt: number | null;
    /** The role associated with the agent thread message. */
    role: MessageRole;
    /** The list of content items associated with the agent thread message. */
    content: MessageContentUnion[];
    /** If applicable, the ID of the agent that authored this message. */
    assistantId: string | null;
    /** If applicable, the ID of the run associated with the authoring of this message. */
    runId: string | null;
    /** A set of up to 16 key/value pairs that can be attached to an object, used for storing additional information about that object in a structured format. Keys may be up to 64 characters in length and values may be up to 512 characters in length. */
    metadata: Record<string, string> | null;
}
/** Alias for RunStepDeltaDetailUnion */
export type RunStepDeltaDetailUnion = RunStepDeltaMessageCreation | RunStepDeltaToolCallObject | RunStepDeltaDetail;
/** Represents a single run step detail item in a streaming run step's delta payload. */
export interface RunStepDeltaDetail {
    /** The object type for the run step detail object. */
    /** The discriminator possible values: message_creation, tool_calls */
    type: string;
}
/** Represents a message creation within a streaming run step delta. */
export interface RunStepDeltaMessageCreation extends RunStepDeltaDetail {
    /** The object type, which is always "message_creation." */
    type: 'message_creation';
    /** The message creation data. */
    messageCreation?: RunStepDeltaMessageCreationObject;
}
/** Represents the data within a streaming run step message creation response object. */
export interface RunStepDeltaMessageCreationObject {
    /** The ID of the newly-created message. */
    messageId?: string;
}
/** Represents an invocation of tool calls as part of a streaming run step. */
export interface RunStepDeltaToolCallObject extends RunStepDeltaDetail {
    /** The object type, which is always "tool_calls." */
    type: 'tool_calls';
    /** The collection of tool calls for the tool call detail item. */
    toolCalls?: RunStepDeltaToolCallUnion[];
}
/** The abstract base representation of a single tool call within a streaming run step's delta tool call details. */
export interface RunStepDeltaToolCall {
    /** The index of the tool call detail in the run step's tool_calls array. */
    index: number;
    /** The ID of the tool call, used when submitting outputs to the run. */
    id: string;
    /** The type of the tool call detail item in a streaming run step's details. */
    /** The discriminator possible values: function, file_search, code_interpreter */
    type: string;
}
/** Alias for RunStepDeltaToolCallUnion */
export type RunStepDeltaToolCallUnion = RunStepDeltaFunctionToolCall | RunStepDeltaFileSearchToolCall | RunStepDeltaCodeInterpreterToolCall | RunStepDeltaToolCall;
/** Represents a function tool call within a streaming run step's tool call details. */
export interface RunStepDeltaFunctionToolCall extends RunStepDeltaToolCall {
    /** The object type, which is always "function." */
    type: 'function';
    /** The function data for the tool call. */
    function?: RunStepDeltaFunction;
}
/** Represents the function data in a streaming run step delta's function tool call. */
export interface RunStepDeltaFunction {
    /** The name of the function. */
    name?: string;
    /** The arguments passed to the function as input. */
    arguments?: string;
    /** The output of the function, null if outputs have not yet been submitted. */
    output?: string | null;
}
/** Represents a file search tool call within a streaming run step's tool call details. */
export interface RunStepDeltaFileSearchToolCall extends RunStepDeltaToolCall {
    /** The object type, which is always "file_search." */
    type: 'file_search';
    /** Reserved for future use. */
    fileSearch?: RunStepFileSearchToolCallResults;
}
/** Represents a Code Interpreter tool call within a streaming run step's tool call details. */
export interface RunStepDeltaCodeInterpreterToolCall extends RunStepDeltaToolCall {
    /** The object type, which is always "code_interpreter." */
    type: 'code_interpreter';
    /** The Code Interpreter data for the tool call. */
    codeInterpreter?: RunStepDeltaCodeInterpreterDetailItemObject;
}
/** Represents the Code Interpreter tool call data in a streaming run step's tool calls. */
export interface RunStepDeltaCodeInterpreterDetailItemObject {
    /** The input into the Code Interpreter tool call. */
    input?: string;
    /**
     * The outputs from the Code Interpreter tool call. Code Interpreter can output one or more
     * items, including text (`logs`) or images (`image`). Each of these are represented by a
     * different object type.
     */
    outputs?: RunStepDeltaCodeInterpreterOutputUnion[];
}
/** The abstract base representation of a streaming run step tool call's Code Interpreter tool output. */
export interface RunStepDeltaCodeInterpreterOutput {
    /** The index of the output in the streaming run step tool call's Code Interpreter outputs array. */
    index: number;
    /** The type of the streaming run step tool call's Code Interpreter output. */
    /** The discriminator possible values: logs, image */
    type: string;
}
/** Alias for RunStepDeltaCodeInterpreterOutputUnion */
export type RunStepDeltaCodeInterpreterOutputUnion = RunStepDeltaCodeInterpreterLogOutput | RunStepDeltaCodeInterpreterImageOutput | RunStepDeltaCodeInterpreterOutput;
/** Represents a log output as produced by the Code Interpreter tool and as represented in a streaming run step's delta tool calls collection. */
export interface RunStepDeltaCodeInterpreterLogOutput extends RunStepDeltaCodeInterpreterOutput {
    /** The type of the object, which is always "logs." */
    type: 'logs';
    /** The text output from the Code Interpreter tool call. */
    logs?: string;
}
/** Represents an image output as produced the Code interpreter tool and as represented in a streaming run step's delta tool calls collection. */
export interface RunStepDeltaCodeInterpreterImageOutput extends RunStepDeltaCodeInterpreterOutput {
    /** The object type, which is always "image." */
    type: 'image';
    /** The image data for the Code Interpreter tool call output. */
    image?: RunStepDeltaCodeInterpreterImageOutputObject;
}
/** Represents the data for a streaming run step's Code Interpreter tool call image output. */
export interface RunStepDeltaCodeInterpreterImageOutputObject {
    /** The file ID for the image. */
    fileId?: string;
}
/** The results of the file search. */
export interface RunStepFileSearchToolCallResults {
    /** Ranking options for file search. */
    rankingOptions?: FileSearchRankingOptions;
    /** The array of a file search results */
    results: RunStepFileSearchToolCallResult[];
}
/**   File search tool call result. */
export interface RunStepFileSearchToolCallResult {
    /** The ID of the file that result was found in. */
    fileId: string;
    /** The name of the file that result was found in. */
    fileName: string;
    /** The score of the result. All values must be a floating point number between 0 and 1. */
    score: number;
    /** The content of the result that was found. The content is only included if requested via the include query parameter. */
    content?: FileSearchToolCallContent[];
}
/** The file search result content object. */
export interface FileSearchToolCallContent {
    /** The type of the content. */
    type: 'text';
    /** The text content of the file. */
    text: string;
}
/** Ranking options for file search. */
export interface FileSearchRankingOptions {
    /** File search ranker. */
    ranker: string;
    /** Ranker search threshold. */
    scoreThreshold: number;
}
//# sourceMappingURL=models.d.ts.map