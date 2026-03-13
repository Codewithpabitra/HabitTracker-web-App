import api from "./api"

export const getHabits = () => api.get("/habits")

export const createHabit = (data) => api.post("/habits", data)

export const deleteHabit = (id) => api.delete(`/habits/${id}`)

export const completeHabit = (id) => api.post(`/habits/${id}/complete`)

export const updateHabit = (id, data) => api.put(`/habits/${id}`, data)

export const verifyHabitProof = (id, imageFile) => {
  const formData = new FormData()
  formData.append("proof", imageFile)
  return api.post(`/habits/${id}/verify-proof`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
}