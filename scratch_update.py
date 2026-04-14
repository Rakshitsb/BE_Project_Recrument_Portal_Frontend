import sys

file_path = r'f:\Final Year Project Stuff\New development\BE_Project_Recrument_Portal_Frontend\src\routes\AppRoutes.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

import1 = "const Interviewers   = lazy(() => import('../pages/hr/Interviewers').then(m => ({ default: m.Interviewers })))"
import2 = "const Interviews     = lazy(() => import('../pages/hr/Interviews').then(m => ({ default: m.Interviews })))"
import3 = "const InterviewDetail = lazy(() => import('../pages/hr/InterviewDetail').then(m => ({ default: m.InterviewDetail })))"

idx1 = content.find("const HRProfile      = lazy(() => import('../pages/hr/HRProfile').then(m => ({ default: m.HRProfile })))")
if idx1 != -1:
    end_idx1 = content.find(")", idx1) + 1
    new_imports = "\n" + import1 + "\n" + import2 + "\n" + import3
    content = content[:end_idx1] + new_imports + content[end_idx1:]

route1 = "              <Route path=\"/hr/interviewers\"     element={<Interviewers />} />"
route2 = "              <Route path=\"/hr/interviews\"       element={<Interviews />} />"
route3 = "              <Route path=\"/hr/interviews/:interviewId\" element={<InterviewDetail />} />"

idx2 = content.find('<Route path="/hr/profile"          element={<HRProfile />} />')
if idx2 != -1:
    end_idx2 = content.find("/>", idx2) + 2
    new_routes = "\n" + route1 + "\n" + route2 + "\n" + route3
    content = content[:end_idx2] + new_routes + content[end_idx2:]

with open(file_path, 'w', encoding='utf-8', newline='') as f:
    f.write(content)

print("AppRoutes.jsx updated successfully.")
