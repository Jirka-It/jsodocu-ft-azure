import { useCallback, useState } from 'react';
import { Card } from 'primereact/card';
import { Steps } from 'primereact/steps';
import StepInfo from './AccountItems/info/page';
import StepUsers from './AccountItems/users/page';
import StepPayment from './AccountItems/payment/page';

export default function AccountSteps() {
    const [activeIndex, setActiveIndex] = useState(0);
    const items = [{ label: 'Información' }, { label: 'Usuarios' }, { label: 'Facturación' }];

    const renderContent = useCallback(() => {
        switch (activeIndex) {
            case 0:
                return <StepInfo />;

            case 1:
                return <StepUsers />;

            case 2:
                return <StepPayment />;

            default:
                return null;
        }
    }, [activeIndex]);

    return <StepUsers />;
}
