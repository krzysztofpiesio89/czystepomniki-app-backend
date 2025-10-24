import { Section, Row, Text, Column, Img, Link, Html, Head, Body, Container, Hr, Button } from "@react-email/components";

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

// Style dla ciemnego trybu i reguły dla jasnego trybu
const finalThemeStyles = `
  /* Globalne style dla domyślnego (jasnego) trybu */
  .main-content-text {
    color: #111827 !important; /* Domyślny, ciemny kolor tekstu dla głównej treści */
  }
  .main-content-text-secondary {
    color: #4b5563 !important; /* Domyślny, ciemniejszy szary dla reszty treści */
  }
  .main-container {
    background-color: #ffffff !important;
  }
  
  /* MEDIA QUERY DLA TRYBU CIEMNEGO */
  @media (prefers-color-scheme: dark) {
    /* Ustawienia tła i głównego kontenera */
    body {
      background-color: #1a1a1a !important; 
    }
    .main-container {
      background-color: #222222 !important; /* Ciemne tło dla głównego kontenera */
    }
    
    /* Zmiana koloru tekstu na jasny w trybie ciemnym */
    .main-content-text, .header-text-main {
      color: #f2f2f2 !important; /* Bardzo jasny tekst dla nagłówków i kluczowej treści */
    }
    .main-content-text-secondary, .header-text-sub {
      color: #cccccc !important; /* Jasny tekst dla reszty treści */
    }
    .header-bg {
      background-color: #000000 !important; /* Ciemne tło dla sekcji logo */
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
        {/* Wstrzyknięcie stylów dla obu trybów */}
        <style dangerouslySetInnerHTML={{ __html: finalThemeStyles }} />
      </Head>
      <Body style={mainBodyStyle}>
        {/* Klasa 'main-container' dla kontroli tła */}
        <Container className="mx-auto max-w-[600px] bg-white my-[40px] main-container">
          
          {/* Header z logo i nagłówkiem */}
          <Section className="bg-[#1a1a1a] px-[42px] py-[32px] header-bg">
            <table className="w-full">
              <tr className="w-full">
                <td align="center">
                  <Img
                    alt="Czyste Pomniki Logo"
                    height="60"
                    src="https://www.czystepomniki.pl/wp-content/uploads/2022/09/cropped-logo_red.webp"
                  />
                  {/* Nagłówek h1 - domyślnie ciemny, zmieniany na jasny w Dark Mode przez klasę header-text-main */}
                  <h1 
                    className="my-[8px] font-semibold text-[26px] leading-[34px] header-text-main" 
                    style={{ margin: '8px 0', fontSize: '26px', lineHeight: '34px', color: '#333333', fontWeight: '600' }}
                  >
                    CzystePomniki.pl
                  </h1>
                </td>
              </tr>
              <tr className="w-full">
                <td align="center">
                  <h1 
                    className="my-[16px] font-semibold text-[22px] leading-[32px] header-text-main" 
                    style={{ margin: '16px 0', fontSize: '22px', lineHeight: '32px', color: '#333333', fontWeight: '600' }}
                  >
                    Podsumowanie Wykonanych Prac
                  </h1>
                  <Text 
                    className="mt-[4px] mb-0 text-[16px] text-gray-300 leading-[24px] header-text-sub" 
                    style={{ fontSize: '16px', lineHeight: '24px', color: '#4b5563' }}
                  >
                    Profesjonalna pielęgnacja miejsc pamięci
                  </Text>
                </td>
              </tr>
            </table>
          </Section>

          {/* Informacje o kliencie - Szanowny Kliencie */}
          <Section className="px-[42px] py-[24px]">
            <Text className="m-0 font-semibold text-[19px] main-content-text leading-[28px]" style={{ fontSize: '19px', lineHeight: '28px', fontWeight: '600' }}>
              Szanowny Kliencie,
            </Text>
            <Text className="mt-[12px] text-[19px] main-content-text-secondary leading-[30px]" style={{ fontSize: '19px', lineHeight: '30px' }}>
              Z przyjemnością informujemy, że w dniu 
              <strong style={{ whiteSpace: 'nowrap' }}> 📅 {currentDate}</strong> 
              wykonaliśmy zlecone prace porządkowe miejsca spoczynku Państwa bliskich.
            </Text>
          </Section>

          <Section className="px-[42px]">
            <Hr className="border-gray-200 hr" />
          </Section>

          {/* Opis prac */}
          <Section className="px-[42px] py-[24px]">
            <Text className="m-0 font-semibold text-[20px] main-content-text leading-[30px]" style={{ fontSize: '20px', lineHeight: '30px', fontWeight: '600' }}>
              Zakres Wykonanych Prac
            </Text>
            <Text className="mt-[12px] text-[18px] main-content-text-secondary leading-[30px]" style={{ fontSize: '18px', lineHeight: '30px' }}>
              {description}
            </Text>
          </Section>

          {/* Zdjęcia przed */}
          {photoBeforeUrls.length > 0 && (
            <Section className="px-[42px] py-[16px]">
              <Text className="m-0 font-semibold text-[20px] main-content-text leading-[30px]" style={{ fontSize: '20px', lineHeight: '30px', fontWeight: '600' }}>
                Przed wykonaniem usługi
              </Text>
              <Section className="mt-[8px]">
                {renderImageGrid(photoBeforeUrls)}
              </Section>
            </Section>
          )}

          {/* Zdjęcia po */}
          {photoAfterUrls.length > 0 && (
            <Section className="px-[42px] py-[16px]">
              <Text className="m-0 font-semibold text-[20px] main-content-text leading-[30px]" style={{ fontSize: '20px', lineHeight: '30px', fontWeight: '600' }}>
                Po wykonaniu usługi
              </Text>
              <Section className="mt-[8px]">
                {renderImageGrid(photoAfterUrls)}
              </Section>
            </Section>
          )}

          {/* Opinia Google - Duży przycisk */}
          <Section className="px-[42px] py-[32px]">
            <Section className="bg-[#f8f9fa] rounded-[12px] px-[32px] py-[24px] text-center">
              <Text className="m-0 font-semibold text-[22px] main-content-text leading-[32px]" style={{ fontSize: '22px', lineHeight: '32px', fontWeight: '600' }}>
                ⭐ Podziel się swoją opinią
              </Text>
              <Text className="mt-[8px] mb-[20px] text-[18px] main-content-text-secondary leading-[28px]" style={{ fontSize: '18px', lineHeight: '28px' }}>
                Twoja opinia pomoże nam w doskonaleniu naszych usług.
              </Text>
              <Button
                className="box-border w-full rounded-[8px] bg-[#1a1a1a] px-[12px] py-[12px] text-center font-bold text-[18px] text-white"
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
                Zostaw opinię na Google
              </Button>
            </Section>
          </Section>

          <Section className="px-[42px]">
            <Hr className="border-gray-200 hr" />
          </Section>

          {/* Podziękowanie */}
          <Section className="px-[42px] py-[24px]">
            <Text className="text-center text-[18px] main-content-text-secondary leading-[28px] italic" style={{ fontSize: '18px', lineHeight: '28px', fontStyle: 'italic' }}>
              Dziękujemy za zaufanie i możliwość zadbania o miejsce pamięci Państwa bliskich.
            </Text>
          </Section>

          {/* Footer (zachowany jako ciemny, jest czytelny) */}
          <Section style={{ width: '100%', backgroundColor: '#1a1a1a', fontFamily: "'Book Antiqua', serif", fontSize: '14px', color: '#f2f2f2', padding: '20px 10px', boxShadow: 'rgba(0, 0, 0, 0.6) 0px 4px 10px', overflowWrap: 'break-word', marginLeft: 'auto', marginRight: 'auto' }}>
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
          </Section>
          <Text style={{ textAlign: 'center', fontFamily: "'Book Antiqua', Palatino, serif", fontSize: '14pt', color: '#666', margin: '20px 0' }}>CzystePomniki 2025</Text>
        </Container>
      </Body>
    </Html>
  );
}