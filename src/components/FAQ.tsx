import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqItems = [
  {
    question: 'Jak działa kalkulator kosztów przejazdu?',
    answer: 'Wpisujesz skąd jedziesz i dokąd — kalkulator wyznacza realną trasę drogową i na tej podstawie oblicza, ile paliwa zużyjesz i ile to będzie kosztować. Możesz też ręcznie wpisać dystans, jeśli go znasz. Uwzględniamy różne rodzaje paliwa (Pb95, Pb98, Diesel, LPG) oraz opłaty za autostrady.',
  },
  {
    question: 'Czy muszę znać spalanie swojego auta?',
    answer: 'Nie musisz — mamy podpowiedź „Nie wiesz ile pali?", która pozwala wybrać typ auta (małe, kompakt, SUV itd.), a kalkulator sam dobierze typowe spalanie. Wartości są automatycznie przeliczane w zależności od wybranego paliwa — np. na LPG spalanie jest wyższe o ok. 20%.',
  },
  {
    question: 'Czy wynik uwzględnia opłaty za autostrady?',
    answer: 'Tak, ale musisz je wpisać osobno w polu „Opłaty drogowe". Dla popularnych tras (np. Warszawa–Kraków, Poznań–Warszawa) pokazujemy konkretne kwoty za płatne odcinki, żebyś wiedział ile doliczyć. Opłaty są wyraźnie wyszczególnione w wyniku.',
  },
  {
    question: 'Dlaczego wynik może się różnić od rzeczywistości?',
    answer: 'Kalkulator podaje szacunek oparty na średnim spalaniu i aktualnych cenach paliw. W praktyce koszt zależy od wielu czynników: stylu jazdy, prędkości, korków, obciążenia auta, klimatyzacji czy warunków pogodowych. Traktuj wynik jako solidną orientację, nie dokładną kwotę co do grosza.',
  },
  {
    question: 'Co oznacza opcja „w obie strony"?',
    answer: 'Po włączeniu tego przełącznika kalkulator automatycznie podwaja dystans i oblicza łączny koszt przejazdu tam i z powrotem. W wyniku jest to wyraźnie oznaczone, więc od razu wiesz, czy patrzysz na koszt jednej trasy czy dwóch.',
  },
  {
    question: 'Skąd bierzecie ceny paliw?',
    answer: 'Korzystamy ze średnich cen rynkowych aktualizowanych co miesiąc. Ceny wyświetlane w kalkulatorze to orientacyjne średnie krajowe — na konkretnej stacji mogą się nieznacznie różnić. Zawsze możesz wpisać własną cenę, jeśli znasz aktualną cenę na swojej stacji.',
  },
  {
    question: 'Czy mogę porównać koszty różnych paliw?',
    answer: 'Tak! Po obliczeniu kosztu kalkulator automatycznie pokazuje porównanie kosztów przejazdu tą samą trasą na Pb95, Pb98, Dieslu i LPG — z uwzględnieniem typowych różnic w spalaniu między tymi paliwami. Dzięki temu od razu widzisz, które paliwo wychodzi najtaniej.',
  },
];

export const FAQ = () => {
  return (
    <div className="mt-10" id="faq">
      <div className="flex items-center justify-center gap-2 mb-6">
        <HelpCircle className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Często zadawane pytania</h2>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-border/50">
            <AccordionTrigger className="text-left text-foreground hover:text-primary">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }),
        }}
      />
    </div>
  );
};
