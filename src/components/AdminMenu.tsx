import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard,
  Users,
  Stethoscope,
  FileText,
  Package,
  Image,
  BookOpen,
  LogOut,
  BarChart3
} from "lucide-react";

export function AdminMenu() {
  const router = useRouter();
  const currentPath = router.pathname;

  const menuItems = [
    { href: "/admin/patients", label: "Patients", icon: Users },
    { href: "/admin/treatments", label: "Treatments", icon: Stethoscope },
    { href: "/admin/invoices", label: "Invoices", icon: FileText },
    { href: "/admin/packages", label: "Packages", icon: Package },
    { href: "/admin/gallery", label: "Gallery", icon: Image },
    { href: "/admin/blog", label: "Blog", icon: BookOpen },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ];

  const handleLogout = () => {
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 bg-card border-r border-border p-6 flex flex-col h-screen sticky top-0">
      <Link href="/admin/patients" className="mb-8">
        <h2 className="font-sans text-xl font-bold text-primary">
          Elite Dental Admin
        </h2>
      </Link>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive ? "bg-accent/10 text-accent" : ""
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <Button
        variant="ghost"
        onClick={handleLogout}
        className="w-full justify-start gap-3 mt-auto text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </Button>
    </aside>
  );
}