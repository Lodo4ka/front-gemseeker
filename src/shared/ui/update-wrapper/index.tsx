import clsx from 'clsx';
import { useUnit } from 'effector-react';
import { motion, useAnimation } from 'framer-motion';
import { CSSProperties, ReactNode, useEffect } from 'react';
import { $isAnimationsEnabled } from 'features/toggle-animations';
import { $isPausedNewData, PauseVariant } from 'features/pause-control';
import { useHover } from 'shared/lib/use-hover';
import { animations } from 'shared/config/animations';

interface UpdateWrapperProps {
  children: ReactNode;
  className?: string;
  version?: number;
}
export const UpdateWrapper = ({ children, className, version }: UpdateWrapperProps) => {
  const controls = useAnimation();
  const isAnimationsEnabled = useUnit($isAnimationsEnabled);

  useEffect(() => {
    if (isAnimationsEnabled) {
      controls.start({
        x: [0, -15, 15, 0],
        transition: { duration: 0.3, ease: 'easeInOut' },
      });
    }
  }, [version, isAnimationsEnabled]);

  return (
    <motion.div
      animate={controls}
      initial={{ opacity: 1, x: 0 }}
      className={clsx(className, 'relative overflow-hidden rounded-[12px]')}
      transition={{ duration: 0.3, ease: 'easeInOut' }}>
      {/* <motion.span
        className="absolute top-[-140px] left-[-80px] z-[2] h-[200px] w-[200px] bg-[#FBBF2466] blur-[85px]"
        variants={{
          initial: { opacity: 0 },
          animate: { opacity: [0.8, 0], transition: { duration: 0.3 } }, // Adjusted opacity range
        }}
        initial="initial"
        animate="animate"
      /> */}

      {children}

      {/* <motion.span
        className="absolute right-[-100px] bottom-[-180px] z-[2] h-[200px] w-[240px] bg-[#34D39966] blur-[85px]"
        variants={{
          initial: { opacity: 0 },
          animate: { opacity: [0.8, 0], transition: { duration: 0.3 } }, // Adjusted opacity range
        }}
        initial="initial"
        animate="animate"
      /> */}
    </motion.div>
  );
};

interface AnimationdWrapperProps {
  children: ReactNode;
  className?: string;
  isUpdated: boolean;
  style?: CSSProperties;
  handleMouseOverProps?: () => void;
  handleMouseOutProps?: () => void;
  pauseVariant: PauseVariant;
}

export const AnimationWrapper = ({
  children,
  className,
  isUpdated,
  pauseVariant,
  style,
  handleMouseOverProps,
  handleMouseOutProps,
}: AnimationdWrapperProps) => {
  const { handleMouseOver, handleMouseOut, isMobile } = useHover({ pauseVariant });
  const controls = useAnimation();
  const [isAnimationsEnabled, pause] = useUnit([$isAnimationsEnabled, $isPausedNewData]);

  useEffect(() => {
    if (isAnimationsEnabled && isUpdated && pause !== 'all' && pause !== pauseVariant) {
      controls.start(animations.table.flash.first.animate);
    }
  }, [isUpdated, isAnimationsEnabled, pauseVariant]);

  const shouldAnimate = isUpdated && pause !== 'all' && pause !== pauseVariant;

  return (
    <motion.div
      onMouseOver={!isMobile ? (handleMouseOverProps ?? handleMouseOver) : undefined}
      onMouseOut={!isMobile ? (handleMouseOutProps ?? handleMouseOut) : undefined}
      animate={controls}
      initial={{ opacity: 1, x: 0 }}
      style={style}
      className={clsx(className, 'relative overflow-hidden rounded-[12px]')}
      transition={{ duration: 0.3, ease: 'easeInOut' }}>
      {shouldAnimate && (
        <motion.div
          className="absolute inset-0 z-0 rounded-xl"
          animate={{
            backgroundColor: ['rgba(251, 191, 36, 0)', 'rgba(251, 191, 36, 0.6)', 'rgba(251, 191, 36, 0)'],
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 15,
            mass: 0.8,
            x: {
              duration: 0.6,
              times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7],
              ease: 'easeInOut',
            },
            backgroundColor: {
              duration: 0.8,
              times: [0, 0.3, 0.9],
              ease: 'easeInOut',
            },
          }}
        />
      )}
      {children}
    </motion.div>
  );
};
