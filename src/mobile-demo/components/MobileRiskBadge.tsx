export type MobileRiskBadgeLevel = 'neutral' | 'normal' | 'warning' | 'danger';

export interface MobileRiskBadgeProps {
  children: string;
  level?: MobileRiskBadgeLevel;
  className?: string;
}

export function MobileRiskBadge({
  children,
  level = 'neutral',
  className = '',
}: MobileRiskBadgeProps) {
  return (
    <span className={`mobile-demo-risk-badge is-${level} ${className}`.trim()}>
      {children || '暂无数据'}
    </span>
  );
}

export default MobileRiskBadge;

