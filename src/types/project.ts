import { Priority } from "./enum";
import { ProjectMember } from "./project-member";

export interface Project {
  id: string;
  createdBy: User;
  name: string;
  description?: string;
  tags?: string[];
  stage: string;
  priority: Priority;
  startDate?: Date;
  endDate?: Date;
  goals?: string[];
  techStack: string[];
  githubUrl?: string;
  figmaUrl?: string;
  members: ProjectMember[];
  memberCount: number;
  taskCount: number;
  doneTaskCount: number;
}
