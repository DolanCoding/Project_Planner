import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import "./CogNode.css";
import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

type CogNodeHandle = {
  id?: string;
  type: "source" | "target";
  position: "top" | "bottom" | "left" | "right";
};

const positionMap: Record<string, Position> = {
  top: Position.Top,
  bottom: Position.Bottom,
  left: Position.Left,
  right: Position.Right,
};

export default function CogNode({ data }: NodeProps) {
  const handles = Array.isArray(data.handles) ? data.handles : [];

  // Use i18n hook to get the current language
  const { i18n } = useTranslation();
  const userLang = i18n.language;

  // Group handles by side for spreading
  const sides = ["top", "bottom", "left", "right"] as const;
  const handlesBySide: Record<string, any[]> = {
    top: [],
    bottom: [],
    left: [],
    right: [],
  };

  handles.forEach((h: CogNodeHandle) => {
    if (sides.includes(h.position)) handlesBySide[h.position].push(h);
  });

  // Calculate minWidth based on the maximum number of handles on top or bottom
  const minHandleSpacing = 40;
  const minWidth = Math.max(
    100,
    Math.max(handlesBySide.top.length, handlesBySide.bottom.length) *
      (minHandleSpacing / 2)
  );
  // Calculate minHeight based on the maximum number of handles on left or right
  const minHeight = Math.max(
    60,
    Math.max(handlesBySide.left.length, handlesBySide.right.length) *
      minHandleSpacing
  );

  return (
    <div
      className={`cog-node${data.isSelected ? " selected" : ""}`}
      style={{
        backgroundColor: data.color || "#505050",
        position: "relative",
        width: data.width ? `${data.width}px` : `100px`,
        height: data.height ? `${data.height}px` : `60px`,
        minWidth: minWidth,
        minHeight: minHeight,
        borderRadius:
          typeof data.borderRadius === "number"
            ? `${data.borderRadius}px`
            : data.borderRadius ?? "12px",
        transition: "width 0.15s, height 0.15s, border-radius 0.15s",
      }}
    >
      <span className="cog-node-label" lang={userLang}>
        {data.label}
      </span>
      <button onClick={data.onCogClick} title="Settings">
        <Settings className="cog-icon" size="0.75rem" />
      </button>
      {/* Render handles grouped and spread by their current side */}
      {sides.map((side) =>
        handlesBySide[side].map((handle, idx, arr) => {
          const spread = 60;
          const start = (100 - spread) / 2;
          const percent =
            arr.length === 1 ? 50 : start + (idx * spread) / (arr.length - 1);

          let style: React.CSSProperties = {};
          if (side === "top" || side === "bottom") {
            style = { left: `${percent}%`, transform: "translateX(-50%)" };
          } else {
            style = { top: `${percent}%`, transform: "translateY(-50%)" };
          }

          return (
            <Handle
              key={handle.id || side + idx}
              type={handle.type}
              position={positionMap[side]}
              id={handle.id}
              style={style}
            />
          );
        })
      )}
    </div>
  );
}
