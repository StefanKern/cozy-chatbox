import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Conversation {
  session_id: string;
  title: string;
}

interface ConversationSidebarProps {
  currentSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
}

const ConversationSidebar = ({ currentSessionId, onSelectSession, onNewChat }: ConversationSidebarProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('session_id, message')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching conversations:', error);
        return;
      }

      const conversationMap = data.reduce((acc: { [key: string]: Conversation }, curr) => {
        if (!acc[curr.session_id]) {
          const message = curr.message as { content: string; type: string };
          if (message.type === 'human') {
            acc[curr.session_id] = {
              session_id: curr.session_id,
              title: message.content.slice(0, 100) + (message.content.length > 100 ? '...' : ''),
            };
          }
        }
        return acc;
      }, {});

      setConversations(Object.values(conversationMap));
    };

    fetchConversations();
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col bg-white border-r border-secondary/20 transition-all duration-300 shadow-lg",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex justify-between items-center p-4 border-b border-secondary/20">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">ElectriChat</h2>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto text-primary hover:text-primary/90"
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      
      <div className="p-2">
        <Button
          variant="secondary"
          className={cn(
            "w-full mb-4 bg-secondary hover:bg-secondary/90", 
            isCollapsed && "p-2"
          )}
          onClick={onNewChat}
        >
          {isCollapsed ? '+' : 'New Chat'}
        </Button>
        
        <div className="space-y-2">
          {conversations.map((conv) => (
            <Button
              key={conv.session_id}
              variant={currentSessionId === conv.session_id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start truncate hover:bg-accent",
                currentSessionId === conv.session_id && "bg-accent",
                isCollapsed && "p-2"
              )}
              onClick={() => onSelectSession(conv.session_id)}
            >
              {isCollapsed ? '💬' : conv.title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConversationSidebar;