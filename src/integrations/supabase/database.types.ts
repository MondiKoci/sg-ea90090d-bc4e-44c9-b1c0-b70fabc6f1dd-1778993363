 
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      before_after_cases: {
        Row: {
          after_image_url: string | null
          before_image_url: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          display_order: number | null
          id: string
          published: boolean | null
          treatment_type: string
        }
        Insert: {
          after_image_url?: string | null
          before_image_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          published?: boolean | null
          treatment_type: string
        }
        Update: {
          after_image_url?: string | null
          before_image_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          published?: boolean | null
          treatment_type?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          category: string | null
          content: string
          created_at: string | null
          created_by: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          published: boolean | null
          published_at: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      package_inclusions: {
        Row: {
          category: string
          created_at: string | null
          display_order: number | null
          id: string
          is_premium: boolean | null
          item_text: string
          package_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_premium?: boolean | null
          item_text: string
          package_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_premium?: boolean | null
          item_text?: string
          package_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_inclusions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          destination: string
          display_order: number | null
          duration_days: number | null
          highlights: string | null
          id: string
          name: string
          price_from: number | null
          price_to: number | null
          published: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          destination: string
          display_order?: number | null
          duration_days?: number | null
          highlights?: string | null
          id?: string
          name: string
          price_from?: number | null
          price_to?: number | null
          published?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          destination?: string
          display_order?: number | null
          duration_days?: number | null
          highlights?: string | null
          id?: string
          name?: string
          price_from?: number | null
          price_to?: number | null
          published?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      patient_files: {
        Row: {
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          patient_id: string
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          patient_id: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          patient_id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_files_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_reminders: {
        Row: {
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_completed: boolean | null
          patient_id: string
          reminder_date: string | null
          reminder_text: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_completed?: boolean | null
          patient_id: string
          reminder_date?: string | null
          reminder_text: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_completed?: boolean | null
          patient_id?: string
          reminder_date?: string | null
          reminder_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_reminders_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_shares: {
        Row: {
          created_at: string | null
          id: string
          patient_id: string
          shared_by: string | null
          shared_with_email: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          patient_id: string
          shared_by?: string | null
          shared_with_email: string
        }
        Update: {
          created_at?: string | null
          id?: string
          patient_id?: string
          shared_by?: string | null
          shared_with_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_shares_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          accommodation_notes: string | null
          arrival_date: string | null
          created_at: string | null
          created_by: string | null
          departure_date: string | null
          email: string | null
          full_name: string
          id: string
          last_portal_login: string | null
          payment_first_notes: string | null
          payment_second_notes: string | null
          payment_total_notes: string | null
          phone: string | null
          portal_access_enabled: boolean | null
          portal_password: string | null
          status: string | null
          treatment_interest: string | null
          updated_at: string | null
          work_notes: string | null
        }
        Insert: {
          accommodation_notes?: string | null
          arrival_date?: string | null
          created_at?: string | null
          created_by?: string | null
          departure_date?: string | null
          email?: string | null
          full_name: string
          id?: string
          last_portal_login?: string | null
          payment_first_notes?: string | null
          payment_second_notes?: string | null
          payment_total_notes?: string | null
          phone?: string | null
          portal_access_enabled?: boolean | null
          portal_password?: string | null
          status?: string | null
          treatment_interest?: string | null
          updated_at?: string | null
          work_notes?: string | null
        }
        Update: {
          accommodation_notes?: string | null
          arrival_date?: string | null
          created_at?: string | null
          created_by?: string | null
          departure_date?: string | null
          email?: string | null
          full_name?: string
          id?: string
          last_portal_login?: string | null
          payment_first_notes?: string | null
          payment_second_notes?: string | null
          payment_total_notes?: string | null
          phone?: string | null
          portal_access_enabled?: boolean | null
          portal_password?: string | null
          status?: string | null
          treatment_interest?: string | null
          updated_at?: string | null
          work_notes?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      treatment_steps: {
        Row: {
          completed_at: string | null
          created_at: string | null
          description: string | null
          id: string
          instructions: string | null
          patient_id: string
          scheduled_date: string | null
          status: string
          step_number: number
          title: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          instructions?: string | null
          patient_id: string
          scheduled_date?: string | null
          status?: string
          step_number: number
          title: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          instructions?: string | null
          patient_id?: string
          scheduled_date?: string | null
          status?: string
          step_number?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "treatment_steps_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      treatments: {
        Row: {
          benefits: string[] | null
          category: string | null
          created_at: string | null
          display_order: number | null
          duration_days: number | null
          faq: Json | null
          featured_image_url: string | null
          hero_image_url: string | null
          icon_name: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          overview: string | null
          price_range_max: number | null
          price_range_min: number | null
          procedure_steps: string[] | null
          published: boolean | null
          recovery_info: string | null
          savings_percentage: number | null
          short_description: string | null
          slug: string
          title: string
          typical_foreign_price: number | null
          updated_at: string | null
        }
        Insert: {
          benefits?: string[] | null
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          duration_days?: number | null
          faq?: Json | null
          featured_image_url?: string | null
          hero_image_url?: string | null
          icon_name?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          overview?: string | null
          price_range_max?: number | null
          price_range_min?: number | null
          procedure_steps?: string[] | null
          published?: boolean | null
          recovery_info?: string | null
          savings_percentage?: number | null
          short_description?: string | null
          slug: string
          title: string
          typical_foreign_price?: number | null
          updated_at?: string | null
        }
        Update: {
          benefits?: string[] | null
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          duration_days?: number | null
          faq?: Json | null
          featured_image_url?: string | null
          hero_image_url?: string | null
          icon_name?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          overview?: string | null
          price_range_max?: number | null
          price_range_min?: number | null
          procedure_steps?: string[] | null
          published?: boolean | null
          recovery_info?: string | null
          savings_percentage?: number | null
          short_description?: string | null
          slug?: string
          title?: string
          typical_foreign_price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
