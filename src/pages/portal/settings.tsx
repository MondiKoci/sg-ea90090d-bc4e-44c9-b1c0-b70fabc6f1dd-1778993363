import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { patientAuthService } from "@/services/patientAuthService";
import { settingsService } from "@/services/settingsService";
import type { NotificationPreferences } from "@/services/settingsService";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [session, setSession] = useState<any>(null);

  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  const [preferences, setPreferences] = useState<Partial<NotificationPreferences>>({
    email_notifications: true,
    invoice_notifications: true,
    treatment_update_notifications: true,
    marketing_emails: false,
  });

  useEffect(() => {
    const currentSession = patientAuthService.getSession();
    if (!currentSession) {
      router.push("/portal/login");
      return;
    }
    setSession(currentSession);
    loadSettings(currentSession.email);
  }, [router]);

  const loadSettings = async (email: string) => {
    try {
      const [profile, prefs] = await Promise.all([
        settingsService.getProfile(email),
        settingsService.getPreferences(email),
      ]);

      setProfileData({
        full_name: profile.full_name,
        email: profile.email || "",
        phone: profile.phone || "",
      });

      if (prefs) {
        setPreferences({
          email_notifications: prefs.email_notifications,
          invoice_notifications: prefs.invoice_notifications,
          treatment_update_notifications: prefs.treatment_update_notifications,
          marketing_emails: prefs.marketing_emails,
        });
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
      toast({
        title: "Failed to load settings",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!session) return;
    setSaving(true);

    try {
      await settingsService.updateProfile(session.email, {
        full_name: profileData.full_name,
        phone: profileData.phone,
      });

      toast({
        title: "Profile updated",
        description: "Your profile information has been saved",
      });
    } catch (error) {
      toast({
        title: "Failed to update profile",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!session) return;
    setSaving(true);

    try {
      await settingsService.updatePreferences(session.email, preferences);

      toast({
        title: "Preferences saved",
        description: "Your notification preferences have been updated",
      });
    } catch (error) {
      toast({
        title: "Failed to save preferences",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">Loading...</div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <SEO title="Settings - Patient Portal" />
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        
        <main className="flex-1 py-12">
          <div className="container max-w-4xl">
            <Link href="/portal/dashboard">
              <Button variant="ghost" className="mb-6 gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>

            <h1 className="font-sans text-4xl font-bold mb-8">Settings</h1>

            <div className="space-y-6">
              {/* Profile Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <User className="w-6 h-6 text-accent" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-muted cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed. Contact support if you need to update your email.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="pt-4">
                    <Button onClick={handleSaveProfile} disabled={saving} className="gap-2">
                      <Save className="w-4 h-4" />
                      {saving ? "Saving..." : "Save Profile"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Bell className="w-6 h-6 text-accent" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Manage how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email_notifications" className="text-base">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="email_notifications"
                      checked={preferences.email_notifications}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, email_notifications: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="invoice_notifications" className="text-base">
                        Invoice Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when new invoices are issued
                      </p>
                    </div>
                    <Switch
                      id="invoice_notifications"
                      checked={preferences.invoice_notifications}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, invoice_notifications: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="treatment_update_notifications" className="text-base">
                        Treatment Updates
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about your treatment progress
                      </p>
                    </div>
                    <Switch
                      id="treatment_update_notifications"
                      checked={preferences.treatment_update_notifications}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, treatment_update_notifications: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing_emails" className="text-base">
                        Marketing Emails
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive promotional content and special offers
                      </p>
                    </div>
                    <Switch
                      id="marketing_emails"
                      checked={preferences.marketing_emails}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, marketing_emails: checked })
                      }
                    />
                  </div>

                  <div className="pt-4">
                    <Button onClick={handleSavePreferences} disabled={saving} className="gap-2">
                      <Save className="w-4 h-4" />
                      {saving ? "Saving..." : "Save Preferences"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}