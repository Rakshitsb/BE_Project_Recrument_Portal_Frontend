import React from 'react';
import { Progress } from 'antd';

export function ScoreRing({
    value = 0,
    max = 100,
    size = 80,
    label,
    color = '#0d9488'
}) {
    const percentage = (value / max) * 100;
    
    const formatValue = () => {
        if (max === 10) return `${value}/10`;
        return `${value}`;
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <Progress 
                type="circle" 
                percent={percentage} 
                size={size} 
                strokeColor={color}
                format={formatValue}
            />
            {label && (
                <span className="text-gray-500 text-xs mt-2 text-center">
                    {label}
                </span>
            )}
        </div>
    );
}
