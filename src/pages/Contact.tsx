import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Send, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const WEB3FORMS_KEY = 'fa071a5b-fc9d-4041-9eb2-b29f4d1c6e8d';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim() || 'Wiadomość z Trasomat.pl',
          message: message.trim(),
          from_name: 'Trasomat.pl',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        throw new Error(data.message || 'Wystąpił błąd');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Nie udało się wysłać wiadomości. Spróbuj ponownie.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Kontakt | Trasomat.pl</title>
        <meta name="description" content="Skontaktuj się z nami. Masz pytanie, sugestię lub znalazłeś błąd? Napisz do nas." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 md:py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Powrót do kalkulatora
          </Link>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Kontakt</h1>
                <p className="text-sm text-muted-foreground">Napisz do nas – odpowiadamy w ciągu 24 godzin</p>
              </div>
            </div>

            {status === 'success' ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">Dziękujemy!</h2>
                <p className="text-muted-foreground mb-6">
                  Twoja wiadomość została wysłana. Odpowiemy najszybciej jak to możliwe.
                </p>
                <Button variant="outline" onClick={() => setStatus('idle')}>
                  Wyślij kolejną wiadomość
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-1.5">
                      Imię i nazwisko
                    </label>
                    <Input
                      id="contact-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jan Kowalski"
                      required
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-1.5">
                      Adres e-mail
                    </label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jan@example.com"
                      required
                      maxLength={255}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-medium text-foreground mb-1.5">
                    Temat
                  </label>
                  <Input
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Np. Błąd w kalkulatorze, Propozycja funkcji..."
                    maxLength={200}
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-1.5">
                    Wiadomość
                  </label>
                  <Textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Opisz swoje pytanie lub sugestię..."
                    rows={6}
                    required
                    maxLength={2000}
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    {message.length}/2000
                  </p>
                </div>

                {status === 'error' && (
                  <p className="text-sm text-destructive text-center">{errorMsg}</p>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold gap-2"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Wysyłanie...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Wyślij wiadomość
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
