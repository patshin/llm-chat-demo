import type { ReactNode } from 'react';

export interface MobileDataCardProps {
  title?: string;
  meta?: string;
  action?: ReactNode;
  children?: ReactNode;
  empty?: boolean;
  emptyText?: string;
  className?: string;
}

export function MobileDataCard({
  title,
  meta,
  action,
  children,
  empty = false,
  emptyText = '暂无数据',
  className = '',
}: MobileDataCardProps) {
  const hasHeader = Boolean(title || meta || action);

  return (
    <section className={`mobile-demo-card ${className}`.trim()}>
      <div className="mobile-demo-card-inner">
        {hasHeader ? (
          <div className="mobile-demo-card-header">
            <div>
              {title ? <h2 className="mobile-demo-card-title">{title}</h2> : null}
              {meta ? <p className="mobile-demo-card-meta">{meta}</p> : null}
            </div>
            {action}
          </div>
        ) : null}
        {empty ? <p className="mobile-demo-empty">{emptyText}</p> : children}
      </div>
    </section>
  );
}

export default MobileDataCard;
