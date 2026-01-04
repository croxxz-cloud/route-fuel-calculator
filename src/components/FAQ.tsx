import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqItems = [
  {
    question: 'Czy kalkulator liczy realną trasę drogową?',
    answer: 'Tak! Kalkulator wykorzystuje dane z OpenStreetMap i oblicza dystans na podstawie rzeczywistej trasy samochodowej, uwzględniając drogi, autostrady i objazdy. To nie jest prosta linia prosta między punktami.',
  },
  {
    question: 'Czy muszę znać dokładny dystans?',
    answer: 'Nie! Wystarczy, że wpiszesz punkt startowy i docelowy (np. "Warszawa" i "Kraków"), a kalkulator automatycznie obliczy dystans. Możesz też ręcznie wpisać dystans, jeśli go znasz.',
  },
  {
    question: 'Skąd bierzecie dane o trasie?',
    answer: 'Korzystamy z darmowej i otwartej bazy OpenStreetMap oraz serwisu OSRM (Open Source Routing Machine) do obliczania tras samochodowych. Dane są aktualizowane przez społeczność.',
  },
  {
    question: 'Czy wynik uwzględnia podróż powrotną?',
    answer: 'Domyślnie obliczamy koszt trasy w jedną stronę. Możesz włączyć opcję "W obie strony", aby automatycznie podwoić dystans i obliczyć koszt podróży tam i z powrotem.',
  },
  {
    question: 'Jak dokładne są wyniki?',
    answer: 'Wyniki są szacunkowe i zależą od podanego spalania oraz ceny paliwa. Rzeczywiste zużycie może się różnić w zależności od stylu jazdy, warunków drogowych, obciążenia auta i innych czynników.',
  },
];

export const FAQ = () => {
  return (
    <div className="mt-10">
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
