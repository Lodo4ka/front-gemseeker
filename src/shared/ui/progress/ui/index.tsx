import { formatter } from 'shared/lib/formatter';

type ProgressCircleProps = {
  value: number; // от 1 до 100
  size?: number; // размер в px
  stroke?: number; // толщина линии
};

export const ProgressCircle = ({ value, size = 160, stroke = 14 }: ProgressCircleProps) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);

  return (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle stroke="#2E3547" fill="none" strokeWidth={stroke} cx={size / 2} cy={size / 2} r={radius} />
        <circle
          stroke="#34D399"
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s' }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize={12}
          fontWeight="medium"
          fill="#34D399"
          fontFamily="inherit">
          {formatter.number.formatSmallNumber(+value.toFixed(2))}%
        </text>
      </svg>
    </div>
  );
};
