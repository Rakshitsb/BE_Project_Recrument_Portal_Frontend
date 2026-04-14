import React, { useState, useEffect } from 'react';
import { Avatar, Typography, Divider, Card, Tag, Statistic, Empty, message, Skeleton } from 'antd';
import { UserOutlined, ClockCircleOutlined, CheckCircleOutlined, CalendarOutlined, WarningOutlined } from '@ant-design/icons';
import { getResponseDetail, updateResponseStatus } from '../../services/interviewResponseService';
import { ScoreRing } from './shared/ScoreRing';
import { CandidateStatusSelect } from './shared/CandidateStatusSelect';

const { Text, Paragraph } = Typography;

function formatDuration(seconds) {
  if (!seconds) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function CandidateResponsePanel({ interviewId, responseId, onStatusChange }) {
    const [response, setResponse] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusUpdating, setStatusUpdating] = useState(false);

    useEffect(() => {
        if (!interviewId || !responseId) return;

        setLoading(true);
        getResponseDetail(interviewId, responseId)
            .then(data => {
                setResponse(data);
                setAnalytics(data?.analytics || null);
                setLoading(false);
            })
            .catch(err => {
                message.error('Failed to load response');
                setLoading(false);
            });
    }, [interviewId, responseId]);

    const handleStatusChangeInternal = async (id, newStatus) => {
        try {
            await updateResponseStatus(id, { candidate_status: newStatus });
            message.success('Status updated');
            setResponse(prev => prev ? { ...prev, candidate_status: newStatus } : prev);
            if (onStatusChange) {
                onStatusChange(id, newStatus);
            }
        } catch (error) {
            message.error('Failed to update status');
        }
    };

    if (loading) {
        return (
            <div style={{ padding: 24, height: '100%', overflowY: 'auto' }}>
                <Skeleton active paragraph={{ rows: 3 }} style={{ marginBottom: 16 }} />
                <Skeleton active paragraph={{ rows: 4 }} style={{ marginBottom: 16 }} />
                <Skeleton active paragraph={{ rows: 3 }} style={{ marginBottom: 16 }} />
            </div>
        );
    }

    return (
        <div style={{ padding: 24, height: '100%', overflowY: 'auto' }}>
            {/* Section 1 — Candidate header bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar size={48} icon={<UserOutlined />} style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text strong style={{ fontSize: 16 }}>{response?.name || 'Candidate'}</Text>
                        <Text type="secondary" style={{ fontSize: 13 }}>{response?.email}</Text>
                    </div>
                </div>
                <div>
                    <CandidateStatusSelect 
                        value={response?.candidate_status} 
                        loading={statusUpdating}
                        onChange={async (newStatus) => {
                            if (!responseId) return;
                            setStatusUpdating(true);
                            try {
                                await handleStatusChangeInternal(responseId, newStatus);
                            } finally {
                                setStatusUpdating(false);
                            }
                        }}
                    />
                </div>
            </div>

            <Divider style={{ margin: 0, marginBottom: 24 }} />

            {/* Section 2 — Score cards row */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
                <Card style={{ borderRadius: 10, flex: 1, minWidth: 180 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <ScoreRing value={analytics?.overallScore ?? 0} max={100} size={90} label="Overall Score" />
                        <Text type="secondary" style={{ fontSize: 12, textAlign: 'center', display: 'block', marginTop: 8 }}>
                            {analytics?.overallFeedback || '—'}
                        </Text>
                    </div>
                </Card>
                <Card style={{ borderRadius: 10, flex: 1, minWidth: 180 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <ScoreRing value={analytics?.communication?.score ?? 0} max={10} size={90} label="Communication" />
                        <Text type="secondary" style={{ fontSize: 12, textAlign: 'center', display: 'block', marginTop: 8 }}>
                            {analytics?.communication?.feedback || '—'}
                        </Text>
                    </div>
                </Card>
                <Card style={{ borderRadius: 10, flex: 1, minWidth: 180 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                        <Text strong style={{ display: 'block', marginBottom: 8 }}>Soft Skills</Text>
                        {analytics?.softSkillSummary ? (
                            <Tag color="cyan" style={{ fontSize: 13, padding: '4px 10px', margin: 0, marginBottom: response?.tab_switch_count > 0 ? 8 : 0 }}>
                                {analytics.softSkillSummary}
                            </Tag>
                        ) : (
                            <Text type="secondary" style={{ marginBottom: response?.tab_switch_count > 0 ? 8 : 0 }}>—</Text>
                        )}
                        {response?.tab_switch_count > 0 && (
                            <Tag color="orange" icon={<WarningOutlined />} style={{ margin: 0, marginTop: 8 }}>
                                {response.tab_switch_count} tab switch{response.tab_switch_count > 1 ? 'es' : ''}
                            </Tag>
                        )}
                    </div>
                </Card>
            </div>

            {/* Section 3 — Interview duration + meta row */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                <Statistic 
                    title="Duration" 
                    value={formatDuration(response?.duration)} 
                    prefix={<ClockCircleOutlined style={{ color: '#6366f1' }} />} 
                    valueStyle={{ color: '#6366f1', fontSize: 18 }} 
                />
                <Statistic 
                    title="Interview" 
                    value={response?.interview_id ? 'Completed' : '—'} 
                    prefix={<CheckCircleOutlined style={{ color: '#10b981' }} />} 
                    valueStyle={{ color: '#10b981', fontSize: 18 }} 
                />
                <Statistic 
                    title="Completed" 
                    value={response?.created_at ? new Date(response.created_at).toLocaleDateString() : '—'} 
                    prefix={<CalendarOutlined style={{ color: '#f59e0b' }} />} 
                    valueStyle={{ color: '#f59e0b', fontSize: 18 }} 
                />
            </div>

            {/* Section 4 — Question Summaries */}
            <Card title="Question Summaries" style={{ borderRadius: 10, marginBottom: 16 }}>
                {!analytics?.questionSummaries || analytics.questionSummaries.length === 0 ? (
                    <Empty description="No question data available" />
                ) : (
                    analytics.questionSummaries.map((item, index) => (
                        <div key={index} style={{ marginBottom: index === analytics.questionSummaries.length - 1 ? 0 : 16, paddingBottom: index === analytics.questionSummaries.length - 1 ? 0 : 16, borderBottom: index === analytics.questionSummaries.length - 1 ? 'none' : '1px solid #f0f0f0' }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
                                <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: '#f0fdfa', border: '1px solid #0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Text style={{ fontSize: 11, color: '#0d9488', fontWeight: 600 }}>{index + 1}</Text>
                                </div>
                                <Text strong style={{ fontSize: 13 }}>{item.question}</Text>
                            </div>
                            <div style={{ paddingLeft: 30 }}>
                                {item.summary === 'Not Asked' || item.summary === 'Not Answered' ? (
                                    <Tag color="default">{item.summary}</Tag>
                                ) : (
                                    <Text type="secondary" style={{ fontSize: 13 }}>{item.summary}</Text>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </Card>

            {/* Section 5 — Overall Feedback card */}
            <Card title="Overall Feedback" style={{ borderRadius: 10, marginBottom: 16 }}>
                <Paragraph style={{ fontSize: 14, margin: 0 }}>
                    {analytics?.overallFeedback || 'Analysis not yet available.'}
                </Paragraph>
            </Card>
        </div>
    );
}
