import { State } from '@enums/DocumentEnum';
import { Badge } from 'primereact/badge';

import { Tag } from 'primereact/tag';

interface IBasicState {
    state: string;
}

export default function DocumentStates({ state }: IBasicState) {
    switch (state) {
        case State.APPROVED:
            return <Badge value="Aprobado" severity="success"></Badge>;

        case State.EDITION:
            return <Badge value="Edición" severity="warning"></Badge>;

        case State.REVIEW:
            return <Badge value="Revisión" severity="danger"></Badge>;

        case State.ARCHIVED:
            return <Badge value="Archivado" severity="info"></Badge>;

        default:
            return <Badge value="Sin estado"></Badge>;
    }
}
