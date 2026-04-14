import sys

file_path = r'f:\Final Year Project Stuff\New development\BE_Project_Recrument_Portal_Frontend\src\services\hrService.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """  getMyJobs: async () => {
    const { data } = await api.get('/jobs/')
    return Array.isArray(data) ? data.map(fromBackendJob) : []
  },"""

replacement = """  getMyJobs: async () => {
    try {
      const { data: profile } = await api.get('/hr/profile')
      const hrId = profile.user_id

      const { data } = await api.get('/jobs/')
      const allJobs = Array.isArray(data) ? data.map(fromBackendJob) : []
      return allJobs.filter(job => job.hrId === hrId)
    } catch (err) {
      if (err.response?.status === 404) return []
      throw err
    }
  },"""

content = content.replace(target, replacement)
content = content.replace(target.replace('\n', '\r\n'), replacement.replace('\n', '\r\n'))

with open(file_path, 'w', encoding='utf-8', newline='') as f:
    f.write(content)

print("hrService.js updated successfully.")
