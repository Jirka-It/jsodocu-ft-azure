import { Card } from 'primereact/card';
import styles from './HomeInformationCard.module.css';

const HomeInformationCard = ({ title, icon, iconColor, color, iconArrow }) => {
    return (
        <Card className={styles['layout-home-card']} title={title}>
            <p className="m-0"></p>
            <div className="flex align-items-center	justify-content-between">
                <span className="mt-4 mb-4 text-4xl font-bold">154</span>
                <i className={`${icon} ${iconColor} font-bold`} style={{ fontSize: '4rem' }}></i>
            </div>
            <p>
                <span className={`${color} font-bold`}>
                    <i className={iconArrow}></i> 8.5%
                </span>{' '}
                Desde el mes pasado
            </p>
        </Card>
    );
};

export default HomeInformationCard;
