import { create } from 'zustand'

const initialFilters = {
  searchTerm: '',
  location: 'Anywhere',
  industries: [],
  sizes: [],
  categories: [],
  tags: [],
  sort: 'relevant',
}

const useJobStore = create((set) => ({
  jobs: [],
  total: 0,
  page: 1,
  pageSize: 6,
  filters: initialFilters,

  setJobs: (jobs) => set({ jobs }),
  setTotal: (total) => set({ total }),
  setPage: (page) => set({ page }),
  setFilters: (next) =>
    set((state) => ({
      filters: { ...state.filters, ...next },
      page: 1,
    })),
  resetFilters: () => set({ filters: initialFilters, page: 1 }),
}))

export default useJobStore
