import BasicStates from '@components/TableExtensions/BasicStates';
import styles from './AvatarInformation.module.css';
import { State } from '@enums/StateEnum';

const AvatarInformation = ({ name, account, photo, roles }) => {
    return (
        <section className="sm:flex align-items-center ml-2 mb-4">
            <div className="flex justify-content-center">{photo ? <img src={photo} className={styles.img} alt="User image" /> : <img src="/demo/images/avatar/profile.jpg" className={styles.img} alt="User image" />}</div>
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
