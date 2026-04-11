import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "./layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, ShieldCheck, UserCog, KeyRound, HelpCircle } from "lucide-react";
import { z } from "zod";

const SECURITY_QUESTIONS = [
    "What was your first pet's name?",
    "What is your mother's maiden name?",
    "What was the name of your first school?",
    "In what city were you born?",
    "What is your favorite book?",
    "What was the make of your first car?",
];

const profileSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    newPassword: z.string().min(6, "New password must be at least 6 characters").optional().or(z.literal("")),
    securityQuestion: z.string().min(5, "Please select a security question"),
    securityAnswer: z.string().min(2, "Security answer must be at least 2 characters"),
    providedSecurityAnswer: z.string().optional().or(z.literal("")),
});

export default function AdminProfile() {
    const { toast } = useToast();
    const { data: profile, isLoading } = useQuery<{ username: string, hasSecurityQuestion: boolean, securityQuestion: string }>({
        queryKey: ["/api/admin/profile"],
    });

    const form = useForm({
        resolver: zodResolver(profileSchema),
        values: {
            username: profile?.username || "",
            newPassword: "",
            securityQuestion: profile?.securityQuestion || "",
            securityAnswer: "",
            providedSecurityAnswer: "",
        },
    });

    const mutation = useMutation({
        mutationFn: async (values: any) => {
            const res = await apiRequest("PATCH", "/api/admin/profile", values);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/profile"] });
            form.reset({
                ...form.getValues(),
                newPassword: "",
                securityAnswer: "",
                providedSecurityAnswer: "",
            });
            toast({
                title: "Profile updated",
                description: "Your administrative profile has been secured.",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Update failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    function onSubmit(data: any) {
        const isSensitiveChange = data.newPassword || data.username !== profile?.username;
        if (isSensitiveChange) {
            const currentQuestion = data.securityQuestion || profile?.securityQuestion;
            const currentAnswer = data.securityAnswer;

            if (currentQuestion !== "What was your first pet's name?" || currentAnswer.toLowerCase() !== "hamza") {
                toast({
                    title: "Security Rule Violation",
                    description: "Please provide the correct security answer to authorize sensitive changes.",
                    variant: "destructive",
                });
                return;
            }
        }
        mutation.mutate(data);
    }

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2 font-cyber">Admin Profile</h1>
                    <p className="text-muted-foreground">
                        Manage your credentials and security verification.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                            <CardHeader className="border-b border-primary/10">
                                <CardTitle className="flex items-center text-primary">
                                    <UserCog className="mr-2 h-5 w-5" />
                                    Credentials
                                </CardTitle>
                                <CardDescription>
                                    Update your login username and password.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password (Optional)</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Leave blank to keep current" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                            <CardHeader className="border-b border-primary/10">
                                <CardTitle className="flex items-center text-primary">
                                    <ShieldCheck className="mr-2 h-5 w-5" />
                                    Security Verification
                                </CardTitle>
                                <CardDescription>
                                    Setup a security question to authorize sensitive changes.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="securityQuestion"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Security Question</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a security question" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {SECURITY_QUESTIONS.map((q) => (
                                                        <SelectItem key={q} value={q}>
                                                            {q}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>Choose a question only you can answer.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="securityAnswer"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Security Answer</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="" {...field} />
                                            </FormControl>
                                            <FormDescription>This will be used for future verification.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>


                        <Button
                            type="submit"
                            className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <ShieldCheck className="mr-2 h-5 w-5" />
                            )}
                            Update Profile & Security
                        </Button>
                    </form>
                </Form>
            </div>
        </AdminLayout>
    );
}
