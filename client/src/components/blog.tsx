import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, ExternalLink } from "lucide-react";

const blogPosts = [
  {
    title: "Advanced Network Scanning Techniques with Python",
    excerpt: "Deep dive into building sophisticated network scanning tools using Python, covering port scanning, service detection, and vulnerability assessment.",
    date: "2024-12-15",
    readTime: "8 min read",
    category: "Network Security",
    tags: ["Python", "Network Security", "Penetration Testing"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    categoryColor: "bg-cyber-blue"
  },
  {
    title: "AI-Powered Threat Detection: The Future of Cybersecurity",
    excerpt: "Exploring how artificial intelligence and machine learning are revolutionizing threat detection and incident response in modern cybersecurity.",
    date: "2024-12-10",
    readTime: "6 min read",
    category: "AI & Security",
    tags: ["AI", "Machine Learning", "Threat Detection"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    categoryColor: "bg-cyber-green"
  },
  {
    title: "Building Secure Cloud Architectures: Best Practices Guide",
    excerpt: "Comprehensive guide to designing and implementing secure cloud infrastructures across AWS, Azure, and GCP platforms.",
    date: "2024-12-05",
    readTime: "10 min read",
    category: "Cloud Security",
    tags: ["Cloud Security", "AWS", "Azure", "DevSecOps"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    categoryColor: "bg-cyber-purple"
  },
  {
    title: "React Native Security: Protecting Mobile Applications",
    excerpt: "Essential security practices for React Native development, including data protection, secure authentication, and API security.",
    date: "2024-11-28",
    readTime: "7 min read",
    category: "Mobile Security",
    tags: ["React Native", "Mobile Security", "App Development"],
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    categoryColor: "bg-yellow-500"
  },
  {
    title: "Data Visualization for Cybersecurity Analytics",
    excerpt: "Transforming complex security data into actionable insights using modern visualization techniques and tools.",
    date: "2024-11-20",
    readTime: "9 min read",
    category: "Data Analysis",
    tags: ["Data Visualization", "Security Analytics", "Python"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    categoryColor: "bg-indigo-500"
  },
  {
    title: "UI/UX Design for Security Applications",
    excerpt: "Designing intuitive and secure user interfaces for cybersecurity tools and enterprise security applications.",
    date: "2024-11-15",
    readTime: "5 min read",
    category: "Design",
    tags: ["UI/UX", "Security Design", "User Experience"],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    categoryColor: "bg-pink-500"
  }
];

export default function Blog() {
  return (
    <section id="blog" className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">Technical Blog</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Insights, tutorials, and deep dives into cybersecurity, development, and emerging technologies
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
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
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`${post.categoryColor} text-white px-3 py-1 text-sm font-medium`}>
                      {post.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-muted-foreground text-sm mb-3">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    className="text-primary hover:text-primary/80 transition-colors p-0 h-auto font-medium"
                  >
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8">
            <ExternalLink className="mr-2 h-4 w-4" />
            View All Articles
          </Button>
        </motion.div>
      </div>
    </section>
  );
}