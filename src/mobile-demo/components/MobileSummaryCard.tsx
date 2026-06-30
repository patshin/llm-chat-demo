export interface MobileSummaryCardProps {
  conclusion?: string;
  label?: string;
  className?: string;
}

export function MobileSummaryCard({
  conclusion,
  label = 'AI 摘要',
  className = '',
}: MobileSummaryCardProps) {
  return (
    <section className={`mobile-demo-card mobile-demo-summary-card ${className}`.trim()}>
      <div className="mobile-demo-card-inner">
        <p className="mobile-demo-eyebrow">{label}</p>
        <p className="mobile-demo-summary-text">{conclusion || '暂无数据'}</p>
      </div>
    </section>
  );
}

export default MobileSummaryCard;

