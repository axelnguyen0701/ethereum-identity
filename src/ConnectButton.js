import { EthereumAuthProvider, useViewerConnection } from "@self.id/framework";

// A simple button to initiate the connection flow. A Provider must be present at a higher level
// in the component tree for the `useViewerConnection()` hook to work.
function ConnectButton() {
    const [connection, connect, disconnect] = useViewerConnection();

    return connection.status === "connected" ? (
        <button
            onClick={() => {
                disconnect();
            }}
        >
            Disconnect ({connection.selfID.id})
        </button>
    ) : "ethereum" in window ? (
        <button
            disabled={connection.status === "connecting"}
            onClick={async () => {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                await connect(
                    new EthereumAuthProvider(window.ethereum, accounts[0])
                );
            }}
        >
            Connect
        </button>
    ) : (
        <p>
            An injected Ethereum provider such as{" "}
            <a href="https://metamask.io/">MetaMask</a> is needed to
            authenticate.
        </p>
    );
}

export default ConnectButton;
