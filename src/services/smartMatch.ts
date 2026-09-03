import { Machine, SearchCriteria, SmartMatchScore } from '../types';

/**
 * AI Smart Match — Prototype
 * Transparent matching algorithm calculating suitability based on:
 * Availability (40%), Price (25%), Distance (20%), Reliability (15%)
 * Adjusted by Work Suitability and Farm Area Suitability.
 */
export function calculateSmartMatch(
  machine: Machine,
  criteria?: SearchCriteria
): SmartMatchScore {
  // 1. Availability Score (Weight: 40%)
  let availabilityScore = 60;
  if (machine.isAvailable && machine.active) {
    availabilityScore = 95;
    if (criteria?.date) {
      const isDateListed = machine.availableDates.length === 0 || 
        machine.availableDates.some(d => d === criteria.date || d >= criteria.date!);
      availabilityScore = isDateListed ? 98 : 75;
    }
  } else {
    availabilityScore = 25;
  }

  // 2. Price Score (Weight: 25%)
  let priceScore = 80;
  if (criteria?.budget && criteria.budget > 0) {
    const budget = criteria.budget;
    const rate = machine.hourlyRate;
    if (rate <= budget) {
      // Well within budget
      const savingsRatio = (budget - rate) / budget;
      priceScore = Math.min(99, Math.round(85 + savingsRatio * 15));
    } else {
      // Over budget
      const overRatio = (rate - budget) / budget;
      priceScore = Math.max(20, Math.round(75 - overRatio * 50));
    }
  } else {
    // Relative score based on benchmark price for category
    const benchmarks: Record<string, number> = {
      Tractor: 1000,
      Harvester: 2400,
      'Seed Drill': 800,
      Rotavator: 750,
      Cultivator: 650,
      Irrigation: 500,
      Other: 600,
    };
    const benchmark = benchmarks[machine.type] || 800;
    if (machine.hourlyRate <= benchmark) {
      priceScore = 90;
    } else {
      priceScore = Math.max(60, Math.round(90 - ((machine.hourlyRate - benchmark) / benchmark) * 30));
    }
  }

  // 3. Distance Score (Weight: 20%)
  let distanceScore = 85;
  const distance = machine.distanceKm;
  if (distance <= 3) {
    distanceScore = 98;
  } else if (distance <= 8) {
    distanceScore = 92;
  } else if (distance <= 15) {
    distanceScore = 82;
  } else if (distance <= 25) {
    distanceScore = 70;
  } else {
    distanceScore = Math.max(30, 65 - Math.round(distance - 25));
  }

  // 4. Reliability Score (Weight: 15%)
  // Based on machine rating and owner rating
  const avgRating = (machine.rating + machine.ownerRating) / 2;
  const reliabilityScore = Math.round(Math.min(99, Math.max(40, (avgRating / 5) * 98)));

  // 5. Work & Farm Suitability Factors
  let workSuitabilityScore = 85;
  if (criteria?.workType && criteria.workType !== 'All' && criteria.workType.trim() !== '') {
    const matched = machine.suitableWork.some(
      w => w.toLowerCase().includes(criteria.workType!.toLowerCase()) ||
           criteria.workType!.toLowerCase().includes(w.toLowerCase())
    );
    workSuitabilityScore = matched ? 96 : 50;
  }

  let farmSizeSuitabilityScore = 85;
  if (criteria?.farmArea && criteria.farmArea > 0) {
    const { minAcres, maxAcres } = machine.suitableFarmSize;
    if (criteria.farmArea >= minAcres && criteria.farmArea <= maxAcres) {
      farmSizeSuitabilityScore = 95;
    } else if (criteria.farmArea < minAcres) {
      farmSizeSuitabilityScore = 75; // Machine might be slightly oversized
    } else {
      farmSizeSuitabilityScore = 65; // Machine might take longer for very large area
    }
  }

  // Core formula: 40% Availability + 25% Price + 20% Distance + 15% Reliability
  const baseScore =
    availabilityScore * 0.40 +
    priceScore * 0.25 +
    distanceScore * 0.20 +
    reliabilityScore * 0.15;

  // Modulate slightly by work and farm suitability (± 5 points)
  const workModifier = ((workSuitabilityScore - 80) / 100) * 6;
  const farmModifier = ((farmSizeSuitabilityScore - 80) / 100) * 4;

  const rawOverall = Math.round(baseScore + workModifier + farmModifier);
  const overallScore = Math.min(99, Math.max(35, rawOverall));

  // Dynamic explanation
  let explanation = '';
  if (overallScore >= 90) {
    explanation = `Top recommendation: Ideal match for your area, within budget, with verified owner reliability and high local availability (${machine.distanceKm} km away).`;
  } else if (overallScore >= 80) {
    explanation = `Strong match: High suitability and reliable performance near ${machine.location.split(',')[0]}.`;
  } else if (overallScore >= 65) {
    explanation = `Moderate match: Good option, though price or distance may be slightly higher than peak optimal.`;
  } else {
    explanation = `Alternative match: Available in surrounding cluster, consider checking alternative dates.`;
  }

  return {
    overallScore,
    availabilityScore,
    priceScore,
    distanceScore,
    reliabilityScore,
    workSuitabilityScore,
    farmSizeSuitabilityScore,
    explanation,
  };
}
