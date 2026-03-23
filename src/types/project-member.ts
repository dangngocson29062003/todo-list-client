import { Role } from "./enum";
import { Project } from "./project";

export interface ProjectMember {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  nickname: string;
  avatarUrl: string;
  role: Role;
  projectId: string;
  createdAt: string;
}
