import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/lib/types';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Paperclip, Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns-jalali';
import { cn } from '@/lib/utils';

interface ChatSectionProps {
  messages: ChatMessage[];
  reportId: string;
  onSendMessage: (message: string, files?: File[]) => Promise<void>;
}

export const ChatSection = ({ messages, reportId, onSendMessage }: ChatSectionProps) => {
  const { user } = useAuthStore();
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      await onSendMessage(newMessage);
      setNewMessage('');
    } catch {
      // Error handled silently - user sees loading state change
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              هنوز پیامی ارسال نشده است
            </div>
          ) : (
            messages.map((message) => {
              const isUser = message.senderType === 'user';
              return (
                <div
                  key={message.id}
                  className={cn(
                    'flex',
                    isUser ? 'justify-start' : 'justify-end'
                  )}
                >
                  <Card
                    className={cn(
                      'max-w-[70%] p-3',
                      isUser
                        ? 'bg-muted'
                        : 'bg-primary text-primary-foreground'
                    )}
                  >
                    <div className="text-sm mb-1 font-medium">
                      {isUser ? 'شما' : 'اپراتور'}
                    </div>
                    <div className="whitespace-pre-wrap break-words">
                      {message.message}
                    </div>
                    {message.files && message.files.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.files.map((file) => (
                          <div
                            key={file.id}
                            className="text-xs p-2 bg-background/10 rounded"
                          >
                            📎 {file.name}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                      <span>
                        {format(new Date(message.createdAt), 'HH:mm')}
                      </span>
                      {!isUser && (
                        <span>
                          {message.isRead ? (
                            <CheckCheck className="h-3 w-3" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                        </span>
                      )}
                    </div>
                  </Card>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" disabled>
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder="پیام خود را بنویسید..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || !newMessage.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
