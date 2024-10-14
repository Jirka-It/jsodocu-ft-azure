'use client';

import React, { useState, useEffect, useRef, useContext } from 'react';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Menu } from 'primereact/menu';
import { LayoutContext } from '../../layout/context/layoutcontext';

const ordersChart = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'New',
            data: [2, 7, 20, 9, 16, 9, 5],
            backgroundColor: ['rgba(100, 181, 246, 0.2)'],
            borderColor: ['#64B5F6'],
            borderWidth: 3,
            fill: true,
            tension: 0.4
        }
    ]
};

const ordersChartOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
        legend: {
            display: true
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

const teamMembers = [
    {
        name: 'Amy Elsner',
        desc: 'Accounting',
        image: 'amyelsner'
    },
    {
        name: 'Anna Fali',
        desc: 'Procurement',
        image: 'annafali'
    },
    {
        name: 'Bernardo Dominic',
        desc: 'Finance',
        image: 'bernardodominic'
    },
    {
        name: 'Ivan Magalhaes',
        desc: 'Sales',
        image: 'ivanmagalhaes'
    },
    {
        name: 'Xuxue Feng',
        desc: 'Management',
        image: 'xuxuefeng'
    }
];

const Dashboard = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const orderWeek = [
        { name: 'This Week', code: '1' },
        { name: 'Last Week', code: '0' }
    ];

    const [selectedOrderWeek, setSelectedOrderWeek] = useState(orderWeek[0]);
    const [products, setProducts] = useState(null);
    const [revenueChart, setRevenueChart] = useState({});
    const [revenueChartOptions, setRevenueChartOptions] = useState({});

    const items = [
        {
            label: 'Shipments',
            items: [
                { label: 'Tracker', icon: 'pi pi-compass' },
                { label: 'Map', icon: 'pi pi-map-marker' },
                { label: 'Manage', icon: 'pi pi-pencil' }
            ]
        }
    ];

    const initChart = () => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#dee2e6';

        const revenueChart = {
            labels: ['Direct', 'Promoted', 'Affiliate'],
            datasets: [
                {
                    data: [40, 35, 25],
                    backgroundColor: ['#64B5F6', '#7986CB', '#4DB6AC'],
                    borderColor: [surfaceBorder]
                }
            ]
        };

        const revenueChartOptions = {
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: textColor
                    }
                }
            }
        };

        setRevenueChart(revenueChart);
        setRevenueChartOptions(revenueChartOptions);
    };

    useEffect(() => {
        initChart();
    }, [layoutConfig.colorScheme]);

    const menuRef = useRef(null);
    const chartRef = useRef(null);

    const changeDataset = (event: React.MouseEvent<HTMLDivElement>) => {
        const dataSet = [
            [2, 7, 20, 9, 16, 9, 5],
            [2, 4, 9, 20, 16, 12, 20],
            [2, 17, 7, 15, 4, 20, 8],
            [2, 2, 20, 4, 17, 16, 20]
        ];

        ordersChart.datasets[0].data = dataSet[parseInt(event.currentTarget.getAttribute('data-index'))];
        ordersChart.datasets[0].label = event.currentTarget.getAttribute('data-label');
        ordersChart.datasets[0].borderColor = [event.currentTarget.getAttribute('data-stroke')];
        ordersChart.datasets[0].backgroundColor = [event.currentTarget.getAttribute('data-fill')];
    };

    const menuToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
        menuRef.current.toggle(event);
    };

    const refreshDataset = () => {
        chartRef.current.refresh();
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const onOrderTabClick = (event: React.MouseEvent<HTMLDivElement>) => {
        changeDataset(event);
        refreshDataset();
    };

    return (
        <div className="layout-dashboard">
            <div className="grid">
                <div className="col-12 xl:col-6">
                    <div className="card">
                        <div className="flex w-full justify-content-between align-items-center">
                            <h4>Orders</h4>
                            <Button severity="secondary" text icon="pi pi-search" label="Show" onClick={menuToggle}></Button>
                        </div>
                        <Menu model={items} popup ref={menuRef} />

                        <div className="grid mt-3">
                            <div
                                onClick={onOrderTabClick}
                                className="col-6 md:col-3 relative transition-all transition-duration-300 hover:shadow-3 cursor-pointer h-5rem"
                                data-label="New Orders"
                                data-index="0"
                                data-fill="rgba(100, 181, 246, 0.2)"
                                data-stroke="#BBDEFB"
                            >
                                <span className="flex align-items-center">
                                    <i className="pi pi-plus-circle mr-1"></i> New
                                </span>
                                <img src={`/demo/images/dashboard/graph-new.svg`} className="absolute w-11" style={{ left: '5%', bottom: 0 }} alt="order.image" />
                            </div>
                            <div
                                onClick={onOrderTabClick}
                                className="col-6 md:col-3 relative transition-all transition-duration-300 hover:shadow-3 cursor-pointer h-5rem"
                                data-label="Completed Orders"
                                data-index="1"
                                data-stroke="#C5CAE9"
                                data-fill="rgba(121, 134, 203, 0.2)"
                            >
                                <span className="flex align-items-center">
                                    <i className="pi pi-check-circle mr-1"></i> Completed
                                </span>
                                <img src={`/demo/images/dashboard/graph-completed.svg`} className="absolute w-11" style={{ left: '5%', bottom: 0 }} alt="New Graph" />
                            </div>
                            <div
                                onClick={onOrderTabClick}
                                className="col-6 md:col-3 relative transition-all transition-duration-300 hover:shadow-3 cursor-pointer h-5rem"
                                data-label="Refunded Orders"
                                data-index="2"
                                data-stroke="#B2DFDB"
                                data-fill="rgba(224, 242, 241, 0.5)"
                            >
                                <span className="flex align-items-center">
                                    <i className="pi pi-refresh mr-1"></i> Refunded
                                </span>
                                <img src={`/demo/images/dashboard/graph-refunded.svg`} className="absolute w-11" style={{ left: '5%', bottom: 0 }} alt="Refunded Graph" />
                            </div>
                            <div
                                onClick={onOrderTabClick}
                                className="col-6 md:col-3 relative transition-all transition-duration-300 hover:shadow-3 cursor-pointer h-5rem"
                                data-label="Cancelled Orders"
                                data-index="3"
                                data-stroke="#B2EBF2"
                                data-fill="rgba(224, 247, 250, 0.5)"
                            >
                                <span className="flex align-items-center">
                                    <i className="pi pi-times-circle mr-1"></i> Cancelled
                                </span>
                                <img src={`/demo/images/dashboard/graph-cancelled.svg`} className="absolute w-11" style={{ left: '5%', bottom: 0 }} alt="Cancel Graph" />
                            </div>

                            <div className="col-12">
                                <div className="overview-chart">
                                    <Chart ref={chartRef} type="line" data={ordersChart} options={ordersChartOptions} id="order-chart"></Chart>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 lg:col-6">
                    <div className="card">
                        <h4>Tasks</h4>
                        <p>Overview of your pending tasks.</p>
                        <div className="mt-4">
                            <span className="block mb-2">
                                <span className="font-semibold">12 Orders</span> to fulfill
                            </span>
                            <div className="w-full border-round" style={{ height: '7px', backgroundColor: 'var(--surface-d)' }}>
                                <div className="w-7 h-full border-round" style={{ backgroundColor: '#64B5F6' }}></div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="block mb-2">
                                <span className="font-semibold">40+ Payments</span> to withdraw
                            </span>
                            <div className="w-full border-round" style={{ height: '7px', backgroundColor: 'var(--surface-d)' }}>
                                <div className="w-5 h-full border-round" style={{ backgroundColor: '#A5D6A7' }}></div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="block mb-2">
                                <span className="font-semibold">4 Reports</span> to revise
                            </span>
                            <div className="w-full border-round" style={{ height: '7px', backgroundColor: 'var(--surface-d)' }}>
                                <div className="w-8 h-full border-round" style={{ backgroundColor: '#7986CB' }}></div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="block mb-2">
                                <span className="font-semibold">6 Questions</span> to respond
                            </span>
                            <div className="w-full border-round" style={{ height: '7px', backgroundColor: 'var(--surface-d)' }}>
                                <div className="w-4 h-full border-round" style={{ backgroundColor: '#9575CD' }}></div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="block mb-2">
                                <span className="font-semibold">2 Chargebacks</span> to review
                            </span>
                            <div className="w-full border-round" style={{ height: '7px', backgroundColor: 'var(--surface-d)' }}>
                                <div className="w-6 h-full border-round" style={{ backgroundColor: '#4DB6AC' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h4>Best Sellers</h4>
                        <p>Most popular products from your collection.</p>

                        <ul className="list-none p-0 m-0">
                            <li className="p-3 surface-border border-bottom-1 flex justify-content-between align-items-center">
                                <span className="font-bold">Product</span>
                                <span className="font-bold">Sales</span>
                            </li>
                            {products &&
                                products.slice(0, 7).map((product, i) => (
                                    <li key={i} className={`p-3 surface-border ${i !== 6 ? 'border-bottom-1' : ''}`}>
                                        <div className="flex justify-content-between align-items-center">
                                            <div className="flex gap-3 align-items-center">
                                                <img src={`/demo/images/product/${product.image}`} className="w-5rem h-3rem shadow-5" alt={product.name} />
                                                <span>{product.name}</span>
                                            </div>
                                            <span className="font-semibold">{product.price}</span>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>

                <div className="col-12 lg:col-12">
                    <div className="card">
                        <h4>Revenue stream</h4>
                        <p>Comparison of your revenue sources.</p>
                        <div className="flex justify-content-center align-items-center">
                            <Chart type="pie" data={revenueChart} options={revenueChartOptions} style={{ width: '50%' }} />
                        </div>
                    </div>

                    <div className="card">
                        <h4>Team Members</h4>
                        <ul className="list-none p-0 m-0">
                            {teamMembers.map((member, i) => (
                                <li key={i} className={`p-3 surface-border ${i !== 4 ? 'border-bottom-1' : ''}`}>
                                    <div className="flex justify-content-between align-items-center">
                                        <div className="flex gap-2 align-items-center">
                                            <img src={`/demo/images/avatar/${member.image}.png`} className="w-4rem h-4rem border-circle" alt={member.name} />
                                            <div>
                                                <span className="block text-xl font-bold">{member.name}</span>
                                                <span className="block">{member.desc}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button rounded severity="success" icon="pi pi-envelope"></Button>
                                            <Button rounded severity="warning" icon="pi pi-cog"></Button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
