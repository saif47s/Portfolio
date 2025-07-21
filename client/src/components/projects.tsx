import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, FileText, Calendar } from "lucide-react";

const projects = [
  {
    title: "NetSec - Network Scanning App",
    description: "Currently developing a comprehensive networking scanning application for device discovery and management. Features network mapping, device identification, and security analysis tools.",
    category: "Network Engineering",
    year: "2025",
    technologies: ["Python", "Network Protocols", "Security Analysis", "Device Management"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    categoryColor: "bg-cyber-blue"
  },
  {
    title: "Data Analysis & Visualization Platform",
    description: "Advanced data analysis platform with interactive visualizations, transforming complex datasets into actionable business insights using modern analytics techniques.",
    category: "Data Analysis",
    year: "2024",
    technologies: ["Python", "Data Visualization", "Analytics", "Business Intelligence"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    categoryColor: "bg-cyber-green"
  },
  {
    title: "Cloud Security & Mobile Development",
    description: "Comprehensive cloud security implementation with React Native mobile applications, featuring secure authentication, data protection, and cross-platform compatibility.",
    category: "Cloud & Mobile",
    year: "2024",
    technologies: ["React Native", "Cloud Security", "Mobile Development", "Cross-platform"],
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    categoryColor: "bg-cyber-purple"
  },
  {
    title: "UI/UX Design & SEO Optimization",
    description: "Complete UI/UX design systems with integrated SEO optimization strategies, improving user experience and search engine visibility for multiple client projects.",
    category: "Design & SEO",
    year: "2024",
    technologies: ["UI/UX Design", "SEO Optimization", "Design Systems", "User Experience"],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    categoryColor: "bg-yellow-500"
  },
  {
    title: "AI Prompting & Business IT Solutions",
    description: "Expert AI prompting solutions for business automation and IT optimization, helping organizations leverage AI technologies for improved efficiency and decision-making.",
    category: "AI & Business IT",
    year: "2024",
    technologies: ["AI Prompting", "Business Automation", "IT Optimization", "Machine Learning"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    categoryColor: "bg-purple-500"
  },
  {
    title: "Database Administration & Management",
    description: "Complete database design, administration, and management solutions with focus on performance optimization, security, and scalability for enterprise applications.",
    category: "Database Management",
    year: "2024",
    technologies: ["Database Design", "Performance Optimization", "Security", "Scalability"],
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    categoryColor: "bg-indigo-500"
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
