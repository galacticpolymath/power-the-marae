import { createContext } from 'react';
import { EnergyRegion } from '@/app/models/energy-region';
import { EnergyData } from '@/app/models/energy-data';
import { energyDataService } from '@/app/services/energy-data-service';
import { CalculatedResponse } from '@/app/services/energy-calculation-service';

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
  calculate: (data: EnergyData, config: UserEnergyConfiguration) => void;
  resetSources: () => void;
  totals: CalculatedResponse;
  showIntro: boolean;
  setShowIntro: (showIntro: boolean) => void;
};

export const GameContext = createContext<GameState>({
  userEnergyConfiguration: {},
  setUserEnergyConfiguration: () => {},
  totalPowerKWh: 0,
  setTotalPowerKWh: () => {},
  showIntro: true,
  setShowIntro: () => {},
  regionMatch: null,
  setRegionMatch: () => {},
  energyData: energyDataService.getEnergyData(),
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
