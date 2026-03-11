import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

// Public Pages
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import BlogList from "@/pages/blog-list";
import BlogDetail from "@/pages/blog-detail";
import ProjectDetail from "@/pages/project-detail";
import ProjectsList from "@/pages/projects-list";

// Admin Pages
import AuthPage from "@/pages/auth-page";
import AdminDashboard from "@/pages/admin/index";
import AdminProjects from "@/pages/admin/projects";
import AdminSkills from "@/pages/admin/skills";
import AdminExperience from "@/pages/admin/experience";
import AdminCertifications from "@/pages/admin/certifications";
import AdminMessages from "@/pages/admin/messages";
import AdminBlogs from "@/pages/admin/blogs";
import AdminSettings from "@/pages/admin/settings";
import AdminProfile from "@/pages/admin/profile";
import AdminTestimonials from "@/pages/admin/testimonials";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog" component={BlogList} />
      <Route path="/blog/:id" component={BlogDetail} />
      <Route path="/projects" component={ProjectsList} />
      <Route path="/project/:id" component={ProjectDetail} />

      {/* Admin Routes */}
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/admin" component={AdminDashboard} />
      <ProtectedRoute path="/admin/profile" component={AdminProfile} />
      <ProtectedRoute path="/admin/projects" component={AdminProjects} />
      <ProtectedRoute path="/admin/skills" component={AdminSkills} />
      <ProtectedRoute path="/admin/experience" component={AdminExperience} />
      <ProtectedRoute path="/admin/certifications" component={AdminCertifications} />
      <ProtectedRoute path="/admin/messages" component={AdminMessages} />
      <ProtectedRoute path="/admin/testimonials" component={AdminTestimonials} />
      <ProtectedRoute path="/admin/blogs" component={AdminBlogs} />
      <ProtectedRoute path="/admin/settings" component={AdminSettings} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="saif-portfolio-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
