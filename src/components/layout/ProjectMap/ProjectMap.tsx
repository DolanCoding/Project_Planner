import FlowCanvas from "@flow/components/FlowCanvas";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Node, useReactFlow } from "reactflow";
import { RootState } from "../../../store/store";
import { addNodeToProject } from "../../../store/projectsSlice";
import "./ProjectMap.css";

export default function ProjectMap() {
  const isLeftSidebarOpen = useSelector(
    (state: RootState) => state.ui.isLeftSidebarOpen
  );
  const isRightSidebarOpen = useSelector(
    (state: RootState) => state.ui.isRightSidebarOpen
  );
  const openProjectId = useSelector(
    (state: RootState) => state.projects.openProjectId
  );
  const openNodeId = useSelector((state: RootState) => state.ui.openNodeId);

  const dispatch = useDispatch();
  const reactFlowInstance = useReactFlow();
  const containerRef = useRef<HTMLDivElement>(null!); // <-- Add this line

  const getCenterPosition = () => {
    const { x, y, zoom } = reactFlowInstance.getViewport();
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    const rect = container.getBoundingClientRect();
    // Center of the visible area in screen coordinates
    const centerScreen = {
      x: rect.width / 2,
      y: rect.height / 2,
    };
    // Convert to flow coordinates
    return reactFlowInstance.project(centerScreen);
  };

  const handleAddNode = () => {
    if (openProjectId === null) return;
    const position = getCenterPosition();
    const newNode: Node = {
      id: `${Date.now().toString()}`,
      type: "default",
      position,
      data: { label: "New Node" },
    };
    dispatch(addNodeToProject({ projectId: openProjectId, node: newNode }));
  };

  const handleAddNote = () => {
    if (openProjectId === null) return;
    const position = getCenterPosition();
    const newNode: Node = {
      id: `${Date.now().toString()}`,
      type: "note",
      position,
      width: 180, // <-- set default width here
      height: 80, // <-- set default height here
      data: { note: "" },
    };
    dispatch(addNodeToProject({ projectId: openProjectId, node: newNode }));
  };

  const getSidebarClass = () => {
    console.log("isLeftSidebarOpen:", isLeftSidebarOpen);
    console.log("isRightSidebarOpen:", isRightSidebarOpen);

    if (isLeftSidebarOpen && isRightSidebarOpen) return "bothSidebarOpen";
    if (isLeftSidebarOpen) return "leftSidebarOpen";
    if (isRightSidebarOpen) return "rightSidebarOpen";
    return "";
  };

  return (
    <div className={`projectMapContainer ${getSidebarClass()}`}>
      <FlowCanvas
        containerRef={containerRef}
        selectedNodeId={openNodeId ?? ""}
      />
      <div className="projectMapButtons">
        <button onClick={handleAddNode}>Add Node</button>
        <button onClick={handleAddNote}>Add Note</button>
      </div>
    </div>
  );
}
