import React from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

const Footer = () => {
    return (
        <AntFooter style={{
            textAlign: 'center',
            padding: '12px 50px',
            backgroundColor: '#f0f2f5',
            fontSize: '14px',
            color: 'rgba(0, 0, 0, 0.65)'
        }}>
            FinanceTracker ©{new Date().getFullYear()} - Todos los derechos reservados
        </AntFooter>
    );
};

export default Footer;