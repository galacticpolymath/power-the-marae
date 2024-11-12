import { Button } from '@/components/ui/button';
import { Carousel } from '@/components/ui/carousel';
import GradientDialog from '@/components/dialog/gradientDialog';

type GameIntroDialogProps = {
  open?: boolean;
  onOpenChange?: () => void;
};

const GameIntroDialog: React.FC<GameIntroDialogProps> = ({ open, onOpenChange }) => {
  const energySources = [
    {
      title: 'Hydroelectric Turbines',
      description: 'Install turbines on the river to generate sustainable power from flowing water.',
    },
    {
      title: 'Solar Panels',
      description: 'Install solar panels on rooftops to harness energy from the sun.',
    },
    {
      title: 'Wind Turbines',
      description: 'Place turbines on a nearby hill to capture wind energy.',
    },
    {
      title: 'Passive Geothermal Heating',
      description: 'Use geothermal heating for efficient and stable heating in living areas.',
    },
    {
      title: 'Natural Gas',
      description: 'A tank is available for natural gas deliveries as a backup energy source.',
    },
  ];

  return (
    <GradientDialog title="Welcome to Punahiko Marae!" open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col">
        <div className="mb">
          You’ve been hired as a consultant to suggest an off-the-grid power mix to meet this fictional marae’s energy
          demands.
          <br />
          <br />
          This community’s annual energy budget is 30,000 kWh, and resources are plentiful! Hydroelectric turbines could
          be installed on the river, solar panels could be installed on several buildings’ rooftops, wind turbines could
          be installed on a nearby hill, and passive geothermal heating could be installed for the living areas. There
          is also a tank to receive deliveries of natural gas. Due to the research and resources required to add a new
          type of energy source, the marae can only afford up to 4 renewable energy units total.
          <br />
          <br />
          Let’s get to work to find a mix of energy sources that will be resilient in the case of outages or bad
          weather!
        </div>
        <div className="w-full flex justify-end mt-4">
          <Button variant="default" onClick={() => onOpenChange?.()}>
            Start
          </Button>
        </div>
      </div>
    </GradientDialog>
  );
};

export default GameIntroDialog;
