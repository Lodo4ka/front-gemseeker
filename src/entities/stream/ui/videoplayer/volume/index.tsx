import { useState, useRef } from 'react';
import { Icon } from 'shared/ui/icon';
import clsx from 'clsx';
import { $isMuted, $volume, changedVolume, toggledMuted } from '../../../model';
import { useUnit } from 'effector-react';
import styles from './style.module.css';

export const VolumeControl = ({ className }: { className?: string }) => {
  const [volume, setVolume] = useUnit([$volume, changedVolume]);
  const [isMuted, toggleMuted] = useUnit([$isMuted, toggledMuted]);
  const [showSlider, setShowSlider] = useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
  };

  return (
    <div
      className={clsx('text-primary z-10 flex cursor-pointer flex-col items-center max-sm:hidden', className)}
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}>
      <Icon
        name={isMuted || volume === 0 ? 'volume_off' : 'volume'}
        size={24}
        onClick={(e) => {
          e.stopPropagation();
          toggleMuted();
        }}
        className="text-primary cursor-pointer transition hover:scale-110"
      />

      <div
        className={clsx(
          'absolute bottom-[35px] flex h-[60px] w-[32px] items-center justify-center transition-all duration-300',
          showSlider ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
        )}>
        <input
          ref={sliderRef}
          type="range"
          min="0"
          max="1"
          step="0.10"
          value={volume}
          onMouseDown={() => setShowSlider(true)}
          onMouseUp={() => setShowSlider(false)}
          onChange={handleVolumeChange}
          className={styles.volume_slider}
        />
      </div>
    </div>
  );
};
