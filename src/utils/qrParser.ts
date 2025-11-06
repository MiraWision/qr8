export interface ParsedQRData {
  type: 'wifi' | 'text' | 'link' | 'vcard' | 'email' | 'phone' | 'sms' | 'event';
  data: any;
}

class QRCodeParser {
  static parse(qrData: string): ParsedQRData {
    // WiFi: WIFI:T:<enc>;S:<ssid>;P:<pass>;H:<hidden>;;
    if (qrData.startsWith('WIFI:')) {
      return this.parseWiFi(qrData);
    }

    // vCard: BEGIN:VCARD ... END:VCARD
    if (qrData.includes('BEGIN:VCARD')) {
      return this.parseVCard(qrData);
    }

    // Event: BEGIN:VEVENT ... END:VEVENT
    if (qrData.includes('BEGIN:VEVENT')) {
      return this.parseEvent(qrData);
    }

    // Email: mailto:
    if (qrData.startsWith('mailto:')) {
      return this.parseEmail(qrData);
    }

    // Phone: tel:
    if (qrData.startsWith('tel:')) {
      return this.parsePhone(qrData);
    }

    // SMS: smsto:
    if (qrData.startsWith('smsto:')) {
      return this.parseSMS(qrData);
    }

    if (qrData.match(/^https?:\/\//i)) {
      return this.parseLink(qrData);
    }

    return {
      type: 'text',
      data: { text: qrData },
    };
  }

  private static parseWiFi(wifiString: string): ParsedQRData {
    const data: any = {
      ssid: '',
      password: '',
      encryption: 'WPA',
    };

    const parts = wifiString.replace('WIFI:', '').split(';');
    
    parts.forEach(part => {
      const [key, value] = part.split(':');
      
      switch (key) {
        case 'T':
          if (value === 'WPA' || value === 'WPA2') {
            data.encryption = value;
          } else if (value === 'WEP') {
            data.encryption = 'WEP';
          } else {
            data.encryption = 'None';
          }
          break;
        case 'S':
          data.ssid = value || '';
          break;
        case 'P':
          data.password = value || '';
          break;
      }
    });

    return {
      type: 'wifi',
      data,
    };
  }

  private static parseLink(url: string): ParsedQRData {
    return {
      type: 'link',
      data: { url },
    };
  }

  private static parseVCard(vcardString: string): ParsedQRData {
    const data: any = {
      name: '',
      phone: '',
      email: '',
      company: '',
    };

    const lines = vcardString.split('\n');
    
    lines.forEach(line => {
      if (line.startsWith('FN:')) {
        data.name = line.replace('FN:', '').trim();
      } else if (line.startsWith('TEL:')) {
        data.phone = line.replace('TEL:', '').trim();
      } else if (line.startsWith('EMAIL:')) {
        data.email = line.replace('EMAIL:', '').trim();
      } else if (line.startsWith('ORG:')) {
        data.company = line.replace('ORG:', '').trim();
      }
    });

    return {
      type: 'vcard',
      data,
    };
  }

  private static parseEmail(mailtoString: string): ParsedQRData {
    const data: any = {
      email: '',
      subject: '',
      body: '',
    };

    const withoutPrefix = mailtoString.replace('mailto:', '');
    const [emailPart, queryString] = withoutPrefix.split('?');
    data.email = decodeURIComponent(emailPart || '');

    if (queryString) {
      const params = new URLSearchParams(queryString);
      data.subject = params.get('subject') || '';
      data.body = params.get('body') || '';
    }

    return {
      type: 'email',
      data,
    };
  }

  private static parsePhone(telString: string): ParsedQRData {
    const phone = decodeURIComponent(telString.replace('tel:', ''));
    return {
      type: 'phone',
      data: { phone },
    };
  }

  private static parseSMS(smsString: string): ParsedQRData {
    const withoutPrefix = smsString.replace('smsto:', '');
    const [phone, message] = withoutPrefix.split(':');
    
    return {
      type: 'sms',
      data: {
        phone: phone || '',
        message: message ? decodeURIComponent(message) : '',
      },
    };
  }

  private static parseEvent(eventString: string): ParsedQRData {
    const data: any = {
      title: '',
      location: '',
      description: '',
      startDate: '',
      endDate: '',
    };

    const lines = eventString.split('\n');
    
    lines.forEach(line => {
      if (line.startsWith('SUMMARY:')) {
        data.title = line.replace('SUMMARY:', '').trim();
      } else if (line.startsWith('LOCATION:')) {
        data.location = line.replace('LOCATION:', '').trim();
      } else if (line.startsWith('DESCRIPTION:')) {
        data.description = line.replace('DESCRIPTION:', '').trim();
      } else if (line.startsWith('DTSTART:')) {
        data.startDate = line.replace('DTSTART:', '').trim();
      } else if (line.startsWith('DTEND:')) {
        data.endDate = line.replace('DTEND:', '').trim();
      }
    });

    return {
      type: 'event',
      data,
    };
  }
}

export default QRCodeParser;
