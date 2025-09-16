import clsx from 'clsx';
import { motion, useAnimation } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import { Typography } from 'shared/ui/typography';

type ProgressProps = {
  current: number;
  ath: number;
  prev_ath: number;
  between?: ReactNode;
  lastTxTimestamp: number; // время последней сделки (ms)
};

export const Progress = ({ current, ath, lastTxTimestamp, prev_ath, between }: ProgressProps) => {
  const rawPercent = Number(((current / ath) * 100).toFixed(4));
  const progress = Math.min(rawPercent, 100);
  const isOver = current >= ath;

  const [particles, setParticles] = useState<{ id: number; x: number; directionY: 1 | -1; directionX: 1 | -1 }[]>([]);
  const [animateParticles, setAnimateParticles] = useState(false);
  const [displayPercent, setDisplayPercent] = useState(0);

  const borderControls = useAnimation();

  // Плавная анимация числа процента (разница относительно ATH)
  useEffect(() => {
    let targetPercent = 0;

    if (current < ath) {
      // считаем от текущего ATH (как раньше)
      targetPercent = ((ath - current) / ath) * 100;
    } else {
      // считаем от предыдущего ATH
      targetPercent = ((current - prev_ath) / prev_ath) * 100;
    }

    targetPercent = Number(targetPercent.toFixed(2));

    let start = displayPercent;
    if (start === targetPercent) return;

    const stepTime = 20;
    const steps = 50;
    let stepCount = 0;

    const interval = setInterval(() => {
      stepCount++;
      const next = start + ((targetPercent - start) * stepCount) / steps;
      setDisplayPercent(Number(next.toFixed(2)));
      if (stepCount >= steps) clearInterval(interval);
    }, stepTime);

    return () => clearInterval(interval);
  }, [current, ath, prev_ath]);
  useEffect(() => {
    if (isOver) {
      borderControls.start({
        boxShadow: ['0 0 4px rgba(251,191,36,0.3)', '0 0 10px rgba(251,191,36,0.6)', '0 0 4px rgba(251,191,36,0.3)'],
        transition: { duration: 1.2, repeat: Infinity, repeatType: 'mirror' },
      });
    } else {
      borderControls.stop();
      borderControls.set({ boxShadow: 'none' });
    }
  }, [isOver, borderControls]);

  // === Частицы ===
  useEffect(() => {
    if (isOver && Date.now() - lastTxTimestamp * 1000 <= 60000) {
      setAnimateParticles(true);
      const timer = setTimeout(() => {
        setAnimateParticles(false);
        setParticles([]);
      }, 60000);
      return () => clearTimeout(timer);
    }
  }, [isOver, lastTxTimestamp]);

  useEffect(() => {
    if (animateParticles && isOver) {
      const interval = setInterval(() => {
        setParticles((p) => [
          ...p,
          {
            id: Date.now(),
            x: Math.random() * 10,
            directionX: Math.random() > 0.5 ? 1 : -1,
            directionY: Math.random() > 0.5 ? 1 : -1,
          },
        ]);
        setTimeout(() => setParticles((p) => p.slice(1)), 1000);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [animateParticles, isOver]);

  // Стрелка: вверх если current > ath, вниз если current < ath
  const arrow = current >= ath ? 'arrow_up' : 'arrow_down';

  return (
    <div className="flex items-center gap-2">
      <motion.div className="bg-separator relative h-2 w-[68px] min-w-0 rounded-full" animate={borderControls}>
        {/* Прогресс */}
        <motion.div
          className="h-full rounded-full"
          style={{ width: `${progress}%` }}
          animate={{
            background: !isOver
              ? ['#34d399', '#34d399aa', '#34d399']
              : [
                  'linear-gradient(90deg,#f59e0b 0%,#fbbf24 15%,#fcd34d 30%,#fbbf24 45%,#f59e0b 60%,#fcd34d 75%,#fbbf24 90%,#f59e0b 100%)',
                  'linear-gradient(90deg,#f59e0b 0%,#fbbf24 15%,#fcd34d 30%,#fbbf24 45%,#f59e0b 60%,#fcd34d 75%,#fbbf24 90%,#fbbf24 100%)',
                  'linear-gradient(90deg,#f59e0b 0%,#fbbf24 15%,#fcd34d 30%,#fbbf24 45%,#f59e0b 60%,#fcd34d 75%,#fbbf24 90%,#f59e0b 100%)',
                ],
          }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />

        {/* Частицы */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="bg-yellow absolute z-10 h-1 w-1 rounded-full"
            style={{ left: `calc(${progress}% + ${p.x}px)`, bottom: '50%' }}
            initial={{ y: 0, opacity: 1, scale: 1 }}
            animate={{
              y: (20 + Math.random() * 20) * p.directionY,
              x: p.x + Math.random() * 20 * p.directionX,
              opacity: 0,
              scale: Math.random() * 0.5 + 0.5,
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        ))}
      </motion.div>
      {between}
      <Typography
        color={current >= ath ? 'green' : 'red'}
        weight="regular"
        icon={{
          position: 'left',
          name: 'arrow_to',
          className: clsx({ '!text-green -rotate-90': current >= ath, '!text-red rotate-90': current < ath }),
        }}>
        {displayPercent.toFixed(2)}%
      </Typography>
    </div>
  );
};
