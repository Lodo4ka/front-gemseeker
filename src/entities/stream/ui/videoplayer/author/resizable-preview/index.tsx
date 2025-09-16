import { ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import { useLocalParticipant } from '@dtelecom/components-react';
import { DataPacket_Kind } from '@dtelecom/livekit-client';

type DraggableResizablePreviewProps = {
  parentRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  resetDeps: any[];
};

const minSize = { width: 80, height: 60 };
const defaultSize = { width: 208, height: 120 };
const textEncoder = typeof window !== 'undefined' ? new TextEncoder() : null;

// Храним проценты
function getDefaultPercent(parent: HTMLDivElement | null) {
  if (!parent) return { x: 0, y: 0, width: 0.2, height: 0.2 };
  const rect = parent.getBoundingClientRect();
  return {
    x: 0,
    y: 0,
    width: defaultSize.width / rect.width,
    height: defaultSize.height / rect.height,
  };
}

export const DraggableResizablePreview: React.FC<DraggableResizablePreviewProps> = ({
  parentRef,
  children,
  resetDeps,
}) => {
  // Сохраняем проценты
  const [percent, setPercent] = useState({ x: 0, y: 0, width: 0.2, height: 0.2 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState<null | 'se' | 'sw' | 'ne' | 'nw'>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ width: 0, height: 0, x: 0, y: 0, posX: 0, posY: 0 });
  const { localParticipant } = useLocalParticipant();
  const prevState = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

  // Глобальное хранилище для позиции хоста
  const [hostPosition, setHostPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(
    null,
  );

  // Сохраняем позицию хоста в window для доступа из VideoPlayer
  useEffect(() => {
    if (hostPosition) {
      (window as any).hostCameraPosition = hostPosition;
      console.log('DEBUG: Host position saved to window:', hostPosition);
    }
  }, [hostPosition]);

  // Reset on deps change
  useEffect(() => {
    const rect = parentRef.current?.getBoundingClientRect();
    setPercent(getDefaultPercent(parentRef.current));
  }, resetDeps);

  // Отправка дефолтной позиции и размера при первом появлении
  useEffect(() => {
    if (localParticipant && textEncoder && parentRef.current) {
      const def = getDefaultPercent(parentRef.current);
      const payloadObj = { ...def };
      const payload = textEncoder.encode(JSON.stringify({ payload: payloadObj, channelId: 'position' }));
      localParticipant.publishData(payload, DataPacket_Kind.LOSSY);
      prevState.current = payloadObj;
      setHostPosition(payloadObj); // Сохраняем позицию хоста
    }
    // eslint-disable-next-line
  }, []);

  // Drag
  const onDragStart = (e: React.MouseEvent) => {
    if (isResizing) return;
    e.preventDefault();
    setIsDragging(true);
    const rect = parentRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragOffset.current = {
      x: e.clientX - (rect.left + percent.x * rect.width),
      y: e.clientY - (rect.top + percent.y * rect.height),
    };
    document.body.style.userSelect = 'none';
  };
  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      const rect = parentRef.current?.getBoundingClientRect();
      if (!rect) return;
      let absX = e.clientX - rect.left - dragOffset.current.x;
      let absY = e.clientY - rect.top - dragOffset.current.y;
      absX = Math.max(0, Math.min(absX, rect.width - percent.width * rect.width));
      absY = Math.max(0, Math.min(absY, rect.height - percent.height * rect.height));
      setPercent((prev) => ({ ...prev, x: absX / rect.width, y: absY / rect.height }));
    };
    const onUp = async () => {
      setIsDragging(false);
      document.body.style.userSelect = '';
      if (localParticipant && textEncoder && parentRef.current) {
        const payloadObj = { ...percent };
        if (JSON.stringify(prevState.current) !== JSON.stringify(payloadObj)) {
          const payload = textEncoder.encode(JSON.stringify({ payload: payloadObj, channelId: 'position' }));
          try {
            await localParticipant.publishData(payload, DataPacket_Kind.LOSSY);
            prevState.current = payloadObj;
            setHostPosition(payloadObj); // Обновляем позицию хоста
          } catch {}
        }
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, percent, localParticipant]);

  // Resize
  const onResizeStart = (dir: 'se' | 'sw' | 'ne' | 'nw') => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDir(dir);
    const rect = parentRef.current?.getBoundingClientRect();
    if (!rect) return;
    resizeStart.current = {
      width: percent.width * rect.width,
      height: percent.height * rect.height,
      x: e.clientX,
      y: e.clientY,
      posX: percent.x * rect.width,
      posY: percent.y * rect.height,
    };
    document.body.style.userSelect = 'none';
  };
  useEffect(() => {
    if (!isResizing || !resizeDir) return;
    const onMove = (e: MouseEvent) => {
      const rect = parentRef.current?.getBoundingClientRect();
      if (!rect) return;
      let dx = e.clientX - resizeStart.current.x;
      let dy = e.clientY - resizeStart.current.y;
      let newWidth = resizeStart.current.width;
      let newHeight = resizeStart.current.height;
      let newX = resizeStart.current.posX;
      let newY = resizeStart.current.posY;
      if (resizeDir === 'se') {
        newWidth += dx;
        newHeight += dy;
      } else if (resizeDir === 'sw') {
        newWidth -= dx;
        newHeight += dy;
        newX += dx;
      } else if (resizeDir === 'ne') {
        newWidth += dx;
        newHeight -= dy;
        newY += dy;
      } else if (resizeDir === 'nw') {
        newWidth -= dx;
        newHeight -= dy;
        newX += dx;
        newY += dy;
      }
      // Ограничения по размеру
      const maxWidth = resizeDir === 'sw' || resizeDir === 'nw' ? rect.width : rect.width - newX;
      newWidth = Math.max(minSize.width, Math.min(newWidth, maxWidth));

      const maxHeight = resizeDir === 'ne' || resizeDir === 'nw' ? rect.height : rect.height - newY;
      newHeight = Math.max(minSize.height, Math.min(newHeight, maxHeight));

      // Ограничения по положению
      newX = Math.max(0, Math.min(newX, rect.width - newWidth));
      newY = Math.max(0, Math.min(newY, rect.height - newHeight));
      setPercent({
        x: newX / rect.width,
        y: newY / rect.height,
        width: newWidth / rect.width,
        height: newHeight / rect.height,
      });
    };
    const onUp = async () => {
      setIsResizing(false);
      setResizeDir(null);
      document.body.style.userSelect = '';
      if (localParticipant && textEncoder && parentRef.current) {
        const payloadObj = { ...percent };
        if (JSON.stringify(prevState.current) !== JSON.stringify(payloadObj)) {
          const payload = textEncoder.encode(JSON.stringify({ payload: payloadObj, channelId: 'position' }));
          try {
            await localParticipant.publishData(payload, DataPacket_Kind.LOSSY);
            prevState.current = payloadObj;
            setHostPosition(payloadObj); // Обновляем позицию хоста
          } catch {}
        }
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isResizing, resizeDir, percent, localParticipant]);

  // Вычисляем абсолютные значения для стилей
  const rect = parentRef.current?.getBoundingClientRect();
  const absX = rect ? percent.x * rect.width : 0;
  const absY = rect ? percent.y * rect.height : 0;
  const absW = rect ? percent.width * rect.width : defaultSize.width;
  const absH = rect ? percent.height * rect.height : defaultSize.height;

  return (
    <div
      className="group absolute z-5 cursor-move"
      style={{
        left: absX,
        top: absY,
        width: absW,
        height: absH,
        transition: isResizing ? 'none' : 'box-shadow 0.2s',
        boxShadow: isDragging || isResizing ? '0 0 0 2px #60a5fa' : '0 2px 8px 0 rgba(0,0,0,0.12)',
      }}
      onMouseDown={onDragStart}>
      {children}

      <div
        onMouseDown={onResizeStart('se')}
        className="absolute right-0 bottom-0 z-5 flex h-6 w-6 cursor-se-resize"
        style={{ touchAction: 'none', marginRight: -12, marginBottom: -12 }}
      />
      <div
        onMouseDown={onResizeStart('sw')}
        className="absolute bottom-0 left-0 z-5 flex h-6 w-6 cursor-sw-resize"
        style={{ touchAction: 'none', marginLeft: -12, marginBottom: -12 }}
      />
      <div
        onMouseDown={onResizeStart('ne')}
        className="absolute top-0 right-0 z-5 flex h-6 w-6 cursor-ne-resize"
        style={{ touchAction: 'none', marginRight: -12, marginTop: -12 }}
      />
      <div
        onMouseDown={onResizeStart('nw')}
        className="absolute top-0 left-0 z-5 flex h-6 w-6 cursor-nw-resize"
        style={{ touchAction: 'none', marginLeft: -12, marginTop: -12 }}
      />
    </div>
  );
};
