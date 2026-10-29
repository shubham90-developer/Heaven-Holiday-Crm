"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  label: string;
  value?: string[];
  onChange: (value: string[]) => void;
  options: string[];
  isLoading?: boolean;
  emptyMessage?: string;
};

const ChipMultiSelect = ({
  label,
  value = [],
  onChange,
  options,
  isLoading = false,
  emptyMessage = "No options found",
}: Props) => {
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const availableOptions = useMemo(
    () => options.filter((opt) => !value.includes(opt)),
    [options, value]
  );

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    setHighlightIndex(0);
  }, [availableOptions.length, open]);

  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const removeOption = (option: string) => {
    onChange(value.filter((item) => item !== option));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        availableOptions.length ? (prev + 1) % availableOptions.length : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        availableOptions.length
          ? (prev - 1 + availableOptions.length) % availableOptions.length
          : 0
      );
    } else if (e.key === "Enter" && availableOptions[highlightIndex]) {
      e.preventDefault();
      toggleOption(availableOptions[highlightIndex]);
    } else if (e.key === "Backspace" && value.length > 0) {
      removeOption(value[value.length - 1]);
    }
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <fieldset
        onClick={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={{
          margin: 0,
          border: "1px solid #ced4da",
          borderRadius: "4px",
          padding: "6px 8px 8px",
          minHeight: "38px",
          cursor: "text",
          background: "#fff",
        }}
      >
        <legend
          style={{
            float: "none",
            width: "auto",
            fontSize: "10px",
            color: "#0d6efd",
            padding: "0 4px",
            marginBottom: 0,
            marginLeft: "4px",
          }}
        >
          {label}
        </legend>

        <div
          className="d-flex flex-wrap gap-1 align-items-center"
          style={{ minHeight: "22px" }}
        >
          {value.map((item) => (
            <span
              key={item}
              className="d-inline-flex align-items-center gap-1"
              style={{
                background: "#e9ecef",
                color: "#495057",
                fontSize: "11px",
                lineHeight: 1.2,
                padding: "4px 8px",
                borderRadius: "3px",
                maxWidth: "100%",
                wordBreak: "break-word",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {item}
              <button
                type="button"
                aria-label={`Remove ${item}`}
                onClick={() => removeOption(item)}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  marginLeft: "2px",
                  fontSize: "12px",
                  lineHeight: 1,
                  color: "#6c757d",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </span>
          ))}

          {!value.length && (
            <span style={{ fontSize: "12px", color: "#adb5bd" }}>
              {isLoading ? "Loading..." : "Select"}
            </span>
          )}
        </div>
      </fieldset>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 20,
            marginTop: "2px",
            background: "#fff",
            border: "1px solid #ced4da",
            borderRadius: "4px",
            maxHeight: "200px",
            overflowY: "auto",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          {isLoading && (
            <div style={{ padding: "8px 12px", fontSize: "12px" }}>
              Loading...
            </div>
          )}

          {!isLoading && availableOptions.length === 0 && (
            <div
              style={{
                padding: "8px 12px",
                fontSize: "12px",
                color: "#6c757d",
              }}
            >
              {options.length ? "All options selected" : emptyMessage}
            </div>
          )}

          {availableOptions.map((option, index) => (
            <div
              key={option}
              role="option"
              aria-selected={index === highlightIndex}
              onMouseEnter={() => setHighlightIndex(index)}
              onMouseDown={(e) => {
                e.preventDefault();
                toggleOption(option);
              }}
              style={{
                padding: "8px 12px",
                fontSize: "12px",
                cursor: "pointer",
                background: index === highlightIndex ? "#0d6efd" : "#fff",
                color: index === highlightIndex ? "#fff" : "#212529",
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChipMultiSelect;
