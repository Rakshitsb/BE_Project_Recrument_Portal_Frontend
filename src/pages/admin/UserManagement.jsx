import { useState } from 'react'
import { Space, Tag, Tabs } from 'antd'
import { UserOutlined, IdcardOutlined } from '@ant-design/icons'

import { PageHeader, ConfirmModal } from '../../components/ui'
import { CandidateTable }  from '../../components/admin/CandidateTable'
import { HRTable }         from '../../components/admin/HRTable'
import { UserDetailModal } from '../../components/admin/UserDetailModal'

// ── Mock Data (replace with API calls later) ──────────────────────────────

const MOCK_CANDIDATES = [
  {
    id: 'c1', name: 'Aarav Sharma', email: 'aarav.sharma@gmail.com',
    phone: '+91 98201 11234', location: 'Mumbai, Maharashtra',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    experienceYears: 3, education: 'B.E. Computer Engineering, VJTI Mumbai',
    bio: 'Passionate full-stack developer with a focus on building scalable web applications.',
    joinedDate: '2024-01-15', totalApplications: 7, status: 'active',
  },
  {
    id: 'c2', name: 'Priya Nair', email: 'priya.nair@outlook.com',
    phone: '+91 99876 54321', location: 'Bengaluru, Karnataka',
    skills: ['Python', 'Django', 'PostgreSQL', 'AWS'],
    experienceYears: 5, education: 'M.Tech CSE, IIT Bangalore',
    bio: 'Backend engineer specialising in cloud-native microservices and data pipelines.',
    joinedDate: '2023-11-02', totalApplications: 12, status: 'active',
  },
  {
    id: 'c3', name: 'Rohan Verma', email: 'rohan.verma@yahoo.com',
    phone: '+91 70123 45678', location: 'Pune, Maharashtra',
    skills: ['Java', 'Spring Boot', 'Kafka', 'Docker'],
    experienceYears: 6, education: 'B.Tech IT, CoEP Pune',
    bio: 'Senior Java developer with expertise in distributed systems and event-driven architecture.',
    joinedDate: '2023-08-20', totalApplications: 9, status: 'active',
  },
  {
    id: 'c4', name: 'Sneha Iyer', email: 'sneha.iyer@gmail.com',
    phone: '+91 81234 56789', location: 'Chennai, Tamil Nadu',
    skills: ['UI/UX', 'Figma', 'React', 'CSS'],
    experienceYears: 2, education: 'B.Des Interaction Design, NID Ahmedabad',
    bio: 'Product designer who bridges design and frontend to create delightful user experiences.',
    joinedDate: '2024-03-10', totalApplications: 4, status: 'active',
  },
  {
    id: 'c5', name: 'Kunal Mehta', email: 'kunal.mehta@proton.me',
    phone: '+91 90090 12345', location: 'Hyderabad, Telangana',
    skills: ['Data Science', 'Pandas', 'TensorFlow', 'SQL'],
    experienceYears: 4, education: 'M.Sc Statistics, University of Hyderabad',
    bio: 'Data scientist with experience in predictive modelling and NLP for fintech products.',
    joinedDate: '2023-06-05', totalApplications: 6, status: 'inactive',
  },
  {
    id: 'c6', name: 'Ananya Reddy', email: 'ananya.reddy@gmail.com',
    phone: '+91 78901 23456', location: 'Kolkata, West Bengal',
    skills: ['Flutter', 'Dart', 'Firebase', 'REST APIs'],
    experienceYears: 2, education: 'B.Tech ECE, Jadavpur University',
    bio: 'Mobile developer passionate about building cross-platform apps with beautiful UIs.',
    joinedDate: '2024-02-18', totalApplications: 3, status: 'active',
  },
  {
    id: 'c7', name: 'Vikram Singh', email: 'vikram.singh@gmail.com',
    phone: '+91 98765 43210', location: 'Jaipur, Rajasthan',
    skills: ['DevOps', 'Kubernetes', 'Terraform', 'CI/CD'],
    experienceYears: 7, education: 'B.E. CSE, MNIT Jaipur',
    bio: 'DevOps engineer who architects resilient infrastructure for high-traffic applications.',
    joinedDate: '2023-04-12', totalApplications: 5, status: 'active',
  },
  {
    id: 'c8', name: 'Meera Pillai', email: 'meera.pillai@gmail.com',
    phone: '+91 91234 56789', location: 'Kochi, Kerala',
    skills: ['QA', 'Selenium', 'Cypress', 'JIRA'],
    experienceYears: 3, education: 'B.Tech CSE, NIT Calicut',
    bio: 'QA engineer ensuring product quality through automated and exploratory testing strategies.',
    joinedDate: '2023-09-01', totalApplications: 2, status: 'inactive',
  },
]

const MOCK_HR_USERS = [
  {
    id: 'h1', name: 'Rajesh Kapoor', email: 'rajesh.kapoor@infosys.com',
    phone: '+91 98100 11111', designation: 'Senior HR Manager',
    company: 'Infosys Ltd', companyLocation: 'Bengaluru, Karnataka',
    industry: 'IT Services', companySize: '200,000+',
    companyWebsite: 'https://www.infosys.com',
    joinedDate: '2023-05-14', totalJobsPosted: 18, status: 'active',
  },
  {
    id: 'h2', name: 'Deepa Krishnamurthy', email: 'deepa.k@wipro.com',
    phone: '+91 98200 22222', designation: 'Talent Acquisition Lead',
    company: 'Wipro Technologies', companyLocation: 'Hyderabad, Telangana',
    industry: 'IT Services', companySize: '250,000+',
    companyWebsite: 'https://www.wipro.com',
    joinedDate: '2023-07-20', totalJobsPosted: 24, status: 'active',
  },
  {
    id: 'h3', name: 'Amit Bhatia', email: 'amit.bhatia@zomato.com',
    phone: '+91 99300 33333', designation: 'HR Business Partner',
    company: 'Zomato Ltd', companyLocation: 'Gurugram, Haryana',
    industry: 'Food Technology', companySize: '5,000–10,000',
    companyWebsite: 'https://www.zomato.com',
    joinedDate: '2023-10-01', totalJobsPosted: 11, status: 'active',
  },
  {
    id: 'h4', name: 'Preethi Subramaniam', email: 'preethi.s@freshworks.com',
    phone: '+91 88400 44444', designation: 'Recruiter',
    company: 'Freshworks Inc', companyLocation: 'Chennai, Tamil Nadu',
    industry: 'SaaS / CRM', companySize: '5,000+',
    companyWebsite: 'https://www.freshworks.com',
    joinedDate: '2024-01-08', totalJobsPosted: 8, status: 'active',
  },
  {
    id: 'h5', name: 'Suresh Joshi', email: 'suresh.joshi@tatamotors.com',
    phone: '+91 77500 55555', designation: 'People Operations Manager',
    company: 'Tata Motors Ltd', companyLocation: 'Pune, Maharashtra',
    industry: 'Automobile', companySize: '80,000+',
    companyWebsite: 'https://www.tatamotors.com',
    joinedDate: '2023-03-22', totalJobsPosted: 15, status: 'inactive',
  },
  {
    id: 'h6', name: 'Nisha Agarwal', email: 'nisha.agarwal@byju.com',
    phone: '+91 66600 66666', designation: 'Campus Recruitment Lead',
    company: "BYJU'S", companyLocation: 'Bengaluru, Karnataka',
    industry: 'EdTech', companySize: '50,000+',
    companyWebsite: 'https://byjus.com',
    joinedDate: '2023-12-15', totalJobsPosted: 6, status: 'active',
  },
]

// ── Component ─────────────────────────────────────────────────────────────

/**
 * UserManagement
 * Admin page to browse, inspect, and delete candidate and HR users.
 */
export function UserManagement() {
  const [candidates,   setCandidates]   = useState(MOCK_CANDIDATES)
  const [hrUsers,      setHRUsers]      = useState(MOCK_HR_USERS)
  const [activeTab,    setActiveTab]    = useState('candidates')
  const [selectedUser, setSelectedUser] = useState(null)
  const [modalOpen,    setModalOpen]    = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [confirmOpen,  setConfirmOpen]  = useState(false)
  const [deleteType,   setDeleteType]   = useState(null)

  // ── Handlers ─────────────────────────────────────────────────────────────

  /** Open the detail modal for a user. */
  function handleView(user, type) {
    setSelectedUser(user)
    setActiveTab(type)
    setModalOpen(true)
  }

  /** Prime the confirm-delete dialog. */
  function handleDelete(user, type) {
    setDeleteTarget(user)
    setDeleteType(type)
    setConfirmOpen(true)
  }

  /** Execute the deletion and reset ephemeral state. */
  function handleConfirmDelete() {
    if (deleteType === 'candidate') {
      setCandidates((prev) => prev.filter((c) => c.id !== deleteTarget.id))
    } else if (deleteType === 'hr') {
      setHRUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id))
    }
    setConfirmOpen(false)
    setDeleteTarget(null)
    setDeleteType(null)
  }

  // ── Tab config ────────────────────────────────────────────────────────────

  const tabItems = [
    {
      key:   'candidates',
      label: <span><UserOutlined style={{ marginRight: 6 }} />Candidates</span>,
      children: (
        <CandidateTable
          candidates={candidates}
          onView={(u) => handleView(u, 'candidates')}
          onDelete={(u) => handleDelete(u, 'candidate')}
        />
      ),
    },
    {
      key:   'hr',
      label: <span><IdcardOutlined style={{ marginRight: 6 }} />HR Users</span>,
      children: (
        <HRTable
          hrUsers={hrUsers}
          onView={(u) => handleView(u, 'hr')}
          onDelete={(u) => handleDelete(u, 'hr')}
        />
      ),
    },
  ]

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle="Manage all candidates and HR users on the platform"
        actions={
          <Space>
            <Tag color="blue">{candidates.length} Candidates</Tag>
            <Tag color="purple">{hrUsers.length} HR Users</Tag>
          </Space>
        }
      />

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />

      <UserDetailModal
        open={modalOpen}
        user={selectedUser}
        userType={activeTab}
        onClose={() => { setModalOpen(false); setSelectedUser(null) }}
      />

      <ConfirmModal
        open={confirmOpen}
        danger
        title="Delete User"
        description="This will permanently delete the user and all their associated data including jobs, applications, and profiles. This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => { setConfirmOpen(false); setDeleteTarget(null); setDeleteType(null) }}
      />
    </div>
  )
}
