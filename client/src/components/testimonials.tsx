import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

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

export default function Testimonials() {
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
          <h2 className="text-4xl font-bold text-white mb-4">Client Testimonials</h2>
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
