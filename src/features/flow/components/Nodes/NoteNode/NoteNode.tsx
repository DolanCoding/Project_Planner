import React, { useRef } from "react";
import { NodeProps } from "reactflow";
import "./NoteNode.css";
import { Settings } from "lucide-react";
import { useDispatch } from "react-redux";
import { setPanel } from "../../../../../store/UiSlice";

export default function NoteNode({
  data,
  id,
}: NodeProps & { isActive?: boolean }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (data.onChange) {
      data.onChange(id, e.target.value);
    }
  };

  // Prevent node drag when interacting with textarea or resizing
  const handleMouseDown = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const el = textareaRef.current;
    if (!el) return;
    const { right, bottom } = el.getBoundingClientRect();
    // 20px is a safe area for the resize handle
    if (e.clientX > right - 20 && e.clientY > bottom - 20) {
      // Click is on the resize handle, allow resizing (do NOT stopPropagation)
      return;
    }
    // Otherwise, prevent node drag when interacting with textarea
    e.stopPropagation();
  };

  const handleSettingsClick = () => {
    dispatch(setPanel({ type: "noteSettings", itemId: id }));
  };

  const isActive = data.isActive;

  return (
    <div
      className={`note-node${isActive ? " note-node--active" : ""}`}
      style={{
        width: data.width ? `${data.width}px` : undefined,
        height: data.height ? `${data.height}px` : undefined,
      }}
    >
      <textarea
        ref={textareaRef}
        className="note-node-input"
        value={data.note || ""}
        onChange={handleChange}
        placeholder="Add note..."
        rows={3}
        onMouseDown={handleMouseDown}
        readOnly
      />
      <button onClick={handleSettingsClick} title="Settings">
        <Settings className="cog-icon" size="0.75rem" />
      </button>
    </div>
  );
}
