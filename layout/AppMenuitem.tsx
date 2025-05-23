'use client';
import { useSelector } from 'react-redux';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import { useContext, useEffect, useRef } from 'react';
import { LayoutContext } from './context/layoutcontext';
import { MenuContext } from './context/menucontext';
import { useSubmenuOverlayPosition } from './hooks/useSubmenuOverlayPosition';
import { AppMenuItemProps } from '@customTypes/layout';
import { useSession } from 'next-auth/react';
import { VerifyPermissions } from '@lib/Permissions';
import { Badge } from 'primereact/badge';
import { RootState } from '@store/store';

const AppMenuitem = (props: AppMenuItemProps) => {
    const menu = useSelector((state: RootState) => state.menu);
    const { activeMenu, setActiveMenu } = useContext(MenuContext);
    const { isSlim, isCompact, isHorizontal, isDesktop, setLayoutState, layoutState, layoutConfig } = useContext(LayoutContext);
    const { data: session }: any = useSession(); //data:session
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const submenuRef = useRef(null);
    const menuitemRef = useRef(null);
    const item = props.item;
    const key = props.parentKey ? props.parentKey + '-' + props.index : String(props.index);
    const isActiveRoute = item.to && pathname === item.to;
    const active = activeMenu === key || !!(activeMenu && activeMenu.startsWith(key + '-'));

    useSubmenuOverlayPosition({
        target: menuitemRef.current,
        overlay: submenuRef.current,
        container: menuitemRef.current && menuitemRef.current.closest('.layout-menu-container'),
        when: props.root && active && (isSlim() || isCompact() || isHorizontal()) && isDesktop()
    });

    useEffect(() => {
        if (layoutState.resetMenu) {
            setActiveMenu('');
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                resetMenu: false
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [layoutState]);

    useEffect(() => {
        if (!(isSlim() || isHorizontal() || isCompact()) && isActiveRoute) {
            setActiveMenu(key);
        }
    }, [layoutConfig]);

    useEffect(() => {
        const url = pathname + searchParams.toString();

        const onRouteChange = (url) => {
            if (!(isSlim() || isHorizontal() || isCompact()) && item.to && item.to === url) {
                setActiveMenu(key);
            }
        };
        onRouteChange(url);
    }, [pathname, searchParams]);

    const itemClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        //avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return;
        }

        // navigate with hover
        if (props.root && (isSlim() || isHorizontal() || isCompact())) {
            const isSubmenu = event.currentTarget.closest('.layout-root-menuitem.active-menuitem > ul') !== null;
            if (isSubmenu)
                setLayoutState((prevLayoutState) => ({
                    ...prevLayoutState,
                    menuHoverActive: true
                }));
            else
                setLayoutState((prevLayoutState) => ({
                    ...prevLayoutState,
                    menuHoverActive: !prevLayoutState.menuHoverActive
                }));
        }

        //execute command
        if (item.command) {
            item.command({ originalEvent: event, item: item });
        }

        // toggle active state
        if (item.items) {
            setActiveMenu(active ? props.parentKey : key);

            if (props.root && !active && (isSlim() || isHorizontal() || isCompact())) {
                setLayoutState((prevLayoutState) => ({
                    ...prevLayoutState,
                    overlaySubmenuActive: true
                }));
            }
        } else {
            if (!isDesktop()) {
                setLayoutState((prevLayoutState) => ({
                    ...prevLayoutState,
                    staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive
                }));
            }

            if (isSlim() || isHorizontal() || isCompact()) {
                setLayoutState((prevLayoutState) => ({
                    ...prevLayoutState,
                    menuHoverActive: false
                }));
            }

            setActiveMenu(key);
        }
    };

    const onMouseEnter = () => {
        // activate item on hover
        if (props.root && (isSlim() || isHorizontal() || isCompact()) && isDesktop()) {
            if (!active && layoutState.menuHoverActive) {
                setActiveMenu(key);
            }
        }
    };

    //GENERATE THE CHILDREN OF EACH ITEM - SUB MENUS
    const subMenu =
        item.items && item.visible !== false ? (
            <ul ref={submenuRef}>
                {item.items.map((child, i) => {
                    return VerifyPermissions(session.access_token, child.permission) ? <AppMenuitem item={child} index={i} className={child.badgeClass} parentKey={key} key={child.label} /> : '';
                })}
            </ul>
        ) : null;

    return (
        <li
            ref={menuitemRef}
            className={classNames({
                'layout-root-menuitem': props.root,
                'active-menuitem': active
            })}
        >
            {props.root && item.visible !== false && <div className="layout-menuitem-root-text">{item.label}</div>}
            {(!item.to || item.items) && item.visible !== false ? (
                <>
                    <a
                        href={item.url}
                        onClick={(e) => itemClick(e)}
                        className={classNames(item.class, 'p-ripple tooltip-target')}
                        target={item.target}
                        data-pr-tooltip={item.label}
                        data-pr-disabled={!(isSlim() && props.root && !layoutState.menuHoverActive)}
                        tabIndex={0}
                        onMouseEnter={onMouseEnter}
                    >
                        <i className={classNames('layout-menuitem-icon', item.icon)}></i>
                        <span className="layout-menuitem-text">{item.label}</span>
                        {item.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                        <Ripple />
                    </a>
                </>
            ) : null}

            {item.to && !item.items && item.visible !== false ? (
                <>
                    <Link
                        href={item.to}
                        replace={item.replaceUrl}
                        onClick={(e) => itemClick(e)}
                        className={classNames(item.class, 'p-ripple ', {
                            'flex justify-content-between': item.label === 'En edición' || item.label === 'En revisión',
                            'active-route': isActiveRoute
                        })}
                        tabIndex={0}
                        onMouseEnter={onMouseEnter}
                    >
                        <div>
                            <i className={classNames('layout-menuitem-icon', item.icon)}></i>
                            <span className="layout-menuitem-text">{item.label}</span>
                        </div>

                        {item.label === 'En edición' ? <Badge className="ml-3" value={menu.inEdition}></Badge> : ''}
                        {item.label === 'En revisión' ? <Badge className="ml-3" value={menu.inReview}></Badge> : ''}

                        {item.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                        <Ripple />
                    </Link>
                </>
            ) : null}
            {subMenu}
        </li>
    );
};

export default AppMenuitem;
