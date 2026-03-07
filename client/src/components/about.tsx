import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Award, Cloud, Bug, Tag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { type SiteSettings } from "@shared/schema";

const stats = [
  { label: "Experience", value: "5+ Years", color: "text-cyber-blue" },
  { label: "Projects Completed", value: "50+", color: "text-cyber-green" },
  { label: "Certifications", value: "8", color: "text-cyber-purple" },
  { label: "Security Incidents", value: "100+", color: "text-cyber-yellow" }
];

const certifications = [
  {
    name: "Cybersecurity",
    description: "Certified Cybersecurity Expert",
    icon: Shield,
    color: "text-cyber-blue"
  },
  {
    name: "AI Prompting",
    description: "Expert & Certified in Prompting",
    icon: Tag,
    color: "text-cyber-green"
  },
  {
    name: "Cloud Engineer",
    description: "Passionate Cloud Engineering Expert",
    icon: Cloud,
    color: "text-cyber-purple"
  },
  {
    name: "IT Support",
    description: "Certified in IT Support",
    icon: Bug,
    color: "text-cyber-yellow"
  }
];

export default function About() {
  const { data: settings, isLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/settings"],
  });

  const dynamicStats = [
    { label: "Experience", value: settings?.statsExperience || "5+ Years", color: "text-cyber-blue" },
    { label: "Projects Completed", value: settings?.statsProjects || "50+", color: "text-cyber-green" },
    { label: "Certifications", value: settings?.statsCertifications || "8", color: "text-cyber-purple" },
    { label: "Security Incidents", value: settings?.statsSecurityIncidents || "100+", color: "text-cyber-yellow" }
  ];

  if (isLoading) {
    return (
      <section className="py-20 bg-cyber-secondary animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-gray-700 w-1/4 rounded mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="h-4 bg-gray-700 w-full rounded"></div>
              <div className="h-4 bg-gray-700 w-full rounded"></div>
              <div className="h-4 bg-gray-700 w-2/3 rounded"></div>
            </div>
            <div className="h-64 bg-gray-700 rounded-2xl"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 bg-cyber-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6 font-cyber">About Me</h2>
            <div className="space-y-6 text-lg text-gray-300 mb-8 whitespace-pre-wrap">
              {settings?.aboutMe}
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {dynamicStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h4 className={`${stat.color} font-semibold mb-2 text-sm`}>{stat.label}</h4>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10 bg-gradient-to-r from-cyber-blue to-cyber-green p-1 rounded-2xl overflow-hidden aspect-video lg:aspect-square">
              <img
                src={settings?.aboutImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"}
                alt="Cybersecurity professional at work"
                className="rounded-2xl w-full h-full object-cover"
              />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-cyber-blue to-cyber-green rounded-2xl blur opacity-20"></div>
          </motion.div>
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Certifications & Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-cyber-dark border-gray-700 hover:border-cyber-blue transition-colors text-center h-full">
                  <CardContent className="p-6">
                    <cert.icon className={`${cert.color} h-12 w-12 mx-auto mb-3`} />
                    <h4 className="text-white font-semibold mb-2">{cert.name}</h4>
                    <p className="text-gray-400 text-sm">{cert.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
