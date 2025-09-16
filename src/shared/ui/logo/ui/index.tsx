import clsx from 'clsx';
import { FC } from 'react';
import FullLogo from 'shared/assets/full-logo.svg';
import ShortLogo from 'shared/assets/short-logo.svg';

import s from './style.module.scss';

type LogoProps = {
  size: 'small' | 'full';
  className?: string;
  onClick?: () => void;
}
export const Logo: FC<LogoProps> = ({ size, className, onClick }) => {
  if (size === 'small') return <ShortLogo onClick={onClick} className={clsx(s.shortLogo, [className])} />;

  return <FullLogo onClick={onClick} className={clsx(s.fullLogo, [className])} />;
};
