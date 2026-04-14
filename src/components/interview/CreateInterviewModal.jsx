import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Form, Input, InputNumber, List, Modal, Select, Spin, Tag, Typography, message } from 'antd';
import { createInterview } from '../../services/interviewService';
import { getInterviewers } from '../../services/interviewerService';
import { applicationService, jobService } from '../../services/hrService';

const { Text, Paragraph } = Typography;

function buildCandidateAwareContext(application) {
    if (!application) return '';

    const candidateSkills = application.skills?.length ? application.skills.join(', ') : 'Not provided';
    const experience = application.experienceYears && application.experienceYears !== '—'
        ? `${application.experienceYears} years`
        : 'Not provided';
    const rawEd = application.education;
    const education = Array.isArray(rawEd)
        ? rawEd.map((e) => [e.degree, e.institution, e.year].filter(Boolean).join(', ')).join(' | ')
        : rawEd && rawEd !== '—' ? rawEd : 'Not provided';
    const location = application.location && application.location !== '—'
        ? application.location
        : 'Not provided';

    return [
        'Candidate profile signal for question generation:',
        `Candidate Name: ${application.candidateName || 'Candidate'}`,
        `Applied Role: ${application.jobTitle || 'Role not available'}`,
        `Location: ${location}`,
        `Experience: ${experience}`,
        `Education: ${education}`,
        `Skills: ${candidateSkills}`,
        application.coverLetter ? `Cover Letter Summary: ${application.coverLetter}` : '',
        'Please make roughly 30% of the questions validate the candidate background, claimed skills, and past project work while keeping the remaining questions focused on the role requirements.',
    ].filter(Boolean).join('\n');
}

export function CreateInterviewModal({ open, onClose, onCreated, prefillApplication = null }) {
    const [form] = Form.useForm();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [interviewers, setInterviewers] = useState([]);
    const [interviewersLoading, setInterviewersLoading] = useState(false);
    const [candidateOptions, setCandidateOptions] = useState([]);
    const [candidateOptionsLoading, setCandidateOptionsLoading] = useState(false);
    const [createdInterview, setCreatedInterview] = useState(null);

    useEffect(() => {
        if (!open || interviewers.length > 0) return;

        const fetchInterviewers = async () => {
            setInterviewersLoading(true);
            try {
                const data = await getInterviewers();
                setInterviewers(data || []);
            } catch (error) {
                message.error('Failed to load interviewers');
            } finally {
                setInterviewersLoading(false);
            }
        };

        fetchInterviewers();
    }, [open, interviewers.length]);

    useEffect(() => {
        if (!open || prefillApplication) return;

        const fetchCandidates = async () => {
            setCandidateOptionsLoading(true);
            try {
                const jobs = await jobService.getMyJobs();
                const applicationLists = await Promise.all(
                    (jobs || []).map((job) => applicationService.getJobApplications(job.id))
                );

                const shortlistedApplications = applicationLists
                    .flat()
                    .filter((app) => app.status === 'shortlisted' || app.status === 'interview');

                setCandidateOptions(shortlistedApplications);
            } catch (error) {
                message.error('Failed to load shortlisted candidates');
            } finally {
                setCandidateOptionsLoading(false);
            }
        };

        fetchCandidates();
    }, [open, prefillApplication]);

    useEffect(() => {
        if (!open) return;

        if (prefillApplication) {
            form.setFieldsValue({
                application_id: prefillApplication.id,
                name: `${prefillApplication.candidateName || 'Candidate'} - ${prefillApplication.jobTitle || 'Interview'}`,
                objective: `Assess fit for ${prefillApplication.jobTitle || 'the role'}, focusing on technical ability, applied problem-solving, and how the candidate profile maps to the role.`,
                question_count: 5,
                time_duration: '30 mins',
                context: buildCandidateAwareContext(prefillApplication),
            });
            return;
        }

        form.setFieldsValue({
            question_count: 5,
        });
    }, [open, prefillApplication, form]);

    const resetModal = () => {
        form.resetFields();
        setStep(1);
        setCreatedInterview(null);
        setLoading(false);
    };

    const handleClose = () => {
        if (!loading && !submitting) {
            resetModal();
            onClose();
        }
    };

    const handleGenerate = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            try {
                const response = await createInterview(values);
                setCreatedInterview(response);
                setStep(2);
            } catch (error) {
                const status = error.response?.status;
                const errorDetail = error.response?.data?.detail;

                if (status === 400) {
                    message.error(errorDetail || 'Invalid request. Candidate may not be shortlisted.');
                } else if (status === 403) {
                    message.error("You don't have access to this job's applications");
                } else if (status === 404) {
                    message.error('Application or interviewer not found');
                } else {
                    message.error('Failed to create interview. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        } catch (validationError) {
            // Form validation failed, ignore
        }
    };

    const handleDone = () => {
        onCreated(createdInterview);
        resetModal();
        onClose();
    };

    const handleCandidateSelect = (applicationId) => {
        const selectedApplication = candidateOptions.find((candidate) => candidate.id === applicationId);
        if (!selectedApplication) return;

        const currentValues = form.getFieldsValue();
        form.setFieldsValue({
            application_id: selectedApplication.id,
            name: `${selectedApplication.candidateName || 'Candidate'} - ${selectedApplication.jobTitle || 'Interview'}`,
            objective: `Assess fit for ${selectedApplication.jobTitle || 'the role'}, focusing on technical ability, applied problem-solving, and how the candidate profile maps to the role.`,
            time_duration: currentValues.time_duration || '30 mins',
            question_count: currentValues.question_count || 5,
            context: buildCandidateAwareContext(selectedApplication),
        });
    };

    return (
        <Modal
            title={step === 1 ? 'Create New Interview' : 'Interview Created'}
            width={640}
            open={open}
            onCancel={handleClose}
            footer={null}
            destroyOnClose
        >
            {step === 1 && (
                <div className="mt-4">
                    <Form form={form} layout="vertical">
                        {prefillApplication && (
                            <Card size="small" style={{ borderRadius: 10, marginBottom: 16, backgroundColor: '#f0fdfa', borderColor: '#99f6e4' }}>
                                <Text strong style={{ display: 'block', marginBottom: 8 }}>Interview target</Text>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                                    <Tag color="cyan">{prefillApplication.candidateName}</Tag>
                                    <Tag color="blue">{prefillApplication.jobTitle}</Tag>
                                    <Tag color="gold">{prefillApplication.status}</Tag>
                                </div>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    The candidate application is already selected and candidate-profile context has been prepared for question generation.
                                </Text>
                            </Card>
                        )}

                        <Form.Item
                            name="application_id"
                            label={prefillApplication ? 'Application' : 'Candidate'}
                            rules={[{ required: true, message: 'Please select a candidate application' }]}
                            extra={prefillApplication ? 'This interview is linked to the selected shortlisted candidate.' : 'Choose a shortlisted candidate. The application ID will be attached automatically.'}
                        >
                            {prefillApplication ? (
                                <Input
                                    placeholder="Paste the application ID for the shortlisted candidate"
                                    disabled
                                />
                            ) : (
                                <Select
                                    showSearch
                                    placeholder="Select shortlisted candidate"
                                    loading={candidateOptionsLoading}
                                    notFoundContent={candidateOptionsLoading ? <Spin size="small" /> : 'No shortlisted candidates found'}
                                    optionFilterProp="label"
                                    onChange={handleCandidateSelect}
                                    options={candidateOptions.map((application) => ({
                                        value: application.id,
                                        label: `${application.candidateName} - ${application.jobTitle} - ${application.status}`,
                                    }))}
                                    optionRender={(option) => {
                                        const application = candidateOptions.find((candidate) => candidate.id === option.value);
                                        if (!application) return option.label;
                                        return (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{application.candidateName}</div>
                                                    <div style={{ fontSize: 12, color: '#64748b' }}>{application.jobTitle}</div>
                                                </div>
                                                <Tag color={application.status === 'shortlisted' ? 'gold' : 'blue'} style={{ margin: 0, alignSelf: 'center' }}>
                                                    {application.status}
                                                </Tag>
                                            </div>
                                        );
                                    }}
                                />
                            )}
                        </Form.Item>

                        <Form.Item
                            name="interviewer_id"
                            label="AI Interviewer"
                            rules={[{ required: true, message: 'Please select an interviewer' }]}
                        >
                            <Select
                                placeholder="Select an interviewer persona"
                                loading={interviewersLoading}
                                notFoundContent={interviewersLoading ? <Spin size="small" /> : null}
                                options={interviewers.map((item) => ({
                                    value: item.id,
                                    label: item.name,
                                }))}
                            />
                        </Form.Item>

                        <Form.Item
                            name="name"
                            label="Interview Name"
                            rules={[
                                { required: true, message: 'Interview name is required' },
                                { max: 80, message: 'Name cannot exceed 80 characters' },
                            ]}
                        >
                            <Input placeholder="e.g. Backend Engineer Round 1" />
                        </Form.Item>

                        <Form.Item
                            name="objective"
                            label="Objective"
                            rules={[{ required: true, message: 'Objective is required' }]}
                        >
                            <Input.TextArea rows={3} placeholder="What should this interview assess? e.g. Python skills, system design" />
                        </Form.Item>

                        <Form.Item
                            name="question_count"
                            label="Number of Questions"
                            rules={[{ required: true, message: 'Question count is required' }]}
                        >
                            <InputNumber min={1} max={10} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            name="time_duration"
                            label="Duration"
                            rules={[{ required: true, message: 'Duration is required' }]}
                        >
                            <Input placeholder="e.g. 30 mins" />
                        </Form.Item>

                        <Form.Item
                            name="context"
                            label="Additional Context"
                        >
                            <Input.TextArea rows={5} placeholder="Any extra context for question generation e.g. candidate resume summary" />
                        </Form.Item>

                        <div className="flex justify-end mt-6">
                            <Button onClick={handleClose} className="mr-2" disabled={loading}>
                                Cancel
                            </Button>
                            <Button type="primary" onClick={handleGenerate} loading={loading}>
                                Generate Interview
                            </Button>
                        </div>
                    </Form>
                </div>
            )}

            {step === 2 && createdInterview && (
                <div className="mt-4">
                    <Alert
                        type="success"
                        showIcon
                        message={`Interview "${createdInterview?.name}" created successfully`}
                        description={`AI generated ${createdInterview?.question_count} questions based on the role, objective, and candidate context.`}
                        style={{ marginBottom: 16 }}
                    />

                    <div className="mb-4">
                        <Text strong>AI-Generated Description:</Text>
                        <Paragraph italic className="text-gray-500 mt-1">
                            {createdInterview?.description}
                        </Paragraph>
                    </div>

                    <div className="mb-4">
                        <Text strong>Generated Questions:</Text>
                        <List
                            className="mt-2"
                            dataSource={createdInterview?.questions || []}
                            renderItem={(item, index) => (
                                <List.Item style={{ borderLeft: '3px solid #0d9488', paddingLeft: 12, marginBottom: 8 }}>
                                    <div>
                                        <span className="font-semibold mr-2">{index + 1}.</span>
                                        {item.question}
                                    </div>
                                </List.Item>
                            )}
                        />
                    </div>

                    <div className="flex justify-end mt-6">
                        <Button
                            onClick={() => { setStep(1); setCreatedInterview(null); }}
                            className="mr-2"
                            disabled={submitting}
                        >
                            Back
                        </Button>
                        <Button
                            type="primary"
                            style={{ backgroundColor: '#0d9488', borderColor: '#0d9488' }}
                            onClick={handleDone}
                            loading={submitting}
                        >
                            Done
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
}
