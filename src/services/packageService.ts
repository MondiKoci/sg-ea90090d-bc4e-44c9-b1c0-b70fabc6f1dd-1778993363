import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Package = Tables<"packages">;
export type PackageInclusion = Tables<"package_inclusions">;

export type PackageInsert = Omit<Package, "id" | "created_at" | "updated_at"> & {
  inclusions?: Omit<PackageInclusion, "id" | "package_id" | "created_at">[];
};

export const packageService = {
  // Get all published packages (public)
  async getPublishedPackages(): Promise<Package[]> {
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get all packages (admin)
  async getAllPackages(): Promise<Package[]> {
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get single package with inclusions
  async getPackageWithInclusions(packageId: string): Promise<{
    package: Package;
    inclusions: PackageInclusion[];
  }> {
    const { data: packageData, error: packageError } = await supabase
      .from("packages")
      .select("*")
      .eq("id", packageId)
      .single();

    if (packageError) throw packageError;

    const { data: inclusions, error: inclusionsError } = await supabase
      .from("package_inclusions")
      .select("*")
      .eq("package_id", packageId)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (inclusionsError) throw inclusionsError;

    return {
      package: packageData,
      inclusions: inclusions || [],
    };
  },

  // Create package
  async createPackage(packageData: PackageInsert): Promise<string> {
    const { inclusions, ...packageFields } = packageData;

    const { data, error } = await supabase
      .from("packages")
      .insert(packageFields)
      .select()
      .single();

    if (error) throw error;

    // Add inclusions if provided
    if (inclusions && inclusions.length > 0) {
      const inclusionsWithPackageId = inclusions.map((inc) => ({
        ...inc,
        package_id: data.id,
      }));

      const { error: inclusionsError } = await supabase
        .from("package_inclusions")
        .insert(inclusionsWithPackageId);

      if (inclusionsError) throw inclusionsError;
    }

    return data.id;
  },

  // Update package
  async updatePackage(
    packageId: string,
    updates: Partial<Omit<Package, "id" | "created_at">>
  ): Promise<void> {
    const { error } = await supabase
      .from("packages")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", packageId);

    if (error) throw error;
  },

  // Delete package
  async deletePackage(packageId: string): Promise<void> {
    const { error } = await supabase
      .from("packages")
      .delete()
      .eq("id", packageId);

    if (error) throw error;
  },

  // Add inclusion to package
  async addInclusion(inclusion: Omit<PackageInclusion, "id" | "created_at">): Promise<void> {
    const { error } = await supabase
      .from("package_inclusions")
      .insert(inclusion);

    if (error) throw error;
  },

  // Update inclusion
  async updateInclusion(
    inclusionId: string,
    updates: Partial<Omit<PackageInclusion, "id" | "package_id" | "created_at">>
  ): Promise<void> {
    const { error } = await supabase
      .from("package_inclusions")
      .update(updates)
      .eq("id", inclusionId);

    if (error) throw error;
  },

  // Delete inclusion
  async deleteInclusion(inclusionId: string): Promise<void> {
    const { error } = await supabase
      .from("package_inclusions")
      .delete()
      .eq("id", inclusionId);

    if (error) throw error;
  },

  // Get inclusions by package
  async getPackageInclusions(packageId: string): Promise<PackageInclusion[]> {
    const { data, error } = await supabase
      .from("package_inclusions")
      .select("*")
      .eq("package_id", packageId)
      .order("category", { ascending: true })
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data || [];
  },
};