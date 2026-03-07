import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { insertExperienceSchema, Experience } from "@shared/schema";
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
import { Plus, Trash2, Loader2, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

type FormValues = z.infer<typeof insertExperienceSchema>;

export default function AdminExperience() {
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingExperience, setEditingExperience] = useState<Experience | null>(null);

    const { data: experiences, isLoading } = useQuery<Experience[]>({
        queryKey: ["/api/experiences"],
    });

    const form = useForm<FormValues>({
        resolver: zodResolver(insertExperienceSchema),
        defaultValues: {
            role: "",
            company: "",
            duration: "",
            description: "",
            location: "Remote",
            type: "Full-time",
            achievements: [],
            technologies: [],
        },
    });

    const createMutation = useMutation({
        mutationFn: async (values: FormValues) => {
            const res = await apiRequest("POST", "/api/experiences", values);
            if (!res.ok) throw new Error("Failed to add experience");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
            setIsDialogOpen(false);
            form.reset();
            toast({ title: "Experience added successfully" });
        },
        onError: (error) => {
            toast({
                title: "Error adding experience",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, values }: { id: number; values: FormValues }) => {
            const res = await apiRequest("PATCH", `/api/experiences/${id}`, values);
            if (!res.ok) throw new Error("Failed to update experience");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
            setIsDialogOpen(false);
            setEditingExperience(null);
            form.reset();
            toast({ title: "Experience updated successfully" });
        },
        onError: (error) => {
            toast({
                title: "Error updating experience",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await apiRequest("DELETE", `/api/experiences/${id}`);
            if (!res.ok) throw new Error("Failed to delete experience");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
            toast({ title: "Experience deleted successfully" });
        },
    });

    function onSubmit(values: FormValues) {
        if (editingExperience) {
            updateMutation.mutate({ id: editingExperience.id, values });
        } else {
            createMutation.mutate(values);
        }
    }

    const openEdit = (exp: Experience) => {
        setEditingExperience(exp);
        form.reset({
            role: exp.role,
            company: exp.company,
            duration: exp.duration,
            description: exp.description,
            location: exp.location,
            type: exp.type,
            achievements: exp.achievements,
            technologies: exp.technologies,
        });
        setIsDialogOpen(true);
    };

    const openAdd = () => {
        setEditingExperience(null);
        form.reset({
            role: "",
            company: "",
            duration: "",
            description: "",
            location: "Remote",
            type: "Full-time",
            achievements: [],
            technologies: [],
        });
        setIsDialogOpen(true);
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Experience</h1>
                    <p className="text-muted-foreground mt-1">Manage your professional work history.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openAdd}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Experience
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>{editingExperience ? "Edit Experience" : "Add New Role"}</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Job Title / Role</FormLabel>
                                                <FormControl><Input placeholder="Senior Developer" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="company"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Company</FormLabel>
                                                <FormControl><Input placeholder="Tech Inc." {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="duration"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Duration</FormLabel>
                                                <FormControl><Input placeholder="Jan 2022 - Present" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Location</FormLabel>
                                                <FormControl><Input placeholder="Sahiwal, Pakistan / Remote" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Job Type</FormLabel>
                                            <FormControl><Input placeholder="Full-time / Freelance" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Brief Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="High level overview..."
                                                    className="min-h-[80px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="achievements"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Achievements (one per line)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Reduced security incidents by 85%..."
                                                    className="min-h-[100px]"
                                                    value={field.value?.join("\n") || ""}
                                                    onChange={(e) => field.onChange(e.target.value.split("\n").filter(Boolean))}
                                                />
                                            </FormControl>
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
                                                    placeholder="React, AWS, Node.js"
                                                    value={field.value?.join(", ") || ""}
                                                    onChange={(e) => field.onChange(e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                                        {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {editingExperience ? "Update Experience" : "Save Experience"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-card rounded-md border min-w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Role</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Type/Location</TableHead>
                            <TableHead className="w-1/3">Skills</TableHead>
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
                        ) : experiences && experiences.length > 0 ? (
                            experiences.map((exp) => (
                                <TableRow key={exp.id}>
                                    <TableCell className="font-medium">
                                        {exp.role}
                                        <div className="text-xs text-muted-foreground">{exp.duration}</div>
                                    </TableCell>
                                    <TableCell>{exp.company}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        <div className="text-sm">{exp.type}</div>
                                        <div className="text-xs">{exp.location}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {exp.technologies.slice(0, 3).map(tech => (
                                                <Badge key={tech} variant="outline" className="text-[10px] px-1 h-4">
                                                    {tech}
                                                </Badge>
                                            ))}
                                            {exp.technologies.length > 3 && (
                                                <span className="text-[10px] text-muted-foreground">+{exp.technologies.length - 3}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEdit(exp)}
                                            >
                                                <Edit2 className="h-4 w-4 text-primary" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    if (confirm(`Delete experience at "${exp.company}"?`)) {
                                                        deleteMutation.mutate(exp.id);
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
                                    No experience records found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </AdminLayout>
    );
}
