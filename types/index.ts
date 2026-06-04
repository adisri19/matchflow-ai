export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  gender: "Male" | "Female";
  dob: string;
  age: number;
  country: string;
  city: string;
  state: string;
  height: number; // in cm
  email: string;
  phone: string;
  college: string;
  degree: string;
  income: number; // in INR LPA
  company: string;
  designation: string;
  maritalStatus: "Never Married" | "Divorced" | "Widowed" | "Awaiting Divorce";
  languages: string[];
  siblings: string;
  religion: string;
  caste: string;
  wantsKids: "Yes" | "No" | "Open";
  openToRelocate: "Yes" | "No" | "Maybe";
  openToPets: "Yes" | "No" | "Maybe";
  hobbies: string[];
  values: string[];
  bio: string;
  profileImage: string;
  notes?: string;
}

export interface CompatibilityResult {
  compatibilityScore: number;
  matchReasons: string[];
  warningFlags: string[];
  emotionalAlignment: "High" | "Medium" | "Low";
  lifestyleCompatibility: "High" | "Medium" | "Low";
  longTermPotential: "Excellent" | "Good" | "Fair" | "Uncertain";
}

export interface TopMatch extends Profile {
  compatibility: CompatibilityResult;
}
