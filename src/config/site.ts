export type SocialLinks = {
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  googleReview?: string;
};

const ADDRESS = {
  street: 'Calle Girardot con esquina de la Calle Nazaret (N° 25-262)',
  city: 'Punto Fijo',
  region: 'Estado Falcón',
  country: 'Venezuela',
  countryCode: 'VE',
} as const;

export const SITE = {
  doctorName: 'Od. Albany Centeno',
  doctorTitle: 'Od. Albany Centeno',
  clinicName: 'Centro Medico Luna Design',
  specialty: 'Odontología General y Estética Dental',
  description:
    'Atención odontológica personalizada en Punto Fijo, Estado Falcón. Limpieza dental, ortodoncia y extracciones con trato humano y enfoque profesional.',
  domain: 'https://odalbanycenteno.com',
  language: 'es',
  locale: 'es_VE',
  address: {
    ...ADDRESS,
    full: `${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.region}, ${ADDRESS.country}`,
  },
  geo: {
    latitude: '[PENDIENTE: coordenada latitud decimal]',
    longitude: '[PENDIENTE: coordenada longitud decimal]',
    plusCode: 'MQQW+PM Punto Fijo, Falcón',
    regionCode: 'VE-I',
    placename: 'Punto Fijo, Falcón',
    mapsUrl: 'https://maps.app.goo.gl/8h1wGoquJvVJHYhd6',
    mapsEmbedUrl: 'https://www.google.com/maps?q=MQQW%2BPM+Punto+Fijo,+Falc%C3%B3n&output=embed',
  },
  phone: {
    display: '+58 412-6400748',
    e164: '+584126400748',
    tel: 'tel:+584126400748',
    whatsapp: 'https://wa.me/584126400748',
  },
  hours: {
    label: 'Lunes a viernes',
    detail: '[PENDIENTE: horario específico, ej. 8:00 am - 5:00 pm]',
    openingHoursSpecification: [
      {
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '[PENDIENTE]',
        closes: '[PENDIENTE]',
      },
    ],
  },
  socials: {
    instagram: 'https://www.instagram.com/od.albanyc',
    facebook: '[PENDIENTE: URL Facebook]',
    whatsapp: 'https://wa.me/584126400748',
    googleReview: '[PENDIENTE: URL para dejar reseña en Google]',
  } satisfies SocialLinks,
  areaServed: ['Punto Fijo', 'Estado Falcón', 'Venezuela'],
  credentials: {
    license: '[PENDIENTE: número de colegiatura/registro profesional]',
    experience: '[PENDIENTE: años de experiencia verificables]',
    education: ['[PENDIENTE: formación verificable]'],
    associations: ['[PENDIENTE: asociaciones profesionales]'],
  },
  analytics: {
    ga4Id: import.meta.env.PUBLIC_GA4_ID || '',
    googleSiteVerification: import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  forms: {
    // Configurar según destino elegido: 'mailto' | 'whatsapp' | 'endpoint' (Formspree/Netlify/etc.) | 'google-sheets'
    mode: (import.meta.env.PUBLIC_FORM_MODE || 'whatsapp') as 'mailto' | 'whatsapp' | 'endpoint' | 'google-sheets',
    endpoint: import.meta.env.PUBLIC_FORM_ENDPOINT || '',
    email: import.meta.env.PUBLIC_FORM_EMAIL || '[PENDIENTE: correo receptor]',
  },
  treatments: [
    { slug: 'limpieza-dental', name: 'Limpieza dental', short: 'Limpieza general y profilaxis profesional' },
    { slug: 'extraccion-dental', name: 'Extracción dental', short: 'Extracción segura y atención cuidadosa' },
    { slug: 'ortodoncia', name: 'Ortodoncia', short: 'Alineación dental y corrección de la mordida' },
  ],
  keywords: [
    'Odontóloga en Punto Fijo',
    'Odontólogo en Falcón',
    'Clínica odontológica en Punto Fijo',
    'Servicios odontológicos en Falcón',
    'Limpieza dental en Punto Fijo',
    'Ortodoncia en Falcón',
  ],
  medicalDisclaimer:
    'El contenido de este sitio es informativo y no reemplaza una consulta odontológica. El diagnóstico y el plan de tratamiento los define la doctora en consulta.',
  lastReviewed: '2026-11-16',
} as const;

export const NAV = [
  { label: 'Inicio', href: '/' },
  { label: 'Servicios', href: '/servicios/' },
  { label: 'Sobre mí', href: '/sobre-mi/' },
  { label: 'Agendar Cita', href: '/agendar-cita/' },
  { label: 'Blog', href: '/blog/' },
];
