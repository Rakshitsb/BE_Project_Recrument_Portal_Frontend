import { useState } from 'react'
import {
  Card, Form, Steps, Button, Space, Result, Typography, message,
} from 'antd'
import {
  UserOutlined, BankOutlined, CheckCircleOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

import useAuthStore          from '../../store/authStore'
import { hrProfileService }  from '../../services'
import { PersonalInfoStep }  from '../../components/hr/setup/PersonalInfoStep'
import { CompanyInfoStep }   from '../../components/hr/setup/CompanyInfoStep'

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

  // ── Submit: POST /hr/profile, update store, redirect ────────────────
  const handleSubmit = async () => {
    try {
      setSubmitting(true)

      const personalValues = await personalForm.validateFields()
      const companyValues  = await companyForm.validateFields()
      const payload = { ...personalValues, ...companyValues }

      await hrProfileService.createProfile(payload)

      updateUser({ profileCompleted: true })
      message.success('Profile created successfully!')
      setCurrentStep(2)

      setTimeout(() => navigate('/hr'), 1500)

    } catch (err) {
      if (err?.response) {
        const detail = err.response?.data?.detail
        const msg = typeof detail === 'string'
          ? detail
          : 'Failed to create profile. Please try again.'
        message.error(msg)
      }
    } finally {
      setSubmitting(false)
    }
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
      await handleSubmit()
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
