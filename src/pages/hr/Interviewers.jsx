import React, { useState, useEffect } from 'react';
import { Typography, Skeleton, Result, Button, Empty, Divider, Alert } from 'antd';
import { getInterviewers } from '../../services/interviewerService';
import { InterviewerCard } from '../../components/interview/InterviewerCard';

const { Title, Text } = Typography;

export function Interviewers() {
    const [interviewers, setInterviewers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInterviewers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getInterviewers();
            setInterviewers(data || []);
        } catch (err) {
            setError(err.message || 'Failed to load interviewers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInterviewers();
    }, []);

    return (
        <div>
            <div className="bg-gray-100 p-4 rounded-lg" style={{ background: '#f9fafb' }}>
                <Title level={4} style={{ marginTop: 0 }}>AI Interviewers</Title>
                <Text type="secondary">
                    Choose an AI persona to conduct voice interviews on your behalf.
                </Text>
            </div>

            <div className="mt-6" style={{ marginTop: 24 }}>
                {loading ? (
                    <div className="flex gap-4 flex-wrap" style={{ display: 'flex', gap: 16 }}>
                        {[...Array(4)].map((_, i) => (
                            <Skeleton.Button key={i} active style={{ width: 160, height: 200 }} />
                        ))}
                    </div>
                ) : error ? (
                    <Result
                        status="error"
                        title="Failed to load interviewers"
                        subTitle={error}
                        extra={<Button type="primary" onClick={fetchInterviewers}>Retry</Button>}
                    />
                ) : interviewers.length === 0 ? (
                    <Empty description="No interviewers available" />
                ) : (
                    <div className="flex flex-wrap gap-4" style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                        {interviewers.map((item) => (
                            <InterviewerCard key={item.id} interviewer={item} />
                        ))}
                    </div>
                )}
            </div>

            <Divider />

            <Alert
                type="info"
                showIcon
                message="Interviewers are AI personas configured by your administrator."
                description="Contact your admin to add or modify interviewer personas."
                className="mt-4"
                style={{ marginTop: 16 }}
            />
        </div>
    );
}
