import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  content: string;
  type: 'human' | 'ai';
}

const ChatMessage = ({ content, type }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "px-4 py-2 rounded-lg max-w-[80%] mb-4",
        type === 'human' 
          ? "ml-auto bg-primary text-white" 
          : "mr-auto bg-accent text-foreground"
      )}
    >
      {type === 'ai' ? (
        <ReactMarkdown className="prose prose-invert">
          {content}
        </ReactMarkdown>
      ) : (
        <p>{content}</p>
      )}
    </div>
  );
};

export default ChatMessage;