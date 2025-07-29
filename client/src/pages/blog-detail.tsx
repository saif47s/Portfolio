import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function BlogDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: blogPost, isLoading, error } = useQuery({
    queryKey: ['/api/blog', id],
    queryFn: async () => {
      const response = await fetch(`/api/blog/${id}`);
      if (!response.ok) {
        throw new Error('Blog post not found');
      }
      return response.json();
    },
    enabled: !!id
  });

  const handleShare = async () => {
    if (navigator.share && blogPost) {
      try {
        await navigator.share({
          title: blogPost.title,
          text: blogPost.excerpt,
          url: window.location.href
        });
      } catch (err) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Blog post link copied to clipboard",
        });
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied", 
        description: "Blog post link copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Blog post not found</h2>
          <Button onClick={() => setLocation('/blog')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/blog')}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>

          <div className="relative mb-8">
            <img 
              src={blogPost.image} 
              alt={blogPost.title}
              className="w-full h-96 object-cover rounded-lg"
            />
            <div className="absolute top-4 left-4">
              <Badge className={`bg-primary text-primary-foreground px-3 py-1 text-sm font-medium`}>
                {blogPost.category}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {new Date(blogPost.publishedAt || blogPost.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {blogPost.readTime}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-6">{blogPost.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {blogPost.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-sm">
                {tag}
              </Badge>
            ))}
          </div>

          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <div 
                className="prose prose-lg max-w-none text-foreground"
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}