import { Section, Row, Text, Column, Img, Link, Html, Head, Body, Hr, Button } from "@react-email/components";

interface SummaryEmailProps {
  contactName: string;
  email: string;
  description: string;
  currentDate: string;
  photoBeforeUrls: string[];
  photoAfterUrls: string[];
}

// Globalne style dla Body
const mainBodyStyle = {
  fontFamily: "'Book Antiqua', 'Palatino Linotype', Palatino, serif",
  backgroundColor: "#f6f9fc", // Jasne tło
  fontSize: '18px',
};

// Stałe padding dla sekcji treści (minimalny)
const CONTENT_PADDING = '16px'; 

// Stały styl dla czarnego przycisku opinii
const opinionButtonStyle = {
    backgroundColor: '#1a1a1a', 
    borderRadius: '8px', 
    padding: '12px 12px', 
    textAlign: 'center' as const, 
    fontWeight: 'bold', 
    fontSize: '18px', 
    color: '#ffffff',
    width: '100%',
    display: 'block',
};

export default function SummaryEmail({
  contactName,
  email,
  description,
  currentDate,
  photoBeforeUrls,
  photoAfterUrls
}: SummaryEmailProps) {
  
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
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: `0 ${CONTENT_PADDING}` }}>
      {children}
    </div>
  );

  return (
    <Html>
      <Head />
      <Body style={mainBodyStyle}>
        
        {/* SEKCJA 1: NAGŁÓWEK (Zawsze czarne tło, biały tekst) - Pełna szerokość */}
        <Section style={{ width: '100%', backgroundColor: '#000000', padding: '32px 0' }}>
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
                  >
                    CzystePomniki.pl
                  </h1>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <h1 
                    style={{ margin: '16px 0', fontSize: '22px', lineHeight: '32px', color: '#ffffff', fontWeight: '600' }}
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
              Szanowny Kliencie,
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

        {/* SEKCJA 4: OPIS PRAC (Białe tło, Ciemny tekst) */}
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

        {/* SEKCJA 5: ZDJĘCIA PRZED (Białe tło, Ciemny tekst) */}
        {photoBeforeUrls.length > 0 && (
          <Section style={{ backgroundColor: '#ffffff', padding: '16px 0' }}>
            <ContentWrapper>
              <Text style={{ fontSize: '20px', lineHeight: '30px', fontWeight: '600', color: '#111827', margin: '0' }}>
                Przed wykonaniem usługi
              </Text>
              <Section style={{ margin: '8px 0' }}>
                {renderImageGrid(photoBeforeUrls)}
              </Section>
            </ContentWrapper>
          </Section>
        )}

        {/* SEKCJA 6: ZDJĘCIA PO (Białe tło, Ciemny tekst) */}
        {photoAfterUrls.length > 0 && (
          <Section style={{ backgroundColor: '#ffffff', padding: '16px 0' }}>
            <ContentWrapper>
              <Text style={{ fontSize: '20px', lineHeight: '30px', fontWeight: '600', color: '#111827', margin: '0' }}>
                Po wykonaniu usługi
              </Text>
              <Section style={{ margin: '8px 0' }}>
                {renderImageGrid(photoAfterUrls)}
              </Section>
            </ContentWrapper>
          </Section>
        )}

        {/* SEKCJA 7: OPINIA GOOGLE (Białe tło, Ciemny tekst) */}
        <Section style={{ backgroundColor: '#ffffff', padding: '32px 0' }}>
          <ContentWrapper>
            <Section style={{ backgroundColor: '#f8f9fa', borderRadius: '12px', padding: '24px 32px', textAlign: 'center' as const }}>
              <Text style={{ fontSize: '22px', lineHeight: '32px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>
                ⭐ Podziel się swoją opinią
              </Text>
              <Text style={{ fontSize: '18px', lineHeight: '28px', color: '#4b5563', margin: '0 0 20px 0' }}>
                Twoja opinia pomoże nam w doskonaleniu naszych usług.
              </Text>
              <Button
                style={opinionButtonStyle}
                href="https://g.page/r/CYrcRTvHckvaEBM/review"
              >
                Zostaw opinię w Google
              </Button>
            </Section>
          </ContentWrapper>
        </Section>

        {/* SEKCJA 8: PODZIĘKOWANIE (Białe tło, Ciemny tekst) */}
        <Section style={{ backgroundColor: '#ffffff', padding: '0 0 24px 0' }}>
          <ContentWrapper>
            <Hr style={{ margin: '0 0 24px 0', borderColor: '#e5e7eb' }} />
            <Text style={{ textAlign: 'center' as const, fontSize: '18px', lineHeight: '28px', color: '#4b5563', fontStyle: 'italic', margin: '0' }}>
              Dziękujemy za zaufanie i możliwość zadbania o miejsce pamięci Państwa bliskich.
            </Text>
          </ContentWrapper>
        </Section>
        
        {/* SEKCJA 9: STOPKA (Zawsze czarne tło, biały tekst) - Zwiększony padding góry */}
        <Section style={{ width: '100%', backgroundColor: '#000000', color: '#f2f2f2', padding: '40px 0', boxShadow: 'rgba(0, 0, 0, 0.6) 0px 4px 10px' }}>
          <ContentWrapper>
            <table style={{ width: '100%', tableLayout: 'fixed' }}>
              <Row>
                <Column style={{ width: '60%', textAlign: 'left' as const, verticalAlign: 'top', lineHeight: '1.8', wordWrap: 'break-word' }}>
                  <Text style={{ fontSize: '18px', color: 'inherit', fontWeight: 'bold', margin: 0 }}>CzystePomniki.pl</Text>
                  <Text style={{ margin: '8px 0 0 0', color: 'inherit', fontSize: '15px' }}>
                    ul. Majowa 59<br />
                    05-462 Dziechciniec<br />
                    Tel: <Link style={{ color: 'inherit', textDecoration: 'none' }} href="tel:+48799820556">+48 799 820 556</Link><br />
                    Email: <Link style={{ color: 'inherit', textDecoration: 'none' }} href="mailto:biuro@czystepomniki.pl">biuro@czystepomniki.pl</Link>
                  </Text>
                </Column>
                <Column style={{ width: '40%', textAlign: 'center' as const, verticalAlign: 'middle' }}>
                  <Img style={{ maxWidth: '30%', height: 'auto', display: 'inline-block' }} src="https://www.czystepomniki.pl/wp-content/uploads/2022/09/cropped-logo_red.webp" alt="Czyste Pomniki" />
                  <Text style={{ fontSize: '12px', color: '#dddddd', marginTop: '8px' }}>Profesjonalne usługi sprzątania grobów</Text>
                </Column>
              </Row>
              <Row style={{ borderTop: '1px solid #333333', paddingTop: '40px', marginTop: '40px' }}>
                <Column style={{ textAlign: 'center' as const }} colSpan={2}>
                  {/* Ikona Facebook */}
                  <Link href="https://www.facebook.com/people/Czystepomnikipl/" rel="noopener" style={{ margin: '0 8px', display: 'inline-block' }}>
                    <Img 
                      src="https://upload.wikimedia.org/wikipedia/commons/7/71/Facebook_white_icon_svg.svg" 
                      alt="Facebook" 
                      width="24" 
                      height="24" 
                      style={{ verticalAlign: 'middle' }} 
                    />
                  </Link>
                  {/* Ikona X (Twitter) */}
                  <Link href="https://x.com/czystepomnikipl/" rel="noopener" style={{ margin: '0 8px', display: 'inline-block' }}>
                    <Img 
                      src="https://upload.wikimedia.org/wikipedia/commons/4/4f/X_logo_2023.svg" // Zaktualizowany link do ikony X, jeśli poprzedni nie zadziała (wikipedia może zmienić)
                      alt="X (Twitter)" 
                      width="24" 
                      height="24" 
                      style={{ verticalAlign: 'middle' }} 
                    />
                  </Link>
                </Column>
              </Row>
            </table>
          </ContentWrapper>
        </Section>
        
        {/* SEKCJA 10: PRAW AUTORSKICH (Jasne tło) */}
        <Section style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <Text style={{ textAlign: 'center' as const, fontFamily: "'Book Antiqua', Palatino, serif", fontSize: '14pt', color: '#666', margin: '20px 0' }}>CzystePomniki 2025</Text>
        </Section>
      </Body>
    </Html>
  );
}