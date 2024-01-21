import "./App.css";
import Dashboard from "./pages/main";
import SmartAuth from "./pages/smartAuth";
import Config from "./pages/config";
import ListConfig from "./pages/listConfig";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/smartAuth" element={<SmartAuth />} />
        <Route path="/config" element={<Config />} />
        <Route path="/list-config" element={<ListConfig />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
