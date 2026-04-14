import api from '../services/api';

/**
 * HR/admin — get all interviewers (AI personas)
 * @returns {Promise<any>}
 */
export const getInterviewers = async () => {
    const response = await api.get('/interviewers/');
    return response.data;
};

/**
 * HR/admin — get single interviewer
 * @param {string} interviewerId 
 * @returns {Promise<any>}
 */
export const getInterviewerById = async (interviewerId) => {
    const response = await api.get(`/interviewers/${interviewerId}`);
    return response.data;
};
