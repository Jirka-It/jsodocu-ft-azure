'use client';
import { useDispatch } from 'react-redux';

import { Tooltip } from 'primereact/tooltip';
import { useContext, useEffect, useRef } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { Breadcrumb, BreadcrumbItem, MenuModal, MenuProps } from '@customTypes/layout';
import { VerifyPermissions } from '@lib/Permissions';
import { useSession } from 'next-auth/react';
import { setInReview, setInEdition } from '@store/slices/menuSlices';
import { findCount } from '@api/documents';
import { HttpStatus } from '@enums/HttpStatusEnum';

const AppSubMenu = (props: MenuProps) => {
    const dispatch = useDispatch();
    const { layoutState, setBreadcrumbs } = useContext(LayoutContext);
    const tooltipRef = useRef<Tooltip | null>(null);
    const { data: session }: any = useSession(); //data:session

    useEffect(() => {
        if (tooltipRef.current) {
            tooltipRef.current.hide();
            (tooltipRef.current as any).updateTargetEvents();
        }
    }, [layoutState.overlaySubmenuActive]);

    useEffect(() => {
        getData();
        generateBreadcrumbs(props.model);
    }, []);

    const getData = async () => {
        const res = await findCount();

        if (res.status === HttpStatus.OK) {
            dispatch(setInReview(res.inReview));
            dispatch(setInEdition(res.inEdition));
        }
    };

    const generateBreadcrumbs = (model: MenuModal[]) => {
        let breadcrumbs: Breadcrumb[] = [];

        const getBreadcrumb = (item: BreadcrumbItem, labels: string[] = []) => {
            const { label, to, items } = item;

            label && labels.push(label);
            items &&
                items.forEach((_item) => {
                    getBreadcrumb(_item, labels.slice());
                });
            to && breadcrumbs.push({ labels, to });
        };

        model.forEach((item) => {
            getBreadcrumb(item);
        });

        setBreadcrumbs(breadcrumbs);
    };
    return (
        <MenuProvider>
            <ul className="layout-menu">
                {props.model.map((item, i) => {
                    return !item.separator && VerifyPermissions(session.access_token, item.permission) ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : '';
                })}
            </ul>
            <Tooltip ref={tooltipRef} target="li:not(.active-menuitem)>.tooltip-target" />
        </MenuProvider>
    );
};

export default AppSubMenu;
