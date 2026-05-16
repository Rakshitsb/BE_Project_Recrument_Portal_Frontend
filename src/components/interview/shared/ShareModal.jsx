import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Input, Button, message } from 'antd';
import { CheckCircleOutlined, CopyOutlined, SendOutlined } from '@ant-design/icons';
import { sendHRMessage } from '../../../services/chatbotService';

export function ShareModal({
    open,
    onClose,
    interviewToken,
    interviewName,
    interviewId,
    jobId,
    candidateId
}) {
    const [sendingToChatbot, setSendingToChatbot] = useState(false);
    const [sentToChatbot, setSentToChatbot] = useState(false);
    const baseUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
    const shareUrl = `${baseUrl}/interview/${interviewToken}`;
    const sentStorageKey = useMemo(
        () => `hirebase_interview_link_sent_to_chatbot_${interviewId || interviewToken || 'unknown'}`,
        [interviewId, interviewToken]
    );

    useEffect(() => {
        setSentToChatbot(localStorage.getItem(sentStorageKey) === 'true');
    }, [sentStorageKey, open]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            message.success('Link copied!');
        } catch {
            message.error('Failed to copy link');
        }
    };

    const handleSendToChatbot = async () => {
        if (!jobId || !candidateId) {
            message.error('Missing job or candidate details for chatbot message.');
            return;
        }

        setSendingToChatbot(true);
        try {
            const titleLabel = interviewName || 'this position';

            await sendHRMessage(jobId, candidateId, {
                message: `Congratulations! You have been invited for an AI-powered interview for the ${titleLabel} position. Click the button below to begin your interview when you are ready. Good luck!`,
                interview_link: shareUrl,
                interview_id: interviewId,
                message_type: 'interview_invite',
            });

            localStorage.setItem(sentStorageKey, 'true');
            setSentToChatbot(true);
            message.success('Interview link sent to chatbot.');
        } catch (error) {
            message.error(error.response?.data?.detail || 'Failed to send interview link to chatbot.');
        } finally {
            setSendingToChatbot(false);
        }
    };

    return (
        <Modal
            title="Share Interview Link"
            open={open}
            onCancel={onClose}
            footer={null}
            width={480}
        >
            <div className="flex flex-col gap-3 mt-4">
                <span className="text-gray-500 text-sm">
                    Send this link to {interviewName} candidate
                </span>

                <div className="flex items-center gap-2">
                    <Input
                        readOnly
                        value={shareUrl}
                        className="flex-1"
                    />
                    <Button
                        type="primary"
                        icon={<CopyOutlined />}
                        onClick={handleCopy}
                    >
                        Copy Link
                    </Button>
                </div>

                <Button
                    icon={sentToChatbot ? <CheckCircleOutlined /> : <SendOutlined />}
                    loading={sendingToChatbot}
                    disabled={sentToChatbot || !jobId || !candidateId}
                    onClick={handleSendToChatbot}
                    style={{ width: '100%', borderRadius: 8 }}
                    type={sentToChatbot ? 'default' : 'primary'}
                >
                    {sentToChatbot ? 'Already sent to chatbot' : 'Send interview link to chatbot'}
                </Button>

                <span className="text-gray-400 text-xs italic mt-1">
                    Candidates will use this link to access and start their interview.
                </span>
            </div>
        </Modal>
    );
}
