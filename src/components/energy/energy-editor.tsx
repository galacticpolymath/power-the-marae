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
  onOverMax: (key: string) => void;
};

const EnergyEditor: FC<EnergyEditorProps> = ({ source, sourceKey, count, onChange, onOverMax }) => {
  const TypeIcon = source.outputType === 'Electricity' ? Zap : Flame;
  const isOverMax = count > source.maxUnits;
  const handleIncrease = () => {
    if (isOverMax) {
      onOverMax(sourceKey);
    } else {
      onChange(sourceKey, count + 1);
    }
  };
  return (
    <div className="w-full flex flex-row justify-between mb-4">
      <div>
        <h3 className="text-xl mb-1">{source.full_name}</h3>
        <h3>
          type: <TypeIcon className="inline" size={12} /> {source.outputType}
        </h3>
        <h3>unit power: {source.unit_kWh.toLocaleString()} kWh</h3>
      </div>
      <div className="flex flex-row justify-between items-center w-32">
        <Button disabled={count === 0} onClick={() => onChange(sourceKey, count - 1)}>
          -
        </Button>
        <h3 className={clsx('text-xl', { 'text-red-500': isOverMax })}>{count}</h3>
        <Button
          className={clsx({ 'bg-red-500': isOverMax, 'hover:bg-red-400': isOverMax })}
          onClick={() => handleIncrease()}
        >
          {isOverMax ? '?' : '+'}
        </Button>
      </div>
    </div>
  );
};

export default EnergyEditor;
