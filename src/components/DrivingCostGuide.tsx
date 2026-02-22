import { TrendingDown, Gauge, Route } from 'lucide-react';

export const DrivingCostGuide = () => {
  return (
    <section className="mt-8 bg-card border border-border rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-bold text-foreground mb-4">
        Jak samodzielnie obliczyć koszt przejazdu samochodem?
      </h2>

      <div className="text-muted-foreground space-y-4 leading-relaxed text-sm">
        <p>
          Planując budżet na podróż samochodem, musisz wiedzieć trzy rzeczy:{' '}
          <strong className="text-foreground">ile kilometrów wynosi trasa</strong>,{' '}
          <strong className="text-foreground">ile średnio (realnie) pali Twój samochód</strong> i{' '}
          <strong className="text-foreground">ile aktualnie kosztuje paliwo</strong>.
          Następnie wykorzystujesz wzór: dzielisz dystans przez 100, mnożysz przez spalanie i cenę litra.
          Przykładowo — przejechanie 300 km autem palącym 7 litrów na setkę przy benzynie za 5,89 zł to mniej
          więcej 124 zł za samo paliwo.
        </p>

        <p>
          Warto jednak pamiętać o kilku podpowiedziach, które w naszym doświadczeniu pomagają obniżyć finalny koszt podróży:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="bg-secondary/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Route className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Dystans i trasa</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Najkrótsza trasa nie zawsze jest najtańsza. Autostrady pozwalają jechać oszczędniej
              dzięki stałej prędkości, ale na niektórych odcinkach zapłacisz za przejazd.
              Warto sprawdzić oba warianty.
            </p>
          </div>

          <div className="bg-secondary/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Spalanie auta</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Ile Twój samochód faktycznie pali, zależy od prędkości, stylu jazdy i tego, ile osób wiezie.
              Na autostradzie przy 90–110 km/h spalanie jest niższe. Powyżej 130 km/h rośnie
              zauważalnie. Tak zwany „eco-driving" naprawdę pomaga w zbiciu rachunku.
            </p>
          </div>

          <div className="bg-secondary/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Rodzaj paliwa</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              LPG kosztuje o połowę mniej za litr niż benzyna, ale auto pali go o ok. 20% więcej.
              Diesel jest droższy od Pb95, ale silnik diesla zużywa ok. 5% mniej paliwa.
              Nasz kalkulator uwzględnia te różnice automatycznie, pokazując Ci praktyczne porównanie wariantów.
            </p>
          </div>
        </div>

        <h3 className="text-base font-semibold text-foreground mt-6">
          Które autostrady w Polsce są płatne?
        </h3>
        <p>
          W Polsce za przejazd samochodem osobowym zapłacisz na trzech odcinkach: A1 między Gdańskiem
          a Toruniem (AmberOne), A2 na odcinkach koncesyjnych między Nowym Tomyślem a Strykowem,
          oraz A4 między Katowicami a Krakowem (Stalexport). Pozostałe autostrady i wszystkie drogi
          ekspresowe (S-ki) są bezpłatne. Jeśli jedziesz za granicę, musisz pamiętać o winietach — ich brak może słono kosztować.
        </p>

        <h3 className="text-base font-semibold text-foreground mt-6">
          Pułapki przy planowaniu kosztu podróży
        </h3>
        <p>
          Większość podróży samochodem zaczyna się tak samo: ktoś sprawdza mapę, patrzy na kilometry i mówi „to niedaleko".
          I w zasadzie na tym kończy się planowanie kosztów. Dopiero po powrocie, przy tankowaniu, okazuje się czy było faktycznie blisko,
          czy jednak bak zniknął szybciej niż zakładaliśmy.
        </p>
        <p>
          Problem nie polega na tym, że nie umiemy policzyć kosztu podróży. Problem polega na tym, że robimy to zawsze „na oko".
          Za każdym razem trzeba otworzyć mapę, zapamiętać kilometry, wpisać spalanie, sprawdzić cenę paliwa i policzyć wynik —
          czyli zrobić kilka drobnych kroków, które razem są na tyle uciążliwe, że zwykle kończą się przybliżeniem.
        </p>
        <p>
          Dlatego właśnie kalkulator posiada tryb „Trasa A → B", gdzie po wpisaniu punktu startowego i docelowego,
          automatycznie otrzymasz szacunkową odległość na podstawie realnej trasy. To odróżnia Trasomat od prostych rozwiązań,
          które umożliwiają wyłącznie wpisanie własnego dystansu.
        </p>
        <p>
          Narzędzie powstało po to, aby wyeliminować zgadywanie i niedopowiedzenia. Wykonuje niezbędne obliczenia natychmiast.
          Na komputerze lub na urządzeniu mobilnym — wszędzie gdzie masz dostęp do internetu.
          Dzięki temu zamiast orientacyjnej kwoty znasz konkretną liczbę jeszcze przed wyjazdem.
          Podajesz trasę i parametry auta — dostajesz koszt przejazdu. W kilka sekund.
        </p>

        <h3 className="text-base font-semibold text-foreground mt-6">
          Dlaczego samodzielne liczenie „na oko" prawie zawsze jest błędne?
        </h3>
        <p>
          Najczęściej zakładamy koszt na podstawie jednego tankowania albo średniej z pamięci.
          Problem w tym, że pamiętamy raczej momenty „idealne": spokojną jazdę, trasę bez korków, cenę paliwa sprzed tygodnia.
          Ale rzeczywisty wyjazd prawie nigdy nie wygląda identycznie.
        </p>
        <p>
          Cena paliwa się zmienia, rzeczywisty dystans często jest wyższy… a opłata drogowa nagle przypomina o sobie przy bramce.
          Efekt jest taki, że różnica między „powinno wyjść około 100 zł" a faktycznym kosztem potrafi być zaskakująco duża.
          Nie dlatego, że coś poszło źle — tylko dlatego, że wcześniej nikt tego dokładnie nie policzył.
          Czasem to kilkanaście złotych. A czasem to koszt dodatkowej kolacji.
        </p>

        <h3 className="text-base font-semibold text-foreground mt-6">
          Najbardziej przydatny moment jest przed decyzją
        </h3>
        <p>
          Najczęściej sprawdzasz koszt nie dlatego, że jesteś ciekawy. Sprawdzasz go, bo od niego zależy decyzja:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Czy jedziemy jednym autem czy dwoma</li>
          <li>Czy bierzemy pasażerów</li>
          <li>Czy warto jechać na jeden dzień</li>
          <li>Czy wyjazd nadal mieści się w budżecie</li>
          <li>Czy lepiej jechać pociągiem, a może lecieć samolotem</li>
        </ul>
        <p>
          W takich sytuacjach orientacyjna kwota niewiele daje — potrzebna jest konkretna liczba.
          Jedno sprawdzenie i wiadomo, o czym rozmawiamy.
          Dlatego kalkulator najczęściej używany jest jeszcze zanim ktokolwiek wsiądzie do samochodu.
        </p>

        <h3 className="text-base font-semibold text-foreground mt-6">
          Wspólne wyjazdy i klasyczne… „to ile wyszło?"
        </h3>
        <p>
          Po powrocie zaczyna się niezręczna część każdej podróży, czyli rozliczanie.
          Ktoś płaci za paliwo, ktoś za autostradę, ktoś kupuje kawę. Potem pada pytanie, ile właściwie wyniósł przejazd
          i zaczyna się improwizacja. Zaokrąglamy w dół, w górę, ktoś macha ręką, ktoś dopłaca przy następnej okazji.
        </p>
        <p>
          A przecież dużo łatwiej ustalić koszt wcześniej. Wtedy każdy wie, ile wychodzi na osobę
          i nie trzeba wracać do tematu po powrocie. W odpowiedzi na ten problem, Trasomat posiada
          także opcję podzielenia kosztu na pasażerów.
        </p>
        <p>
          Niezależne źródło pokaże wynik, a więc zamyka wszystkie spory i niedopowiedzenia.
          Podróż przestaje być przysługą, a staje się po prostu wspólnym kosztem.
          Nikt nie jest stratny, nikt nie „funduje" przejazdu.
        </p>

        <h3 className="text-base font-semibold text-foreground mt-6">
          Autostrada czy objazd?
        </h3>
        <p>
          Czasami prawdziwe pytanie nie brzmi „ile kosztuje paliwo", tylko „która opcja ma sens".
          Szybsza trasa często oznacza opłaty. Dłuższa zużyje więcej paliwa.
          Na oko trudno ocenić, co wychodzi drożej. Dopiero po policzeniu widać, czy skrócenie czasu
          rzeczywiście podnosi koszt, czy różnica jest tylko symboliczna.
        </p>
        <p>
          Zdarza się, że nadłożenie kilkudziesięciu kilometrów daje niemal ten sam wydatek.
          Zdarza się też odwrotnie: krótka trasa okazuje się najdroższą opcją.
          Bez liczb to tylko przeczucie, a wyniki potrafią zaskoczyć.
        </p>

        <h3 className="text-base font-semibold text-foreground mt-6">
          Różne paliwa, różne wyniki
        </h3>
        <p>
          Wiele osób jeździ więcej niż jednym samochodem albo zastanawia się, które auto wziąć na wyjazd.
          Różnica w spalaniu brzmi niewinnie — w końcu to litr lub dwa na sto kilometrów… dopóki nie przemnoży się jej przez kilkaset kilometrów.
          Dopiero wtedy widać realną kwotę.
        </p>
        <p>
          Podobnie przy LPG czy dieslu — dopóki nie policzysz konkretnej trasy, porównanie pozostaje teorią.
          A teoria zwykle kończy się zdaniem „pewnie podobnie". Efekty „pewnie podobnie" już znasz — często nie jest podobnie :)
        </p>

        <h3 className="text-base font-semibold text-foreground mt-6">
          Koszty przejazdu autem elektrycznym
        </h3>
        <p>
          Układanka staje się tym bardziej skomplikowana w dobie elektromobilności. Coraz więcej z nas decyduje się
          na samochód elektryczny. Pojazd ładować można w domu, ale także na trasie, co wiąże się z wyższym kosztem kilowatogodziny.
        </p>
        <p>
          Trasomat posiada specjalny tryb obliczenia kosztu energii elektrycznej na trasie. Znając swoje średnie zużycie
          energii na 100 km, połączone z Twoją uśrednioną ceną prądu, szybko sprawdzisz swój orientacyjny rachunek za trasę elektrykiem.
        </p>

        <h3 className="text-base font-semibold text-foreground mt-6">
          Jedno sprawdzenie zamyka temat
        </h3>
        <p>
          Największa różnica polega na tym, że przestajesz wracać do pytania o koszt.
          Nie liczysz po powrocie. Nie zastanawiasz się przy tankowaniu. Nie sprawdzasz, czy ktoś dopłacił tyle ile trzeba.
          Po prostu wiesz wcześniej.
        </p>
        <p>
          Czasem potwierdza to przypuszczenia. Czasem całkowicie je zmienia.
          W obu przypadkach decyzja przestaje opierać się na pamięci, a zaczyna na liczbach.
          Właśnie dlatego Trasomat warto zawsze mieć pod ręką.
        </p>
      </div>
    </section>
  );
};
