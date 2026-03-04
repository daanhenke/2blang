declare module 'virtual:git-versioning' {
  export type PackageVersionChannel = 'release' | 'rc' | 'next'

  export interface PackageVersionEntry {
    id: string
    label: string
    gitRef: string
    channel: PackageVersionChannel
    baseVersion: string | null
    rcNumber: number | null
    isDefault: boolean
    isLatestRelease: boolean
    isLatestRc: boolean
  }

  export interface PackageVersionsData {
    versions: PackageVersionEntry[]
    releases: PackageVersionEntry[]
    releaseCandidates: PackageVersionEntry[]
    next: PackageVersionEntry | null
    defaultVersion: string | null
    latestRelease: string | null
    latestRc: string | null
  }

  export const versions: PackageVersionEntry[]
  export const releases: PackageVersionEntry[]
  export const releaseCandidates: PackageVersionEntry[]
  export const next: PackageVersionEntry | null
  export const defaultVersion: string | null
  export const latestRelease: string | null
  export const latestRc: string | null

  const data: PackageVersionsData
  export default data
}
