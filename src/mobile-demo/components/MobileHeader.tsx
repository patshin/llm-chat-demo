import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';

export interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightSlot?: ReactNode;
  onBack?: () => void;
}

export function MobileHeader({
  title,
  subtitle,
  showBack = true,
  rightSlot,
  onBack,
}: MobileHeaderProps) {
  return (
    <header className="mobile-demo-header">
      {showBack ? (
        <button className="mobile-demo-back-button" type="button" aria-label="返回" onClick={onBack}>
          <ChevronLeft size={20} />
        </button>
      ) : null}
      <div className="mobile-demo-header-main">
        <h1 className="mobile-demo-header-title">{title || '暂无数据'}</h1>
        {subtitle ? <p className="mobile-demo-header-subtitle">{subtitle}</p> : null}
      </div>
      {rightSlot}
    </header>
  );
}

export default MobileHeader;

