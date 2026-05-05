import clsx from 'clsx';
import s from './component-columns-box.module.scss';

type GapSize = 'tiny' | 'normal';

interface ComponentColumnsBoxProps {
    size?: GapSize;
    children: React.ReactNode[];
}

export const ComponentColumnsBox = ({ size = 'normal', children }: ComponentColumnsBoxProps) => {
    return (
        <div className={clsx(s['component-columns-box'], s[size])}>
            {children.map((child, index) => (
                <div key={index} className={clsx(s['column-box'])}>
                    {child}
                </div>
            ))}
        </div>
    );
};
