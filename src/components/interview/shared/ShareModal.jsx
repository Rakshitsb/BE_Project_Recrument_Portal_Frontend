import React from 'react';
import { Modal, Input, Button, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

export function ShareModal({
    open,
    onClose,
    interviewToken,
    interviewName
}) {
    const baseUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
    const shareUrl = `${baseUrl}/interview/${interviewToken}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            message.success('Link copied!');
        } catch (err) {
            message.error('Failed to copy link');
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

                <span className="text-gray-400 text-xs italic mt-1">
                    Candidates will use this link to access and start their interview.
                </span>
            </div>
        </Modal>
    );
}
