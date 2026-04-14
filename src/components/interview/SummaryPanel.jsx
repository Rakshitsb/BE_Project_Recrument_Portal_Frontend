import React from 'react';
import { Card, Row, Col, Statistic, Typography, Divider, List, Spin, Badge, Tag } from 'antd';
import { UserOutlined, CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export function SummaryPanel({ interview, responses, loading, candidate }) {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[300px]">
                <Spin tip="Loading summary..." />
            </div>
        );
    }

    if (!interview) {
        return null;
    }

    const latestResponse = responses?.[0] || null;
    const attemptCount = responses?.length || 0;
    const completedResponses = responses?.filter(r => r.is_ended)?.length || 0;
    const interviewStatus = latestResponse
        ? (latestResponse.is_ended ? 'Completed' : 'In Progress')
        : 'Awaiting Candidate';
    const latestDecision = latestResponse?.candidate_status || 'pending';
    const latestCompletedDate = latestResponse?.created_at
        ? new Date(latestResponse.created_at).toLocaleDateString()
        : 'Not completed yet';

    let avgDuration = 0;
    if (completedResponses > 0) {
        const totalSecs = responses.reduce((acc, r) => acc + (r.duration || 0), 0);
        avgDuration = Math.round(totalSecs / completedResponses);
    }
    
    const formatDuration = (seconds) => {
        if (!seconds) return '0m 0s';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    return (
        <div style={{ padding: 24, height: '100%', overflowY: 'auto' }}>
            <Title level={4} style={{ marginTop: 0, marginBottom: 24 }}>Candidate Interview Overview</Title>
            
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12} xl={6}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic 
                            title="Assigned Candidate"
                            value={candidate?.name || 'Candidate'}
                            prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={12} xl={6}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic 
                            title="Interview Status"
                            value={interviewStatus}
                            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={12} xl={6}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic
                            title="Interview Attempts"
                            value={attemptCount}
                            prefix={<FileTextOutlined style={{ color: '#7c3aed' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={12} xl={6}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic 
                            title="Avg. Duration"
                            value={formatDuration(avgDuration)} 
                            prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                        />
                    </Card>
                </Col>
            </Row>

            <Divider />

            <Title level={5}>Candidate Decision</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} md={12}>
                    <Card size="small" style={{ borderRadius: 8, backgroundColor: '#fafafa' }}>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Current Decision</Text>
                        <Text strong style={{ fontSize: 24, textTransform: 'capitalize' }}>{latestDecision}</Text>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card size="small" style={{ borderRadius: 8, backgroundColor: '#fafafa' }}>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Latest Completion</Text>
                        <Text strong style={{ fontSize: 24 }}>{latestCompletedDate}</Text>
                    </Card>
                </Col>
            </Row>

            <Divider />

            <Title level={5}>Interview Details</Title>
            <Card size="small" style={{ borderRadius: 8, marginBottom: 24 }}>
                <p><strong>Candidate:</strong> {candidate?.name || 'Candidate'}</p>
                <p><strong>Email:</strong> {candidate?.email || 'Not available'}</p>
                <p><strong>Context:</strong> {interview.context || 'None provided'}</p>
                <p><strong>Original Objective:</strong> {interview.objective || 'None provided'}</p>
                <p><strong>Configured Duration:</strong> {interview.time_duration || 'Not specified'}</p>
            </Card>

            <Title level={5}>AI Generated Questions ({interview.questions?.length || 0})</Title>
            {interview.questions && interview.questions.length > 0 ? (
                <List
                    size="small"
                    dataSource={interview.questions}
                    renderItem={(item, index) => (
                        <List.Item>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                <Badge count={index + 1} style={{ backgroundColor: '#1890ff', marginTop: 2 }} />
                                <div>
                                    <Text>{item.question}</Text>
                                    {item.follow_up_count > 0 && (
                                        <div style={{ marginTop: 4 }}>
                                            <Tag color="blue">{item.follow_up_count} follow-up(s) allowed</Tag>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
            ) : (
                <Text type="secondary">No AI questions have been generated for this interview.</Text>
            )}
        </div>
    );
}
