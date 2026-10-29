"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ size: ["small", false, "large"] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ color: [] }, { background: [] }],
    ["clean"],
    ["code-block"],
  ],
};

type ProposalRichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
};

const ProposalRichTextEditor = ({
  value,
  onChange,
  placeholder = "Start typing...",
  minHeight = 120,
}: ProposalRichTextEditorProps) => {
  return (
    <div className="ccp-quill">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={quillModules}
        placeholder={placeholder}
        style={{ minHeight }}
      />
    </div>
  );
};

export default ProposalRichTextEditor;
