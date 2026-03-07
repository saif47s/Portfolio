import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { insertSkillSchema, Skill } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import AdminLayout from "./layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type FormValues = z.infer<typeof insertSkillSchema>;

export default function AdminSkills() {
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

    const { data: skills, isLoading } = useQuery<Skill[]>({
        queryKey: ["/api/skills"],
    });

    const form = useForm<FormValues>({
        resolver: zodResolver(insertSkillSchema),
        defaultValues: {
            name: "",
            progress: 50,
            projectsCount: 0,
        },
    });

    const createMutation = useMutation({
        mutationFn: async (values: FormValues) => {
            const res = await apiRequest("POST", "/api/skills", values);
            if (!res.ok) throw new Error("Failed to create skill");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
            setIsDialogOpen(false);
            form.reset();
            toast({ title: "Skill added successfully" });
        },
        onError: (error) => {
            toast({
                title: "Error adding skill",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, values }: { id: number; values: FormValues }) => {
            const res = await apiRequest("PATCH", `/api/skills/${id}`, values);
            if (!res.ok) throw new Error("Failed to update skill");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
            setIsDialogOpen(false);
            setEditingSkill(null);
            form.reset();
            toast({ title: "Skill updated successfully" });
        },
        onError: (error) => {
            toast({
                title: "Error updating skill",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await apiRequest("DELETE", `/api/skills/${id}`);
            if (!res.ok) throw new Error("Failed to delete skill");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
            toast({ title: "Skill deleted successfully" });
        },
    });

    function onSubmit(values: FormValues) {
        if (editingSkill) {
            updateMutation.mutate({ id: editingSkill.id, values });
        } else {
            createMutation.mutate(values);
        }
    }

    const openEdit = (skill: Skill) => {
        setEditingSkill(skill);
        form.reset({
            name: skill.name,
            progress: skill.progress,
            projectsCount: skill.projectsCount,
        });
        setIsDialogOpen(true);
    };

    const openAdd = () => {
        setEditingSkill(null);
        form.reset({
            name: "",
            progress: 50,
            projectsCount: 0,
        });
        setIsDialogOpen(true);
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
                    <p className="text-muted-foreground mt-1">Manage technical and professional skills.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openAdd}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Skill
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>{editingSkill ? "Edit Skill" : "Add New Skill"}</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Skill Name</FormLabel>
                                            <FormControl><Input placeholder="React, Node.js, Python..." {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="progress"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Proficiency / Progress (%)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    placeholder="85"
                                                    {...field}
                                                    onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="projectsCount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Projects Completed (Count)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    placeholder="5"
                                                    {...field}
                                                    onChange={e => field.onChange(parseInt(e.target.value) || 0)}
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
                                        {editingSkill ? "Update Skill" : "Save Skill"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-card rounded-md border max-w-4xl">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Required Skill</TableHead>
                            <TableHead>Proficiency</TableHead>
                            <TableHead>Projects Count</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : skills && skills.length > 0 ? (
                            skills.map((skill) => (
                                <TableRow key={skill.id}>
                                    <TableCell className="font-medium">{skill.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-full bg-secondary rounded-full h-2 max-w-[100px]">
                                                <div className="bg-primary h-2 rounded-full" style={{ width: `${skill.progress}%` }} />
                                            </div>
                                            <span className="text-xs text-muted-foreground">{skill.progress}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{skill.projectsCount}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEdit(skill)}
                                            >
                                                <Edit2 className="h-4 w-4 text-primary" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    if (confirm(`Delete skill "${skill.name}"?`)) {
                                                        deleteMutation.mutate(skill.id);
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
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No skills documented yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </AdminLayout>
    );
}
