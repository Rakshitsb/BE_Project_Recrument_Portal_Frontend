import api from '../services/api';

/**
 * HR — get all interviews (list, no questions field)
 * @returns {Promise<any>}
 */
export const getInterviews = async () => {
    const response = await api.get('/interviews/');
    return response.data;
};

/**
 * HR — get single interview with questions
 * @param {string} interviewId 
 * @returns {Promise<any>}
 */
export const getInterviewById = async (interviewId) => {
    const response = await api.get(`/interviews/${interviewId}`);
    return response.data;
};

/**
 * HR — create a new interview
 * @param {Object} body - { application_id, interviewer_id, name, objective, question_count, time_duration, context }
 * @returns {Promise<any>}
 */
export const createInterview = async (body) => {
    const response = await api.post('/interviews/', body);
    return response.data;
};

/**
 * HR — update interview
 * @param {string} interviewId 
 * @param {Object} body - (name, time_duration, is_active, regenerate_questions, context)
 * @returns {Promise<any>}
 */
export const updateInterview = async (interviewId, body) => {
    const response = await api.patch(`/interviews/${interviewId}`, body);
    return response.data;
};

/**
 * HR — archive/delete interview (soft delete)
 * @param {string} interviewId 
 * @returns {Promise<any>}
 */
export const archiveInterview = async (interviewId) => {
    const response = await api.delete(`/interviews/${interviewId}`);
    return response.data;
};
