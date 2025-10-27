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

// Function to detect gender from Polish name
function detectGenderFromPolishName(name: string): 'male' | 'female' | 'unknown' {
  if (!name) return 'unknown';

  // Split name and get first part (assuming first name is first)
  const firstName = name.trim().split(' ')[0].toLowerCase();

  // Common Polish female name endings
  const femaleEndings = ['a', 'ia', 'la', 'na', 'ra', 'ta', 'wa', 'za'];

  // Common Polish male name endings (but many male names also end with 'a')
  const maleEndings = ['ek', 'el', 'er', 'ik', 'in', 'is', 'on', 'or', 'us'];

  // Check for female endings
  if (femaleEndings.some(ending => firstName.endsWith(ending))) {
    // Special cases where names ending with 'a' are male
    const maleNamesEndingWithA = ['kuba', 'mikołaj', 'bartek', 'marek', 'jarek', 'darek', 'tomek', 'krzysiek', 'michał', 'piotr', 'janusz', 'stanisław', 'jerzy', 'andrzej', 'wojciech', 'tomasz', 'adam', 'marcin', 'paweł', 'łukasz', 'grzegorz', 'robert', 'mariusz', 'dariusz', 'krzysztof', 'rafal', 'arkadiusz', 'bogdan', 'cezary', 'damian', 'edward', 'filip', 'gabriel', 'henryk', 'ireneusz', 'jakub', 'karol', 'leszek', 'maciej', 'norbert', 'oskar', 'patryk', 'radosław', 'sebastian', 'szymon', 'tadeusz', 'wiktor', 'zbigniew', 'aleksander', 'bartłomiej', 'bartosz', 'dominik', 'emil', 'feliks', 'gustaw', 'hubert', 'ignacy', 'józef', 'kamil', 'konrad', 'leon', 'mateusz', 'nikodem', 'oliwier', 'przemysław', 'remigiusz', 'sławomir', 'teodor', 'władysław', 'zenon', 'zygmunt'];

    if (maleNamesEndingWithA.includes(firstName)) {
      return 'male';
    }
    return 'female';
  }

  // Check for male endings
  if (maleEndings.some(ending => firstName.endsWith(ending))) {
    return 'male';
  }

  // Default to unknown if can't determine
  return 'unknown';
}

// Globalne style dla Body
const mainBodyStyle = {
  fontFamily: "'Book Antiqua', 'Palatino Linotype', Palatino, serif",
  backgroundColor: "#f6f9fc", // Jasne tło
  fontSize: '18px',
};

// Stałe padding dla sekcji treści (responsywny)
const CONTENT_PADDING = '20px';

// Stały styl dla czarnego przycisku opinii
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

  // Use provided greeting or determine from name
  const finalGreeting = greeting || (() => {
    const gender = detectGenderFromPolishName(contactName);
    return gender === 'female' ? 'Szanowna Pani,' : gender === 'male' ? 'Szanowny Panie,' : 'Szanowny Kliencie,';
  })();

  const renderImageGrid = (urls: string[]) => {
    return urls.map((url, index) => (
      <Row key={index} style={{ marginTop: '16px' }}>
        <Column>
          <Img
            alt={`Zdjęcie ${index + 1}`}
            // Użycie stylów inline zamiast klas Tailwind wewnątrz komponentów React Email
            style={{ width: '100%', borderRadius: '12px', objectFit: 'cover' }} 
            height={288}
            src={url}
          />
        </Column>
      </Row>
    ));
  };

  // Centralny kontener o stałej szerokości dla treści, osadzony w sekcji pełnej szerokości
  const ContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div style={{
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      padding: `0 ${CONTENT_PADDING}`,
      boxSizing: 'border-box'
    }}>
      {children}
    </div>
  );

  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no" />
        <style dangerouslySetInnerHTML={{
          __html: `
            @media only screen and (max-width: 600px) {
              .mobile-full-width { width: 100% !important; }
              .mobile-padding { padding: 10px !important; }
              .mobile-text-center { text-align: center !important; }
              .mobile-font-size { font-size: 16px !important; line-height: 24px !important; }
            }
          `
        }} />
      </Head>
      <Body style={mainBodyStyle}>
        
        {/* SEKCJA 1: NAGŁÓWEK (Zawsze czarne tło, biały tekst) - Pełna szerokość */}
        <Section style={{ width: '100%', backgroundColor: '#000000', padding: '32px 0' }} className="mobile-padding">
          <ContentWrapper>
            <table style={{ width: '100%' }}>
              <tr>
                <td align="center">
                  <Img
                    alt="Czyste Pomniki Logo"
                    height="60"
                    src="https://www.czystepomniki.pl/wp-content/uploads/2022/09/cropped-logo_red.webp"
                  />
                  <h1
                    style={{ margin: '8px 0', fontSize: '26px', lineHeight: '34px', color: '#ffffff', fontWeight: '600' }}
                    className="mobile-font-size mobile-text-center"
                  >
                    CzystePomniki.pl
                  </h1>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <h1
                    style={{ margin: '16px 0', fontSize: '22px', lineHeight: '32px', color: '#ffffff', fontWeight: '600' }}
                    className="mobile-font-size mobile-text-center"
                  >
                    Podsumowanie Wykonanych Prac
                  </h1>
                  <Text 
                    style={{ fontSize: '16px', lineHeight: '24px', color: '#dddddd', margin: '4px 0 0 0' }}
                  >
                    Profesjonalna pielęgnacja miejsc pamięci
                  </Text>
                </td>
              </tr>
            </table>
          </ContentWrapper>
        </Section>

        {/* SEKCJA 2: INFORMACJE O KLIENCIE (Białe tło, Ciemny tekst) */}
        <Section style={{ backgroundColor: '#ffffff', padding: '24px 0 0 0' }}>
          <ContentWrapper>
            <Text style={{ fontSize: '19px', lineHeight: '28px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>
              {finalGreeting}
            </Text>
            <Text style={{ fontSize: '19px', lineHeight: '30px', color: '#4b5563', margin: '12px 0' }}>
              Z przyjemnością informujemy, że w dniu 
              <strong style={{ whiteSpace: 'nowrap' }}> 📅 {currentDate}</strong>&nbsp;
              wykonaliśmy zlecone prace porządkowe miejsca spoczynku Państwa bliskich.
            </Text>
          </ContentWrapper>
        </Section>

        {/* SEKCJA 3: LINIA POZIOMA */}
        <Section style={{ backgroundColor: '#ffffff' }}>
          <ContentWrapper>
            <Hr style={{ margin: '24px 0', borderColor: '#e5e7eb' }} />
          </ContentWrapper>
        </Section>

        {/* SEKCJA 4: SZCZEGÓŁY USŁUGI (Białe tło, Ciemny tekst) */}
        {(servicePackage || cemetery || graveLocation) && (
          <Section style={{ backgroundColor: '#ffffff', padding: '0 0 24px 0' }}>
            <ContentWrapper>
              <Text style={{ fontSize: '20px', lineHeight: '30px', fontWeight: '600', color: '#111827', margin: '0 0 12px 0' }}>
                Szczegóły Usługi
              </Text>
              {servicePackage && (
                <Text style={{ fontSize: '18px', lineHeight: '28px', color: '#4b5563', margin: '0 0 8px 0' }}>
                  <strong>Pakiet usług:</strong> {servicePackage}
                </Text>
              )}
              {cemetery && (
                <Text style={{ fontSize: '18px', lineHeight: '28px', color: '#4b5563', margin: '0 0 8px 0' }}>
                  <strong>Cmentarz:</strong> {cemetery}
                </Text>
              )}
              {graveLocation && (
                <Text style={{ fontSize: '18px', lineHeight: '28px', color: '#4b5563', margin: '0 0 8px 0' }}>
                  <strong>Lokalizacja grobu:</strong> {graveLocation}
                </Text>
              )}
              {googlePlusCode && (
                <Text style={{ fontSize: '18px', lineHeight: '28px', color: '#4b5563', margin: '0 0 8px 0' }}>
                  <strong>📍 Google Plus Code:</strong> {googlePlusCode}
                </Text>
              )}
            </ContentWrapper>
          </Section>
        )}

        {/* SEKCJA 5: LINIA POZIOMA */}
        <Section style={{ backgroundColor: '#ffffff' }}>
          <ContentWrapper>
            <Hr style={{ margin: '24px 0', borderColor: '#e5e7eb' }} />
          </ContentWrapper>
        </Section>

        {/* SEKCJA 6: WYKONANE USŁUGI (Białe tło, Ciemny tekst) */}
        {services.length > 0 && (
          <Section style={{ backgroundColor: '#ffffff', padding: '0 0 24px 0' }}>
            <ContentWrapper>
              <Text style={{ fontSize: '20px', lineHeight: '30px', fontWeight: '600', color: '#111827', margin: '0 0 12px 0' }}>
                Wykonane Usługi
              </Text>
              <ul style={{ fontSize: '18px', lineHeight: '30px', color: '#4b5563', margin: '0', paddingLeft: '20px' }}>
                {services.map((service, index) => (
                  <li key={index} style={{ marginBottom: '8px' }}>
                    {service === 'sweeping' && '🧹 Zamiatanie'}
                    {service === 'washing' && '💧 Mycie'}
                    {service === 'flower-removal' && '🌸 Usunięcie starych kwiatów'}
                    {service === 'area-cleaning' && '🧽 Sprzątanie okolicy pomnika'}
                    {service === 'weed-removal' && '🌿 Usuwanie chwastów i pielęgnacja'}
                    {service === 'wreath-removal' && '💐 Usunięcie wieńców i zniczy'}
                    {service === 'detailed-cleaning' && '✨ Dokładne czyszczenie'}
                    {service === 'area-maintenance' && '🌳 Pielęgnacja terenu wokół grobu'}
                  </li>
                ))}
              </ul>
            </ContentWrapper>
          </Section>
        )}

        {/* SEKCJA 7: OPIS PRAC (Białe tło, Ciemny tekst) */}
        <Section style={{ backgroundColor: '#ffffff', padding: '0 0 24px 0' }}>
          <ContentWrapper>
            <Text style={{ fontSize: '20px', lineHeight: '30px', fontWeight: '600', color: '#111827', margin: '0 0 12px 0' }}>
              Zakres Wykonanych Prac
            </Text>
            <Text style={{ fontSize: '18px', lineHeight: '30px', color: '#4b5563', margin: '0' }}>
              {description}
            </Text>
          </ContentWrapper>
        </Section>

        {/* SEKCJA 8: DOKUMENTACJA FOTOGRAFICZNA (Białe tło, Ciemny tekst) */}
        {(photoBeforeUrls.length > 0 || photoAfterUrls.length > 0) && (
          <Section style={{ backgroundColor: '#ffffff', padding: '40px 0' }}>
            <ContentWrapper>
              <Text style={{ fontSize: '24px', lineHeight: '36px', fontWeight: '700', color: '#111827', margin: '0 0 24px 0', textAlign: 'center' as const }}>
                📸 Dokumentacja fotograficzna
              </Text>

              {photoBeforeUrls.length > 0 && (
                <Section style={{ marginBottom: '32px' }}>
                  <Text style={{ fontSize: '20px', lineHeight: '30px', fontWeight: '600', color: '#111827', margin: '0 0 16px 0' }}>
                    Przed wykonaniem usługi
                  </Text>
                  <Section style={{ margin: '8px 0' }}>
                    {renderImageGrid(photoBeforeUrls)}
                  </Section>
                </Section>
              )}

              {photoAfterUrls.length > 0 && (
                <Section>
                  <Text style={{ fontSize: '20px', lineHeight: '30px', fontWeight: '600', color: '#111827', margin: '0 0 16px 0' }}>
                    Po wykonaniu usługi
                  </Text>
                  <Section style={{ margin: '8px 0' }}>
                    {renderImageGrid(photoAfterUrls)}
                  </Section>
                </Section>
              )}
            </ContentWrapper>
          </Section>
        )}

        {/* SEKCJA 9: OPINIA GOOGLE (Białe tło, Ciemny tekst) */}
        <Section style={{ backgroundColor: '#ffffff', padding: '120px 0 160px 0' }}>
          <ContentWrapper>
            <Section style={{ backgroundColor: '#f8f9fa', borderRadius: '12px', padding: '32px 16px', textAlign: 'center' as const }} className="mobile-padding">
              <Text style={{ fontSize: '22px', lineHeight: '32px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }} className="mobile-font-size">
                ⭐ Podziel się swoją opinią
              </Text>
              <Text style={{ fontSize: '18px', lineHeight: '28px', color: '#4b5563', margin: '0 0 20px 0' }} className="mobile-font-size">
                Twoja opinia pomoże nam w doskonaleniu naszych usług.
              </Text>
              <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <Button
                  style={{...opinionButtonStyle, fontSize: '16px', padding: '14px 16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', minWidth: '200px'}}
                  className="mobile-full-width"
                  href="https://g.page/r/CYrcRTvHckvaEBM/review"
                >
                  <Img
                    src="https://czystepomniki-app-backend.vercel.app/social/google.svg"
                    width="20"
                    height="20"
                    alt="Google"
                    style={{
                      verticalAlign: 'middle'
                    }}
                  />
                  Zostaw opinię w Google
                </Button>
              </div>
            </Section>
          </ContentWrapper>
        </Section>

        {/* SEKCJA 10: PODZIĘKOWANIE (Białe tło, Ciemny tekst) */}
        <Section style={{ backgroundColor: '#ffffff', padding: '80px 0 120px 0' }}>
          <ContentWrapper>
            <Hr style={{ margin: '0 0 60px 0', borderColor: '#e5e7eb' }} />
            <Text style={{ textAlign: 'center' as const, fontSize: '20px', lineHeight: '32px', color: '#4b5563', fontStyle: 'italic', margin: '0', fontWeight: '500' }}>
              Dziękujemy za zaufanie i możliwość zadbania o miejsce pamięci Państwa bliskich.
            </Text>
          </ContentWrapper>
        </Section>
        
        {/* SEKCJA 11: STOPKA (Zawsze czarne tło, biały tekst) - Zwiększony padding góry */}
        <Section style={{ width: '100%', backgroundColor: '#000000', color: '#f2f2f2', padding: '40px 0', boxShadow: 'rgba(0, 0, 0, 0.6) 0px 4px 10px' }}>
          <ContentWrapper>
            <table style={{ width: '100%', tableLayout: 'fixed' }}>
              <Row>
                <Column style={{ width: '100%', textAlign: 'center' as const, verticalAlign: 'top', lineHeight: '1.8', wordWrap: 'break-word' }} className="mobile-full-width">
                  <Text style={{ fontSize: '18px', color: 'inherit', fontWeight: 'bold', margin: 0, textAlign: 'center' as const }}>CzystePomniki.pl</Text>
                  <Text style={{ margin: '8px 0 0 0', color: 'inherit', fontSize: '15px', textAlign: 'center' as const }}>
                    ul. Majowa 59<br />
                    05-462 Dziechciniec<br />
                    Tel: <Link style={{ color: 'inherit', textDecoration: 'none' }} href="tel:+48799820556">+48 799 820 556</Link><br />
                    Email: <Link style={{ color: 'inherit', textDecoration: 'none' }} href="mailto:biuro@czystepomniki.pl">biuro@czystepomniki.pl</Link>
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column style={{ width: '100%', textAlign: 'center' as const, verticalAlign: 'middle' }}>
                  <Img style={{ maxWidth: '30%', height: 'auto', display: 'inline-block', margin: '20px 0' }} src="https://www.czystepomniki.pl/wp-content/uploads/2022/09/cropped-logo_red.webp" alt="Czyste Pomniki" />
                  <Text style={{ fontSize: '12px', color: '#dddddd', marginTop: '8px', textAlign: 'center' as const }}>Profesjonalne usługi sprzątania grobów</Text>
                </Column>
              </Row>
              <Row style={{ borderTop: '1px solid #333333', paddingTop: '20px', marginTop: '20px' }}>
                <Column style={{ textAlign: 'center' as const, width: '100%' }} colSpan={2}>
                  {/* Ikona Facebook */}
                  <Link href="https://www.facebook.com/people/Czystepomnikipl/" rel="noopener" style={{ margin: '0 8px', display: 'inline-block', verticalAlign: 'middle' }}>
                    <Img
                      src="https://czystepomniki-app-backend.vercel.app/social/faceboook.svg"
                      width="24"
                      height="24"
                      alt="Facebook"
                      style={{
                        verticalAlign: 'middle'
                      }}
                    />
                  </Link>
                  {/* Ikona X (Twitter) */}
                  <Link href="https://x.com/czystepomnikipl/" rel="noopener" style={{ margin: '0 8px', display: 'inline-block', verticalAlign: 'middle' }}>
                    <Img
                      src="https://czystepomniki-app-backend.vercel.app/social/x.svg"
                      width="24"
                      height="24"
                      alt="X (Twitter)"
                      style={{
                        verticalAlign: 'middle'
                      }}
                    />
                  </Link>
                </Column>
              </Row>
            </table>
          </ContentWrapper>
        </Section>
        
        {/* SEKCJA 12: PRAW AUTORSKICH (Jasne tło) */}
        <Section style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <Text style={{ textAlign: 'center' as const, fontFamily: "'Book Antiqua', Palatino, serif", fontSize: '14pt', color: '#666', margin: '20px 0' }}>CzystePomniki 2025</Text>
        </Section>
      </Body>
    </Html>
  );
}