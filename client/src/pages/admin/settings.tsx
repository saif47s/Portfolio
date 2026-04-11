import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "./layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSiteSettingsSchema, type SiteSettings } from "@shared/schema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Save, Globe, User, Share2, Info, Layout } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ImageUpload from "@/components/image-upload";
import FileUpload from "@/components/file-upload";

export default function AdminSettings() {
    const { toast } = useToast();
    const { data: settings, isLoading } = useQuery<SiteSettings>({
        queryKey: ["/api/settings"],
    });

    const form = useForm({
        resolver: zodResolver(insertSiteSettingsSchema),
        values: settings || {
            navbarBrandName: "",
            heroName: "",
            heroTitle: "",
            heroSubtitle: "",
            heroImage: "",
            aboutMe: "",
            aboutImage: "",
            statsExperience: "",
            statsProjects: "",
            statsCertifications: "",
            statsSecurityIncidents: "",
            email: "",
            linkedinUrl: "",
            githubUrl: "",
            twitterUrl: "",
            mediumUrl: "",
            whatsappNumber: "",
            footerBrandName: "",
            footerBrandSubtitle: "",
            footerDescription: "",
            footerServices: '["Cybersecurity Services","Cloud Engineering","UI/UX Design","Data Analysis & AI","Mobile Development","Network Engineering"]',
            footerCopyright: "",
            resumeUrl: "",
        },
    });

    const mutation = useMutation({
        mutationFn: async (values: any) => {
            const res = await apiRequest("PATCH", "/api/settings", values);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
            toast({
                title: "Settings updated",
                description: "Your site settings have been saved successfully.",
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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2 font-cyber">Site Settings</h1>
                        <p className="text-muted-foreground">
                            Manage your portfolio sections, branding, and links.
                        </p>
                    </div>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 px-6 shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all active:scale-95"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-5 w-5" />
                        )}
                        Save All Changes
                    </Button>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
                        <Tabs defaultValue="hero" className="w-full">
                            <TabsList className="bg-muted/50 border border-primary/10 p-1 mb-8">
                                <TabsTrigger value="hero" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                    <Globe className="h-4 w-4" /> Hero
                                </TabsTrigger>
                                <TabsTrigger value="about" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                    <User className="h-4 w-4" /> About Me
                                </TabsTrigger>
                                <TabsTrigger value="footer" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                    <Layout className="h-4 w-4" /> Footer
                                </TabsTrigger>
                                <TabsTrigger value="socials" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                    <Share2 className="h-4 w-4" /> Socials
                                </TabsTrigger>
                            </TabsList>

                            {/* Hero Tab */}
                            <TabsContent value="hero" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                                <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                                    <CardHeader className="border-b border-primary/10">
                                        <CardTitle className="text-primary">Hero Section Configuration</CardTitle>
                                        <CardDescription>Configure the main landing banner of your website.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-6 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="navbarBrandName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Navbar Brand Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Saif Portfolio" {...field} />
                                                            </FormControl>
                                                            <FormDescription>The text displayed in the top-left corner of the site.</FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="heroName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Full Name / Title</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Saif - Multi-Tech" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="heroTitle"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Designation Highlight</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Expert" {...field} />
                                                            </FormControl>
                                                            <FormDescription>The highlighted word in your welcome message.</FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="heroSubtitle"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Hero Description</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="Describe your expertise in a few words..."
                                                                    className="h-32 resize-none"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="heroImage"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Main Hero Photo</FormLabel>
                                                    <FormControl>
                                                        <ImageUpload
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            label="Hero Image"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* About Me Tab */}
                            <TabsContent value="about" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2">
                                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm h-full">
                                            <CardHeader className="border-b border-primary/10">
                                                <CardTitle className="text-primary">Bio & Presentation</CardTitle>
                                                <CardDescription>Tell your story and background details.</CardDescription>
                                            </CardHeader>
                                            <CardContent className="pt-6 space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="aboutMe"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Introduction Text</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="Describe your background and passion..."
                                                                    className="h-48 resize-none"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="aboutImage"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Professional About Photo</FormLabel>
                                                            <FormControl>
                                                                <ImageUpload
                                                                    value={field.value}
                                                                    onChange={field.onChange}
                                                                    label="About Image"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </CardContent>
                                        </Card>
                                    </div>
                                    <div>
                                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm h-full">
                                            <CardHeader className="border-b border-primary/10">
                                                <CardTitle className="text-primary">Key Stats</CardTitle>
                                                <CardDescription>Numerical highlights of your career.</CardDescription>
                                            </CardHeader>
                                            <CardContent className="pt-6 space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="statsExperience"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Experience</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="5+ Years" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="statsProjects"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Projects</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="50+" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="resumeUrl"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Resume / CV File (PDF)</FormLabel>
                                                            <FormControl>
                                                                <FileUpload
                                                                    value={field.value}
                                                                    onChange={field.onChange}
                                                                    label="Resume File"
                                                                    accept=".pdf,.doc,.docx"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="statsCertifications"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Certifications</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="8" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="statsSecurityIncidents"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Incidents Handled</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="100+" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Footer Tab */}
                            <TabsContent value="footer" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                                        <CardHeader className="border-b border-primary/10">
                                            <CardTitle className="text-primary">Footer Branding</CardTitle>
                                            <CardDescription>Identity and description in the footer area.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-6 space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="footerBrandName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Brand Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Saif" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="footerBrandSubtitle"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Brand Subtitle</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Multi-Tech Expert" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="footerDescription"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Overview Description</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Short bio for the footer..."
                                                                className="h-24 resize-none"
                                                                {...field}
                                                                value={field.value || ""}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                    </Card>

                                    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                                        <CardHeader className="border-b border-primary/10">
                                            <CardTitle className="text-primary">Footer Content & Legal</CardTitle>
                                            <CardDescription>Manage services list and copyright text.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-6 space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="footerServices"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Services (JSON List)</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder='["Service 1", "Service 2"]'
                                                                className="h-32 font-mono text-sm"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>Valid JSON array of strings required.</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="footerCopyright"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Copyright Statement</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="© 2024 Your Name. All rights reserved." />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            {/* Socials Tab */}
                            <TabsContent value="socials" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                                <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                                    <CardHeader className="border-b border-primary/10">
                                        <CardTitle className="text-primary text-center">Contact & Social Connectivity</CardTitle>
                                        <CardDescription className="text-center">Manage your online presence and contact email.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-8 max-w-2xl mx-auto space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Primary Contact Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="your@email.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="linkedinUrl"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>LinkedIn Profile</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="https://linkedin.com/in/..." {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="githubUrl"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>GitHub Handle</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="https://github.com/..." {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="twitterUrl"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Twitter / X Profile</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="https://twitter.com/..." {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="mediumUrl"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Medium Journal</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="https://medium.com/@..." {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="whatsappNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>WhatsApp Number (Intl format)</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="03325909163" {...field} />
                                                        </FormControl>
                                                        <FormDescription>Format: 03123456789 or international format without + sign.</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="pt-10 flex flex-col items-center">
                                            <Button
                                                type="submit"
                                                className="w-full max-w-sm h-14 text-xl font-black bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all active:scale-95 animate-pulse-subtle"
                                                disabled={mutation.isPending}
                                            >
                                                {mutation.isPending ? (
                                                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                                ) : (
                                                    <Save className="mr-3 h-6 w-6" />
                                                )}
                                                SAVE ALL SETTINGS
                                            </Button>
                                            <p className="text-muted-foreground text-xs mt-4 text-center">
                                                By clicking Save, all changes across all tabs will be updated immediately on the live site.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </form>
                </Form>
            </div>
        </AdminLayout>
    );
}
