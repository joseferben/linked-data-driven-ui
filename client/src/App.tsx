import React from "react";
import { BrowserRouter } from "react-router-dom";

import HydraConsole from "./HydraClient";

const App = () => (
  <BrowserRouter>
    <HydraConsole />
  </BrowserRouter>
);

export default App;
