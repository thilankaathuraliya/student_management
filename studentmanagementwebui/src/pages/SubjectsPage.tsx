import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { createSubject, getSubjectsPaged } from '../api/endpoints'
import type { SubjectDto } from '../api/types'
import './EntityPage.css'

const PAGE_SIZE = 15

export function SubjectsPage() {
  const [items, setItems] = useState<SubjectDto[]>([])
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
      const res = await getSubjectsPaged(1, PAGE_SIZE)
      setItems(res.items)
      setPage(res.page)
      setTotalPages(res.totalPages)
    } catch (e) {
      setListError(e instanceof Error ? e.message : 'Failed to load subjects.')
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
      const res = await getSubjectsPaged(next, PAGE_SIZE)
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
      await createSubject(name.trim())
      setName('')
      await loadFirstPage()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not create subject.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="entity-page">
      <h2 className="page-title">Subjects</h2>

      <section className="panel" aria-labelledby="create-subject-heading">
        <h3 id="create-subject-heading" className="panel-title">
          Create subject
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

      <section className="panel" aria-labelledby="subjects-list-heading">
        <h3 id="subjects-list-heading" className="panel-title">
          All subjects
        </h3>
        {listError ? <p className="form-error">{listError}</p> : null}
        {loading ? (
          <p className="muted">Loading…</p>
        ) : items.length === 0 ? (
          <p className="muted">No subjects yet.</p>
        ) : (
          <>
            <ul className="name-list">
              {items.map((s) => (
                <li key={s.id}>{s.name}</li>
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
