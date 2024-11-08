import { createContext } from 'react';
import { EnergyRegion } from '@/app/models/energy-region';
import { EnergyData } from '@/app/models/energy-data';
import { dataService } from '@/app/services/data-service';
import { CalculatedResponse } from '@/app/services/data-calculator';

export type UserEnergyConfiguration = {
  [key: string]: { count: number; label: string };
};
export type GameState = {
  userEnergyConfiguration: UserEnergyConfiguration;
  setUserEnergyConfiguration: (config: UserEnergyConfiguration) => void;
  totalPowerKWh: number;
  setTotalPowerKWh: (totalPowerKWh: number) => void;
  regionMatch: EnergyRegion | null;
  setRegionMatch: (region: EnergyRegion | null) => void;
  energyData: EnergyData;
  calculate: () => void;
  resetSources: () => void;
  totals: CalculatedResponse;
};

export const GameContext = createContext<GameState>({
  userEnergyConfiguration: {},
  setUserEnergyConfiguration: () => {},
  totalPowerKWh: 0,
  setTotalPowerKWh: () => {},
  regionMatch: null,
  setRegionMatch: () => {},
  energyData: dataService.getEnergyData(),
  calculate: () => {},
  resetSources: () => {},
  totals: {
    totalPowerKWh: 0,
    budgetPercent: 0,
    errors: [],
    sourceErrors: {},
    budgetExceeded: false,
  },
});
