/**
 * Build-time prerendering script — pure Node.js, NO Puppeteer.
 *
 * Reads dist/index.html (Vite output) and creates per-route HTML files
 * with full SEO content injected: <title>, <meta>, <h1>, headings,
 * FAQ, structured data (JSON-LD), and key body text visible to crawlers.
 *
 * Usage: npx vite build && npx tsx scripts/prerender.ts
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distPath = join(__dirname, '..', 'dist');

// ── Route data (mirrors src/data/routesData.ts) ──────────────────────────

interface TollSection { name: string; cost: number; }
interface RouteVariant { name: string; via: string[]; distance: number; time: string; avgCost: number; tollIndices?: number[]; }
interface RouteData {
  from: string; to: string; slug: string; distance: number;
  defaultConsumption: number; defaultFuelPrice: number;
  variants: RouteVariant[]; hasTolls: boolean; tollSections: TollSection[];
  description?: string;
}

const routesData: RouteData[] = [
  { from:'Warszawa',to:'Kraków',slug:'warszawa-krakow',distance:295,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa S7 przez Kielce (bezpłatna)',via:['Radom','Kielce','Jędrzejów'],distance:295,time:'3 godz. 25 min',avgCost:122,tollIndices:[]},{name:'Trasa przez Łódź i Katowice (A1/A4)',via:['Łódź','Piotrków Trybunalski','Częstochowa','Katowice'],distance:370,time:'3 godz. 45 min',avgCost:170,tollIndices:[0]}],hasTolls:true,tollSections:[{name:'A4 Katowice–Kraków (Stalexport, tylko wariant przez Łódź)',cost:17}],description:'Trasa S7 jest bezpłatna i najkrótsza (295 km). Wariant przez Łódź i Katowice (A1/A4) jest dłuższy (370 km), wolniejszy i z opłatą za A4 Katowice–Kraków.' },
  { from:'Gdańsk',to:'Warszawa',slug:'gdansk-warszawa',distance:340,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa S7 (bezpłatna)',via:['Elbląg','Płońsk'],distance:340,time:'3 godz. 50 min',avgCost:140,tollIndices:[]},{name:'Trasa A1 przez Toruń i Łódź',via:['Toruń','Łódź','Stryków'],distance:475,time:'4 godz. 40 min',avgCost:229,tollIndices:[0]}],hasTolls:true,tollSections:[{name:'A1 Gdańsk–Toruń (AmberOne, tylko wariant przez A1)',cost:33}],description:'S7 jest bezpłatna i najkrótsza (340 km). Wariant przez A1/Łódź jest znacznie dłuższy (475 km), wolniejszy i droższy.' },
  { from:'Wrocław',to:'Poznań',slug:'wroclaw-poznan',distance:180,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa S5 (bezpłatna)',via:['Rawicz','Leszno'],distance:180,time:'2 godz.',avgCost:74,tollIndices:[]}],hasTolls:false,tollSections:[] },
  { from:'Katowice',to:'Łódź',slug:'katowice-lodz',distance:200,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa A1 (bezpłatna dla aut osobowych)',via:['Częstochowa','Radomsko'],distance:200,time:'1 godz. 50 min',avgCost:82,tollIndices:[]}],hasTolls:false,tollSections:[] },
  { from:'Poznań',to:'Warszawa',slug:'poznan-warszawa',distance:310,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa A2 (z opłatami)',via:['Konin','Kutno','Łowicz'],distance:310,time:'3 godz.',avgCost:178,tollIndices:[0]}],hasTolls:true,tollSections:[{name:'A2 odcinek koncesyjny (Poznań–Konin–Stryków)',cost:50}],description:'A2 jest najszybsza, ale zawiera płatne odcinki koncesyjne na bramkach.' },
  { from:'Lublin',to:'Kraków',slug:'lublin-krakow',distance:290,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa przez Rzeszów (bezpłatna)',via:['Stalowa Wola','Rzeszów','Tarnów'],distance:340,time:'4 godz. 15 min',avgCost:140,tollIndices:[]},{name:'Trasa przez Kielce (bezpłatna)',via:['Sandomierz','Kielce'],distance:290,time:'3 godz. 40 min',avgCost:120,tollIndices:[]}],hasTolls:false,tollSections:[] },
  { from:'Szczecin',to:'Gdańsk',slug:'szczecin-gdansk',distance:360,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa S6 (bezpłatna)',via:['Koszalin','Słupsk','Lębork'],distance:360,time:'3 godz. 35 min',avgCost:148,tollIndices:[]}],hasTolls:false,tollSections:[] },
  { from:'Białystok',to:'Warszawa',slug:'bialystok-warszawa',distance:200,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa S8 (bezpłatna)',via:['Zambrów','Ostrów Mazowiecka'],distance:200,time:'2 godz. 10 min',avgCost:82,tollIndices:[]}],hasTolls:false,tollSections:[] },
  { from:'Kraków',to:'Praga',slug:'krakow-praga',distance:540,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa przez Katowice i Ostrawę',via:['Katowice','Ostrawa','Ołomuniec','Brno'],distance:540,time:'5 godz. 30 min',avgCost:295,tollIndices:[0,1]}],hasTolls:true,tollSections:[{name:'A4 Kraków–Katowice (Stalexport)',cost:17},{name:'Winieta czeska (10 dni, od 2026 r.)',cost:55}],description:'Na A4 Kraków–Katowice obowiązuje opłata na bramkach. W Czechach wymagana e-winieta.' },
  { from:'Warszawa',to:'Berlin',slug:'warszawa-berlin',distance:570,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa A2',via:['Poznań','Świecko','Frankfurt nad Odrą'],distance:570,time:'5 godz. 40 min',avgCost:321,tollIndices:[0,1]}],hasTolls:true,tollSections:[{name:'A2 Stryków–Konin (odcinek koncesyjny)',cost:33},{name:'A2 Konin–Nowy Tomyśl (odcinek koncesyjny)',cost:53}],description:'A2 zawiera dwa płatne odcinki koncesyjne. Autostrady w Niemczech są bezpłatne dla aut osobowych.' },
  { from:'Kraków',to:'Wiedeń',slug:'krakow-wieden',distance:440,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa przez Katowice i Ostrawę',via:['Katowice','Ostrawa','Brno'],distance:440,time:'4 godz. 50 min',avgCost:303,tollIndices:[0,1,2]}],hasTolls:true,tollSections:[{name:'A4 Kraków–Katowice (Stalexport)',cost:17},{name:'Winieta czeska (10 dni, od 2026 r.)',cost:55},{name:'Winieta austriacka (10 dni)',cost:50}],description:'Trasa wymaga e-winiety czeskiej i austriackiej. A4 Kraków–Katowice jest płatna na bramkach.' },
  { from:'Wrocław',to:'Drezno',slug:'wroclaw-drezno',distance:300,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa A4/A17',via:['Legnica','Zgorzelec','Görlitz'],distance:300,time:'3 godz. 15 min',avgCost:124,tollIndices:[]}],hasTolls:false,tollSections:[],description:'A4 od Wrocławia do granicy jest bezpłatna dla samochodów osobowych. Autostrady w Niemczech również bezpłatne.' },
  { from:'Kraków',to:'Katowice',slug:'krakow-katowice',distance:80,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa A4 (z opłatą)',via:['Chrzanów','Mysłowice'],distance:80,time:'1 godz. 5 min',avgCost:50,tollIndices:[0]},{name:'Trasa DK94 (bezpłatna)',via:['Trzebinia','Jaworzno'],distance:85,time:'1 godz. 30 min',avgCost:35,tollIndices:[]}],hasTolls:true,tollSections:[{name:'A4 Kraków–Katowice (Stalexport)',cost:17}],description:'A4 jest najszybsza, ale płatna (17 zł). DK94 jest bezpłatna, lecz wolniejsza.' },
  { from:'Poznań',to:'Wrocław',slug:'poznan-wroclaw',distance:180,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa S5 (bezpłatna)',via:['Leszno','Rawicz'],distance:180,time:'2 godz.',avgCost:74,tollIndices:[]}],hasTolls:false,tollSections:[] },
  { from:'Warszawa',to:'Gdańsk',slug:'warszawa-gdansk',distance:340,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa S7 (bezpłatna)',via:['Płońsk','Elbląg'],distance:340,time:'3 godz. 50 min',avgCost:140,tollIndices:[]},{name:'Trasa A1 przez Łódź i Toruń',via:['Stryków','Łódź','Toruń'],distance:475,time:'4 godz. 40 min',avgCost:229,tollIndices:[0]}],hasTolls:true,tollSections:[{name:'A1 Gdańsk–Toruń (AmberOne, tylko wariant przez A1)',cost:33}],description:'S7 jest bezpłatna i najkrótsza (340 km). Wariant przez A1/Łódź jest dłuższy (475 km), wolniejszy i droższy.' },
];

// ── FAQ data (mirrors src/components/FAQ.tsx) ────────────────────────────

const faqItems = [
  { question: 'Jak działa kalkulator kosztów przejazdu?', answer: 'Wpisujesz skąd jedziesz i dokąd — kalkulator wyznacza realną trasę drogową i na tej podstawie oblicza, ile paliwa zużyjesz i ile to będzie kosztować. Możesz też ręcznie wpisać dystans, jeśli go znasz. Uwzględniamy różne rodzaje paliwa (Pb95, Pb98, Diesel, LPG) oraz opłaty za autostrady.' },
  { question: 'Czy muszę znać spalanie swojego auta?', answer: 'Nie musisz — mamy podpowiedź „Nie wiesz ile pali?", która pozwala wybrać typ auta (małe, kompakt, SUV itd.), a kalkulator sam dobierze typowe spalanie. Wartości są automatycznie przeliczane w zależności od wybranego paliwa — np. na LPG spalanie jest wyższe o ok. 20%.' },
  { question: 'Czy wynik uwzględnia opłaty za autostrady?', answer: 'Tak, ale musisz je wpisać osobno w polu „Opłaty drogowe". Dla popularnych tras (np. Warszawa–Kraków, Poznań–Warszawa) pokazujemy konkretne kwoty za płatne odcinki, żebyś wiedział ile doliczyć. Opłaty są wyraźnie wyszczególnione w wyniku.' },
  { question: 'Co oznacza opcja „w obie strony"?', answer: 'Po włączeniu tego przełącznika kalkulator automatycznie podwaja dystans i oblicza łączny koszt przejazdu tam i z powrotem. W wyniku jest to wyraźnie oznaczone, więc od razu wiesz, czy patrzysz na koszt jednej trasy czy dwóch.' },
  { question: 'Skąd bierzecie ceny paliw?', answer: 'Korzystamy ze średnich cen rynkowych aktualizowanych co miesiąc. Ceny wyświetlane w kalkulatorze to orientacyjne średnie krajowe — na konkretnej stacji mogą się nieznacznie różnić. Zawsze możesz wpisać własną cenę, jeśli znasz aktualną cenę na swojej stacji.' },
  { question: 'Czy mogę porównać koszty różnych paliw?', answer: 'Tak! Po obliczeniu kosztu kalkulator automatycznie pokazuje porównanie kosztów przejazdu tą samą trasą na Pb95, Pb98, Dieslu i LPG — z uwzględnieniem typowych różnic w spalaniu między tymi paliwami. Dzięki temu od razu widzisz, które paliwo wychodzi najtaniej.' },
];

// ── Helpers ──────────────────────────────────────────────────────────────

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Injects SEO content into the SPA shell HTML.
 * Replaces <title>, adds <meta>, injects visible content into <div id="root">,
 * and adds JSON-LD structured data.
 */
function injectSeo(
  shell: string,
  opts: {
    title: string;
    description: string;
    canonical: string;
    bodyHtml: string;
    jsonLd?: object[];
  }
): string {
  let html = shell;

  // Replace <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(opts.title)}</title>`);

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${escapeHtml(opts.description)}"`
  );

  // Replace og:title and og:description
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${escapeHtml(opts.title)}"`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${escapeHtml(opts.description)}"`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${escapeHtml(opts.title)}"`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${escapeHtml(opts.description)}"`
  );

  // Add/replace canonical
  if (html.includes('<link rel="canonical"')) {
    html = html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${opts.canonical}"`);
  } else {
    html = html.replace('</head>', `  <link rel="canonical" href="${opts.canonical}" />\n  </head>`);
  }

  // Add base styles for static shell — matches app's font/colors to minimize layout shift
  if (!html.includes('.static-shell')) {
    html = html.replace('</head>', `  <style>.static-shell{font-family:Inter,system-ui,sans-serif;color:hsl(0 0% 10%);max-width:72rem;margin:0 auto;padding:1rem 1rem 2rem;line-height:1.6}.static-shell h1{font-size:1.75rem;font-weight:700;margin:0.5rem 0}.static-shell h2{font-size:1.25rem;font-weight:600;margin:1.5rem 0 0.5rem}.static-shell h3{font-size:1rem;font-weight:600;margin:1rem 0 0.25rem}.static-shell p{margin:0.25rem 0;color:hsl(0 0% 38%)}.static-shell a{color:hsl(0 85% 45%);text-decoration:none}.static-shell nav ul{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:0.5rem}.static-shell table{width:100%;border-collapse:collapse;margin:0.5rem 0}.static-shell th,.static-shell td{text-align:left;padding:0.35rem 0.75rem;border-bottom:1px solid hsl(0 0% 88%)}.static-shell footer{margin-top:2rem;padding-top:1rem;border-top:1px solid hsl(0 0% 88%);font-size:0.85rem;color:hsl(0 0% 38%)}</style>\n  </head>`);
  }

  // Inject static HTML into <div id="root"> — visible to users AND crawlers.
  // React's createRoot replaces this content once JS loads (SSG pattern).
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"><div class="static-shell">${opts.bodyHtml}</div></div>`
  );

  // Add JSON-LD scripts before </body>
  if (opts.jsonLd && opts.jsonLd.length > 0) {
    const scripts = opts.jsonLd
      .map(ld => `<script type="application/ld+json">${JSON.stringify(ld)}</script>`)
      .join('\n');
    html = html.replace('</body>', `${scripts}\n</body>`);
  }

  return html;
}

// ── Navigation HTML (shared across all pages) ───────────────────────────

function navHtml(): string {
  const links = routesData.map(r =>
    `<li><a href="/trasa/${r.slug}">${r.from} – ${r.to} (${r.distance} km)</a></li>`
  ).join('');
  return `<nav aria-label="Popularne trasy"><ul>${links}<li><a href="/kontakt">Kontakt</a></li><li><a href="/polityka-prywatnosci">Polityka prywatności</a></li><li><a href="/regulamin">Regulamin</a></li></ul></nav>`;
}

function footerHtml(): string {
  return `<footer><p>© 2026 Trasomat.pl</p><nav><a href="/kontakt">Kontakt</a> | <a href="/polityka-prywatnosci">Polityka prywatności</a> | <a href="/regulamin">Regulamin</a></nav><p>Dane tras: © OpenStreetMap contributors. Wyniki są szacunkowe.</p></footer>`;
}

// ── Page-specific SEO content builders ───────────────────────────────────

function buildHomePage(shell: string): string {
  const faqHtml = faqItems.map(f => `<div><h3>${escapeHtml(f.question)}</h3><p>${escapeHtml(f.answer)}</p></div>`).join('');

  const bodyHtml = `
<header>${navHtml()}</header>
<main>
  <h1>Kalkulator kosztów paliwa na trasie</h1>
  <p>Podaj spalanie auta, a obliczymy ile zapłacisz za paliwo w podróży.</p>

  <section aria-label="Kalkulator kosztów przejazdu">
    <h2>Kalkulator paliwa online</h2>
    <form aria-label="Oblicz koszt przejazdu">
      <fieldset>
        <legend>Tryb kalkulacji</legend>
        <label><input type="radio" name="mode" value="route" checked /> Trasa A → B (automatycznie wyznacz dystans)</label>
        <label><input type="radio" name="mode" value="distance" /> Własny dystans (podaj kilometry ręcznie)</label>
      </fieldset>

      <fieldset>
        <legend>Punkty trasy</legend>
        <label>Skąd: <input type="text" placeholder="np. Warszawa" /></label>
        <label>Dokąd: <input type="text" placeholder="np. Kraków" /></label>
      </fieldset>

      <fieldset>
        <legend>Tryb: Wpisz dystans</legend>
        <p>Jeśli znasz dokładny dystans, możesz go wpisać ręcznie zamiast korzystać z automatycznego wyznaczania trasy. Idealne, gdy planujesz drogę po mapie lub znasz odległość z licznika.</p>
        <label>Dystans (km): <input type="number" placeholder="np. 350" min="1" step="1" /></label>
      </fieldset>

      <fieldset>
        <legend>Typ pojazdu</legend>
        <label><input type="radio" name="vehicle" value="fuel" checked /> Samochód spalinowy</label>
        <label><input type="radio" name="vehicle" value="electric" /> Samochód elektryczny</label>
      </fieldset>

      <fieldset>
        <legend>Tryb: Samochód elektryczny (EV)</legend>
        <p>Kalkulator obsługuje również samochody elektryczne. Zamiast spalania w litrach na 100 km podajesz zużycie energii w kWh/100 km (typowo 15–25 kWh) oraz cenę prądu za kWh. Możesz porównać, czy przejazd autem elektrycznym jest tańszy niż spalinowym.</p>
        <label>Zużycie energii (kWh/100km): <input type="number" value="18" min="5" max="50" step="0.1" /></label>
        <label>Cena prądu (zł/kWh): <input type="number" value="0.89" min="0.1" max="5" step="0.01" /></label>
        <p>Ceny orientacyjne: ładowarka DC (szybka): 1–2 zł/kWh, ładowanie w domu: ok. 0,65 zł/kWh.</p>
      </fieldset>

      <fieldset>
        <legend>Tryb: Samochód spalinowy</legend>
        <p>Kalkulator obsługuje cztery rodzaje paliw: Pb95, Pb98, Diesel (ON) i LPG. Dla każdego typu paliwa automatycznie dobierana jest aktualna średnia cena rynkowa. Spalanie na LPG jest wyższe o ok. 20% niż na benzynie, ale cena litra jest o ponad połowę niższa. Diesel zużywa ok. 5% mniej paliwa niż benzyna.</p>
        <label><input type="radio" name="fuel" value="pb95" checked /> Pb95</label>
        <label><input type="radio" name="fuel" value="pb98" /> Pb98</label>
        <label><input type="radio" name="fuel" value="diesel" /> Diesel (ON)</label>
        <label><input type="radio" name="fuel" value="lpg" /> LPG</label>
      </fieldset>

      <label>Spalanie (l/100 km): <input type="number" value="7" min="1" max="30" step="0.1" /></label>
      <label>Cena paliwa (zł/l): <input type="number" value="5.89" min="0.5" max="15" step="0.01" /></label>

      <fieldset>
        <legend>Opcje dodatkowe</legend>
        <label><input type="checkbox" name="roundtrip" /> Przejazd w obie strony (podwaja dystans)</label>
        <label>Opłaty drogowe (zł): <input type="number" value="0" min="0" step="1" /></label>
        <label>Podziel koszt na pasażerów: <input type="number" value="1" min="1" max="20" /></label>
      </fieldset>

      <button type="submit">Policz koszt trasy</button>
    </form>

    <div aria-label="Przykładowy wynik kalkulacji">
      <h3>Wynik kalkulacji</h3>
      <ul>
        <li>Koszt przejazdu: obliczany automatycznie w zł</li>
        <li>Dystans trasy: na podstawie realnej trasy drogowej</li>
        <li>Szacowany czas przejazdu</li>
        <li>Zużycie paliwa w litrach lub energii w kWh</li>
        <li>Porównanie kosztów: Pb95 vs Pb98 vs Diesel vs LPG</li>
        <li>Porównanie: samochód spalinowy vs elektryczny</li>
      </ul>
    </div>

    <h3>Aktualne średnie ceny paliw w Polsce (luty 2026)</h3>
    <table>
      <thead><tr><th>Paliwo</th><th>Cena za litr</th></tr></thead>
      <tbody>
        <tr><td>Pb95</td><td>5,89 zł/l</td></tr>
        <tr><td>Pb98</td><td>6,58 zł/l</td></tr>
        <tr><td>Diesel (ON)</td><td>5,82 zł/l</td></tr>
        <tr><td>LPG</td><td>2,62 zł/l</td></tr>
      </tbody>
    </table>
  </section>

  <section>
    <h2>Trasomat w pigułce, czyli jak liczymy koszty przejazdu</h2>
    <p>Mechanizm działania naszego narzędzia opiera się na kilku założeniach.</p>
    <p>Konkretnie, są to dane obejmujące:</p>
    <ul>
      <li><strong>Dystans:</strong> Przeliczymy dla Ciebie odległość trasy na podstawie map, jeżeli dobrze znasz dystans, możesz też wpisać własną odległość</li>
      <li><strong>Stosowany wzór na koszt paliwa:</strong> (dystans / 100) × spalanie × cena za litr</li>
      <li><strong>Opłaty drogowe:</strong> Doliczane są osobno do kosztu paliwa</li>
    </ul>
    <h3>Różnice między paliwami</h3>
    <ul>
      <li><strong>LPG:</strong> Cena litra o ponad połowę niższa niż benzyny, ale spalanie wyższe o ok. 20%</li>
      <li><strong>Diesel:</strong> Droższy od Pb95, ale silnik zużywa ok. 5% mniej paliwa</li>
      <li><strong>Pb98 vs Pb95:</strong> Wyższa cena, zbliżone spalanie — opłaca się głównie w silnikach wysokoprężnych</li>
    </ul>
    <h3>Co zobaczysz w wyniku?</h3>
    <ul>
      <li><strong>Koszt przejazdu:</strong> przedstawiony w złotówkach, z podziałem na paliwo i opłaty</li>
      <li><strong>Zużycie paliwa:</strong> dowiesz się, ile litrów lub kWh potrzebujesz na trasę</li>
      <li><strong>Porównanie kosztu paliw:</strong> odpowie na pytanie: co właściwie wyjdzie najtaniej? Czyli zestawienie dla Pb95, Pb98, Diesel i LPG na tej samej trasie</li>
      <li><strong>Szacunkowy koszt podróży:</strong> po to, aby wiedzieć jak długa trasa Cię czeka i ile postojów zaplanować (w praktyce na trasie warto zrobić krótką przerwę mniej więcej co 2 godziny jazdy)</li>
    </ul>
  </section>

  <section>
    <h2>Jak samodzielnie obliczyć koszt przejazdu samochodem?</h2>
    <p>Planując budżet na podróż samochodem, musisz wiedzieć trzy rzeczy: ile kilometrów wynosi trasa, ile średnio (realnie) pali Twój samochód i ile aktualnie kosztuje paliwo. Następnie wykorzystujesz wzór: dzielisz dystans przez 100, mnożysz przez spalanie i cenę litra. Przykładowo — przejechanie 300 km autem palącym 7 litrów na setkę przy benzynie za 5,89 zł to mniej więcej 124 zł za samo paliwo.</p>
    <p>Warto jednak pamiętać o kilku podpowiedziach, które w naszym doświadczeniu pomagają obniżyć finalny koszt podróży:</p>
    <h3>Dystans i trasa</h3><p>Najkrótsza trasa nie zawsze jest najtańsza. Autostrady pozwalają jechać oszczędniej dzięki stałej prędkości, ale na niektórych odcinkach zapłacisz za przejazd. Warto sprawdzić oba warianty.</p>
    <h3>Spalanie auta</h3><p>Ile Twój samochód faktycznie pali, zależy od prędkości, stylu jazdy i tego, ile osób wiezie. Na autostradzie przy 90–110 km/h spalanie jest niższe. Powyżej 130 km/h rośnie zauważalnie. Tak zwany „eco-driving" naprawdę pomaga w zbiciu rachunku.</p>
    <h3>Rodzaj paliwa</h3><p>LPG kosztuje o połowę mniej za litr niż benzyna, ale auto pali go o ok. 20% więcej. Diesel jest droższy od Pb95, ale silnik diesla zużywa ok. 5% mniej paliwa. Nasz kalkulator uwzględnia te różnice automatycznie, pokazując Ci praktyczne porównanie wariantów.</p>
    <h3>Które autostrady w Polsce są płatne?</h3><p>W Polsce za przejazd samochodem osobowym zapłacisz na trzech odcinkach: A1 między Gdańskiem a Toruniem (AmberOne), A2 na odcinkach koncesyjnych między Nowym Tomyślem a Strykowem, oraz A4 między Katowicami a Krakowem (Stalexport). Pozostałe autostrady i wszystkie drogi ekspresowe (S-ki) są bezpłatne. Jeśli jedziesz za granicę, musisz pamiętać o winietach — ich brak może słono kosztować.</p>
    <h3>Pułapki przy planowaniu kosztu podróży</h3>
    <p>Większość podróży samochodem zaczyna się tak samo: ktoś sprawdza mapę, patrzy na kilometry i mówi „to niedaleko". I w zasadzie na tym kończy się planowanie kosztów. Dopiero po powrocie, przy tankowaniu, okazuje się czy było faktycznie blisko, czy jednak bak zniknął szybciej niż zakładaliśmy.</p>
    <p>Problem nie polega na tym, że nie umiemy policzyć kosztu podróży. Problem polega na tym, że robimy to zawsze „na oko". Za każdym razem trzeba otworzyć mapę, zapamiętać kilometry, wpisać spalanie, sprawdzić cenę paliwa i policzyć wynik — czyli zrobić kilka drobnych kroków, które razem są na tyle uciążliwe, że zwykle kończą się przybliżeniem.</p>
    <p>Dlatego właśnie kalkulator posiada tryb „Trasa A → B", gdzie po wpisaniu punktu startowego i docelowego, automatycznie otrzymasz szacunkową odległość na podstawie realnej trasy. To odróżnia Trasomat od prostych rozwiązań, które umożliwiają wyłącznie wpisanie własnego dystansu.</p>
    <p>Narzędzie powstało po to, aby wyeliminować zgadywanie i niedopowiedzenia. Wykonuje niezbędne obliczenia natychmiast. Na komputerze lub na urządzeniu mobilnym — wszędzie gdzie masz dostęp do internetu. Dzięki temu zamiast orientacyjnej kwoty znasz konkretną liczbę jeszcze przed wyjazdem. Podajesz trasę i parametry auta — dostajesz koszt przejazdu. W kilka sekund.</p>
    <h3>Dlaczego samodzielne liczenie „na oko" prawie zawsze jest błędne?</h3>
    <p>Najczęściej zakładamy koszt na podstawie jednego tankowania albo średniej z pamięci. Problem w tym, że pamiętamy raczej momenty „idealne": spokojną jazdę, trasę bez korków, cenę paliwa sprzed tygodnia. Ale rzeczywisty wyjazd prawie nigdy nie wygląda identycznie.</p>
    <p>Cena paliwa się zmienia, rzeczywisty dystans często jest wyższy… a opłata drogowa nagle przypomina o sobie przy bramce. Efekt jest taki, że różnica między „powinno wyjść około 100 zł" a faktycznym kosztem potrafi być zaskakująco duża. Nie dlatego, że coś poszło źle — tylko dlatego, że wcześniej nikt tego dokładnie nie policzył. Czasem to kilkanaście złotych. A czasem to koszt dodatkowej kolacji.</p>
    <h3>Najbardziej przydatny moment jest przed decyzją</h3>
    <p>Najczęściej sprawdzasz koszt nie dlatego, że jesteś ciekawy. Sprawdzasz go, bo od niego zależy decyzja:</p>
    <ul>
      <li>Czy jedziemy jednym autem czy dwoma</li>
      <li>Czy bierzemy pasażerów</li>
      <li>Czy warto jechać na jeden dzień</li>
      <li>Czy wyjazd nadal mieści się w budżecie</li>
      <li>Czy lepiej jechać pociągiem, a może lecieć samolotem</li>
    </ul>
    <p>W takich sytuacjach orientacyjna kwota niewiele daje — potrzebna jest konkretna liczba. Jedno sprawdzenie i wiadomo, o czym rozmawiamy. Dlatego kalkulator najczęściej używany jest jeszcze zanim ktokolwiek wsiądzie do samochodu.</p>
    <h3>Wspólne wyjazdy i klasyczne… „to ile wyszło?"</h3>
    <p>Po powrocie zaczyna się niezręczna część każdej podróży, czyli rozliczanie. Ktoś płaci za paliwo, ktoś za autostradę, ktoś kupuje kawę. Potem pada pytanie, ile właściwie wyniósł przejazd i zaczyna się improwizacja. Zaokrąglamy w dół, w górę, ktoś macha ręką, ktoś dopłaca przy następnej okazji.</p>
    <p>A przecież dużo łatwiej ustalić koszt wcześniej. Wtedy każdy wie, ile wychodzi na osobę i nie trzeba wracać do tematu po powrocie. W odpowiedzi na ten problem, Trasomat posiada także opcję podzielenia kosztu na pasażerów.</p>
    <p>Niezależne źródło pokaże wynik, a więc zamyka wszystkie spory i niedopowiedzenia. Podróż przestaje być przysługą, a staje się po prostu wspólnym kosztem. Nikt nie jest stratny, nikt nie „funduje" przejazdu.</p>
    <h3>Autostrada czy objazd?</h3>
    <p>Czasami prawdziwe pytanie nie brzmi „ile kosztuje paliwo", tylko „która opcja ma sens". Szybsza trasa często oznacza opłaty. Dłuższa zużyje więcej paliwa. Na oko trudno ocenić, co wychodzi drożej. Dopiero po policzeniu widać, czy skrócenie czasu rzeczywiście podnosi koszt, czy różnica jest tylko symboliczna.</p>
    <p>Zdarza się, że nadłożenie kilkudziesięciu kilometrów daje niemal ten sam wydatek. Zdarza się też odwrotnie: krótka trasa okazuje się najdroższą opcją. Bez liczb to tylko przeczucie, a wyniki potrafią zaskoczyć.</p>
    <h3>Różne paliwa, różne wyniki</h3>
    <p>Wiele osób jeździ więcej niż jednym samochodem albo zastanawia się, które auto wziąć na wyjazd. Różnica w spalaniu brzmi niewinnie — w końcu to litr lub dwa na sto kilometrów… dopóki nie przemnoży się jej przez kilkaset kilometrów. Dopiero wtedy widać realną kwotę.</p>
    <p>Podobnie przy LPG czy dieslu — dopóki nie policzysz konkretnej trasy, porównanie pozostaje teorią. A teoria zwykle kończy się zdaniem „pewnie podobnie". Efekty „pewnie podobnie" już znasz — często nie jest podobnie :)</p>
    <h3>Koszty przejazdu autem elektrycznym</h3>
    <p>Układanka staje się tym bardziej skomplikowana w dobie elektromobilności. Coraz więcej z nas decyduje się na samochód elektryczny. Pojazd ładować można w domu, ale także na trasie, co wiąże się z wyższym kosztem kilowatogodziny.</p>
    <p>Trasomat posiada specjalny tryb obliczenia kosztu energii elektrycznej na trasie. Znając swoje średnie zużycie energii na 100 km, połączone z Twoją uśrednioną ceną prądu, szybko sprawdzisz swój orientacyjny rachunek za trasę elektrykiem.</p>
    <h3>Jedno sprawdzenie zamyka temat</h3>
    <p>Największa różnica polega na tym, że przestajesz wracać do pytania o koszt. Nie liczysz po powrocie. Nie zastanawiasz się przy tankowaniu. Nie sprawdzasz, czy ktoś dopłacił tyle ile trzeba. Po prostu wiesz wcześniej.</p>
    <p>Czasem potwierdza to przypuszczenia. Czasem całkowicie je zmienia. W obu przypadkach decyzja przestaje opierać się na pamięci, a zaczyna na liczbach. Właśnie dlatego Trasomat warto zawsze mieć pod ręką.</p>
  </section>
  
  <section>
    <h2>Często zadawane pytania</h2>
    ${faqHtml}
  </section>
</main>
${footerHtml()}`;

  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Kalkulator paliwa – Trasomat",
    "url": "https://trasomat.pl/",
    "applicationCategory": "TravelApplication",
    "operatingSystem": "Web",
    "description": "Internetowy kalkulator kosztów przejazdu samochodem spalinowym i elektrycznym.",
    "inLanguage": "pl-PL",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "PLN" },
    "provider": { "@type": "Organization", "name": "Trasomat", "url": "https://trasomat.pl/" }
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer }
    }))
  };

  return injectSeo(shell, {
    title: 'Kalkulator paliwa: policz ile zapłacisz za podróż w 2026',
    description: 'Oblicz koszt paliwa na trasie w kilka sekund. Wpisz spalanie auta i sprawdź ile zapłacisz za przejazd według aktualnych cen – także samochodem elektrycznym.',
    canonical: 'https://trasomat.pl/',
    bodyHtml: bodyHtml,
    jsonLd: [softwareApp, faqLd],
  });
}

function buildRoutePage(shell: string, route: RouteData): string {
  const totalTollCost = route.tollSections.reduce((sum, t) => sum + t.cost, 0);

  // Calculate costs per variant (matches RoutePage.tsx logic)
  const variantCosts = route.variants.map((v) => {
    const fuel = (v.distance / 100) * route.defaultConsumption * route.defaultFuelPrice;
    const toll = (route.hasTolls && v.tollIndices && v.tollIndices.length > 0)
      ? v.tollIndices.reduce((sum: number, idx: number) => sum + (route.tollSections[idx]?.cost ?? 0), 0)
      : 0;
    return { fuel, toll, total: fuel + toll };
  });

  const variantsHtml = route.variants.map((v, i) => {
    const fuelCost = variantCosts[i].fuel.toFixed(0);
    const tollCost = variantCosts[i].toll;
    const totalCost = parseInt(fuelCost) + tollCost;
    return `<div>
      <h3>${escapeHtml(v.name)}</h3>
      <p>Przez: ${v.via.join(' → ')}</p>
      <p>${v.distance} km | ${v.time} | Paliwo: ${fuelCost} zł${tollCost > 0 ? ` | +${tollCost} zł opłaty` : ''} | Łącznie: ${totalCost} zł</p>
    </div>`;
  }).join('');

  const tollsHtml = route.hasTolls
    ? `<p>Na trasie ${route.from} – ${route.to} mogą występować płatne odcinki (w zależności od wybranego wariantu):</p>` +
      (route.description ? `<p>${escapeHtml(route.description)}</p>` : '') +
      route.tollSections.map(t => `<p>${escapeHtml(t.name)}: ${t.cost} zł</p>`).join('') +
      `<p><strong>Suma opłat drogowych (max): ${totalTollCost} zł</strong></p>`
    : `<p>Na trasie ${route.from} – ${route.to} <strong>nie ma płatnych odcinków</strong>.</p>`;

  const otherRoutes = routesData
    .filter(r => r.slug !== route.slug)
    .slice(0, 6)
    .map(r => `<li><a href="/trasa/${r.slug}">${r.from} → ${r.to} (${r.distance} km)</a></li>`)
    .join('');

  // Hero text matches RoutePage.tsx exactly
  const heroFuelCost = variantCosts[0].fuel.toFixed(0);
  let heroHtml = `<p>Koszt paliwa na trasie <strong>${route.from} – ${route.to}</strong> (${route.variants[0].distance} km) to <strong>około ${heroFuelCost} zł</strong> (przy spalaniu ${route.defaultConsumption} L/100km i cenie ${route.defaultFuelPrice.toFixed(2)} zł/l).</p>`;
  if (route.variants.length > 1) {
    heroHtml += `<p>Alternatywna trasa (${route.variants[1].distance} km) to koszt około ${variantCosts[1].fuel.toFixed(0)} zł za paliwo. Szczegóły poniżej.</p>`;
  }
  if (totalTollCost > 0) {
    heroHtml += `<p>Na tej trasie mogą występować dodatkowe opłaty drogowe (do ${totalTollCost} zł).</p>`;
  }

  const bodyHtml = `
<header>${navHtml()}</header>
<main>
  <nav aria-label="Breadcrumb"><a href="/">Kalkulator</a> › <span>${route.from} – ${route.to}</span></nav>
  <h1>Koszt paliwa na trasie ${route.from} – ${route.to}</h1>
  <p>Ile zapłacisz za podróż?</p>
  ${heroHtml}
  <p><a href="/">Dostosuj parametry i przelicz</a></p>
  
  <section>
    <h2>Do przejazdu możesz wybrać ${route.variants.length} ${route.variants.length === 1 ? 'trasę' : 'trasy'}:</h2>
    ${variantsHtml}
  </section>
  
  <section>
    <h2>Opłaty drogowe</h2>
    ${tollsHtml}
  </section>
  
  <section>
    <h2>Inne popularne trasy</h2>
    <ul>${otherRoutes}</ul>
  </section>
</main>
${footerHtml()}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Kalkulator", "item": "https://trasomat.pl/" },
      { "@type": "ListItem", "position": 2, "name": `${route.from} – ${route.to}`, "item": `https://trasomat.pl/trasa/${route.slug}` }
    ]
  };

  return injectSeo(shell, {
    title: `Koszt paliwa na trasie ${route.from} – ${route.to} | Trasomat.pl`,
    description: `Ile zapłacisz za paliwo na trasie ${route.from} – ${route.to}? Sprawdź koszt i zweryfikuj dostępne trasy wraz z opłatami drogowymi w 2026.`,
    canonical: `https://trasomat.pl/trasa/${route.slug}`,
    bodyHtml: bodyHtml,
    jsonLd: [breadcrumbLd],
  });
}

function buildStaticPage(shell: string, opts: { title: string; description: string; canonical: string; h1: string; content: string }): string {
  const bodyHtml = `
<header>${navHtml()}</header>
<main>
  <nav aria-label="Breadcrumb"><a href="/">Kalkulator</a> › <span>${escapeHtml(opts.h1)}</span></nav>
  <h1>${escapeHtml(opts.h1)}</h1>
  ${opts.content}
</main>
${footerHtml()}`;

  return injectSeo(shell, {
    title: opts.title,
    description: opts.description,
    canonical: opts.canonical,
    bodyHtml: bodyHtml,
  });
}

// ── Main ─────────────────────────────────────────────────────────────────

function main() {
  console.log('\n🚀 Starting prerender (no-browser mode)...\n');

  if (!existsSync(distPath)) {
    console.error('❌ dist/ not found. Run `npx vite build` first.');
    process.exit(1);
  }

  const shellPath = join(distPath, 'index.html');
  const shell = readFileSync(shellPath, 'utf-8');
  let success = 0;

  // 1) Home page
  const homeHtml = buildHomePage(shell);
  writeFileSync(shellPath, homeHtml, 'utf-8');
  console.log(`  ✅ / → dist/index.html (${(homeHtml.length / 1024).toFixed(1)} KB)`);
  success++;

  // 2) Route pages
  for (const route of routesData) {
    const routeHtml = buildRoutePage(shell, route);
    const dir = join(distPath, 'trasa', route.slug);
    mkdirSync(dir, { recursive: true });
    const outPath = join(dir, 'index.html');
    writeFileSync(outPath, routeHtml, 'utf-8');
    console.log(`  ✅ /trasa/${route.slug} → dist/trasa/${route.slug}/index.html (${(routeHtml.length / 1024).toFixed(1)} KB)`);
    success++;
  }

  // 3) Contact
  const contactHtml = buildStaticPage(shell, {
    title: 'Kontakt | Trasomat.pl',
    description: 'Skontaktuj się z nami. Masz pytanie, sugestię lub znalazłeś błąd? Napisz do nas.',
    canonical: 'https://trasomat.pl/kontakt',
    h1: 'Kontakt',
    content: '<p>Napisz do nas – odpowiadamy w ciągu 24 godzin. Skorzystaj z formularza kontaktowego na stronie.</p>',
  });
  mkdirSync(join(distPath, 'kontakt'), { recursive: true });
  writeFileSync(join(distPath, 'kontakt', 'index.html'), contactHtml, 'utf-8');
  console.log(`  ✅ /kontakt → dist/kontakt/index.html`);
  success++;

  // 4) Privacy policy
  const privacyHtml = buildStaticPage(shell, {
    title: 'Polityka Prywatności | Trasomat.pl',
    description: 'Polityka prywatności serwisu Trasomat.pl. Dowiedz się jak przetwarzamy Twoje dane.',
    canonical: 'https://trasomat.pl/polityka-prywatnosci',
    h1: 'Polityka Prywatności',
    content: '<section><h2>1. Informacje ogólne</h2><p>Serwis nie wymaga rejestracji ani logowania. Szanujemy prywatność naszych użytkowników.</p></section><section><h2>2. Zakres zbieranych danych</h2><p>Serwis nie zbiera danych osobowych w sposób automatyczny. Kalkulator działa w całości po stronie przeglądarki użytkownika.</p></section><section><h2>3. Pliki cookies</h2><p>Serwis może wykorzystywać pliki cookies w celach statystycznych i analitycznych.</p></section><section><h2>4. Usługi zewnętrzne</h2><p>Serwis korzysta z usługi OpenRouteService do wyznaczania tras oraz Nominatim (OpenStreetMap) do wyszukiwania adresów.</p></section>',
  });
  mkdirSync(join(distPath, 'polityka-prywatnosci'), { recursive: true });
  writeFileSync(join(distPath, 'polityka-prywatnosci', 'index.html'), privacyHtml, 'utf-8');
  console.log(`  ✅ /polityka-prywatnosci → dist/polityka-prywatnosci/index.html`);
  success++;

  // 5) Terms
  const termsHtml = buildStaticPage(shell, {
    title: 'Regulamin | Trasomat.pl',
    description: 'Regulamin korzystania z serwisu Trasomat.pl. Zasady użytkowania i odpowiedzialność.',
    canonical: 'https://trasomat.pl/regulamin',
    h1: 'Regulamin',
    content: '<section><h2>1. Postanowienia ogólne</h2><p>Korzystanie z Serwisu jest bezpłatne i nie wymaga rejestracji.</p></section><section><h2>2. Zakres usług</h2><p>Serwis umożliwia szacunkowe obliczenie kosztów przejazdu samochodem na podstawie wprowadzonych parametrów.</p></section><section><h2>3. Charakter informacyjny</h2><p>Wyniki obliczeń mają charakter wyłącznie szacunkowy i informacyjny.</p></section>',
  });
  mkdirSync(join(distPath, 'regulamin'), { recursive: true });
  writeFileSync(join(distPath, 'regulamin', 'index.html'), termsHtml, 'utf-8');
  console.log(`  ✅ /regulamin → dist/regulamin/index.html`);
  success++;

  console.log(`\n🎉 Done! ${success} pages prerendered successfully.\n`);
  console.log('Build command: npx vite build && npx tsx scripts/prerender.ts\n');
}

main();
