import React, { useState, useMemo } from 'react'
import Layout from '../components/Layout'
import styled from 'styled-components'
import SEO from '../components/SEO'
import { pageSEOConfigs, generateStructuredData } from '../lib/seo'

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
`

const PageTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
  text-align: center;
`

const PageDescription = styled.p`
  text-align: center;
  color: #6b7280;
  margin-bottom: 50px;
  font-size: 18px;
  line-height: 1.6;
`

const SearchBox = styled.div`
  margin-bottom: 40px;
  position: relative;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #FF6B35;
  }

  &::placeholder {
    color: #9ca3af;
  }
`

const FAQSection = styled.div`
  margin-bottom: 40px;
`

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 2px solid #FF6B35;
`

const FAQItem = styled.div<{ $isOpen: boolean }>`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #FF6B35;
    box-shadow: 0 2px 8px rgba(255, 107, 53, 0.1);
  }
`

const FAQQuestion = styled.button`
  width: 100%;
  padding: 20px;
  text-align: left;
  background: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #1a1a1a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Inter', sans-serif;
  transition: background-color 0.2s;

  &:hover {
    background: #f8fafc;
  }
`

const FAQIcon = styled.span<{ $isOpen: boolean }>`
  font-size: 20px;
  color: #FF6B35;
  transition: transform 0.2s ease;
  transform: ${props => props.$isOpen ? 'rotate(45deg)' : 'rotate(0deg)'};
`

const FAQAnswer = styled.div<{ $isOpen: boolean }>`
  max-height: ${props => props.$isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  background: #f8fafc;
`

const FAQContent = styled.div`
  padding: 20px;
  color: #4a5568;
  line-height: 1.6;
  
  ul {
    margin: 12px 0;
    padding-left: 20px;
    
    li {
      margin-bottom: 6px;
    }
  }
  
  strong {
    color: #2d3748;
  }
`

const ContactCTA = styled.div`
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  margin-top: 50px;
`

const CTATitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
`

const CTADescription = styled.p`
  margin-bottom: 20px;
  opacity: 0.9;
`

const CTAButton = styled.a`
  background: white;
  color: #FF6B35;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  display: inline-block;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`

interface FAQItemProps {
  question: string
  answer: React.ReactNode
  category?: string
}

const faqData: FAQItemProps[] = [
  {
    category: "Services & Bestellung",
    question: "Welche YouTube Services bietet youshark an?",
    answer: (
      <>
        <p>youshark bietet eine vollständige Palette von YouTube Marketing Services:</p>
        <ul>
          <li><strong>YouTube Views:</strong> Echte Aufrufe von aktiven Nutzern (50 - 100.000+)</li>
          <li><strong>YouTube Likes:</strong> Gefällt-mir-Angaben für bessere Interaktion</li>
          <li><strong>YouTube Subscribers:</strong> Echte Abonnenten für Kanalwachstum</li>
          <li><strong>YouTube Comments:</strong> Relevante Kommentare zur Steigerung der Engagement-Rate</li>
        </ul>
        <p>Alle Services werden von echten, aktiven YouTube-Nutzern erbracht - keine Bots oder Fake-Accounts.</p>
      </>
    )
  },
  {
    category: "Services & Bestellung",
    question: "Wie funktioniert der Bestellprozess?",
    answer: (
      <>
        <p>Der Bestellprozess ist einfach und schnell:</p>
        <ul>
          <li>1. <strong>Service auswählen:</strong> Wählen Sie den gewünschten Service und die Menge</li>
          <li>2. <strong>YouTube-URL eingeben:</strong> Geben Sie die URL Ihres Videos oder Kanals ein</li>
          <li>3. <strong>Optionen wählen:</strong> Geschwindigkeit (Standard/Express/Premium) und weitere Einstellungen</li>
          <li>4. <strong>Bezahlen:</strong> Sichere Zahlung per PayPal, Kreditkarte oder Sofortüberweisung</li>
          <li>5. <strong>Lieferung:</strong> Services werden automatisch gestartet und geliefert</li>
        </ul>
      </>
    )
  },
  {
    category: "Services & Bestellung",
    question: "Wie schnell werden die Services geliefert?",
    answer: (
      <>
        <p>Die Lieferzeit hängt von der gewählten Geschwindigkeitsoption ab:</p>
        <ul>
          <li><strong>Standard:</strong> 24-72 Stunden nach Zahlungseingang</li>
          <li><strong>Express:</strong> 6-24 Stunden nach Zahlungseingang</li>
          <li><strong>Premium:</strong> 1-6 Stunden nach Zahlungseingang</li>
        </ul>
        <p>Die Services werden schrittweise und natürlich geliefert, um die YouTube-Richtlinien einzuhalten und Auffälligkeiten zu vermeiden.</p>
      </>
    )
  },
  {
    category: "Sicherheit & Qualität",
    question: "Sind die Services sicher für meinen YouTube-Kanal?",
    answer: (
      <>
        <p>Ja, unsere Services sind absolut sicher:</p>
        <ul>
          <li><strong>Echte Nutzer:</strong> Alle Interaktionen stammen von echten, aktiven YouTube-Accounts</li>
          <li><strong>Graduelle Lieferung:</strong> Services werden natürlich und schrittweise geliefert</li>
          <li><strong>Richtlinien-konform:</strong> Vollständige Einhaltung der YouTube-Nutzungsbestimmungen</li>
          <li><strong>Kein Risiko:</strong> Keine Bots, keine Fake-Accounts, keine Spam-Methoden</li>
        </ul>
        <p>Wir arbeiten seit Jahren erfolgreich mit Tausenden von YouTube-Kanälen zusammen, ohne dass es zu Problemen gekommen ist.</p>
      </>
    )
  },
  {
    category: "Sicherheit & Qualität",
    question: "Kann mein YouTube-Kanal gesperrt werden?",
    answer: (
      <>
        <p>Das Risiko ist minimal bis nicht vorhanden:</p>
        <ul>
          <li><strong>Sichere Methoden:</strong> Wir verwenden ausschließlich richtlinienkonforme Methoden</li>
          <li><strong>Echte Interaktionen:</strong> Alle Services stammen von echten YouTube-Nutzern</li>
          <li><strong>Natürliche Muster:</strong> Lieferung erfolgt in natürlichen, organischen Mustern</li>
          <li><strong>Erfahrung:</strong> Über 5 Jahre Erfahrung ohne Kanalsperrungen</li>
        </ul>
        <p><strong>Wichtig:</strong> Ihr Content muss den YouTube-Community-Richtlinien entsprechen. Wir bewerben keine illegalen oder gegen die Richtlinien verstoßende Inhalte.</p>
      </>
    )
  },
  {
    category: "Zahlung & Preise",
    question: "Welche Zahlungsmethoden werden akzeptiert?",
    answer: (
      <>
        <p>Wir bieten verschiedene sichere Zahlungsmöglichkeiten:</p>
        <ul>
          <li><strong>PayPal:</strong> Schnell und sicher, sofortige Bearbeitung</li>
          <li><strong>Kreditkarte:</strong> Visa, MasterCard, American Express</li>
          <li><strong>Sofortüberweisung:</strong> Direkte Banküberweisung</li>
          <li><strong>Klarna:</strong> Kauf auf Rechnung (bei ausgewählten Bestellungen)</li>
        </ul>
        <p>Alle Zahlungen werden über sichere, verschlüsselte Verbindungen abgewickelt. Ihre Zahlungsdaten werden niemals bei uns gespeichert.</p>
      </>
    )
  },
  {
    category: "Zahlung & Preise",
    question: "Sind in den Preisen bereits alle Kosten enthalten?",
    answer: (
      <>
        <p>Ja, unsere Preise sind transparent und vollständig:</p>
        <ul>
          <li><strong>Endpreise:</strong> Alle angezeigten Preise sind Endpreise (MwSt.-befreit als Kleinunternehmer)</li>
          <li><strong>Keine versteckten Kosten:</strong> Keine zusätzlichen Bearbeitungsgebühren</li>
          <li><strong>Express-Zuschlag:</strong> Nur bei Express/Premium-Optionen transparent ausgewiesen</li>
          <li><strong>Mengenrabatte:</strong> Automatisch angewendet bei größeren Bestellungen</li>
        </ul>
        <p>Der Preis im Warenkorb ist der finale Preis, den Sie bezahlen.</p>
      </>
    )
  },
  {
    category: "Support & Rückerstattung",
    question: "Was passiert, wenn die Services nicht geliefert werden?",
    answer: (
      <>
        <p>Wir garantieren die Lieferung aller Services:</p>
        <ul>
          <li><strong>Liefergarantie:</strong> 100% Lieferung oder vollständige Rückerstattung</li>
          <li><strong>Überwachung:</strong> Alle Bestellungen werden kontinuierlich überwacht</li>
          <li><strong>Nachschub:</strong> Bei natürlichen Rückgängen kostenloser Nachschub (30 Tage)</li>
          <li><strong>Support:</strong> 24/7 Kundensupport bei Problemen</li>
        </ul>
        <p>Falls Services nicht innerhalb der angegebenen Zeit geliefert werden, erhalten Sie automatisch eine Benachrichtigung und wahlweise Nachlieferung oder Rückerstattung.</p>
      </>
    )
  },
  {
    category: "Support & Rückerstattung",
    question: "Kann ich eine Rückerstattung erhalten?",
    answer: (
      <>
        <p>Ja, Rückerstattungen sind unter bestimmten Umständen möglich:</p>
        <ul>
          <li><strong>Vollständige Rückerstattung:</strong> Bei technischen Problemen oder nicht gestarteten Services</li>
          <li><strong>Teilweise Rückerstattung:</strong> Bei unvollständiger Lieferung (unter 80%)</li>
          <li><strong>Bearbeitungszeit:</strong> 2-5 Werktage Prüfung, 5-10 Werktage Rückzahlung</li>
          <li><strong>Antrag:</strong> Per E-Mail mit Bestellnummer und Begründung</li>
        </ul>
        <p>Detaillierte Informationen finden Sie in unseren <a href="/refund" style={{color: '#FF6B35'}}>Rückerstattungsrichtlinien</a>.</p>
      </>
    )
  },
  {
    category: "Technisches",
    question: "Welche YouTube-URL-Formate werden unterstützt?",
    answer: (
      <>
        <p>Wir unterstützen alle gängigen YouTube-URL-Formate:</p>
        <ul>
          <li><strong>Standard-Videos:</strong> https://youtube.com/watch?v=VIDEO_ID</li>
          <li><strong>Kurz-URLs:</strong> https://youtu.be/VIDEO_ID</li>
          <li><strong>Embed-URLs:</strong> https://youtube.com/embed/VIDEO_ID</li>
          <li><strong>Kanäle:</strong> https://youtube.com/@kanalname oder https://youtube.com/channel/ID</li>
        </ul>
        <p>Unser System erkennt automatisch den URL-Typ und validiert die Gültigkeit. Ungültige URLs werden sofort erkannt und können korrigiert werden.</p>
      </>
    )
  },
  {
    category: "Technisches",
    question: "Muss mein Video öffentlich sein?",
    answer: (
      <>
        <p>Ja, für die meisten Services muss Ihr Content öffentlich zugänglich sein:</p>
        <ul>
          <li><strong>Öffentliche Videos:</strong> Erforderlich für Views, Likes und Comments</li>
          <li><strong>Nicht gelistete Videos:</strong> Nur Views möglich (mit direkter URL)</li>
          <li><strong>Private Videos:</strong> Keine Services möglich</li>
          <li><strong>Kanäle:</strong> Müssen öffentlich sichtbar sein für Subscriber</li>
        </ul>
        <p><strong>Wichtig:</strong> Stellen Sie Ihr Video nicht auf privat während der Service-Lieferung, da dies die Bearbeitung stoppt.</p>
      </>
    )
  }
]

const FAQPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  // SEO configuration for FAQ page
  const faqSEO = useMemo(() => ({
    ...pageSEOConfigs.faq,
    url: 'https://youshark.de/faq',
    image: '/images/youshark-og-image.jpg',
    type: 'website' as const,
    canonical: 'https://youshark.de/faq'
  }), [])

  // Generate structured data for the FAQ page
  const faqStructuredData = useMemo(() => {
    return generateStructuredData('website', {
      name: 'YouShark FAQ',
      description: pageSEOConfigs.faq.description
    })
  }, [])

  const toggleFAQ = (index: number) => {
    if (openItems.includes(index)) {
      setOpenItems(openItems.filter(i => i !== index))
    } else {
      setOpenItems([...openItems, index])
    }
  }

  // Group FAQ items by category
  const groupedFAQ = faqData.reduce((acc, item, index) => {
    const category = item.category || 'Allgemein'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push({ ...item, originalIndex: index })
    return acc
  }, {} as { [key: string]: Array<FAQItemProps & { originalIndex: number }> })

  // Filter FAQ items based on search term
  const filteredFAQ = Object.keys(groupedFAQ).reduce((acc, category) => {
    const filteredItems = groupedFAQ[category].filter(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof item.answer === 'string' ? item.answer.toLowerCase().includes(searchTerm.toLowerCase()) : false)
    )
    if (filteredItems.length > 0) {
      acc[category] = filteredItems
    }
    return acc
  }, {} as { [key: string]: Array<FAQItemProps & { originalIndex: number }> })

  return (
    <>
      <SEO 
        {...faqSEO}
        structuredData={faqStructuredData}
      />
      <Layout 
        title={faqSEO.title}
        description={faqSEO.description}
        keywords={faqSEO.keywords?.join(', ') || ''}
      >
      <Container>
        <PageTitle>Häufig gestellte Fragen</PageTitle>
        <PageDescription>
          Finden Sie schnell Antworten auf die wichtigsten Fragen zu unseren YouTube Marketing Services.
          Nutzen Sie die Suche oder durchstöbern Sie die Kategorien.
        </PageDescription>

        <SearchBox>
          <SearchInput
            type="text"
            placeholder="Nach Fragen oder Stichworten suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>

        {Object.keys(filteredFAQ).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <p>Keine Ergebnisse für "{searchTerm}" gefunden.</p>
            <p>Versuchen Sie andere Suchbegriffe oder kontaktieren Sie unseren Support.</p>
          </div>
        ) : (
          Object.keys(filteredFAQ).map((category) => (
            <FAQSection key={category}>
              <SectionTitle>{category}</SectionTitle>
              {filteredFAQ[category].map((item) => (
                <FAQItem key={item.originalIndex} $isOpen={openItems.includes(item.originalIndex)}>
                  <FAQQuestion onClick={() => toggleFAQ(item.originalIndex)}>
                    <span>{item.question}</span>
                    <FAQIcon $isOpen={openItems.includes(item.originalIndex)}>+</FAQIcon>
                  </FAQQuestion>
                  <FAQAnswer $isOpen={openItems.includes(item.originalIndex)}>
                    <FAQContent>{item.answer}</FAQContent>
                  </FAQAnswer>
                </FAQItem>
              ))}
            </FAQSection>
          ))
        )}

        <ContactCTA>
          <CTATitle>Weitere Fragen?</CTATitle>
          <CTADescription>
            Haben Sie eine Frage, die hier nicht beantwortet wurde? Unser Support-Team hilft Ihnen gerne weiter!
          </CTADescription>
          <CTAButton href="/contact">
            Support kontaktieren
          </CTAButton>
        </ContactCTA>
      </Container>
    </Layout>
    </>
  )
}

export default FAQPage