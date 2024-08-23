export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  credits: number;
  grade: number;
  gpa: number;
}

export interface Course {
  id: string;
  subject: string;
  course_code: string;
  term: number;
  credits: number;
  grade: number | null;
  graded: boolean;
}

export interface Term {
  name: string;
  gpa: number;
  credits: number;
  courses: { [key: string]: Course };
}

export interface Terms {
  [key: string]: Term;
}

export interface FilteredCourses {
  [key: string]: Course | { [key: string]: Course };
}

export interface DashboardContextType {
  user: User | null;
  terms: Terms;
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
  updateTokens: (
    accessToken: string,
    refreshToken: string,
    userId: string
  ) => void;
  clearTokens: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  requestOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  clearError: () => void;
  resetPassword: (newPassword: string) => Promise<void>;
}
