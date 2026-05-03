import { ref, watch } from 'vue'
import { queryCollectionSearchSections } from '#imports'

export interface SearchHit {
  id: string
  title: string
  content?: string
  level?: number
}

/**
 * Lightweight client-side search over the `content` collection. Indexes
 * markdown sections at first call and re-filters on every keystroke. For
 * large corpora swap in a server-side index — this version is good enough
 * for thousands of sections.
 */
export function useContentSearch()
{
  const query = ref('')
  const results = ref<SearchHit[]>([])
  const sections = ref<SearchHit[] | null>(null)

  async function ensureIndex()
  {
    if (sections.value) return
    const all = await queryCollectionSearchSections('content')
    sections.value = (all ?? []).map((s: Record<string, unknown>) => ({
      id: String(s.id ?? s.path ?? Math.random()),
      title: String(s.title ?? ''),
      content: typeof s.content === 'string' ? s.content : undefined,
      level: typeof s.level === 'number' ? s.level : undefined
    }))
  }

  watch(query, async (q) =>
  {
    await ensureIndex()
    const needle = q.trim().toLowerCase()
    if (!needle || !sections.value)
    {
      results.value = []
      return
    }
    results.value = sections.value
      .filter(
        (s) =>
          s.title.toLowerCase().includes(needle)
          || s.content?.toLowerCase().includes(needle)
      )
      .slice(0, 20)
  })

  return { query, results }
}
