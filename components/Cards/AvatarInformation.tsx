import styles from './AvatarInformation.module.css';

const AvatarInformation = () => {
    return (
        <section className="sm:flex align-items-center ml-2 mb-4">
            <div className="flex justify-content-center">
                <img src="/demo/images/avatar/profile.jpg" className={styles.img} alt="User image" />
            </div>
            <div className={styles.information}>
                <h2 className="m-0 font-bold text-blue-500">Constructora COBA</h2>
                <p className="mb-3 font-bold">Julio Martinez</p>
                <p className="m-0 font-bold">Administrador</p>
                <p className="m-0">2 usuarios Registrados</p>
                <p className="m-0 font-bold text-blue-500">Versión Premium</p>
                <p className="m-0">Cuenta Activa</p>
            </div>
        </section>
    );
};
export default AvatarInformation;
