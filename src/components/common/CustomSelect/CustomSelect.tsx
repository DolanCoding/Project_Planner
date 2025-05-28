import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import "./CustomSelect.css";
import { Option, CustomSelectProps } from "../../../types/ui";

export default function CustomSelect({
  value,
  options,
  onChange,
  className = "",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setDropdownStyle({
        position: "absolute",
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 10000,
      });
    }
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <>
      <div
        className={`custom-select ${className} ${open ? "open" : ""}`}
        ref={ref}
      >
        <div
          className="custom-select-selected"
          onClick={() => setOpen((o) => !o)}
        >
          {selected?.label}
          <span className="custom-select-arrow">{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open &&
        dropdownStyle.width &&
        ReactDOM.createPortal(
          <div className="custom-select-options" style={dropdownStyle}>
            {options.map((option) => (
              <div
                key={option.value}
                className={`custom-select-option${
                  option.value === value ? " selected" : ""
                }`}
                onMouseDown={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
