import { MemberStatus, Role } from "./enum";
import { Project } from "./project";

export interface ProjectMember {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  nickname: string;
  avatarUrl: string;
  role: Role;
  status: MemberStatus;
  projectId: string;
  createdAt: string;
}
