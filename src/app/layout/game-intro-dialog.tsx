import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import MaraeDialog from '@/components/dialog/gradientDialog';
import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { clsx } from 'clsx';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import React, { useEffect } from 'react';
import MaraeHeader from '@/app/layout/marae-header';
import { AlertTriangleIcon, InfoIcon, PlayIcon } from 'lucide-react';

type GameIntroDialogProps = {
  open?: boolean;
  onOpenChange?: () => void;
};

const PowerDescription: React.FC<{ showMaxDisclaimer?: boolean; api?: CarouselApi }> = ({ showMaxDisclaimer, api }) => (
  <div className="flex flex-col">
    <div className="mb-2 text-wrap">
      To provide your community with power, you can install these types of small-scale units:
      <br />
      <br />
      <div className="flex flex-row justify-between">
        <div>
          <div className="text-green-700">
            <span className="font-bold">Renewables</span>
            <ul className="list-disc pl-4">
              <li>Hydroelectric</li>
              <li>Wind</li>
              <li>Geothermal</li>
              <li>Solar</li>
            </ul>
          </div>
          <div className="text-black mt-3">
            <span className="font-bold">Fossil Fuels</span>
            <ul className="list-disc pl-4">
              <li>Fossil Fuels</li>
            </ul>
          </div>
        </div>
        {showMaxDisclaimer && (
          <div className="rounded-2xl border-4 border-green-700 max-w-60 p-2">
            <div className="text-green-700 font-semibold mb-4">
              <AlertTriangleIcon className="inline" />
              You get a max of 4 renewable energy units.
            </div>
            <div>
              This is because renewables are new technologies requiring extra research, training, and infrastructure.
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

const GameIntroDialog: React.FC<GameIntroDialogProps> = ({ open, onOpenChange }) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [currentVideo, setCurrentVideo] = React.useState<{
    description: string;
    url: string;
    thumbnail: string;
  } | null>(null);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleOpenChange = () => {
    setCurrent(0);
    onOpenChange?.();
  };

  useEffect(() => {
    if (!api) {
      return;
    }
    if (currentVideo === null) {
      if (current !== api.selectedScrollSnap() + 1) {
        setTimeout(() => api.scrollTo(current - 1, true), 10);
      }
    }
  }, [currentVideo, api]);

  const setVideo = (video: { description: string; url: string; thumbnail: string } | null) => {
    if (!video) {
      setCurrentVideo(null);
      setTimeout(() => api?.scrollTo(3), 1);
      return;
    }
    setCurrentVideo(video);
  };

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

  const videos = [
    {
      description: 'A personal view into a marae (a spiritual and communal space for Māori communities)',
      url: 'https://www.youtube.com/embed/wND5dxcq7Zw?cc_load_policy=1',
      thumbnail: '/thumbnails/personal_view.png',
    },
    {
      description: 'A marae installs a historic micro-hydroelectric generator (2015)',
      url: 'https://www.youtube.com/embed/z6zbMjMU-TE?cc_load_policy=1',
      thumbnail: '/thumbnails/generator_install.png',
    },
    {
      description: 'Solar panels installed at Ngātira Marae (2023)',
      url: 'https://www.youtube.com/embed/2B5iA3_a4aA?cc_load_policy=1',
      thumbnail: '/thumbnails/solar_panels.png',
    },
  ];

  return (
    <Dialog open={open || false} onOpenChange={onOpenChange}>
      <DialogContent
        className={'sm:max-w-[75vw] border-none px-6 pt-8 pb-6 h-[80%]'}
        style={{
          background: "url('/maori_designs/intro-background_Ariki-Creative.png') no-repeat center / cover",
        }}
      >
        <DialogHeader className="hidden">
          <DialogTitle className="pl-4 pb-1">Welcome to Punahiko Marae!</DialogTitle>
        </DialogHeader>

        {currentVideo ? (
          <div className="w-full h-full pb-20 pt-4 px-4 bg-secondary rounded-sm">
            <iframe className="w-full h-full" src={currentVideo.url} allowFullScreen></iframe>
            <Button className="mt-4" onClick={() => setCurrentVideo(null)}>
              Back
            </Button>
          </div>
        ) : (
          <Card className={clsx('border-black border-2 pt-2 min-h-[50%] my-auto mx-auto max-w-[80%]')}>
            <CardContent>
              <Carousel setApi={setApi} className="w-full max-w-[40rem]">
                <CarouselContent>
                  <CarouselItem>
                    <div className="flex flex-col h-full justify-between">
                      <MaraeHeader />
                      <div className="w-full flex flex-grow justify-end items-end mt-4">
                        <Button variant="default" onClick={() => api?.scrollNext()}>
                          Next
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="flex flex-col h-full justify-between">
                      <div className="flex flex-col items-center">
                        <h1 className="text-4xl font-semibold">Nau mai haere mai!</h1>
                        <h1 className="text-2xl font-light italic">Welcome!</h1>
                      </div>
                      <br />
                      <div className="text-lg">
                        This app puts you in charge of meeting the energy needs of Punahiko Marae, a fictional community
                        inspired by real Māori efforts to generate their own power in Aotearoa New Zealand.
                      </div>
                      <br />
                      <div>
                        <span className="font-bold">
                          Your goal: pick a mix of power sources to provide an annual energy budget of 30,000 kWh
                        </span>
                        &nbsp;(kilowatt-hours, a unit of energy).
                      </div>
                      <br />
                      <div className="w-full flex justify-between flex-grow items-end mt-4 relative pr-4">
                        <Button variant="default" onClick={() => api?.scrollPrev()}>
                          Back
                        </Button>
                        <Button variant="default" onClick={() => api?.scrollNext()}>
                          Next
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>

                  <CarouselItem>
                    <div className="flex flex-col w-full">
                      <h1 className="text-3xl font-light">
                        Learn more about Māori marae and the search for energy independence
                      </h1>
                      {videos.map((video, index) => (
                        <div key={index} className="flex flex-row items-center justify-between w-full">
                          <div>{video.description}</div>
                          <div
                            className="cursor-pointer mb-4 flex justify-center relative items-center align-middle"
                            onClick={() => setCurrentVideo(video)}
                          >
                            <img className="m-w-40 max-w-40 h-auto" alt={video.description} src={video.thumbnail}></img>
                            <PlayIcon className="absolute w-10 h-10 mx-auto text-white" />
                          </div>
                        </div>
                      ))}
                      <div className="w-full flex flex-grow justify-between mt-4 relative pr-4">
                        <Button variant="default" onClick={() => api?.scrollPrev()}>
                          Back
                        </Button>
                        <Button variant="default" onClick={() => api?.scrollNext()}>
                          Next
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="flex flex-col h-full justify-between">
                      <PowerDescription api={api} />
                      <div className="w-full flex justify-between flex-grow items-end mt-4 relative pr-4">
                        <Button variant="default" onClick={() => api?.scrollPrev()}>
                          Back
                        </Button>
                        <Button variant="default" onClick={() => api?.scrollNext()}>
                          Next
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="flex flex-col h-full justify-between">
                      <PowerDescription api={api} showMaxDisclaimer />
                      <div className="w-full flex justify-between flex-grow items-end mt-4 relative pr-4">
                        <Button variant="default" onClick={() => api?.scrollPrev()}>
                          Back
                        </Button>
                        <Button variant="default" onClick={() => api?.scrollNext()}>
                          Next
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="flex flex-col h-full justify-between">
                      <div className="flex flex-col items-center">
                        <h1 className="text-4xl font-semibold">Kia rite!</h1>
                        <h1 className="text-2xl font-light italic">Get ready!</h1>
                      </div>
                      <div className="text-3xl font-bold mt-4 ml-4">
                        <ul className="list-disc pl-4">
                          <li>1. Pick your power mix</li>
                          <li>Click Generate</li>
                          <li>See your results</li>
                          <li>Continue Exploring!</li>
                        </ul>
                      </div>
                      <div className="italic text-lg mt-4">
                        Tip: click the <InfoIcon className="inline" size={16} /> icon to learn more about each power
                        source.
                      </div>
                      <div className="w-full flex justify-between flex-grow items-end mt-4 relative pr-4">
                        <Button variant="default" onClick={() => api?.scrollPrev()}>
                          Back
                        </Button>
                        <Button variant="default" onClick={() => handleOpenChange?.()}>
                          Start
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                </CarouselContent>
              </Carousel>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GameIntroDialog;
