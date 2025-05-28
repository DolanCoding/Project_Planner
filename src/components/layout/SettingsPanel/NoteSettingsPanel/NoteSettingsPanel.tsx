import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import {
  updateNodeLabel,
  deleteNodeFromProject,
} from "../../../../store/projectsSlice";
import { closePanel } from "../../../../store/UiSlice";
import "./NoteSettingsPanel.css";

export default function NoteSettingsPanel() {
  const dispatch = useDispatch();
  const openProjectId = useSelector(
    (state: RootState) => state.projects.openProjectId
  );
  const noteId = useSelector((state: RootState) => state.ui.openNodeId);
  const note = useSelector((state: RootState) =>
    state.projects.projects
      .find((p) => p.id === openProjectId)
      ?.nodes.find((n) => n.id === noteId)
  );

  const [noteText, setNoteText] = useState(note?.data?.note || "");
  const [width, setWidth] = useState<number>(note?.width || 180);
  const [height, setHeight] = useState<number>(note?.height || 80);

  // Add this effect to update local state when noteId or note changes
  useEffect(() => {
    setNoteText(note?.data?.note || "");
    setWidth(note?.width || 180);
    setHeight(note?.height || 80);
  }, [noteId, note]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteText(e.target.value);
    if (!openProjectId || !noteId) return;
    dispatch(
      updateNodeLabel({
        projectId: openProjectId,
        nodeId: noteId,
        label: "",
        note: e.target.value,
        width,
        height,
      })
    );
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number(e.target.value);
    setWidth(newWidth);
    if (!openProjectId || !noteId) return;
    dispatch(
      updateNodeLabel({
        projectId: openProjectId,
        nodeId: noteId,
        label: "",
        note: noteText,
        width: newWidth,
        height,
      })
    );
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number(e.target.value);
    setHeight(newHeight);
    if (!openProjectId || !noteId) return;
    dispatch(
      updateNodeLabel({
        projectId: openProjectId,
        nodeId: noteId,
        label: "",
        note: noteText,
        width,
        height: newHeight,
      })
    );
  };

  const handleDelete = () => {
    if (!openProjectId || !noteId) return;
    dispatch(
      deleteNodeFromProject({ projectId: openProjectId, nodeId: noteId })
    );
    dispatch(closePanel());
  };

  if (!note) return <div className="note-settings-panel">Note not found.</div>;

  return (
    <div className="note-settings-panel">
      <h2>Note Settings</h2>
      <div className="settings-section">
        <label htmlFor="note-text">Note</label>
        <textarea
          id="note-text"
          value={noteText}
          onChange={handleNoteChange}
          rows={5}
          style={{ width: "100%" }}
        />
      </div>
      <div className="settings-section">
        <label htmlFor="note-width">Width: {width}px</label>
        <input
          id="note-width"
          type="range"
          min={80}
          max={400}
          value={width}
          onChange={handleWidthChange}
        />
      </div>
      <div className="settings-section">
        <label htmlFor="note-height">Height: {height}px</label>
        <input
          id="note-height"
          type="range"
          min={40}
          max={300}
          value={height}
          onChange={handleHeightChange}
        />
      </div>
      <div className="panel-button-group">
        <button className="delete-node-btn" onClick={handleDelete}>
          Delete Note
        </button>
        <button
          className="close-panel-btn"
          onClick={() => dispatch(closePanel())}
        >
          Close
        </button>
      </div>
    </div>
  );
}
