import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'

const FooterContainer = styled.footer`
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 50px 0 20px;
  margin-top: 80px;
`

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 30px;
`

const FooterSection = styled.div`
  h3, h4 {
    margin-bottom: 20px;
    color: #FF6B35;
  }
  
  h3 {
    font-size: 20px;
  }
  
  h4 {
    font-size: 16px;
  }
  
  p {
    color: #ccc;
    line-height: 1.6;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    margin-bottom: 10px;
  }
  
  a {
    color: #ccc;
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: #FF6B35;
    }
  }
`

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #333;
  color: #999;
`

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'YouShark'
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3 style={{fontWeight: 'bold', fontSize: '24px', letterSpacing: '1px'}}>
            <span style={{color: 'white'}}>you</span>
            <span style={{color: '#FF6B35'}}>shark</span>
            <span style={{color: '#FF6B35', fontSize: '28px'}}>.</span>
          </h3>
          <p>Professional YouTube growth services to help creators succeed and build their audience organically.</p>
        </FooterSection>
        
        <FooterSection>
          <h4>Services</h4>
          <ul>
            <li><Link href="/products/youtube-likes">YouTube Likes kaufen</Link></li>
            <li><Link href="/products/youtube-views">YouTube Views kaufen</Link></li>
            <li><Link href="/products/deutsche-youtube-views">Deutsche YouTube Views</Link></li>
            <li><Link href="/products/youtube-subscribers">YouTube Abonnenten kaufen</Link></li>
          </ul>
        </FooterSection>
        
        <FooterSection>
          <h4>Unternehmen</h4>
          <ul>
            <li><Link href="/about">Über uns</Link></li>
            <li><Link href="/contact">Kontakt</Link></li>
            <li><Link href="/faq">Häufige Fragen</Link></li>
            <li><Link href="/testimonials">Bewertungen</Link></li>
          </ul>
        </FooterSection>
        
        <FooterSection>
          <h4>Rechtliches</h4>
          <ul>
            <li><Link href="/terms">AGB</Link></li>
            <li><Link href="/privacy">Datenschutz</Link></li>
            <li><Link href="/refund">Widerrufsrecht</Link></li>
            <li><Link href="/disclaimer">Haftungsausschluss</Link></li>
          </ul>
        </FooterSection>
        
        <FooterSection>
          <h4>Kontakt</h4>
          <p>E-Mail: support@youshark.de</p>
          <p>24/7 Kundensupport</p>
          <p>Antwortzeit: &lt; 2 Stunden</p>
        </FooterSection>
      </FooterContent>
      
      <FooterBottom>
        <p>&copy; {currentYear} youshark. Alle Rechte vorbehalten.</p>
      </FooterBottom>
    </FooterContainer>
  )
}

export default Footer