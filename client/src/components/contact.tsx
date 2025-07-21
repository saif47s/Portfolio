import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    info: "xiaomidanger@gmail.com",
    gradient: "from-cyber-blue to-cyber-purple"
  },
  {
    icon: Phone,
    title: "Phone",
    info: "Available on Request",
    gradient: "from-cyber-green to-emerald-600"
  },
  {
    icon: MapPin,
    title: "Location",
    info: "Remote Worldwide",
    gradient: "from-cyber-purple to-purple-600"
  },
  {
    icon: Clock,
    title: "Availability",
    info: "24/7 Project Support",
    gradient: "from-yellow-500 to-orange-500"
  }
];

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    service: "",
    message: ""
  });

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for your inquiry. I'll get back to you within 24 hours.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        service: "",
        message: ""
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.service || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    contactMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-20 bg-cyber-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Get In Touch</h2>
          <p className="text-xl text-gray-400">
            Ready to collaborate on tech projects? Let's discuss your requirements across cybersecurity, cloud engineering, development, and more.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${info.gradient} rounded-lg flex items-center justify-center mr-4`}>
                    <info.icon className="text-white h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{info.title}</h4>
                    <p className="text-gray-400">{info.info}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="bg-cyber-dark border-gray-700">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-300 text-sm font-medium mb-2">First Name</Label>
                      <Input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="bg-cyber-secondary border-gray-600 text-white focus:border-cyber-blue"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm font-medium mb-2">Last Name</Label>
                      <Input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="bg-cyber-secondary border-gray-600 text-white focus:border-cyber-blue"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-300 text-sm font-medium mb-2">Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-cyber-secondary border-gray-600 text-white focus:border-cyber-blue"
                      placeholder="john@company.com"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-300 text-sm font-medium mb-2">Service Needed</Label>
                    <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                      <SelectTrigger className="bg-cyber-secondary border-gray-600 text-white focus:border-cyber-blue">
                        <SelectValue placeholder="Select a service..." />
                      </SelectTrigger>
                      <SelectContent className="bg-cyber-secondary border-gray-600">
                        <SelectItem value="cybersecurity">Cybersecurity Services</SelectItem>
                        <SelectItem value="cloud-engineering">Cloud Engineering</SelectItem>
                        <SelectItem value="network-engineering">Network Engineering</SelectItem>
                        <SelectItem value="uiux-design">UI/UX Design</SelectItem>
                        <SelectItem value="data-analysis">Data Analysis & Visualization</SelectItem>
                        <SelectItem value="ai-prompting">AI Prompting & Automation</SelectItem>
                        <SelectItem value="mobile-development">Mobile App Development</SelectItem>
                        <SelectItem value="python-development">Python Development</SelectItem>
                        <SelectItem value="seo-optimization">SEO & Business IT</SelectItem>
                        <SelectItem value="database-management">Database Management</SelectItem>
                        <SelectItem value="it-support">IT Support & Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-gray-300 text-sm font-medium mb-2">Message</Label>
                    <Textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className="bg-cyber-secondary border-gray-600 text-white focus:border-cyber-blue resize-none"
                      placeholder="Tell me about your cybersecurity needs..."
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="w-full bg-gradient-cyber-secondary hover:opacity-90 text-white font-semibold py-3 px-6"
                  >
                    {contactMutation.isPending ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
