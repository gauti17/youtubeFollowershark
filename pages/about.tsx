import React, { useMemo } from 'react'
import Layout from '../components/Layout'
import styled from 'styled-components'
import SEO from '../components/SEO'
import { pageSEOConfigs, generateStructuredData } from '../lib/seo'

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 80px;
`

const PageTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
`

const PageSubtitle = styled.p`
  color: #6b7280;
  font-size: 20px;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
`

const Section = styled.section`
  margin-bottom: 80px;
`

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 24px;
  text-align: center;
`

const SectionContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`

const Paragraph = styled.p`
  color: #4b5563;
  font-size: 18px;
  line-height: 1.8;
  margin-bottom: 24px;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  margin: 60px 0;
  text-align: center;
`

const StatCard = styled.div`
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: white;
  padding: 40px 20px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(255, 107, 53, 0.2);
`

const StatNumber = styled.div`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 8px;
`

const StatLabel = styled.div`
  font-size: 16px;
  opacity: 0.9;
`

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin: 60px 0;
`

const ValueCard = styled.div`
  background: white;
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
  text-align: center;
`

const ValueIcon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
`

const ValueTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
`

const ValueDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
  font-size: 16px;
`

const TeamSection = styled.div`
  background: #f8fafc;
  padding: 80px 40px;
  border-radius: 24px;
  margin: 80px 0;
`

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  max-width: 1000px;
  margin: 0 auto;
`

const TeamMember = styled.div`
  background: white;
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
`

const MemberPhoto = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: white;
`

const MemberName = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
`

const MemberRole = styled.p`
  color: #FF6B35;
  font-weight: 500;
  margin-bottom: 12px;
`

const MemberDescription = styled.p`
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
`

const CTASection = styled.div`
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: white;
  padding: 60px 40px;
  border-radius: 24px;
  text-align: center;
`

const CTATitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
`

const CTADescription = styled.p`
  font-size: 18px;
  margin-bottom: 32px;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`

const CTAButton = styled.a`
  background: white;
  color: #FF6B35;
  padding: 16px 32px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  display: inline-block;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(255, 255, 255, 0.2);
  }
`

const AboutPage: React.FC = () => {
  // SEO configuration for about page
  const aboutSEO = useMemo(() => ({
    ...pageSEOConfigs.about,
    url: 'https://youshark.de/about',
    image: '/images/youshark-og-image.jpg',
    type: 'website' as const,
    canonical: 'https://youshark.de/about'
  }), [])

  // Generate structured data for the about page
  const aboutStructuredData = useMemo(() => {
    return generateStructuredData('organization', {
      name: 'YouShark',
      description: pageSEOConfigs.about.description
    })
  }, [])

  return (
    <>
      <SEO 
        {...aboutSEO}
        structuredData={aboutStructuredData}
      />
      <Layout 
        title={aboutSEO.title}
        description={aboutSEO.description}
        keywords={aboutSEO.keywords?.join(', ') || ''}
      >
      <Container>
        <Header>
          <PageTitle>Über YouShark</PageTitle>
          <PageSubtitle>
            Ihr vertrauensvoller Partner für nachhaltiges YouTube-Wachstum. 
            Seit Jahren unterstützen wir Content Creator dabei, ihre Reichweite zu vergrößern 
            und ihre YouTube-Ziele zu erreichen.
          </PageSubtitle>
        </Header>

        <Section>
          <SectionTitle>Unsere Mission</SectionTitle>
          <SectionContent>
            <Paragraph>
              Bei YouShark glauben wir daran, dass jeder Content Creator das Potenzial hat, 
              erfolgreich zu sein. Unsere Mission ist es, Ihnen die Werkzeuge und Services 
              zur Verfügung zu stellen, die Sie benötigen, um Ihre YouTube-Präsenz zu stärken 
              und Ihre Zielgruppe zu erreichen.
            </Paragraph>
            <Paragraph>
              Wir bieten hochwertige, sichere und nachhaltige Marketing-Lösungen, die Ihrem 
              Kanal helfen zu wachsen, ohne dabei gegen YouTube's Richtlinien zu verstoßen. 
              Qualität und Kundenzufriedenheit stehen bei uns an erster Stelle.
            </Paragraph>
          </SectionContent>
        </Section>

        <StatsGrid>
          <StatCard>
            <StatNumber>50.000+</StatNumber>
            <StatLabel>Zufriedene Kunden</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>5 Jahre</StatNumber>
            <StatLabel>Erfahrung</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>10M+</StatNumber>
            <StatLabel>Ausgelieferte Views</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>99.8%</StatNumber>
            <StatLabel>Kundenzufriedenheit</StatLabel>
          </StatCard>
        </StatsGrid>

        <Section>
          <SectionTitle>Unsere Werte</SectionTitle>
          <ValuesGrid>
            <ValueCard>
              <ValueIcon>🔒</ValueIcon>
              <ValueTitle>Sicherheit & Vertrauen</ValueTitle>
              <ValueDescription>
                Ihre Sicherheit ist unser höchstes Gut. Alle unsere Services sind 
                100% sicher und entsprechen den YouTube-Richtlinien.
              </ValueDescription>
            </ValueCard>
            
            <ValueCard>
              <ValueIcon>⚡</ValueIcon>
              <ValueTitle>Schnelle Lieferung</ValueTitle>
              <ValueDescription>
                Wir liefern alle Bestellungen zuverlässig und in der versprochenen Zeit. 
                Ihre Zufriedenheit ist unsere Priorität.
              </ValueDescription>
            </ValueCard>
            
            <ValueCard>
              <ValueIcon>💎</ValueIcon>
              <ValueTitle>Premium Qualität</ValueTitle>
              <ValueDescription>
                Nur die beste Qualität für unsere Kunden. Wir arbeiten ausschließlich 
                mit echten, aktiven Nutzern aus Deutschland.
              </ValueDescription>
            </ValueCard>
            
            <ValueCard>
              <ValueIcon>🎯</ValueIcon>
              <ValueTitle>Zielgerichtete Lösungen</ValueTitle>
              <ValueDescription>
                Jede Kampagne wird individuell auf Ihre Ziele und Zielgruppe 
                zugeschnitten für maximale Wirksamkeit.
              </ValueDescription>
            </ValueCard>
            
            <ValueCard>
              <ValueIcon>🔄</ValueIcon>
              <ValueTitle>Nachhaltiges Wachstum</ValueTitle>
              <ValueDescription>
                Wir setzen auf langfristige Strategien, die Ihrem Kanal 
                kontinuierliches und stabiles Wachstum ermöglichen.
              </ValueDescription>
            </ValueCard>
            
            <ValueCard>
              <ValueIcon>💬</ValueIcon>
              <ValueTitle>Persönlicher Support</ValueTitle>
              <ValueDescription>
                Unser deutschsprachiges Support-Team steht Ihnen jederzeit 
                mit Rat und Tat zur Seite.
              </ValueDescription>
            </ValueCard>
          </ValuesGrid>
        </Section>

        <TeamSection>
          <SectionTitle>Unser Team</SectionTitle>
          <TeamGrid>
            <TeamMember>
              <MemberPhoto>👨‍💼</MemberPhoto>
              <MemberName>Max Schmidt</MemberName>
              <MemberRole>Geschäftsführer & Gründer</MemberRole>
              <MemberDescription>
                Mit über 8 Jahren Erfahrung im digitalen Marketing führt Max 
                das YouShark-Team mit Vision und Leidenschaft.
              </MemberDescription>
            </TeamMember>
            
            <TeamMember>
              <MemberPhoto>👩‍💻</MemberPhoto>
              <MemberName>Sarah Müller</MemberName>
              <MemberRole>Leiterin Kundenerfolg</MemberRole>
              <MemberDescription>
                Sarah sorgt dafür, dass jeder Kunde die bestmögliche Erfahrung 
                mit unseren Services macht.
              </MemberDescription>
            </TeamMember>
            
            <TeamMember>
              <MemberPhoto>👨‍🔧</MemberPhoto>
              <MemberName>Tom Weber</MemberName>
              <MemberRole>Technical Lead</MemberRole>
              <MemberDescription>
                Tom entwickelt und optimiert unsere Plattform, um Ihnen 
                die beste technische Erfahrung zu bieten.
              </MemberDescription>
            </TeamMember>
            
            <TeamMember>
              <MemberPhoto>👩‍📊</MemberPhoto>
              <MemberName>Lisa Fischer</MemberName>
              <MemberRole>Marketing Strategin</MemberRole>
              <MemberDescription>
                Lisa entwickelt innovative Marketing-Strategien, die Ihrem 
                YouTube-Kanal zum Erfolg verhelfen.
              </MemberDescription>
            </TeamMember>
          </TeamGrid>
        </TeamSection>

        <Section>
          <SectionTitle>Warum YouShark wählen?</SectionTitle>
          <SectionContent>
            <Paragraph>
              In einer Welt voller leerer Versprechen und minderwertiger Services 
              steht YouShark für Qualität, Vertrauen und echte Ergebnisse. Wir verstehen, 
              dass Ihr YouTube-Kanal mehr als nur Zahlen ist - er ist Ihre Leidenschaft, 
              Ihr Business, Ihre Zukunft.
            </Paragraph>
            <Paragraph>
              Deshalb arbeiten wir jeden Tag daran, Ihnen nicht nur die besten Services 
              zu liefern, sondern auch ein Partner zu sein, auf den Sie sich verlassen können. 
              Mit transparenten Preisen, schnellem Support und nachweisbaren Ergebnissen 
              haben wir bereits tausenden von Creators zum Erfolg verholfen.
            </Paragraph>
          </SectionContent>
        </Section>

        <CTASection>
          <CTATitle>Bereit für Ihr YouTube-Wachstum?</CTATitle>
          <CTADescription>
            Schließen Sie sich tausenden zufriedener Kunden an und starten Sie noch heute 
            Ihre Erfolgsreise mit YouShark. Lassen Sie uns gemeinsam Ihre YouTube-Ziele erreichen!
          </CTADescription>
          <CTAButton href="/shop">
            Jetzt Services entdecken
          </CTAButton>
        </CTASection>
      </Container>
    </Layout>
    </>
  )
}

export default AboutPage