import { EnergySource } from '@/app/models/energy-source';
import { EnergyRegion } from '@/app/models/energy-region';
import { EnergyScenarioConfiguration } from '@/app/models/energy-scenario-configuration';
import { EnergyToolTip } from '@/app/models/energy-tool-tip';

export interface EnergyData {
  regions: EnergyRegion[];
  sources: EnergySource[];
  tooltips: EnergyToolTip[];
  scenarioConfiguration: EnergyScenarioConfiguration;
}
