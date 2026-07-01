import { X } from 'lucide-react';
import type { ReactNode } from 'react';

export interface MobileBottomSheetProps {
  open: boolean;
  title: string;
  children?: ReactNode;
  onClose: () => void;
}

export function MobileBottomSheet({ open, title, children, onClose }: MobileBottomSheetProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="mobile-demo-sheet-overlay" role="presentation" onClick={onClose}>
      <section
        className="mobile-demo-bottom-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title || '详情'}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mobile-demo-sheet-handle" />
        <header className="mobile-demo-sheet-header">
          <h2 className="mobile-demo-sheet-title">{title || '详情'}</h2>
          <button className="mobile-demo-icon-button" type="button" aria-label="关闭" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <div className="mobile-demo-sheet-body">{children ?? <p className="mobile-demo-empty">暂无数据</p>}</div>
      </section>
    </div>
  );
}

export default MobileBottomSheet;

