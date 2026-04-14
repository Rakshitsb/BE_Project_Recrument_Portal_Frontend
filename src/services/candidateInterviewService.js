import api from './api';

/**
 * Get all interviews assigned to the logged-in candidate.
 * Returns lightweight list (no questions field).
 * GET /interviews/candidate/my
 */
export async function getCandidateInterviews() {
    const response = await api.get('/interviews/candidate/my');
    return response.data;
}

/**
 * Get interview details for a candidate using the interview token.
 * Returns interviewer info, description, duration, question_count.
 * Questions and objective are NEVER returned here — backend enforces this.
 * GET /interviews/candidate/take/{token}
 */
export async function getInterviewByToken(token) {
    const response = await api.get(`/interviews/candidate/take/${token}`);
    return response.data;
}

/**
 * Register a Retell web call for this interview.
 * Returns { call_id, access_token, interview_id }.
 * The access_token here is the Retell SDK token — NOT the JWT auth token.
 * POST /interviews/candidate/take/{token}/register-call
 * Body: { candidate_name, candidate_email }
 */
export async function registerCall(token, candidateName, candidateEmail) {
    const response = await api.post(`/interviews/candidate/take/${token}/register-call`, {
        candidate_name: candidateName,
        candidate_email: candidateEmail
    });
    return response.data;
}

/**
 * Get the logged-in candidate's response for a specific interview.
 * Poll this every 8 seconds until is_analysed: true.
 * Returns { id, interview_id, call_id, name, duration, analytics, is_analysed, is_ended }
 * GET /interview-responses/my/{interview_id}
 */
export async function getCandidateResponse(interviewId) {
    const response = await api.get(`/interview-responses/my/${interviewId}`);
    return response.data;
}

/**
 * Update the tab switch count for a live call.
 * Send the ABSOLUTE total count — not +1 each time.
 * PATCH /interview-responses/my/tab-switch/{call_id}
 * Body: { count }
 */
export async function updateTabSwitchCount(callId, count) {
    const response = await api.patch(`/interview-responses/my/tab-switch/${callId}`, { count });
    return response.data;
}
