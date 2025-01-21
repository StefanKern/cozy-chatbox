import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { supabase } from '@/lib/supabase';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  content: string;
  type: 'human' | 'ai';
}

const Chat = () => {
  const [sessionId] = useState(uuidv4());
  const [messages, setMessages] = useState<Message[]>([{
    content: "🌟 Welcome! 🌟\nHi there! I'm your friendly booking assistant, here to make scheduling your appointment quick and hassle-free. Let me know when works best for you, and I'll handle the rest.\n\nLet's get started—your perfect appointment time is just a few clicks away! 😊",
    type: 'ai'
  }]);
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

      if (data && data.length > 0) {
        setMessages(prev => [prev[0], ...data.map(row => row.message as Message)]);
      }
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
          // Check if the message is already in the messages array
          setMessages(prev => {
            const isDuplicate = prev.some(msg => 
              msg.content === newMessage.content && 
              msg.type === newMessage.type
            );
            return isDuplicate ? prev : [...prev, newMessage];
          });
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
    // Show message immediately
    setMessages(prev => [...prev, { content, type: 'human' }]);
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
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img 
          src="/lovable-uploads/4a75df5a-4cd6-49b9-80e5-0a471b621bbe.png"
          alt="Decorative ladder"
          className="absolute h-[70%] object-contain opacity-70 top-1/2 -z-10"
          style={{ transform: 'translate(-35%, -28%)' }}
        />
        <img 
          src="/lovable-uploads/ea94ee82-b071-4eec-b0d8-9d9256a3ce02.png"
          alt="Decorative light bulb"
          className="absolute h-[30%] object-contain opacity-70 top-1/2 right-0 -z-10"
          style={{ transform: 'translate(5%, -95%)' }}
        />
      </div>
      
      <header className="bg-white py-6 px-4 border-b-2 border-primary flex-none">
        <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
          <div className="text-left">
            <h1 className="text-4xl font-bold text-primary mb-2">Maiers Electronic</h1>
            <p className="text-lg text-primary/90">Quickbook AI agent</p>
          </div>
          <img 
            src="/lovable-uploads/ada1ee1d-68e6-49dc-b472-9a519e93d037.png" 
            alt="Electrician Logo" 
            className="h-32 w-32"
          />
        </div>
      </header>
      
      <main className="flex flex-1 min-h-0 justify-center">
        <div className="flex-1 flex flex-col min-h-0 max-w-5xl w-full">
          <div className="flex-1 overflow-y-auto p-4">
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
          
          <ChatInput onSend={handleSend} />
        </div>
      </main>
    </div>
  );
};

export default Chat;