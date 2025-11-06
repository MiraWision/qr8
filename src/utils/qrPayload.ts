export type PayloadType = 'wifi' | 'link' | 'text' | 'vcard' | 'email' | 'phone' | 'sms' | 'event';

export function buildQrPayload(type: PayloadType, data: any): string {
  switch (type) {
    case 'link': {
      const url = (data?.url || '').toString().trim();
      return url || '';
    }
    case 'text': {
      const text = (data?.text || '').toString();
      return text;
    }
    case 'wifi': {
      const ssid = escapeWifiField(data?.ssid || '');
      const password = escapeWifiField(data?.password || '');
      const encryption = (data?.encryption || 'WPA').toString().toUpperCase();
      const hidden = data?.hidden ? 'H:true;' : '';
      // WIFI:T:WPA;S:mynetwork;P:mypass;;
      return `WIFI:T:${encryption};S:${ssid};P:${password};${hidden};`;
    }
    case 'vcard': {
      // Minimal vCard 3.0
      const name = (data?.name || '').toString();
      const phone = (data?.phone || '').toString();
      const email = (data?.email || '').toString();
      const company = (data?.company || '').toString();
      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        name ? `FN:${name}` : '',
        company ? `ORG:${company}` : '',
        phone ? `TEL;TYPE=CELL:${phone}` : '',
        email ? `EMAIL:${email}` : '',
        'END:VCARD',
      ].filter(Boolean);
      return lines.join('\n');
    }
    case 'email': {
      const email = (data?.email || '').toString();
      const subject = (data?.subject || '').toString();
      const body = (data?.body || '').toString();
      if (!email) return '';
      let mailto = `mailto:${email}`;
      const params: string[] = [];
      if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
      if (body) params.push(`body=${encodeURIComponent(body)}`);
      if (params.length > 0) mailto += `?${params.join('&')}`;
      return mailto;
    }
    case 'phone': {
      const phone = (data?.phone || '').toString();
      return phone ? `tel:${phone}` : '';
    }
    case 'sms': {
      const phone = (data?.phone || '').toString();
      const message = (data?.message || '').toString();
      if (!phone) return '';
      let sms = `smsto:${phone}`;
      if (message) sms += `:${encodeURIComponent(message)}`;
      return sms;
    }
    case 'event': {
      const title = (data?.title || '').toString();
      const location = (data?.location || '').toString();
      const description = (data?.description || '').toString();
      const startDate = (data?.startDate || '').toString();
      const endDate = (data?.endDate || '').toString();
      
      const lines = [
        'BEGIN:VEVENT',
        `SUMMARY:${title}`,
        location ? `LOCATION:${location}` : '',
        description ? `DESCRIPTION:${description}` : '',
        startDate ? `DTSTART:${startDate}` : '',
        endDate ? `DTEND:${endDate}` : '',
        'END:VEVENT',
      ].filter(Boolean);
      return lines.join('\n');
    }
    default:
      return '';
  }
}

function escapeWifiField(value: string): string {
  return value.replace(/([\\;:,\"])/g, '\\$1');
}


