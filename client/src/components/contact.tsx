import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Phone, MapPin, Clock, Send, Calendar, MessageSquare, FileText, AlertCircle, CheckCircle, Star } from "lucide-react";
import LoadingSpinner from "@/components/loading-spinner";

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
    phone: "",
    company: "",
    service: "",
    message: "",
    budget: "",
    timeline: "",
    priority: "medium",
    newsletter: false,
    followUp: false
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formStep, setFormStep] = useState(1);

  const budgetRanges = [
    "Under $5,000",
    "$5,000 - $15,000", 
    "$15,000 - $50,000",
    "$50,000 - $100,000",
    "Over $100,000",
    "Discuss Budget"
  ];

  const timelineOptions = [
    "ASAP (Rush Job)",
    "Within 1 week",
    "Within 1 month", 
    "Within 3 months",
    "6+ months",
    "Flexible Timeline"
  ];

  const validateStep = (step: number) => {
    const errors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.firstName) errors.firstName = "First name is required";
      if (!formData.lastName) errors.lastName = "Last name is required";
      if (!formData.email) errors.email = "Email is required";
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Please enter a valid email";
      }
    }
    
    if (step === 2) {
      if (!formData.service) errors.service = "Please select a service";
      if (!formData.message) errors.message = "Please describe your project";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

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
        phone: "",
        company: "",
        service: "",
        message: "",
        budget: "",
        timeline: "",
        priority: "medium",
        newsletter: false,
        followUp: false
      });
      setFormStep(1);
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
    
    if (formStep < 3) {
      if (validateStep(formStep)) {
        setFormStep(formStep + 1);
      }
      return;
    }
    
    if (!validateStep(1) || !validateStep(2)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    contactMutation.mutate(formData);
  };

  const handlePrevStep = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1);
    }
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
                {/* Form Progress */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">
                      Step {formStep} of 3
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {formStep === 1 && "Personal Info"}
                      {formStep === 2 && "Project Details"}
                      {formStep === 3 && "Additional Options"}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-cyber-blue to-cyber-green h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(formStep / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Personal Information */}
                  {formStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-gray-300 text-sm font-medium mb-2">First Name *</Label>
                          <Input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            className={`bg-cyber-secondary border-gray-600 text-white focus:border-cyber-blue ${
                              formErrors.firstName ? 'border-red-500' : ''
                            }`}
                            placeholder="John"
                          />
                          {formErrors.firstName && (
                            <p className="text-red-400 text-sm mt-1 flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {formErrors.firstName}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label className="text-gray-300 text-sm font-medium mb-2">Last Name *</Label>
                          <Input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            className={`bg-cyber-secondary border-gray-600 text-white focus:border-cyber-blue ${
                              formErrors.lastName ? 'border-red-500' : ''
                            }`}
                            placeholder="Doe"
                          />
                          {formErrors.lastName && (
                            <p className="text-red-400 text-sm mt-1 flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {formErrors.lastName}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-gray-300 text-sm font-medium mb-2">Email Address *</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className={`bg-cyber-secondary border-gray-600 text-white focus:border-cyber-blue ${
                            formErrors.email ? 'border-red-500' : ''
                          }`}
                          placeholder="john@company.com"
                        />
                        {formErrors.email && (
                          <p className="text-red-400 text-sm mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {formErrors.email}
                          </p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-gray-300 text-sm font-medium mb-2">Phone Number</Label>
                          <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className="bg-cyber-secondary border-gray-600 text-white focus:border-cyber-blue"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300 text-sm font-medium mb-2">Company</Label>
                          <Input
                            type="text"
                            value={formData.company}
                            onChange={(e) => handleInputChange("company", e.target.value)}
                            className="bg-cyber-secondary border-gray-600 text-white focus:border-cyber-blue"
                            placeholder="Your Company"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Project Details */}
                  {formStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="space-y-6"
                    >
                      <div>
                        <Label className="text-gray-300 text-sm font-medium mb-2">Service Required *</Label>
                        <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                          <SelectTrigger className="bg-cyber-secondary border-gray-600 text-white">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cybersecurity">Cybersecurity Services</SelectItem>
                            <SelectItem value="network">Network Engineering</SelectItem>
                            <SelectItem value="cloud">Cloud Engineering</SelectItem>
                            <SelectItem value="development">Python Development</SelectItem>
                            <SelectItem value="mobile">Mobile Development</SelectItem>
                            <SelectItem value="uiux">UI/UX Design</SelectItem>
                            <SelectItem value="data">Data Analysis</SelectItem>
                            <SelectItem value="ai">AI Prompting</SelectItem>
                            <SelectItem value="support">IT Support</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.service && (
                          <p className="text-red-400 text-sm mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {formErrors.service}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <Label className="text-gray-300 text-sm font-medium mb-2">Project Description *</Label>
                        <Textarea
                          value={formData.message}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          className={`bg-cyber-secondary border-gray-600 text-white focus:border-cyber-blue min-h-[120px] ${
                            formErrors.message ? 'border-red-500' : ''
                          }`}
                          placeholder="Describe your project requirements, goals, and any specific technical needs..."
                        />
                        {formErrors.message && (
                          <p className="text-red-400 text-sm mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {formErrors.message}
                          </p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-gray-300 text-sm font-medium mb-2">Budget Range</Label>
                          <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                            <SelectTrigger className="bg-cyber-secondary border-gray-600 text-white">
                              <SelectValue placeholder="Select budget range" />
                            </SelectTrigger>
                            <SelectContent>
                              {budgetRanges.map((range) => (
                                <SelectItem key={range} value={range}>{range}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-gray-300 text-sm font-medium mb-2">Timeline</Label>
                          <Select value={formData.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
                            <SelectTrigger className="bg-cyber-secondary border-gray-600 text-white">
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                            <SelectContent>
                              {timelineOptions.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Additional Options */}
                  {formStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="space-y-6"
                    >
                      <div>
                        <Label className="text-gray-300 text-sm font-medium mb-4">Project Priority</Label>
                        <div className="grid grid-cols-3 gap-4">
                          {["low", "medium", "high"].map((priority) => (
                            <Button
                              key={priority}
                              type="button"
                              variant={formData.priority === priority ? "default" : "outline"}
                              onClick={() => handleInputChange("priority", priority)}
                              className={`capitalize ${
                                formData.priority === priority 
                                  ? 'bg-gradient-to-r from-cyber-blue to-cyber-green text-white' 
                                  : 'border-gray-600 text-gray-300 hover:border-cyber-blue'
                              }`}
                            >
                              <Star className="mr-2 h-4 w-4" />
                              {priority} Priority
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="newsletter"
                            checked={formData.newsletter}
                            onCheckedChange={(checked) => handleInputChange("newsletter", checked.toString())}
                          />
                          <Label htmlFor="newsletter" className="text-gray-300 text-sm">
                            Subscribe to newsletter for tech insights and project updates
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="followUp"
                            checked={formData.followUp}
                            onCheckedChange={(checked) => handleInputChange("followUp", checked.toString())}
                          />
                          <Label htmlFor="followUp" className="text-gray-300 text-sm">
                            Request follow-up consultation call within 24 hours
                          </Label>
                        </div>
                      </div>
                      
                      <div className="bg-cyber-secondary p-4 rounded-lg">
                        <h4 className="text-white font-semibold mb-2 flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-green-400" />
                          Review Your Information
                        </h4>
                        <div className="text-sm text-gray-300 space-y-1">
                          <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                          <p><strong>Email:</strong> {formData.email}</p>
                          <p><strong>Service:</strong> {formData.service}</p>
                          <p><strong>Budget:</strong> {formData.budget || "Not specified"}</p>
                          <p><strong>Timeline:</strong> {formData.timeline || "Not specified"}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Form Navigation */}
                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevStep}
                      disabled={formStep === 1}
                      className="border-gray-600 text-gray-300 hover:border-cyber-blue"
                    >
                      Previous
                    </Button>
                    
                    <Button
                      type="submit"
                      disabled={contactMutation.isPending}
                      className="bg-gradient-to-r from-cyber-blue to-cyber-green hover:opacity-90 text-white font-semibold px-8"
                    >
                      {contactMutation.isPending ? (
                        <LoadingSpinner size="sm" className="mr-2" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      {formStep === 3 ? 'Send Message' : 'Next Step'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
