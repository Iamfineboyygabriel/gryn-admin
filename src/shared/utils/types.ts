export interface User {
    role: string;
    page: Array<{
      id: number;
      feature: string;
      pages: string[];
    }>;
  }
  