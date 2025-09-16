import { useEffect, useRef, useState } from 'react';
import s from './style.module.css';
import { Typography, TypographyProps } from 'shared/ui/typography';
import clsx from 'clsx';

interface RunningLineProps extends TypographyProps {
    texts: string[];
    speed?: number;
}

export const RunningLine: React.FC<RunningLineProps> = ({ 
    texts, 
    speed = 50,
    ...props
}) => {
    const [runningWidth, setRunningWidth] = useState(0);
    const runningRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (runningRef.current) setRunningWidth(runningRef.current.scrollWidth)
    }, [texts]);

    return (
        <div className={clsx(s.container, 'running_line')}>
            <Typography
                color='primary'
                align='center'
                ref={runningRef}
                className={s.text}
                style={{
                    animationDuration: `${(runningWidth / speed)}s`,
                }}
                {...props}
            >
                {texts.map((text, index) => (
                    <Typography
                        key={index}
                        color='primary'
                        align='center'
                    >
                        {text}
                    </Typography>
                ))}
            </Typography>
        </div>
    );
};