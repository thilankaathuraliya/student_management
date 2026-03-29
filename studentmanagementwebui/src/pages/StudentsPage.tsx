import { useCallback, useEffect, useState, type FormEvent } from 'react'
import {
  createStudent,
  getAllSubjects,
  getAllTeachers,
  getStudentsPaged,
} from '../api/endpoints'
import type { StudentDto, SubjectDto, TeacherDto } from '../api/types'
import './EntityPage.css'

const PAGE_SIZE = 15

export function StudentsPage() {
  const [items, setItems] = useState<StudentDto[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [listError, setListError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const [subjects, setSubjects] = useState<SubjectDto[]>([])
  const [teachers, setTeachers] = useState<TeacherDto[]>([])
  const [pickersLoading, setPickersLoading] = useState(true)
  const [pickersError, setPickersError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [subjectName, setSubjectName] = useState('')
  const [teacherName, setTeacherName] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const loadPickers = useCallback(async () => {
    setPickersError(null)
    setPickersLoading(true)
    try {
      const [subj, teach] = await Promise.all([
        getAllSubjects(),
        getAllTeachers(),
      ])
      setSubjects(subj)
      setTeachers(teach)
    } catch (e) {
      setPickersError(
        e instanceof Error ? e.message : 'Failed to load subjects or teachers.',
      )
    } finally {
      setPickersLoading(false)
    }
  }, [])

  const loadFirstPage = useCallback(async () => {
    setListError(null)
    setLoading(true)
    try {
      const res = await getStudentsPaged(1, PAGE_SIZE)
      setItems(res.items)
      setPage(res.page)
      setTotalPages(res.totalPages)
    } catch (e) {
      setListError(e instanceof Error ? e.message : 'Failed to load students.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadPickers()
  }, [loadPickers])

  useEffect(() => {
    void loadFirstPage()
  }, [loadFirstPage])

  async function handleLoadMore() {
    if (page >= totalPages || loadingMore) return
    const next = page + 1
    setLoadingMore(true)
    setListError(null)
    try {
      const res = await getStudentsPaged(next, PAGE_SIZE)
      setItems((prev) => [...prev, ...res.items])
      setPage(res.page)
      setTotalPages(res.totalPages)
    } catch (e) {
      setListError(e instanceof Error ? e.message : 'Failed to load more.')
    } finally {
      setLoadingMore(false)
    }
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)
    try {
      await createStudent({ name, subjectName, teacherName })
      setName('')
      setSubjectName('')
      setTeacherName('')
      await loadFirstPage()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not register student.')
    } finally {
      setSubmitting(false)
    }
  }

  const pickersReady = !pickersLoading && !pickersError
  const canRegister =
    pickersReady && subjects.length > 0 && teachers.length > 0

  return (
    <div className="entity-page">
      <h2 className="page-title">Students</h2>

      <section className="panel" aria-labelledby="register-heading">
        <h3 id="register-heading" className="panel-title">
          Register student
        </h3>
        {pickersLoading ? (
          <p className="muted">Loading subjects and teachers…</p>
        ) : null}
        {pickersError ? <p className="form-error">{pickersError}</p> : null}
        {pickersReady && subjects.length === 0 ? (
          <p className="muted">
            No subjects yet. Create subjects in the Subjects tab before registering.
          </p>
        ) : null}
        {pickersReady && teachers.length === 0 ? (
          <p className="muted">
            No teachers yet. Create teachers in the Teachers tab before registering.
          </p>
        ) : null}
        <form className="form-grid" onSubmit={handleRegister}>
          <label className="field">
            <span className="field-label">Name</span>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={!canRegister}
            />
          </label>
          <label className="field">
            <span className="field-label">Subject</span>
            <select
              className="input"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              required
              disabled={!canRegister}
            >
              <option value="">Select a subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Teacher</span>
            <select
              className="input"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              required
              disabled={!canRegister}
            >
              <option value="">Select a teacher</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          {formError ? <p className="form-error">{formError}</p> : null}
          <div className="form-actions">
            <button
              className="btn btn--primary"
              type="submit"
              disabled={submitting || !canRegister}
            >
              {submitting ? 'Saving…' : 'Register'}
            </button>
          </div>
        </form>
      </section>

      <section className="panel" aria-labelledby="list-heading">
        <h3 id="list-heading" className="panel-title">
          All students
        </h3>
        {listError ? <p className="form-error">{listError}</p> : null}
        {loading ? (
          <p className="muted">Loading…</p>
        ) : items.length === 0 ? (
          <p className="muted">No students yet.</p>
        ) : (
          <>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Subject</th>
                    <th>Teacher</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.subjectName}</td>
                      <td>{s.teacherName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {page < totalPages ? (
              <div className="load-more">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => void handleLoadMore()}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Loading…' : 'Load more'}
                </button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  )
}