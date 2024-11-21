import React from 'react';
import { EnergyData } from '@/app/models/energy-data';
import { UserEnergyConfiguration } from '@/app/contexts/game-context';

export const EnergyMixStackedBar: React.FC<{
  energyData: EnergyData;
  energyConfiguration: UserEnergyConfiguration;
  totalPowerKWh: number;
}> = ({ energyData, energyConfiguration, totalPowerKWh }) => {
  const presentSources = energyData.sources.filter((x) => energyConfiguration[x.key].count > 0);
  return (
    <div id="stacked-bar" className="flex flex-row w-full">
      {presentSources.map((x, i) => (
        <div
          key={x.key}
          className="flex flex-col"
          style={{
            width: `${Math.round(((energyConfiguration[x.key].count * x.unit_kWh) / totalPowerKWh) * 100)}%`,
          }}
        >
          <div
            className={`flex justify-center items-center text-white border-right border-black bg-${x.key.toLowerCase()}-img`}
            style={{
              height: '50px',
              borderLeft: '1px solid #000',
              borderTop: '1px solid #000',
              borderBottom: '1px solid #000',
              borderRight: i === presentSources.length - 1 ? '1px solid #000' : 'none',
            }}
          >
            {Math.round(((energyConfiguration[x.key].count * x.unit_kWh) / totalPowerKWh) * 100)}%
          </div>
          <div className="-rotate-45 w-full flex justify-center mt-10">
            <div className="flex flex-col items-center">
              <div>{x.full_name}</div>
              <div>({energyConfiguration[x.key].count})</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
