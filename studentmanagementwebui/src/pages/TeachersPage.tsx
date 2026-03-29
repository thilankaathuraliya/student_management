import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { createTeacher, getTeachersPaged } from '../api/endpoints'
import type { TeacherDto } from '../api/types'
import './EntityPage.css'

const PAGE_SIZE = 15

export function TeachersPage() {
  const [items, setItems] = useState<TeacherDto[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [listError, setListError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const [name, setName] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const loadFirstPage = useCallback(async () => {
    setListError(null)
    setLoading(true)
    try {
      const res = await getTeachersPaged(1, PAGE_SIZE)
      setItems(res.items)
      setPage(res.page)
      setTotalPages(res.totalPages)
    } catch (e) {
      setListError(e instanceof Error ? e.message : 'Failed to load teachers.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadFirstPage()
  }, [loadFirstPage])

  async function handleLoadMore() {
    if (page >= totalPages || loadingMore) return
    const next = page + 1
    setLoadingMore(true)
    setListError(null)
    try {
      const res = await getTeachersPaged(next, PAGE_SIZE)
      setItems((prev) => [...prev, ...res.items])
      setPage(res.page)
      setTotalPages(res.totalPages)
    } catch (e) {
      setListError(e instanceof Error ? e.message : 'Failed to load more.')
    } finally {
      setLoadingMore(false)
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)
    try {
      await createTeacher(name.trim())
      setName('')
      await loadFirstPage()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not create teacher.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="entity-page">
      <h2 className="page-title">Teachers</h2>

      <section className="panel" aria-labelledby="create-teacher-heading">
        <h3 id="create-teacher-heading" className="panel-title">
          Create teacher
        </h3>
        <form className="form-row" onSubmit={handleCreate}>
          <label className="field field--grow">
            <span className="field-label">Name</span>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          {formError ? <p className="form-error">{formError}</p> : null}
          <div className="form-actions">
            <button className="btn btn--primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Create'}
            </button>
          </div>
        </form>
      </section>

      <section className="panel" aria-labelledby="teachers-list-heading">
        <h3 id="teachers-list-heading" className="panel-title">
          All teachers
        </h3>
        {listError ? <p className="form-error">{listError}</p> : null}
        {loading ? (
          <p className="muted">Loading…</p>
        ) : items.length === 0 ? (
          <p className="muted">No teachers yet.</p>
        ) : (
          <>
            <ul className="name-list">
              {items.map((t) => (
                <li key={t.id}>{t.name}</li>
              ))}
            </ul>
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
