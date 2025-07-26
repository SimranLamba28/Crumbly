import { FaRobot, FaUser } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TypingIndicator from './TypingIndicator';

const MessageBubble = ({ role, content, isLoading, index }) => {
  return (
    <div 
      className={`message ${role}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="message-icon">
        {role === 'user' ? <FaUser size={16} /> : <FaRobot size={16} />}
      </div>
      <div className="message-content">
        {isLoading ? <TypingIndicator /> : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
