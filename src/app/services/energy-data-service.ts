import energyData from '@/data/energy-data.json';
import { EnergyData } from '@/app/models/energy-data';

class EnergyDataService {
  getEnergyData(): EnergyData {
    const ordered = energyData.scenarioConfiguration.baseImageSrcs.sort((a, b) => a.order - b.order);
    const data = {
      ...energyData,
      scenarioConfiguration: {
        ...energyData.scenarioConfiguration,
        baseImageSrcs: ordered,
      },
      sources: energyData.sources.map((source) => {
        const sortedImageLayers = source.imageLayers.sort((a, b) => a.order - b.order);
        return {
          ...source,
          imageLayers: sortedImageLayers,
        };
      }),
    };

    return data as EnergyData;
  }
}

export const energyDataService = new EnergyDataService();
