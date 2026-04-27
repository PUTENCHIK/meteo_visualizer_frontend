import clsx from 'clsx';
import s from './component-columns-box.module.scss';

interface ComponentColumnsBoxProps {
    children: React.ReactNode[];
}

export const ComponentColumnsBox = ({ children }: ComponentColumnsBoxProps) => {
    return (
        <div className={clsx(s['component-columns-box'])}>
            {children.map((child, index) => (
                <div key={index} className={clsx(s['column-box'])}>
                    {child}
                </div>
            ))}
        </div>
    );
};
