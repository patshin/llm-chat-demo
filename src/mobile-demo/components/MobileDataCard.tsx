import type { ReactNode } from 'react';

export interface MobileDataCardProps {
  title: string;
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
  return (
    <section className={`mobile-demo-card ${className}`.trim()}>
      <div className="mobile-demo-card-inner">
        <div className="mobile-demo-card-header">
          <div>
            <h2 className="mobile-demo-card-title">{title || '暂无数据'}</h2>
            {meta ? <p className="mobile-demo-card-meta">{meta}</p> : null}
          </div>
          {action}
        </div>
        {empty ? <p className="mobile-demo-empty">{emptyText}</p> : children}
      </div>
    </section>
  );
}

export default MobileDataCard;

