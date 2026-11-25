import React from 'react';

/**
 * Small line chart for readings over time.
 * Draws one or two series on a shared scale with a faint grid,
 * an optional threshold line and a marked latest point.
 */
interface Series {
  values: number[];
  color: string;
  label: string;
}

interface TrendChartProps {
  series: Series[];
  labels: string[];
  threshold?: { value: number; label: string };
  height?: number;
  dark?: boolean;
}

export default function TrendChart({ series, labels, threshold, height = 170, dark = false }: TrendChartProps) {
  const W = 600;
  const H = height;
  const padL = 34;
  const padR = 12;
  const padT = 12;
  const padB = 8;

  const all = series.flatMap((s) => s.values).concat(threshold ? [threshold.value] : []);
  if (all.length === 0) return null;
  let min = Math.min(...all);
  let max = Math.max(...all);
  const span = Math.max(10, max - min);
  min = Math.floor((min - span * 0.15) / 10) * 10;
  max = Math.ceil((max + span * 0.15) / 10) * 10;

  const n = Math.max(...series.map((s) => s.values.length));
  const x = (i: number) => (n <= 1 ? padL + (W - padL - padR) / 2 : padL + (i * (W - padL - padR)) / (n - 1));
  const y = (v: number) => padT + (1 - (v - min) / (max - min)) * (H - padT - padB);

  const ticks = [min, Math.round((min + max) / 2), max];
  const tickColor = dark ? 'rgba(255,255,255,0.45)' : 'rgb(148 163 184)';

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label={series.map((s) => s.label).join(' and ') + ' over time'}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="currentColor" className={dark ? 'text-white/10' : 'text-gray-200 dark:text-white/10'} strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <text x={0} y={y(t) + 4} fontSize="11" fill={tickColor} fontFamily="var(--font-mono)">{t}</text>
          </g>
        ))}
        {threshold && (
          <line x1={padL} x2={W - padR} y1={y(threshold.value)} y2={y(threshold.value)} stroke="#EF4444" strokeOpacity="0.55" strokeDasharray="5 6" vectorEffect="non-scaling-stroke" />
        )}
        {series.map((s, si) => {
          if (s.values.length === 0) return null;
          const d = s.values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i)} ${y(v)}`).join(' ');
          const area = `${d} L${x(s.values.length - 1)} ${H} L${x(0)} ${H}Z`;
          const last = s.values.length - 1;
          return (
            <g key={s.label}>
              {si === 0 && <path d={area} fill={s.color} opacity={dark ? 0.16 : 0.1} />}
              <path d={d} fill="none" stroke={s.color} strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <circle cx={x(last)} cy={y(s.values[last])} r="4.5" fill={s.color} stroke={dark ? '#070D1A' : '#fff'} strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </g>
          );
        })}
      </svg>
      {labels.length > 0 && (
        <div className={`mt-2 flex justify-between pl-[5.5%] font-mono text-[11px] ${dark ? 'text-white/40' : 'text-gray-400'}`}>
          {labels.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}
