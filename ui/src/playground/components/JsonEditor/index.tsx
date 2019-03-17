import React, { useEffect } from "react";
import "jsoneditor/dist/jsoneditor.min.css";
import jsoneditor, { JSONEditorOptions } from "jsoneditor";

export const JsonEditor = (props: any) => {
  const content = props.content;
  useEffect(() => {
    const container = document.getElementById("json-editor");
    if (container == null) {
      throw new Error("Container with id json-editor not found");
    }
    const opts: JSONEditorOptions = {
      mode: "code",
      modes: ["code", "text", "tree"],
      onChangeText: (json: any) => {
        try {
          const parsed = JSON.parse(json);
          props.compacted.data = parsed;
        } catch (e) {
          console.warn("Invalid json");
        }
      }
    };
    const editor = new jsoneditor(container, opts);
    editor.set(content);
    return () => {
      editor.destroy();
    };
  }, [content]);
  return <div id="json-editor" style={{ height: "800px" }} />;
};
