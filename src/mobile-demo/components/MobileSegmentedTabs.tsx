export interface MobileSegmentedTabItem<TValue extends string> {
  value: TValue;
  label: string;
  disabled?: boolean;
}

export interface MobileSegmentedTabsProps<TValue extends string> {
  items: Array<MobileSegmentedTabItem<TValue>>;
  activeValue: TValue;
  ariaLabel: string;
  onChange: (value: TValue) => void;
  className?: string;
}

export function MobileSegmentedTabs<TValue extends string>({
  items,
  activeValue,
  ariaLabel,
  onChange,
  className = '',
}: MobileSegmentedTabsProps<TValue>) {
  return (
    <div className={`mobile-demo-segmented-tabs ${className}`.trim()} role="tablist" aria-label={ariaLabel}>
      {items.map((item) => (
        <button
          key={item.value}
          className={`mobile-demo-segmented-tab ${item.value === activeValue ? 'is-active' : ''}`.trim()}
          type="button"
          role="tab"
          data-mobile-tab-value={item.value}
          aria-selected={item.value === activeValue}
          disabled={item.disabled}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default MobileSegmentedTabs;
