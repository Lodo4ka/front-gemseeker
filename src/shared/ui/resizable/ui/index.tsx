import clsx from 'clsx';
import React, { useRef, useState, ReactNode } from 'react';
import { Icon } from 'shared/ui/icon';

type ResizableProps = {
  minHeight?: number;
  maxHeight?: number;
  initialHeight?: number;
  children: ReactNode;
  handle?: ReactNode;
  className?: {
    container?: string;
    nav?: string;
  };
};

export const Resizable: React.FC<ResizableProps> = ({
  minHeight = 200,
  maxHeight = 2000,
  initialHeight = 300,
  children,
  handle,
  className,
}) => {
  const [height, setHeight] = useState(initialHeight);
  const [isResizing, setIsResizing] = useState(false);
  const [animatedHeight, setAnimatedHeight] = useState(initialHeight);
  const handleRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ y: 0, height: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!handleRef.current) return;
    e.preventDefault();
    handleRef.current.setPointerCapture(e.pointerId);
    startPosRef.current = { y: e.clientY, height: height };
    setIsResizing(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!handleRef.current?.hasPointerCapture(e.pointerId)) return;
    e.preventDefault();
    const dy = e.clientY - startPosRef.current.y;
    const newHeight = Math.max(minHeight, Math.min(maxHeight, startPosRef.current.height + dy));
    setHeight(newHeight);
    setAnimatedHeight(newHeight);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!handleRef.current) return;
    handleRef.current.releasePointerCapture(e.pointerId);
    setIsResizing(false);
    setAnimatedHeight(height);
  };

  return (
    <div
      className={clsx(
        'flex flex-col select-none',
        !isResizing && 'transition-[height] duration-300 ease-in-out',
        className?.container,
      )}
      style={{ height: isResizing ? height : animatedHeight }}>
      <div className="h-full w-full flex-1">{children}</div>
      <div
        ref={handleRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={clsx(
          'bg-darkGray-3 flex h-3 w-full cursor-row-resize touch-none items-center justify-center transition',
          className?.nav,
        )}
        style={{ userSelect: 'none' }}>
        {handle || <Icon size={12} name="dots" />}
      </div>
    </div>
  );
};
