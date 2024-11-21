import React, { FC } from 'react';
import { UserEnergyConfiguration } from '@/app/contexts/game-context';
import { EnergyData } from '@/app/models/energy-data';
import { CalculatedResponse } from '@/app/services/energy-calculation-service';
import Confetti from 'react-confetti';
import { Button } from '@/components/ui/button';
import { PrinterIcon } from 'lucide-react';

type EnergyReportProps = {
  config: UserEnergyConfiguration;
  energyData: EnergyData;
  totals: CalculatedResponse;
};

const EnergyReport: FC<EnergyReportProps> = ({ energyData, config, totals }) => {
  const sourceKeys = energyData.sources.map((source) => source.key);

  const matchingRegion = energyData.regions.find((region) => sourceKeys.every((x) => config[x].count === region[x]));

  const suppliedCorrectPower = totals.totalPowerKWh >= 30000;
  const budgetExceeded = totals.budgetExceeded;
  return (
    <div className="w-full flex flex-col items-center p-4 mt-2">
      {suppliedCorrectPower ? (
        <div className="border-t border-b py-2 w-[80%]">
          <img alt="successs" src="/icons/electricity.svg" className="inline h-10 mr-4" />
          <span className="italic">Kā rawe!</span> This energy mix successfully powers the marae.
        </div>
      ) : (
        <div className="border-t border-b py-2 w-[80%]">
          <img alt="not-enough" src="/icons/broken-bulb.svg" className="inline h-10 mr-4" />
          <span className="italic"> Kino rawa!</span> You failed to supply enough power and folks are not happy with
          you! Try again.
        </div>
      )}
      <div className="flex flex-col items-start w-[80%] mt-4">
        <ul className="list-disc">
          <li>
            You provided {Math.round((totals.totalPowerKWh / 30000) * 100)}% of your community&apos;s energy needs.
          </li>
          {totals.budgetExceeded ? (
            <li>But your proposed solution is over budget.</li>
          ) : (
            <li>Your proposed solution is within budget.</li>
          )}
        </ul>
        {matchingRegion && (
          <div className="mt-2 pre-formatted" dangerouslySetInnerHTML={{ __html: matchingRegion.description }} />
        )}
      </div>
      <div className="w-full flex flex-row justify-end no-print pb-2">
        <Button className="" onClick={() => window.print()}>
          <PrinterIcon /> Print
        </Button>
      </div>
      {suppliedCorrectPower && !budgetExceeded && (
        <Confetti
          recycle={false}
          numberOfPieces={1000}
          tweenDuration={10000}
          width={window.innerWidth}
          height={window.innerHeight}
        />
      )}
    </div>
  );
};

export default EnergyReport;
