import * as rpc from 'vscode-jsonrpc';
export declare abstract class WebViewJsonRpcConnection {
    private readonly _messageReader;
    private readonly _rpcConnection;
    constructor();
    get messageConnection(): rpc.MessageConnection;
    protected abstract writeRpcMessage(message: rpc.Message): Promise<void>;
    protected fireRpcMessageReceived(message: rpc.Message): void;
}
//# sourceMappingURL=webViewJsonRpcConnection.d.ts.map