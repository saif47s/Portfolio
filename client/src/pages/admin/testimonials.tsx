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
import { Loader2, User, MessageCircle, Star, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Testimonial } from "@shared/schema";

export default function AdminTestimonials() {
    const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
        queryKey: ["/api/testimonials"],
    });

    const { toast } = useToast();

    const approveMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiRequest("PATCH", `/api/testimonials/${id}`, { approved: true });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
            toast({
                title: "Testimonial approved",
                description: "The review is now visible on the live site.",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiRequest("DELETE", `/api/testimonials/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
            toast({
                title: "Testimonial deleted",
                description: "The review has been removed.",
            });
        },
    });

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this review?")) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">User Reviews</h1>
                        <p className="text-muted-foreground mt-2">
                            Manage testimonials and approve them for display on your portfolio.
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : testimonials && testimonials.length > 0 ? (
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead className="w-[150px]">Reviewer</TableHead>
                                            <TableHead className="w-[100px]">Rating</TableHead>
                                            <TableHead>Review Content</TableHead>
                                            <TableHead className="w-[120px]">Status</TableHead>
                                            <TableHead className="text-right w-[150px]">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {testimonials.map((t) => (
                                            <TableRow key={t.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium flex items-center">
                                                            <User className="h-3 w-3 mr-1 text-primary" />
                                                            {t.name}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">{t.position}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center text-yellow-500">
                                                        <Star className="h-3 w-3 fill-current mr-1" />
                                                        <span className="text-sm font-bold">{t.rating}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-sm line-clamp-2 max-w-md text-muted-foreground italic">
                                                        "{t.testimonial}"
                                                    </p>
                                                </TableCell>
                                                <TableCell>
                                                    {t.approved ? (
                                                        <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/50">
                                                            Published
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">
                                                            Pending Audit
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {!t.approved && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 border-primary/50 text-primary hover:bg-primary hover:text-white"
                                                                onClick={() => approveMutation.mutate(t.id)}
                                                                disabled={approveMutation.isPending}
                                                            >
                                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                                Approve
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                                                            onClick={() => handleDelete(t.id)}
                                                            disabled={deleteMutation.isPending}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed">
                                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                                <h3 className="text-lg font-medium">No reviews found</h3>
                                <p className="text-muted-foreground">You haven't received any testimonials yet.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
