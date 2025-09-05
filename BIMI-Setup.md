# BIMI (Brand Indicators for Message Identification) Setup

This document outlines the setup required for BIMI to display the YouShark logo in Gmail, Outlook, and other supported email clients.

## What is BIMI?

BIMI allows verified senders to display their logo next to their emails in supported email clients, improving brand recognition and trust.

## Requirements

1. **Domain Authentication**: DMARC policy must be set to `quarantine` or `reject`
2. **Logo Requirements**: SVG format, square aspect ratio, hosted on HTTPS
3. **DNS Configuration**: BIMI record in DNS

## Files Created

- `/public/bimi-logo.svg` - BIMI-compliant logo (500x500px SVG with proper baseProfile)
- `/public/bimi-logo-optimized.svg` - Optimized BIMI logo (400x400px, recommended for use)

## SVG Compliance Fixed

The logos now include:
- `version="1.2"` - Required SVG version for BIMI
- `baseProfile="tiny-ps"` - BIMI-supported SVG base profile
- Standard font families (Arial) for better compatibility
- Proper encoding and namespace declarations

## DNS Records Required

Add the following DNS TXT record to your domain:

### For youshark.de:

```
Name: default._bimi.youshark.de
Type: TXT
Value: v=BIMI1; l=https://youshark.de/bimi-logo-optimized.svg;
```

### For email subdomain (if using):

```
Name: default._bimi.mail.youshark.de
Type: TXT
Value: v=BIMI1; l=https://youshark.de/bimi-logo-optimized.svg;
```

## BIMI Certificate (Optional but Recommended)

For full BIMI support including logos in Gmail, you may need a Verified Mark Certificate (VMC):

### Without Certificate (Basic BIMI):
- Works with some email providers
- Limited logo display
- DNS record only needed

### With VMC Certificate (Full BIMI):
- Full Gmail support
- Enhanced brand protection
- Requires verified trademark
- Cost: $1,500-$2,500/year

#### VMC Providers:
- DigiCert
- Entrust
- Sectigo

#### DNS with VMC Certificate:
```
Name: default._bimi.youshark.de
Type: TXT
Value: v=BIMI1; l=https://youshark.de/bimi-logo-optimized.svg; a=https://youshark.de/bimi-certificate.pem;
```

## DMARC Configuration

Ensure your DMARC record is properly configured (required for BIMI):

```
Name: _dmarc.youshark.de
Type: TXT
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@youshark.de; ruf=mailto:dmarc@youshark.de; fo=1;
```

## SPF Configuration

Ensure SPF is properly configured:

```
Name: youshark.de
Type: TXT
Value: v=spf1 include:_spf.google.com ~all
```

## DKIM Configuration

Ensure DKIM is properly configured through your email provider (Google Workspace, Office 365, etc.).

## Verification Steps

1. **Deploy the logo**: Ensure `bimi-logo.svg` is accessible at `https://youshark.de/bimi-logo.svg`
2. **Add DNS records**: Add the BIMI TXT record to your DNS
3. **Verify DMARC compliance**: Use tools like MXToolbox to verify DMARC is working
4. **Test BIMI**: Use BIMI Inspector tools to validate the setup

## Testing Tools

- [BIMI Inspector](https://bimigroup.org/bimi-generator/)
- [MXToolbox DMARC Analyzer](https://mxtoolbox.com/dmarc.aspx)
- [BIMI Lookup Tool](https://dmarcanalyzer.com/bimi-record-check/)

## Timeline

- DNS propagation: 24-48 hours
- Email client recognition: Can take several weeks for full deployment
- Gmail typically shows BIMI logos faster than other providers

## Supported Email Clients

- Gmail (web, mobile apps)
- Yahoo Mail
- Fastmail
- Apple Mail (iOS 16+)
- Outlook (limited support, rolling out gradually)

## Notes

- The logo must be exactly square (1:1 aspect ratio)
- SVG must be under 32KB
- Logo will be displayed at approximately 96x96px in emails
- BIMI requires consistent email authentication (SPF, DKIM, DMARC)
- Some email providers may require additional verification for new domains

## Maintenance

- Monitor DMARC reports to ensure compliance
- Keep the logo file accessible and unchanged
- Update DNS records if logo URL changes