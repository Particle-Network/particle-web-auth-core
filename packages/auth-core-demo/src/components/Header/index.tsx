import logo from '@/assets/images/logo.png';
import { openWindow } from '@/utils/index';
import { BarsOutlined, GithubOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Popover } from 'antd';
import { useRouter } from 'next/router';
import styles from './index.module.scss';

interface Props {
    pathName?: string;
}
const Header = (props: Props) => {
    const { pathName = 'Home' } = props;
    const router = useRouter();

    const menus: MenuProps['items'] = [
        {
            label: <span>Home</span>,
            key: 'Home',
            onClick: () => {
                if (router.pathname === '/') {
                    router.reload();
                } else {
                    router.push('/');
                }
            },
        },
        {
            label: <span>Customize</span>,
            key: 'Customize',
            onClick: () => {
                if (router.pathname.includes('/customize')) {
                    router.reload();
                } else {
                    router.push('/customize.html');
                }
            },
        },
        {
            label: <span>ConnectKit</span>,
            key: 'ConnectKit',
            onClick: () => {
                if (router.pathname.includes('/connect')) {
                    router.reload();
                } else {
                    router.push('/connect.html');
                }
            },
        },
    ];

    return (
        <div className={styles.container}>
            <header className="app-header">
                <img src={logo.src} className="app-logo" alt="logo" />
                <h1>Auth Core</h1>
                <div className="menus">
                    <Menu className="menu" selectedKeys={[pathName]} mode="horizontal" items={menus} />
                </div>
                <div className="menus-mobile">
                    <Popover
                        content={
                            <div className="menus-mobile-down">
                                {menus.map((menu: any) => {
                                    return (
                                        <p key={menu.key} onClick={menu.onClick}>
                                            {menu.label}
                                        </p>
                                    );
                                })}
                            </div>
                        }
                        trigger="click"
                        placement="bottomLeft"
                    >
                        <BarsOutlined />
                    </Popover>
                    <div className="particle-title">Particle Demo</div>
                </div>
                <div className="connect-box">
                    <div className="header-info">
                        <div className="link-target">
                            <GithubOutlined
                                className="github"
                                size={24}
                                onClick={() => openWindow('https://github.com/Particle-Network/particle-web-auth-core')}
                            />
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Header;
