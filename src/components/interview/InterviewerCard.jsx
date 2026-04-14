import React, { useState } from 'react';
import { Card, Typography, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { InterviewerDetailModal } from './InterviewerDetailModal';

const { Text } = Typography;

export function InterviewerCard({ interviewer }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    const imageUrl = interviewer.image ? `${import.meta.env.VITE_API_BASE_URL}${interviewer.image}` : null;

    return (
        <>
            <Card
                hoverable
                style={{ width: 160, height: 200 }}
                bodyStyle={{ padding: 0 }}
                styles={{ body: { padding: 0 } }}
                onClick={() => setModalOpen(true)}
            >
                <div style={{ height: 120, borderTopLeftRadius: 8, borderTopRightRadius: 8 }} className="w-full flex justify-center items-center bg-gray-100 overflow-hidden">
                    {!imageError && imageUrl ? (
                        <img 
                            src={imageUrl} 
                            alt={interviewer.name}
                            onError={() => setImageError(true)}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Avatar size={64} icon={<UserOutlined />} />
                    )}
                </div>
                <div style={{ height: 80 }} className="flex justify-center items-center px-2 text-center">
                    <Text strong>{interviewer.name}</Text>
                </div>
            </Card>

            <InterviewerDetailModal 
                interviewer={interviewer} 
                open={modalOpen} 
                onClose={() => setModalOpen(false)} 
            />
        </>
    );
}
