'use client';

import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Menu } from 'primereact/menu';
import HomeInformationCard from '@components/Cards/HomeInformationCard';

const ordersChart = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
    datasets: [
        {
            label: 'Promedio',
            data: [2, 7, 20, 9, 16, 9, 5],
            backgroundColor: ['rgba(100, 181, 246, 0.2)'],
            borderColor: ['#64B5F6'],
            borderWidth: 3,
            fill: true,
            tension: 0.2
        }
    ]
};

const ordersChartOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
        legend: {
            display: false
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
                max: 20
            }
        }
    }
};

const Dashboard = () => {
    const items = [
        {
            label: 'Meses',
            items: [
                { label: 'Enero', icon: 'pi pi-calendar' },
                { label: 'Febrero', icon: 'pi pi-calendar' },
                { label: 'Marzo', icon: 'pi pi-calendar' },
                { label: 'Abril', icon: 'pi pi-calendar' },
                { label: 'Mayo', icon: 'pi pi-calendar' },
                { label: 'Junio', icon: 'pi pi-calendar' },
                { label: 'Julio', icon: 'pi pi-calendar' }
            ]
        }
    ];

    const menuRef = useRef(null);
    const chartRef = useRef(null);

    const menuToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
        menuRef.current.toggle(event);
    };

    return (
        <div className="layout-dashboard">
            <div className="grid mb-4">
                <div className="col-12 md:col-6 lg:col-3">
                    <HomeInformationCard title={'Documentos Realizados'} icon="pi pi-file" iconColor="text-blue-500	" color="text-green-500" iconArrow="pi pi-arrow-up-right" />
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <HomeInformationCard title={'Validaciones Pendientes'} icon="pi pi-box" iconColor="text-red-500" color="text-green-500" iconArrow="pi pi-arrow-up-right" />
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <HomeInformationCard title={'Validaciones Solicitadas'} icon="pi pi-chart-line" iconColor="text-green-500" color="text-red-500" iconArrow="pi pi-arrow-down-right" />
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <HomeInformationCard title={'Promedio Uso'} icon="pi pi-clock" iconColor="text-orange-500" color="text-red-500" iconArrow="pi pi-arrow-down-right" />
                </div>
            </div>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <div className="flex w-full justify-content-between align-items-center">
                            <h4>Promedio Uso</h4>
                            <Button severity="secondary" text icon="pi pi-search" label="Mostrar" onClick={menuToggle}></Button>
                        </div>
                        <Menu model={items} popup ref={menuRef} />

                        <div className="grid mt-3">
                            <div className="col-12">
                                <div className="overview-chart">
                                    <Chart ref={chartRef} type="line" data={ordersChart} options={ordersChartOptions} id="order-chart"></Chart>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
