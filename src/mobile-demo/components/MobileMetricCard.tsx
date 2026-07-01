import type { ReactNode } from 'react';
import { MobileRiskBadge, type MobileRiskBadgeLevel } from './MobileRiskBadge';

export interface MobileMetricCardProps {
  label: string;
  value?: string;
  unit?: string;
  assist?: string;
  badge?: string;
  badgeLevel?: MobileRiskBadgeLevel;
  extra?: ReactNode;
  className?: string;
}

export function MobileMetricCard({
  label,
  value,
  unit,
  assist,
  badge,
  badgeLevel = 'neutral',
  extra,
  className = '',
}: MobileMetricCardProps) {
  return (
    <article className={`mobile-demo-card mobile-demo-metric-card ${className}`.trim()}>
      <div className="mobile-demo-card-inner">
        <p className="mobile-demo-metric-label">{label || '暂无数据'}</p>
        {badge ? (
          <MobileRiskBadge level={badgeLevel}>{badge}</MobileRiskBadge>
        ) : (
          <div className="mobile-demo-metric-value">
            <span>{value || '暂无数据'}</span>
            {unit ? <span className="mobile-demo-metric-unit">{unit}</span> : null}
          </div>
        )}
        {assist ? <p className="mobile-demo-metric-assist">{assist}</p> : null}
        {extra}
      </div>
    </article>
  );
}

export default MobileMetricCard;

