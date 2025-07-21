import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, FileText, Calendar } from "lucide-react";

const projects = [
  {
    title: "Enterprise Network Security Assessment",
    description: "Comprehensive security assessment of a Fortune 500 company's network infrastructure, identifying critical vulnerabilities and implementing defense strategies.",
    category: "Network Security",
    year: "2024",
    technologies: ["Nmap", "Wireshark", "Firewall Config"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    categoryColor: "bg-cyber-blue"
  },
  {
    title: "Web Application Security Testing",
    description: "Full-scale penetration testing of e-commerce platform, discovering and responsibly disclosing multiple high-severity vulnerabilities.",
    category: "Penetration Testing",
    year: "2024",
    technologies: ["Burp Suite", "OWASP", "SQLi"],
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    categoryColor: "bg-cyber-green"
  },
  {
    title: "Ransomware Attack Response",
    description: "Led incident response team during major ransomware attack, minimizing damage and implementing recovery procedures within 24 hours.",
    category: "Incident Response",
    year: "2023",
    technologies: ["Digital Forensics", "Splunk", "Containment"],
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    categoryColor: "bg-cyber-purple"
  }
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 bg-cyber-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Featured Projects</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Real-world cybersecurity implementations and research
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-cyber-secondary border-gray-700 hover:border-cyber-blue transition-all duration-300 group overflow-hidden h-full">
                <div className="relative">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={`${project.categoryColor} text-white px-3 py-1 text-sm font-medium`}>
                      {project.category}
                    </Badge>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="mr-1 h-4 w-4" />
                      {project.year}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3">{project.title}</h3>
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-cyber-blue hover:text-cyber-green transition-colors p-0"
                    >
                      <ExternalLink className="mr-1 h-4 w-4" />
                      View Details
                    </Button>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-gray-400 hover:text-white transition-colors p-2"
                      >
                        <Github className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-gray-400 hover:text-white transition-colors p-2"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button className="bg-gradient-cyber-secondary hover:opacity-90 text-white font-semibold py-3 px-8">
            View All Projects
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
