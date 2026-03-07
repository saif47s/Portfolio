import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Award, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Certification as CertificationType } from "@shared/schema";

export default function Certifications() {
  const { data: certifications, isLoading } = useQuery<CertificationType[]>({
    queryKey: ["/api/certifications"],
  });

  const [verifyingIds, setVerifyingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleVerifyCredential = async (credentialId: string, issuer: string) => {
    if (!credentialId) return;

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

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          Loading certifications...
        </div>
      </section>
    );
  }

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
          {(certifications || []).map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 group overflow-hidden h-full">
                <div className="relative">
                  <img
                    src={cert.image || "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"}
                    alt={cert.title}
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

                  <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{cert.title}</h3>
                  <p className="text-muted-foreground mb-3 text-sm">{cert.description}</p>
                  {cert.credentialId && (
                    <p className="text-xs text-muted-foreground mb-4">
                      <strong>Credential ID:</strong> {cert.credentialId}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1 mb-4">
                    {cert.skills && cert.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleVerifyCredential(cert.credentialId || "", cert.issuer)}
                    disabled={!!cert.credentialId && verifyingIds.has(cert.credentialId)}
                  >
                    {cert.credentialId && verifyingIds.has(cert.credentialId) ? (
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