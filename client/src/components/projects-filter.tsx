import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, FileText, Calendar, Filter } from "lucide-react";
import { SkeletonCard } from "@/components/loading-spinner";

const projects = [
  {
    title: "NetSec - Network Scanning App",
    description: "Currently developing a comprehensive networking scanning application for device discovery and management. Features network mapping, device identification, and security analysis tools.",
    category: "Network Engineering",
    year: "2025",
    technologies: ["Python", "Network Protocols", "Security Analysis", "Device Management"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    categoryColor: "bg-cyber-blue",
    status: "In Progress"
  },
  {
    title: "AI-Powered Security Dashboard",
    description: "Machine learning-based security monitoring dashboard with real-time threat detection, automated incident response, and predictive analytics for enterprise environments.",
    category: "Cybersecurity",
    year: "2024",
    technologies: ["Python", "Machine Learning", "React", "Security Analytics"],
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    categoryColor: "bg-cyber-blue",
    status: "Completed"
  },
  {
    title: "Cloud Infrastructure Automation",
    description: "Automated cloud deployment pipeline with infrastructure as code, security compliance checks, and multi-cloud management across AWS, Azure, and GCP.",
    category: "Cloud Engineering",
    year: "2024",
    technologies: ["Terraform", "AWS", "Azure", "Kubernetes", "DevOps"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    categoryColor: "bg-cyber-green",
    status: "Completed"
  },
  {
    title: "Data Analysis & Visualization Platform",
    description: "Advanced data analysis platform with interactive visualizations, transforming complex datasets into actionable business insights using modern analytics techniques.",
    category: "Data Analysis",
    year: "2024",
    technologies: ["Python", "Data Visualization", "Analytics", "Business Intelligence"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    categoryColor: "bg-cyber-green",
    status: "Completed"
  },
  {
    title: "Mobile Banking Security App",
    description: "Secure mobile banking application with biometric authentication, end-to-end encryption, and real-time fraud detection built with React Native.",
    category: "Mobile Development",
    year: "2024",
    technologies: ["React Native", "Security", "Biometrics", "Encryption"],
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    categoryColor: "bg-cyber-purple",
    status: "Completed"
  },
  {
    title: "E-commerce UI/UX Redesign",
    description: "Complete UI/UX redesign of e-commerce platform, improving user experience by 60% and increasing conversion rates through data-driven design decisions.",
    category: "UI/UX Design",
    year: "2024",
    technologies: ["Figma", "User Research", "Prototyping", "A/B Testing"],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    categoryColor: "bg-yellow-500",
    status: "Completed"
  },
  {
    title: "AI Chatbot & Automation Suite",
    description: "Enterprise AI chatbot with advanced prompting techniques, workflow automation, and integration with business systems for improved customer service.",
    category: "AI & Prompting",
    year: "2024",
    technologies: ["AI Prompting", "Natural Language Processing", "Automation", "Integration"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    categoryColor: "bg-purple-500",
    status: "Completed"
  },
  {
    title: "Database Performance Optimization",
    description: "Complete database redesign and optimization project, improving query performance by 80% and implementing robust backup and disaster recovery solutions.",
    category: "Database Management",
    year: "2024",
    technologies: ["PostgreSQL", "Performance Tuning", "Backup Solutions", "Monitoring"],
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    categoryColor: "bg-indigo-500",
    status: "Completed"
  }
];

const categories = ["All", "Cybersecurity", "Network Engineering", "Cloud Engineering", "Data Analysis", "Mobile Development", "UI/UX Design", "AI & Prompting", "Database Management"];

export default function ProjectsFilter() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [isLoading, setIsLoading] = useState(false);

  const handleCategoryChange = (category: string) => {
    setIsLoading(true);
    setSelectedCategory(category);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      if (category === "All") {
        setFilteredProjects(projects);
      } else {
        setFilteredProjects(projects.filter(project => project.category === category));
      }
      setIsLoading(false);
    }, 300);
  };

  return (
    <section id="projects" className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">Featured Projects</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real-world implementations across multiple technology domains
          </p>
        </motion.div>
        
        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          <Filter className="h-5 w-5 text-muted-foreground mr-2 mt-2" />
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(category)}
              className="text-sm"
            >
              {category}
            </Button>
          ))}
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : (
            filteredProjects.map((project, index) => (
              <motion.div
              key={`${project.title}-${selectedCategory}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              layout
            >
              <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 group overflow-hidden h-full">
                <div className="relative">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`${project.categoryColor} text-white px-3 py-1 text-sm font-medium`}>
                      {project.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant={project.status === "Completed" ? "default" : "secondary"} className="text-xs">
                      {project.status}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Calendar className="mr-1 h-4 w-4" />
                      {project.year}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">{project.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-primary hover:text-primary/80 transition-colors p-0"
                    >
                      <ExternalLink className="mr-1 h-4 w-4" />
                      View Details
                    </Button>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-muted-foreground hover:text-foreground transition-colors p-2"
                      >
                        <Github className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-muted-foreground hover:text-foreground transition-colors p-2"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            ))
          )}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8">
            View All Projects
          </Button>
        </motion.div>
      </div>
    </section>
  );
}