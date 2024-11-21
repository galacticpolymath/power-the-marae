'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GameContext, UserEnergyConfiguration } from '@/app/contexts/game-context';
import { EnergyRegion } from '@/app/models/energy-region';
import AppSidebar from '@/app/layout/app-sidebar';
import { CalculatedResponse, dataCalculator } from '@/app/services/energy-calculation-service';
import { energyDataService } from '@/app/services/energy-data-service';
import MaraeCanvas from '@/components/marae-canvas';
import { EnergyData } from '@/app/models/energy-data';
import { Button } from '@/components/ui/button';
import MaraeHeader from '@/app/layout/marae-header';
import GradientDialog from '@/components/dialog/gradientDialog';
import { Credits } from '@/components/credits';
import { EnergyCircle } from '@/app/models/energy-circle';
import { EnergyMixStackedBar } from '@/app/visuals/energy-mix-stacked-bar';
import GameIntroDialog from '@/app/layout/game-intro-dialog';
import { persistedService } from '@/app/services/persisted-service';
import EnergyReport from '@/app/visuals/energy-report';

export default function Home() {
  const [energyConfiguration, setEnergyConfiguration] = useState<UserEnergyConfiguration>({});
  const [totalPowerKWh, setTotalPowerKWh] = useState(0);
  const [isEdited, setIsEdited] = useState(false);
  const [regionMatch, setRegionMatch] = useState<EnergyRegion | null>(null);
  const [showCredits, setShowCredits] = useState(false);
  const [circles, setCircles] = useState<(EnergyCircle & { color: string })[]>([]);
  const [showEnergyMix, setShowEnergyMix] = useState(false);
  const [energyData, _] = useState(energyDataService.getEnergyData());
  const [totals, setTotals] = useState<CalculatedResponse>({
    totalPowerKWh: 0,
    budgetPercent: 0,
    errors: [],
    sourceErrors: {},
    budgetExceeded: false,
  });
  const [showIntro, setShowIntro] = useState(persistedService.getItemOrDefault<boolean>('showIntro', true));
  const imagesToRender = useMemo(() => {
    const energySourceImages = dataCalculator.getImagesToRender(energyData, energyConfiguration);
    return [...energyData.scenarioConfiguration.baseImageSrcs, ...energySourceImages.map((x) => x.src)];
  }, [energyData, energyConfiguration]);
  const allImages = energyData.sources.map((source) => source.imageLayers.map((layer) => layer)).flat();

  const calculate = useCallback((data: EnergyData, config: UserEnergyConfiguration) => {
    const calculatedResponse = dataCalculator.calculateTotals(data, config);
    setTotals(calculatedResponse);
    setTotalPowerKWh(calculatedResponse.totalPowerKWh);
  }, []);
  const resetSources = useCallback(() => {
    const config = energyData.sources.reduce(
      (acc, source) => ({
        ...acc,
        [source.key]: { count: 0, label: source.full_name },
      }),
      {},
    );
    setCircles([]);
    setShowEnergyMix(false);
    setIsEdited(false);
    setEnergyConfiguration(config);
  }, [energyData]);

  useEffect(() => {
    calculate(energyData, energyConfiguration);
    if (showEnergyMix) {
      const circles = dataCalculator.getCircles(energyData, energyConfiguration);
      setCircles(circles);
    }
    setIsEdited(true);
  }, [energyData, energyConfiguration, calculate]);

  const onGeneratePower = () => {
    const circles = dataCalculator.getCircles(energyData, energyConfiguration);
    setCircles(circles);
    setShowEnergyMix(true);
    setIsEdited(false);
  };

  return (
    <GameContext.Provider
      value={{
        userEnergyConfiguration: energyConfiguration,
        setUserEnergyConfiguration: setEnergyConfiguration,
        totalPowerKWh: totalPowerKWh,
        setTotalPowerKWh: setTotalPowerKWh,
        showIntro: showIntro,
        setShowIntro: setShowIntro,
        regionMatch: regionMatch,
        setRegionMatch: setRegionMatch,
        energyData: energyData,
        calculate: calculate,
        resetSources: resetSources,
        totals: totals,
      }}
    >
      <GameIntroDialog
        open={showIntro}
        onOpenChange={() => {
          persistedService.setItem('showIntro', false);
          setShowIntro(false);
        }}
      />
      <div className="container mx-auto flex flex-col md:flex-row">
        <AppSidebar />
        <div className="bg-white w-full flex flex-col h-screen justify-between">
          <div className="w-full flex flex-col">
            <MaraeHeader />
            <MaraeCanvas
              allImages={[...energyData.scenarioConfiguration.baseImageSrcs.map((x) => ({ src: x })), ...allImages]}
              imagesToRender={imagesToRender}
              circles={circles}
              className="w-full h-auto"
            />
            <div className="w-full flex justify-center mt-4">
              {(!showEnergyMix || isEdited) && (
                <Button
                  disabled={totalPowerKWh === 0}
                  className="bg-blue-600 hover:bg-blue-500 w-[12rem] h-[3rem] text-xl"
                  onClick={onGeneratePower}
                >
                  Generate Power
                </Button>
              )}
              {showEnergyMix && !isEdited && (
                <EnergyMixStackedBar
                  energyData={energyData}
                  energyConfiguration={energyConfiguration}
                  totalPowerKWh={totalPowerKWh}
                />
              )}
            </div>
            <div>
              {showEnergyMix && !isEdited && (
                <EnergyReport energyData={energyData} config={energyConfiguration} totals={totals} />
              )}
            </div>
          </div>
          <div className="flex w-full p-8 justify-end">
            <div className="flex flex-row justify-between items-center">
              <Button variant="outline" onClick={() => setShowCredits(true)}>
                credits
              </Button>

              <img
                alt="Galactic Polymath Logo"
                style={{ height: '21px', marginLeft: '2rem' }}
                src="/galactic_polymath_wm.png"
              />
            </div>
          </div>
        </div>
        <GradientDialog title="Credits" open={showCredits} onOpenChange={() => setShowCredits(false)}>
          <Credits />
        </GradientDialog>
      </div>
    </GameContext.Provider>
  );
}
