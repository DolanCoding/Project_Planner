import React, { RefObject } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPanel } from "../../../store/UiSlice";
import {
  updateNodePosition,
  updateEdgeInProject,
  removeEdgeFromNode,
} from "../../../store/projectsSlice";
import { RootState } from "../../../store/store";
import ReactFlow,
{ Controls,
  Background,
  BackgroundVariant,
  NodeChange,
  Connection,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import CogNode from "./Nodes/CogNode/CogNode";
import NoteNode from "./Nodes/NoteNode/NoteNode";

const nodeTypes = {
  default: CogNode,
  note: NoteNode, // Add this line
};

interface FlowCanvasProps {
  selectedNodeId: string;
  containerRef: React.RefObject<HTMLDivElement>; // Add this line
}

export default function FlowCanvas({
  selectedNodeId,
  containerRef,
}: FlowCanvasProps) {
  const openProjectId = useSelector(
    (state: RootState) => state.projects.openProjectId
  );
  const projects = useSelector((state: RootState) => state.projects.projects);
  const nodes = projects.find((p) => p.id === openProjectId)?.nodes || [];
  const edges = projects.find((p) => p.id === openProjectId)?.edges || [];

  const dispatch = useDispatch();

  const openNodeId = useSelector((state: RootState) => state.ui.openNodeId);

  const nodesWithCog = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onCogClick: () =>
        dispatch(setPanel({ type: "nodeSettings", itemId: node.id })),
      isSelected: node.id === selectedNodeId,
      isActive: node.type === "note" && openNodeId === node.id, // <-- Add this line
    },
  }));

  const onNodesChange = (changes: NodeChange[]) => {
    changes.forEach((change) => {
      if (
        change.type === "position" &&
        change.position &&
        openProjectId !== null
      ) {
        dispatch(
          updateNodePosition({
            projectId: openProjectId,
            nodeId: change.id,
            position: change.position,
          })
        );
      }
    });
  };

  const onConnect = (connection: Connection) => {
    if (!openProjectId) return;
    // Create a new edge object
    const newEdge: Edge = {
      id: Date.now().toString(),
      source: connection.source!,
      target: connection.target!,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      type: "default",
    };
    // Dispatch an action to add the edge to the project
    dispatch({
      type: "projects/addEdgeToProject",
      payload: {
        projectId: openProjectId,
        edge: newEdge,
      },
    });
  };

  const onEdgeUpdate = (oldEdge: Edge, newConnection: Connection) => {
    if (!openProjectId) return;

    // If the new source or target is null, or the update is invalid, remove the edge
    if (!newConnection.source || !newConnection.target) {
      dispatch(
        removeEdgeFromNode({
          projectId: openProjectId,
          edgeId: oldEdge.id,
        })
      );
      return;
    }

    // If the update is valid, update the edge
    dispatch(
      updateEdgeInProject({
        projectId: openProjectId,
        edgeId: oldEdge.id,
        newSource: newConnection.source!,
        newTarget: newConnection.target!,
        newSourceHandle: newConnection.sourceHandle,
        newTargetHandle: newConnection.targetHandle,
      })
    );
  };

  const onEdgeUpdateEnd = (
    event: MouseEvent | TouchEvent,
    edge: Edge,
    handleType: "source" | "target"
  ) => {
    if (!openProjectId) return;
    dispatch(
      removeEdgeFromNode({
        projectId: openProjectId,
        edgeId: edge.id,
      })
    );
  };

  return (
    <div
      ref={containerRef}
      className="flowCanvasContainer"
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <ReactFlow
        nodes={nodesWithCog}
        edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        fitView
        onConnect={onConnect}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
      >
        <Controls />
        <Background
          variant={BackgroundVariant.Lines}
          gap={20}
          lineWidth={0.5}
          color="#ccc"
        />
      </ReactFlow>
    </div>
  );
}
