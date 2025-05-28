import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import {
  updateNodeLabel,
  updateNodeHandles,
  updateNodeColor,
  updateNodePosition,
  deleteNodeFromProject, // <-- Add this import at the top
  removeEdgeFromNode,
} from "../../../../store/projectsSlice";
import { closePanel } from "../../../../store/UiSlice"; // <-- Import your UI slice action
import "./NodeSettingsPanel.css";
import CustomSelect from "../../../common/CustomSelect/CustomSelect";

type NodeHandle = {
  id: string;
  type: string;
  position: string;
};

const handleTypes = [
  { value: "source", label: "Source" },
  { value: "target", label: "Target" },
];

const handlePositions = [
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
];

export default function NodeSettingsPanel() {
  const dispatch = useDispatch();
  const openProjectId = useSelector(
    (state: RootState) => state.projects.openProjectId
  );
  const nodeId = useSelector((state: RootState) => state.ui.openNodeId);
  const node = useSelector((state: RootState) =>
    state.projects.projects
      .find((p) => p.id === openProjectId)
      ?.nodes.find((n) => n.id === nodeId)
  );

  const [label, setLabel] = useState(node?.data?.label || "");
  const generateHandleId = () =>
    `h${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const [handles, setHandles] = useState(
    node?.data?.handles
      ? node.data.handles.map((h: any) => ({
          ...h,
          id: h.id || generateHandleId(),
        }))
      : [
          { id: generateHandleId(), type: "target", position: "top" },
          { id: generateHandleId(), type: "source", position: "bottom" },
        ]
  );

  // Add state for width and height
  const [width, setWidth] = useState(node?.data?.width || 300);
  const [height, setHeight] = useState(node?.data?.height || 150);

  // Calculate handle counts for each side
  const topHandles = handles.filter(
    (h: NodeHandle) => h.position === "top"
  ).length;
  const bottomHandles = handles.filter(
    (h: NodeHandle) => h.position === "bottom"
  ).length;
  const leftHandles = handles.filter(
    (h: NodeHandle) => h.position === "left"
  ).length;
  const rightHandles = handles.filter(
    (h: NodeHandle) => h.position === "right"
  ).length;

  // Minimum size per handle (adjust as needed)
  const minHandleSpacing = 40;

  // Dynamic min width/height based on handle count
  const minWidth = Math.max(
    100,
    Math.max(topHandles, bottomHandles) * minHandleSpacing
  );
  const minHeight = Math.max(
    60,
    Math.max(leftHandles, rightHandles) * minHandleSpacing
  );

  // Calculate max border radius for a circle (now half as large as before)
  const maxBorderRadius = Math.floor(
    Math.min(Number(width) || 0, Number(height) || 0) / 8
  );

  // Add state for border radius at the top with other states:
  const [borderRadius, setBorderRadius] = useState(
    typeof node?.data?.borderRadius === "number" ? node.data.borderRadius : 7 // <-- default to 7, not 12
  );

  // Add this effect to update local state when node changes
  useEffect(() => {
    setLabel(node?.data?.label || "");
    setHandles(
      node?.data?.handles
        ? node.data.handles.map((h: any) => ({
            ...h,
            id: h.id || generateHandleId(),
          }))
        : [
            { id: generateHandleId(), type: "target", position: "top" },
            { id: generateHandleId(), type: "source", position: "bottom" },
          ]
    );
    setWidth(node?.data?.width || 300);
    setHeight(node?.data?.height || 150);
    setBorderRadius(
      typeof node?.data?.borderRadius === "number" ? node.data.borderRadius : 7 // <-- default to 7, not 12
    );
  }, [nodeId, node]);

  useEffect(() => {
    // Always recalculate minWidth/minHeight based on the latest handles
    const topHandles = handles.filter(
      (h: NodeHandle) => h.position === "top"
    ).length;
    const bottomHandles = handles.filter(
      (h: NodeHandle) => h.position === "bottom"
    ).length;
    const leftHandles = handles.filter(
      (h: NodeHandle) => h.position === "left"
    ).length;
    const rightHandles = handles.filter(
      (h: NodeHandle) => h.position === "right"
    ).length;

    const minHandleSpacing = 40;
    const newMinWidth = Math.max(
      100,
      Math.max(topHandles, bottomHandles) * minHandleSpacing
    );
    const newMinHeight = Math.max(
      60,
      Math.max(leftHandles, rightHandles) * minHandleSpacing
    );

    let changed = false;
    let newWidth = width;
    let newHeight = height;

    // Use the new minWidth for all checks
    if (width < newMinWidth) {
      newWidth = newMinWidth;
      setWidth(newMinWidth);
      changed = true;
    }
    if (height < newMinHeight) {
      newHeight = newMinHeight;
      setHeight(newMinHeight);
      changed = true;
    }

    if (changed && openProjectId && nodeId) {
      dispatch(
        updateNodeLabel({
          projectId: openProjectId,
          nodeId: nodeId as string,
          label,
          width: newWidth,
          height: newHeight,
        })
      );
      triggerNodeResize && triggerNodeResize();
    }
  }, [handles]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
    if (!openProjectId || !nodeId) return;
    dispatch(
      updateNodeLabel({
        projectId: openProjectId,
        nodeId: nodeId as string,
        label: e.target.value,
      })
    );
  };
  const projects = useSelector((state: RootState) => state.projects.projects);

  const handleHandleChange = (idx: number, field: string, value: string) => {
    const newHandles = handles.map((h: NodeHandle, i: number) =>
      i === idx ? { ...h, [field]: value } : h
    );

    setHandles(newHandles);

    // Only remove edges if the handle they reference no longer exists
    if (openProjectId && nodeId) {
      const project = projects.find((p) => p.id === openProjectId);
      if (project) {
        const validHandleIds: string[] = newHandles.map(
          (h: NodeHandle) => h.id
        );
        const invalidEdges = project.edges.filter(
          (edge) =>
            (edge.target === nodeId &&
              edge.targetHandle &&
              !validHandleIds.includes(edge.targetHandle)) ||
            (edge.source === nodeId &&
              edge.sourceHandle &&
              !validHandleIds.includes(edge.sourceHandle))
        );
        invalidEdges.forEach((edge) => {
          dispatch(
            removeEdgeFromNode({
              projectId: openProjectId,
              edgeId: edge.id,
            })
          );
        });
      }
    }

    if (openProjectId && nodeId) {
      dispatch(
        updateNodeHandles({
          projectId: openProjectId,
          nodeId: nodeId as string,
          handles: newHandles,
        })
      );
    }
  };
  const addHandle = () => {
    const newHandle = {
      id: `h${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type: "target",
      position: "top",
    };
    const newHandles = [...handles, newHandle];
    setHandles(newHandles);
    if (!openProjectId) return;
    dispatch(
      updateNodeHandles({
        projectId: openProjectId,
        nodeId: nodeId as string,
        handles: newHandles,
      })
    );
  };
  const removeHandle = (idx: number) => {
    const newHandles: NodeHandle[] = handles.filter(
      (_: NodeHandle, i: number) => i !== idx
    );

    // Calculate new handle counts for minWidth/minHeight
    const topHandlesNew = newHandles.filter(
      (h: NodeHandle) => h.position === "top"
    ).length;
    const bottomHandlesNew = newHandles.filter(
      (h: NodeHandle) => h.position === "bottom"
    ).length;
    const leftHandlesNew = newHandles.filter(
      (h: NodeHandle) => h.position === "left"
    ).length;
    const rightHandlesNew = newHandles.filter(
      (h: NodeHandle) => h.position === "right"
    ).length;

    const minHandleSpacing = 40;
    const newMinWidth = Math.max(
      100,
      Math.max(topHandlesNew, bottomHandlesNew) * minHandleSpacing
    );
    const newMinHeight = Math.max(
      60,
      Math.max(leftHandlesNew, rightHandlesNew) * minHandleSpacing
    );

    // Calculate previous minWidth/minHeight
    const prevTopHandles = handles.filter(
      (h: NodeHandle) => h.position === "top"
    ).length;
    const prevBottomHandles = handles.filter(
      (h: NodeHandle) => h.position === "bottom"
    ).length;
    const prevLeftHandles = handles.filter(
      (h: NodeHandle) => h.position === "left"
    ).length;
    const prevRightHandles = handles.filter(
      (h: NodeHandle) => h.position === "right"
    ).length;
    const prevMinWidth = Math.max(
      100,
      Math.max(prevTopHandles, prevBottomHandles) * minHandleSpacing
    );
    const prevMinHeight = Math.max(
      60,
      Math.max(prevLeftHandles, prevRightHandles) * minHandleSpacing
    );

    let changed = false;
    let newWidth = width;
    let newHeight = height;

    // If width was at previous min and min changes, update width to new min
    if (width === prevMinWidth && width !== newMinWidth) {
      newWidth = newMinWidth;
      setWidth(newMinWidth);
      changed = true;
    }
    // If height was at previous min and min changes, update height to new min
    if (height === prevMinHeight && height !== newMinHeight) {
      newHeight = newMinHeight;
      setHeight(newMinHeight);
      changed = true;
    }

    setHandles(newHandles);
    if (!openProjectId || !nodeId) return;
    dispatch(
      updateNodeHandles({
        projectId: openProjectId,
        nodeId,
        handles: newHandles,
      })
    );
    if (changed) {
      dispatch(
        updateNodeLabel({
          projectId: openProjectId,
          nodeId: nodeId as string,
          label,
          width: newWidth,
          height: newHeight,
        })
      );
      triggerNodeResize();
    }
  };

  // Helper to trigger a resize event by dispatching updateNodePosition
  const triggerNodeResize = () => {
    if (!openProjectId || !nodeId || !node?.position) return;
    dispatch(
      updateNodePosition({
        projectId: openProjectId,
        nodeId: nodeId as string,
        position: { ...node.position }, // re-dispatch current position to trigger a re-render/resize
      })
    );
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number(e.target.value);
    setWidth(newWidth);

    // If borderRadius is greater than new max, or you want to always set to max
    const newMaxBorderRadius = Math.floor(
      Math.min(newWidth || 0, height || 0) / 8
    );
    setBorderRadius(newMaxBorderRadius);

    if (!openProjectId || !nodeId) return;
    dispatch(
      updateNodeLabel({
        projectId: openProjectId,
        nodeId: nodeId as string,
        label, // keep label unchanged
        width: newWidth,
        height,
        borderRadius: newMaxBorderRadius,
      })
    );
    triggerNodeResize();
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number(e.target.value);
    setHeight(newHeight);

    const newMaxBorderRadius = Math.floor(
      Math.min(width || 0, newHeight || 0) / 8
    );
    setBorderRadius(newMaxBorderRadius);

    if (!openProjectId || !nodeId) return;
    dispatch(
      updateNodeLabel({
        projectId: openProjectId,
        nodeId: nodeId as string,
        label, // keep label unchanged
        width,
        height: newHeight,
        borderRadius: newMaxBorderRadius,
      })
    );
    triggerNodeResize();
  };

  // Handler for border radius
  const handleBorderRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = Number(e.target.value);
    setBorderRadius(newRadius);
    if (!openProjectId || !nodeId) return;
    dispatch(
      updateNodeLabel({
        projectId: openProjectId,
        nodeId: nodeId as string,
        label,
        width,
        height,
        borderRadius: newRadius,
      })
    );
    triggerNodeResize();
  };

  const handleDeleteNode = () => {
    if (!openProjectId || !nodeId) return;
    dispatch(
      deleteNodeFromProject({
        projectId: openProjectId,
        nodeId: nodeId as string,
      })
    );
    dispatch(closePanel());
  };

  if (!node) return <div className="node-settings-panel">Node not found.</div>;

  return (
    <>
      <div className="node-settings-panel">
        <h2>Node Settings</h2>
        <div className="settings-section label-input-row">
          <label htmlFor="node-label">Label</label>
          <input
            id="node-label"
            type="text"
            value={label}
            onChange={handleLabelChange}
          />
        </div>
        <div className="settings-section color-picker-section">
          <label className="color-picker-label" htmlFor="node-color">
            Node Color
          </label>
          <input
            id="node-color"
            className="node-color-input"
            type="color"
            value={node?.data?.color || "#505050"}
            onChange={(e) => {
              dispatch(
                updateNodeColor({
                  projectId: openProjectId as string,
                  nodeId: nodeId as string,
                  color: e.target.value,
                })
              );
            }}
          />
        </div>

        {/* --- Add width and height range inputs --- */}
        <div className="settings-section">
          <label htmlFor="node-width">Width</label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <input
              id="node-width"
              type="range"
              min={minWidth}
              max={window.innerWidth * 0.3}
              value={width}
              onChange={handleWidthChange}
              className="node-range node-range-width"
            />
            <input
              type="number"
              min={minWidth}
              max={Math.floor(window.innerWidth * 0.3)}
              value={width}
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={(e) => {
                // Allow any value while editing
                let val = e.target.value === "" ? "" : Number(e.target.value);
                setWidth(val === "" ? "" : val);
              }}
              onBlur={(e) => {
                let val = Number(e.target.value);
                if (isNaN(val) || val < minWidth) val = minWidth;
                if (val > Math.floor(window.innerWidth * 0.3))
                  val = Math.floor(window.innerWidth * 0.3);
                setWidth(val);
                if (!openProjectId || !nodeId) return;
                dispatch(
                  updateNodeLabel({
                    projectId: openProjectId,
                    nodeId: nodeId as string,
                    label,
                    width: val,
                    height,
                  })
                );
                triggerNodeResize();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  let val = Number((e.target as HTMLInputElement).value);
                  if (isNaN(val) || val < minWidth) val = minWidth;
                  if (val > Math.floor(window.innerWidth * 0.3))
                    val = Math.floor(window.innerWidth * 0.3);
                  setWidth(val);
                  if (!openProjectId || !nodeId) return;
                  dispatch(
                    updateNodeLabel({
                      projectId: openProjectId,
                      nodeId: nodeId as string,
                      label,
                      width: val,
                      height,
                    })
                  );
                  triggerNodeResize();
                }
              }}
              className="node-range-input node-range-width-input"
              style={{ width: "5.5rem" }}
            />
          </div>
          <span>
            min {minWidth}px, {width}px (max{" "}
            {Math.floor(window.innerWidth * 0.3)}px)
          </span>
        </div>
        <div className="settings-section">
          <label htmlFor="node-height">Height</label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <input
              id="node-height"
              type="range"
              min={minHeight}
              max={window.innerHeight * 0.5}
              value={height}
              onChange={handleHeightChange}
              className="node-range node-range-height"
            />
            <input
              type="number"
              min={minHeight}
              max={Math.floor(window.innerHeight * 0.5)}
              value={height}
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={(e) => {
                let val = e.target.value === "" ? "" : Number(e.target.value);
                setHeight(val === "" ? "" : val);
              }}
              onBlur={(e) => {
                let val = Number(e.target.value);
                if (isNaN(val) || val < minHeight) val = minHeight;
                if (val > Math.floor(window.innerHeight * 0.5))
                  val = Math.floor(window.innerHeight * 0.5);
                setHeight(val);
                if (!openProjectId || !nodeId) return;
                dispatch(
                  updateNodeLabel({
                    projectId: openProjectId,
                    nodeId: nodeId as string,
                    label,
                    width,
                    height: val,
                  })
                );
                triggerNodeResize();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  let val = Number((e.target as HTMLInputElement).value);
                  if (isNaN(val) || val < minHeight) val = minHeight;
                  if (val > Math.floor(window.innerHeight * 0.5))
                    val = Math.floor(window.innerHeight * 0.5);
                  setHeight(val);
                  if (!openProjectId || !nodeId) return;
                  dispatch(
                    updateNodeLabel({
                      projectId: openProjectId,
                      nodeId: nodeId as string,
                      label,
                      width,
                      height: val,
                    })
                  );
                  triggerNodeResize();
                }
              }}
              className="node-range-input node-range-height-input"
              style={{ width: "5.5rem" }}
            />
          </div>
          <span>
            min {minHeight}px, {height}px (max{" "}
            {Math.floor(window.innerHeight * 0.5)}px)
          </span>
        </div>
        {/* --- End width/height --- */}

        {/* --- Add border radius range input --- */}
        <div className="settings-section">
          <label htmlFor="node-border-radius">Border Radius</label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <input
              id="node-border-radius"
              type="range"
              min={0}
              max={maxBorderRadius}
              value={borderRadius}
              onChange={handleBorderRadiusChange}
              className="node-range node-range-radius"
            />
            <input
              type="number"
              min={0}
              max={maxBorderRadius}
              value={borderRadius}
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={(e) => {
                let val = e.target.value === "" ? "" : Number(e.target.value);
                setBorderRadius(val === "" ? "" : val);
              }}
              onBlur={(e) => {
                let val = Number(e.target.value);
                if (isNaN(val) || val < 0) val = 0;
                if (val > maxBorderRadius) val = maxBorderRadius;
                setBorderRadius(val);
                if (!openProjectId || !nodeId) return;
                dispatch(
                  updateNodeLabel({
                    projectId: openProjectId,
                    nodeId: nodeId as string,
                    label,
                    width,
                    height,
                    borderRadius: val,
                  })
                );
                triggerNodeResize();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  let val = Number((e.target as HTMLInputElement).value);
                  if (isNaN(val) || val < 0) val = 0;
                  if (val > maxBorderRadius) val = maxBorderRadius;
                  setBorderRadius(val);
                  if (!openProjectId || !nodeId) return;
                  dispatch(
                    updateNodeLabel({
                      projectId: openProjectId,
                      nodeId: nodeId as string,
                      label,
                      width,
                      height,
                      borderRadius: val,
                    })
                  );
                  triggerNodeResize();
                }
              }}
              className="node-range-input node-range-radius-input"
              style={{ width: "5.5rem" }}
            />
          </div>
          <span>
            min 0px, {borderRadius}px (max {maxBorderRadius}px)
          </span>
        </div>
        {/* --- End border radius --- */}

        <table className="handles-table">
          <thead className="handles-table-head">
            <tr>
              <th className="handles-table-th-type">Type</th>
              <th className="handles-table-th-position">Position</th>
              <th className="handles-table-th-action">Delete</th>
            </tr>
          </thead>
          <tbody className="handles-table-body">
            {handles.map((handle: NodeHandle, idx: number) => (
              <tr key={idx} className="handles-table-row">
                <td className="handles-table-td-type">
                  <CustomSelect
                    className="handles-table-select-type"
                    value={handle.type}
                    options={handleTypes}
                    onChange={(val) => handleHandleChange(idx, "type", val)}
                  />
                </td>
                <td className="handles-table-td-position">
                  <CustomSelect
                    className="handles-table-select-position"
                    value={handle.position}
                    options={handlePositions}
                    onChange={(val) => handleHandleChange(idx, "position", val)}
                  />
                </td>
                <td className="handles-table-td-action">
                  <button
                    className="handles-table-remove-btn"
                    onClick={(): void => removeHandle(idx)}
                    title="Remove Handle"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addHandle} className="add-handle-btn">
          + Add Handle
        </button>
        <div className="panel-button-group">
          <button
            className="close-panel-btn bottom"
            onClick={() => dispatch(closePanel())}
          >
            Close
          </button>
          <button className="delete-node-btn" onClick={handleDeleteNode}>
            Delete Node
          </button>
        </div>
      </div>
    </>
  );
}
