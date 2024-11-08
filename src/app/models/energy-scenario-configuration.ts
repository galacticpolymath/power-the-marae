import { EnergyCategoryRule } from '@/app/models/energy-category-rule';

export interface EnergyScenarioConfiguration {
  categoryRules: EnergyCategoryRule[];
  baseImageSrc: string;
}
