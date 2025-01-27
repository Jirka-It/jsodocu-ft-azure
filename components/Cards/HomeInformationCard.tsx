import { Card } from 'primereact/card';
import styles from './HomeInformationCard.module.css';

const HomeInformationCard = ({ title, icon, iconColor, value, color, iconArrow }) => {
    return (
        <Card className={styles['layout-home-card']} title={title}>
            <p className="m-0"></p>
            <div className="flex align-items-center	justify-content-between">
                <span className="mt-4 mb-4 text-4xl font-bold">{value}</span>
                <i className={`${icon} ${iconColor} font-bold`} style={{ fontSize: '4rem' }}></i>
            </div>
        </Card>
    );
};

export default HomeInformationCard;
