import { Section, Row, Text, Column, Img, Link, Html, Head, Body, Hr } from "@react-email/components";

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
      <Column key={i} style={{ width: '50%', padding: '8px' }}>
        <Img
          alt={`${prefix} ${i + 1}`}
          style={{ 
            width: '100%', 
            borderRadius: '8px', 
            objectFit: 'cover',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}
          height={288}
          src={url}
        />
      </Column>
    ));

    const rows = [];
    for (let i = 0; i < images.length; i += 2) {
      rows.push(
        <Row key={i} style={{ marginTop: '16px' }}>
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
      <Body style={{ 
        fontFamily: "'Book Antiqua', 'Palatino Linotype', Palatino, serif",
        backgroundColor: '#f9fafb',
        margin: 0,
        padding: 0
      }}>
        <Section style={{ 
          maxWidth: '680px', 
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
        }}>
          {/* Header z logo */}
          <Section style={{ 
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            padding: '32px 40px',
            textAlign: 'center'
          }}>
            <Img 
              src="https://www.czystepomniki.pl/wp-content/uploads/2022/09/cropped-logo_red.webp" 
              alt="Czyste Pomniki" 
              style={{ 
                maxWidth: '120px', 
                height: 'auto',
                margin: '0 auto 16px'
              }}
            />
            <Text style={{ 
              fontFamily: "'Book Antiqua', 'Palatino Linotype', Palatino, serif",
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#ffffff',
              margin: 0,
              letterSpacing: '0.5px'
            }}>
              Podsumowanie Wykonanych Prac
            </Text>
          </Section>

          {/* Treść główna */}
          <Section style={{ padding: '40px' }}>
            {/* Informacje o kliencie */}
            <Section style={{ 
              backgroundColor: '#f8f9fa',
              borderLeft: '4px solid #dc2626',
              padding: '20px 24px',
              borderRadius: '8px',
              marginBottom: '32px'
            }}>
              <Text style={{ 
                fontFamily: "'Book Antiqua', 'Palatino Linotype', Palatino, serif",
                fontSize: '14px',
                color: '#6b7280',
                margin: '0 0 8px 0',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '600'
              }}>
                Szanowny Kliencie
              </Text>
              <Text style={{ 
                fontFamily: "'Book Antiqua', 'Palatino Linotype', Palatino, serif",
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 12px 0'
              }}>
                {contactName}
              </Text>
              <Text style={{ 
                fontFamily: "'Book Antiqua', 'Palatino Linotype', Palatino, serif",
                fontSize: '16px',
                color: '#4b5563',
                margin: 0,
                lineHeight: '1.6'
              }}>
                Z przyjemnością informujemy, że w dniu <strong style={{ color: '#1f2937' }}>{currentDate}</strong> wykonaliśmy zlecone prace porządkowe miejsca spoczynku Państwa bliskich.
              </Text>
            </Section>

            {/* Opis prac */}
            <Section style={{ marginBottom: '32px' }}>
              <Text style={{ 
                fontFamily: "'Book Antiqua', 'Palatino Linotype', Palatino, serif",
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#dc2626',
                margin: '0 0 16px 0',
                borderBottom: '2px solid #fee2e2',
                paddingBottom: '8px'
              }}>
                Zakres Wykonanych Prac
              </Text>
              <Text style={{ 
                fontFamily: "'Book Antiqua', 'Palatino Linotype', Palatino, serif",
                fontSize: '15px',
                color: '#374151',
                lineHeight: '1.8',
                margin: 0,
                textAlign: 'justify'
              }}>
                {description}
              </Text>
            </Section>

            {/* Zdjęcia przed */}
            {photoBeforeUrls.length > 0 && (
              <Section style={{ marginBottom: '32px' }}>
                <Text style={{ 
                  fontFamily: "'Book Antiqua', 'Palatino Linotype', Palatino, serif",
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#dc2626',
                  margin: '0 0 16px 0',
                  borderBottom: '2px solid #fee2e2',
                  paddingBottom: '8px'
                }}>
                  Stan Przed Wykonaniem Usługi
                </Text>
                {renderImageGrid(photoBeforeUrls, 'Przed')}
              </Section>
            )}

            {/* Zdjęcia po */}
            {photoAfterUrls.length > 0 && (
              <Section style={{ marginBottom: '32px' }}>
                <Text style={{ 
                  fontFamily: "'Book Antiqua', 'Palatino Linotype', Palatino, serif",
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#dc2626',
                  margin: '0 0 16px 0',
                  borderBottom: '2px solid #fee2e2',
                  paddingBottom: '8px'
                }}>
                  Stan Po Wykonaniu Usługi
                </Text>
                {renderImageGrid(photoAfterUrls, 'Po')}
              </Section>
            )}

            {/* Podziękowanie */}
            <Section style={{ 
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              padding: '24px',
              textAlign: 'center',
              border: '1px solid #bbf7d0',
              marginTop: '40px'
            }}>
              <Text style={{ 
                fontFamily: "'Book Antiqua', 'Palatino Linotype', Palatino, serif",
                fontSize: '18px',
                color: '#15803d',
                margin: '0 0 8px 0',
                fontWeight: 'bold'
              }}>
                Dziękujemy za Zaufanie
              </Text>
              <Text style={{ 
                fontFamily: "'Book Antiqua', 'Palatino Linotype', Palatino, serif",
                fontSize: '15px',
                color: '#166534',
                margin: 0,
                lineHeight: '1.6'
              }}>
                Jesteśmy zaszczyceni, że mogliśmy zadbać o miejsce pamięci Państwa bliskich. W razie pytań lub uwag, pozostajemy do dyspozycji.
              </Text>
            </Section>
          </Section>

          {/* Stopka */}
          <Section style={{ 
            backgroundColor: '#1a1a1a',
            padding: '40px',
            color: '#f2f2f2'
          }}>
            <Row>
              <Column style={{ width: '60%', paddingRight: '20px' }}>
                <Text style={{ 
                  fontFamily: "'Book Antiqua', 'Palatino Linotype', Palatino, serif",
                  fontSize: '20px',
                  color: '#dc2626',
                  fontWeight: 'bold',
                  margin: '0 0 16px 0',
                  letterSpacing: '0.5px'
                }}>
                  CzystePomniki.pl
                </Text>
                <Text style={{ 
                  fontFamily: "'Book Antiqua', 'Palatino Linotype', Palatino, serif",
                  fontSize: '14px',
                  color: '#e5e7eb',
                  lineHeight: '1.8',
                  margin: 0
                }}>
                  ul. Majowa 59<br />
                  05-462 Dziechciniec<br />
                  <br />
                  Tel: <Link 
                    style={{ color: '#dc2626', textDecoration: 'none', fontWeight: 'bold' }} 
                    href="tel:+48799820556"
                  >
                    +48 799 820 556
                  </Link><br />
                  Email: <Link 
                    style={{ color: '#dc2626', textDecoration: 'none', fontWeight: 'bold' }} 
                    href="mailto:biuro@czystepomniki.pl"
                  >
                    biuro@czystepomniki.pl
                  </Link>
                </Text>
              </Column>
              <Column style={{ 
                width: '40%', 
                textAlign: 'right',
                verticalAlign: 'top'
              }}>
                <Text style={{ 
                  fontFamily: "'Book Antiqua', 'Palatino Linotype', Palatino, serif",
                  fontSize: '14px',
                  color: '#9ca3af',
                  lineHeight: '1.6',
                  margin: 0,
                  fontStyle: 'italic'
                }}>
                  Profesjonalne usługi<br />
                  pielęgnacji miejsc pamięci<br />
                  <br />
                  Z szacunkiem i troską<br />
                  od 2022 roku
                </Text>
              </Column>
            </Row>

            <Hr style={{ 
              border: 'none',
              borderTop: '1px solid #374151',
              margin: '32px 0 24px 0'
            }} />

            <Row>
              <Column style={{ textAlign: 'center' }}>
                <Link 
                  style={{ 
                    fontFamily: "'Book Antiqua', 'Palatino Linotype', Palatino, serif",
                    margin: '0 16px',
                    color: '#f2f2f2',
                    fontSize: '14px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    letterSpacing: '0.5px'
                  }} 
                  href="https://www.facebook.com/people/Czystepomnikipl/" 
                  rel="noopener"
                >
                  Facebook
                </Link>
                <Text style={{ 
                  display: 'inline',
                  color: '#4b5563',
                  margin: '0 8px'
                }}>
                  •
                </Text>
                <Link 
                  style={{ 
                    fontFamily: "'Book Antiqua', 'Palatino Linotype', Palatino, serif",
                    margin: '0 16px',
                    color: '#f2f2f2',
                    fontSize: '14px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    letterSpacing: '0.5px'
                  }} 
                  href="https://x.com/czystepomnikipl/" 
                  rel="noopener"
                >
                  X (Twitter)
                </Link>
              </Column>
            </Row>

            <Text style={{ 
              fontFamily: "'Book Antiqua', 'Palatino Linotype', Palatino, serif",
              textAlign: 'center',
              fontSize: '13px',
              color: '#6b7280',
              margin: '24px 0 0 0',
              letterSpacing: '1px'
            }}>
              © CzystePomniki.pl 2025 • Wszelkie prawa zastrzeżone
            </Text>
          </Section>
        </Section>
      </Body>
    </Html>
  );
}