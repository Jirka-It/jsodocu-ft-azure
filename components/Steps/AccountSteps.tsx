import { useCallback, useState } from 'react';
import { Card } from 'primereact/card';
import { Steps } from 'primereact/steps';

export default function AccountSteps() {
    const [activeIndex, setActiveIndex] = useState(0);
    const items = [{ label: 'Info Complementaria' }, { label: 'Usuarios' }, { label: 'Info Pago y Facturación' }];

    const renderContent = useCallback(() => {
        switch (activeIndex) {
            case 0:
                return <p className="connecting">Connecting...</p>;

            case 1:
                return <p className="success">Connected Successfully!</p>;

            case 2:
                return <p className="success">Connected Successfully 2!</p>;

            default:
                return null;
        }
    }, [activeIndex]);

    return (
        <Card>
            <Steps model={items} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false} />
            {renderContent()}
        </Card>
    );
}
