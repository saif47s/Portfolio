import { useQuery } from "@tanstack/react-query";
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
import { Loader2, Mail, User, MessageSquare, Clock } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

export default function AdminMessages() {
    const { data: messages, isLoading } = useQuery<any[]>({
        queryKey: ["/api/contact"],
    });

    const { toast } = useToast();

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiRequest("DELETE", `/api/contact/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
            toast({
                title: "Message deleted",
                description: "The contact message has been removed.",
            });
        },
    });

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this message?")) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                        <p className="text-muted-foreground mt-2">
                            View and manage contact form submissions from your visitors.
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Inbox</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : messages && messages.length > 0 ? (
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead className="w-[200px]">Sender</TableHead>
                                            <TableHead className="w-[250px]">Contact Info</TableHead>
                                            <TableHead>Service / Message</TableHead>
                                            <TableHead className="text-right">Date</TableHead>
                                            <TableHead className="w-[80px] text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {messages.map((message) => (
                                            <TableRow key={message.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium flex items-center">
                                                            <User className="h-3 w-3 mr-1 text-primary" />
                                                            {message.firstName} {message.lastName}
                                                        </span>
                                                        <Badge variant="outline" className="w-fit mt-1 text-[10px] uppercase font-bold tracking-wider">
                                                            New Message
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col text-sm space-y-1">
                                                        <span className="flex items-center text-muted-foreground">
                                                            <Mail className="h-3 w-3 mr-2" />
                                                            {message.email}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center text-xs font-semibold text-primary/80">
                                                            <MessageSquare className="h-3 w-3 mr-1" />
                                                            {message.service}
                                                        </div>
                                                        <p className="text-sm line-clamp-2 max-w-md text-muted-foreground">
                                                            {message.message}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex flex-col items-end text-xs text-muted-foreground font-medium">
                                                        <span className="flex items-center">
                                                            <Clock className="h-3 w-3 mr-1" />
                                                            {message.createdAt && format(new Date(message.createdAt), "MMM d, yyyy")}
                                                        </span>
                                                        <span>{message.createdAt && format(new Date(message.createdAt), "h:mm a")}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-muted-foreground hover:text-destructive transition-colors"
                                                        onClick={() => handleDelete(message.id)}
                                                        disabled={deleteMutation.isPending}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed">
                                <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                                <h3 className="text-lg font-medium">No messages found</h3>
                                <p className="text-muted-foreground">You haven't received any contact form submissions yet.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
