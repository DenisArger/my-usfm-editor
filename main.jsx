import React from "react";
import ReactDOM from "react-dom/client";
import ShowBookPreview from "./ShowBookPreview.jsx";
import ShowUsfmEditor from "./ShowUsfmEditor.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ShowBookPreview />
    <ShowUsfmEditor />
  </React.StrictMode>
);
