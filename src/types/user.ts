interface User {
  id: string;
  email: string;
  fullName: string;
  nickname: string;
  phone: string;
  address: string;
  status: "PENDING" | "ACTIVE" | "BANNED";
  provider: "LOCAL" | "GOOGLE";
  providerId: string;
  avatarUrl: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
