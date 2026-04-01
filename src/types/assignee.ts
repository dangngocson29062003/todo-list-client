import { MemberStatus, Role } from "./enum";
import { Project } from "./project";

export interface Assignee {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  nickname: string;
  avatarUrl: string;
  assignedAt: Date;
  assignedBy: string;
}
