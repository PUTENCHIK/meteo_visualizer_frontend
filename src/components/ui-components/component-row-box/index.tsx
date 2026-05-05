import clsx from 'clsx';
import s from './component-row-box.module.scss';
import React from 'react';

type GroupType = (React.ReactNode | React.ReactNode[])[];

type SizeType = 'tiny' | 'small' | 'big';

interface ComponentRowBoxProps {
    left?: GroupType;
    right?: GroupType;
    size?: SizeType;
    wrap?: boolean;
}

export const ComponentRowBox = ({
    left = [],
    right = [],
    size = 'small',
    wrap = true,
}: ComponentRowBoxProps) => {
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
        <div className={clsx(s['component-row-box'])}>
            <div className={clsx(s['group'], wrap && s['wrap'], s[size])}>{renderItems(left)}</div>
            <div className={clsx(s['group'], s[size])}>{renderItems(right)}</div>
        </div>
    );
};
