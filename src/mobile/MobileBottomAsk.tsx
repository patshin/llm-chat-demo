import { Send } from 'lucide-react';

function MobileBottomAsk() {
  return (
    <div className="mobile-bottom-ask">
      <button className="mobile-ask-field" type="button">
        问 AI：输入你想看的风险问题…
      </button>
      <button className="mobile-send-button" type="button" aria-label="发送问题">
        <Send size={16} />
      </button>
    </div>
  );
}

export default MobileBottomAsk;
