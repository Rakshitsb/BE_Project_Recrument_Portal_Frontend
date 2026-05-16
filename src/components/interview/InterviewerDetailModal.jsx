import React, { useRef } from 'react';
import { Modal, Typography, Row, Col, Progress } from 'antd';
import { getInterviewerMedia } from './interviewerAssets';

const { Paragraph, Text } = Typography;

export function InterviewerDetailModal({ interviewer, open, onClose }) {
    const audioRef = useRef(null);

    if (!interviewer) return null;

    const { imageUrl, audioUrl } = getInterviewerMedia(interviewer);

    const handleClose = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        onClose();
    };

    return (
        <Modal
            title={interviewer.name}
            open={open}
            onCancel={handleClose}
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

                {audioUrl && (
                    <div className="mb-4">
                        <Text strong>Voice Preview</Text>
                        <audio
                            ref={audioRef}
                            key={audioUrl}
                            controls
                            preload="metadata"
                            style={{ width: '100%', marginTop: 8 }}
                        >
                            <source src={audioUrl} type="audio/wav" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )}

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
