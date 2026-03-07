import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  ArrowRight,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { type BlogPost } from "@shared/schema";

const categoryColors: Record<string, string> = {
  "Network Security": "bg-cyber-blue",
  "AI & Security": "bg-cyber-green",
  "Cloud Security": "bg-cyber-purple",
  "Mobile Security": "bg-yellow-500",
  "Data Analysis": "bg-indigo-500",
  "Design": "bg-pink-500",
};

export default function Blog() {
  const [, setLocation] = useLocation();

  const { data: blogs, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const handleReadMore = (id: number) => {
    setLocation(`/blog/${id}`);
  };

  const handleViewAllArticles = () => {
    setLocation('/blog');
  };

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
          <h2 className="text-4xl font-bold text-foreground mb-4 font-cyber">Technical Blog</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto italic">
            Insights, tutorials, and deep dives into cybersecurity, development, and emerging technologies
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : blogs && blogs.length > 0 ? (
            blogs.map((post, index) => (
              <motion.div
                key={post.id}
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
                      <Badge className={`${categoryColors[post.category] || "bg-cyber-blue"} text-white px-3 py-1 text-sm font-medium`}>
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-muted-foreground text-sm mb-3">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {post.readTime}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2 underline-offset-4 decoration-primary group-hover:underline">{post.title}</h3>
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
                      onClick={() => handleReadMore(post.id)}
                    >
                      Read More
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No blog posts available at the moment.</p>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8 shadow-lg shadow-primary/20"
            onClick={handleViewAllArticles}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View All Articles
          </Button>
        </motion.div>
      </div>
    </section>
  );
}