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
            <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
              {/* Replace this with your actual photo */}
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400" 
                alt="Saif - Tech Expert" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
        >
          <span className="text-white">Saif - Multi-Tech</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue to-cyber-green">
            Expert
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed"
        >
          Certified Expert in Cybersecurity | Network Engineering | Cloud Engineering | UI/UX Design | AI Prompting | Data Analysis | Python Development | Mobile Apps
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Button 
            className="bg-gradient-cyber-primary hover:opacity-90 text-white font-semibold py-3 px-8"
            onClick={() => {
              // Create a sample resume download
              const resumeUrl = "/resume-saif-tech-expert.pdf";
              const link = document.createElement('a');
              link.href = resumeUrl;
              link.download = "Saif-Tech-Expert-Resume.pdf";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
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
          <a 
            href="https://linkedin.com/in/saif-expert" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-cyber-blue text-2xl transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin />
          </a>
          <a 
            href="https://github.com/saif-expert" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-cyber-green text-2xl transition-colors"
            aria-label="GitHub Profile"
          >
            <Github />
          </a>
          <a 
            href="https://twitter.com/saif_expert" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-cyber-purple text-2xl transition-colors"
            aria-label="Twitter Profile"
          >
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
