import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const predefinedMessages = [
    "Hi! I'd like to discuss a cybersecurity project",
    "I need help with cloud engineering services",
    "Can we talk about mobile app development?",
    "I'm interested in your AI prompting expertise",
    "Let's discuss data analysis and visualization"
  ];

  const sendWhatsAppMessage = (text: string) => {
    // Note: Replace with your actual WhatsApp number in international format (without + sign)
    const phoneNumber = "03325909163"; // Replace with your actual WhatsApp number
    const encodedMessage = encodeURIComponent(`Hello Saif! ${text}`);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
    setMessage("");
  };

  return (
    <>
      {/* WhatsApp Float Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-50 w-80 max-w-sm"
          >
            <Card className="bg-card border-border shadow-xl">
              <div className="bg-green-500 text-white p-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                      <MessageCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Saif - Tech Expert</h3>
                      <p className="text-xs opacity-90">Typically replies instantly</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-green-600 h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="mb-4">
                  <div className="bg-muted p-3 rounded-lg text-sm mb-3">
                    <p className="font-medium mb-1">Hi there! 👋</p>
                    <p>How can I help you today? Choose from options below or send a custom message.</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {predefinedMessages.map((msg, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => sendWhatsAppMessage(msg)}
                      className="w-full text-left text-xs p-2 h-auto justify-start"
                    >
                      {msg}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && message.trim()) {
                        sendWhatsAppMessage(message);
                      }
                    }}
                  />
                  <Button
                    onClick={() => message.trim() && sendWhatsAppMessage(message)}
                    disabled={!message.trim()}
                    size="icon"
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}