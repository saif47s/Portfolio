import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
    LayoutDashboard,
    MessageSquare,
    Briefcase,
    Code2,
    Award,
    FileText,
    BookOpen,
    Settings,
    User,
    LogOut,
    Menu,
    ChevronLeft,
    MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_ITEMS = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/profile", label: "Profile", icon: User },
    { href: "/admin/messages", label: "Messages", icon: MessageSquare },
    { href: "/admin/blogs", label: "Blogs", icon: BookOpen },
    { href: "/admin/projects", label: "Projects", icon: Briefcase },
    { href: "/admin/skills", label: "Skills", icon: Code2 },
    { href: "/admin/experience", label: "Experience", icon: FileText },
    { href: "/admin/certifications", label: "Certifications", icon: Award },
    { href: "/admin/testimonials", label: "Testimonials", icon: MessageCircle },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [location] = useLocation();
    const { logoutMutation } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const NavLinks = () => (
        <>
            <div className="space-y-1 mb-8">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = location === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <a
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </a>
                        </Link>
                    );
                })}
            </div>

            <div className="mt-auto space-y-1">
                <Link href="/">
                    <a className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted transition-colors">
                        <ChevronLeft className="h-5 w-5" />
                        Back to Site
                    </a>
                </Link>
                <button
                    onClick={() => logoutMutation.mutate()}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-red-500 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-background border-t-2 border-primary/20 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r bg-card/30 p-4">
                <div className="mb-8 px-3">
                    <h2 className="text-lg font-bold tracking-tight text-primary">Saif CMS</h2>
                    <p className="text-sm text-muted-foreground">Admin Portal</p>
                </div>
                <NavLinks />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen max-w-[100vw] overflow-x-hidden">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur z-10 sticky top-0">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            S
                        </div>
                        <span className="font-semibold tracking-tight">CMS</span>
                    </div>
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-4 flex flex-col">
                            <div className="mb-8 px-3 mt-4">
                                <h2 className="text-lg font-bold tracking-tight text-primary">Saif CMS</h2>
                                <p className="text-sm text-muted-foreground">Admin Portal</p>
                            </div>
                            <NavLinks />
                        </SheetContent>
                    </Sheet>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
