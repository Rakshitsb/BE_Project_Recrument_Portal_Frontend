import sys

file_path = r'f:\Final Year Project Stuff\New development\BE_Project_Recrument_Portal_Frontend\src\routes\AppRoutes.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

import_statement = "import InterviewTakePage from '../pages/candidate/InterviewTakePage'\nimport InterviewResultsPage from '../pages/candidate/InterviewResultsPage'"

# Insert imports at the end of the imports section, just before lazy imports or at the top
idx1 = content.find("const CandidateDashboard")
if idx1 != -1:
    content = content[:idx1] + import_statement + "\n\n" + content[idx1:]

route_block = """
        {/* Candidate Standalone Interview Routes */}
        <Route path="/interview/:token" element={<InterviewTakePage />} />
        <Route path="/interview/:token/results" element={<InterviewResultsPage />} />
"""

# Insert routes right before {/* Default redirect + 404 */}
idx2 = content.find("{/* Default redirect + 404 */}")
if idx2 != -1:
    content = content[:idx2] + route_block + "\n        " + content[idx2:]

with open(file_path, 'w', encoding='utf-8', newline='') as f:
    f.write(content)

print("AppRoutes.jsx updated successfully.")
