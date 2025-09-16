import { motion } from 'framer-motion';

function getPercents(a: number, b: number) {
  if (a === 0 && b === 0) return { green: 50, red: 50 };
  const total = a + b;
  const green = Math.round((a / total) * 100);
  const red = 100 - green;
  return { green, red };
}

type PercentProps = {
  v1: number;
  v2: number;
};

export const Percent = ({ v1, v2 }: PercentProps) => {
  const { green, red } = getPercents(v1, v2);

  return (
    <div className="flex w-full items-center gap-[5px]">
      <motion.div
        className="bg-green h-[3px] rounded-[2px]"
        style={{ width: `${green}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${green}%` }}
        transition={{
          duration: 0.5,
          ease: 'easeOut',
        }}
      />
      <motion.div
        className="bg-red h-[3px] rounded-[2px]"
        style={{ width: `${red}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${red}%` }}
        transition={{
          duration: 0.5,
          ease: 'easeOut',
        }}
      />
    </div>
  );
};
