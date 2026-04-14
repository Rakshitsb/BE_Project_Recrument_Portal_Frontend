import React, { useState, useEffect } from 'react';
import { Typography, Button, Spin, Result, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getInterviews } from '../../services/interviewService';
import { InterviewCard } from '../../components/interview/InterviewCard';
import { CreateInterviewModal } from '../../components/interview/CreateInterviewModal';
import { ShareModal } from '../../components/interview/shared/ShareModal';

const { Title, Text } = Typography;

export function Interviews() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [shareTarget, setShareTarget] = useState(null);

    const fetchInterviews = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getInterviews();
            setInterviews(data || []);
        } catch (err) {
            setError(err.message || 'Failed to load interviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInterviews();
    }, []);

    const activeInterviews = interviews.filter(i => !i.is_archived);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Title level={4} style={{ margin: 0 }}>My Interviews</Title>
                    <Text type="secondary">
                        Create and manage AI voice interviews for shortlisted candidates.
                    </Text>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    style={{ backgroundColor: '#0d9488', borderColor: '#0d9488' }}
                    onClick={() => setCreateModalOpen(true)}
                >
                    New Interview
                </Button>
            </div>

            <div>
                {loading ? (
                    <div className="flex justify-center items-center min-h-[200px]">
                        <Spin size="large" />
                    </div>
                ) : error ? (
                    <Result
                        status="error"
                        title="Failed to load interviews"
                        subTitle={error}
                        extra={<Button onClick={fetchInterviews}>Retry</Button>}
                    />
                ) : activeInterviews.length === 0 ? (
                    <Empty 
                        description="No interviews yet. Create your first interview to get started."
                        className="my-10"
                    >
                        <Button type="primary" onClick={() => setCreateModalOpen(true)}>
                            Create Interview
                        </Button>
                    </Empty>
                ) : (
                    <div className="flex flex-wrap">
                        {activeInterviews.map((interview) => (
                            <InterviewCard
                                key={interview.id}
                                interview={interview}
                                onArchive={(id) => setInterviews(prev => prev.filter(i => i.id !== id))}
                                onShare={(inv) => setShareTarget(inv)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <CreateInterviewModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onCreated={(newInterview) => {
                    setInterviews(prev => [newInterview, ...prev]);
                    setCreateModalOpen(false);
                }}
            />

            <ShareModal
                open={shareTarget !== null}
                onClose={() => setShareTarget(null)}
                interviewToken={shareTarget?.interview_token}
                interviewName={shareTarget?.name}
            />
        </div>
    );
}
