"use client"


import React, { useState } from 'react';
import { 
    Table, 
    Form, 
    Input, 
    InputNumber, 
    Button, 
    Typography, 
    Modal, 
    message, 
    Card, 
    Space, 
    Statistic,
    Row,
    Col,
    Tag,
    Empty,
    Select,
} from 'antd';
import { 
    PlusOutlined, 
    EditOutlined, 
    DeleteOutlined, 
    BankOutlined,
    DollarOutlined,
    ExclamationCircleOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { confirm } = Modal;

const Accounts = () => {
    const [accounts, setAccounts] = useState([
        { id: 1, name: 'Cuenta Corriente', balance: 1200, type: 'corriente' },
        { id: 2, name: 'Ahorros', balance: 5000, type: 'ahorros' },
    ]);
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [editForm] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleAddAccount = async (values) => {
        setLoading(true);
        try {
            // Simular una pequeña demora para mostrar el loading
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const newAccount = {
                id: Date.now(),
                name: values.name,
                balance: parseFloat(values.balance) || 0,
                type: values.type || 'corriente',
            };
            
            setAccounts(prev => [...prev, newAccount]);
            form.resetFields();
            message.success('Cuenta agregada exitosamente');
        } catch (error) {
            message.error('Error al agregar la cuenta');
        } finally {
            setLoading(false);
        }
    };

    const showEditModal = (record) => {
        setEditingAccount(record);
        editForm.setFieldsValue({
            name: record.name,
            balance: record.balance,
            type: record.type,
        });
        setIsModalVisible(true);
    };

    const handleEditOk = async () => {
        try {
            const values = await editForm.validateFields();
            setAccounts(prev =>
                prev.map(acc =>
                    acc.id === editingAccount.id
                        ? { 
                            ...acc, 
                            name: values.name, 
                            balance: parseFloat(values.balance) || 0,
                            type: values.type || 'corriente'
                        }
                        : acc
                )
            );
            setIsModalVisible(false);
            setEditingAccount(null);
            message.success('Cuenta actualizada exitosamente');
        } catch (error) {
            console.log('Validation failed:', error);
        }
    };

    const handleEditCancel = () => {
        setIsModalVisible(false);
        setEditingAccount(null);
        editForm.resetFields();
    };

    const handleDelete = (id) => {
        setAccounts(prev => prev.filter(acc => acc.id !== id));
        message.success('Cuenta eliminada exitosamente');
    };

    const showDeleteConfirm = (record) => {
        confirm({
            title: '¿Está seguro que desea eliminar esta cuenta?',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>Cuenta: <strong>{record.name}</strong></p>
                    <p>Saldo: <strong>${record.balance.toLocaleString()}</strong></p>
                    <p style={{ color: '#ff4d4f', fontSize: '12px' }}>
                        Esta acción no se puede deshacer.
                    </p>
                </div>
            ),
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: () => handleDelete(record.id),
            centered: true,
        });
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'ahorros': return 'green';
            case 'corriente': return 'blue';
            case 'credito': return 'orange';
            default: return 'default';
        }
    };

    const getTypeText = (type) => {
        switch (type) {
            case 'ahorros': return 'Ahorros';
            case 'corriente': return 'Corriente';
            case 'credito': return 'Crédito';
            default: return 'Otra';
        }
    };

    const columns = [
        {
            title: 'Cuenta',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space>
                    <BankOutlined style={{ color: '#1890ff' }} />
                    <div>
                        <div style={{ fontWeight: 500 }}>{text}</div>
                        <Tag color={getTypeColor(record.type)} size="small">
                            {getTypeText(record.type)}
                        </Tag>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Saldo',
            dataIndex: 'balance',
            key: 'balance',
            align: 'right',
            render: (balance) => (
                <Text 
                    strong 
                    style={{ 
                        color: balance >= 0 ? '#52c41a' : '#ff4d4f',
                        fontSize: '16px' 
                    }}
                >
                    ${balance.toLocaleString()}
                </Text>
            ),
        },
        {
            title: 'Acciones',
            key: 'actions',
            align: 'center',
            width: 180,
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(record)}
                        size="small"
                    >
                        Editar
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => showDeleteConfirm(record)}
                        size="small"
                    >
                        Eliminar
                    </Button>
                </Space>
            ),
        },
    ];

    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    const accountsCount = accounts.length;

    return (
        <div className="accounts-page-container" style={{ padding: '24px' }}>
            <Title level={2} style={{ marginBottom: '24px' }}>
                <BankOutlined style={{ marginRight: '8px' }} />
                Cuentas Bancarias
            </Title>

            {/* Estadísticas */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        <Statistic
                            title="Total de Cuentas"
                            value={accountsCount}
                            prefix={<BankOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        <Statistic
                            title="Saldo Total"
                            value={totalBalance}
                            prefix={<DollarOutlined />}
                            precision={2}
                            valueStyle={{ color: totalBalance >= 0 ? '#52c41a' : '#ff4d4f' }}
                            formatter={(value) => `$${value.toLocaleString()}`}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        <Statistic
                            title="Promedio por Cuenta"
                            value={accountsCount > 0 ? totalBalance / accountsCount : 0}
                            prefix={<DollarOutlined />}
                            precision={2}
                            valueStyle={{ color: '#722ed1' }}
                            formatter={(value) => `$${value.toLocaleString()}`}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Formulario para agregar cuenta */}
            <Card title="Agregar Nueva Cuenta" style={{ marginBottom: '24px' }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddAccount}
                >
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Nombre de la Cuenta"
                                name="name"
                                rules={[
                                    { required: true, message: 'Por favor ingrese el nombre de la cuenta' },
                                    { min: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                                ]}
                            >
                                <Input placeholder="Ej: Mi cuenta de ahorros" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={6}>
                            <Form.Item
                                label="Tipo de Cuenta"
                                name="type"
                                initialValue="corriente"
                            >
                                <Select placeholder="Seleccionar tipo">
                                    <Select.Option value="corriente">Corriente</Select.Option>
                                    <Select.Option value="ahorros">Ahorros</Select.Option>
                                    <Select.Option value="credito">Crédito</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={6}>
                            <Form.Item
                                label="Saldo Inicial"
                                name="balance"
                                rules={[
                                    { required: true, message: 'Por favor ingrese el saldo' },
                                    { type: 'number', message: 'Debe ser un número válido' },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="0.00"
                                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit"
                            icon={<PlusOutlined />}
                            loading={loading}
                            size="large"
                        >
                            Agregar Cuenta
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {/* Tabla de cuentas */}
            <Card title="Mis Cuentas">
                {accounts.length > 0 ? (
                    <div className="table-responsive">
                        <Table
                            dataSource={accounts}
                            columns={columns}
                            rowKey="id"
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: false,
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} de ${total} cuentas`,
                            }}
                            className="accounts-table"
                        />
                    </div>
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No tienes cuentas registradas"
                    >
                        <Button type="primary" icon={<PlusOutlined />}>
                            Agregar tu primera cuenta
                        </Button>
                    </Empty>
                )}
            </Card>

            {/* Modal de edición */}
            <Modal
                title={
                    <Space>
                        <EditOutlined />
                        Editar Cuenta
                    </Space>
                }
                open={isModalVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
                okText="Guardar Cambios"
                cancelText="Cancelar"
                width={500}
            >
                <Form form={editForm} layout="vertical">
                    <Form.Item
                        label="Nombre de la Cuenta"
                        name="name"
                        rules={[
                            { required: true, message: 'Por favor ingrese el nombre de la cuenta' },
                            { min: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                        ]}
                    >
                        <Input placeholder="Nombre de la cuenta" />
                    </Form.Item>
                    <Form.Item
                        label="Tipo de Cuenta"
                        name="type"
                    >
                        <Select placeholder="Seleccionar tipo">
                            <Select.Option value="corriente">Corriente</Select.Option>
                            <Select.Option value="ahorros">Ahorros</Select.Option>
                            <Select.Option value="credito">Crédito</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Saldo"
                        name="balance"
                        rules={[
                            { required: true, message: 'Por favor ingrese el saldo' },
                            { type: 'number', message: 'Debe ser un número válido' },
                        ]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="0.00"
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Accounts;