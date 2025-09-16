import { useUnit } from 'effector-react';
import { ReactNode, useEffect } from 'react';
import { $scopeImg, hoveredImg } from 'shared/viewer/model/img-scope';

const ScopeImg = () => {
  const [scopeImg, hoverImg] = useUnit([$scopeImg, hoveredImg]);

  useEffect(() => {
    const handleScroll = () => {
      if (scopeImg) hoverImg(null);
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [scopeImg, hoverImg]);

  if (!scopeImg) return null;

  const margin = 20;
  let left = scopeImg.mousePos.x + margin;
  const rightEdge = left + scopeImg.previewSize;

  if (rightEdge > window.innerWidth) {
    left = scopeImg.mousePos.x - scopeImg.previewSize - margin;
  }

  left = Math.max(margin, left);

  return (
    <div
      className="pointer-events-none fixed z-52 rounded border border-white bg-white shadow-xl"
      style={{
        width: `${scopeImg.previewSize}px`,
        height: `${scopeImg.previewSize}px`,
        left: `${left}px`,
        top: scopeImg.positionAbove
          ? `${scopeImg.mousePos.y - scopeImg.previewSize - margin}px`
          : `${scopeImg.mousePos.y + margin}px`,
      }}>
      <img src={scopeImg.preview} alt={scopeImg.alt} className="h-full w-full rounded object-cover" />
    </div>
  );
};

export const withScopeImg = (component: () => ReactNode) => () => (
  <>
    <ScopeImg />
    {component()}
  </>
);
