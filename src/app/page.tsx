'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { UserEnergyConfiguration, GameContext } from '@/app/contexts/game-context';
import { EnergyRegion } from '@/app/models/energy-region';
import AppSidebar from '@/app/layout/app-sidebar';
import { CalculatedResponse, dataCalculator } from '@/app/services/data-calculator';
import { dataService } from '@/app/services/data-service';
import MaraeCanvas from '@/components/marae-canvas';
import { EnergyData } from '@/app/models/energy-data';

export default function Home() {
  const [energyConfiguration, setEnergyConfiguration] = useState<UserEnergyConfiguration>({});
  const [totalPowerKWh, setTotalPowerKWh] = useState(0);
  const [regionMatch, setRegionMatch] = useState<EnergyRegion | null>(null);
  const [energyData, _] = useState(dataService.getEnergyData());
  const [totals, setTotals] = useState<CalculatedResponse>({
    totalPowerKWh: 0,
    budgetPercent: 0,
    errors: [],
    sourceErrors: {},
  });
  const imagesToRender = useMemo(() => {
    const energySourceImages = dataCalculator.getImagesToRender(energyData, energyConfiguration);
    return [energyData.scenarioConfiguration.baseImageSrc, ...energySourceImages];
  }, [energyConfiguration]);
  const allImages = energyData.sources.map((source) => source.imageLayers.map((layer) => layer.src)).flat();

  const calculate = (data?: EnergyData, config?: UserEnergyConfiguration) => {
    const calculatedResponse = dataCalculator.calculateTotals(data || energyData, config || energyConfiguration);
    setTotals(calculatedResponse);
    setTotalPowerKWh(calculatedResponse.totalPowerKWh);
  };
  const resetSources = () => {
    const config = energyData.sources.reduce(
      (acc, source) => ({
        ...acc,
        [source.key]: { count: 0, label: source.full_name },
      }),
      {},
    );
    setEnergyConfiguration(config);
  };
  useEffect(() => {
    calculate(energyData, energyConfiguration);
  }, [energyData, energyConfiguration]);
  return (
    <GameContext.Provider
      value={{
        userEnergyConfiguration: energyConfiguration,
        setUserEnergyConfiguration: setEnergyConfiguration,
        totalPowerKWh: totalPowerKWh,
        setTotalPowerKWh: setTotalPowerKWh,
        regionMatch: regionMatch,
        setRegionMatch: setRegionMatch,
        energyData: energyData,
        calculate: calculate,
        resetSources: resetSources,
        totals: totals,
      }}
    >
      <div className="container mx-auto flex flex-row">
        <AppSidebar />
        <div className="bg-white w-full">
          <MaraeCanvas
            allImages={[energyData.scenarioConfiguration.baseImageSrc, ...allImages]}
            imagesToRender={imagesToRender}
            className="w-full h-auto"
          />
          <div style={{ background: 'green', height: '50px', width: '100%' }}></div>
        </div>
      </div>
    </GameContext.Provider>
  );
}
