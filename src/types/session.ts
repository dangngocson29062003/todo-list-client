interface Session {
  id: string;
  os: string;
  browser: string;
  deviceType: string;
  ipAddress: string;
  lastActive: Date;
  isTrusted: boolean;
  isCurrent: boolean;
  isExpired: boolean;
}
