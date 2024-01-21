import "./App.css";
import Dashboard from "./pages/main";
import SmartAuth from "./pages/smartAuth";
import Config from "./pages/config";
import ListConfig from "./pages/listConfig";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function App({ signOut, user }) {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/smartAuth" element={<SmartAuth />} />
          <Route path="/config" element={<Config />} />
          {/* <Route path="/list-config" element={<ListConfig />} /> */}
        </Routes>
      </BrowserRouter>

      <h1>Hello {user.username}</h1>
      <button onClick={signOut}>Sign out</button>
    </>
  );
}

export default withAuthenticator(App);