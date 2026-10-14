import { FertilizerRecommendation } from '../../types/app.types';

export interface IFertilizerService {
  calculateDosage(
    crop: string,
    areaAcres: number,
    soilType: 'clay' | 'loam' | 'sandy' | 'black_cotton'
  ): FertilizerRecommendation;
}

export class FertilizerService implements IFertilizerService {
  calculateDosage(
    crop: string = 'Tomato',
    areaAcres: number = 1,
    soilType: 'clay' | 'loam' | 'sandy' | 'black_cotton' = 'loam'
  ): FertilizerRecommendation {
    const area = Math.max(0.25, areaAcres);

    // Baseline NPK recommendations per acre in Kg
    let nBaseline = 50;
    let pBaseline = 25;
    let kBaseline = 25;

    if (crop.toLowerCase().includes('tomato') || crop.includes('टमाटर')) {
      nBaseline = 60;
      pBaseline = 35;
      kBaseline = 40;
    } else if (crop.toLowerCase().includes('wheat') || crop.includes('गेहूँ')) {
      nBaseline = 50;
      pBaseline = 25;
      kBaseline = 15;
    } else if (crop.toLowerCase().includes('paddy') || crop.includes('धान')) {
      nBaseline = 55;
      pBaseline = 25;
      kBaseline = 20;
    } else if (crop.toLowerCase().includes('onion') || crop.includes('प्याज')) {
      nBaseline = 45;
      pBaseline = 30;
      kBaseline = 35;
    } else if (crop.toLowerCase().includes('chana') || crop.includes('चना')) {
      // Legumes fix nitrogen
      nBaseline = 10;
      pBaseline = 25;
      kBaseline = 10;
    }

    // Soil type multiplier
    const soilMultiplier = soilType === 'sandy' ? 1.15 : soilType === 'clay' ? 0.95 : 1.0;

    // DAP contains 18% N, 46% P2O5
    // Urea contains 46% N
    // MOP contains 60% K2O
    const dapKg = Math.round((pBaseline / 0.46) * area * soilMultiplier);
    const nFromDap = dapKg * 0.18;
    const remainingN = Math.max(0, nBaseline * area * soilMultiplier - nFromDap);
    const ureaKg = Math.round(remainingN / 0.46);
    const mopKg = Math.round((kBaseline / 0.6) * area * soilMultiplier);
    const zincKg = Math.round(10 * area);

    const ureaBags = Math.ceil(ureaKg / 45); // standard 45kg bag
    const dapBags = Math.ceil(dapKg / 50); // standard 50kg bag
    const mopBags = Math.ceil(mopKg / 50); // standard 50kg bag

    // Estimated costs in INR (subsidized prices approx: Urea ~₹266/bag, DAP ~₹1350/bag, MOP ~₹1700/bag)
    const estimatedCost = ureaBags * 266 + dapBags * 1350 + mopBags * 1700 + Math.round(zincKg * 60);

    return {
      cropName: crop,
      farmAreaAcres: area,
      soilType,
      ureaKg,
      dapKg,
      mopKg,
      zincSulphateKg: zincKg,
      ureaBags,
      dapBags,
      mopBags,
      estimatedCost,
      applicationSchedule: [
        {
          stage: 'Basal Dose (बुवाई/रोपाई के समय)',
          stageHindi: 'बुवाई अथवा रोपाई से पूर्व खेत की अंतिम जुताई में',
          fertilizerDose: `संपूर्ण DAP (${dapKg} किग्रा) + संपूर्ण MOP (${mopKg} किग्रा) + 1/3 यूरिया (${Math.round(ureaKg / 3)} किग्रा)`,
          waterRequirement: 'खेत में पर्याप्त नमी होना अनिवार्य।',
        },
        {
          stage: 'First Top Dressing (20-25 दिन बाद)',
          stageHindi: 'शाखाएं निकलने / कल्ले फूटते समय',
          fertilizerDose: `1/3 यूरिया (${Math.round(ureaKg / 3)} किग्रा) + जिंक सल्फेट (${zincKg} किग्रा)`,
          waterRequirement: 'छिड़काव के पश्चात हल्की सिंचाई करें।',
        },
        {
          stage: 'Second Top Dressing (फूल व फल आते समय)',
          stageHindi: 'फूल खिलने एवं फलियां/दाने बनते समय',
          fertilizerDose: `शेष 1/3 यूरिया (${Math.round(ureaKg / 3)} किग्रा)`,
          waterRequirement: 'मिट्टी में नमी बनाए रखें, तेज धूप में न डालें।',
        },
      ],
    };
  }
}
