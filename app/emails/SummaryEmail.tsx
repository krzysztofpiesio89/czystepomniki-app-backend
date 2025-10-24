import { Section, Row, Text, Column, Img, Link, Html, Head, Body, Container, Hr, Button } from "@react-email/components";

interface SummaryEmailProps {
  contactName: string;
  email: string;
  description: string;
  currentDate: string;
  photoBeforeUrls: string[];
  photoAfterUrls: string[];
}

export default function SummaryEmail({
  contactName,
  email,
  description,
  currentDate,
  photoBeforeUrls,
  photoAfterUrls
}: SummaryEmailProps) {
  // ZMODYFIKOWANA FUNKCJA: Renderuje jedno zdjęcie na całą szerokość rzędu
  const renderImageGrid = (urls: string[]) => {
    return urls.map((url, index) => (
      <Row key={index} className="mt-[16px]">
        {/* Pojedyncza kolumna zajmująca pełną szerokość rzędu */}
        <Column>
          <Img
            alt={`Zdjęcie ${index + 1}`}
            // Klasa w-full zapewnia wypełnienie szerokości kolumny
            className="w-full rounded-[12px] object-cover" 
            height={288} // Wysokość została zachowana
            src={url}
          />
        </Column>
      </Row>
    ));
  };

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "'Book Antiqua', 'Palatino Linotype', Palatino, serif", backgroundColor: "#f6f9fc" }}>
        <Container className="mx-auto max-w-[600px] bg-white my-[40px]">
          {/* Header */}
          <Section className="bg-[#1a1a1a] px-[42px] py-[32px]">
            <table className="w-full">
              <tr className="w-full">
                <td align="center">
                  <Img
                    alt="Czyste Pomniki"
                    height="80"
                    src="https://www.czystepomniki.pl/wp-content/uploads/2022/09/cropped-logo_red.webp"
                  />
                </td>
              </tr>
              <tr className="w-full">
                <td align="center">
                  <Text className="my-[16px] font-semibold text-[24px] text-white leading-[32px]">
                    Podsumowanie Wykonanych Prac
                  </Text>
                  <Text className="mt-[4px] mb-0 text-[14px] text-gray-300 leading-[20px]">
                    Profesjonalna pielęgnacja miejsc pamięci
                  </Text>
                </td>
              </tr>
            </table>
          </Section>

          {/* Informacje o kliencie */}
          <Section className="px-[42px] py-[24px]">
            <Text className="m-0 font-semibold text-[16px] text-gray-500 leading-[22px] uppercase tracking-wide">
              Szanowny Kliencie
            </Text>
            <Text className="m-0 mt-[8px] font-semibold text-[32px] text-gray-900 leading-[40px]">
              {contactName}
            </Text>
            <Text className="mt-[12px] text-[18px] text-gray-600 leading-[28px]">
              Z przyjemnością informujemy, że w dniu <strong>{currentDate}</strong> wykonaliśmy zlecone prace porządkowe miejsca spoczynku Państwa bliskich.
            </Text>
          </Section>

          <Section className="px-[42px]">
            <Hr className="border-gray-200" />
          </Section>

          {/* Opis prac */}
          <Section className="px-[42px] py-[24px]">
            <Text className="m-0 font-semibold text-[18px] text-gray-900 leading-[28px]">
              Zakres Wykonanych Prac
            </Text>
            <Text className="mt-[12px] text-[17px] text-gray-600 leading-[28px]">
              {description}
            </Text>
          </Section>

          {/* Zdjęcia przed */}
          {photoBeforeUrls.length > 0 && (
            // Zewnętrzna sekcja (px-[42px]) zapewnia margines 42px z każdej strony
            <Section className="px-[42px] py-[16px]">
              <Text className="m-0 font-semibold text-[18px] text-gray-900 leading-[28px]">
                Przed wykonaniem usługi
              </Text>
              <Section className="mt-[8px]">
                {renderImageGrid(photoBeforeUrls)}
              </Section>
            </Section>
          )}

          {/* Zdjęcia po */}
          {photoAfterUrls.length > 0 && (
            // Zewnętrzna sekcja (px-[42px]) zapewnia margines 42px z każdej strony
            <Section className="px-[42px] py-[16px]">
              <Text className="m-0 font-semibold text-[18px] text-gray-900 leading-[28px]">
                Po wykonaniu usługi
              </Text>
              <Section className="mt-[8px]">
                {renderImageGrid(photoAfterUrls)}
              </Section>
            </Section>
          )}

          {/* Opinia Google */}
          <Section className="px-[42px] py-[32px]">
            <Section className="bg-[#f8f9fa] rounded-[12px] px-[32px] py-[24px] text-center">
              <Text className="m-0 font-semibold text-[20px] text-gray-900 leading-[28px]">
                Podziel się swoją opinią
              </Text>
              <Text className="mt-[8px] mb-[20px] text-[16px] text-gray-600 leading-[24px]">
                Twoja opinia pomoże nam w doskonaleniu naszych usług
              </Text>
              <Button
                className="box-border rounded-[8px] bg-[#1a1a1a] px-[32px] py-[14px] text-center font-semibold text-[16px] text-white"
                href="https://g.page/r/CYrcRTvHckvaEBM/review"
              >
                Zostaw opinię na Google
              </Button>
            </Section>
          </Section>

          <Section className="px-[42px]">
            <Hr className="border-gray-200" />
          </Section>

          {/* Podziękowanie */}
          <Section className="px-[42px] py-[24px]">
            <Text className="text-center text-[17px] text-gray-600 leading-[26px] italic">
              Dziękujemy za zaufanie i możliwość zadbania o miejsce pamięci Państwa bliskich
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{ width: '100%', backgroundColor: '#1a1a1a', fontFamily: "'Book Antiqua', serif", fontSize: 'clamp(12px, 2.5vw, 16px)', color: '#f2f2f2', padding: '20px 10px', boxShadow: 'rgba(0, 0, 0, 0.6) 0px 4px 10px', overflowWrap: 'break-word', marginLeft: 'auto', marginRight: 'auto' }}>
            <Row>
              <Column style={{ width: '60%', textAlign: 'left', verticalAlign: 'top', lineHeight: '1.6', wordWrap: 'break-word' }}>
                <Text style={{ fontSize: 'clamp(14px, 3vw, 18px)', color: 'inherit', fontWeight: 'bold', margin: 0 }}>CzystePomniki.pl</Text>
                <Text style={{ margin: '8px 0 0 0', color: 'inherit' }}>
                  ul. Majowa 59<br />
                  05-462 Dziechciniec<br />
                  Tel: <Link style={{ color: 'inherit', textDecoration: 'none' }} href="tel:+48799820556">+48 799 820 556</Link><br />
                  Email: <Link style={{ color: 'inherit', textDecoration: 'none' }} href="mailto:biuro@czystepomniki.pl">biuro@czystepomniki.pl</Link>
                </Text>
              </Column>
              <Column style={{ width: '40%', textAlign: 'center', verticalAlign: 'middle' }}>
                <Img style={{ maxWidth: '30%', height: 'auto' }} src="https://www.czystepomniki.pl/wp-content/uploads/2022/09/cropped-logo_red.webp" alt="Czyste Pomniki" />
                <Text style={{ fontSize: 'clamp(10px, 2vw, 13px)', color: '#dddddd', marginTop: '8px' }}>Profesjonalne usługi sprzątania grobów</Text>
              </Column>
            </Row>
            <Row>
              <Column style={{ textAlign: 'center', paddingTop: '40px', borderTop: '1px solid #333333' }} colSpan={2}>
                <Link style={{ margin: '0 15px', color: '#f2f2f2', fontWeight: 'bold', fontSize: '16px', textDecoration: 'none', fontFamily: 'Arial, sans-serif' }} href="https://www.facebook.com/people/Czystepomnikipl/" rel="noopener">FB</Link>
                <Link style={{ margin: '0 15px', color: '#f2f2f2', fontWeight: 'bold', fontSize: '16px', textDecoration: 'none', fontFamily: 'Arial, sans-serif' }} href="https://x.com/czystepomnikipl/" rel="noopener">X</Link>
              </Column>
            </Row>
          </Section>
          <Text style={{ textAlign: 'center', fontFamily: "'Book Antiqua', Palatino, serif", fontSize: '12pt', color: '#666' }}>CzystePomniki 2025</Text>
        </Container>
      </Body>
    </Html>
  );
}