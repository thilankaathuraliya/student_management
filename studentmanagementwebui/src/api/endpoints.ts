import { apiFetch, getErrorMessage, readJson } from './client'
import type {
  LoginResponse,
  PagedResult,
  StudentDto,
  SubjectDto,
  TeacherDto,
} from './types'

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const res = await apiFetch('/api/auth/login', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    throw new Error(await getErrorMessage(res))
  }
  return readJson<LoginResponse>(res)
}

export async function getStudentsPaged(
  page: number,
  pageSize: number,
): Promise<PagedResult<StudentDto>> {
  const q = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  })
  const res = await apiFetch(`/api/students?${q}`)
  if (!res.ok) throw new Error(await getErrorMessage(res))
  return readJson<PagedResult<StudentDto>>(res)
}

export async function createStudent(body: {
  name: string
  subjectName: string
  teacherName: string
}): Promise<StudentDto> {
  const res = await apiFetch('/api/students', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await getErrorMessage(res))
  return readJson<StudentDto>(res)
}

export async function getSubjectsPaged(
  page: number,
  pageSize: number,
): Promise<PagedResult<SubjectDto>> {
  const q = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  })
  const res = await apiFetch(`/api/subjects?${q}`)
  if (!res.ok) throw new Error(await getErrorMessage(res))
  return readJson<PagedResult<SubjectDto>>(res)
}

export async function createSubject(name: string): Promise<SubjectDto> {
  const res = await apiFetch('/api/subjects', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
  if (!res.ok) throw new Error(await getErrorMessage(res))
  return readJson<SubjectDto>(res)
}

export async function getTeachersPaged(
  page: number,
  pageSize: number,
): Promise<PagedResult<TeacherDto>> {
  const q = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  })
  const res = await apiFetch(`/api/teachers?${q}`)
  if (!res.ok) throw new Error(await getErrorMessage(res))
  return readJson<PagedResult<TeacherDto>>(res)
}

const DROPDOWN_PAGE_SIZE = 100

/** Loads every subject page for pickers (sorted by name). */
export async function getAllSubjects(): Promise<SubjectDto[]> {
  const all: SubjectDto[] = []
  let page = 1
  let totalPages = 1
  while (page <= totalPages) {
    const res = await getSubjectsPaged(page, DROPDOWN_PAGE_SIZE)
    all.push(...res.items)
    totalPages = res.totalPages
    page += 1
  }
  all.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
  )
  return all
}

/** Loads every teacher page for pickers (sorted by name). */
export async function getAllTeachers(): Promise<TeacherDto[]> {
  const all: TeacherDto[] = []
  let page = 1
  let totalPages = 1
  while (page <= totalPages) {
    const res = await getTeachersPaged(page, DROPDOWN_PAGE_SIZE)
    all.push(...res.items)
    totalPages = res.totalPages
    page += 1
  }
  all.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
  )
  return all
}

export async function createTeacher(name: string): Promise<TeacherDto> {
  const res = await apiFetch('/api/teachers', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
  if (!res.ok) throw new Error(await getErrorMessage(res))
  return readJson<TeacherDto>(res)
}