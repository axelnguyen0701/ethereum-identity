import {
    useViewerConnection,
    EthereumAuthProvider,
    useViewerRecord,
} from "@self.id/framework";
import { useState } from "react";
import "./User.css";

function ShowViewerProfile() {
    const record = useViewerRecord("basicProfile");

    const text = record.isLoading
        ? "Loading..."
        : record.content
        ? `Hello ${record.content.name || "stranger"}`
        : "No profile to load.";

    const image = record.isLoading ? (
        "Loading..."
    ) : record.content ? (
        <img src={record.content.imageSrc} alt="Avatar" />
    ) : (
        "No image."
    );

    return (
        <>
            {image} {" " + text}
        </>
    );
}

function SetViewerName() {
    const [name, setName] = useState("");
    const [imgLink, setImgLink] = useState("");
    const record = useViewerRecord("basicProfile");

    return (
        <>
            <div>
                <div style={{ padding: "10px 0px" }}>
                    <label htmlFor="name">User Name: </label>
                    <input
                        type="text"
                        name="name"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                </div>
                <div>
                    <label htmlFor="imgLink">Image Link: </label>
                    <input
                        type="text"
                        name="imageName"
                        onChange={(e) => setImgLink(e.target.value)}
                        value={imgLink}
                    />
                </div>
            </div>

            <button
                className="button"
                disabled={
                    !record.isMutable || record.isMutating || record.isLoading
                }
                onClick={async () => {
                    await record.merge({
                        name,
                        imageSrc: imgLink,
                    });
                }}
            >
                Set name
            </button>
        </>
    );
}

function User() {
    const [connection, connect, disconnect] = useViewerConnection();

    return (
        <div className="container">
            {ShowViewerProfile()}
            <div>
                {SetViewerName()}
                {connection.status === "connected" ? (
                    <button
                        className="button"
                        onClick={() => {
                            disconnect();
                        }}
                    >
                        Disconnect ({connection.selfID.id})
                    </button>
                ) : "ethereum" in window ? (
                    <button
                        className="button"
                        disabled={connection.status === "connecting"}
                        onClick={async () => {
                            const accounts = await window.ethereum.request({
                                method: "eth_requestAccounts",
                            });
                            await connect(
                                new EthereumAuthProvider(
                                    window.ethereum,
                                    accounts[0]
                                )
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
                )}
            </div>
        </div>
    );
}
export default User;
