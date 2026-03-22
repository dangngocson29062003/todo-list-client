import { Role } from "./enum";
import { Project } from "./project";

export interface ProjectMember {
  id: string;
  name: string;
  role: Role;
  user: User;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}
