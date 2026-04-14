import React, { useState } from 'react';
import { Select, Skeleton, Avatar, Typography, Badge, Tooltip, message, Empty } from 'antd';
import { TabSwitchWarning } from './shared/TabSwitchWarning';
import { CandidateStatusSelect } from './shared/CandidateStatusSelect';
import { updateResponseStatus } from '../../services/interviewResponseService';

const { Text } = Typography;

export function ResponseSidebar({ responses, loading, activeResponseId, onSelectResponse, onStatusChange, interviewId }) {
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [updatingId, setUpdatingId] = useState(null);

    const filteredResponses = responses.filter(r => {
        if (filterStatus === 'ALL') return true;
        return r.candidate_status === filterStatus;
    });

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="flex-none" style={{ marginBottom: 12 }}>
                <Select
                    style={{ width: '100%' }}
                    defaultValue="ALL"
                    value={filterStatus}
                    onChange={setFilterStatus}
                    options={[
                        { value: 'ALL', label: 'All Responses' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'selected', label: 'Selected' },
                        { value: 'rejected', label: 'Rejected' },
                    ]}
                />
            </div>

            <div style={{ overflowY: 'auto', flex: 1, paddingRight: 4 }}>
                {loading ? (
                    <div style={{ padding: 8 }}>
                        <Skeleton active avatar paragraph={{ rows: 1 }} />
                        <Skeleton active avatar paragraph={{ rows: 1 }} style={{ marginTop: 16 }} />
                        <Skeleton active avatar paragraph={{ rows: 1 }} style={{ marginTop: 16 }} />
                    </div>
                ) : filteredResponses.length === 0 ? (
                    <Empty description="No responses yet" imageStyle={{ height: 60 }} />
                ) : (
                    filteredResponses.map(response => {
                        const isActive = activeResponseId === response.id;
                        return (
                            <div
                                key={response.id}
                                onClick={() => onSelectResponse(response)}
                                style={{
                                    cursor: 'pointer',
                                    padding: '10px 12px',
                                    borderRadius: 8,
                                    marginBottom: 8,
                                    border: '1px solid',
                                    borderColor: isActive ? '#0d9488' : '#e5e7eb',
                                    backgroundColor: isActive ? '#f0fdfa' : '#fff',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <Avatar size={32} style={{ backgroundColor: '#0d9488' }}>
                                            {response.name ? response.name.charAt(0).toUpperCase() : '?'}
                                        </Avatar>
                                        <div style={{ marginLeft: 8 }}>
                                            <div style={{ lineHeight: '1.2' }}>
                                                <Text strong style={{ fontSize: 13 }}>
                                                    {response.name || 'Anonymous'}
                                                </Text>
                                            </div>
                                            <div>
                                                <Text type="secondary" style={{ fontSize: 11 }}>
                                                    {new Date(response.created_at).toLocaleDateString()}
                                                </Text>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!response.is_viewed && (
                                            <Tooltip title="New response">
                                                <Badge dot color="#0d9488" />
                                            </Tooltip>
                                        )}
                                        {response.is_analysed && response.analytics?.overallScore !== undefined && (
                                            <Tooltip title="Overall Score">
                                                <div style={{
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: '50%',
                                                    border: '2px solid #0d9488',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Text style={{ fontSize: 10, color: '#0d9488', fontWeight: 600 }}>
                                                        {response.analytics.overallScore}
                                                    </Text>
                                                </div>
                                            </Tooltip>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <div>
                                        <TabSwitchWarning count={response.tab_switch_count || 0} />
                                    </div>
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <CandidateStatusSelect
                                            value={response.candidate_status}
                                            size="small"
                                            loading={updatingId === response.id}
                                            onChange={async (newStatus) => {
                                                setUpdatingId(response.id);
                                                try {
                                                    await updateResponseStatus(response.id, { candidate_status: newStatus });
                                                    onStatusChange(response.id, newStatus);
                                                    message.success('Status updated');
                                                } catch (error) {
                                                    message.error('Failed to update status');
                                                } finally {
                                                    setUpdatingId(null);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
