import { EnergySource } from '@/app/models/energy-source';
import { EnergyRegion } from '@/app/models/energy-region';
import { EnergyScenarioConfiguration } from '@/app/models/energy-scenario-configuration';

export interface EnergyData {
  regions: EnergyRegion[];
  sources: EnergySource[];
  scenarioConfiguration: EnergyScenarioConfiguration;
}
