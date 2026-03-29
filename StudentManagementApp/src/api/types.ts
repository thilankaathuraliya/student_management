export type PagedResult<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type LoginResponse = {
  token: string;
  expiresInSeconds: number;
};

export type SubjectDto = { id: string; name: string };
export type TeacherDto = { id: string; name: string };
export type StudentDto = {
  id: string;
  name: string;
  subjectName: string;
  teacherName: string;
};
