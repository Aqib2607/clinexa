import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  Stethoscope,
  ClipboardList,
  UserCog,
  Activity,
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardLayoutProps {
  role: "superadmin" | "admin" | "doctor" | "nurse" | "patient";
  userName?: string;
}

const roleConfig = {
  superadmin: {
    title: "Super Admin",
    color: "bg-primary",
    navItems: [
      { name: "Dashboard", href: "/superadmin", icon: LayoutDashboard },
      { name: "Hospitals", href: "/superadmin/hospitals", icon: Building2 },
      { name: "Users", href: "/superadmin/users", icon: Users },
      { name: "Audit Logs", href: "/superadmin/audit", icon: FileText },
      { name: "Settings", href: "/superadmin/settings", icon: Settings },
    ],
  },
  admin: {
    title: "Hospital Admin",
    color: "bg-primary",
    navItems: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Doctors", href: "/admin/doctors", icon: Stethoscope },
      { name: "Appointments", href: "/admin/appointments", icon: Calendar },
      { name: "Departments", href: "/admin/departments", icon: Building2 },
      { name: "Staff", href: "/admin/staff", icon: Users },
      { name: "Reports", href: "/admin/reports", icon: FileText },
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
  doctor: {
    title: "Doctor Portal",
    color: "bg-primary",
    navItems: [
      { name: "Dashboard", href: "/doctor", icon: LayoutDashboard },
      { name: "Appointments", href: "/doctor/appointments", icon: Calendar },
      { name: "Patients", href: "/doctor/patients", icon: Users },
      { name: "Prescriptions", href: "/doctor/prescriptions", icon: ClipboardList },
      { name: "Schedule", href: "/doctor/schedule", icon: Activity },
      { name: "Settings", href: "/doctor/settings", icon: Settings },
    ],
  },
  nurse: {
    title: "Nurse Portal",
    color: "bg-primary",
    navItems: [
      { name: "Dashboard", href: "/nurse", icon: LayoutDashboard },
      { name: "Patients", href: "/nurse/patients", icon: Users },
      { name: "Vitals", href: "/nurse/vitals", icon: Activity },
      { name: "Tasks", href: "/nurse/tasks", icon: ClipboardList },
      { name: "Settings", href: "/nurse/settings", icon: Settings },
    ],
  },
  patient: {
    title: "Patient Portal",
    color: "bg-primary",
    navItems: [
      { name: "Dashboard", href: "/patient", icon: LayoutDashboard },
      { name: "Appointments", href: "/patient/appointments", icon: Calendar },
      { name: "Records", href: "/patient/records", icon: FileText },
      { name: "Prescriptions", href: "/patient/prescriptions", icon: ClipboardList },
      { name: "Settings", href: "/patient/settings", icon: Settings },
    ],
  },
};

export function DashboardLayout({ role, userName = "User" }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const config = roleConfig[role];

  const isActive = (href: string) => {
    if (href === `/${role}`) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-sidebar flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 lg:h-20 flex items-center justify-between px-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="text-lg font-bold text-sidebar-foreground">Clinexa</span>
          </Link>
          <button
            className="lg:hidden p-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-md"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Role Badge */}
        <div className="px-4 py-3">
          <div className="px-3 py-2 rounded-lg bg-sidebar-accent">
            <p className="text-xs text-sidebar-foreground/60">Logged in as</p>
            <p className="text-sm font-medium text-sidebar-foreground">{config.title}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {config.navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 lg:h-20 bg-white border-b border-border flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-muted-foreground hover:bg-accent rounded-md"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden sm:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-64 lg:w-80 pl-10 bg-muted/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-muted-foreground hover:bg-accent rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
            </button>
            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-border">
              <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-sm font-medium text-secondary-foreground">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{config.title}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
