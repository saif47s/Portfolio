import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Network, 
  Bug, 
  AlertTriangle, 
  TrendingUp, 
  Cloud, 
  Settings,
  Shield,
  CheckCircle
} from "lucide-react";

const skills = [
  {
    title: "Cybersecurity Expert",
    icon: Shield,
    progress: 95,
    gradient: "from-cyber-blue to-cyber-purple",
    items: ["Network Security", "Penetration Testing", "Incident Response", "Threat Analysis"]
  },
  {
    title: "Network Engineering",
    icon: Network,
    progress: 90,
    gradient: "from-cyber-green to-emerald-600",
    items: ["Computer Networking", "Network Design", "Infrastructure", "Network Monitoring"]
  },
  {
    title: "Cloud Engineering",
    icon: Cloud,
    progress: 85,
    gradient: "from-cyber-purple to-purple-600",
    items: ["AWS/Azure/GCP", "Cloud Security", "Infrastructure as Code", "DevOps"]
  },
  {
    title: "UI/UX Design",
    icon: Settings,
    progress: 80,
    gradient: "from-pink-500 to-rose-600",
    items: ["User Interface Design", "User Experience", "Prototyping", "Design Systems"]
  },
  {
    title: "Data Analysis & Visualization",
    icon: TrendingUp,
    progress: 85,
    gradient: "from-yellow-500 to-orange-500",
    items: ["Advanced Data Analysis", "Data Visualization", "Business Intelligence", "Insights Generation"]
  },
  {
    title: "SEO & Business IT",
    icon: AlertTriangle,
    progress: 80,
    gradient: "from-indigo-500 to-blue-600",
    items: ["Search Engine Optimization", "Business IT Optimization", "Digital Marketing", "Analytics"]
  },
  {
    title: "AI & Prompting",
    icon: Bug,
    progress: 90,
    gradient: "from-purple-500 to-indigo-600",
    items: ["Expert Prompting", "AI Integration", "Machine Learning", "Automation"]
  },
  {
    title: "Development & Mobile",
    icon: CheckCircle,
    progress: 85,
    gradient: "from-green-500 to-teal-600",
    items: ["Python Development", "React Native", "Mobile Apps", "Database Management"]
  },
  {
    title: "IT Support & Administration",
    icon: Settings,
    progress: 80,
    gradient: "from-red-500 to-pink-600",
    items: ["IT Support Certified", "Database Administration", "System Management", "Technical Support"]
  }
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 bg-cyber-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Technical Expertise</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive cybersecurity skills across multiple domains
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-cyber-dark border-gray-700 hover:border-cyber-blue transition-all duration-300 group h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${skill.gradient} rounded-lg flex items-center justify-center mr-4`}>
                      <skill.icon className="text-white h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{skill.title}</h3>
                  </div>
                  
                  <ul className="text-gray-400 space-y-2 mb-4">
                    {skill.items.map((item) => (
                      <li key={item} className="flex items-center">
                        <CheckCircle className="text-cyber-green mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Proficiency</span>
                      <span className="text-white font-semibold">{skill.progress}%</span>
                    </div>
                    <Progress value={skill.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
