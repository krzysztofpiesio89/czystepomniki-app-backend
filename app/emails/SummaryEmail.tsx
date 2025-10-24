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
  const renderImageGrid = (urls: string[]) => {
    const rows = [];
    for (let i = 0; i < urls.length; i += 2) {
      rows.push(
        <Row key={i} className="mt-[16px]">
          <Column className="w-[50%] pr-[8px]">
            <Img
              alt={`Zdjęcie ${i + 1}`}
              className="w-full rounded-[12px] object-cover"
              height={288}
              src={urls[i]}
            />
          </Column>
          {urls[i + 1] && (
            <Column className="w-[50%] pl-[8px]">
              <Img
                alt={`Zdjęcie ${i + 2}`}
                className="w-full rounded-[12px] object-cover"
                height={288}
                src={urls[i + 1]}
              />
            </Column>
          )}
        </Row>
      );
    }
    return rows;
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
            <Text className="m-0 font-semibold text-[14px] text-gray-500 leading-[20px] uppercase tracking-wide">
              Szanowny Kliencie
            </Text>
            <Text className="m-0 mt-[8px] font-semibold text-[28px] text-gray-900 leading-[36px]">
              {contactName}
            </Text>
            <Text className="mt-[12px] text-[16px] text-gray-600 leading-[24px]">
              Z przyjemnością informujemy, że w dniu <strong>{currentDate}</strong> wykonaliśmy zlecone prace porządkowe miejsca spoczynku Państwa bliskich.
            </Text>
          </Section>

          <Section className="px-[42px]">
            <Hr className="border-gray-200" />
          </Section>

          {/* Opis prac */}
          <Section className="px-[42px] py-[24px]">
            <Text className="m-0 font-semibold text-[16px] text-gray-900 leading-[24px]">
              Zakres Wykonanych Prac
            </Text>
            <Text className="mt-[12px] text-[15px] text-gray-600 leading-[24px]">
              {description}
            </Text>
          </Section>

          {/* Zdjęcia przed */}
          {photoBeforeUrls.length > 0 && (
            <Section className="px-[42px] py-[16px]">
              <Text className="m-0 font-semibold text-[16px] text-gray-900 leading-[24px]">
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
              <Text className="m-0 font-semibold text-[16px] text-gray-900 leading-[24px]">
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
              <Text className="m-0 font-semibold text-[18px] text-gray-900 leading-[28px]">
                Podziel się swoją opinią
              </Text>
              <Text className="mt-[8px] mb-[20px] text-[14px] text-gray-600 leading-[20px]">
                Twoja opinia pomoże nam w doskonaleniu naszych usług
              </Text>
              <Button
                href="https://g.page/r/CYrcRTvHckvaEBM/review"
                className="bg-[#1a1a1a] rounded-[8px] px-[32px] py-[12px] text-center font-semibold text-[14px] text-white leading-[20px] no-underline"
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
            <Text className="text-center text-[16px] text-gray-600 leading-[24px] italic">
              Dziękujemy za zaufanie i możliwość zadbania o miejsce pamięci Państwa bliskich
            </Text>
          </Section>

          {/* Footer */}
          <Section className="bg-[#1a1a1a] px-[42px] py-[32px]">
            <table className="w-full">
              <tr className="w-full">
                <td align="center">
                  <Img
                    alt="Czyste Pomniki logo"
                    height="60"
                    src="https://www.czystepomniki.pl/wp-content/uploads/2022/09/cropped-logo_red.webp"
                  />
                </td>
              </tr>
              <tr className="w-full">
                <td align="center">
                  <Text className="my-[12px] font-semibold text-[18px] text-white leading-[24px]">
                    CzystePomniki.pl
                  </Text>
                  <Text className="mt-[4px] mb-[16px] text-[14px] text-gray-400 leading-[20px] italic">
                    Z szacunkiem i troską od 2022 roku
                  </Text>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <Text className="my-[8px] text-[14px] text-gray-300 leading-[20px]">
                    ul. Majowa 59, 05-462 Dziechciniec
                  </Text>
                  <Text className="mt-[4px] mb-[16px] text-[14px] text-gray-300 leading-[20px]">
                    <Link href="mailto:biuro@czystepomniki.pl" className="text-gray-300 no-underline">
                      biuro@czystepomniki.pl
                    </Link>
                    {" • "}
                    <Link href="tel:+48799820556" className="text-gray-300 no-underline">
                      +48 799 820 556
                    </Link>
                  </Text>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <Row className="table-cell">
                    <Column className="pr-[12px]">
                      <Link href="https://www.facebook.com/people/Czystepomnikipl/">
                        <Text className="text-[14px] text-white font-semibold no-underline">
                          Facebook
                        </Text>
                      </Link>
                    </Column>
                    <Column className="pl-[12px]">
                      <Link href="https://x.com/czystepomnikipl/">
                        <Text className="text-[14px] text-white font-semibold no-underline">
                          X
                        </Text>
                      </Link>
                    </Column>
                  </Row>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <Text className="mt-[24px] text-center text-[12px] text-gray-500 leading-[16px]">
                    © CzystePomniki.pl 2025 • Wszelkie prawa zastrzeżone
                  </Text>
                </td>
              </tr>
            </table>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}