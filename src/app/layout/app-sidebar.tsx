import React, { useContext, useEffect, useState } from 'react';

import { GameContext } from '@/app/contexts/game-context';
import { EnergyData } from '@/app/models/energy-data';
import EnergyEditor from '@/components/energy/energy-editor';
import { Progress } from '@/components/ui/progress';
import { dataService } from '@/app/services/data-service';
import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import tailWindConfig from '@/../tailwind.config';

const AppSidebar = () => {
  const { userEnergyConfiguration, setUserEnergyConfiguration, resetSources, totals } = useContext(GameContext);
  const [energyData, _] = useState<EnergyData>(dataService.getEnergyData());
  const [showOverMaxDialog, setShowOverMaxDialog] = useState<string | null>(null);
  useEffect(() => {
    resetSources();
  }, []);

  const onChangeConfiguration = (key: string, count: number) => {
    setUserEnergyConfiguration({ ...userEnergyConfiguration, [key]: { ...userEnergyConfiguration[key], count } });
  };

  const onOverMax = (key: string) => {
    setShowOverMaxDialog(key);
  };
  if (!energyData) {
    return;
  }
  return (
    <div className="bg-gray-100 h-screen w-1/4 min-w-96 pr-4 pt-4">
      <div className="flex flex-row justify-between items-end">
        <h2>Energy Sources</h2>
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
          onOverMax={onOverMax}
        />
      ))}
      <div className="flex flex-col justify-end w-full">
        <div className="text-xs italic">dollars budget</div>
        <Progress
          barColor={totals?.budgetExceeded ? 'red' : tailWindConfig?.theme?.extend?.colors.primary.DEFAULT}
          className="w-full"
          value={Math.min(totals?.budgetPercent || 0, 1) * 100}
        />
        {totals?.errors?.map((error, i) => (
          <React.Fragment key={i}>
            <div key={i} className="text-red-500">
              {error}
            </div>
            <br />
          </React.Fragment>
        ))}
      </div>
      <Dialog open={showOverMaxDialog !== null} onOpenChange={() => setShowOverMaxDialog(null)}>
        <DialogContent className="sm:max-w-[60vw]">
          <DialogHeader>
            <DialogTitle>
              {energyData.sources.find((x) => x.key === showOverMaxDialog)?.full_name} Limit Reached
            </DialogTitle>
            <div className="max-h-[80vh] overflow-auto">
              <pre
                className="whitespace-pre-wrap break-words"
                dangerouslySetInnerHTML={{
                  __html:
                    (showOverMaxDialog && totals?.sourceErrors[showOverMaxDialog]?.[0]?.replaceAll('\\n', '<br />')) ||
                    '',
                }}
              ></pre>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppSidebar;
