import { Provider } from "@self.id/framework";

function App({ children }) {
    return <Provider client={{ ceramic: "testnet-clay" }}>{children}</Provider>;
}

export default App;
