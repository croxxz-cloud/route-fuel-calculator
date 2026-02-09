export interface RouteVariant {
  name: string;
  via: string[];
  distance: number;
  time: string;
  avgCost: number;
  /** Indices into parent tollSections that apply to this variant */
  tollIndices?: number[];
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
        time: '3 godz. 25 min',
        avgCost: 122,
        tollIndices: [],
      },
      {
        name: 'Trasa przez Łódź i Katowice (A1/A4)',
        via: ['Łódź', 'Piotrków Trybunalski', 'Częstochowa', 'Katowice'],
        distance: 370,
        time: '3 godz. 45 min',
        avgCost: 170,
        tollIndices: [0],
      },
    ],
    hasTolls: true,
    tollSections: [
      { name: 'A4 Katowice–Kraków (Stalexport, tylko wariant przez Łódź)', cost: 17 },
    ],
    description: 'Trasa S7 jest bezpłatna i najkrótsza (295 km). Wariant przez Łódź i Katowice (A1/A4) jest dłuższy (370 km), wolniejszy i z opłatą za A4 Katowice–Kraków.',
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
        time: '3 godz. 50 min',
        avgCost: 140,
        tollIndices: [],
      },
      {
        name: 'Trasa A1 przez Toruń i Łódź',
        via: ['Toruń', 'Łódź', 'Stryków'],
        distance: 475,
        time: '4 godz. 40 min',
        avgCost: 229,
        tollIndices: [0],
      },
    ],
    hasTolls: true,
    tollSections: [
      { name: 'A1 Gdańsk–Toruń (AmberOne, tylko wariant przez A1)', cost: 33 },
    ],
    description: 'S7 jest bezpłatna i najkrótsza (340 km). Wariant przez A1/Łódź jest znacznie dłuższy (475 km), wolniejszy i droższy.',
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
        time: '2 godz.',
        avgCost: 74,
        tollIndices: [],
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
        name: 'Trasa A1 (bezpłatna dla aut osobowych)',
        via: ['Częstochowa', 'Radomsko'],
        distance: 200,
        time: '1 godz. 50 min',
        avgCost: 82,
        tollIndices: [],
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
        avgCost: 178,
        tollIndices: [0],
      },
    ],
    hasTolls: true,
    tollSections: [
      { name: 'A2 odcinek koncesyjny (Poznań–Konin–Stryków)', cost: 50 },
    ],
    description: 'A2 jest najszybsza, ale zawiera płatne odcinki koncesyjne na bramkach.',
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
        tollIndices: [],
      },
      {
        name: 'Trasa przez Kielce (bezpłatna)',
        via: ['Sandomierz', 'Kielce'],
        distance: 290,
        time: '3 godz. 40 min',
        avgCost: 120,
        tollIndices: [],
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
        time: '3 godz. 35 min',
        avgCost: 148,
        tollIndices: [],
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
        time: '2 godz. 10 min',
        avgCost: 82,
        tollIndices: [],
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
        avgCost: 295,
        tollIndices: [0, 1],
      },
    ],
    hasTolls: true,
    tollSections: [
      { name: 'A4 Kraków–Katowice (Stalexport)', cost: 17 },
      { name: 'Winieta czeska (10 dni, od 2026 r.)', cost: 55 },
    ],
    description: 'Na A4 Kraków–Katowice obowiązuje opłata na bramkach. W Czechach wymagana e-winieta.',
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
        time: '5 godz. 40 min',
        avgCost: 321,
        tollIndices: [0, 1],
      },
    ],
    hasTolls: true,
    tollSections: [
      { name: 'A2 Stryków–Konin (odcinek koncesyjny)', cost: 33 },
      { name: 'A2 Konin–Nowy Tomyśl (odcinek koncesyjny)', cost: 53 },
    ],
    description: 'A2 zawiera dwa płatne odcinki koncesyjne. Autostrady w Niemczech są bezpłatne dla aut osobowych.',
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
        time: '4 godz. 50 min',
        avgCost: 303,
        tollIndices: [0, 1, 2],
      },
    ],
    hasTolls: true,
    tollSections: [
      { name: 'A4 Kraków–Katowice (Stalexport)', cost: 17 },
      { name: 'Winieta czeska (10 dni, od 2026 r.)', cost: 55 },
      { name: 'Winieta austriacka (10 dni)', cost: 50 },
    ],
    description: 'Trasa wymaga e-winiety czeskiej i austriackiej. A4 Kraków–Katowice jest płatna na bramkach.',
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
        time: '3 godz. 15 min',
        avgCost: 124,
        tollIndices: [],
      },
    ],
    hasTolls: false,
    tollSections: [],
    description: 'A4 od Wrocławia do granicy jest bezpłatna dla samochodów osobowych. Autostrady w Niemczech również bezpłatne.',
  },
];

export const getRouteBySlug = (slug: string): RouteData | undefined => {
  return routesData.find(route => route.slug === slug);
};
