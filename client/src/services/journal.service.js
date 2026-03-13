import api from "./api"

export const getJournals = () => api.get("/journal")

export const createJournal = (data) => api.post("/journal", data)
export const updateJournal = (id, data) => api.put(`/journal/${id}`, data)

export const deleteJournal = (id) => api.delete(`/journal/${id}`)