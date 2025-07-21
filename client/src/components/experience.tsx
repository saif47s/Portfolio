import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ExternalLink } from "lucide-react";

const experiences = [
  {
    title: "Senior Cybersecurity Specialist",
    company: "TechSecure Solutions",
    location: "Remote",
    period: "2023 - Present",
    type: "Full-time",
    description: "Leading cybersecurity initiatives for enterprise clients, conducting penetration testing, and implementing zero-trust security architectures.",
    achievements: [
      "Reduced security incidents by 85% across client organizations",
      "Led incident response for 50+ security breaches",
      "Developed custom security tools used by 100+ organizations"
    ],
    technologies: ["Penetration Testing", "SIEM", "Zero Trust", "Incident Response"]
  },
  {
    title: "Cloud Security Engineer",
    company: "CloudTech Innovations",
    location: "Remote",
    period: "2022 - 2023",
    type: "Full-time",
    description: "Specialized in cloud security architecture, AWS/Azure security implementations, and DevSecOps practices.",
    achievements: [
      "Migrated 20+ applications to secure cloud environments",
      "Implemented automated security scanning pipelines",
      "Achieved SOC2 compliance for multiple client projects"
    ],
    technologies: ["AWS Security", "Azure Security", "DevSecOps", "Kubernetes"]
  },
  {
    title: "Full-Stack Developer & UI/UX Designer",
    company: "Digital Innovations Lab",
    location: "Remote",
    period: "2021 - 2022",
    type: "Full-time",
    description: "Developed mobile applications and web platforms while designing intuitive user experiences and interfaces.",
    achievements: [
      "Delivered 15+ mobile applications with 4.8+ app store ratings",
      "Improved user engagement by 60% through UX optimization",
      "Created design systems adopted by 5+ development teams"
    ],
    technologies: ["React Native", "Python", "UI/UX Design", "Mobile Development"]
  },
  {
    title: "Network Engineering Consultant",
    company: "NetWork Solutions Inc.",
    location: "Remote",
    period: "2020 - 2021",
    type: "Freelance",
    description: "Provided network infrastructure design, security implementation, and performance optimization services.",
    achievements: [
      "Designed network infrastructure for 30+ organizations",
      "Reduced network downtime by 95% through proactive monitoring",
      "Implemented secure network architectures meeting compliance standards"
    ],
    technologies: ["Network Security", "Infrastructure Design", "Performance Optimization"]
  }
];

export default function Experience() {
  return (
    <section id="experience" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">Professional Experience</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            My journey through various technology domains and leadership roles
          </p>
        </motion.div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-border"></div>
          
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10"></div>
                
                <div className={`w-full md:w-5/12 ml-12 md:ml-0 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                  <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {exp.type}
                        </Badge>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Calendar className="mr-1 h-4 w-4" />
                          {exp.period}
                        </div>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <MapPin className="mr-1 h-4 w-4" />
                          {exp.location}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-foreground mb-2">{exp.title}</h3>
                      <p className="text-primary font-medium mb-3">{exp.company}</p>
                      <p className="text-muted-foreground mb-4 leading-relaxed">{exp.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-foreground mb-2">Key Achievements:</h4>
                        <ul className="space-y-1">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start">
                              <span className="text-primary mr-2">•</span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}