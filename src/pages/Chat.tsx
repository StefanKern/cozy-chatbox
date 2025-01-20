import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { supabase } from '@/lib/supabase';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import ConversationSidebar from '@/components/ConversationSidebar';
import { useToast } from '@/components/ui/use-toast';
import { Bolt } from 'lucide-react';

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
      await axios.post(
        'https://stefankern.app.n8n.cloud/webhook/electrician-booking-agent',
        {
          query: content,
          request_id: requestId,
          session_id: sessionId,
        },
        {
          headers: {
            'Authorization': 'Bearer 45548948915656118974/*74561514894894894456489asdf4sdaf4sad62f47sda8f4sdaf1sda26f1sa56fwa4sf9'
          }
        }
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setSessionId(uuidv4());
    setMessages([]);
  };

  return (
    <>
      <div className="bg-white py-6 px-4 border-b-2 border-primary">
        <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
          <div className="text-left">
            <h1 className="text-4xl font-bold text-primary mb-2">Maiers Electronic</h1>
            <p className="text-lg text-primary/90">First electrician with AI assistant</p>
          </div>
          <div className="flex items-center gap-2">
            <Bolt className="h-10 w-10 text-primary" />
          </div>
        </div>
      </div>
      
      <div className="flex h-[calc(100vh-88px)] bg-background">
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
    </>
  );
};

export default Chat;