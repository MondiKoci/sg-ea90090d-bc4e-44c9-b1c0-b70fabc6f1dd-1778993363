import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  ImageIcon, 
  Package, 
  Stethoscope,
  Receipt,
  Home,
  LogOut
} from "lucide-react";
import { authService } from "@/services/authService";

export function AdminMenu() {
  const router = useRouter();

  const handleLogout = async () => {
    await authService.signOut();
    router.push("/admin/login");
  };

  const menuItems = [
    { href: "/", icon: Home, label: "Website" },
    { href: "/admin/patients", icon: Users, label: "Patients" },
    { href: "/admin/invoices", icon: Receipt, label: "Invoices" },
    { href: "/admin/treatments", icon: Stethoscope, label: "Treatments" },
    { href: "/admin/packages", icon: Package, label: "Packages" },
    { href: "/admin/gallery", icon: ImageIcon, label: "Gallery" },
    { href: "/admin/blog", icon: FileText, label: "Blog" },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="font-sans text-xl font-bold text-primary">Admin Panel</h2>
        <p className="text-xs text-muted-foreground mt-1">Elite Dental Tourism</p>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = router.pathname === item.href || 
                          (item.href !== "/" && router.pathname.startsWith(item.href));
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive ? "bg-accent text-accent-foreground font-semibold" : ""
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