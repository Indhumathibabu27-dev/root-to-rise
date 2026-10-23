import type { MarketTrend } from '../types';

export function LineChart({
  data,
  color = '#16a34a',
  height = 200,
  showAxis = true,
}: {
  data: MarketTrend[];
  color?: string;
  height?: number;
  showAxis?: boolean;
}) {
  const width = 100;
  const padding = { top: 10, right: 10, bottom: 24, left: 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 1;

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((d.price - minPrice) / range) * chartHeight;
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(' ');

  const areaPath =
    `M ${points[0].x.toFixed(2)} ${(padding.top + chartHeight).toFixed(2)} ` +
    points.map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ') +
    ` L ${points[points.length - 1].x.toFixed(2)} ${(padding.top + chartHeight).toFixed(2)} Z`;

  const gradientId = `grad-${color.replace('#', '')}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      style={{ height }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <path d={areaPath} fill={`url(#${gradientId})`} />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        className="animate-draw-line"
      />

      {/* Points */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="0.8"
          fill="white"
          stroke={color}
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* X-axis labels */}
      {showAxis &&
        points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={height - 6}
            textAnchor="middle"
            fontSize="6"
            fill="#9ca3af"
            fontWeight="500"
          >
            {p.month}
          </text>
        ))}
    </svg>
  );
}

export function BarChart({
  data,
  height = 200,
  barColor = '#22c55e',
  highlightIndex,
}: {
  data: { label: string; value: number }[];
  height?: number;
  barColor?: string;
  highlightIndex?: number;
}) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex items-end justify-around gap-2 px-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
          <span className="text-xs font-semibold text-gray-600 tabular-nums">
            ₹{d.value.toLocaleString('en-IN')}
          </span>
          <div
            className="w-full max-w-[60px] rounded-t-lg origin-bottom animate-grow-bar transition-colors"
            style={{
              height: `${(d.value / maxValue) * 100}%`,
              backgroundColor: highlightIndex === i ? '#15803d' : barColor,
              animationDelay: `${i * 80}ms`,
            }}
          />
          <span className="text-xs text-gray-500 font-medium">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
