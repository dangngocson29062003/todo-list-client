interface User {
  id: string;
  email: string;
  fullName: string;
  nickname: string;
  phone: string;
  address: string;
  twoFaEnabled: boolean;
  credentialStatus: "PASSWORD_SET" | "NO_PASSWORD";
  status: "PENDING" | "ACTIVE" | "BANNED";
  provider: "LOCAL" | "GOOGLE";
  providerId: string;
  avatarUrl: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
