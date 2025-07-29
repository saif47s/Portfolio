import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Star, Plus, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const testimonials = [
  {
    name: "John Doe",
    title: "CTO, TechCorp",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    company: "TechCorp Solutions",
    gradient: "from-cyber-blue to-cyber-purple",
    testimonial: "Saif's cybersecurity expertise is exceptional. His penetration testing identified critical vulnerabilities that could have cost us millions. Professional and thorough approach with detailed reporting.",
    rating: 5,
    project: "Network Security Assessment"
  },
  {
    name: "Sarah Miller",
    title: "CISO, FinanceSecure",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    company: "FinanceSecure Inc.",
    gradient: "from-cyber-green to-emerald-600",
    testimonial: "Outstanding incident response during our security breach. Saif's quick containment and thorough forensic analysis saved our reputation. His cloud security implementation is world-class.",
    rating: 5,
    project: "Incident Response & Cloud Migration"
  },
  {
    name: "Michael Johnson",
    title: "CEO, StartupInnovate",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    company: "StartupInnovate Labs",
    gradient: "from-cyber-purple to-purple-600",
    testimonial: "Saif's comprehensive security assessment and mobile app development helped us secure major client contracts. His UI/UX design skills transformed our user experience completely.",
    rating: 5,
    project: "Security Assessment & Mobile Development"
  },
  {
    name: "Emily Chen",
    title: "Data Director, Analytics Pro",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    company: "Analytics Pro",
    gradient: "from-yellow-500 to-orange-500",
    testimonial: "Incredible data analysis and visualization work. Saif transformed our complex datasets into actionable insights that increased our revenue by 40%. His AI prompting expertise is cutting-edge.",
    rating: 5,
    project: "Data Analytics & AI Implementation"
  },
  {
    name: "David Wilson",
    title: "Network Manager, ConnectFlow",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    company: "ConnectFlow Networks",
    gradient: "from-indigo-500 to-blue-600",
    testimonial: "Saif redesigned our entire network infrastructure and implemented robust security measures. His network engineering skills are unmatched. Zero downtime since implementation.",
    rating: 5,
    project: "Network Infrastructure & Security"
  },
  {
    name: "Lisa Rodriguez",
    title: "Product Manager, DesignHub",
    photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    company: "DesignHub Creative",
    gradient: "from-pink-500 to-rose-600",
    testimonial: "Amazing UI/UX design work! Saif's design thinking and user research approach improved our app's user engagement by 60%. His attention to detail is remarkable.",
    rating: 5,
    project: "UI/UX Design & User Research"
  }
];

const testimonialFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  position: z.string().optional(),
  rating: z.number().min(1).max(5),
  testimonial: z.string().min(10, "Testimonial must be at least 10 characters"),
  project: z.string().optional(),
});

type TestimonialFormData = z.infer<typeof testimonialFormSchema>;

export default function Testimonials() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      position: "",
      rating: 5,
      testimonial: "",
      project: "",
    },
  });

  const onSubmit = async (data: TestimonialFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Thank You! ✓",
          description: "Your testimonial has been submitted and will be reviewed before publishing.",
          duration: 5000,
        });
        
        form.reset();
        setIsDialogOpen(false);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Unable to submit testimonial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section className="py-20 bg-cyber-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-4xl font-bold text-white">Client Testimonials</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  className="bg-cyber-blue hover:bg-cyber-blue/80 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Review
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-cyber-secondary border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Share Your Experience</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Name *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your full name" 
                                className="bg-cyber-dark border-gray-600 text-white"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Email *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="your@email.com" 
                                className="bg-cyber-dark border-gray-600 text-white"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Company</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Company name" 
                                className="bg-cyber-dark border-gray-600 text-white"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Position</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your job title" 
                                className="bg-cyber-dark border-gray-600 text-white"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="project"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Project Type</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Security Assessment, Web Development" 
                              className="bg-cyber-dark border-gray-600 text-white"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Rating *</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => field.onChange(star)}
                                  className={`p-1 rounded transition-colors ${
                                    field.value >= star 
                                      ? 'text-yellow-400' 
                                      : 'text-gray-500 hover:text-yellow-300'
                                  }`}
                                >
                                  <Star className="w-6 h-6 fill-current" />
                                </button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="testimonial"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Your Review *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Share your experience working with Saif..." 
                              className="bg-cyber-dark border-gray-600 text-white min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-cyber-blue hover:bg-cyber-blue/80 text-white"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Review
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-xl text-gray-400">What clients say about my cybersecurity expertise</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-cyber-secondary border-gray-700 h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="relative mr-4">
                      <img 
                        src={testimonial.photo} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r ${testimonial.gradient} rounded-full border-2 border-cyber-secondary`}></div>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.title}</p>
                      <p className="text-gray-500 text-xs">{testimonial.company}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 italic mb-3 leading-relaxed text-sm">
                    "{testimonial.testimonial}"
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">{testimonial.project}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
