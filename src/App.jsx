import { Route, Routes } from "react-router-dom";
import "./App.css";
import BrokerManagement from "./pages/BrokerManagement";
import DiamondManagement from "./pages/DiamondManagement";
import Layout from "./components/Layout";
import TransactionReport from "./pages/TransactionDetails";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<BrokerManagement />} />
          <Route path="/Diamond" element={<DiamondManagement />} />
          <Route path="/Final" element={<TransactionReport />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
