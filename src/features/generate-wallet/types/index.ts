import { ReactNode } from 'react';
import { TypographyProps } from 'shared/ui/typography';

type StepContent = {
  title: TypographyProps;
  content: ReactNode;
};

export type Steps = {
  [key: number]: StepContent;
};
