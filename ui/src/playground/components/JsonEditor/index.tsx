import React, { useEffect } from "react";
import "jsoneditor/dist/jsoneditor.min.css";
import jsoneditor, { JSONEditorOptions } from "jsoneditor";
import { AppState } from "../../types";

export type JsonEditorProps = { content: object; state: AppState };

export const JsonEditor = ({ content: content = {} } = {}) => {
  useEffect(() => {
    const container = document.getElementById("json-editor");
    if (container == null) {
      throw new Error("Container with id json-editor not found");
    }
    const opts: JSONEditorOptions = {
      mode: "code",
      modes: ["code", "text", "tree"],
      onChangeText: (json: any) => {
        // TODO update appstate here
        console.log(json);
      }
    };
    const editor = new jsoneditor(container, opts);
    editor.set(content);
  });
  return <div id="json-editor" style={{ height: "800px" }} />;
};
