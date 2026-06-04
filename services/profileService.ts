import { Profile } from "@/types";
import profilesData from "@/data/profiles.json";

// We'll cast the static JSON import as the Profile array
const initialProfiles: Profile[] = profilesData as Profile[];

/**
 * Service to handle data retrieval and notes persistence for matchmaking profiles.
 * In a real application, this would interface with a database (e.g., Supabase PostgreSQL).
 */
export class ProfileService {
  /**
   * Fetch all profiles
   */
  static async getAllProfiles(): Promise<Profile[]> {
    return initialProfiles;
  }

  /**
   * Fetch a single profile by ID
   */
  static async getProfileById(id: string): Promise<Profile | null> {
    const profile = initialProfiles.find((p) => p.id === id);
    if (!profile) return null;
    return profile;
  }

  /**
   * Search and filter profiles
   */
  static async getFilteredProfiles(filters: {
    query?: string;
    gender?: string;
    city?: string;
    religion?: string;
    wantsKids?: string;
    maritalStatus?: string;
  }): Promise<Profile[]> {
    let list = [...initialProfiles];

    if (filters.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (p) =>
          p.firstName.toLowerCase().includes(q) ||
          p.lastName.toLowerCase().includes(q) ||
          p.designation.toLowerCase().includes(q) ||
          p.company.toLowerCase().includes(q) ||
          p.caste.toLowerCase().includes(q)
      );
    }

    if (filters.gender && filters.gender !== "All") {
      list = list.filter((p) => p.gender === filters.gender);
    }

    if (filters.city && filters.city !== "All") {
      list = list.filter((p) => p.city === filters.city);
    }

    if (filters.religion && filters.religion !== "All") {
      list = list.filter((p) => p.religion === filters.religion);
    }

    if (filters.wantsKids && filters.wantsKids !== "All") {
      list = list.filter((p) => p.wantsKids === filters.wantsKids);
    }

    if (filters.maritalStatus && filters.maritalStatus !== "All") {
      list = list.filter((p) => p.maritalStatus === filters.maritalStatus);
    }

    return list;
  }

  /**
   * Get cities list for filters
   */
  static async getUniqueCities(): Promise<string[]> {
    return Array.from(new Set(initialProfiles.map((p) => p.city))).sort();
  }

  /**
   * Get religions list for filters
   */
  static async getUniqueReligions(): Promise<string[]> {
    return Array.from(new Set(initialProfiles.map((p) => p.religion))).sort();
  }
}
