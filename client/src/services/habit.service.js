import api from "./api"

export const getHabits = () => api.get("/habits")

export const createHabit = (data) => api.post("/habits", data)

export const deleteHabit = (id) => api.delete(`/habits/${id}`)

export const completeHabit = (id) => api.post(`/habits/${id}/complete`)
export const updateHabit = (id, data) => api.put(`/habits/${id}`, data)
