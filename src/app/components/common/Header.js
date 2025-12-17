// components/common/Header.js
'use client';

import React from 'react';
import { Layout, Button, Space, Avatar, Dropdown } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    MoonOutlined,
    SunOutlined
} from '@ant-design/icons';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useRouter } from 'next/navigation';

const { Header: AntHeader } = Layout;

const Header = ({ collapsed, toggleCollapsed }) => {
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const isDarkMode = theme === 'dark';

    // User menu items
    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Perfil',
            onClick: () => router.push('/profile')
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Configuración',
            onClick: () => router.push('/settings')
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Cerrar Sesión',
            onClick: () => {
                // Add logout logic here
                console.log('Logout clicked');
                // router.push('/login');
            }
        },
    ];

    return (
        <AntHeader
            style={{
                padding: '0 24px',
                background: isDarkMode ? '#001529' : '#fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 64,
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}
        >
            {/* Left side - Menu toggle */}
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={toggleCollapsed}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />

            {/* Right side - Theme toggle and user menu */}
            <Space size="middle">
                {/* Theme toggle button */}
                <Button
                    type="text"
                    icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                    onClick={toggleTheme}
                    style={{
                        fontSize: '16px',
                        width: 40,
                        height: 40,
                    }}
                />

                {/* User dropdown */}
                <Dropdown
                    menu={{ items: userMenuItems }}
                    placement="bottomRight"
                    trigger={['click']}
                >
                    <Space 
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => e.preventDefault()}
                    >
                        <Avatar 
                            size="default" 
                            icon={<UserOutlined />}
                            style={{
                                backgroundColor: isDarkMode ? '#1890ff' : '#001529',
                            }}
                        />
                        <span style={{ 
                            color: isDarkMode ? '#fff' : '#000',
                            fontSize: '14px'
                        }}>
                            Usuario
                        </span>
                    </Space>
                </Dropdown>
            </Space>
        </AntHeader>
    );
};

export default Header;