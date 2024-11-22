import { EnergyCategoryRule } from '@/app/models/energy-category-rule';

export interface EnergyScenarioConfiguration {
  categoryRules: EnergyCategoryRule[];
  baseImageSrcs: { order: number; src: string }[];
}
