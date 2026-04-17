import clsx from 'clsx';
import s from './component-header.module.scss';
import React from 'react';

type GroupType = (React.ReactNode | React.ReactNode[])[];

type SizeType = 'tiny' | 'small' | 'big';

interface ComponentHeaderProps {
    left?: GroupType;
    right?: GroupType;
    size?: SizeType;
}

export const ComponentHeader = ({
    left = [],
    right = [],
    size = 'small',
}: ComponentHeaderProps) => {
    const renderItems = (items: GroupType) => {
        return items.map((item, index) => (
            <React.Fragment key={index}>
                {Array.isArray(item) ? (
                    <div className={clsx(s['subgroup'], s[size])}>
                        {item.map((subItem, subIndex) => (
                            <React.Fragment key={subIndex}>{subItem}</React.Fragment>
                        ))}
                    </div>
                ) : (
                    item
                )}
            </React.Fragment>
        ));
    };

    return (
        <div className={clsx(s['component-header'])}>
            <div className={clsx(s['group'], s['wrap'], s[size])}>{renderItems(left)}</div>
            <div className={clsx(s['group'], s[size])}>{renderItems(right)}</div>
        </div>
    );
};
