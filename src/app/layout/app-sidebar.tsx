import React, { useContext, useEffect, useState } from 'react';

import { GameContext } from '@/app/contexts/game-context';
import { EnergyData } from '@/app/models/energy-data';
import EnergyEditor from '@/components/energy/energy-editor';
import { Zap, PiggyBank, AlertCircle } from 'lucide-react';

import { Progress } from '@/components/ui/progress';
import { dataService } from '@/app/services/data-service';
import tailWindConfig from '@/../tailwind.config';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import GradientDialog from '@/components/dialog/gradientDialog';

const AppSidebar = () => {
  const { userEnergyConfiguration, setUserEnergyConfiguration, resetSources, totals } = useContext(GameContext);
  const [energyData, _] = useState<EnergyData>(dataService.getEnergyData());
  const [showOverMaxDialog, setShowOverMaxDialog] = useState<string | null>(null);

  useEffect(() => {
    resetSources();
  }, [resetSources]);

  const onChangeConfiguration = (key: string, count: number) => {
    setUserEnergyConfiguration({ ...userEnergyConfiguration, [key]: { ...userEnergyConfiguration[key], count } });
  };

  const onAtMax = (key: string) => {
    setShowOverMaxDialog(key);
  };
  if (!energyData) {
    return;
  }
  return (
    <div className="bg-gray-100 h-auto md:h-screen w-full md:w-1/4 min-w-96 px-4 pt-4 pb-8 flex flex-col">
      <div className="flex flex-row justify-between items-end pb-2">
        <div className="text-xl">Energy Sources</div>
        <div className="text-xl">Quantity</div>
      </div>
      <div className="w-full flex flex-row justify-end">
        <a href="#" onClick={resetSources} className="text-xs text-blue-600 dark:text-blue-500 hover:underline">
          Reset
        </a>
      </div>
      {energyData.sources.map((source) => (
        <EnergyEditor
          key={source.key}
          source={source}
          count={userEnergyConfiguration[source.key]?.count || 0}
          sourceKey={source.key}
          onChange={onChangeConfiguration}
          onAtMax={onAtMax}
        />
      ))}
      <div className="flex flex-col justify-end w-full">
        <div className="border-b-2 w-full border-primary mb-2"></div>
        <div className="mb-4 font-semibold flex flex-row justify-between w-full">
          <div>Energy Production Potential</div>
          <div>{`${totals.totalPowerKWh.toLocaleString()} kWh`}</div>
        </div>
        <div className="text-sm italic">
          <Zap className="inline" size={10} /> &nbsp; energy
        </div>
        <Progress
          barColor={totals?.totalPowerKWh >= 30000 ? 'green' : '#e3e32d'}
          className="w-full mb-4"
          value={Math.min((totals?.totalPowerKWh / 30000) * 100, 100)}
        />
        <div className="text-sm italic">
          <PiggyBank className="inline" size={10} /> &nbsp; dollars budget
        </div>
        <Progress
          barColor={totals?.budgetExceeded ? 'red' : tailWindConfig?.theme?.extend?.colors.primary.DEFAULT}
          className="w-full"
          value={Math.min(totals?.budgetPercent || 0, 1) * 100}
        />
        {totals?.errors?.map((error, i) => (
          <Alert variant="destructive" className="mt-3" key={i}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ))}
      </div>
      <GradientDialog
        open={showOverMaxDialog !== null}
        onOpenChange={() => setShowOverMaxDialog(null)}
        title={`${energyData.sources.find((x) => x.key === showOverMaxDialog)?.full_name} Limit Reached`}
      >
        <div className="max-h-[80vh] overflow-auto pt-2">
          <p
            className="whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{
              __html:
                (showOverMaxDialog && totals?.sourceErrors[showOverMaxDialog]?.[0]?.replaceAll('\\n', '<br />')) || '',
            }}
          ></p>
        </div>
      </GradientDialog>
      {/*<Dialog open={showOverMaxDialog !== null} onOpenChange={() => setShowOverMaxDialog(null)}>*/}
      {/*  <DialogContent className="sm:max-w-[60vw]">*/}
      {/*    <DialogHeader>*/}
      {/*      <DialogTitle>*/}
      {/*        {energyData.sources.find((x) => x.key === showOverMaxDialog)?.full_name} Limit Reached*/}
      {/*      </DialogTitle>*/}
      {/*      <div className="max-h-[80vh] overflow-auto pt-2">*/}
      {/*        <p*/}
      {/*          className="whitespace-pre-wrap break-words"*/}
      {/*          dangerouslySetInnerHTML={{*/}
      {/*            __html:*/}
      {/*              (showOverMaxDialog && totals?.sourceErrors[showOverMaxDialog]?.[0]?.replaceAll('\\n', '<br />')) ||*/}
      {/*              '',*/}
      {/*          }}*/}
      {/*        ></p>*/}
      {/*      </div>*/}
      {/*    </DialogHeader>*/}
      {/*  </DialogContent>*/}
      {/*</Dialog>*/}
    </div>
  );
};

export default AppSidebar;
