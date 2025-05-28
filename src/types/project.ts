import { Node, Edge } from "reactflow";
export interface Project {
  id: string;
  name: string;
  createdAt: string;
  goal: string;
  description: string;
  nodes: Node[]; // Add nodes array
  edges: Edge[]; // Add edges array
}
