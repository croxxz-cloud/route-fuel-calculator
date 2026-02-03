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
    defaultFuelPrice: 5.89,
    variants: [
      {
        name: 'Trasa S7 przez Kielce (bezpłatna)',
        via: ['Radom', 'Kielce', 'Jędrzejów'],
        distance: 295,
        time: '3 godz. 40 min',
        avgCost: 122,
      },
      {
        name: 'Trasa przez Łódź i Katowice (A1/A4)',
        via: ['Łódź', 'Piotrków Trybunalski', 'Częstochowa', 'Katowice'],
        distance: 370,
        time: '3 godz. 50 min',
        avgCost: 177,
      },
    ],
    hasTolls: true,
    tollSections: [
      { name: 'A4 Katowice-Kraków (tylko trasa przez Łódź)', cost: 24 },
    ],
    description: 'Trasa S7 jest bezpłatna ale wolniejsza. A1/A4 jest szybsza ale z opłatami.',
  },
  {
    from: 'Gdańsk',
    to: 'Warszawa',
    slug: 'gdansk-warszawa',
    distance: 340,
    defaultConsumption: 7,
    defaultFuelPrice: 5.89,
    variants: [
      {
        name: 'Trasa S7 (bezpłatna)',
        via: ['Elbląg', 'Płońsk'],
        distance: 340,
        time: '4 godz.',
        avgCost: 140,
      },
      {
        name: 'Trasa A1/A2 (z opłatami)',
        via: ['Toruń', 'Łódź'],
        distance: 420,
        time: '4 godz. 15 min',
        avgCost: 210,
      },
    ],
    hasTolls: true,
    tollSections: [
      { name: 'A1 Gdańsk-Toruń (tylko trasa A1/A2)', cost: 30 },
      { name: 'A2 Konin-Łódź (tylko trasa A1/A2)', cost: 36 },
    ],
    description: 'Trasa S7 jest całkowicie bezpłatna. Trasa przez A1/A2 jest dłuższa i zawiera płatne odcinki.',
  },
  {
    from: 'Wrocław',
    to: 'Poznań',
    slug: 'wroclaw-poznan',
    distance: 180,
    defaultConsumption: 7,
    defaultFuelPrice: 5.89,
    variants: [
      {
        name: 'Trasa S5 (bezpłatna)',
        via: ['Rawicz', 'Leszno'],
        distance: 180,
        time: '2 godz. 15 min',
        avgCost: 74,
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
    defaultFuelPrice: 5.89,
    variants: [
      {
        name: 'Trasa A1 (bezpłatna)',
        via: ['Częstochowa', 'Radomsko'],
        distance: 200,
        time: '2 godz.',
        avgCost: 82,
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
    defaultFuelPrice: 5.89,
    variants: [
      {
        name: 'Trasa A2 (z opłatami)',
        via: ['Konin', 'Kutno', 'Łowicz'],
        distance: 310,
        time: '3 godz.',
        avgCost: 164,
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
    defaultFuelPrice: 5.89,
    variants: [
      {
        name: 'Trasa przez Rzeszów (bezpłatna)',
        via: ['Stalowa Wola', 'Rzeszów', 'Tarnów'],
        distance: 340,
        time: '4 godz. 15 min',
        avgCost: 140,
      },
      {
        name: 'Trasa przez Kielce (bezpłatna)',
        via: ['Sandomierz', 'Kielce'],
        distance: 290,
        time: '3 godz. 40 min',
        avgCost: 120,
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
    defaultFuelPrice: 5.89,
    variants: [
      {
        name: 'Trasa S6 (bezpłatna)',
        via: ['Koszalin', 'Słupsk', 'Lębork'],
        distance: 360,
        time: '3 godz. 45 min',
        avgCost: 148,
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
    defaultFuelPrice: 5.89,
    variants: [
      {
        name: 'Trasa S8 (bezpłatna)',
        via: ['Zambrów', 'Ostrów Mazowiecka'],
        distance: 200,
        time: '2 godz. 15 min',
        avgCost: 82,
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
    defaultFuelPrice: 5.89,
    variants: [
      {
        name: 'Trasa przez Katowice i Ostrawę',
        via: ['Katowice', 'Ostrawa', 'Ołomuniec', 'Brno'],
        distance: 540,
        time: '5 godz. 30 min',
        avgCost: 316,
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
    defaultFuelPrice: 5.89,
    variants: [
      {
        name: 'Trasa A2',
        via: ['Poznań', 'Świecko', 'Frankfurt nad Odrą'],
        distance: 570,
        time: '5 godz. 30 min',
        avgCost: 303,
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
    defaultFuelPrice: 5.89,
    variants: [
      {
        name: 'Trasa przez Katowice i Ostrawę',
        via: ['Katowice', 'Ostrawa', 'Brno'],
        distance: 440,
        time: '4 godz. 30 min',
        avgCost: 320,
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
    defaultFuelPrice: 5.89,
    variants: [
      {
        name: 'Trasa A4/A17',
        via: ['Legnica', 'Zgorzelec', 'Görlitz'],
        distance: 300,
        time: '3 godz.',
        avgCost: 162,
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
