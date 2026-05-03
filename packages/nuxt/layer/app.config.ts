export default defineAppConfig({
  brand: {
    name: '2blang',
    tagline: 'A small language with big ambitions.',
    domain: '2b.team'
  },
  features: {
    /** Show the version switcher and emit a versions.json manifest. */
    versioning: false,
    /** Render the Cmd+K search overlay. */
    search: true
  },
  /**
   * Where each sibling site lives during dev. In production all three sit
   * under the same origin (`2b.team`) and the edge router maps `/docs/*` and
   * `/spec/*` to the corresponding deployment, so `/`, `/docs/`, `/spec/`
   * just work. Locally each app runs on its own port — the header reads
   * these to build cross-app links.
   */
  devSites: {
    website: 'http://localhost:3000/',
    docs: 'http://localhost:3001/docs/next/',
    spec: 'http://localhost:3002/spec/next/'
  }
})
