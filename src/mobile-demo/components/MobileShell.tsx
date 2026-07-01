import type { ReactNode } from 'react';
import '../mobileTokens.css';
import { MobileStickyInput } from './MobileStickyInput';

export interface MobileShellProps {
  children: ReactNode;
  header?: ReactNode;
  stickyInput?: ReactNode;
  ariaLabel?: string;
  className?: string;
}

export function MobileShell({
  children,
  header,
  stickyInput,
  ariaLabel = '企业内部风险管理移动端 Demo',
  className = '',
}: MobileShellProps) {
  return (
    <main className={`mobile-demo-scope ${className}`.trim()} aria-label={ariaLabel}>
      <div className="mobile-demo-screen">
        {header}
        <div className="mobile-demo-stack">{children}</div>
        {stickyInput ?? <MobileStickyInput disabled />}
      </div>
    </main>
  );
}

export default MobileShell;

