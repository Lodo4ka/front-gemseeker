import { ReactNode } from 'react';
import { ButtonProps } from 'shared/ui/button';

export interface Controllers extends ButtonProps<'button'> {
  activeClassName?: string;
  children: string | ReactNode;
  name?: string;
}

export interface TabsProps {
  className?: {
    controllers?: {
      wrapper?: string;
      controller?: {
        default?: string;
        active?: string;
      };
    };
    content?: string;
    wrapper?: string;
  };
  controllers: Controllers[];
  contents: ReactNode[];
  between?: ReactNode;
  activeTab?: number;
  defaultActiveTab?: number;
  onTabChange?: (index: number) => void;
  rightAction?: {
    content: ReactNode,
    tabActive: number 
  };
  queryParamName?: string;
}
