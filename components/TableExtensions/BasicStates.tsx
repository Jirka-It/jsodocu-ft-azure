import { State } from '@enums/StateEnum';
import { Badge } from 'primereact/badge';

interface IBasicState {
    state: string;
}

export default function BasicStates({ state }: IBasicState) {
    switch (state) {
        case State.ACTIVE:
            return <Badge value="Activo" severity="success"></Badge>;

        case State.INACTIVE:
            return <Badge value="Inactivo" severity="danger"></Badge>;

        default:
            return <Badge value={state}></Badge>;
    }
}
