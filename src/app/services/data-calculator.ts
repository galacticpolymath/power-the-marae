import { EnergyData } from '@/app/models/energy-data';
import { UserEnergyConfiguration } from '@/app/contexts/game-context';
import { EnergyCircle } from '@/app/models/energy-circle';

const EPSILON = 0.0001;
export type CalculatedResponse = {
  totalPowerKWh: number;
  budgetPercent: number;
  budgetExceeded: boolean;
  errors: string[];
  sourceErrors: { [key: string]: string[] };
};
export class DataCalculator {
  calculateTotals(data: EnergyData, userConfiguration: UserEnergyConfiguration): CalculatedResponse {
    if (!data || !userConfiguration) {
      return {
        totalPowerKWh: 0,
        budgetPercent: 0,
        errors: [],
        sourceErrors: {},
        budgetExceeded: false,
      };
    }
    let totalPowerKWh = 0;
    let budgetPercent = 0;

    const categorySummaries = data.scenarioConfiguration.categoryRules.map((x) => ({
      category: x.category,
      userTotal: 0,
      maxTotal: x.maxUnits,
      percentContribution: x.percentContribution,
      exceedMaximumError: x.exceedMaximumError,
    }));
    const sourceErrors: { [key: string]: string[] } = {};
    for (const sources of data.sources) {
      const userSourceConfig = userConfiguration[sources.key];
      if (userSourceConfig) {
        totalPowerKWh += sources.unit_kWh * userSourceConfig.count;
        const category = categorySummaries.find((x) => x.category === sources.category);
        if (category) {
          category.userTotal += userSourceConfig.count;
          budgetPercent += category.percentContribution * userSourceConfig.count;
        }
        if (userSourceConfig.count >= sources.maxUnits) {
          sourceErrors[sources.key] = sourceErrors[sources.key] || [];
          sourceErrors[sources.key].push(sources.maxUnitExplanation);
        }
      }
    }
    let errors = [];
    const budgetExceeded = budgetPercent - 1 > EPSILON;
    if (budgetExceeded) {
      errors.push('You have exceeded the dollars budget');
    }
    errors = [...errors, ...categorySummaries.filter((x) => x.userTotal > x.maxTotal).map((x) => x.exceedMaximumError)];
    return {
      totalPowerKWh,
      budgetPercent,
      errors: errors,
      sourceErrors,
      budgetExceeded,
    };
  }

  getImagesToRender(data: EnergyData, userConfiguration: UserEnergyConfiguration): string[] {
    if (!data || !userConfiguration) {
      return [];
    }
    return data.sources
      .map((source) => {
        const userSourceConfig = userConfiguration[source.key];
        if (userSourceConfig && userSourceConfig.count > 0) {
          let maxIndex = Math.min(userSourceConfig.count, source.imageLayers.length);
          let minIndex = 0;
          switch (source.imageSelector) {
            case 'last-by-seven':
              maxIndex = userSourceConfig.count <= 7 ? 1 : Math.floor(userSourceConfig.count / 7.0);
              minIndex = Math.max(maxIndex - 1, 0);
              break;
            default:
              break;
          }
          return source.imageLayers.slice(minIndex, maxIndex).map((x) => x.src);
        }
        return [];
      })
      .flat();
  }

  getCircles(
    energyData: EnergyData,
    energyConfiguration: UserEnergyConfiguration,
  ): (EnergyCircle & { color: string })[] {
    return energyData.sources
      .map((source) => {
        const userSourceConfig = energyConfiguration[source.key];
        if (userSourceConfig && userSourceConfig.count > 0) {
          return [{ ...source.circle, color: source.color }];
        }
        return [];
      })
      .flat();
  }
}

export const dataCalculator = new DataCalculator();
