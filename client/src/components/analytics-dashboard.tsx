import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MessageSquare, 
  Download, 
  Globe, 
  Shield,
  Code,
  Briefcase,
  Star,
  Calendar,
  Activity,
  BarChart3,
  PieChart,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const stats = [
  {
    title: "Total Projects",
    value: "50+",
    change: "+12%",
    icon: Briefcase,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  {
    title: "Satisfied Clients",
    value: "45",
    change: "+8%",
    icon: Users,
    color: "text-green-500",
    bgColor: "bg-green-500/10"
  },
  {
    title: "Security Audits",
    value: "120+",
    change: "+25%",
    icon: Shield,
    color: "text-red-500",
    bgColor: "bg-red-500/10"
  },
  {
    title: "Code Commits",
    value: "2.5K+",
    change: "+18%",
    icon: Code,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10"
  }
];

const skills = [
  { name: "Cybersecurity", progress: 95, projects: 35 },
  { name: "Network Engineering", progress: 90, projects: 28 },
  { name: "Cloud Engineering", progress: 88, projects: 32 },
  { name: "Python Development", progress: 92, projects: 45 },
  { name: "UI/UX Design", progress: 85, projects: 22 },
  { name: "Data Analysis", progress: 87, projects: 18 },
  { name: "Mobile Development", progress: 80, projects: 15 },
  { name: "AI Prompting", progress: 93, projects: 12 }
];

const recentActivities = [
  {
    type: "project",
    title: "Completed NetSec Network Scanner",
    description: "Advanced network scanning application with security analysis",
    time: "2 hours ago",
    icon: Shield,
    color: "text-blue-500"
  },
  {
    type: "certification",
    title: "AWS Security Specialty Renewed",
    description: "Successfully renewed AWS certification with updated knowledge",
    time: "1 day ago",
    icon: Star,
    color: "text-yellow-500"
  },
  {
    type: "blog",
    title: "Published AI Security Article",
    description: "Deep dive into AI-powered threat detection techniques",
    time: "3 days ago",
    icon: MessageSquare,
    color: "text-green-500"
  },
  {
    type: "client",
    title: "New Client Consultation",
    description: "Security assessment consultation for enterprise client",
    time: "5 days ago",
    icon: Users,
    color: "text-purple-500"
  }
];

const projectCategories = [
  { name: "Cybersecurity", count: 18, color: "bg-red-500" },
  { name: "Cloud Engineering", count: 12, color: "bg-blue-500" },
  { name: "Web Development", count: 10, color: "bg-green-500" },
  { name: "Mobile Apps", count: 8, color: "bg-purple-500" },
  { name: "Data Analytics", count: 6, color: "bg-yellow-500" }
];

export default function AnalyticsDashboard() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    
    try {
      const response = await fetch('/api/analytics/report');
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'saif-portfolio-analytics-report.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "Report Downloaded ✓",
          description: "Analytics report saved successfully",
          duration: 3000,
        });
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to generate analytics report",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section id="analytics" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">Performance Analytics</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real-time insights into project delivery, client satisfaction, and technical expertise
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <Badge variant="secondary" className="text-xs text-green-600 bg-green-100 dark:bg-green-900">
                      {stat.change}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Skills Progress */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="bg-card border-border h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Skills & Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{skill.projects} projects</span>
                          <span className="text-sm font-semibold text-foreground">{skill.progress}%</span>
                        </div>
                      </div>
                      <Progress value={skill.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="bg-card border-border h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`p-2 rounded-full bg-muted`}>
                        <activity.icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground mb-1">{activity.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{activity.description}</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Project Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Project Distribution by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {projectCategories.map((category, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-16 h-16 ${category.color} rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg`}>
                      {category.count}
                    </div>
                    <h4 className="text-sm font-medium text-foreground mb-1">{category.name}</h4>
                    <p className="text-xs text-muted-foreground">Projects</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={handleDownloadReport}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Full Report
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}