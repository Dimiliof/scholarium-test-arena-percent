
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const LiveChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Γεια σας! Πώς μπορώ να σας βοηθήσω;',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const toggleChat = () => setIsOpen(!isOpen);
  
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Προσθήκη του μηνύματος χρήστη
    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsSending(true);
    
    // Προσομοίωση απάντησης από τον υπεύθυνο υποστήριξης
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Σας ευχαριστώ για το μήνυμά σας. Θα επικοινωνήσει κάποιος μαζί σας σύντομα.',
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsSending(false);
      
      toast({
        title: 'Λάβαμε το μήνυμά σας',
        description: 'Θα επικοινωνήσουμε μαζί σας το συντομότερο δυνατό.'
      });
    }, 1500);
  };
  
  // Αυτόματη κύλιση στο τελευταίο μήνυμα
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <>
      {/* Chat bubble button */}
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-4 right-4 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90"
        onClick={toggleChat}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </Button>
      
      {/* Chat window */}
      <div className={cn(
        "fixed bottom-20 right-4 w-80 sm:w-96 bg-background rounded-lg shadow-xl z-50 transition-all duration-300 ease-in-out flex flex-col",
        isOpen ? "h-96 opacity-100" : "h-0 opacity-0 pointer-events-none"
      )}>
        {/* Chat header */}
        <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex justify-between items-center">
          <h3 className="font-bold text-lg">Ζωντανή Υποστήριξη</h3>
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/90" onClick={toggleChat}>
            <X size={18} />
          </Button>
        </div>
        
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={cn(
                "max-w-[80%] p-3 rounded-lg",
                message.isUser 
                  ? "bg-primary text-primary-foreground ml-auto rounded-br-none" 
                  : "bg-muted text-foreground rounded-bl-none"
              )}
            >
              <p>{message.text}</p>
              <span className="text-xs opacity-70 block mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          {isSending && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Πληκτρολογεί...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat input */}
        <form onSubmit={handleSend} className="p-4 border-t flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Γράψτε το μήνυμά σας..."
            className="flex-1"
            disabled={isSending}
          />
          <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
            <Send size={18} />
          </Button>
        </form>
      </div>
    </>
  );
};

export default LiveChatWidget;
