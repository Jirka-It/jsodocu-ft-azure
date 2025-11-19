import { structuredData } from '../../config/seo';

/**
 * Componente para renderizar Schema.org JSON-LD en el head
 * Este componente NO es client para asegurar que se renderice en el HTML estático
 */
export default function StructuredDataScript() {
    const jsonLd = JSON.stringify(structuredData);

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
    );
}

