import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, Github, ExternalLink, FileText, Share2 } from "lucide-react";
import { useParams, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

// Static project data - in real app this would come from API
import { useQuery } from "@tanstack/react-query";
import { type Project } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function ProjectDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: [`/api/projects/${id}`],
  });

  const handleShare = async () => {
    if (navigator.share && project) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description,
          url: window.location.href
        });
      } catch (err) {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Project link copied to clipboard",
        });
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Project link copied to clipboard",
      });
    }
  };

  const handleGithubView = () => {
    if (project?.githubLink) {
      window.open(project.githubLink, '_blank');
    } else {
      toast({
        title: "Link unavailable",
        description: "GitHub repository link is not provided.",
        variant: "destructive"
      });
    }
  };

  const handleLiveView = () => {
    if (project?.liveLink) {
      window.open(project.liveLink, '_blank');
    } else {
      toast({
        title: "Link unavailable",
        description: "Live demo link is not provided.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-cyber-blue" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Project not found</h2>
          <Button onClick={() => setLocation('/projects')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => setLocation('/projects')}
            className="mb-8 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>

          <div className="relative mb-8">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-96 object-cover rounded-lg"
            />
            <div className="absolute top-4 left-4">
              <Badge className={`${project.categoryColor} text-white px-3 py-1 text-sm font-medium`}>
                {project.category}
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Badge className="bg-green-500 text-white px-3 py-1 text-sm font-medium">
                {project.status}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {project.year}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>

          <h1 className="text-4xl font-bold text-white mb-6">{project.title}</h1>

          <div className="flex flex-wrap gap-2 mb-8">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="bg-gray-700 text-gray-300 text-sm">
                {tech}
              </Badge>
            ))}
          </div>

          <Card className="bg-cyber-secondary border-gray-700 mb-8">
            <CardContent className="p-8">
              <div
                className="prose prose-lg max-w-none text-gray-300"
                style={{ whiteSpace: 'pre-line' }}
              >
                {project.description}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button
              className="bg-cyber-blue hover:bg-cyber-blue/80 text-white"
              onClick={handleGithubView}
            >
              <Github className="mr-2 h-4 w-4" />
              View Code
            </Button>
            <Button
              variant="outline"
              className="border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-white"
              onClick={handleLiveView}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Live Demo
            </Button>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <FileText className="mr-2 h-4 w-4" />
              Documentation
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}