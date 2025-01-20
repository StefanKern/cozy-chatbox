import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { supabase } from '@/lib/supabase';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import ConversationSidebar from '@/components/ConversationSidebar';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  content: string;
  type: 'human' | 'ai';
}

const Chat = () => {
  const [sessionId, setSessionId] = useState(uuidv4());
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('message')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data.map(row => row.message as Message));
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newMessage = payload.new.message as Message;
          setMessages(prev => [...prev, newMessage]);
          setLoading(false);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [sessionId]);

  const handleSend = async (content: string) => {
    setLoading(true);
    const requestId = uuidv4();

    try {
      const response = await axios.post(
        'https://stefankern.app.n8n.cloud/webhook-test/electrician-booking-agent-with-hannes-api',
        {
          query: content,
          user_id: 'NA',
          request_id: requestId,
          session_id: sessionId,
        }
      );

      if (!response.data.success) {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNewChat = () => {
    setSessionId(uuidv4());
    setMessages([]);
  };

  return (
    <div className="flex h-screen bg-background">
      <ConversationSidebar
        currentSessionId={sessionId}
        onSelectSession={setSessionId}
        onNewChat={handleNewChat}
      />
      
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 bg-background">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              content={message.content}
              type={message.type}
            />
          ))}
          {loading && (
            <div className="flex justify-center items-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <ChatInput onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
};

export default Chat;