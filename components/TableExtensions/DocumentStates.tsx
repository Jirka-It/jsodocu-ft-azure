import { State } from '@enums/DocumentEnum';
import { Tag } from 'primereact/tag';
import styles from './BasicStates.module.css';

interface IBasicState {
    state: string;
}

export default function DocumentStates({ state }: IBasicState) {
    switch (state) {
        case State.APPROVED:
            return <Tag className={styles['tag-state']} value="Aprobado" severity="success"></Tag>;

        case State.EDITION:
            return <Tag className={styles['tag-state']} value="Edición" severity="warning"></Tag>;

        case State.REVISION:
            return <Tag className={styles['tag-state']} value="Revisión" severity="danger"></Tag>;

        case State.ARCHIVED:
            return <Tag className={styles['tag-state']} value="Archivado" severity="info"></Tag>;

        default:
            return <Tag className={styles['tag-state']} value="Sin estado"></Tag>;
    }
}
