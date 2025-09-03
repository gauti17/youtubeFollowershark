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

const TermsPage: React.FC = () => {
  return (
    <Layout 
      title="Allgemeine Geschäftsbedingungen - youshark"
      description="Allgemeine Geschäftsbedingungen von youshark - Erfahren Sie mehr über unsere Nutzungsbedingungen und Servicebedingungen."
    >
      <Container>
        <PageTitle>Allgemeine Geschäftsbedingungen</PageTitle>
        <LastUpdated>Zuletzt aktualisiert: 29. August 2025</LastUpdated>

        <Section>
          <SectionTitle>1. Geltungsbereich und Vertragspartner</SectionTitle>
          <Paragraph>
            Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen 
            youshark (nachfolgend "Anbieter") und dem Kunden über die Erbringung von 
            YouTube Marketing Services.
          </Paragraph>
          <ContactInfo>
            <strong>youshark</strong><br />
            E-Mail: support@youshark.de<br />
            Website: https://youshark.de
          </ContactInfo>
        </Section>

        <Section>
          <SectionTitle>2. Vertragsschluss</SectionTitle>
          <Paragraph>
            Der Vertrag kommt durch die Bestellung des Kunden und die Bestätigung durch 
            den Anbieter zustande. Die Darstellung der Services auf unserer Website stellt 
            kein rechtlich bindendes Angebot dar, sondern eine unverbindliche 
            Aufforderung zur Abgabe einer Bestellung.
          </Paragraph>
          <List>
            <li>Bestellung erfolgt durch Ausfüllen des Bestellformulars</li>
            <li>Bestätigung erfolgt per E-Mail nach erfolgter Zahlung</li>
            <li>Services werden nach Zahlungseingang bearbeitet</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>3. Leistungsbeschreibung</SectionTitle>
          
          <SubSectionTitle>3.1 YouTube Marketing Services</SubSectionTitle>
          <Paragraph>Der Anbieter erbringt folgende Services:</Paragraph>
          <List>
            <li><strong>YouTube Views:</strong> Erhöhung der Aufrufe für YouTube-Videos</li>
            <li><strong>YouTube Likes:</strong> Erhöhung der Gefällt-mir-Angaben</li>
            <li><strong>YouTube Subscribers:</strong> Erhöhung der Kanalabonnenten</li>
            <li><strong>YouTube Comments:</strong> Hinzufügung von Kommentaren</li>
          </List>

          <SubSectionTitle>3.2 Service-Qualität</SubSectionTitle>
          <List>
            <li>Services werden von echten, aktiven Nutzern erbracht</li>
            <li>Kein Einsatz von Bots oder automatisierten Systemen</li>
            <li>Graduelle Lieferung zur Vermeidung von Auffälligkeiten</li>
            <li>Einhaltung der YouTube-Nutzungsbestimmungen</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>4. Preise und Zahlung</SectionTitle>
          
          <SubSectionTitle>4.1 Preisgestaltung</SubSectionTitle>
          <List>
            <li>Alle Preise verstehen sich als Nettopreise (MwSt.-befreit als Kleinunternehmer gem. § 19 UStG)</li>
            <li>Preise sind freibleibend und können jederzeit geändert werden</li>
            <li>Für laufende Bestellungen gelten die zum Bestellzeitpunkt gültigen Preise</li>
          </List>

          <SubSectionTitle>4.2 Zahlungsmodalitäten</SubSectionTitle>
          <List>
            <li>Zahlung erfolgt im Voraus (Vorkasse)</li>
            <li>Akzeptierte Zahlungsmethoden: PayPal, Kreditkarte, Sofortüberweisung</li>
            <li>Services werden erst nach vollständigem Zahlungseingang bearbeitet</li>
            <li>Zahlungsziel: Sofort bei Bestellung</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>5. Lieferung und Erfüllung</SectionTitle>
          
          <SubSectionTitle>5.1 Lieferzeiten</SubSectionTitle>
          <List>
            <li><strong>Standard:</strong> 24-72 Stunden nach Zahlungseingang</li>
            <li><strong>Express:</strong> 6-24 Stunden nach Zahlungseingang</li>
            <li><strong>Premium:</strong> 1-6 Stunden nach Zahlungseingang</li>
          </List>

          <SubSectionTitle>5.2 Lieferbedingungen</SubSectionTitle>
          <Paragraph>
            Die Services werden schrittweise und natürlich erbracht, um die 
            Richtlinien von YouTube einzuhalten und Auffälligkeiten zu vermeiden.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>6. Kundenverantwortung</SectionTitle>
          <Paragraph>Der Kunde verpflichtet sich:</Paragraph>
          <List>
            <li>Korrekte und gültige YouTube-URLs anzugeben</li>
            <li>Videos/Kanäle nicht während der Service-Erbringung zu löschen</li>
            <li>Keine Inhalte zu bewerben, die gegen Gesetze oder YouTube-Richtlinien verstoßen</li>
            <li>Die Nutzungsbestimmungen von YouTube einzuhalten</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>7. Gewährleistung und Haftung</SectionTitle>
          
          <SubSectionTitle>7.1 Gewährleistung</SubSectionTitle>
          <List>
            <li>Services werden professionell und sorgfältig erbracht</li>
            <li>Bei Nichterfüllung: Nachbesserung oder Ersatzlieferung</li>
            <li>Gewährleistungsfrist: 30 Tage ab Lieferung</li>
          </List>

          <SubSectionTitle>7.2 Haftungsausschluss</SubSectionTitle>
          <Paragraph>
            Der Anbieter haftet nicht für Schäden, die durch YouTube-Richtlinienänderungen, 
            Account-Sperrungen oder andere externe Faktoren entstehen. Die Haftung ist 
            auf den Auftragswert begrenzt.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>8. Widerrufsrecht</SectionTitle>
          <Paragraph>
            Da es sich um digitale Dienstleistungen handelt, die sofort nach Vertragsschluss 
            erbracht werden, entfällt das Widerrufsrecht gemäß § 356 Abs. 5 BGB, sofern 
            der Kunde ausdrücklich zugestimmt hat.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>9. Datenschutz</SectionTitle>
          <Paragraph>
            Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung 
            und den Bestimmungen der DSGVO. Weitere Informationen finden Sie in unserer 
            separaten Datenschutzerklärung.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>10. Schlussbestimmungen</SectionTitle>
          
          <SubSectionTitle>10.1 Änderungen der AGB</SubSectionTitle>
          <Paragraph>
            Der Anbieter behält sich vor, diese AGB zu ändern. Kunden werden über 
            Änderungen per E-Mail informiert. Ohne Widerspruch innerhalb von 14 Tagen 
            gelten die neuen AGB als akzeptiert.
          </Paragraph>

          <SubSectionTitle>10.2 Salvatorische Klausel</SubSectionTitle>
          <Paragraph>
            Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die 
            Wirksamkeit der übrigen Bestimmungen unberührt.
          </Paragraph>

          <SubSectionTitle>10.3 Gerichtsstand und anwendbares Recht</SubSectionTitle>
          <List>
            <li>Es gilt deutsches Recht</li>
            <li>Gerichtsstand ist der Sitz des Anbieters</li>
            <li>EU-Verbraucher können auch an ihrem Wohnsitz klagen</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>11. Kontakt</SectionTitle>
          <Paragraph>
            Bei Fragen zu diesen AGB oder unseren Services kontaktieren Sie uns:
          </Paragraph>
          <ContactInfo>
            <strong>E-Mail:</strong> support@youshark.de<br />
            <strong>Betreff:</strong> AGB-Anfrage<br />
            <strong>Antwortzeit:</strong> Innerhalb von 48 Stunden
          </ContactInfo>
        </Section>
      </Container>
    </Layout>
  )
}

export default TermsPage