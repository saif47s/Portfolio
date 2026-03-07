import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, FileText, Calendar } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

import { useQuery } from "@tanstack/react-query";
import { type Project } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function Projects() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const handleViewDetails = (id: number) => {
    setLocation(`/project/${id}`);
  };

  const handleViewAllProjects = () => {
    setLocation('/projects');
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
        description: "Live demo link is not provided for this project.",
        variant: "destructive"
      });
    }
  };

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

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-cyber-blue" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects?.map((project, index) => (
              <motion.div
                key={project.id}
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
                    <p className="text-gray-400 mb-4 text-sm leading-relaxed line-clamp-3">{project.description}</p>

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
                        onClick={() => handleViewDetails(project.id)}
                      >
                        <ExternalLink className="mr-1 h-4 w-4" />
                        View Details
                      </Button>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white transition-colors p-2"
                          onClick={() => handleGithubView(project)}
                        >
                          <Github className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white transition-colors p-2"
                          onClick={() => handleLiveView(project)}
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
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            className="bg-gradient-cyber-secondary hover:opacity-90 text-white font-semibold py-3 px-8"
            onClick={handleViewAllProjects}
          >
            View All Projects
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
