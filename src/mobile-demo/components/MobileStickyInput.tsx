import { SendHorizontal } from 'lucide-react';
import type { FormEvent } from 'react';

export interface MobileStickyInputProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
}

export function MobileStickyInput({
  value = '',
  placeholder = '请输入风险问题',
  disabled = false,
  onChange,
  onSubmit,
}: MobileStickyInputProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled) {
      return;
    }
    onSubmit?.(value);
  }

  return (
    <form className="mobile-demo-sticky-input" onSubmit={handleSubmit}>
      <input
        className="mobile-demo-input-field"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        aria-label="AI 输入框"
        onChange={(event) => onChange?.(event.target.value)}
      />
      <button className="mobile-demo-send-button" type="submit" disabled={disabled} aria-label="发送">
        <SendHorizontal size={18} />
      </button>
    </form>
  );
}

export default MobileStickyInput;

