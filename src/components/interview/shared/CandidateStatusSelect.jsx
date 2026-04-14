import React from 'react';
import { Select, Spin } from 'antd';

export function CandidateStatusSelect({
    value,
    onChange,
    loading = false,
    size = 'middle'
}) {
    if (loading) {
        return (
            <div className="inline-flex items-center justify-center" style={{ minWidth: 130 }}>
                <Spin size="small" />
            </div>
        );
    }

    return (
        <Select
            value={value}
            onChange={onChange}
            size={size}
            style={{ minWidth: 130 }}
            options={[
                {
                    value: 'pending',
                    label: (
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                            Pending
                        </div>
                    )
                },
                {
                    value: 'selected',
                    label: (
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Selected
                        </div>
                    )
                },
                {
                    value: 'rejected',
                    label: (
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            Rejected
                        </div>
                    )
                }
            ]}
        />
    );
}
