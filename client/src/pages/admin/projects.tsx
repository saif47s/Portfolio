import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { insertProjectSchema, Project } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import AdminLayout from "./layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2, ExternalLink, Edit2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/image-upload";

type FormValues = z.infer<typeof insertProjectSchema>;

export default function AdminProjects() {
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const { data: projects, isLoading } = useQuery<Project[]>({
        queryKey: ["/api/projects"],
    });

    const form = useForm<FormValues>({
        resolver: zodResolver(insertProjectSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "",
            year: new Date().getFullYear().toString(),
            technologies: [],
            image: "",
            categoryColor: "blue",
            status: "Completed",
            githubLink: "",
            liveLink: "",
        },
    });

    const createMutation = useMutation({
        mutationFn: async (values: FormValues) => {
            const res = await apiRequest("POST", "/api/projects", values);
            if (!res.ok) throw new Error("Failed to create project");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
            setIsDialogOpen(false);
            form.reset();
            toast({ title: "Project created successfully" });
        },
        onError: (error) => {
            toast({
                title: "Error creating project",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, values }: { id: number; values: FormValues }) => {
            const res = await apiRequest("PATCH", `/api/projects/${id}`, values);
            if (!res.ok) throw new Error("Failed to update project");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
            setIsDialogOpen(false);
            setEditingProject(null);
            form.reset();
            toast({ title: "Project updated successfully" });
        },
        onError: (error) => {
            toast({
                title: "Error updating project",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await apiRequest("DELETE", `/api/projects/${id}`);
            if (!res.ok) throw new Error("Failed to delete project");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
            toast({ title: "Project deleted successfully" });
        },
    });

    function onSubmit(values: FormValues) {
        if (editingProject) {
            updateMutation.mutate({ id: editingProject.id, values });
        } else {
            createMutation.mutate(values);
        }
    }

    const openEdit = (project: Project) => {
        setEditingProject(project);
        form.reset({
            title: project.title,
            description: project.description,
            category: project.category,
            year: project.year,
            technologies: project.technologies,
            image: project.image,
            categoryColor: project.categoryColor,
            status: project.status,
            githubLink: project.githubLink || "",
            liveLink: project.liveLink || "",
        });
        setIsDialogOpen(true);
    };

    const openAdd = () => {
        setEditingProject(null);
        form.reset({
            title: "",
            description: "",
            category: "",
            year: new Date().getFullYear().toString(),
            technologies: [],
            image: "",
            categoryColor: "blue",
            status: "Completed",
            githubLink: "",
            liveLink: "",
        });
        setIsDialogOpen(true);
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground mt-1">Manage your portfolio projects.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openAdd}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto font-sans">
                        <DialogHeader>
                            <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl><Input placeholder="E-commerce App" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <FormControl><Input placeholder="Web Development" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="year"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Year</FormLabel>
                                                <FormControl><Input placeholder="2024" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="categoryColor"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Badge Color (Tailwind class, e.g. blue)</FormLabel>
                                                <FormControl><Input placeholder="blue, green, purple" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status</FormLabel>
                                                <FormControl><Input placeholder="Completed, In Progress" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="technologies"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Technologies (comma separated)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="React, Node.js, Tailwind"
                                                        value={Array.isArray(field.value) ? field.value.join(", ") : ""}
                                                        onChange={(e) => field.onChange(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Project Image</FormLabel>
                                            <FormControl>
                                                <ImageUpload
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    label="Project Image"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl><Textarea placeholder="Detailed description..." className="min-h-[100px]" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="githubLink"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>GitHub Link (optional)</FormLabel>
                                                <FormControl><Input placeholder="https://github.com/..." {...field} value={field.value || ""} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="liveLink"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Live Link (optional)</FormLabel>
                                                <FormControl><Input placeholder="https://..." {...field} value={field.value || ""} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                                        {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {editingProject ? "Update Project" : "Save Project"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-card rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>Technologies</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : projects && projects.length > 0 ? (
                            projects.map((project) => (
                                <TableRow key={project.id}>
                                    <TableCell className="font-medium">{project.title}</TableCell>
                                    <TableCell>{project.category}</TableCell>
                                    <TableCell>{project.year}</TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                        {project.technologies.join(", ")}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {project.liveLink && (
                                                <Button variant="ghost" size="icon" asChild title="View Live">
                                                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                                    </a>
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEdit(project)}
                                            >
                                                <Edit2 className="h-4 w-4 text-primary" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    if (confirm("Are you sure you want to delete this project?")) {
                                                        deleteMutation.mutate(project.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No projects found. Use the 'Add Project' button to create one.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </AdminLayout>
    );
}
