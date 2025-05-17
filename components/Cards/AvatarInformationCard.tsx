import { env } from '@config/env';
import BasicStates from '@components/TableExtensions/BasicStates';
import styles from './AvatarInformation.module.css';
import { State } from '@enums/StateEnum';

const AvatarInformation = ({ name, account, photo, roles }) => {
    return (
        <section className="sm:flex align-items-center sm:ml-7 mb-4">
            <div className="flex justify-content-center">{photo ? <img src={`${photo}`} className={styles.img} alt="User image" width={150} height={150} /> : <i className="pi pi-user" style={{ fontSize: '6rem' }}></i>}</div>
            <div className={styles.information}>
                <h2 className="m-0 font-bold text-blue-500">{account}</h2>
                <p className="mb-3 font-bold">{name}</p>
                <p className="m-0 font-bold">{roles}</p>
                <BasicStates state={State.ACTIVE} />
            </div>
        </section>
    );
};
export default AvatarInformation;
