
export enum SeriesType {
  POKEMON = 'Pokemon',
  CHIIKAWA = 'Chiikawa',
  SANRIO = 'Sanrio',
  CAPYBARA = 'Capybara'
}

export interface Prize {
  id: string;
  name: string;
  category: 'multiplier' | 'function' | 'special';
}

export interface CardData {
  id: number;
  series: SeriesType;
  prize: Prize;
  isFlipped: boolean;
}

export interface SeriesConfig {
  name: SeriesType;
  color: string;
  imageUrl: string;
}
