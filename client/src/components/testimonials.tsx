import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "John Doe",
    title: "CTO, TechCorp",
    initials: "JD",
    gradient: "from-cyber-blue to-cyber-purple",
    testimonial: "Exceptional penetration testing skills. Identified critical vulnerabilities that could have cost us millions. Professional and thorough approach."
  },
  {
    name: "Sarah Miller",
    title: "CISO, FinanceSecure",
    initials: "SM",
    gradient: "from-cyber-green to-emerald-600",
    testimonial: "Outstanding incident response during our security breach. Quick containment and thorough forensic analysis. Highly recommend."
  },
  {
    name: "Michael Johnson",
    title: "CEO, StartupInnovate",
    initials: "MJ",
    gradient: "from-cyber-purple to-purple-600",
    testimonial: "Comprehensive security assessment helped us secure major client contracts. Clear reporting and actionable recommendations."
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
                    <div className={`w-12 h-12 bg-gradient-to-r ${testimonial.gradient} rounded-full flex items-center justify-center mr-4`}>
                      <span className="text-white font-semibold">{testimonial.initials}</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.title}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 italic mb-4 leading-relaxed">
                    "{testimonial.testimonial}"
                  </p>
                  
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
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
