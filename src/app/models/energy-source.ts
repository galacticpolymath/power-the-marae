import { EnergyCategory, EnergyType } from '@/app/models/energy-types';
import { EnergyImageLayer } from '@/app/models/energy-image-layer';
import { EnergyCircle } from '@/app/models/energy-circle';
import { EnergySourceKey } from '@/app/models/energy-source-key';

export interface EnergySource {
  key: EnergySourceKey;
  full_name: string;
  description: string;
  unit_kWh: number;
  maxUnits: number;
  max_kWh_contribution: number;
  maxUnitExplanation: string;
  outputType: EnergyType;
  category: EnergyCategory;
  imageSelector?: string;
  mapSource: string;
  color: string;
  circle: EnergyCircle;
  imageLayers: EnergyImageLayer[];
}
