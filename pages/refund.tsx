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

const HighlightBox = styled.div`
  background: #fef3f2;
  padding: 24px;
  border-radius: 12px;
  border-left: 4px solid #ef4444;
  margin: 24px 0;
  
  strong {
    color: #dc2626;
  }
`

const ContactInfo = styled.div`
  background: #f8fafc;
  padding: 24px;
  border-radius: 12px;
  border-left: 4px solid #FF6B35;
  margin: 24px 0;
`

const RefundPage: React.FC = () => {
  return (
    <Layout 
      title="Rückerstattungsrichtlinien - youshark"
      description="Rückerstattungsrichtlinien von youshark - Erfahren Sie mehr über unsere Rückgabe- und Erstattungsbedingungen."
    >
      <Container>
        <PageTitle>Rückerstattungsrichtlinien</PageTitle>
        <LastUpdated>Zuletzt aktualisiert: 29. August 2025</LastUpdated>

        <Section>
          <HighlightBox>
            <strong>Wichtiger Hinweis:</strong> Da unsere Services sofort nach der Bestellung 
            bearbeitet und geliefert werden, sind Rückerstattungen nur unter bestimmten 
            Umständen möglich.
          </HighlightBox>
        </Section>

        <Section>
          <SectionTitle>1. Allgemeine Rückerstattungsbedingungen</SectionTitle>
          <Paragraph>
            youshark ist bestrebt, qualitativ hochwertige Services zu liefern. 
            Da es sich um digitale Dienstleistungen handelt, die sofort erbracht werden, 
            gelten besondere Rückerstattungsbedingungen.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>2. Berechtigung für Rückerstattungen</SectionTitle>
          
          <SubSectionTitle>2.1 Vollständige Rückerstattung</SubSectionTitle>
          <Paragraph>Sie erhalten eine 100%ige Rückerstattung in folgenden Fällen:</Paragraph>
          <List>
            <li><strong>Technische Probleme:</strong> Services konnten aufgrund technischer Fehler unsererseits nicht geliefert werden</li>
            <li><strong>Falsche Bestellung:</strong> Versehentliche Mehrfachbestellung innerhalb von 5 Minuten</li>
            <li><strong>Service nicht gestartet:</strong> Bestellung wurde noch nicht bearbeitet (nur innerhalb der ersten Stunde)</li>
            <li><strong>Ungültige URL:</strong> Die angegebene YouTube-URL ist nicht erreichbar oder gelöscht</li>
          </List>

          <SubSectionTitle>2.2 Teilweise Rückerstattung</SubSectionTitle>
          <Paragraph>Eine anteilige Rückerstattung ist möglich bei:</Paragraph>
          <List>
            <li><strong>Unvollständige Lieferung:</strong> Weniger als 80% der bestellten Menge wurde geliefert</li>
            <li><strong>Qualitätsmängel:</strong> Auffällig unnatürliche Lieferung der Services</li>
            <li><strong>Verzögerung:</strong> Lieferung erfolgt später als die angegebene maximale Lieferzeit</li>
          </List>

          <SubSectionTitle>2.3 Keine Rückerstattung</SubSectionTitle>
          <Paragraph>Keine Rückerstattung erfolgt bei:</Paragraph>
          <List>
            <li>Services wurden vollständig und ordnungsgemäß geliefert</li>
            <li>Kunde hat Video/Kanal nach Bestellung gelöscht oder privat gestellt</li>
            <li>YouTube-Account wurde vom Kunden selbst gelöscht</li>
            <li>Änderung der YouTube-Algorithmen führt zu natürlichem Rückgang</li>
            <li>Kunde ist mit der Geschwindigkeit der Lieferung unzufrieden (bei korrekter Lieferzeit)</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>3. Rückerstattungsverfahren</SectionTitle>
          
          <SubSectionTitle>3.1 Antrag stellen</SubSectionTitle>
          <List>
            <li>Rückerstattungsantrag per E-Mail an support@youshark.de</li>
            <li>Betreff: "Rückerstattungsantrag - Bestellnummer [NUMMER]"</li>
            <li>Detaillierte Begründung des Antrags</li>
            <li>Screenshots als Nachweis (falls zutreffend)</li>
          </List>

          <SubSectionTitle>3.2 Bearbeitungszeit</SubSectionTitle>
          <List>
            <li><strong>Antwort:</strong> Innerhalb von 48 Stunden</li>
            <li><strong>Prüfung:</strong> 2-5 Werktage</li>
            <li><strong>Rückerstattung:</strong> 5-10 Werktage nach Genehmigung</li>
          </List>

          <SubSectionTitle>3.3 Benötigte Informationen</SubSectionTitle>
          <List>
            <li>Bestellnummer</li>
            <li>YouTube-URL des beworbenen Inhalts</li>
            <li>Grund für den Rückerstattungsantrag</li>
            <li>Screenshots der aktuellen Statistiken</li>
            <li>Kontaktdaten für die Rückerstattung</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>4. Rückerstattungsmethoden</SectionTitle>
          <Paragraph>Rückerstattungen erfolgen über die ursprünglich verwendete Zahlungsmethode:</Paragraph>
          <List>
            <li><strong>PayPal:</strong> Direkte Rückzahlung auf PayPal-Konto (1-3 Werktage)</li>
            <li><strong>Kreditkarte:</strong> Rückbuchung über Zahlungsanbieter (5-10 Werktage)</li>
            <li><strong>Sofortüberweisung:</strong> Banküberweisung (3-5 Werktage)</li>
          </List>
          <Paragraph>
            Die Bearbeitungszeit kann je nach Bank und Zahlungsanbieter variieren.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>5. Garantien und Qualitätssicherung</SectionTitle>
          
          <SubSectionTitle>5.1 Unsere Garantie</SubSectionTitle>
          <List>
            <li><strong>Liefergarantie:</strong> Services werden innerhalb der angegebenen Zeit geliefert</li>
            <li><strong>Qualitätsgarantie:</strong> Nur echte, hochwertige Interaktionen</li>
            <li><strong>Stabilität:</strong> Services sind dauerhaft und stabil</li>
          </List>

          <SubSectionTitle>5.2 Drop-Schutz</SubSectionTitle>
          <Paragraph>
            Sollten Services innerhalb von 30 Tagen nach Lieferung ohne ersichtlichen 
            Grund signifikant zurückgehen (mehr als 20%), bieten wir kostenlosen 
            Nachschub oder eine Teilrückerstattung.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>6. Dispute und Beschwerden</SectionTitle>
          
          <SubSectionTitle>6.1 Direkter Kontakt</SubSectionTitle>
          <Paragraph>
            Wir empfehlen, bei Problemen zunächst den direkten Kontakt zu uns zu suchen. 
            Die meisten Probleme können schnell und unkompliziert gelöst werden.
          </Paragraph>

          <SubSectionTitle>6.2 Eskalationsverfahren</SubSectionTitle>
          <List>
            <li>1. Direkter Kontakt mit unserem Support-Team</li>
            <li>2. Eskalation an das Management (bei ungelösten Fällen)</li>
            <li>3. Externe Schlichtung (nur als letzter Schritt)</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>7. Besondere Bestimmungen</SectionTitle>
          
          <SubSectionTitle>7.1 YouTube-Richtlinien</SubSectionTitle>
          <Paragraph>
            Sollten YouTube-Richtlinienänderungen dazu führen, dass Services nicht 
            geliefert werden können, erfolgt eine vollständige Rückerstattung der 
            noch nicht erbrachten Leistungen.
          </Paragraph>

          <SubSectionTitle>7.2 Account-Sperrungen</SubSectionTitle>
          <Paragraph>
            Bei Account-Sperrungen durch YouTube, die nachweislich nicht durch unsere 
            Services verursacht wurden, können wir keine Rückerstattung gewähren.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>8. Kontakt für Rückerstattungen</SectionTitle>
          <Paragraph>
            Für alle Fragen zu Rückerstattungen kontaktieren Sie uns:
          </Paragraph>
          <ContactInfo>
            <strong>E-Mail:</strong> support@youshark.de<br />
            <strong>Betreff:</strong> Rückerstattungsantrag<br />
            <strong>Antwortzeit:</strong> Innerhalb von 48 Stunden<br />
            <strong>Verfügbarkeit:</strong> Montag - Freitag, 9:00 - 18:00 Uhr
          </ContactInfo>
        </Section>

        <Section>
          <SectionTitle>9. Änderungen der Richtlinien</SectionTitle>
          <Paragraph>
            Wir behalten uns vor, diese Rückerstattungsrichtlinien zu aktualisieren. 
            Änderungen werden auf dieser Seite veröffentlicht und gelten für alle 
            zukünftigen Bestellungen. Laufende Anträge werden nach den zum 
            Bestellzeitpunkt gültigen Richtlinien bearbeitet.
          </Paragraph>
        </Section>
      </Container>
    </Layout>
  )
}

export default RefundPage