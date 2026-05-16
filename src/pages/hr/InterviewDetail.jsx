import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Divider, Tooltip, Switch, Spin, Result, Badge, message, Card, Avatar } from 'antd';
import { ArrowLeftOutlined, ShareAltOutlined, EditOutlined, UserOutlined, MailOutlined, FileTextOutlined } from '@ant-design/icons';
import { getInterviewById, updateInterview } from '../../services/interviewService';
import { getResponsesByInterviewId } from '../../services/interviewResponseService';
import { InterviewStatusTag } from '../../components/interview/shared/InterviewStatusTag';
import { ShareModal } from '../../components/interview/shared/ShareModal';
import { SummaryPanel } from '../../components/interview/SummaryPanel';
import { CandidateResponsePanel } from '../../components/interview/CandidateResponsePanel';
import { EditInterviewPanel } from '../../components/interview/EditInterviewPanel';
import { applicationService } from '../../services/hrService';

const { Title, Text } = Typography;

export function InterviewDetail() {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const view = searchParams.get('view');
    const rid = searchParams.get('rid');

    const [interview, setInterview] = useState(null);
    const [responses, setResponses] = useState([]);
    const [interviewLoading, setInterviewLoading] = useState(true);
    const [responsesLoading, setResponsesLoading] = useState(true);
    const [interviewError, setInterviewError] = useState(null);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [candidateInfo, setCandidateInfo] = useState(null);

    const fetchInterview = () => {
        setInterviewLoading(true);
        return getInterviewById(interviewId)
            .then(data => {
                setInterview(data);
                setInterviewLoading(false);
            })
            .catch(err => {
                setInterviewError(err.message || 'Failed to fetch interview');
                setInterviewLoading(false);
            });
    };

    useEffect(() => {
        if (!view) {
            setSearchParams({ view: 'summary' }, { replace: true });
        }
    }, [view, setSearchParams]);

    useEffect(() => {
        setResponsesLoading(true);
        setInterviewError(null);

        Promise.all([
            fetchInterview(),
            getResponsesByInterviewId(interviewId)
                .then(data => {
                    setResponses(data || []);
                    setResponsesLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch responses:', err);
                    setResponsesLoading(false);
                })
        ]);
    }, [interviewId]);

    useEffect(() => {
        if (!interview?.job_id || !interview?.application_id) return;

        applicationService.getJobApplications(interview.job_id)
            .then(applications => {
                const matchedApplication = applications.find(app => app.id === interview.application_id);
                setCandidateInfo(matchedApplication || null);
            })
            .catch(() => {
                setCandidateInfo(null);
            });
    }, [interview]);

    const handleSelectResponse = (response) => {
        setSearchParams({ view: 'response', rid: response.id });
    };

    const handleStatusChange = (responseId, newStatus) => {
        setResponses(prev => prev.map(r => 
            r.id === responseId ? { ...r, candidate_status: newStatus } : r
        ));
    };

    const handleToggleActive = async (checked) => {
        const previousState = interview.is_active;
        setInterview(prev => ({ ...prev, is_active: checked }));
        try {
            await updateInterview(interviewId, { is_active: checked });
            message.success(`Interview ${checked ? 'activated' : 'deactivated'}`);
        } catch (error) {
            setInterview(prev => ({ ...prev, is_active: previousState }));
            message.error('Failed to update status');
        }
    };

    if (interviewError && !interviewLoading) {
        return (
            <Result
                status="404"
                title="Interview not found"
                subTitle="This interview may have been archived or does not exist."
                extra={<Button onClick={() => navigate('/hr/interviews')}>Back to Interviews</Button>}
            />
        );
    }

    const primaryResponse = responses[0] || null;
    const candidateName =
        candidateInfo?.candidateName ||
        primaryResponse?.name ||
        `Candidate ${interview?.candidate_id?.slice(-4) || ''}`;
    const candidateEmail = candidateInfo?.candidateEmail || primaryResponse?.email || 'Email not available';
    const candidateSkills = candidateInfo?.skills || [];

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
            <div style={{ 
                position: 'sticky', 
                top: 0, 
                backgroundColor: 'white', 
                padding: '12px 16px', 
                borderBottom: '1px solid #e5e7eb',
                display: 'flex', 
                alignItems: 'center', 
                gap: 16, 
                flexWrap: 'wrap',
                zIndex: 10
            }}>
                <div className="flex items-center gap-4">
                    <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/hr/interviews')}>
                        Interviews
                    </Button>
                    <Divider type="vertical" />
                    <Title level={5} style={{ margin: 0 }}>
                        {interview?.name || 'Loading...'}
                    </Title>
                    {interview && (
                        <InterviewStatusTag isActive={interview.is_active} isArchived={interview.is_archived} />
                    )}
                </div>

                <div className="flex items-center gap-4 ml-auto">
                    <Tooltip title="Share candidate link">
                        <Button icon={<ShareAltOutlined />} onClick={() => setShareModalOpen(true)}>
                            Share
                        </Button>
                    </Tooltip>
                    <Tooltip title="Edit interview">
                        <Button icon={<EditOutlined />} onClick={() => setSearchParams({ view: 'edit' })}>
                            Edit
                        </Button>
                    </Tooltip>
                    {interview && (
                        <Tooltip title={interview.is_active ? 'Deactivate' : 'Activate'}>
                            <Switch
                                checked={interview.is_active}
                                onChange={handleToggleActive}
                                checkedChildren="Active"
                                unCheckedChildren="Inactive"
                                style={{ backgroundColor: interview.is_active ? '#0d9488' : undefined }}
                            />
                        </Tooltip>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', height: 'calc(100vh - 120px)', overflow: 'hidden', padding: 16, gap: 16 }}>
                <div style={{ 
                    width: '28%',
                    minWidth: 280,
                    flexShrink: 0, 
                    backgroundColor: 'white', 
                    borderRadius: 12, 
                    border: '1px solid #e5e7eb', 
                    padding: 16,
                    height: '100%', 
                    overflowY: 'auto',
                    display: 'flex', 
                    flexDirection: 'column' 
                }}>
                    <div style={{ marginBottom: 16 }}>
                        <Text strong>Assigned Candidate</Text>
                    </div>

                    <Card size="small" style={{ borderRadius: 10, marginBottom: 16, borderColor: '#ccfbf1', backgroundColor: '#f0fdfa' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                            <Avatar size={44} style={{ backgroundColor: '#0d9488' }} icon={<UserOutlined />}>
                                {candidateName?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            <div style={{ minWidth: 0 }}>
                                <Text strong style={{ display: 'block', fontSize: 15 }}>{candidateName}</Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    One candidate is assigned to this interview
                                </Text>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <MailOutlined style={{ color: '#64748b' }} />
                            <Text type="secondary" style={{ fontSize: 13 }}>{candidateEmail}</Text>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FileTextOutlined style={{ color: '#64748b' }} />
                            <Text type="secondary" style={{ fontSize: 13 }}>
                                Application ID: {interview?.application_id || 'Not available'}
                            </Text>
                        </div>
                    </Card>

                    <div style={{ marginBottom: 12 }}>
                        <Text strong>Interview Attempts</Text>
                        <Badge count={responses.length} style={{ marginLeft: 8 }} color="#0d9488" />
                    </div>

                    <Card size="small" style={{ borderRadius: 10, marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                            <div>
                                <Text type="secondary" style={{ fontSize: 12 }}>Latest status</Text>
                                <div>
                                    <Text strong>{primaryResponse?.is_ended ? 'Completed' : primaryResponse ? 'In Progress' : 'Awaiting Candidate'}</Text>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <Text type="secondary" style={{ fontSize: 12 }}>Decision</Text>
                                <div>
                                    <Text strong style={{ textTransform: 'capitalize' }}>{primaryResponse?.candidate_status || 'pending'}</Text>
                                </div>
                            </div>
                        </div>
                        <Button
                            type="primary"
                            block
                            disabled={!primaryResponse}
                            onClick={() => primaryResponse && handleSelectResponse(primaryResponse)}
                            style={{ backgroundColor: '#0d9488', borderColor: '#0d9488' }}
                        >
                            {primaryResponse ? 'View Latest Interview Result' : 'Waiting For Candidate Response'}
                        </Button>
                    </Card>

                    <Card size="small" style={{ borderRadius: 10 }}>
                        <Text strong style={{ display: 'block', marginBottom: 12 }}>Candidate Snapshot</Text>
                        {candidateSkills.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {candidateSkills.slice(0, 8).map(skill => (
                                    <span
                                        key={skill}
                                        style={{
                                            fontSize: 12,
                                            padding: '4px 10px',
                                            borderRadius: 999,
                                            backgroundColor: '#eff6ff',
                                            color: '#2563eb',
                                            border: '1px solid #bfdbfe',
                                        }}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <Text type="secondary" style={{ fontSize: 13 }}>
                                Candidate profile details will appear here when available.
                            </Text>
                        )}
                    </Card>
                </div>

                <div style={{ 
                    flex: 1, 
                    overflow: 'hidden', 
                    backgroundColor: 'white', 
                    borderRadius: 12, 
                    border: '1px solid #e5e7eb', 
                    height: '100%', 
                    overflowY: 'auto' 
                }}>
                    {interviewLoading ? (
                        <div className="flex justify-center items-center h-full min-h-[200px]">
                            <Spin tip="Loading interview..." />
                        </div>
                    ) : interviewError ? (
                        <Result
                            status="error"
                            title="Failed to load interview"
                            subTitle={interviewError}
                            extra={<Button onClick={() => window.location.reload()}>Retry</Button>}
                        />
                    ) : view === 'edit' ? (
                        <EditInterviewPanel
                          interview={interview}
                          onSaved={() => fetchInterview(interviewId)}
                          onArchived={() => navigate('/hr/interviews')}
                        />
                    ) : view === 'response' && rid ? (
                        <CandidateResponsePanel
                            interviewId={interviewId}
                            responseId={rid}
                            onStatusChange={handleStatusChange}
                        />
                    ) : (
                        <SummaryPanel
                            interview={interview}
                            responses={responses}
                            loading={responsesLoading}
                            candidate={{
                                name: candidateName,
                                email: candidateEmail,
                            }}
                        />
                    )}
                </div>
            </div>

            <ShareModal
                open={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                interviewToken={interview?.interview_token}
                interviewName={interview?.name}
                interviewId={interview?.id || interview?._id}
                jobId={interview?.job_id}
                candidateId={interview?.candidate_id}
            />
        </div>
    );
}
