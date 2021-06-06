import React from "react";
import MonacoEditor from "react-monaco-editor";
import "./MonacoEditorPatcher.css";

const MonacoCodeEditor: React.FC<{ value: string; onChange: (value: string) => void }> = props => (
  <MonacoEditor
    value={props.value}
    onChange={props.onChange}
    height={200}
    language={"plain"}
    options={{
      minimap: { enabled: false }
    }}
  />
);

export default MonacoCodeEditor;
