import api from '../services/api';

/**
 * HR — get all responses for an interview (also marks them as viewed on backend)
 * @param {string} interviewId 
 * @returns {Promise<any>}
 */
export const getResponsesByInterviewId = async (interviewId) => {
    const response = await api.get(`/interview-responses/${interviewId}`);
    return response.data;
};

/**
 * HR — get a single response with full analytics
 * @param {string} interviewId 
 * @param {string} responseId 
 * @returns {Promise<any>}
 */
export const getResponseDetail = async (interviewId, responseId) => {
    const response = await api.get(`/interview-responses/${interviewId}/${responseId}`);
    return response.data;
};

/**
 * HR — update candidate status for a response
 * @param {string} responseId 
 * @param {Object} body - { candidate_status: 'pending' | 'selected' | 'rejected' }
 * @returns {Promise<any>}
 */
export const updateResponseStatus = async (responseId, body) => {
    const response = await api.patch(`/interview-responses/${responseId}/status`, body);
    return response.data;
};
