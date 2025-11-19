'use client';

import React, { useEffect, useRef, useState } from 'react';
//import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
//import { Menu } from 'primereact/menu';
import HomeInformationCard from '@components/Cards/HomeInformationCard';
import AvatarInformation from '@components/Cards/AvatarInformationCard';
import { findDashboard } from '@api/users';
import { HttpStatus } from '@enums/HttpStatusEnum';
import { IUserDashboard } from '@interfaces/IUser';
import { findFile } from '@api/file';

const ordersChartOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            callbacks: {
                label: function (context) {
                    let label = context.dataset.label || '';
                    return `${label}: ${context.parsed.y}%`;
                }
            }
        }
    },
    responsive: true,
    hover: {
        mode: 'index'
    },
    scales: {
        y: {
            ticks: {
                min: 0,
                max: 100,
                callback: function (value: number) {
                    return value.toFixed(1) + '%';
                }
            }
        }
    }
};

const Dashboard = () => {
    const [ordersChart, setOrdersChart] = useState(null);
    const [data, setData] = useState<IUserDashboard>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const res = await findDashboard();

            if (res.status === HttpStatus.OK) {
                const labels = res.useLastSixMonths.map((u) => u.month);
                const data = res.useLastSixMonths.map((u) => u.avgPercentageUse);

                setOrdersChart({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Promedio',
                            data: data,
                            backgroundColor: ['rgba(100, 181, 246, 0.2)'],
                            borderColor: ['#64B5F6'],
                            borderWidth: 3,
                            fill: true,
                            tension: 0.2
                        }
                    ]
                });

                console.log('res', res);

                const photo = await findFile({ filePath: res.photo });

                setData({ ...res, photo: URL.createObjectURL(photo) });
                
                // Activar animaciones después de cargar los datos
                setTimeout(() => {
                    setIsLoaded(true);
                }, 100);
            } else {
                // Si hay un error, aún así mostrar el contenido sin animación
                setIsLoaded(true);
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
            // En caso de error, asegurar que el contenido se muestre sin animación
            setIsLoaded(true);
        }
    };

    const chartRef = useRef(null);

    return (
        <div className="layout-dashboard">
            {data ? (
                <div className={`grid ${isLoaded ? 'fadeindown' : ''}`}>
                    <AvatarInformation name={`${data?.name} ${data?.lastName}`} account={data?.account} photo={data?.photo} roles={data?.roles} />
                </div>
            ) : (
                ''
            )}

            {data && (
                <div className="grid mb-4">
                    <div className={`col-12 md:col-6 lg:col-3 ${isLoaded ? 'fadeinleft' : ''}`} style={{ animationDelay: '0.1s' }}>
                        <HomeInformationCard title={'Documentos Realizados'} icon="pi pi-file" value={data?.inEdition} iconColor="text-blue-500	" color="text-green-500" iconArrow="pi pi-arrow-up-right" />
                    </div>
                    <div className={`col-12 md:col-6 lg:col-3 ${isLoaded ? 'fadeinleft' : ''}`} style={{ animationDelay: '0.2s' }}>
                        <HomeInformationCard title={'Validaciones Pendientes'} icon="pi pi-box" value={data?.inReview} iconColor="text-red-500" color="text-green-500" iconArrow="pi pi-arrow-up-right" />
                    </div>

                    <div className={`col-12 md:col-6 lg:col-3 ${isLoaded ? 'fadeinright' : ''}`} style={{ animationDelay: '0.3s' }}>
                        <HomeInformationCard title={'Documentos Aprobados'} icon="pi pi-chart-line" value={data?.approved} iconColor="text-green-500" color="text-green-500" iconArrow="pi pi-arrow-up-right" />
                    </div>

                    <div className={`col-12 md:col-6 lg:col-3 ${isLoaded ? 'fadeinright' : ''}`} style={{ animationDelay: '0.4s' }}>
                        <HomeInformationCard title={'Promedio Uso'} icon="pi pi-clock" value={`${data?.averageUsePercentage || 0}%`} iconColor="text-orange-500" color="text-red-500" iconArrow="pi pi-arrow-down-right" />
                    </div>
                </div>
            )}

            <div className="grid">
                <div className="col-12">
                    <div className={`card ${isLoaded ? 'fadeinup' : ''}`} style={{ animationDelay: '0.5s' }}>
                        {/*
                        <div className="flex w-full justify-content-between align-items-center">
                            <h4>Promedio Uso</h4>
                            <Button severity="secondary" text icon="pi pi-search" label="Mostrar" onClick={menuToggle}></Button>
                        </div>
                        <Menu model={items} popup ref={menuRef} /> */}

                        <div className="grid mt-3">
                            <div className="col-12">
                                <div className="overview-chart">{ordersChart ? <Chart ref={chartRef} type="line" data={ordersChart} options={ordersChartOptions} id="order-chart"></Chart> : ''}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
