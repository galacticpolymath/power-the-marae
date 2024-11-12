import React, { FC } from 'react';
import { Flame, Zap } from 'lucide-react';
import { EnergySource } from '@/app/models/energy-source';
import { Button } from '@/components/ui/button';
import { clsx } from 'clsx';

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
      <div>
        <h3 className="text-xl font-light mb-1">{source.full_name}</h3>
        <h3>
          type: <TypeIcon className="inline" size={12} /> {source.outputType}
        </h3>
        <h3>unit power: {source.unit_kWh.toLocaleString()} kWh</h3>
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
