import {EnergyCategory, EnergyType} from '@/app/models/energy-types';
import {EnergyImageLayer} from "@/app/models/energy-image-layer";

export interface EnergySource {
  key: string;
  full_name: string;
  description: string;
  unit_kWh: number;
  maxUnits: number;
  max_kWh_contribution: number;
  maxUnitExplanation: string;
  outputType: EnergyType;
  category: EnergyCategory;
  mapSource: string;
  imageLayers: EnergyImageLayer[];
}
