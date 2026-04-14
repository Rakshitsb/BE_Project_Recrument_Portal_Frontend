import React from 'react';
import { Tag } from 'antd';

export function InterviewStatusTag({ isActive, isArchived }) {
    if (isArchived) {
        return <Tag color="default">Archived</Tag>;
    }
    
    if (isActive) {
        return <Tag color="success">Active</Tag>;
    }
    
    return <Tag color="warning">Inactive</Tag>;
}
