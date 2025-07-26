import { FaPaperPlane } from 'react-icons/fa';

const ChatInput = ({ input, setInput, onSubmit, loading, inputRef }) => (
  <form className="w-100" onSubmit={onSubmit}>
    <div className="input-group">
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about this recipe..."
        className="ai-input"
        disabled={loading}
      />
      <button
        type="submit"
        className="ai-send-btn"
        disabled={loading || !input.trim()}
      >
        <FaPaperPlane size={16} />
      </button>
    </div>
  </form>
);

export default ChatInput;
