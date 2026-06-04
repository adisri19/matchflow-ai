import { Profile, CompatibilityResult, TopMatch } from "@/types";

export function calculateCompatibility(
  customer: Profile,
  candidate: Profile
): CompatibilityResult {
  let score = 0;
  const matchReasons: string[] = [];
  const warningFlags: string[] = [];

  // Gender check - normally opposite gender in this matrimonial context
  if (customer.gender === candidate.gender) {
    return {
      compatibilityScore: 0,
      matchReasons: [],
      warningFlags: ["Same gender profiles (Non-traditional matchmaking request)"],
      emotionalAlignment: "Low",
      lifestyleCompatibility: "Low",
      longTermPotential: "Uncertain",
    };
  }

  // 1. AGE MATCHING (15 points)
  let ageScore = 0;
  const ageDiff = customer.age - candidate.age;

  if (customer.gender === "Male") {
    // Men prefer younger women (ideal: candidate is 1-6 years younger)
    if (ageDiff >= 1 && ageDiff <= 6) {
      ageScore = 15;
      matchReasons.push("Ideal age gap (candidate is 1-6 years younger)");
    } else if (ageDiff > 6 && ageDiff <= 10) {
      ageScore = 12;
      matchReasons.push("Candidate is younger (7-10 years age difference)");
    } else if (ageDiff === 0) {
      ageScore = 10;
      matchReasons.push("Same age profiles");
    } else if (ageDiff < 0 && ageDiff >= -3) {
      // Candidate is slightly older
      ageScore = 7;
      warningFlags.push("Candidate is slightly older (1-3 years difference)");
    } else if (ageDiff < -3) {
      ageScore = 3;
      warningFlags.push("Candidate is older by more than 3 years");
    } else {
      // Age diff > 10
      ageScore = 8;
      warningFlags.push("Significant age gap (candidate is more than 10 years younger)");
    }
  } else {
    // Women prefer older men (ideal: candidate is 1-6 years older, i.e., ageDiff is negative)
    const femaleAgeDiff = candidate.age - customer.age;
    if (femaleAgeDiff >= 1 && femaleAgeDiff <= 6) {
      ageScore = 15;
      matchReasons.push("Ideal age gap (candidate is 1-6 years older)");
    } else if (femaleAgeDiff > 6 && femaleAgeDiff <= 10) {
      ageScore = 12;
      matchReasons.push("Candidate is older (7-10 years age difference)");
    } else if (femaleAgeDiff === 0) {
      ageScore = 10;
      matchReasons.push("Same age profiles");
    } else if (femaleAgeDiff < 0 && femaleAgeDiff >= -3) {
      ageScore = 7;
      warningFlags.push("Candidate is slightly younger (1-3 years difference)");
    } else if (femaleAgeDiff < -3) {
      ageScore = 3;
      warningFlags.push("Candidate is younger by more than 3 years");
    } else {
      ageScore = 8;
      warningFlags.push("Significant age gap (candidate is more than 10 years older)");
    }
  }
  score += ageScore;

  // 2. HEIGHT MATCHING (15 points)
  let heightScore = 0;
  const heightDiff = customer.height - candidate.height; // Positive means customer is taller

  if (customer.gender === "Male") {
    // Men prefer shorter women
    if (heightDiff >= 2 && heightDiff <= 15) {
      heightScore = 15;
      matchReasons.push("Great physical compatibility (height)");
    } else if (heightDiff > 15) {
      heightScore = 12;
      matchReasons.push("Candidate is significantly shorter (15cm+ difference)");
    } else if (heightDiff < 0) {
      heightScore = 5;
      warningFlags.push("Candidate is taller than the client");
    } else {
      heightScore = 10;
    }
  } else {
    // Women prefer taller men (heightDiff should be negative, meaning candidate is taller)
    const femaleHeightDiff = candidate.height - customer.height;
    if (femaleHeightDiff >= 2 && femaleHeightDiff <= 15) {
      heightScore = 15;
      matchReasons.push("Excellent physical compatibility (height)");
    } else if (femaleHeightDiff > 15) {
      heightScore = 12;
      matchReasons.push("Candidate is significantly taller (15cm+ difference)");
    } else if (femaleHeightDiff < 0) {
      heightScore = 5;
      warningFlags.push("Candidate is shorter than the client");
    } else {
      heightScore = 10;
    }
  }
  score += heightScore;

  // 3. RELIGION & CASTE (20 points)
  let religionScore = 0;
  if (customer.religion === candidate.religion) {
    religionScore += 15;
    matchReasons.push(`Shared religious background (${customer.religion})`);

    // Caste match (only relevant if same religion)
    if (customer.caste === candidate.caste || customer.caste === "Open" || candidate.caste === "Open" || customer.caste === "Not Applicable") {
      religionScore += 5;
      matchReasons.push("Matching or flexible caste preference");
    } else {
      religionScore += 2;
      warningFlags.push(`Different castes (${customer.caste} vs ${candidate.caste})`);
    }
  } else {
    warningFlags.push(`Interfaith match (${customer.religion} & ${candidate.religion})`);
  }
  score += religionScore;

  // 4. LANGUAGE COMPATIBILITY (5 points)
  const sharedLanguages = customer.languages.filter((l) =>
    candidate.languages.includes(l)
  );
  if (sharedLanguages.length >= 2) {
    score += 5;
    matchReasons.push(`Multi-lingual alignment (${sharedLanguages.join(", ")})`);
  } else if (sharedLanguages.length === 1) {
    score += 3;
    matchReasons.push(`Shared language: ${sharedLanguages[0]}`);
  } else {
    warningFlags.push("No common languages spoken");
  }

  // 5. GEOGRAPHIC PROXIMITY (10 points)
  let geoScore = 0;
  if (customer.city === candidate.city) {
    geoScore = 10;
    matchReasons.push(`Both are located in ${customer.city}`);
  } else if (customer.state === candidate.state) {
    geoScore = 6;
    matchReasons.push(`Located in the same state (${customer.state})`);
  } else {
    geoScore = 2;
    warningFlags.push(`Different cities (${customer.city} to ${candidate.city})`);
  }
  score += geoScore;

  // 6. FAMILY & CHILDREN PREFERENCES (10 points)
  let kidsScore = 0;
  if (customer.wantsKids === candidate.wantsKids) {
    kidsScore = 10;
    if (customer.wantsKids === "Yes") {
      matchReasons.push("Strong alignment on wanting children");
    } else if (customer.wantsKids === "No") {
      matchReasons.push("Aligned on choosing a child-free lifestyle");
    } else {
      matchReasons.push("Both are open to having children in the future");
    }
  } else if (
    (customer.wantsKids === "Open" && (candidate.wantsKids === "Yes" || candidate.wantsKids === "No")) ||
    (candidate.wantsKids === "Open" && (customer.wantsKids === "Yes" || customer.wantsKids === "No"))
  ) {
    kidsScore = 7;
    matchReasons.push("One partner is open to children, other is decided");
  } else {
    kidsScore = 0;
    warningFlags.push("Conflicting desires regarding having children");
  }
  score += kidsScore;

  // 7. LIFESTYLE ALIGNMENT: PETS & RELOCATION (10 points)
  let lifestyleScore = 0;
  // Pets
  if (customer.openToPets === candidate.openToPets || customer.openToPets === "Maybe" || candidate.openToPets === "Maybe") {
    lifestyleScore += 5;
  } else if (customer.openToPets === "Yes" && candidate.openToPets === "No") {
    warningFlags.push("Potential conflict: Pet lover matched with non-pet preference");
  } else if (customer.openToPets === "No" && candidate.openToPets === "Yes") {
    warningFlags.push("Potential conflict: Non-pet preference matched with pet lover");
  }

  // Relocation
  if (customer.openToRelocate === "Yes" || candidate.openToRelocate === "Yes") {
    lifestyleScore += 5;
    matchReasons.push("Flexible relocation readiness");
  } else if (customer.openToRelocate === "Maybe" || candidate.openToRelocate === "Maybe") {
    lifestyleScore += 3;
  } else if (customer.city !== candidate.city && customer.openToRelocate === "No" && candidate.openToRelocate === "No") {
    warningFlags.push("Both are unwilling to relocate despite living in different cities");
  } else {
    lifestyleScore += 5; // same city, relocation not critical
  }
  score += lifestyleScore;

  // 8. PROFESSIONAL & EDUCATION (10 points)
  let profScore = 0;
  const commonDegreeType =
    (customer.degree.includes("B.Tech") && candidate.degree.includes("B.Tech")) ||
    (customer.degree.includes("MBA") && candidate.degree.includes("MBA")) ||
    (customer.degree.includes("MBBS") && candidate.degree.includes("MBBS")) ||
    (customer.degree.includes("MD") && candidate.degree.includes("MD"));

  if (commonDegreeType) {
    profScore += 3;
    matchReasons.push("Matching professional/educational fields");
  }

  if (customer.gender === "Male") {
    // Men: slight preference for lower or similar income
    if (candidate.income <= customer.income + 5) {
      profScore += 7;
    } else {
      profScore += 4;
      warningFlags.push("Candidate has a significantly higher income (potential expectation mismatch)");
    }
  } else {
    // Women: prefer financial stability (equal or higher income)
    if (candidate.income >= customer.income - 3) {
      profScore += 7;
      matchReasons.push("Strong financial stability and income alignment");
    } else {
      profScore += 3;
      warningFlags.push("Candidate has a lower income than the client");
    }
  }
  score += profScore;

  // 9. VALUES & HOBBIES OVERLAP (5 points)
  let interestScore = 0;
  const sharedHobbies = customer.hobbies.filter((h) => candidate.hobbies.includes(h));
  const sharedValues = customer.values.filter((v) => candidate.values.includes(v));

  if (sharedHobbies.length > 0) {
    interestScore += 2;
    matchReasons.push(`Common hobbies: ${sharedHobbies.join(", ")}`);
  }
  if (sharedValues.length > 0) {
    interestScore += 3;
    matchReasons.push(`Shared relationship values: ${sharedValues.join(", ")}`);
  }
  score += interestScore;

  // Cap score between 0 and 100
  const finalScore = Math.min(100, Math.max(0, Math.round(score)));

  // Calculate Sub-evaluations
  let emotionalAlignment: "High" | "Medium" | "Low" = "Low";
  const sharedValuesCount = sharedValues.length;
  if (sharedValuesCount >= 2 || (sharedValuesCount === 1 && sharedHobbies.length >= 1)) {
    emotionalAlignment = "High";
  } else if (sharedValuesCount === 1 || sharedHobbies.length >= 1) {
    emotionalAlignment = "Medium";
  }

  let lifestyleCompatibility: "High" | "Medium" | "Low" = "Low";
  const lifestyleSub = kidsScore + lifestyleScore; // out of 20
  if (lifestyleSub >= 15) {
    lifestyleCompatibility = "High";
  } else if (lifestyleSub >= 8) {
    lifestyleCompatibility = "Medium";
  }

  let longTermPotential: "Excellent" | "Good" | "Fair" | "Uncertain" = "Uncertain";
  if (finalScore >= 80) {
    longTermPotential = "Excellent";
  } else if (finalScore >= 65) {
    longTermPotential = "Good";
  } else if (finalScore >= 45) {
    longTermPotential = "Fair";
  }

  return {
    compatibilityScore: finalScore,
    matchReasons,
    warningFlags,
    emotionalAlignment,
    lifestyleCompatibility,
    longTermPotential,
  };
}

export function getTopMatches(customer: Profile, profiles: Profile[]): TopMatch[] {
  const matches: TopMatch[] = [];

  for (const profile of profiles) {
    if (profile.id === customer.id) continue;
    if (profile.gender === customer.gender) continue; // Filter out same-gender profiles

    const compatibility = calculateCompatibility(customer, profile);
    matches.push({
      ...profile,
      compatibility,
    });
  }

  // Sort by compatibility score descending
  return matches
    .sort((a, b) => b.compatibility.compatibilityScore - a.compatibility.compatibilityScore)
    .slice(0, 10);
}
