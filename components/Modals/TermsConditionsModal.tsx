import React from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { IModal } from '@interfaces/IModal';

export default function TermsConditionsModal({ state, setState }: IModal) {
    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <i className="pi pi-cog"></i>
            <span className="font-bold white-space-nowrap">Políticas de privacidad</span>
        </div>
    );

    const footerContent = (
        <div className="text-center">
            <Button label="Cancelar" onClick={() => setState(!state)} severity="danger" />
            <Button label="Aceptar" onClick={() => setState(true)} autoFocus />
        </div>
    );

    return (
        <Dialog
            visible={state}
            modal
            header={headerElement}
            footer={footerContent}
            closable={false}
            style={{ width: '50rem' }}
            onHide={() => {
                if (!state) return;
                setState(false);
            }}
        >
            <div className="m-0">
                <h6 className="mb-0">1. Introducción</h6>
                <div>
                    SODOCU se compromete a proteger la privacidad y la seguridad de los datos personales de sus usuarios. Esta política de privacidad describe cómo recogemos, utilizamos, almacenamos y protegemos la información personal que nos
                    proporcionas a través de nuestra plataforma web.
                </div>
                <h6 className="mb-0"> 2. Recopilación de Información</h6>
                <div>
                    Recogemos información personal cuando:
                    <ul>
                        <li>Te registras en nuestra plataforma.</li>
                        <li>Utilizas nuestros servicios para digitalizar y gestionar documentos.</li>
                        <li>Nos contactas para solicitar soporte o asistencia.</li>
                    </ul>
                    La información que recopilamos incluye, pero no se limita a:
                    <ul>
                        <li>Datos de contacto (nombre, dirección de correo electrónico, número de teléfono).</li>
                        <li>Información de documentos legales y notariales.</li>
                        <li>Información de pago y facturación.</li>
                    </ul>
                </div>

                <h6 className="mb-0">3. Uso de la Información</h6>

                <div>
                    Utilizamos la información recopilada para:
                    <ul>
                        <li>Proveer y mejorar nuestros servicios de digitalización y gestión de documentos.</li>
                        <li>Facilitar el acceso a tus documentos y su gestión eficiente.</li>
                        <li>Comunicarte actualizaciones, noticias y promociones relacionadas con nuestros servicios. </li>
                        <li>Procesar pagos y gestionar la facturación. </li>
                    </ul>
                </div>

                <h6 className="mb-0">4. Compartición de Información</h6>

                <div>
                    No compartimos tu información personal con terceros, excepto en los siguientes casos:
                    <ul>
                        <li>Con tu consentimiento explícito.</li>
                        <li>Para cumplir con obligaciones legales y regulaciones vigentes.</li>
                        <li>Para proteger los derechos y la seguridad de SODOCU y sus usuarios.</li>
                    </ul>
                </div>

                <h6 className="mb-0">5. Seguridad de la Información</h6>

                <div>Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra el acceso no autorizado, la alteración, divulgación o destrucción.</div>

                <h6 className="mb-0">6. Retención de Datos</h6>

                <div>Retenemos tu información personal únicamente durante el tiempo necesario para cumplir con los propósitos descritos en esta política, a menos que se requiera o permita por ley un período de retención más largo.</div>

                <h6 className="mb-0">7. Derechos de los Usuarios</h6>

                <div>
                    Tienes derecho a:
                    <ul>
                        <li>Acceder a tus datos personales. </li>
                        <li>Rectificar datos inexactos o incompletos.</li>
                        <li>Solicitar la eliminación de tus datos personales.</li>
                        <li>Oponerte al tratamiento de tus datos personales en determinadas circunstancias.</li>
                    </ul>
                </div>

                <h6 className="mb-0">8. Contacto</h6>

                <div>
                    Si tienes alguna pregunta o inquietud sobre nuestras políticas de privacidad y tratamiento de datos, puedes contactarnos a través de:
                    <ul>
                        <li>
                            <strong>Correo Electrónico:</strong> SODOCUmental@gmail.com
                        </li>
                        <li>
                            <strong>Whatsapp:</strong> +57 3144407291
                        </li>
                    </ul>
                </div>
            </div>
        </Dialog>
    );
}
