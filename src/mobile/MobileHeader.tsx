import { ShieldCheck } from 'lucide-react';

function MobileHeader() {
  return (
    <header className="mobile-header">
      <div className="mobile-header-icon">
        <ShieldCheck size={23} />
      </div>
      <div>
        <h1>智能风控助手</h1>
        <p>移动端 Demo</p>
      </div>
    </header>
  );
}

export default MobileHeader;
