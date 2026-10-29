"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: [
    [{ font: [] }, { size: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "super" }, { script: "sub" }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image", "blockquote"],
    ["clean"],
  ],
};

type TermsRichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const TermsRichTextEditor = ({
  value,
  onChange,
  placeholder = "Start typing terms & conditions...",
}: TermsRichTextEditorProps) => {
  const [showSource, setShowSource] = useState(false);

  return (
    <div className="tnc-editor">
      <div className="tnc-editor-toolbar-extras">
        <button
          type="button"
          className={`tnc-source-btn${showSource ? " is-active" : ""}`}
          onClick={() => setShowSource((prev) => !prev)}
        >
          Source
        </button>
      </div>
      {showSource ? (
        <textarea
          className="tnc-source-view"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          spellCheck={false}
        />
      ) : (
        <ReactQuill
          theme="snow"
          value={value || ""}
          onChange={onChange}
          modules={quillModules}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default TermsRichTextEditor;
