/**
 * Configuración SEO centralizada para Sodocu
 * Título: Sodocu (máximo 30 caracteres)
 * Palabras clave: Sodocu; Constructora; derechoinmobiliario; reglamentoph; contrato; Escrituras; notaria; Registro; linderos; vivienda
 * Descripción: Genera tus documentos legales de manera digital, creando plantillas que agilizan los procesos de tu empresa y los tiempos de tus trámites.
 */

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sodocu.com';

export const seoConfig = {
    title: 'Sodocu',
    fullTitle: 'Sodocu - Generación de Documentos Legales Digitales',
    description: 'Genera tus documentos legales de manera digital, creando plantillas que agilizan los procesos de tu empresa y los tiempos de tus trámites.',
    keywords: 'Sodocu, Constructora, derechoinmobiliario, reglamentoph, contrato, Escrituras, notaria, Registro, linderos, vivienda',
    author: 'Sodocu',
    siteName: 'Sodocu',
    url: baseUrl,
    locale: 'es_ES',
    type: 'website',
    // Actualizar con la URL real de la imagen cuando esté disponible
    image: `${baseUrl}/layout/images/logo-white.svg`,
    imageWidth: '300',
    imageHeight: '300',
    twitter: {
        card: 'summary',
        site: '@sodocu', // Actualizar con el handle real de Twitter si existe
        creator: '@sodocu'
    },
    // Información de contacto (actualizar con datos reales)
    contact: {
        email: 'info@sodocu.com', // Actualizar con email real
        phone: '+57-1-XXX-XXXX', // Actualizar con teléfono real
        areaServed: 'CO'
    },
    // Redes sociales (actualizar con URLs reales)
    social: {
        twitter: 'https://twitter.com/sodocu', // Actualizar si existe
        facebook: '', // Agregar si existe
        linkedin: '' // Agregar si existe
    },
    // Información del desarrollador
    developer: {
        name: 'Jirka IT Solutions',
        url: 'https://www.jirka.co',
        description: 'Casa de Desarrollo de Software',
        twitter: 'https://twitter.com/jirka_it' // Actualizar si existe
    }
};

export const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sodocu',
    alternateName: 'Sodocu - Documentos Legales Digitales',
    url: seoConfig.url,
    logo: seoConfig.image,
    image: seoConfig.image,
    description: 'Sodocu es una plataforma especializada en la generación de documentos legales de manera digital, creando plantillas que agilizan los procesos empresariales y los tiempos de trámites legales e inmobiliarios.',
    // foundingDate: 'YYYY-MM-DD', // Agregar fecha de fundación si está disponible
    sameAs: [
        seoConfig.social.twitter,
        seoConfig.social.facebook,
        seoConfig.social.linkedin
    ].filter(Boolean),
    contactPoint: {
        '@type': 'ContactPoint',
        telephone: seoConfig.contact.phone,
        contactType: 'customer service',
        email: seoConfig.contact.email,
        areaServed: seoConfig.contact.areaServed,
        availableLanguage: ['Spanish']
    },
    hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Servicios de Sodocu',
        itemListElement: [
            {
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'Service',
                    name: 'Generación de Documentos Legales Digitales',
                    description: 'Creación de plantillas digitales para documentos legales que agilizan los procesos empresariales y trámites inmobiliarios.',
                    areaServed: {
                        '@type': 'Country',
                        name: 'Colombia'
                    }
                }
            },
            {
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'Service',
                    name: 'Documentos para Constructora',
                    description: 'Plantillas especializadas para documentos legales relacionados con construcción e inmobiliario.',
                    areaServed: {
                        '@type': 'Country',
                        name: 'Colombia'
                    }
                }
            },
            {
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'Service',
                    name: 'Gestión de Escrituras y Contratos',
                    description: 'Herramientas digitales para la creación y gestión de escrituras, contratos y documentos notariales.',
                    areaServed: {
                        '@type': 'Country',
                        name: 'Colombia'
                    }
                }
            },
            {
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'Service',
                    name: 'Reglamentos y Documentación Legal',
                    description: 'Plantillas para reglamentos de propiedad horizontal y documentación legal inmobiliaria.',
                    areaServed: {
                        '@type': 'Country',
                        name: 'Colombia'
                    }
                }
            }
        ]
    }
};

