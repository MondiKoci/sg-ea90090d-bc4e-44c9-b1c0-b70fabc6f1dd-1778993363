import { supabase } from "@/integrations/supabase/client";

export interface PatientSession {
  patientId: string;
  email: string;
  fullName: string;
}

const PATIENT_SESSION_KEY = "patient_session";

export const patientAuthService = {
  // Login with email and portal password
  async login(email: string, password: string): Promise<PatientSession> {
    const { data, error } = await supabase
      .from("patients")
      .select("id, email, full_name, portal_access_enabled")
      .eq("email", email)
      .eq("portal_password", password)
      .eq("portal_access_enabled", true)
      .single();

    if (error || !data) {
      throw new Error("Invalid credentials or portal access not enabled");
    }

    // Update last login
    await supabase
      .from("patients")
      .update({ last_portal_login: new Date().toISOString() })
      .eq("id", data.id);

    const session: PatientSession = {
      patientId: data.id,
      email: data.email,
      fullName: data.full_name,
    };

    // Store in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(PATIENT_SESSION_KEY, JSON.stringify(session));
    }

    return session;
  },

  // Get current session
  getSession(): PatientSession | null {
    if (typeof window === "undefined") return null;
    
    const sessionData = localStorage.getItem(PATIENT_SESSION_KEY);
    if (!sessionData) return null;

    try {
      return JSON.parse(sessionData);
    } catch {
      return null;
    }
  },

  // Logout
  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(PATIENT_SESSION_KEY);
    }
  },

  // Check if logged in
  isLoggedIn(): boolean {
    return this.getSession() !== null;
  },
};