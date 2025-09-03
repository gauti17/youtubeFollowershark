import React from 'react'
import Layout from '../components/Layout'
import styled from 'styled-components'

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  line-height: 1.6;
  font-family: 'Inter', sans-serif;
`

const PageTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
  text-align: center;
`

const LastUpdated = styled.p`
  text-align: center;
  color: #6b7280;
  margin-bottom: 40px;
  font-style: italic;
`

const Section = styled.section`
  margin-bottom: 40px;
`

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 16px;
  border-bottom: 2px solid #FF6B35;
  padding-bottom: 8px;
`

const SubSectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin: 24px 0 12px 0;
`

const Paragraph = styled.p`
  margin-bottom: 16px;
  color: #4a5568;
`

const List = styled.ul`
  margin: 16px 0;
  padding-left: 24px;
  
  li {
    margin-bottom: 8px;
    color: #4a5568;
  }
`

const WarningBox = styled.div`
  background: #fef3f2;
  padding: 24px;
  border-radius: 12px;
  border-left: 4px solid #ef4444;
  margin: 24px 0;
  
  strong {
    color: #dc2626;
  }
`

const InfoBox = styled.div`
  background: #f0f9ff;
  padding: 24px;
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
  margin: 24px 0;
  
  strong {
    color: #1d4ed8;
  }
`

const ContactInfo = styled.div`
  background: #f8fafc;
  padding: 24px;
  border-radius: 12px;
  border-left: 4px solid #FF6B35;
  margin: 24px 0;
`

const DisclaimerPage: React.FC = () => {
  return (
    <Layout 
      title="Haftungsausschluss - youshark"
      description="Haftungsausschluss von youshark - Wichtige Informationen über Haftung, Risiken und Verantwortlichkeiten unserer Services."
    >
      <Container>
        <PageTitle>Haftungsausschluss</PageTitle>
        <LastUpdated>Zuletzt aktualisiert: 29. August 2025</LastUpdated>

        <Section>
          <WarningBox>
            <strong>Wichtiger Hinweis:</strong> Durch die Nutzung unserer Services erklären Sie sich 
            mit den nachfolgenden Bedingungen und Haftungsausschlüssen einverstanden. Bitte lesen 
            Sie diesen Disclaimer sorgfältig durch.
          </WarningBox>
        </Section>

        <Section>
          <SectionTitle>1. Allgemeiner Haftungsausschluss</SectionTitle>
          <Paragraph>
            youshark stellt YouTube Marketing Services zur Verfügung. Die Nutzung erfolgt 
            auf eigenes Risiko des Kunden. Wir übernehmen keine Garantie für bestimmte 
            Ergebnisse oder Auswirkungen auf Ihr YouTube-Konto.
          </Paragraph>
          
          <InfoBox>
            <strong>Hinweis:</strong> YouTube ist eine eigenständige Plattform mit eigenen 
            Richtlinien und Algorithmen, die sich jederzeit ändern können und außerhalb 
            unserer Kontrolle liegen.
          </InfoBox>
        </Section>

        <Section>
          <SectionTitle>2. YouTube-Richtlinien und Risiken</SectionTitle>
          
          <SubSectionTitle>2.1 Einhaltung der YouTube-Richtlinien</SubSectionTitle>
          <List>
            <li>Unsere Services werden gemäß aktueller YouTube-Richtlinien erbracht</li>
            <li>YouTube kann seine Richtlinien jederzeit ohne Vorankündigung ändern</li>
            <li>Der Kunde ist für die Einhaltung aller YouTube-Bestimmungen verantwortlich</li>
            <li>Wir können nicht für Änderungen der YouTube-Richtlinien haftbar gemacht werden</li>
          </List>

          <SubSectionTitle>2.2 Mögliche Risiken</SubSectionTitle>
          <WarningBox>
            <strong>Mögliche Konsequenzen bei Richtlinienverstößen:</strong>
            <List>
              <li>Löschung von Videos oder Kanälen</li>
              <li>Einschränkung der Monetarisierung</li>
              <li>Account-Sperrungen oder -Warnungen</li>
              <li>Algorithmus-Anpassungen</li>
            </List>
            <strong>youshark haftet nicht für diese möglichen Konsequenzen.</strong>
          </WarningBox>
        </Section>

        <Section>
          <SectionTitle>3. Service-Beschränkungen</SectionTitle>
          
          <SubSectionTitle>3.1 Keine Erfolgsgarantie</SubSectionTitle>
          <List>
            <li>Wir garantieren nicht, dass unsere Services zu bestimmten Ergebnissen führen</li>
            <li>Organisches Wachstum und Engagement können nicht garantiert werden</li>
            <li>Algorithmus-Änderungen können die Wirksamkeit beeinträchtigen</li>
            <li>Konkurrenz und Marktbedingungen beeinflussen den Erfolg</li>
          </List>

          <SubSectionTitle>3.2 Technische Einschränkungen</SubSectionTitle>
          <List>
            <li>Services können durch technische Probleme verzögert werden</li>
            <li>YouTube-API-Änderungen können die Serviceerbringung beeinträchtigen</li>
            <li>Drittanbieter-Systeme können ausfallen oder sich ändern</li>
            <li>Internet-Verbindungsprobleme können Auswirkungen haben</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>4. Haftungsausschluss für Schäden</SectionTitle>
          
          <SubSectionTitle>4.1 Ausgeschlossene Schäden</SubSectionTitle>
          <Paragraph>youshark haftet nicht für:</Paragraph>
          <List>
            <li>Direkte, indirekte oder Folgeschäden</li>
            <li>Entgangene Gewinne oder Umsätze</li>
            <li>Verlust von Daten oder Inhalten</li>
            <li>Rufschädigung oder Image-Verlust</li>
            <li>Geschäftsunterbrechungen</li>
            <li>Sonstige finanzielle Verluste</li>
          </List>

          <SubSectionTitle>4.2 Haftungsbegrenzung</SubSectionTitle>
          <Paragraph>
            Soweit gesetzlich zulässig, ist unsere Haftung auf den Wert der 
            bestellten Services begrenzt. Diese Begrenzung gilt nicht bei 
            Vorsatz oder grober Fahrlässigkeit.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>5. Externe Links und Inhalte</SectionTitle>
          
          <SubSectionTitle>5.1 Verlinkung auf externe Websites</SubSectionTitle>
          <Paragraph>
            Unsere Website kann Links zu externen Websites enthalten. Wir haben 
            keinen Einfluss auf deren Inhalte und übernehmen keine Haftung für 
            externe Websites oder deren Inhalte.
          </Paragraph>

          <SubSectionTitle>5.2 YouTube-Inhalte</SubSectionTitle>
          <List>
            <li>Der Kunde ist allein verantwortlich für seine YouTube-Inhalte</li>
            <li>Wir prüfen nicht die Rechtmäßigkeit der beworbenen Inhalte</li>
            <li>Urheberrechtsverletzungen liegen in der Verantwortung des Kunden</li>
            <li>Rechtswidrige Inhalte führen zur sofortigen Service-Einstellung</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>6. Markenrechte und geistiges Eigentum</SectionTitle>
          <Paragraph>
            YouTube, Google und alle zugehörigen Marken sind Eigentum ihrer 
            jeweiligen Inhaber. youshark ist nicht mit YouTube oder Google 
            verbunden, unterstützt oder gesponsert.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>7. Datenschutz und Sicherheit</SectionTitle>
          
          <SubSectionTitle>7.1 Datensicherheit</SubSectionTitle>
          <List>
            <li>Wir setzen angemessene Sicherheitsmaßnahmen ein</li>
            <li>Absolute Datensicherheit kann nicht garantiert werden</li>
            <li>Bei Sicherheitsvorfällen werden betroffene Kunden informiert</li>
            <li>Detaillierte Informationen in unserer Datenschutzerklärung</li>
          </List>

          <SubSectionTitle>7.2 YouTube-Daten</SubSectionTitle>
          <Paragraph>
            YouTube-URLs und zugehörige Metadaten werden nur zur Serviceerbringung 
            verwendet. Wir greifen nicht auf private YouTube-Daten zu.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>8. Verfügbarkeit der Services</SectionTitle>
          <List>
            <li>Wir streben eine hohe Verfügbarkeit an (99% Uptime)</li>
            <li>Wartungsarbeiten können zu temporären Ausfällen führen</li>
            <li>Höhere Gewalt kann die Serviceerbringung beeinträchtigen</li>
            <li>Drittanbieter-Ausfälle liegen außerhalb unserer Kontrolle</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>9. Rechtliche Hinweise</SectionTitle>
          
          <SubSectionTitle>9.1 Anwendbares Recht</SubSectionTitle>
          <Paragraph>
            Für alle Rechtsverhältnisse gilt deutsches Recht unter Ausschluss 
            des UN-Kaufrechts. Verbraucher können sich auf die zwingenden 
            Bestimmungen ihres Wohnsitzlandes berufen.
          </Paragraph>

          <SubSectionTitle>9.2 Gerichtsstand</SubSectionTitle>
          <Paragraph>
            Gerichtsstand für alle Streitigkeiten ist der Sitz des Anbieters, 
            soweit gesetzlich zulässig.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>10. Änderungen des Disclaimers</SectionTitle>
          <Paragraph>
            Wir behalten uns vor, diesen Haftungsausschluss jederzeit zu ändern. 
            Änderungen werden auf dieser Seite veröffentlicht und treten sofort 
            in Kraft. Die fortgesetzte Nutzung unserer Services gilt als 
            Zustimmung zu den Änderungen.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>11. Kontakt</SectionTitle>
          <Paragraph>
            Bei Fragen zu diesem Haftungsausschluss kontaktieren Sie uns:
          </Paragraph>
          <ContactInfo>
            <strong>E-Mail:</strong> support@youshark.de<br />
            <strong>Betreff:</strong> Disclaimer-Anfrage<br />
            <strong>Antwortzeit:</strong> Innerhalb von 48 Stunden
          </ContactInfo>
        </Section>
      </Container>
    </Layout>
  )
}

export default DisclaimerPage