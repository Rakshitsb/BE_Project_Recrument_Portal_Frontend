import React from 'react';
import { Card, Tooltip, Popconfirm, message } from 'antd';
import { ShareAltOutlined, EyeOutlined, DeleteOutlined, ClockCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { InterviewStatusTag } from './shared/InterviewStatusTag';
import { archiveInterview } from '../../services/interviewService';

export function InterviewCard({ interview, onArchive, onShare }) {
    const navigate = useNavigate();

    const handleArchive = async () => {
        try {
            await archiveInterview(interview.id);
            message.success('Interview archived');
            onArchive(interview.id);
        } catch (error) {
            message.error('Failed to archive interview');
        }
    };

    return (
        <Card
            hoverable
            style={{ width: 220, marginRight: 16, marginBottom: 16, borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb' }}
            cover={
                <div style={{ height: 120, background: 'linear-gradient(135deg, #0d9488 0%, #6366f1 100%)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 8, right: 8 }}>
                        <InterviewStatusTag isActive={interview.is_active} isArchived={interview.is_archived} />
                    </div>
                    <div className="flex h-full items-center justify-center p-3 text-center text-white font-semibold text-[15px]">
                        {interview.name}
                    </div>
                </div>
            }
            bodyStyle={{ padding: 16 }}
            actions={[
                <Tooltip title="Share Link" key="share">
                    <ShareAltOutlined onClick={(e) => { e.stopPropagation(); onShare(interview); }} />
                </Tooltip>,
                <Tooltip title="View Details" key="view">
                    <EyeOutlined onClick={(e) => { e.stopPropagation(); navigate(`/hr/interviews/${interview.id}`); }} />
                </Tooltip>,
                <div key="archive" onClick={(e) => e.stopPropagation()} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Tooltip title="Archive">
                        <Popconfirm
                            title="Archive this interview?"
                            description="It will be deactivated and hidden from the list."
                            onConfirm={handleArchive}
                            okText="Yes"
                            cancelText="No"
                        >
                            <DeleteOutlined />
                        </Popconfirm>
                    </Tooltip>
                </div>
            ]}
        >
            <div className="flex items-center gap-2 mb-1.5 text-gray-500 text-sm">
                <ClockCircleOutlined />
                <span>{interview.time_duration}</span>
            </div>
            <div className="flex items-center gap-2 mb-1.5 text-gray-500 text-sm">
                <TeamOutlined />
                <span>{interview.response_count || 0} Response{interview.response_count !== 1 ? 's' : ''}</span>
            </div>
            <div className="text-gray-400 text-xs">
                {new Date(interview.created_at).toLocaleDateString()}
            </div>
        </Card>
    );
}
