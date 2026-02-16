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
interface RouteVariant { name: string; via: string[]; distance: number; time: string; avgCost: number; }
interface RouteData {
  from: string; to: string; slug: string; distance: number;
  defaultConsumption: number; defaultFuelPrice: number;
  variants: RouteVariant[]; hasTolls: boolean; tollSections: TollSection[];
  description?: string;
}

const routesData: RouteData[] = [
  { from:'Warszawa',to:'Kraków',slug:'warszawa-krakow',distance:295,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa S7 przez Kielce (bezpłatna)',via:['Radom','Kielce','Jędrzejów'],distance:295,time:'3 godz. 25 min',avgCost:122},{name:'Trasa przez Łódź i Katowice (A1/A4)',via:['Łódź','Piotrków Trybunalski','Częstochowa','Katowice'],distance:370,time:'3 godz. 45 min',avgCost:170}],hasTolls:true,tollSections:[{name:'A4 Katowice–Kraków (Stalexport, tylko wariant przez Łódź)',cost:17}],description:'Trasa S7 jest bezpłatna i najkrótsza (295 km). Wariant przez Łódź i Katowice (A1/A4) jest dłuższy (370 km), wolniejszy i z opłatą za A4 Katowice–Kraków.' },
  { from:'Gdańsk',to:'Warszawa',slug:'gdansk-warszawa',distance:340,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa S7 (bezpłatna)',via:['Elbląg','Płońsk'],distance:340,time:'3 godz. 50 min',avgCost:140},{name:'Trasa A1 przez Toruń i Łódź',via:['Toruń','Łódź','Stryków'],distance:475,time:'4 godz. 40 min',avgCost:229}],hasTolls:true,tollSections:[{name:'A1 Gdańsk–Toruń (AmberOne, tylko wariant przez A1)',cost:33}],description:'S7 jest bezpłatna i najkrótsza (340 km). Wariant przez A1/Łódź jest znacznie dłuższy (475 km), wolniejszy i droższy.' },
  { from:'Wrocław',to:'Poznań',slug:'wroclaw-poznan',distance:180,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa S5 (bezpłatna)',via:['Rawicz','Leszno'],distance:180,time:'2 godz.',avgCost:74}],hasTolls:false,tollSections:[] },
  { from:'Katowice',to:'Łódź',slug:'katowice-lodz',distance:200,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa A1 (bezpłatna dla aut osobowych)',via:['Częstochowa','Radomsko'],distance:200,time:'1 godz. 50 min',avgCost:82}],hasTolls:false,tollSections:[] },
  { from:'Poznań',to:'Warszawa',slug:'poznan-warszawa',distance:310,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa A2 (z opłatami)',via:['Konin','Kutno','Łowicz'],distance:310,time:'3 godz.',avgCost:178}],hasTolls:true,tollSections:[{name:'A2 odcinek koncesyjny (Poznań–Konin–Stryków)',cost:50}],description:'A2 jest najszybsza, ale zawiera płatne odcinki koncesyjne na bramkach.' },
  { from:'Lublin',to:'Kraków',slug:'lublin-krakow',distance:290,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa przez Rzeszów (bezpłatna)',via:['Stalowa Wola','Rzeszów','Tarnów'],distance:340,time:'4 godz. 15 min',avgCost:140},{name:'Trasa przez Kielce (bezpłatna)',via:['Sandomierz','Kielce'],distance:290,time:'3 godz. 40 min',avgCost:120}],hasTolls:false,tollSections:[] },
  { from:'Szczecin',to:'Gdańsk',slug:'szczecin-gdansk',distance:360,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa S6 (bezpłatna)',via:['Koszalin','Słupsk','Lębork'],distance:360,time:'3 godz. 35 min',avgCost:148}],hasTolls:false,tollSections:[] },
  { from:'Białystok',to:'Warszawa',slug:'bialystok-warszawa',distance:200,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa S8 (bezpłatna)',via:['Zambrów','Ostrów Mazowiecka'],distance:200,time:'2 godz. 10 min',avgCost:82}],hasTolls:false,tollSections:[] },
  { from:'Kraków',to:'Praga',slug:'krakow-praga',distance:540,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa przez Katowice i Ostrawę',via:['Katowice','Ostrawa','Ołomuniec','Brno'],distance:540,time:'5 godz. 30 min',avgCost:295}],hasTolls:true,tollSections:[{name:'A4 Kraków–Katowice (Stalexport)',cost:17},{name:'Winieta czeska (10 dni, od 2026 r.)',cost:55}],description:'Na A4 Kraków–Katowice obowiązuje opłata na bramkach. W Czechach wymagana e-winieta.' },
  { from:'Warszawa',to:'Berlin',slug:'warszawa-berlin',distance:570,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa A2',via:['Poznań','Świecko','Frankfurt nad Odrą'],distance:570,time:'5 godz. 40 min',avgCost:321}],hasTolls:true,tollSections:[{name:'A2 Stryków–Konin (odcinek koncesyjny)',cost:33},{name:'A2 Konin–Nowy Tomyśl (odcinek koncesyjny)',cost:53}],description:'A2 zawiera dwa płatne odcinki koncesyjne. Autostrady w Niemczech są bezpłatne dla aut osobowych.' },
  { from:'Kraków',to:'Wiedeń',slug:'krakow-wieden',distance:440,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa przez Katowice i Ostrawę',via:['Katowice','Ostrawa','Brno'],distance:440,time:'4 godz. 50 min',avgCost:303}],hasTolls:true,tollSections:[{name:'A4 Kraków–Katowice (Stalexport)',cost:17},{name:'Winieta czeska (10 dni, od 2026 r.)',cost:55},{name:'Winieta austriacka (10 dni)',cost:50}],description:'Trasa wymaga e-winiety czeskiej i austriackiej. A4 Kraków–Katowice jest płatna na bramkach.' },
  { from:'Wrocław',to:'Drezno',slug:'wroclaw-drezno',distance:300,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa A4/A17',via:['Legnica','Zgorzelec','Görlitz'],distance:300,time:'3 godz. 15 min',avgCost:124}],hasTolls:false,tollSections:[],description:'A4 od Wrocławia do granicy jest bezpłatna dla samochodów osobowych. Autostrady w Niemczech również bezpłatne.' },
  { from:'Kraków',to:'Katowice',slug:'krakow-katowice',distance:80,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa A4 (z opłatą)',via:['Chrzanów','Mysłowice'],distance:80,time:'1 godz. 5 min',avgCost:50},{name:'Trasa DK94 (bezpłatna)',via:['Trzebinia','Jaworzno'],distance:85,time:'1 godz. 30 min',avgCost:35}],hasTolls:true,tollSections:[{name:'A4 Kraków–Katowice (Stalexport)',cost:17}],description:'A4 jest najszybsza, ale płatna (17 zł). DK94 jest bezpłatna, lecz wolniejsza.' },
  { from:'Poznań',to:'Wrocław',slug:'poznan-wroclaw',distance:180,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa S5 (bezpłatna)',via:['Leszno','Rawicz'],distance:180,time:'2 godz.',avgCost:74}],hasTolls:false,tollSections:[] },
  { from:'Warszawa',to:'Gdańsk',slug:'warszawa-gdansk',distance:340,defaultConsumption:7,defaultFuelPrice:5.89,variants:[{name:'Trasa S7 (bezpłatna)',via:['Płońsk','Elbląg'],distance:340,time:'3 godz. 50 min',avgCost:140},{name:'Trasa A1 przez Łódź i Toruń',via:['Stryków','Łódź','Toruń'],distance:475,time:'4 godz. 40 min',avgCost:229}],hasTolls:true,tollSections:[{name:'A1 Gdańsk–Toruń (AmberOne, tylko wariant przez A1)',cost:33}],description:'S7 jest bezpłatna i najkrótsza (340 km). Wariant przez A1/Łódź jest dłuższy (475 km), wolniejszy i droższy.' },
];

// ── FAQ data (mirrors src/components/FAQ.tsx) ────────────────────────────

const faqItems = [
  { question: 'Jak działa kalkulator kosztów przejazdu?', answer: 'Wpisujesz skąd jedziesz i dokąd — kalkulator wyznacza realną trasę drogową i na tej podstawie oblicza, ile paliwa zużyjesz i ile to będzie kosztować. Możesz też ręcznie wpisać dystans, jeśli go znasz. Uwzględniamy różne rodzaje paliwa (Pb95, Pb98, Diesel, LPG) oraz opłaty za autostrady.' },
  { question: 'Czy muszę znać spalanie swojego auta?', answer: 'Nie musisz — mamy podpowiedź „Nie wiesz ile pali?", która pozwala wybrać typ auta (małe, kompakt, SUV itd.), a kalkulator sam dobierze typowe spalanie. Wartości są automatycznie przeliczane w zależności od wybranego paliwa — np. na LPG spalanie jest wyższe o ok. 20%.' },
  { question: 'Czy wynik uwzględnia opłaty za autostrady?', answer: 'Tak, ale musisz je wpisać osobno w polu „Opłaty drogowe". Dla popularnych tras (np. Warszawa–Kraków, Poznań–Warszawa) pokazujemy konkretne kwoty za płatne odcinki, żebyś wiedział ile doliczyć. Opłaty są wyraźnie wyszczególnione w wyniku.' },
  { question: 'Dlaczego wynik może się różnić od rzeczywistości?', answer: 'Kalkulator podaje szacunek oparty na średnim spalaniu i aktualnych cenach paliw. W praktyce koszt zależy od wielu czynników: stylu jazdy, prędkości, korków, obciążenia auta, klimatyzacji czy warunków pogodowych. Traktuj wynik jako solidną orientację, nie dokładną kwotę co do grosza.' },
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
  <h1>Kalkulator Kosztów Przejazdu 2026: Oblicz Koszt Paliwa na Trasie</h1>
  <p>Darmowy kalkulator kosztów przejazdu samochodem. Oblicz ile zapłacisz za paliwo na trasie. Pb95, Pb98, Diesel, LPG. Aktualne ceny i realne trasy.</p>

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
        <p>Ceny orientacyjne: ładowarka DC (szybka): 1–2 zł/kWh, ładowanie w domu: ~0,65 zł/kWh.</p>
      </fieldset>

      <fieldset>
        <legend>Rodzaj paliwa</legend>
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
        <li>Dystans trasy: na podstawie realnej trasy drogowej (OpenStreetMap)</li>
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
    <h2>Jak obliczyć koszt przejazdu samochodem?</h2>
    <p>Planowanie budżetu na podróż samochodem sprowadza się do trzech rzeczy: ile kilometrów jedziesz, ile pali Twój samochód i ile kosztuje paliwo. Wzór jest prosty: dzielisz dystans przez 100, mnożysz przez spalanie i cenę litra.</p>
    <h3>Dystans i trasa</h3><p>Najkrótsza trasa nie zawsze jest najtańsza. Autostrady pozwalają jechać oszczędniej dzięki stałej prędkości, ale na niektórych odcinkach zapłacisz za przejazd.</p>
    <h3>Spalanie auta</h3><p>Ile Twój samochód faktycznie pali, zależy od prędkości, stylu jazdy i tego, ile wiezie. Na autostradzie przy 90–110 km/h spalanie jest najniższe.</p>
    <h3>Rodzaj paliwa</h3><p>LPG kosztuje o połowę mniej za litr niż benzyna, ale auto pali go o ok. 20% więcej. Diesel jest droższy od Pb95, ale silnik diesla zużywa ok. 5% mniej paliwa.</p>
    <h3>Które autostrady w Polsce są płatne?</h3><p>W Polsce za przejazd samochodem osobowym zapłacisz na trzech odcinkach: A1 między Gdańskiem a Toruniem (AmberOne), A2 na odcinkach koncesyjnych między Nowym Tomyślem a Strykowem, oraz A4 między Katowicami a Krakowem (Stalexport).</p>
    <h3>Czy warto tankować LPG na długą trasę?</h3><p>Na trasach powyżej 200 km LPG wychodzi zdecydowanie taniej niż benzyna — mimo wyższego spalania o ok. 20%, cena litra jest o ponad połowę niższa.</p>
  </section>
  
  <section>
    <h2>O Serwisie</h2>
    <p>Kalkulator Paliwa to niezależne narzędzie stworzone z myślą o kierowcach planujących podróże po Polsce i Europie.</p>
    <h3>Wiarygodne dane</h3><p>Ceny paliw opieramy na danych e-petrol.pl i aktualizujemy co tydzień.</p>
    <h3>Realne trasy</h3><p>Dystanse i czasy przejazdu bazują na OpenStreetMap i OpenRouteService.</p>
    <h3>Prywatność</h3><p>Nie zbieramy danych osobowych. Obliczenia wykonywane są bezpośrednio w Twojej przeglądarce.</p>
    <h3>Regularnie aktualizowane</h3><p>Ceny paliw, opłaty drogowe i winiety aktualizujemy regularnie.</p>
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
    "name": "Kalkulator Kosztów Przejazdu – Trasomat",
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
    title: 'Kalkulator Kosztów Przejazdu 2026: Oblicz Koszt Paliwa na Trasie',
    description: 'Darmowy kalkulator kosztów przejazdu. Oblicz ile zapłacisz za paliwo na trasie samochodem. Pb95, Pb98, Diesel, LPG. Aktualne ceny i realne trasy.',
    canonical: 'https://trasomat.pl/',
    bodyHtml: bodyHtml,
    jsonLd: [softwareApp, faqLd],
  });
}

function buildRoutePage(shell: string, route: RouteData): string {
  const estimatedCost = ((route.distance / 100) * route.defaultConsumption * route.defaultFuelPrice).toFixed(0);
  const totalTollCost = route.tollSections.reduce((sum, t) => sum + t.cost, 0);

  const variantsHtml = route.variants.map(v =>
    `<div><h3>${escapeHtml(v.name)}</h3><p>Przez: ${v.via.join(' → ')}</p><p>${v.distance} km | ${v.time} | ~${v.avgCost} zł</p></div>`
  ).join('');

  const tollsHtml = route.hasTolls
    ? route.tollSections.map(t => `<p>${escapeHtml(t.name)}: ${t.cost} zł</p>`).join('') + `<p>Suma opłat drogowych (max): ${totalTollCost} zł</p>`
    : `<p>Na trasie ${route.from} – ${route.to} nie ma płatnych odcinków.</p>`;

  const otherRoutes = routesData
    .filter(r => r.slug !== route.slug)
    .slice(0, 6)
    .map(r => `<li><a href="/trasa/${r.slug}">${r.from} → ${r.to} (${r.distance} km)</a></li>`)
    .join('');

  const bodyHtml = `
<header>${navHtml()}</header>
<main>
  <nav aria-label="Breadcrumb"><a href="/">Kalkulator</a> › <span>${route.from} – ${route.to}</span></nav>
  <h1>Koszt przejazdu ${route.from} – ${route.to}</h1>
  <p>Szacunkowy koszt przejazdu na trasie ${route.from} – ${route.to} to ${estimatedCost} zł (przy cenie paliwa ${route.defaultFuelPrice.toFixed(2)} zł za litr). Dystans wynosi ${route.distance} km, przy średnim spalaniu na poziomie ${route.defaultConsumption} L/100km.</p>
  
  <section>
    <h2>Warianty trasy</h2>
    ${variantsHtml}
  </section>
  
  <section>
    <h2>Opłaty drogowe</h2>
    ${tollsHtml}
    ${route.description ? `<p>${escapeHtml(route.description)}</p>` : ''}
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
    title: `Koszt przejazdu ${route.from} - ${route.to} | Kalkulator Paliwa`,
    description: `Oblicz koszt przejazdu na trasie ${route.from} - ${route.to}. Dystans ${route.distance} km. Szacunkowy koszt: ${estimatedCost} zł.`,
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
