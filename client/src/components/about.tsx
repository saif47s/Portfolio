import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Award, Cloud, Bug, Tag } from "lucide-react";

const stats = [
  { label: "Experience", value: "5+ Years", color: "text-cyber-blue" },
  { label: "Projects Completed", value: "50+", color: "text-cyber-green" },
  { label: "Certifications", value: "8", color: "text-cyber-purple" },
  { label: "Security Incidents", value: "100+", color: "text-cyber-yellow" }
];

const certifications = [
  {
    name: "CISSP",
    description: "Certified Information Systems Security Professional",
    icon: Tag,
    color: "text-cyber-blue"
  },
  {
    name: "CEH",
    description: "Certified Ethical Hacker",
    icon: Shield,
    color: "text-cyber-green"
  },
  {
    name: "AWS Security",
    description: "AWS Certified Security Specialty",
    icon: Cloud,
    color: "text-cyber-purple"
  },
  {
    name: "OSCP",
    description: "Offensive Security Certified Professional",
    icon: Bug,
    color: "text-cyber-yellow"
  }
];

export default function About() {
  return (
    <section id="about" className="py-20 bg-cyber-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">About Me</h2>
            <p className="text-lg text-gray-300 mb-6">
              With over 5 years of experience in cybersecurity, I specialize in protecting 
              organizations from evolving digital threats. My expertise spans network security, 
              penetration testing, incident response, and risk assessment.
            </p>
            <p className="text-lg text-gray-300 mb-8">
              I'm passionate about staying ahead of emerging threats and continuously expanding 
              my knowledge in areas like cloud security, AI-powered threat detection, and 
              zero-trust architectures.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h4 className={`${stat.color} font-semibold mb-2 text-sm`}>{stat.label}</h4>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10 bg-gradient-to-r from-cyber-blue to-cyber-green p-1 rounded-2xl">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Cybersecurity professional at work" 
                className="rounded-2xl w-full"
              />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-cyber-blue to-cyber-green rounded-2xl blur opacity-20"></div>
          </motion.div>
        </div>
        
        {/* Certifications */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Certifications & Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-cyber-dark border-gray-700 hover:border-cyber-blue transition-colors text-center h-full">
                  <CardContent className="p-6">
                    <cert.icon className={`${cert.color} h-12 w-12 mx-auto mb-3`} />
                    <h4 className="text-white font-semibold mb-2">{cert.name}</h4>
                    <p className="text-gray-400 text-sm">{cert.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
