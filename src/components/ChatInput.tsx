import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isSubmitting) {
      setIsSubmitting(true);
      await onSend(message);
      setMessage('');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-secondary/20 bg-white shadow-lg">
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="resize-none bg-chatbg text-foreground border-secondary/20"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button 
          type="submit" 
          disabled={isSubmitting || !message.trim()}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;