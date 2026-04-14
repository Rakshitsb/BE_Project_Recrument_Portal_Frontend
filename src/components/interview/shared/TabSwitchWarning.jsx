import React from 'react';
import { Tag, Tooltip } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

export function TabSwitchWarning({ count = 0, showZero = false }) {
    if (count === 0 && !showZero) {
        return null;
    }

    return (
        <Tooltip title="Candidate switched or left the browser tab during the interview">
            <Tag color="error" icon={<WarningOutlined />}>
                Tab Switch Detected ({count}x)
            </Tag>
        </Tooltip>
    );
}
