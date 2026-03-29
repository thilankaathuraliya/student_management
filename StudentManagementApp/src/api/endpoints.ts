import { apiFetch, parseJson } from "./client";
import type {
  LoginResponse,
  PagedResult,
  StudentDto,
  SubjectDto,
  TeacherDto,
} from "./types";

export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  const res = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  return parseJson<LoginResponse>(res);
}

export async function getSubjects(
  token: string,
  page: number,
  pageSize: number
): Promise<PagedResult<SubjectDto>> {
  const q = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  const res = await apiFetch(`/api/subjects?${q}`, { token });
  return parseJson(res);
}

export async function createSubject(
  token: string,
  name: string
): Promise<SubjectDto> {
  const res = await apiFetch("/api/subjects", {
    method: "POST",
    token,
    body: JSON.stringify({ name }),
  });
  return parseJson(res);
}

export async function getTeachers(
  token: string,
  page: number,
  pageSize: number
): Promise<PagedResult<TeacherDto>> {
  const q = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  const res = await apiFetch(`/api/teachers?${q}`, { token });
  return parseJson(res);
}

export async function createTeacher(
  token: string,
  name: string
): Promise<TeacherDto> {
  const res = await apiFetch("/api/teachers", {
    method: "POST",
    token,
    body: JSON.stringify({ name }),
  });
  return parseJson(res);
}

export async function getStudents(
  token: string,
  page: number,
  pageSize: number
): Promise<PagedResult<StudentDto>> {
  const q = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  const res = await apiFetch(`/api/students?${q}`, { token });
  return parseJson(res);
}

export async function createStudent(
  token: string,
  name: string,
  subjectName: string,
  teacherName: string
): Promise<StudentDto> {
  const res = await apiFetch("/api/students", {
    method: "POST",
    token,
    body: JSON.stringify({ name, subjectName, teacherName }),
  });
  return parseJson(res);
}
