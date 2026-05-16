export {};

declare global {
  interface ApiResponse<T> {
    status: number;
    httpStatus: string;
    message: string;
    timestamp: string;
    data: T;
  }

  interface PageResponse<T> {
    currentPage: number;
    totalElements: number;
    totalPages: number;
    pageSize: number;
    content: T[];
    last?: boolean;
  }
}
