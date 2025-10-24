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
  backgroundColor: "#f6f9fc", // Domyślne jasne tło
  fontSize: '18px',
};

// Style dla trybu ciemnego i reguły ogólne
const finalThemeStyles = `
  /* Reset koloru tekstu w trybie jasnym, aby uniknąć szarości z tailwind */
  .main-content-text {
    color: #111827 !important; /* Domyślny, ciemny kolor tekstu dla głównej treści */
  }
  .main-content-text-secondary {
    color: #4b5563 !important; /* Domyślny, ciemniejszy szary dla reszty treści */
  }
  .main-content-bg {
    background-color: #ffffff !important;
  }
  
  /* Media Query dla Trybu Ciemnego */
  @media (prefers-color-scheme: dark) {
    body {
      background-color: #1a1a1a !important; 
    }
    .main-content-bg {
      background-color: #222222 !important; /* Ciemne tło dla głównej treści */
    }
    
    /* Zmiana koloru tekstu na jasny w trybie ciemnym */
    .main-content-text {
      color: #f2f2f2 !important; 
    }
    .main-content-text-secondary {
      color: #cccccc !important; 
    }
    .hr {
      border-color: #555555 !important;
    }
  }
`;

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
      <Row key={index} className="mt-[16px]">
        <Column>
          <Img
            alt={`Zdjęcie ${index + 1}`}
            className="w-full rounded-[12px] object-cover" 
            height={288}
            src={url}
          />
        </Column>
      </Row>
    ));
  };

  return (
    <Html>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: finalThemeStyles }} />
      </Head>
      <Body style={mainBodyStyle}>
        
        {/* NAGŁÓWEK (Zawsze czarne tło i biały tekst) - Pełna szerokość */}
        {/* Style inline zapewniają, że tło i tekst są zawsze czarne/białe, niezależnie od trybu dark mode */}
        <Section style={{ width: '100%', backgroundColor: '#000000', padding: '32px 16px' }}>
          <table style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
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
                  style={{ fontSize: '16px', lineHeight: '24px', color: '#dddddd' }}
                >
                  Profesjonalna pielęgnacja miejsc pamięci
                </Text>
              </td>
            </tr>
          </table>
        </Section>

        {/* GŁÓWNA TREŚĆ - Kontener wyśrodkowany z minimalnym paddingiem */}
        <Section className="main-content-bg" style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '0 16px' }}>

          {/* Informacje o kliencie - Szanowny Kliencie */}
          <Section style={{ padding: '24px 0 0 0' }}>
            <Text className="main-content-text" style={{ fontSize: '19px', lineHeight: '28px', fontWeight: '600', margin: '0 0 8px 0' }}>
              Szanowny Kliencie,
            </Text>
            <Text className="main-content-text-secondary" style={{ fontSize: '19px', lineHeight: '30px', margin: '12px 0' }}>
              Z przyjemnością informujemy, że w dniu 
              <strong style={{ whiteSpace: 'nowrap' }}> 📅 {currentDate}</strong> 
              wykonaliśmy zlecone prace porządkowe miejsca spoczynku Państwa bliskich.
            </Text>
          </Section>

          <Hr className="border-gray-200 hr" style={{ margin: '24px 0' }} />

          {/* Opis prac */}
          <Section style={{ padding: '0 0 24px 0' }}>
            <Text className="main-content-text" style={{ fontSize: '20px', lineHeight: '30px', fontWeight: '600', margin: '0 0 12px 0' }}>
              Zakres Wykonanych Prac
            </Text>
            <Text className="main-content-text-secondary" style={{ fontSize: '18px', lineHeight: '30px', margin: '0' }}>
              {description}
            </Text>
          </Section>

          {/* Zdjęcia przed */}
          {photoBeforeUrls.length > 0 && (
            <Section style={{ padding: '16px 0' }}>
              <Text className="main-content-text" style={{ fontSize: '20px', lineHeight: '30px', fontWeight: '600', margin: '0' }}>
                Przed wykonaniem usługi
              </Text>
              <Section style={{ margin: '8px 0' }}>
                {renderImageGrid(photoBeforeUrls)}
              </Section>
            </Section>
          )}

          {/* Zdjęcia po */}
          {photoAfterUrls.length > 0 && (
            <Section style={{ padding: '16px 0' }}>
              <Text className="main-content-text" style={{ fontSize: '20px', lineHeight: '30px', fontWeight: '600', margin: '0' }}>
                Po wykonaniu usługi
              </Text>
              <Section style={{ margin: '8px 0' }}>
                {renderImageGrid(photoAfterUrls)}
              </Section>
            </Section>
          )}

          {/* Opinia Google - Duży przycisk */}
          <Section style={{ padding: '32px 0' }}>
            <Section style={{ backgroundColor: '#f8f9fa', borderRadius: '12px', padding: '24px 32px', textAlign: 'center' }}>
              <Text className="main-content-text" style={{ fontSize: '22px', lineHeight: '32px', fontWeight: '600', margin: '0 0 8px 0' }}>
                ⭐ Podziel się swoją opinią
              </Text>
              <Text className="main-content-text-secondary" style={{ fontSize: '18px', lineHeight: '28px', margin: '0 0 20px 0' }}>
                Twoja opinia pomoże nam w doskonaleniu naszych usług.
              </Text>
              <Button
                style={{
                    backgroundColor: '#1a1a1a', 
                    borderRadius: '8px', 
                    padding: '12px 12px', 
                    textAlign: 'center', 
                    fontWeight: 'bold', 
                    fontSize: '18px', 
                    color: '#ffffff',
                    width: '100%',
                    display: 'block'
                }}
                href="https://g.page/r/CYrcRTvHckvaEBM/review"
              >
                Zostaw opinię w Google
              </Button>
            </Section>
          </Section>

          <Hr className="border-gray-200 hr" />

          {/* Podziękowanie */}
          <Section style={{ padding: '24px 0' }}>
            <Text className="main-content-text-secondary" style={{ textAlign: 'center', fontSize: '18px', lineHeight: '28px', fontStyle: 'italic', margin: '0' }}>
              Dziękujemy za zaufanie i możliwość zadbania o miejsce pamięci Państwa bliskich.
            </Text>
          </Section>
        </Section>
        
        {/* STOPKA (Zawsze czarne tło i biały tekst) - Pełna szerokość */}
        <Section style={{ width: '100%', backgroundColor: '#000000', color: '#f2f2f2', padding: '20px 16px', boxShadow: 'rgba(0, 0, 0, 0.6) 0px 4px 10px' }}>
          <table style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <Row>
              <Column style={{ width: '60%', textAlign: 'left', verticalAlign: 'top', lineHeight: '1.8', wordWrap: 'break-word' }}>
                <Text style={{ fontSize: '18px', color: 'inherit', fontWeight: 'bold', margin: 0 }}>CzystePomniki.pl</Text>
                <Text style={{ margin: '8px 0 0 0', color: 'inherit', fontSize: '15px' }}>
                  ul. Majowa 59<br />
                  05-462 Dziechciniec<br />
                  Tel: <Link style={{ color: 'inherit', textDecoration: 'none' }} href="tel:+48799820556">+48 799 820 556</Link><br />
                  Email: <Link style={{ color: 'inherit', textDecoration: 'none' }} href="mailto:biuro@czystepomniki.pl">biuro@czystepomniki.pl</Link>
                </Text>
              </Column>
              <Column style={{ width: '40%', textAlign: 'center', verticalAlign: 'middle' }}>
                <Img style={{ maxWidth: '30%', height: 'auto', display: 'inline-block' }} src="https://www.czystepomniki.pl/wp-content/uploads/2022/09/cropped-logo_red.webp" alt="Czyste Pomniki" />
                <Text style={{ fontSize: '12px', color: '#dddddd', marginTop: '8px' }}>Profesjonalne usługi sprzątania grobów</Text>
              </Column>
            </Row>
            <Row>
              <Column style={{ textAlign: 'center', paddingTop: '40px', borderTop: '1px solid #333333' }} colSpan={2}>
                <Link style={{ margin: '0 15px', color: '#f2f2f2', fontWeight: 'bold', fontSize: '16px', textDecoration: 'none', fontFamily: 'Arial, sans-serif' }} href="https://www.facebook.com/people/Czystepomnikipl/" rel="noopener">FB</Link>
                <Link style={{ margin: '0 15px', color: '#f2f2f2', fontWeight: 'bold', fontSize: '16px', textDecoration: 'none', fontFamily: 'Arial, sans-serif' }} href="https://x.com/czystepomnikipl/" rel="noopener">X</Link>
              </Column>
            </Row>
          </table>
        </Section>
        
        {/* Dół */}
        <Section style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <Text style={{ textAlign: 'center', fontFamily: "'Book Antiqua', Palatino, serif", fontSize: '14pt', color: '#666', margin: '20px 0' }}>CzystePomniki 2025</Text>
        </Section>
      </Body>
    </Html>
  );
}