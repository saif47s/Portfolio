import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Mail, Shield, Linkedin, Github, Twitter } from "lucide-react";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-cyber-dark via-cyber-secondary to-slate-900">
      <div className="absolute inset-0 pattern-dots opacity-20"></div>
      
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-r from-cyber-blue to-cyber-green p-1 mb-8">
            <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
              <Shield className="h-24 w-24 text-cyber-blue" />
            </div>
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
        >
          <span className="text-white">Cybersecurity</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue to-cyber-green">
            Professional
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed"
        >
          Protecting digital assets through advanced network security, penetration testing, and threat analysis
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Button className="bg-gradient-cyber-primary hover:opacity-90 text-white font-semibold py-3 px-8">
            <Download className="mr-2 h-4 w-4" />
            Download Resume
          </Button>
          <Button 
            variant="outline" 
            className="border-2 border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-white font-semibold py-3 px-8"
            onClick={() => scrollToSection("contact")}
          >
            <Mail className="mr-2 h-4 w-4" />
            Get In Touch
          </Button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex justify-center space-x-6"
        >
          <a href="#" className="text-gray-400 hover:text-cyber-blue text-2xl transition-colors">
            <Linkedin />
          </a>
          <a href="#" className="text-gray-400 hover:text-cyber-green text-2xl transition-colors">
            <Github />
          </a>
          <a href="#" className="text-gray-400 hover:text-cyber-purple text-2xl transition-colors">
            <Twitter />
          </a>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
      >
        <div className="text-gray-400 text-2xl">↓</div>
      </motion.div>
    </section>
  );
}
