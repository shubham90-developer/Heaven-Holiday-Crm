"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGetAllDestinationsQuery } from "@/store/services/destinationApi";
import { useGetAreasQuery } from "@/store/services/inventory/area-master/areaMasterApi";

const parseDestinations = (value: string) =>
  value
    .split(/[,/|]+/)
    .map((item) => item.trim())
    .filter(Boolean);

type DestinationCoveredSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

const DestinationCoveredSelect = ({
  value,
  onChange,
}: DestinationCoveredSelectProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: destinationResponse, isLoading: destinationsLoading } =
    useGetAllDestinationsQuery(undefined);
  const { data: areasResponse, isLoading: areasLoading } = useGetAreasQuery({
    city: "",
    area: "",
  });

  const selected = useMemo(() => parseDestinations(value), [value]);
  const isLoading = destinationsLoading || areasLoading;

  const options = useMemo(() => {
    const destinations = destinationResponse?.data || [];
    const areas = areasResponse?.data || [];
    const names = [
      ...destinations.flatMap((item: { city?: string; country?: string }) => [
        item.city,
        item.country,
      ]),
      ...areas.map((item: { city?: string }) => item.city),
      ...selected,
    ]
      .map((item) => (item || "").trim())
      .filter(Boolean);
    return Array.from(new Set(names));
  }, [destinationResponse, areasResponse, selected]);

  const availableOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options.filter((item) => {
      if (selected.includes(item)) return false;
      if (!q) return true;
      return item.toLowerCase().includes(q);
    });
  }, [options, selected, query]);

  const canCreate =
    Boolean(query.trim()) &&
    !selected.some((item) => item.toLowerCase() === query.trim().toLowerCase()) &&
    !options.some((item) => item.toLowerCase() === query.trim().toLowerCase());

  const visibleOptions = canCreate
    ? [`Add "${query.trim()}"`, ...availableOptions]
    : availableOptions;

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    setHighlightIndex(0);
  }, [query, open]);

  const emit = (next: string[]) => onChange(next.join(", "));

  const addValue = (name: string) => {
    const next = name.trim();
    if (!next) return;
    if (selected.some((item) => item.toLowerCase() === next.toLowerCase())) {
      setQuery("");
      return;
    }
    emit([...selected, next]);
    setQuery("");
    inputRef.current?.focus();
  };

  const removeValue = (name: string) => {
    emit(selected.filter((item) => item !== name));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !query && selected.length) {
      removeValue(selected[selected.length - 1]);
      return;
    }
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setHighlightIndex((prev) =>
        visibleOptions.length ? (prev + 1) % visibleOptions.length : 0
      );
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightIndex((prev) =>
        visibleOptions.length
          ? (prev - 1 + visibleOptions.length) % visibleOptions.length
          : 0
      );
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const picked = visibleOptions[highlightIndex];
      if (canCreate && highlightIndex === 0) {
        addValue(query);
        return;
      }
      if (picked) addValue(picked);
      else if (query.trim()) addValue(query);
    }
  };

  return (
    <div ref={containerRef} className="ccp-dest-select-wrap">
      <div
        className="ccp-dest-select"
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        {selected.map((item) => (
          <span key={item} className="ccp-dest-chip">
            {item}
            <button
              type="button"
              className="ccp-dest-chip-remove"
              aria-label={`Remove ${item}`}
              onClick={(event) => {
                event.stopPropagation();
                removeValue(item);
              }}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          className="ccp-dest-input"
          placeholder="Destinations Covered"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {open && (
        <div className="ccp-dest-dropdown">
          {isLoading && (
            <div className="ccp-dest-option muted">Loading destinations...</div>
          )}
          {!isLoading && visibleOptions.length === 0 && (
            <div className="ccp-dest-option muted">
              {query.trim()
                ? "Press Enter to add this destination"
                : "No destinations found"}
            </div>
          )}
          {!isLoading &&
            visibleOptions.map((option, index) => {
              const isCreate = canCreate && index === 0;
              const name = isCreate ? query.trim() : option;
              return (
                <div
                  key={`${option}-${index}`}
                  className={`ccp-dest-option ${
                    index === highlightIndex ? "active" : ""
                  }`}
                  onMouseEnter={() => setHighlightIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    addValue(name);
                  }}
                >
                  {option}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default DestinationCoveredSelect;
