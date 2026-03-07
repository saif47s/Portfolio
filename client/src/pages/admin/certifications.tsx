import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { insertCertificationSchema, Certification } from "@shared/schema";
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
import { Plus, Trash2, Loader2, ExternalLink, Edit2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import ImageUpload from "@/components/image-upload";

type FormValues = z.infer<typeof insertCertificationSchema>;

export default function AdminCertifications() {
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCertification, setEditingCertification] = useState<Certification | null>(null);

    const { data: certifications, isLoading } = useQuery<Certification[]>({
        queryKey: ["/api/certifications"],
    });

    const form = useForm<FormValues>({
        resolver: zodResolver(insertCertificationSchema),
        defaultValues: {
            title: "",
            issuer: "",
            date: "",
            description: "",
            credentialId: "",
            status: "Active",
            image: "",
            verifyLink: "",
            skills: [],
        },
    });

    const createMutation = useMutation({
        mutationFn: async (values: FormValues) => {
            const res = await apiRequest("POST", "/api/certifications", values);
            if (!res.ok) throw new Error("Failed to add certification");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/certifications"] });
            setIsDialogOpen(false);
            form.reset();
            toast({ title: "Certification added successfully" });
        },
        onError: (error) => {
            toast({
                title: "Error adding certification",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, values }: { id: number; values: FormValues }) => {
            const res = await apiRequest("PATCH", `/api/certifications/${id}`, values);
            if (!res.ok) throw new Error("Failed to update certification");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/certifications"] });
            setIsDialogOpen(false);
            setEditingCertification(null);
            form.reset();
            toast({ title: "Certification updated successfully" });
        },
        onError: (error) => {
            toast({
                title: "Error updating certification",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await apiRequest("DELETE", `/api/certifications/${id}`);
            if (!res.ok) throw new Error("Failed to delete certification");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/certifications"] });
            toast({ title: "Certification deleted successfully" });
        },
    });

    function onSubmit(values: FormValues) {
        if (editingCertification) {
            updateMutation.mutate({ id: editingCertification.id, values });
        } else {
            createMutation.mutate(values);
        }
    }

    const openEdit = (cert: Certification) => {
        setEditingCertification(cert);
        form.reset({
            title: cert.title,
            issuer: cert.issuer,
            date: cert.date,
            description: cert.description,
            credentialId: cert.credentialId || "",
            status: cert.status,
            image: cert.image || "",
            verifyLink: cert.verifyLink || "",
            skills: cert.skills,
        });
        setIsDialogOpen(true);
    };

    const openAdd = () => {
        setEditingCertification(null);
        form.reset({
            title: "",
            issuer: "",
            date: "",
            description: "",
            credentialId: "",
            status: "Active",
            image: "",
            verifyLink: "",
            skills: [],
        });
        setIsDialogOpen(true);
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Certifications</h1>
                    <p className="text-muted-foreground mt-1">Manage your verified credentials and awards.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openAdd}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Certification
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>{editingCertification ? "Edit Certification" : "Add New Certification"}</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Certification Name</FormLabel>
                                                <FormControl><Input placeholder="AWS Certified Architect" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="issuer"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Issuing Organization</FormLabel>
                                                <FormControl><Input placeholder="Amazon Web Services" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Date Earned</FormLabel>
                                                <FormControl><Input placeholder="March 2024" {...field} /></FormControl>
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
                                                <FormControl><Input placeholder="Active / Expired" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="credentialId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Credential ID</FormLabel>
                                                <FormControl><Input placeholder="ECC-12345..." {...field} value={field.value || ""} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="verifyLink"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Verification URL</FormLabel>
                                                <FormControl><Input placeholder="https://..." {...field} value={field.value || ""} /></FormControl>
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
                                            <FormLabel>Certification Badge / Photo</FormLabel>
                                            <FormControl>
                                                <ImageUpload
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    label="Certification Image"
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
                                            <FormLabel>Description / Topics Covered</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Validates expertise in cloud architecture..."
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
                                    name="skills"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Skills Tagged (comma separated)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Security, AWS, Networking"
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
                                        {editingCertification ? "Update Certification" : "Save Certification"}
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
                            <TableHead>Certification</TableHead>
                            <TableHead>Issuer</TableHead>
                            <TableHead>Status</TableHead>
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
                        ) : certifications && certifications.length > 0 ? (
                            certifications.map((cert) => (
                                <TableRow key={cert.id}>
                                    <TableCell className="font-medium">
                                        {cert.title}
                                        <div className="text-xs text-muted-foreground mt-1 font-mono truncate max-w-[200px]">
                                            {cert.credentialId || "No ID"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {cert.issuer}
                                        <div className="text-xs text-muted-foreground">{cert.date}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={cert.status === "Active" ? "default" : "secondary"}>
                                            {cert.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            {cert.verifyLink && (
                                                <Button variant="ghost" size="icon" asChild title="View Verification">
                                                    <a href={cert.verifyLink} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                                    </a>
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEdit(cert)}
                                            >
                                                <Edit2 className="h-4 w-4 text-primary" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    if (confirm(`Delete certification "${cert.title}"?`)) {
                                                        deleteMutation.mutate(cert.id);
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
                                    No certifications documented yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </AdminLayout>
    );
}
