import { useQuery } from "@tanstack/react-query";
import AdminLayout from "./layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, MessageSquare, Briefcase, FileSignature, Loader2 } from "lucide-react";

export default function AdminDashboard() {
    const { data: messages, isLoading: loadingMessages } = useQuery<any[]>({
        queryKey: ["/api/contact"],
    });

    const { data: projects, isLoading: loadingProjects } = useQuery<any[]>({
        queryKey: ["/api/projects"],
    });

    const { data: certs, isLoading: loadingCerts } = useQuery<any[]>({
        queryKey: ["/api/certifications"],
    });

    const stats = [
        {
            title: "Total Projects",
            value: loadingProjects ? <Loader2 className="h-4 w-4 animate-spin" /> : projects?.length || 0,
            icon: Briefcase,
            color: "text-blue-500",
        },
        {
            title: "Unread Messages",
            value: loadingMessages ? <Loader2 className="h-4 w-4 animate-spin" /> : messages?.length || 0,
            icon: MessageSquare,
            color: "text-green-500",
        },
        {
            title: "Certifications",
            value: loadingCerts ? <Loader2 className="h-4 w-4 animate-spin" /> : certs?.length || 0,
            icon: FileSignature,
            color: "text-purple-500",
        },
        {
            title: "Profile Views",
            value: "1,248", // Placeholder for actual analytics
            icon: Eye,
            color: "text-orange-500",
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                    <p className="text-muted-foreground mt-2">
                        Welcome back, admin. Here's a summary of your portfolio activity.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={i}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                    <Icon className={`h-4 w-4 ${stat.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Recent Messages</CardTitle>
                            <CardDescription>Latest contact submissions from visitors.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loadingMessages ? (
                                <div className="py-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                            ) : messages?.length ? (
                                <div className="space-y-4">
                                    {messages.slice(0, 3).map((m: any) => (
                                        <div key={m.id} className="flex flex-col space-y-1 pb-4 border-b last:border-0 last:pb-0">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-sm">{m.firstName} {m.lastName}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(m.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <span className="text-sm text-muted-foreground line-clamp-1">{m.subject || m.service}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground py-4 text-center">No messages yet.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="col-span-1 border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 flex flex-col">
                            <p className="text-sm text-muted-foreground mb-4">
                                Use the sidebar to add new projects, update your skills, or manage incoming messages.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
