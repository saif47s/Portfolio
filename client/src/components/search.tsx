import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, X, Filter, Clock, BookOpen, User, Briefcase } from "lucide-react";

interface SearchResult {
  type: "project" | "blog" | "skill" | "experience";
  title: string;
  description: string;
  category?: string;
  tags: string[];
  url?: string;
}

const searchData: SearchResult[] = [
  // Projects
  {
    type: "project",
    title: "NetSec - Network Scanning App",
    description: "Currently developing a comprehensive networking scanning application for device discovery and management.",
    category: "Network Engineering",
    tags: ["Python", "Network Protocols", "Security Analysis"],
    url: "#projects"
  },
  {
    type: "project", 
    title: "AI-Powered Security Dashboard",
    description: "Machine learning-based security monitoring dashboard with real-time threat detection.",
    category: "Cybersecurity",
    tags: ["Python", "Machine Learning", "React", "Security Analytics"],
    url: "#projects"
  },
  
  // Blog Posts
  {
    type: "blog",
    title: "Advanced Network Scanning Techniques with Python",
    description: "Deep dive into building sophisticated network scanning tools using Python.",
    tags: ["Python", "Network Security", "Penetration Testing"],
    url: "#blog"
  },
  {
    type: "blog",
    title: "AI-Powered Threat Detection: The Future of Cybersecurity",
    description: "Exploring how AI and ML are revolutionizing threat detection.",
    tags: ["AI", "Machine Learning", "Threat Detection"],
    url: "#blog"
  },
  
  // Skills
  {
    type: "skill",
    title: "Cybersecurity",
    description: "Penetration testing, vulnerability assessment, incident response, and security architecture.",
    tags: ["Penetration Testing", "SIEM", "Incident Response", "Security Architecture"],
    url: "#skills"
  },
  {
    type: "skill",
    title: "Network Engineering", 
    description: "Network design, security implementation, and infrastructure optimization.",
    tags: ["Network Design", "Security Implementation", "Infrastructure"],
    url: "#skills"
  },
  
  // Experience
  {
    type: "experience",
    title: "Senior Cybersecurity Specialist",
    description: "Leading cybersecurity initiatives for enterprise clients at TechSecure Solutions.",
    tags: ["Penetration Testing", "Zero Trust", "Incident Response"],
    url: "#experience"
  }
];

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    if (query.length > 0) {
      const filteredResults = searchData.filter(item => {
        const matchesQuery = 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
        
        const matchesType = selectedType === "all" || item.type === selectedType;
        
        return matchesQuery && matchesType;
      });
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  }, [query, selectedType]);

  const getIcon = (type: string) => {
    switch (type) {
      case "project": return <Briefcase className="h-4 w-4" />;
      case "blog": return <BookOpen className="h-4 w-4" />;
      case "skill": return <Filter className="h-4 w-4" />;
      case "experience": return <User className="h-4 w-4" />;
      default: return <SearchIcon className="h-4 w-4" />;
    }
  };

  const scrollToSection = (url: string) => {
    if (url.startsWith("#")) {
      const element = document.querySelector(url);
      element?.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
      setQuery("");
    }
  };

  return (
    <>
      {/* Search Trigger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="text-muted-foreground hover:text-foreground"
      >
        <SearchIcon className="h-5 w-5" />
      </Button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl mx-4"
            >
              <Card className="bg-card border-border">
                <CardContent className="p-0">
                  {/* Search Header */}
                  <div className="flex items-center p-4 border-b border-border">
                    <SearchIcon className="h-5 w-5 text-muted-foreground mr-3" />
                    <input
                      type="text"
                      placeholder="Search projects, blog posts, skills..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-2 p-4 border-b border-border">
                    {["all", "project", "blog", "skill", "experience"].map((type) => (
                      <Button
                        key={type}
                        variant={selectedType === type ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedType(type)}
                        className="capitalize"
                      >
                        {getIcon(type)}
                        <span className="ml-1">{type === "all" ? "All" : type}</span>
                      </Button>
                    ))}
                  </div>

                  {/* Search Results */}
                  <div className="max-h-96 overflow-y-auto">
                    {query.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Start typing to search projects, blog posts, and more...</p>
                      </div>
                    ) : results.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        <p>No results found for "{query}"</p>
                      </div>
                    ) : (
                      <div className="p-2">
                        {results.map((result, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Button
                              variant="ghost"
                              onClick={() => result.url && scrollToSection(result.url)}
                              className="w-full p-4 h-auto justify-start text-left hover:bg-muted/50"
                            >
                              <div className="flex items-start w-full">
                                <div className="mr-3 mt-1">
                                  {getIcon(result.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-medium truncate">{result.title}</h3>
                                    <Badge variant="secondary" className="text-xs capitalize">
                                      {result.type}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                    {result.description}
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {result.tags.slice(0, 3).map((tag) => (
                                      <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Search Footer */}
                  <div className="p-4 border-t border-border text-center">
                    <p className="text-xs text-muted-foreground">
                      Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Esc</kbd> to close
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}