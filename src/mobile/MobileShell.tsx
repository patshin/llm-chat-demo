import type { ReactNode } from 'react';
import MobileBottomAsk from './MobileBottomAsk';

function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="mobile-shell-page">
      <section className="mobile-phone-frame" aria-label="移动端 Demo 预览">
        <div className="mobile-phone-scroll">{children}</div>
        <MobileBottomAsk />
      </section>
    </div>
  );
}

export default MobileShell;
