import energyData from '@/data/energy-data.json';
import { EnergyData } from '@/app/models/energy-data';

class EnergyDataService {
  getEnergyData(): EnergyData {
    const data = {
      ...energyData,
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
