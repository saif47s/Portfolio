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

import { useQuery } from "@tanstack/react-query";
import { Skill } from "@shared/schema";

const iconMap: Record<string, any> = {
  "Cybersecurity": Shield,
  "Network": Network,
  "Cloud": Cloud,
  "Design": Settings,
  "Data": TrendingUp,
  "SEO": AlertTriangle,
  "AI": Bug,
  "Development": CheckCircle,
  "Support": Settings
};

const gradientMap: Record<string, string> = {
  "Cybersecurity": "from-cyber-blue to-cyber-purple",
  "Network": "from-cyber-green to-emerald-600",
  "Cloud": "from-cyber-purple to-purple-600",
  "Design": "from-pink-500 to-rose-600",
  "Data": "from-yellow-500 to-orange-500",
  "SEO": "from-indigo-500 to-blue-600",
  "AI": "from-purple-500 to-indigo-600",
  "Development": "from-green-500 to-teal-600",
  "Support": "from-red-500 to-pink-600"
};

function getIcon(name: string) {
  for (const key in iconMap) {
    if (name.includes(key)) return iconMap[key];
  }
  return CheckCircle;
}

function getGradient(name: string) {
  for (const key in gradientMap) {
    if (name.includes(key)) return gradientMap[key];
  }
  return "from-cyber-blue to-cyber-green";
}

export default function Skills() {
  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  if (isLoading) {
    return (
      <section id="skills" className="py-20 bg-cyber-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          Loading expertise...
        </div>
      </section>
    );
  }
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
          {(skills || []).map((skill, index) => {
            const Icon = getIcon(skill.name);
            const gradient = getGradient(skill.name);
            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-cyber-dark border-gray-700 hover:border-cyber-blue transition-all duration-300 group h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center mr-4`}>
                        <Icon className="text-white h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">{skill.name}</h3>
                    </div>

                    <div className="text-gray-400 space-y-2 mb-4">
                      <div className="flex items-center">
                        <CheckCircle className="text-cyber-green mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">{skill.projectsCount}+ Projects Completed</span>
                      </div>
                    </div>

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
            );
          })}
        </div>
      </div>
    </section>
  );
}
