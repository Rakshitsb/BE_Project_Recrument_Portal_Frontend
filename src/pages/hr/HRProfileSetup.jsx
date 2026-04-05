import { useState } from 'react'
import {
  Card, Form, Steps, Button, Space, Result, Typography, message,
} from 'antd'
import {
  UserOutlined, BankOutlined, CheckCircleOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

import useAuthStore         from '../../store/authStore'
import { PersonalInfoStep } from '../../components/hr/setup/PersonalInfoStep'
import { CompanyInfoStep }  from '../../components/hr/setup/CompanyInfoStep'

const { Title, Text } = Typography

const STEPS = [
  { title: 'Personal Info', icon: <UserOutlined /> },
  { title: 'Company Info',  icon: <BankOutlined /> },
  { title: 'Done',          icon: <CheckCircleOutlined /> },
]

/**
 * HRProfileSetup
 * Multi-step onboarding wizard shown to HR users on first login.
 * Collects personal info (step 0) and company info (step 1),
 * then simulates a submit and redirects to /hr.
 */
export function HRProfileSetup() {
  const navigate   = useNavigate()
  const updateUser = useAuthStore((s) => s.updateUser)

  const [personalForm] = Form.useForm()
  const [companyForm]  = Form.useForm()

  const [currentStep, setCurrentStep] = useState(0)
  const [formData,    setFormData]    = useState({})
  const [submitting,  setSubmitting]  = useState(false)

  // ── Submit: simulate API, update store, redirect ──────────────────
  const handleSubmit = (allData) => {
    setSubmitting(true)
    setTimeout(() => {
      updateUser({ hasProfile: true, ...allData })
      message.success('Profile created successfully!')
      setSubmitting(false)
      navigate('/hr', { replace: true })
    }, 1500)
  }

  // ── Step navigation ───────────────────────────────────────────────
  const handleNext = async () => {
    if (currentStep === 0) {
      try {
        const values = await personalForm.validateFields()
        setFormData((prev) => ({ ...prev, ...values }))
        setCurrentStep(1)
      } catch { /* Ant Design highlights invalid fields */ }

    } else if (currentStep === 1) {
      try {
        const values  = await companyForm.validateFields()
        const allData = { ...formData, ...values }
        setFormData(allData)
        setCurrentStep(2)
        handleSubmit(allData)
      } catch { /* Ant Design highlights invalid fields */ }
    }
  }

  const handleBack = () => setCurrentStep((s) => s - 1)

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '40px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Card style={{ width: '100%', maxWidth: 640 }}>

        {/* ── Logo + subtitle ── */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>🚀 HireBase</Title>
          <Text type="secondary">Complete your HR profile to get started</Text>
        </div>

        {/* ── Progress stepper ── */}
        <Steps
          current={currentStep}
          items={STEPS}
          size="small"
          style={{ marginBottom: 32 }}
        />

        {/* ── Active step content ── */}
        {currentStep === 0 && <PersonalInfoStep form={personalForm} />}
        {currentStep === 1 && <CompanyInfoStep  form={companyForm} />}
        {currentStep === 2 && (
          <Result
            status="success"
            title="Profile Created!"
            subTitle="Redirecting you to your dashboard..."
          />
        )}

        {/* ── Footer buttons (hidden on Done screen) ── */}
        {currentStep < 2 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
            <Space>
              {currentStep === 1 && (
                <Button onClick={handleBack} disabled={submitting}>
                  Back
                </Button>
              )}
              <Button type="primary" loading={submitting} onClick={handleNext}>
                {currentStep === 0 ? 'Next' : 'Submit'}
              </Button>
            </Space>
          </div>
        )}

      </Card>
    </div>
  )
}

export default HRProfileSetup
