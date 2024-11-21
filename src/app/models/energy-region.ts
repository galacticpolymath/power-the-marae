import { EnergySourceKey } from '@/app/models/energy-source-key';

export type EnergyRegion = {
  [key in EnergySourceKey]: number;
} & {
  name: string;
  description: string;
};
