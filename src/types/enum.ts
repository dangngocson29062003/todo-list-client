export enum Role {
  MANAGER,
  CONTRIBUTOR,
  VIEWER,
}
export enum TaskStatus {
  TODO,
  IN_PROGRESS,
  REVIEW,
  DONE,
}
export enum Priority {
  LOW,
  NORMAL,
  HIGH,
  URGENT,
}
export enum Stage {
  PLANNING,
  DESIGN,
  DEVELOPMENT,
  TESTING,
  DEPLOYMENT,
  MAINTENANCE,
  COMPLETED,
  ON_HOLD,
  CANCELLED,
}
export enum TechStack {
  // Frontend
  NEXTJS,
  REACT,
  TYPESCRIPT,
  TAILWIND_CSS,
  SHADCN_UI,
  REDUX,
  ZUSTAND,

  // Backend
  SPRING_BOOT,
  NODEJS,
  EXPRESS,
  NESTJS,
  JAVA,

  // Database & ORM
  POSTGRESQL,
  MONGODB,
  MYSQL,
  PRISMA,
  REDIS,

  // DevOps & Tools
  DOCKER,
  AWS,
  VERCEL,
  GIT,
}
