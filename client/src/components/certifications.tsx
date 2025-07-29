import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Award, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const certifications = [
  {
    name: "Certified Ethical Hacker (CEH)",
    issuer: "EC-Council",
    date: "2023",
    status: "Active",
    credentialId: "ECC-1234567",
    description: "Advanced ethical hacking and penetration testing certification",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    verifyLink: "#",
    skills: ["Penetration Testing", "Vulnerability Assessment", "Ethical Hacking"]
  },
  {
    name: "AWS Certified Security Specialty",
    issuer: "Amazon Web Services",
    date: "2023",
    status: "Active",
    credentialId: "AWS-SEC-789",
    description: "Specialized in securing AWS cloud environments and workloads",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    verifyLink: "#",
    skills: ["Cloud Security", "AWS", "Identity Management"]
  },
  {
    name: "Certified Information Systems Security Professional (CISSP)",
    issuer: "ISC2",
    date: "2022",
    status: "Active",
    credentialId: "CISSP-456789",
    description: "Comprehensive information security management certification",
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    verifyLink: "#",
    skills: ["Security Management", "Risk Assessment", "Governance"]
  },
  {
    name: "AI Prompting Expert Certification",
    issuer: "AI Institute",
    date: "2024",
    status: "Active",
    credentialId: "AI-PROMPT-123",
    description: "Advanced AI prompting techniques and automation strategies",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    verifyLink: "#",
    skills: ["AI Prompting", "Machine Learning", "Automation"]
  },
  {
    name: "Google Cloud Professional Cloud Architect",
    issuer: "Google Cloud",
    date: "2023",
    status: "Active",
    credentialId: "GCP-ARCH-567",
    description: "Design and manage scalable, secure cloud architectures",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    verifyLink: "#",
    skills: ["Cloud Architecture", "GCP", "Infrastructure Design"]
  },
  {
    name: "CompTIA IT Fundamentals+",
    issuer: "CompTIA",
    date: "2021",
    status: "Active",
    credentialId: "COMP-IT-890",
    description: "Fundamental IT skills and knowledge certification",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    verifyLink: "#",
    skills: ["IT Support", "System Administration", "Troubleshooting"]
  }
];

export default function Certifications() {
  const [verifyingIds, setVerifyingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleVerifyCredential = async (credentialId: string, issuer: string) => {
    setVerifyingIds(prev => new Set(Array.from(prev).concat(credentialId)));
    
    try {
      const response = await fetch('/api/verify-credential', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credentialId, issuer }),
      });

      const result = await response.json();

      if (result.success && result.verified) {
        toast({
          title: "Credential Verified ✓",
          description: `${issuer} credential is valid and active`,
          duration: 4000,
        });
        
        // Open verification URL in new tab
        if (result.verificationUrl) {
          window.open(result.verificationUrl, '_blank');
        }
      } else {
        toast({
          title: "Verification Failed",
          description: result.message || "Could not verify credential",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "Unable to connect to verification service",
        variant: "destructive",
      });
    } finally {
      setVerifyingIds(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.delete(credentialId);
        return newSet;
      });
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">Certifications & Credentials</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional certifications validating expertise across multiple technology domains
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 group overflow-hidden h-full">
                <div className="relative">
                  <img 
                    src={cert.image} 
                    alt={cert.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500 text-white px-3 py-1 text-sm font-medium">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {cert.status}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                    <Award className="h-4 w-4" />
                    <span>{cert.issuer}</span>
                    <Calendar className="h-4 w-4 ml-2" />
                    <span>{cert.date}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{cert.name}</h3>
                  <p className="text-muted-foreground mb-3 text-sm">{cert.description}</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    <strong>Credential ID:</strong> {cert.credentialId}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {cert.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleVerifyCredential(cert.credentialId, cert.issuer)}
                    disabled={verifyingIds.has(cert.credentialId)}
                  >
                    {verifyingIds.has(cert.credentialId) ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="mr-2 h-3 w-3" />
                        Verify Credential
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}