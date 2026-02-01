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
    distance: 294,
    defaultConsumption: 7,
    defaultFuelPrice: 6.20,
    variants: [
      {
        name: 'Trasa A4/S7',
        via: ['Radom', 'Kielce', 'Jędrzejów'],
        distance: 294,
        time: '3 godz. 30 min',
        avgCost: 128,
      },
      {
        name: 'Trasa przez Łódź (A1/A4)',
        via: ['Łódź', 'Piotrków Trybunalski', 'Częstochowa', 'Katowice'],
        distance: 380,
        time: '4 godz. 15 min',
        avgCost: 165,
      },
    ],
    hasTolls: true,
    tollSections: [
      { name: 'A4 Katowice-Kraków', cost: 24 },
    ],
  },
  {
    from: 'Gdańsk',
    to: 'Warszawa',
    slug: 'gdansk-warszawa',
    distance: 340,
    defaultConsumption: 7,
    defaultFuelPrice: 6.20,
    variants: [
      {
        name: 'Trasa A1/S7',
        via: ['Tczew', 'Grudziądz', 'Płońsk'],
        distance: 340,
        time: '4 godz.',
        avgCost: 148,
      },
      {
        name: 'Trasa przez Toruń',
        via: ['Toruń', 'Włocławek', 'Płock'],
        distance: 365,
        time: '4 godz. 30 min',
        avgCost: 159,
      },
    ],
    hasTolls: false,
    tollSections: [],
  },
  {
    from: 'Wrocław',
    to: 'Poznań',
    slug: 'wroclaw-poznan',
    distance: 166,
    defaultConsumption: 7,
    defaultFuelPrice: 6.20,
    variants: [
      {
        name: 'Trasa S5',
        via: ['Trzebnica', 'Leszno'],
        distance: 166,
        time: '2 godz.',
        avgCost: 72,
      },
    ],
    hasTolls: false,
    tollSections: [],
  },
  {
    from: 'Katowice',
    to: 'Łódź',
    slug: 'katowice-lodz',
    distance: 194,
    defaultConsumption: 7,
    defaultFuelPrice: 6.20,
    variants: [
      {
        name: 'Trasa A1',
        via: ['Częstochowa', 'Radomsko'],
        distance: 194,
        time: '2 godz. 15 min',
        avgCost: 84,
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
    defaultFuelPrice: 6.20,
    variants: [
      {
        name: 'Trasa A2',
        via: ['Konin', 'Kutno', 'Łowicz'],
        distance: 310,
        time: '3 godz. 15 min',
        avgCost: 135,
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
    distance: 280,
    defaultConsumption: 7,
    defaultFuelPrice: 6.20,
    variants: [
      {
        name: 'Trasa przez Rzeszów',
        via: ['Stalowa Wola', 'Rzeszów', 'Tarnów'],
        distance: 320,
        time: '4 godz.',
        avgCost: 139,
      },
      {
        name: 'Trasa przez Kielce',
        via: ['Sandomierz', 'Kielce'],
        distance: 280,
        time: '3 godz. 45 min',
        avgCost: 122,
      },
    ],
    hasTolls: false,
    tollSections: [],
  },
  {
    from: 'Szczecin',
    to: 'Gdańsk',
    slug: 'szczecin-gdansk',
    distance: 350,
    defaultConsumption: 7,
    defaultFuelPrice: 6.20,
    variants: [
      {
        name: 'Trasa S6',
        via: ['Koszalin', 'Słupsk', 'Lębork'],
        distance: 350,
        time: '4 godz. 15 min',
        avgCost: 152,
      },
    ],
    hasTolls: false,
    tollSections: [],
  },
  {
    from: 'Białystok',
    to: 'Warszawa',
    slug: 'bialystok-warszawa',
    distance: 195,
    defaultConsumption: 7,
    defaultFuelPrice: 6.20,
    variants: [
      {
        name: 'Trasa S8',
        via: ['Zambrów', 'Ostrów Mazowiecka'],
        distance: 195,
        time: '2 godz. 15 min',
        avgCost: 85,
      },
    ],
    hasTolls: false,
    tollSections: [],
  },
  {
    from: 'Kraków',
    to: 'Praga',
    slug: 'krakow-praga',
    distance: 535,
    defaultConsumption: 7,
    defaultFuelPrice: 6.20,
    variants: [
      {
        name: 'Trasa przez Katowice i Ostrawa',
        via: ['Katowice', 'Ostrawa', 'Ołomuniec', 'Brno'],
        distance: 535,
        time: '6 godz.',
        avgCost: 233,
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
    distance: 575,
    defaultConsumption: 7,
    defaultFuelPrice: 6.20,
    variants: [
      {
        name: 'Trasa A2',
        via: ['Poznań', 'Świecko', 'Frankfurt nad Odrą'],
        distance: 575,
        time: '6 godz. 30 min',
        avgCost: 250,
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
    distance: 410,
    defaultConsumption: 7,
    defaultFuelPrice: 6.20,
    variants: [
      {
        name: 'Trasa przez Katowice i Ostrawa',
        via: ['Katowice', 'Ostrawa', 'Brno'],
        distance: 410,
        time: '4 godz. 45 min',
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
    distance: 290,
    defaultConsumption: 7,
    defaultFuelPrice: 6.20,
    variants: [
      {
        name: 'Trasa A4/A17',
        via: ['Legnica', 'Zgorzelec', 'Görlitz'],
        distance: 290,
        time: '3 godz. 15 min',
        avgCost: 126,
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
