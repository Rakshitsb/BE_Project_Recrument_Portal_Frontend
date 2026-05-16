const PUBLIC_ASSETS = {
    lisa: {
        image: '/interviewers/Lisa.png',
        audio: '/audio/Lisa.wav',
    },
    bob: {
        image: '/interviewers/Bob.png',
        audio: '/audio/Bob.wav',
    },
};

const resolveApiAsset = (path) => {
    if (!path) return null;
    if (/^(https?:|data:|blob:)/i.test(path)) return path;
    if (path.startsWith('/interviewers/') || path.startsWith('/audio/')) return path;

    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    return baseUrl ? `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}` : path;
};

const getLocalPersonaKey = (interviewer) => {
    const source = `${interviewer?.name || ''} ${interviewer?.slug || ''}`.toLowerCase();

    if (source.includes('lisa')) return 'lisa';
    if (source.includes('bob')) return 'bob';

    return null;
};

export const getInterviewerMedia = (interviewer) => {
    const localPersonaKey = getLocalPersonaKey(interviewer);
    const localAssets = localPersonaKey ? PUBLIC_ASSETS[localPersonaKey] : {};
    const apiImageUrl = resolveApiAsset(interviewer?.image);
    const apiAudioUrl = resolveApiAsset(interviewer?.audio || interviewer?.voice_sample || interviewer?.voiceSample);

    return {
        imageUrl: localAssets?.image || apiImageUrl || null,
        audioUrl: localAssets?.audio || apiAudioUrl || null,
    };
};
