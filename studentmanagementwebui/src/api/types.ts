export interface LoginResponse {
  token: string
  expiresInSeconds: number
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface StudentDto {
  id: string
  name: string
  subjectName: string
  teacherName: string
}

export interface SubjectDto {
  id: string
  name: string
}

export interface TeacherDto {
  id: string
  name: string
}
