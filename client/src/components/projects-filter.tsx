import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, FileText, Calendar, Filter } from "lucide-react";
import { SkeletonCard } from "@/components/loading-spinner";
import { Project } from "@shared/schema";

import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

const categories = ["All", "Cybersecurity", "Network Engineering", "Cloud Engineering", "Data Analysis", "Mobile Development", "UI/UX Design", "AI & Prompting", "Database Management"];

export default function ProjectsFilter() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const filteredProjects = projects
    ? (selectedCategory === "All"
      ? projects
      : projects.filter(project => project.category === selectedCategory))
    : [];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleViewDetails = (id: number) => {
    setLocation(`/project/${id}`);
  };

  const handleGithubView = (project: Project) => {
    if (project.githubLink) {
      window.open(project.githubLink, '_blank');
    } else {
      toast({
        title: "Link unavailable",
        description: "GitHub link is not provided for this project.",
        variant: "destructive"
      });
    }
  };

  const handleLiveView = (project: Project) => {
    if (project.liveLink) {
      window.open(project.liveLink, '_blank');
    } else {
      toast({
        title: "Link unavailable",
        description: "Live demo link is not provided.",
        variant: "destructive"
      });
    }
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
                        onClick={() => handleViewDetails(project.id)}
                      >
                        <ExternalLink className="mr-1 h-4 w-4" />
                        View Details
                      </Button>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground transition-colors p-2"
                          onClick={() => handleGithubView(project)}
                        >
                          <Github className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground transition-colors p-2"
                          onClick={() => handleLiveView(project)}
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
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8"
            onClick={() => setLocation('/projects')}
          >
            View All Projects
          </Button>
        </motion.div>
      </div>
    </section>
  );
}