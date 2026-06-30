import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

export interface MobileAccordionItem {
  id: string;
  title: string;
  summary?: string;
  children?: ReactNode;
  defaultOpen?: boolean;
}

export interface MobileAccordionProps {
  items: MobileAccordionItem[];
  emptyText?: string;
  className?: string;
}

export function MobileAccordion({
  items,
  emptyText = '暂无数据',
  className = '',
}: MobileAccordionProps) {
  if (items.length === 0) {
    return <p className="mobile-demo-empty">{emptyText}</p>;
  }

  return (
    <div className={`mobile-demo-accordion ${className}`.trim()}>
      {items.map((item) => (
        <details key={item.id} className="mobile-demo-accordion-item" open={item.defaultOpen}>
          <summary>
            <span>{item.title || emptyText}</span>
            <ChevronDown className="mobile-demo-accordion-chevron" size={18} />
          </summary>
          <div className="mobile-demo-accordion-body">
            {item.children ?? <p className="mobile-demo-empty">{item.summary || emptyText}</p>}
          </div>
        </details>
      ))}
    </div>
  );
}

export default MobileAccordion;

