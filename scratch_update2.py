import sys

file_path = r'f:\Final Year Project Stuff\New development\BE_Project_Recrument_Portal_Frontend\src\layouts\MainLayout.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add icons target
icons_target = "  BellOutlined,\n} from '@ant-design/icons'"
icons_replacement = "  BellOutlined,\n  VideoCameraOutlined,\n  RobotOutlined,\n} from '@ant-design/icons'"
content = content.replace(icons_target, icons_replacement)
content = content.replace(icons_target.replace('\n', '\r\n'), icons_replacement.replace('\n', '\r\n'))

# 2. Add hrMenuItems target
menu_target = "  { key: '/hr/applications', icon: <TeamOutlined />,      label: 'Applications' },\n]"
menu_replacement = "  { key: '/hr/applications', icon: <TeamOutlined />,      label: 'Applications' },\n  { key: '/hr/interviews',   icon: <VideoCameraOutlined />, label: 'Interviews' },\n  { key: '/hr/interviewers', icon: <RobotOutlined />,       label: 'Interviewers' },\n]"
content = content.replace(menu_target, menu_replacement)
content = content.replace(menu_target.replace('\n', '\r\n'), menu_replacement.replace('\n', '\r\n'))

# 3. Update selectedMenuKey logic
key_target = "  const selectedMenuKey =\n    role === 'candidate' && (location.pathname === '/jobs' || location.pathname.startsWith('/candidate/jobs'))\n      ? '/candidate/jobs'\n      : location.pathname"
key_replacement = "  const selectedMenuKey =\n    location.pathname.startsWith('/hr/interviews/')\n      ? '/hr/interviews'\n      : role === 'candidate' && (location.pathname === '/jobs' || location.pathname.startsWith('/candidate/jobs'))\n      ? '/candidate/jobs'\n      : location.pathname"
content = content.replace(key_target, key_replacement)
content = content.replace(key_target.replace('\n', '\r\n'), key_replacement.replace('\n', '\r\n'))

with open(file_path, 'w', encoding='utf-8', newline='') as f:
    f.write(content)

print("MainLayout.jsx updated successfully.")
