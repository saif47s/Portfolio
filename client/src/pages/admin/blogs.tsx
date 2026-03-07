import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "./layout";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBlogPostSchema, type BlogPost } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Loader2, Pencil, Trash2, BookOpen } from "lucide-react";
import { useState } from "react";

export default function AdminBlogs() {
    const [open, setOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
    const { toast } = useToast();

    const { data: blogs, isLoading } = useQuery<BlogPost[]>({
        queryKey: ["/api/blog"],
    });

    const form = useForm({
        resolver: zodResolver(insertBlogPostSchema),
        defaultValues: {
            title: "",
            excerpt: "",
            content: "",
            category: "Cybersecurity",
            tags: ["Tech"],
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
            readTime: "5 min read",
            published: true,
        },
    });

    const createMutation = useMutation({
        mutationFn: async (values: any) => {
            const res = await apiRequest("POST", "/api/blog", values);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
            setOpen(false);
            form.reset();
            toast({ title: "Blog post created successfully" });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: any }) => {
            const res = await apiRequest("PATCH", `/api/blog/${id}`, data);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
            setOpen(false);
            setEditingBlog(null);
            form.reset();
            toast({ title: "Blog post updated successfully" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiRequest("DELETE", `/api/blog/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
            toast({ title: "Blog post deleted" });
        },
    });

    function onSubmit(data: any) {
        if (editingBlog) {
            updateMutation.mutate({ id: editingBlog.id, data });
        } else {
            createMutation.mutate(data);
        }
    }

    const openEdit = (blog: BlogPost) => {
        setEditingBlog(blog);
        form.reset({
            title: blog.title,
            excerpt: blog.excerpt,
            content: blog.content,
            category: blog.category,
            tags: blog.tags,
            image: blog.image,
            readTime: blog.readTime,
            published: blog.published || false,
        });
        setOpen(true);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Technical Blogs</h1>
                        <p className="text-muted-foreground mt-2">
                            Manage your articles and technical insights.
                        </p>
                    </div>
                    <Dialog open={open} onOpenChange={(val) => {
                        setOpen(val);
                        if (!val) {
                            setEditingBlog(null);
                            form.reset();
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-cyber-blue to-cyber-green text-white font-bold">
                                <Plus className="mr-2 h-4 w-4" /> Add Blog Post
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingBlog ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
                                <DialogDescription>
                                    Fill in the details for your technical article.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Advanced Cybersecurity Trends" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="category"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Category</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Cybersecurity" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="readTime"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Read Time</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. 5 min read" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="excerpt"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Excerpt (Short Summary)</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Brief overview of the article..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Content (Markdown supported)</FormLabel>
                                                <FormControl>
                                                    <Textarea className="min-h-[200px]" placeholder="Write your full article here..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="image"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Feature Image URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="tags"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tags (Comma separated)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Security, Web, AI"
                                                        value={Array.isArray(field.value) ? field.value.join(", ") : ""}
                                                        onChange={(e) => field.onChange(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter>
                                        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                                            {(createMutation.isPending || updateMutation.isPending) && (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            {editingBlog ? "Update Post" : "Publish Post"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Article List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Read Time</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {blogs?.map((blog) => (
                                        <TableRow key={blog.id}>
                                            <TableCell className="font-medium">{blog.title}</TableCell>
                                            <TableCell>{blog.category}</TableCell>
                                            <TableCell>{blog.readTime}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="ghost" size="icon" onClick={() => openEdit(blog)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => {
                                                        if (confirm("Are you sure?")) deleteMutation.mutate(blog.id);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {(!blogs || blogs.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                No blog posts yet. Create your first insight!
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
