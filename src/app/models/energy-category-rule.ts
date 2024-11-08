import { EnergyCategory } from '@/app/models/energy-types';

export interface EnergyCategoryRule {
  category: EnergyCategory;
  maxUnits: number;
  percentContribution: number;
  exceedMaximumError: string;
}
