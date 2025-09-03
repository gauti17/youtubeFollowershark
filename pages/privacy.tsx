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

const ContactInfo = styled.div`
  background: #f8fafc;
  padding: 24px;
  border-radius: 12px;
  border-left: 4px solid #FF6B35;
  margin: 24px 0;
`

const PrivacyPage: React.FC = () => {
  return (
    <Layout 
      title="Datenschutzerklärung - youshark"
      description="Datenschutzerklärung von youshark - Erfahren Sie, wie wir Ihre persönlichen Daten schützen und verarbeiten."
    >
      <Container>
        <PageTitle>Datenschutzerklärung</PageTitle>
        <LastUpdated>Zuletzt aktualisiert: 29. August 2025</LastUpdated>

        <Section>
          <SectionTitle>1. Verantwortlicher</SectionTitle>
          <ContactInfo>
            <strong>youshark</strong><br />
            E-Mail: support@youshark.de<br />
            Website: https://youshark.de
          </ContactInfo>
        </Section>

        <Section>
          <SectionTitle>2. Allgemeines zur Datenverarbeitung</SectionTitle>
          <Paragraph>
            Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Diese Datenschutzerklärung 
            informiert Sie über die Art, den Umfang und den Zweck der Verarbeitung personenbezogener 
            Daten auf unserer Website und in Zusammenhang mit unseren YouTube Growth Services.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>3. Erhebung und Verarbeitung personenbezogener Daten</SectionTitle>
          
          <SubSectionTitle>3.1 Bestelldaten</SubSectionTitle>
          <Paragraph>Bei der Bestellung unserer Services erheben wir folgende Daten:</Paragraph>
          <List>
            <li>Vor- und Nachname</li>
            <li>E-Mail-Adresse</li>
            <li>Land, Stadt und Postleitzahl</li>
            <li>YouTube-URL des zu bewerbenden Kanals/Videos</li>
            <li>Gewählte Service-Optionen</li>
          </List>
          <Paragraph>
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)<br />
            <strong>Zweck:</strong> Abwicklung Ihrer Bestellung und Erbringung der Services
          </Paragraph>

          <SubSectionTitle>3.2 Zahlungsdaten</SubSectionTitle>
          <Paragraph>
            Zahlungsdaten werden direkt von unseren Zahlungsdienstleistern (PayPal, Stripe, etc.) 
            verarbeitet. Wir erhalten keine vollständigen Kreditkartendaten, sondern nur 
            Transaktionsbestätigungen.
          </Paragraph>

          <SubSectionTitle>3.3 Website-Nutzung</SubSectionTitle>
          <Paragraph>Bei jedem Besuch unserer Website werden automatisch folgende Daten erhoben:</Paragraph>
          <List>
            <li>IP-Adresse</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
            <li>Verwendeter Browser und Betriebssystem</li>
            <li>Aufgerufene Seiten</li>
          </List>
          <Paragraph>
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)<br />
            <strong>Zweck:</strong> Bereitstellung der Website, Sicherheit und Optimierung
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>4. Cookies und Tracking</SectionTitle>
          <Paragraph>
            Unsere Website verwendet Cookies, um die Funktionalität zu gewährleisten und 
            das Nutzererlebnis zu verbessern. Sie können Cookies in Ihren Browser-Einstellungen 
            deaktivieren, dies kann jedoch die Funktionalität der Website beeinträchtigen.
          </Paragraph>
          
          <SubSectionTitle>4.1 Notwendige Cookies</SubSectionTitle>
          <List>
            <li>Warenkorb-Speicherung</li>
            <li>Session-Management</li>
            <li>Sicherheitsfeatures</li>
          </List>

          <SubSectionTitle>4.2 Analyse-Cookies</SubSectionTitle>
          <Paragraph>
            Wir verwenden anonymisierte Analysedaten, um unsere Website zu verbessern. 
            Eine Zuordnung zu Ihrer Person ist nicht möglich.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>5. Weitergabe an Dritte</SectionTitle>
          <Paragraph>
            Ihre Daten werden nur in folgenden Fällen an Dritte weitergegeben:
          </Paragraph>
          <List>
            <li><strong>Service-Erbringung:</strong> YouTube-URLs werden zur Erbringung der bestellten Services verwendet</li>
            <li><strong>Zahlungsabwicklung:</strong> Daten werden an Zahlungsdienstleister übermittelt</li>
            <li><strong>Rechtliche Verpflichtung:</strong> Bei behördlichen Anfragen aufgrund gesetzlicher Bestimmungen</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>6. Speicherdauer</SectionTitle>
          <List>
            <li><strong>Bestelldaten:</strong> 10 Jahre (steuerliche Aufbewahrungspflicht)</li>
            <li><strong>Kundenkonto-Daten:</strong> Bis zur Löschung des Accounts</li>
            <li><strong>Logdateien:</strong> Maximal 30 Tage</li>
            <li><strong>Marketing-Daten:</strong> Bis zum Widerruf der Einwilligung</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>7. Ihre Rechte</SectionTitle>
          <Paragraph>Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:</Paragraph>
          <List>
            <li><strong>Auskunftsrecht</strong> (Art. 15 DSGVO)</li>
            <li><strong>Berichtigungsrecht</strong> (Art. 16 DSGVO)</li>
            <li><strong>Löschungsrecht</strong> (Art. 17 DSGVO)</li>
            <li><strong>Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)</li>
            <li><strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
            <li><strong>Widerspruchsrecht</strong> (Art. 21 DSGVO)</li>
            <li><strong>Beschwerde bei Aufsichtsbehörde</strong> (Art. 77 DSGVO)</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>8. Datensicherheit</SectionTitle>
          <Paragraph>
            Wir setzen technische und organisatorische Maßnahmen ein, um Ihre Daten vor 
            unbefugtem Zugriff, Verlust oder Missbrauch zu schützen:
          </Paragraph>
          <List>
            <li>SSL-Verschlüsselung für alle Datenübertragungen</li>
            <li>Sichere Server in Deutschland/EU</li>
            <li>Regelmäßige Sicherheitsupdates</li>
            <li>Zugriffskontrollen und Berechtigungsmanagement</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>9. YouTube Services</SectionTitle>
          <Paragraph>
            Für die Erbringung unserer YouTube Growth Services verarbeiten wir die von Ihnen 
            angegebenen YouTube-URLs. Diese werden ausschließlich zur Durchführung der 
            bestellten Services verwendet und nicht für andere Zwecke gespeichert oder verarbeitet.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>10. Änderungen der Datenschutzerklärung</SectionTitle>
          <Paragraph>
            Wir behalten uns vor, diese Datenschutzerklärung zu aktualisieren, um sie an 
            geänderte Rechtslage oder bei Änderungen unserer Services anzupassen. 
            Die aktuelle Version finden Sie stets auf dieser Seite.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>11. Kontakt</SectionTitle>
          <Paragraph>
            Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte kontaktieren Sie uns:
          </Paragraph>
          <ContactInfo>
            <strong>E-Mail:</strong> support@youshark.de<br />
            <strong>Betreff:</strong> Datenschutz<br />
            <strong>Antwortzeit:</strong> Innerhalb von 48 Stunden
          </ContactInfo>
        </Section>
      </Container>
    </Layout>
  )
}

export default PrivacyPage