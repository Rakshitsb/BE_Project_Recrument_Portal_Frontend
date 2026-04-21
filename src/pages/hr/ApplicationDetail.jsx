import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Avatar, Button, Card, Col, Divider, Result, Row, Select, Skeleton, Space, Tag, Typography, message } from 'antd';
import { ArrowLeftOutlined, CheckCircleFilled, CheckCircleOutlined, FileTextOutlined, LineChartOutlined, MailOutlined, StopOutlined, UserOutlined } from '@ant-design/icons';
import { applicationService } from '../../services/hrService';
import { CreateInterviewModal } from '../../components/interview/CreateInterviewModal';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { getInterviews } from '../../services/interviewService';
import { getResponsesByInterviewId } from '../../services/interviewResponseService';
import { disableChatbot, enableChatbot, getHRChatSession } from '../../services/chatbotService';

const { Title, Text, Paragraph } = Typography;

const STATUS_OPTIONS = [
    { value: 'applied', label: 'Applied' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interview', label: 'Interview' },
    { value: 'selected', label: 'Selected' },
    { value: 'rejected', label: 'Rejected' },
];

function getAllowedStatusOptions(currentStatus) {
    const workflowOrder = ['applied', 'under_review', 'shortlisted', 'interview'];
    const terminalStatuses = ['selected', 'rejected'];

    if (terminalStatuses.includes(currentStatus)) {
        return STATUS_OPTIONS.filter((option) => option.value === currentStatus);
    }

    return STATUS_OPTIONS.filter((option) => {
        if (terminalStatuses.includes(option.value)) return true;
        if (!workflowOrder.includes(currentStatus) || !workflowOrder.includes(option.value)) return false;
        return workflowOrder.indexOf(option.value) >= workflowOrder.indexOf(currentStatus);
    });
}

function InfoRow({ label, value }) {
    return (
        <div style={{ marginBottom: 12 }}>
            <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>{label}</Text>
            <Text style={{ fontSize: 14 }}>{value || 'Not available'}</Text>
        </div>
    );
}

export function ApplicationDetail() {
    const { applicationId } = useParams();
    const navigate = useNavigate();

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [createInterviewOpen, setCreateInterviewOpen] = useState(false);
    const [chatbotEnabled, setChatbotEnabled] = useState(false);
    const [chatbotLoading, setChatbotLoading] = useState(false);
    const [chatbotActionLoading, setChatbotActionLoading] = useState(false);

    // Interview completion state
    const [linkedInterview, setLinkedInterview] = useState(null);   // interview doc linked to this application
    const [interviewCompleted, setInterviewCompleted] = useState(false); // true if ≥1 response with is_ended

    useEffect(() => {
        let mounted = true;

        const loadApplication = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await applicationService.getApplicationById(applicationId);
                if (!mounted) return;
                if (!result) {
                    setError('Application not found');
                    return;
                }
                setApplication(result);
            } catch (err) {
                if (mounted) {
                    setError(err.message || 'Failed to load application');
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadApplication();
        return () => {
            mounted = false;
        };
    }, [applicationId]);

    // After the application loads, find its linked interview and check completion.
    // Also syncs the local application status with the interview candidate_status
    // so we don't show stale "shortlisted" when the DB already has "rejected"/"selected".
    useEffect(() => {
        if (!applicationId) return;
        let mounted = true;

        const checkInterview = async () => {
            try {
                const allInterviews = await getInterviews();
                const linked = (allInterviews || []).find(
                    (iv) => iv.application_id === applicationId
                );
                if (!linked || !mounted) return;
                setLinkedInterview(linked);

                // Check if any response is ended (completed)
                const responses = await getResponsesByInterviewId(linked.id);
                if (!mounted) return;

                const completedResponse = (responses || []).find((r) => r.is_ended === true);
                const done = !!completedResponse;
                setInterviewCompleted(done);

                // If completed, sync the application status with the interview decision.
                // The backend already writes "rejected"/"selected" to the applications collection
                // when HR sets the candidate_status, so we mirror that locally to avoid stale UI.
                if (done && completedResponse?.candidate_status &&
                    completedResponse.candidate_status !== 'pending') {
                    setApplication((prev) =>
                        prev ? { ...prev, status: completedResponse.candidate_status } : prev
                    );
                }
            } catch {
                // Non-critical — swallow silently
            }
        };

        checkInterview();
        return () => { mounted = false; };
    }, [applicationId]);

    useEffect(() => {
        if (!application?.jobId || !application?.candidateId) return;
        let mounted = true;

        const loadChatbotStatus = async () => {
            setChatbotLoading(true);
            try {
                const session = await getHRChatSession(application.jobId, application.candidateId);
                if (mounted) setChatbotEnabled(Boolean(session?.is_enabled));
            } catch (err) {
                if (mounted && err.response?.status === 404) {
                    setChatbotEnabled(false);
                }
            } finally {
                if (mounted) setChatbotLoading(false);
            }
        };

        loadChatbotStatus();
        return () => { mounted = false; };
    }, [application?.jobId, application?.candidateId]);

    const isShortlisted = application?.status === 'shortlisted' || application?.status === 'interview';
    const allowedStatusOptions = getAllowedStatusOptions(application?.status);

    const candidateSkills = useMemo(() => application?.skills || [], [application]);

    const updateStatus = async (newStatus) => {
        if (!application?.id) return;

        const previousStatus = application.status;
        setApplication((prev) => ({ ...prev, status: newStatus }));
        setStatusUpdating(true);
        try {
            await applicationService.updateStatus(application.id, newStatus);
            message.success('Application status updated');
        } catch {
            setApplication((prev) => ({ ...prev, status: previousStatus }));
            message.error('Failed to update application status');
        } finally {
            setStatusUpdating(false);
        }
    };

    const handleToggleChatbot = async () => {
        if (!application?.jobId || !application?.candidateId) return;

        setChatbotActionLoading(true);
        try {
            const nextEnabled = !chatbotEnabled;
            if (nextEnabled) {
                await enableChatbot(application.jobId, application.candidateId);
            } else {
                await disableChatbot(application.jobId, application.candidateId);
            }
            setChatbotEnabled(nextEnabled);
            message.success(nextEnabled ? 'Chatbot enabled for candidate' : 'Chatbot disabled for candidate');
        } catch {
            message.error('Failed to update chatbot status');
        } finally {
            setChatbotActionLoading(false);
        }
    };

    if (loading) {
        return <Skeleton active paragraph={{ rows: 12 }} />;
    }

    if (error || !application) {
        return (
            <Result
                status="404"
                title="Application not found"
                subTitle={error || 'The requested candidate application could not be loaded.'}
                extra={<Button onClick={() => navigate('/hr/applications')}>Back to Applications</Button>}
            />
        );
    }

    return (
        <div className="fade-in-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
                <div>
                    <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/hr/applications')} style={{ paddingLeft: 0 }}>
                        Applications
                    </Button>
                    <Title level={3} style={{ margin: '8px 0 4px' }}>{application.candidateName}</Title>
                    <Text type="secondary">Review the candidate profile, update the application status, and start the next hiring step from one place.</Text>
                </div>
                <StatusBadge status={application.status} />
            </div>

            <Alert
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
                message="Candidate workflow"
                description="Shortlist the candidate first. Once shortlisted, interview generation and chatbot controls become available on this page."
            />

            <Row gutter={[16, 16]}>
                <Col xs={24} xl={16}>
                    <Card style={{ borderRadius: 14, marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                            <Avatar size={68} style={{ backgroundColor: '#0d9488' }} icon={<UserOutlined />}>
                                {application.candidateName?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            <div>
                                <Title level={4} style={{ margin: 0 }}>{application.candidateName}</Title>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                                    <MailOutlined style={{ color: '#64748b' }} />
                                    <Text type="secondary">{application.candidateEmail || 'Email not available'}</Text>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                                    <FileTextOutlined style={{ color: '#64748b' }} />
                                    <Text type="secondary">Application ID: {application.id}</Text>
                                </div>
                            </div>
                        </div>

                        <Divider />

                        <Row gutter={[24, 8]}>
                            <Col xs={24} md={12}>
                                <InfoRow label="Job Applied" value={application.jobTitle} />
                                <InfoRow label="Location" value={application.location} />
                                <InfoRow label="Experience" value={application.experienceYears && application.experienceYears !== '—' ? `${application.experienceYears} years` : 'Not available'} />
                            </Col>
                            <Col xs={24} md={12}>
                                <InfoRow label="Education" value={application.education} />
                                <InfoRow label="Applied On" value={application.appliedDate} />
                                <InfoRow label="Current Status" value={application.status} />
                            </Col>
                        </Row>

                        <Divider />

                        <Text strong style={{ display: 'block', marginBottom: 12 }}>Skills</Text>
                        {candidateSkills.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {candidateSkills.map((skill) => (
                                    <Tag key={skill} color="blue">{skill}</Tag>
                                ))}
                            </div>
                        ) : (
                            <Text type="secondary">No skills listed</Text>
                        )}

                        <Divider />

                        <Text strong style={{ display: 'block', marginBottom: 12 }}>Cover Letter</Text>
                        <Paragraph style={{ marginBottom: 0 }}>
                            {application.coverLetter || 'No cover letter provided'}
                        </Paragraph>
                    </Card>
                </Col>

                <Col xs={24} xl={8}>
                    <Card title="Hiring Actions" style={{ borderRadius: 14, marginBottom: 16 }}>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                            Review this candidate and decide whether to shortlist them. Once shortlisted, you can immediately generate an interview.
                        </Text>

                        <div style={{ marginBottom: 16 }}>
                            <Text strong style={{ display: 'block', marginBottom: 8 }}>Update Status</Text>
                            <Select
                                value={application.status}
                                loading={statusUpdating}
                                disabled={statusUpdating}
                                onChange={updateStatus}
                                style={{ width: '100%' }}
                                options={allowedStatusOptions}
                            />
                        </div>

                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            <Button
                                type="primary"
                                block
                                style={{ backgroundColor: '#0d9488', borderColor: '#0d9488' }}
                                onClick={() => updateStatus('shortlisted')}
                                disabled={statusUpdating || isShortlisted}
                            >
                                {isShortlisted ? 'Candidate Shortlisted' : 'Shortlist Candidate'}
                            </Button>

                            {interviewCompleted && linkedInterview ? (
                                <div style={{
                                    padding: '12px 14px',
                                    borderRadius: 10,
                                    backgroundColor: '#f0fdf4',
                                    border: '1px solid #86efac',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 10,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <CheckCircleFilled style={{ color: '#16a34a', fontSize: 16 }} />
                                        <Text strong style={{ color: '#15803d' }}>Interview Completed</Text>
                                    </div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        This candidate has already finished their interview. View the full analytics and results below.
                                    </Text>
                                    <Button
                                        block
                                        icon={<LineChartOutlined />}
                                        onClick={() => navigate(`/hr/interviews/${linkedInterview.id}?view=summary`)}
                                        style={{ borderColor: '#16a34a', color: '#16a34a' }}
                                    >
                                        View Analytics
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    block
                                    onClick={() => setCreateInterviewOpen(true)}
                                    disabled={!isShortlisted || !!linkedInterview}
                                    title={linkedInterview && !interviewCompleted ? 'An interview is already active for this candidate' : undefined}
                                >
                                    {linkedInterview && !interviewCompleted ? 'Interview In Progress' : 'Generate Interview'}
                                </Button>
                            )}

                            <div style={{ padding: 12, borderRadius: 10, backgroundColor: '#f8fafc', border: '1px solid #e5e7eb' }}>
                                <Text strong style={{ display: 'block', marginBottom: 4 }}>
                                    AI Chatbot
                                </Text>
                                <Text type="secondary" style={{ display: 'block', fontSize: 12, marginBottom: 10 }}>
                                    {chatbotEnabled
                                        ? 'Candidate can access the AI chatbot from their AI Chatbot tab.'
                                        : 'Enable chatbot access for this candidate and job.'}
                                </Text>
                                <Button
                                    block
                                    type={chatbotEnabled ? 'default' : 'primary'}
                                    danger={chatbotEnabled}
                                    icon={chatbotEnabled ? <StopOutlined /> : <CheckCircleOutlined />}
                                    loading={chatbotLoading || chatbotActionLoading}
                                    disabled={!isShortlisted || chatbotLoading || chatbotActionLoading}
                                    onClick={handleToggleChatbot}
                                >
                                    {chatbotEnabled ? 'Disable Chatbot' : 'Enable Chatbot'}
                                </Button>
                            </div>

                        </Space>
                    </Card>

                    <Card title="Interview Setup Notes" style={{ borderRadius: 14 }}>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 10 }}>
                            The interview form will open with:
                        </Text>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                            <li>the selected application already linked</li>
                            <li>candidate name and applied role prefilled</li>
                            <li>candidate profile context included for question generation</li>
                            <li>roughly 30% candidate-profile-oriented questions requested</li>
                        </ul>
                    </Card>
                </Col>
            </Row>

            <CreateInterviewModal
                open={createInterviewOpen}
                onClose={() => setCreateInterviewOpen(false)}
                onCreated={() => {
                    setCreateInterviewOpen(false);
                    updateStatus('interview');
                }}
                prefillApplication={application}
            />
        </div>
    );
}

export default ApplicationDetail;
