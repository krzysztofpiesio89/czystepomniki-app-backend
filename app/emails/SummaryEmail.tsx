import { Section, Row, Text, Column, Img, Link, Html, Head, Body, Hr, Button } from "@react-email/components";

interface SummaryEmailProps {
  contactName: string;
  email: string;
  greeting?: string;
  servicePackage?: string;
  servicePrice?: string;
  cemetery?: string;
  graveLocation?: string;
  googlePlusCode?: string;
  description: string;
  currentDate: string;
  photoBeforeUrls: string[];
  photoAfterUrls: string[];
  services?: string[];
}

// Funkcja wykrywająca płeć po imieniu
function detectGenderFromPolishName(name: string): 'male' | 'female' | 'unknown' {
  if (!name) return 'unknown';
  const firstName = name.trim().split(' ')[0].toLowerCase();
  const femaleEndings = ['a', 'ia', 'la', 'na', 'ra', 'ta', 'wa', 'za'];
  const maleEndings = ['ek', 'el', 'er', 'ik', 'in', 'is', 'on', 'or', 'us'];
  if (femaleEndings.some(e => firstName.endsWith(e))) {
    const maleNamesEndingWithA = ['kuba', 'mikołaj', 'marek', 'tomek', 'bartek', 'darek', 'andrzej', 'adam', 'wojciech', 'paweł', 'marcin', 'piotr'];
    if (maleNamesEndingWithA.includes(firstName)) return 'male';
    return 'female';
  }
  if (maleEndings.some(e => firstName.endsWith(e))) return 'male';
  return 'unknown';
}

const mainBodyStyle = {
  fontFamily: "'Book Antiqua', 'Palatino Linotype', Palatino, serif",
  backgroundColor: "#f6f9fc",
  fontSize: '18px',
};

const CONTENT_PADDING = '20px';

const opinionButtonStyle = {
  backgroundColor: '#1a1a1a',
  borderRadius: '8px',
  padding: '12px 12px',
  textAlign: 'center' as const,
  fontWeight: 'bold',
  fontSize: '18px',
  color: '#ffffff',
  display: 'inline-block',
  margin: '0 auto',
};

export default function SummaryEmail({
  contactName,
  email,
  greeting,
  servicePackage,
  servicePrice,
  cemetery,
  graveLocation,
  googlePlusCode,
  description,
  currentDate,
  photoBeforeUrls,
  photoAfterUrls,
  services = []
}: SummaryEmailProps) {

  const finalGreeting = greeting || (() => {
    const gender = detectGenderFromPolishName(contactName);
    return gender === 'female' ? 'Szanowna Pani,' : gender === 'male' ? 'Szanowny Panie,' : 'Szanowny Kliencie,';
  })();

  const renderImageGrid = (urls: string[]) =>
    urls.map((url, i) => (
      <Row key={i} style={{ marginTop: '16px' }}>
        <Column>
          <Img alt={`Zdjęcie ${i + 1}`} style={{ width: '100%', borderRadius: '12px', objectFit: 'cover' }} height={288} src={url} />
        </Column>
      </Row>
    ));

  const ContentWrapper = ({ children }: { children?: React.ReactNode }) => (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: `0 ${CONTENT_PADDING}`, boxSizing: 'border-box' }}>
      {children}
    </div>
  );

  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style dangerouslySetInnerHTML={{
          __html: `
          @media only screen and (max-width: 600px) {
            .mobile-full-width { width: 100% !important; }
            .mobile-padding { padding: 10px !important; }
            .mobile-text-center { text-align: center !important; }
          }
        `}} />
      </Head>
      <Body style={mainBodyStyle}>

        {/* NAGŁÓWEK */}
        <Section style={{ backgroundColor: '#000', padding: '60px 0 50px' }}>
          <ContentWrapper>
            <Img alt="Logo" height="60" src="https://www.czystepomniki.pl/wp-content/uploads/2022/09/cropped-logo_red.webp" style={{ display: 'block', margin: '0 auto' }} />
            <h1 style={{ color: '#fff', fontSize: '26px', margin: '8px 0', textAlign: 'center' }}>CzystePomniki.pl</h1>
            <h2 style={{ color: '#fff', fontSize: '22px', margin: '16px 0', textAlign: 'center' }}>Podsumowanie Wykonanych Prac</h2>
            <Text style={{ color: '#ddd', textAlign: 'center' }}>Profesjonalna pielęgnacja miejsc pamięci</Text>
          </ContentWrapper>
        </Section>

        {/* POWITANIE */}
        <Section style={{ backgroundColor: '#fff', padding: '60px 0 40px' }}>
          <ContentWrapper>
            <Text style={{ fontSize: '20px', fontWeight: 600, fontStyle: 'italic', marginBottom: '16px' }}>{finalGreeting}</Text>
            <Text style={{ fontSize: '18px', lineHeight: '28px', color: '#4b5563' }}>
              Z przyjemnością informujemy, że w dniu <strong>📅 {currentDate}</strong> wykonaliśmy zlecone prace porządkowe miejsca spoczynku Państwa bliskich.
            </Text>
          </ContentWrapper>
        </Section>

        <Section style={{ backgroundColor: '#fff' }}>
          <ContentWrapper><Hr style={{ margin: '40px auto', borderColor: '#e5e7eb', width: '60%' }} /></ContentWrapper>
        </Section>

        {/* SZCZEGÓŁY USŁUGI */}
        {(servicePackage || cemetery || graveLocation) && (
          <Section style={{ backgroundColor: '#fff', padding: '40px 0' }}>
            <ContentWrapper>
              <Text style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Szczegóły Usługi</Text>
              {servicePackage && <Text><strong>Pakiet:</strong> {servicePackage}</Text>}
              {cemetery && <Text><strong>Cmentarz:</strong> {cemetery}</Text>}
              {graveLocation && <Text><strong>Lokalizacja:</strong> {graveLocation}</Text>}
              {googlePlusCode && <Text><strong>📍 Google Plus Code:</strong> {googlePlusCode}</Text>}
            </ContentWrapper>
          </Section>
        )}

        <Section style={{ backgroundColor: '#fff' }}>
          <ContentWrapper><Hr style={{ margin: '40px auto', borderColor: '#e5e7eb', width: '60%' }} /></ContentWrapper>
        </Section>

        {/* WYKONANE USŁUGI */}
        {services.length > 0 && (
          <Section style={{ backgroundColor: '#fff', padding: '40px 0' }}>
            <ContentWrapper>
              <Text style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Wykonane Usługi</Text>
              <ul style={{ lineHeight: '30px', paddingLeft: '20px', color: '#4b5563' }}>
                {services.map((s, i) => (
                  <li key={i}>{{
                    sweeping: '🧹 Zamiatanie',
                    washing: '💧 Mycie',
                    'flower-removal': '🌸 Usunięcie starych kwiatów',
                    'area-cleaning': '🧽 Sprzątanie okolicy pomnika',
                    'weed-removal': '🌿 Usuwanie chwastów i pielęgnacja',
                    'wreath-removal': '💐 Usunięcie wieńców i zniczy',
                    'detailed-cleaning': '✨ Dokładne czyszczenie',
                    'area-maintenance': '🌳 Pielęgnacja terenu wokół grobu',
                  }[s]}</li>
                ))}
              </ul>
            </ContentWrapper>
          </Section>
        )}

        {/* OPIS */}
        <Section style={{ backgroundColor: '#fff', padding: '40px 0' }}>
          <ContentWrapper>
            <Text style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Zakres Wykonanych Prac</Text>
            <Text style={{ fontSize: '18px', color: '#4b5563', textAlign: 'justify' }}>{description}</Text>
          </ContentWrapper>
        </Section>

        {/* ZDJĘCIA */}
        {(photoBeforeUrls.length > 0 || photoAfterUrls.length > 0) && (
          <Section style={{ backgroundColor: '#fff', padding: '60px 0' }}>
            <ContentWrapper>
              <Text style={{ fontSize: '24px', fontWeight: 700, textAlign: 'center', marginBottom: '30px' }}>📸 Dokumentacja fotograficzna</Text>
              {photoBeforeUrls.length > 0 && (
                <>
                  <Text style={{ fontSize: '20px', fontWeight: 600 }}>Przed wykonaniem usługi</Text>
                  {renderImageGrid(photoBeforeUrls)}
                </>
              )}
              {photoAfterUrls.length > 0 && (
                <>
                  <Text style={{ fontSize: '20px', fontWeight: 600, marginTop: '40px' }}>Po wykonaniu usługi</Text>
                  {renderImageGrid(photoAfterUrls)}
                </>
              )}
            </ContentWrapper>
          </Section>
        )}

        {/* OPINIA */}
        <Section style={{ backgroundColor: '#fff', padding: '60px 0' }}>
          <ContentWrapper>
            <Section style={{ backgroundColor: '#f8f9fa', borderRadius: '12px', padding: '32px 16px', textAlign: 'center' }}>
              <Text style={{ fontSize: '22px', fontWeight: 600, marginBottom: '8px' }}>⭐ Podziel się swoją opinią</Text>
              <Text style={{ fontSize: '18px', marginBottom: '20px' }}>Twoja opinia pomoże nam w doskonaleniu usług.</Text>
              <Button
                style={{ ...opinionButtonStyle, fontSize: '16px', padding: '14px 16px', minWidth: '200px' }}
                href="https://g.page/r/CYrcRTvHckvaEBM/review"
              >
                ⭐ Zostaw opinię w Google
              </Button>
            </Section>
          </ContentWrapper>
        </Section>

        {/* PODZIĘKOWANIE */}
        <Section style={{ backgroundColor: '#fff', padding: '60px 0 70px' }}>
          <ContentWrapper>
            <Hr style={{ margin: '0 0 30px 0', borderColor: '#e5e7eb' }} />
            <Text style={{ textAlign: 'center', fontSize: '20px', fontStyle: 'italic', color: '#4b5563' }}>
              Dziękujemy za zaufanie i możliwość zadbania o miejsce pamięci Państwa bliskich.
            </Text>
          </ContentWrapper>
        </Section>

        {/* STOPKA */}
        <Section style={{ backgroundColor: '#000', color: '#f2f2f2', padding: '70px 0 60px' }}>
          <ContentWrapper>
            <Text style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>CzystePomniki.pl</Text>
            <Text style={{ textAlign: 'center', fontSize: '15px', marginTop: '8px' }}>
              ul. Majowa 59, 05-462 Dziechciniec<br />
              Tel: <Link href="tel:+48799820556" style={{ color: 'inherit' }}>+48 799 820 556</Link><br />
              Email: <Link href="mailto:biuro@czystepomniki.pl" style={{ color: 'inherit' }}>biuro@czystepomniki.pl</Link>
            </Text>
            <Img src="https://www.czystepomniki.pl/wp-content/uploads/2022/09/cropped-logo_red.webp" alt="Logo" style={{ maxWidth: '30%', display: 'block', margin: '20px auto' }} />
            <Text style={{ textAlign: 'center', fontSize: '12px', color: '#ddd' }}>Profesjonalne usługi sprzątania grobów</Text>
            <Hr style={{ margin: '40px 0', borderColor: '#333' }} />
            <Text style={{ textAlign: 'center', fontSize: '14px' }}>
              <Link href="https://www.facebook.com/people/Czystepomnikipl/" style={{ color: 'inherit', margin: '0 8px' }}>Facebook</Link> | 
              <Link href="https://x.com/czystepomnikipl/" style={{ color: 'inherit', margin: '0 8px' }}>X (Twitter)</Link>
            </Text>
          </ContentWrapper>
        </Section>

        <Section>
          <Text style={{ textAlign: 'center', fontSize: '14px', color: '#666', margin: '20px 0' }}>CzystePomniki 2025</Text>
        </Section>

      </Body>
    </Html>
  );
}
