import React, { useState, useEffect } from 'react';
import {
  Form, Input, Select, Switch, Checkbox, Button,
  Typography, Card, List, Tag, Alert, Empty, Modal, message
} from 'antd';
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { updateInterview, archiveInterview } from '../../services/interviewService';
import { sendHRMessage } from '../../services/chatbotService';

export function EditInterviewPanel({ interview, onSaved, onArchived }) {
    const [name, setName]               = useState(interview?.name || '');
    const [timeDuration, setTimeDuration] = useState(interview?.time_duration || '30 mins');
    const [isActive, setIsActive]       = useState(interview?.is_active ?? true);
    const [context, setContext]         = useState(interview?.context || '');
    const [regenerate, setRegenerate]   = useState(false);
    const [sendUpdatedInvite, setSendUpdatedInvite] = useState(false);
    const [saving, setSaving]           = useState(false);
    const [archiving, setArchiving]     = useState(false);

    useEffect(() => {
        setName(interview?.name || '');
        setTimeDuration(interview?.time_duration || '30 mins');
        setIsActive(interview?.is_active ?? true);
        setContext(interview?.context || '');
        setRegenerate(false);
        setSendUpdatedInvite(false);
    }, [interview?.id]);

    async function sendUpdatedInterviewInvite(updatedInterview) {
        const baseUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
        const interviewUrl = `${baseUrl}/interview/${updatedInterview.interview_token}`;
        const titleLabel = updatedInterview.name || 'this position';

        await sendHRMessage(updatedInterview.job_id, updatedInterview.candidate_id, {
            message: `Your AI-powered interview for ${titleLabel} has been updated with fresh questions. Click the button below to take the interview again when you are ready. Good luck!`,
            interview_link: interviewUrl,
            interview_id: updatedInterview.id || updatedInterview._id,
            message_type: 'interview_invite',
        });
    }

    async function handleSave() {
        if (!name.trim()) {
            message.warning('Interview name is required');
            return;
        }
        setSaving(true);
        try {
            const updatedInterview = await updateInterview(interview.id, {
                name: name.trim(),
                time_duration: timeDuration,
                is_active: regenerate ? true : isActive,
                context: context.trim(),
                regenerate_questions: regenerate,
            });

            if (regenerate && sendUpdatedInvite) {
                try {
                    await sendUpdatedInterviewInvite(updatedInterview);
                    message.success('Interview updated and candidate notified');
                } catch (inviteError) {
                    message.warning(inviteError.response?.data?.detail || 'Interview updated, but the message could not be sent.');
                }
            } else {
                message.success('Interview updated successfully');
            }

            setRegenerate(false);
            setSendUpdatedInvite(false);
            onSaved();
        } catch (err) {
            message.error(err.response?.data?.detail || 'Failed to save changes');
        } finally {
            setSaving(false);
        }
    }

    function handleArchive() {
        Modal.confirm({
            title: 'Archive this interview?',
            content: 'The interview will be deactivated and hidden from the list. This cannot be undone.',
            okText: 'Yes, archive it',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                setArchiving(true);
                try {
                    await archiveInterview(interview.id);
                    message.success('Interview archived');
                    onArchived();
                } catch {
                    message.error('Failed to archive interview');
                } finally {
                    setArchiving(false);
                }
            },
        });
    }

    return (
        <div style={{ padding: 24, height: '100%', overflowY: 'auto' }}>
            {/* Section 1 — Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Typography.Title level={4} style={{ margin: 0 }}>Edit Interview</Typography.Title>
                <Button danger icon={<DeleteOutlined />} loading={archiving} onClick={handleArchive}>
                    Archive Interview
                </Button>
            </div>

            {/* Section 2 — Edit Form */}
            <Form layout="vertical" size="middle" style={{ marginBottom: 0 }}>
                <Form.Item label="Interview Name" required>
                    <Input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Backend Engineer Round 1"
                        maxLength={100}
                        showCount
                    />
                </Form.Item>

                <Form.Item label="Duration">
                    <Select value={timeDuration} onChange={setTimeDuration} style={{ width: '100%' }}>
                        <Select.Option value="15 mins">15 mins</Select.Option>
                        <Select.Option value="20 mins">20 mins</Select.Option>
                        <Select.Option value="30 mins">30 mins</Select.Option>
                        <Select.Option value="45 mins">45 mins</Select.Option>
                        <Select.Option value="60 mins">60 mins</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Interview Status" extra="Inactive interviews cannot be taken by candidates">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Switch checked={isActive} onChange={setIsActive} />
                        {isActive
                            ? <Tag color="green">Active</Tag>
                            : <Tag color="red">Inactive</Tag>
                        }
                    </div>
                </Form.Item>

                <Form.Item label="Additional Context" extra="Provide extra context to regenerate better AI questions">
                    <Input.TextArea
                        value={context}
                        onChange={e => setContext(e.target.value)}
                        rows={4}
                        maxLength={500}
                        showCount
                        placeholder="e.g. Focus on system design and distributed systems. Candidate has 3 years experience."
                    />
                </Form.Item>

                <Form.Item>
                    <Checkbox
                        checked={regenerate}
                        onChange={e => {
                            const checked = e.target.checked;
                            setRegenerate(checked);
                            setSendUpdatedInvite(checked);
                        }}
                    >
                        Regenerate AI questions using updated context
                    </Checkbox>
                    {regenerate && (
                        <Alert
                            type="warning"
                            showIcon
                            message="This will replace the questions, reactivate the interview, and let the candidate start a fresh attempt."
                            style={{ marginTop: 8 }}
                        />
                    )}
                </Form.Item>

                {regenerate && (
                    <Form.Item>
                        <Checkbox
                            checked={sendUpdatedInvite}
                            onChange={e => setSendUpdatedInvite(e.target.checked)}
                        >
                            Send updated interview message to candidate after saving
                        </Checkbox>
                    </Form.Item>
                )}
            </Form>

            <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={saving}
                onClick={handleSave}
                style={{ width: '100%', marginTop: 8 }}
            >
                Save Changes
            </Button>

            {/* Section 3 — Current Questions card */}
            <Card
                title="Current Questions"
                style={{ marginTop: 24, borderRadius: 10 }}
                extra={<Typography.Text type="secondary" style={{ fontSize: 12 }}>{interview?.questions?.length || 0} questions</Typography.Text>}
            >
                {!interview?.questions?.length ? (
                    <Empty description="No questions available" />
                ) : (
                    <List
                        dataSource={interview.questions}
                        renderItem={(item, index) => (
                            <List.Item style={{ borderBottom: 'none', paddingTop: 6, paddingBottom: 6 }}>
                                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', width: '100%' }}>
                                    <div style={{
                                        width: 22, height: 22, borderRadius: '50%',
                                        backgroundColor: '#f0fdfa', border: '1px solid #0d9488',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0, marginTop: 2
                                    }}>
                                        <Typography.Text style={{ fontSize: 11, color: '#0d9488', fontWeight: 600 }}>
                                            {index + 1}
                                        </Typography.Text>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Typography.Text style={{ fontSize: 13 }}>{item.question}</Typography.Text>
                                        {item.follow_up_count > 0 && (
                                            <div style={{ marginTop: 3 }}>
                                                <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                                                    {item.follow_up_count} follow-up{item.follow_up_count > 1 ? 's' : ''}
                                                </Typography.Text>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                )}
            </Card>
        </div>
    );
}
