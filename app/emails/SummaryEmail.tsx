import { Section, Row, Text, Column, Img, Link, Html, Head, Body } from "@react-email/components";

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
  const renderImageGrid = (urls: string[], prefix: string) => {
    const images = urls.map((url, i) => (
      <Column key={i} className="w-[50%] pr-[8px] mb-[16px]">
        <Img
          alt={`${prefix} ${i + 1}`}
          className="w-full rounded-[12px] object-cover"
          height={288}
          src={url}
        />
      </Column>
    ));

    const rows = [];
    for (let i = 0; i < images.length; i += 2) {
      rows.push(
        <Row key={i} className="mt-[16px]">
          {images[i]}
          {images[i + 1] && images[i + 1]}
        </Row>
      );
    }
    return rows;
  };

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif' }}>
        <Section className="my-[16px]">
          <Section className="mt-[42px]">
            <Row>
              <Text className="m-0 font-semibold text-[16px] text-indigo-600 leading-[24px]">
                Podsumowanie prac
              </Text>
              <Text className="m-0 mt-[8px] font-semibold text-[24px] text-gray-900 leading-[32px]">
                {contactName}
              </Text>
              <Text className="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
                Informujemy, że w dniu <strong>{currentDate}</strong> wykonaliśmy usługę sprzątania grobu.
              </Text>
            </Row>
          </Section>

          <Section className="mt-[16px]">
            <Row>
              <Text className="m-0 font-semibold text-[16px] text-indigo-600 leading-[24px]">
                Opis wykonanych prac
              </Text>
              <Text className="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
                {description}
              </Text>
            </Row>
          </Section>

          {photoBeforeUrls.length > 0 && (
            <Section className="mt-[16px]">
              <Row>
                <Text className="m-0 font-semibold text-[16px] text-indigo-600 leading-[24px]">
                  Przed wykonaniem usługi
                </Text>
              </Row>
              {renderImageGrid(photoBeforeUrls, 'Przed')}
            </Section>
          )}

          {photoAfterUrls.length > 0 && (
            <Section className="mt-[16px]">
              <Row>
                <Text className="m-0 font-semibold text-[16px] text-indigo-600 leading-[24px]">
                  Po wykonaniu usługi
                </Text>
              </Row>
              {renderImageGrid(photoAfterUrls, 'Po')}
            </Section>
          )}

          <Section className="mt-[16px]">
            <Row>
              <Text className="m-0 text-[16px] text-green-600 leading-[24px] text-center font-bold">
                Dziękujemy za skorzystanie z naszych usług!
              </Text>
            </Row>
          </Section>
        </Section>

        <Section style={{ width: '100%', backgroundColor: '#1a1a1a', fontFamily: "'Book Antiqua', serif", fontSize: 'clamp(12px, 2.5vw, 16px)', color: '#f2f2f2', padding: '20px 10px', boxShadow: 'rgba(0, 0, 0, 0.6) 0px 4px 10px', overflowWrap: 'break-word', marginLeft: 'auto', marginRight: 'auto' }}>
          <Row>
            <Column style={{ width: '60%', textAlign: 'left', verticalAlign: 'top', lineHeight: '1.6', wordWrap: 'break-word' }}>
              <Text style={{ fontSize: 'clamp(14px, 3vw, 18px)', color: 'inherit', fontWeight: 'bold' }}>CzystePomniki.pl</Text><br />
              ul. Majowa 59<br />
              05-462 Dziechciniec<br />
              Tel: <Link style={{ color: 'inherit', textDecoration: 'none' }} href="tel:+48799820556">+48 799 820 556</Link><br />
              Email: <Link style={{ color: 'inherit', textDecoration: 'none' }} href="mailto:biuro@czystepomniki.pl">biuro@czystepomniki.pl</Link>
            </Column>
            <Column style={{ width: '40%', textAlign: 'center', verticalAlign: 'middle' }}>
              <Img style={{ maxWidth: '30%', height: 'auto' }} src="https://www.czystepomniki.pl/wp-content/uploads/2022/09/cropped-logo_red.webp" alt="Czyste Pomniki" />
              <Text style={{ fontSize: 'clamp(10px, 2vw, 13px)', color: '#dddddd', marginTop: '8px' }}>Profesjonalne usługi sprzątania grob&oacute;w</Text>
            </Column>
          </Row>
          <Row>
            <Column style={{ textAlign: 'center', paddingTop: '40px', borderTop: '1px solid #333333' }} colSpan={2}>
              <Link style={{ margin: '0 15px', color: '#f2f2f2', fontWeight: 'bold', fontSize: '16px', textDecoration: 'none', fontFamily: 'Arial, sans-serif' }} href="https://www.facebook.com/people/Czystepomnikipl/" rel="noopener">FB</Link>
              <Link style={{ margin: '0 15px', color: '#f2f2f2', fontWeight: 'bold', fontSize: '16px', textDecoration: 'none', fontFamily: 'Arial, sans-serif' }} href="https://x.com/czystepomnikipl/" rel="noopener">X</Link>
            </Column>
          </Row>
        </Section>
        <Text style={{ textAlign: 'center', fontFamily: "'book antiqua', palatino, serif", fontSize: '12pt' }}>CzystePomniki 2025</Text>
      </Body>
    </Html>
  );
}