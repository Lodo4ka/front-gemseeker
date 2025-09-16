import { useUnit } from 'effector-react';
import { changedPause, type PauseVariant } from 'features/pause-control';
import { useState, useRef, useEffect } from 'react';

type UseHoverProps = {
  pauseVariant: PauseVariant;
};

const DEBOUNCE_DELAY = 200;

const isMobileDevice = () => {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  );
};

export const useHover = ({ pauseVariant }: UseHoverProps) => {
  const changePause = useUnit(changedPause);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const overTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const outTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const handleMouseOver = () => {
    if (isMobile) return;

    if (outTimeout.current) {
      clearTimeout(outTimeout.current);
      outTimeout.current = null;
    }
    overTimeout.current = setTimeout(() => {
      changePause(pauseVariant);
      setIsHovered(true);
    }, DEBOUNCE_DELAY);
  };

  const handleMouseOut = () => {
    if (isMobile) return;

    if (overTimeout.current) {
      clearTimeout(overTimeout.current);
      overTimeout.current = null;
    }
    outTimeout.current = setTimeout(() => {
      changePause(null);
      setIsHovered(false);
    }, DEBOUNCE_DELAY);
  };

  return { isHovered, handleMouseOver, handleMouseOut, isMobile };
};
