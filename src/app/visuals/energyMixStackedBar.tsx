import React from 'react';
import { EnergyData } from '@/app/models/energy-data';
import { UserEnergyConfiguration } from '@/app/contexts/game-context';

export const EnergyMixStackedBar: React.FC<{
  energyData: EnergyData;
  energyConfiguration: UserEnergyConfiguration;
  totalPowerKWh: number;
}> = ({ energyData, energyConfiguration, totalPowerKWh }) => {
  return (
    <div className="flex flex-row w-10/12">
      {energyData.sources
        .map((x, i) =>
          energyConfiguration[x.key].count ? (
            <div
              key={x.key}
              className="flex flex-col"
              style={{
                width: `${Math.round(((energyConfiguration[x.key].count * x.unit_kWh) / totalPowerKWh) * 100)}%`,
              }}
            >
              <div
                className="flex justify-center items-center text-white border-right border-black"
                style={{
                  background: x.color,
                  height: '50px',
                  borderLeft: '1px solid #000',
                  borderTop: '1px solid #000',
                  borderBottom: '1px solid #000',
                  borderRight: i === energyData.sources.length - 1 ? '1px solid #000' : 'none',
                }}
              >
                {Math.round(((energyConfiguration[x.key].count * x.unit_kWh) / totalPowerKWh) * 100)}%
              </div>
              <div className="-rotate-45 w-full flex justify-center mt-10">
                <span>{x.full_name}</span>
              </div>
            </div>
          ) : null,
        )
        .filter((x) => x !== null)}
    </div>
  );
};
