import React from 'react';
import { Modal, Typography, Row, Col, Progress } from 'antd';

const { Paragraph, Text } = Typography;

export function InterviewerDetailModal({ interviewer, open, onClose }) {
    if (!interviewer) return null;

    const imageUrl = interviewer.image ? `${import.meta.env.VITE_API_BASE_URL}${interviewer.image}` : null;

    return (
        <Modal
            title={interviewer.name}
            open={open}
            onCancel={onClose}
            footer={null}
            width={480}
        >
            <div className="flex flex-col">
                {imageUrl && (
                    <div style={{ overflow: 'hidden', borderRadius: 8 }}>
                        <img 
                            src={imageUrl} 
                            alt={interviewer.name} 
                            className="w-full object-cover"
                            style={{ maxHeight: 200 }} 
                        />
                    </div>
                )}
                
                <Paragraph className="mt-4 text-gray-500" style={{ color: 'gray' }}>
                    {interviewer.description}
                </Paragraph>

                <Text strong className="mb-2">Personality Traits</Text>

                <Row align="middle" className="mb-2">
                    <Col span={8}><Text>Empathy</Text></Col>
                    <Col span={16}>
                        <Progress percent={(interviewer.empathy / 10) * 100} showInfo={false} strokeColor="#0d9488" />
                    </Col>
                </Row>
                
                <Row align="middle" className="mb-2">
                    <Col span={8}><Text>Exploration</Text></Col>
                    <Col span={16}>
                        <Progress percent={(interviewer.exploration / 10) * 100} showInfo={false} strokeColor="#6366f1" />
                    </Col>
                </Row>
                
                <Row align="middle" className="mb-2">
                    <Col span={8}><Text>Rapport</Text></Col>
                    <Col span={16}>
                        <Progress percent={(interviewer.rapport / 10) * 100} showInfo={false} strokeColor="#f59e0b" />
                    </Col>
                </Row>
                
                <Row align="middle" className="mb-4">
                    <Col span={8}><Text>Speed</Text></Col>
                    <Col span={16}>
                        <Progress percent={(interviewer.speed / 10) * 100} showInfo={false} strokeColor="#10b981" />
                    </Col>
                </Row>

                <Text type="secondary" italic style={{ fontSize: '12px' }}>
                    This AI persona will conduct the voice interview on your behalf.
                </Text>
            </div>
        </Modal>
    );
}
