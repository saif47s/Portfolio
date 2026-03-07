import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, FileText, Calendar } from "lucide-react";
import { useLocation } from "wouter";

import { useQuery } from "@tanstack/react-query";
import { type Project } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProjectsList() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const handleViewDetails = (projectId: number) => {
    setLocation(`/project/${projectId}`);
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
    <div className="min-h-screen bg-cyber-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-white mb-4">All Projects</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Complete portfolio of cybersecurity implementations, development projects, and technical solutions
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
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-cyber-secondary border-gray-700 hover:border-cyber-blue transition-all duration-300 group overflow-hidden h-full">
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
                      <Badge className="bg-green-500 text-white px-2 py-1 text-xs font-medium">
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
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
      </div>
    </div>
  );
}