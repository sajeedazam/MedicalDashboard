import './App.css';

import Dashboard from './pages/main';
import SmartAuth from './pages/smartAuth';
import Config from './pages/config';

/** React Router DOM **/
// import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/smartAuth" element={<SmartAuth />} />
        <Route path="/config" element={<Config />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
