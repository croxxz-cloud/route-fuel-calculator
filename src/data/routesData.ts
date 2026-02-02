export interface RouteVariant {
  name: string;
  via: string[];
  distance: number;
  time: string;
  avgCost: number;
}

export interface TollSection {
  name: string;
  cost: number;
}

export interface RouteData {
  from: string;
  to: string;
  slug: string;
  distance: number;
  defaultConsumption: number;
  defaultFuelPrice: number;
  variants: RouteVariant[];
  hasTolls: boolean;
  tollSections: TollSection[];
  description?: string;
}

export const routesData: RouteData[] = [
  {
    from: 'Warszawa',
    to: 'Kraków',
    slug: 'warszawa-krakow',
    distance: 295,
    defaultConsumption: 7,
    defaultFuelPrice: 5.79,
    variants: [
      {
        name: 'Trasa S7 przez Kielce',
        via: ['Radom', 'Kielce', 'Jędrzejów'],
        distance: 295,
        time: '3 godz. 30 min',
        avgCost: 120,
      },
      {
        name: 'Trasa przez Łódź i Katowice (A1/A4)',
        via: ['Łódź', 'Piotrków Trybunalski', 'Częstochowa', 'Katowice'],
        distance: 370,
        time: '4 godz.',
        avgCost: 150,
      },
    ],
    hasTolls: true,
    tollSections: [
      { name: 'A4 Katowice-Kraków (trasa przez Łódź)', cost: 24 },
    ],
  },
  {
    from: 'Gdańsk',
    to: 'Warszawa',
    slug: 'gdansk-warszawa',
    distance: 340,
    defaultConsumption: 7,
    defaultFuelPrice: 5.79,
    variants: [
      {
        name: 'Trasa S7',
        via: ['Elbląg', 'Płońsk'],
        distance: 340,
        time: '4 godz.',
        avgCost: 138,
      },
      {
        name: 'Trasa A1/A2',
        via: ['Toruń', 'Łódź'],
        distance: 420,
        time: '4 godz. 15 min',
        avgCost: 170,
      },
    ],
    hasTolls: false,
    tollSections: [],
  },
  {
    from: 'Wrocław',
    to: 'Poznań',
    slug: 'wroclaw-poznan',
    distance: 180,
    defaultConsumption: 7,
    defaultFuelPrice: 5.79,
    variants: [
      {
        name: 'Trasa S5',
        via: ['Rawicz', 'Leszno'],
        distance: 180,
        time: '2 godz. 15 min',
        avgCost: 73,
      },
    ],
    hasTolls: false,
    tollSections: [],
  },
  {
    from: 'Katowice',
    to: 'Łódź',
    slug: 'katowice-lodz',
    distance: 200,
    defaultConsumption: 7,
    defaultFuelPrice: 5.79,
    variants: [
      {
        name: 'Trasa A1',
        via: ['Częstochowa', 'Radomsko'],
        distance: 200,
        time: '2 godz.',
        avgCost: 81,
      },
    ],
    hasTolls: false,
    tollSections: [],
  },
  {
    from: 'Poznań',
    to: 'Warszawa',
    slug: 'poznan-warszawa',
    distance: 310,
    defaultConsumption: 7,
    defaultFuelPrice: 5.79,
    variants: [
      {
        name: 'Trasa A2',
        via: ['Konin', 'Kutno', 'Łowicz'],
        distance: 310,
        time: '3 godz.',
        avgCost: 126,
      },
    ],
    hasTolls: true,
    tollSections: [
      { name: 'A2 Konin-Łódź', cost: 36 },
    ],
  },
  {
    from: 'Lublin',
    to: 'Kraków',
    slug: 'lublin-krakow',
    distance: 290,
    defaultConsumption: 7,
    defaultFuelPrice: 5.79,
    variants: [
      {
        name: 'Trasa przez Rzeszów',
        via: ['Stalowa Wola', 'Rzeszów', 'Tarnów'],
        distance: 340,
        time: '4 godz. 30 min',
        avgCost: 138,
      },
      {
        name: 'Trasa przez Kielce',
        via: ['Sandomierz', 'Kielce'],
        distance: 290,
        time: '3 godz. 45 min',
        avgCost: 118,
      },
    ],
    hasTolls: false,
    tollSections: [],
  },
  {
    from: 'Szczecin',
    to: 'Gdańsk',
    slug: 'szczecin-gdansk',
    distance: 360,
    defaultConsumption: 7,
    defaultFuelPrice: 5.79,
    variants: [
      {
        name: 'Trasa S6',
        via: ['Koszalin', 'Słupsk', 'Lębork'],
        distance: 360,
        time: '4 godz.',
        avgCost: 146,
      },
    ],
    hasTolls: false,
    tollSections: [],
  },
  {
    from: 'Białystok',
    to: 'Warszawa',
    slug: 'bialystok-warszawa',
    distance: 200,
    defaultConsumption: 7,
    defaultFuelPrice: 5.79,
    variants: [
      {
        name: 'Trasa S8',
        via: ['Zambrów', 'Ostrów Mazowiecka'],
        distance: 200,
        time: '2 godz. 15 min',
        avgCost: 81,
      },
    ],
    hasTolls: false,
    tollSections: [],
  },
  {
    from: 'Kraków',
    to: 'Praga',
    slug: 'krakow-praga',
    distance: 540,
    defaultConsumption: 7,
    defaultFuelPrice: 5.79,
    variants: [
      {
        name: 'Trasa przez Katowice i Ostrawę',
        via: ['Katowice', 'Ostrawa', 'Ołomuniec', 'Brno'],
        distance: 540,
        time: '5 godz. 30 min',
        avgCost: 220,
      },
    ],
    hasTolls: true,
    tollSections: [
      { name: 'A4 Kraków-Katowice', cost: 24 },
      { name: 'Winieta czeska (10 dni)', cost: 70 },
    ],
  },
  {
    from: 'Warszawa',
    to: 'Berlin',
    slug: 'warszawa-berlin',
    distance: 570,
    defaultConsumption: 7,
    defaultFuelPrice: 5.79,
    variants: [
      {
        name: 'Trasa A2',
        via: ['Poznań', 'Świecko', 'Frankfurt nad Odrą'],
        distance: 570,
        time: '5 godz. 30 min',
        avgCost: 232,
      },
    ],
    hasTolls: true,
    tollSections: [
      { name: 'A2 Konin-Świecko', cost: 68 },
    ],
  },
  {
    from: 'Kraków',
    to: 'Wiedeń',
    slug: 'krakow-wieden',
    distance: 440,
    defaultConsumption: 7,
    defaultFuelPrice: 5.79,
    variants: [
      {
        name: 'Trasa przez Katowice i Ostrawę',
        via: ['Katowice', 'Ostrawa', 'Brno'],
        distance: 440,
        time: '5 godz.',
        avgCost: 178,
      },
    ],
    hasTolls: true,
    tollSections: [
      { name: 'A4 Kraków-Katowice', cost: 24 },
      { name: 'Winieta czeska (10 dni)', cost: 70 },
      { name: 'Winieta austriacka (10 dni)', cost: 45 },
    ],
  },
  {
    from: 'Wrocław',
    to: 'Drezno',
    slug: 'wroclaw-drezno',
    distance: 300,
    defaultConsumption: 7,
    defaultFuelPrice: 5.79,
    variants: [
      {
        name: 'Trasa A4/A17',
        via: ['Legnica', 'Zgorzelec', 'Görlitz'],
        distance: 300,
        time: '3 godz.',
        avgCost: 122,
      },
    ],
    hasTolls: true,
    tollSections: [
      { name: 'A4 Wrocław-Zgorzelec', cost: 38 },
    ],
  },
];

export const getRouteBySlug = (slug: string): RouteData | undefined => {
  return routesData.find(route => route.slug === slug);
};
