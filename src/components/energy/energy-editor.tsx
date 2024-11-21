import React, { FC } from 'react';
import { Flame, Info, Zap } from 'lucide-react';
import { EnergySource } from '@/app/models/energy-source';
import { Button } from '@/components/ui/button';
import { clsx } from 'clsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type EnergyEditorProps = {
  source: EnergySource;
  sourceKey: string;
  count: number;
  onChange: (key: string, count: number) => void;
  onAtMax: (key: string) => void;
};

const EnergyEditor: FC<EnergyEditorProps> = ({ source, sourceKey, count, onChange, onAtMax }) => {
  const TypeIcon = source.outputType === 'Electricity' ? Zap : Flame;
  const isAtLimit = count >= source.maxUnits;
  const handleIncrease = () => {
    if (isAtLimit) {
      onAtMax(sourceKey);
    } else {
      onChange(sourceKey, count + 1);
    }
  };
  return (
    <div className="w-full flex flex-row justify-between mb-4">
      <div className="flex flex-row items-center">
        <div className="h-[88%] w-[12px] mr-3" style={{ background: source.color }}></div>
        <div>
          <h3 className="text-xl font-light mb-1">
            {source.full_name}{' '}
            <Popover>
              <PopoverTrigger className="inline">
                <Info size={15} className="rounded-full bg-white text-cyan-500 hover:bg-cyan-200 ml-1" />
              </PopoverTrigger>
              <PopoverContent className="max-w-[50rem] bg-primary text-secondary w-[40rem]">
                <p
                  className="text-sm"
                  dangerouslySetInnerHTML={{
                    __html: source.maxUnitExplanation?.replaceAll('\n', '<br />').replaceAll('\\n', '<br />'),
                  }}
                />
              </PopoverContent>
            </Popover>
          </h3>

          <h3>
            type: <TypeIcon className="inline" size={12} /> {source.outputType}
          </h3>
          <h3>unit power: {source.unit_kWh.toLocaleString()} kWh</h3>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center w-32">
        <Button disabled={count === 0} onClick={() => onChange(sourceKey, count - 1)}>
          -
        </Button>
        <h3 className={clsx('text-xl')}>{count}</h3>
        <Button
          className={clsx({ 'bg-blue-700': isAtLimit, 'hover:bg-blue-500': isAtLimit })}
          onClick={() => handleIncrease()}
        >
          {isAtLimit ? '?' : '+'}
        </Button>
      </div>
    </div>
  );
};

export default EnergyEditor;
