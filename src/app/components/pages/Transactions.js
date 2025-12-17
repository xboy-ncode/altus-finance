"use client"


import React, { useState, useEffect } from 'react';
import {
    Typography,
    Table,
    Input,
    Select,
    DatePicker,
    Button,
    Space,
    Tag,
    Drawer,
    Descriptions,
    Spin,
    Alert,
    Card,
    Divider,
    Row,
    Col,
    Modal
} from 'antd';
import {
    SearchOutlined,
    DollarOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { mockTransactionsData } from '../utils/mockData';
import dayjs from 'dayjs';
import AddTransactionForm from '../transactions/AddTransactionForm';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const TransactionsPage = () => {
    // State variables
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [dateRange, setDateRange] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    // Add missing state for form visibility
    const [showAddForm, setShowAddForm] = useState(false);

    // Categories and types for filters
    const categories = ['Alimentación', 'Transporte', 'Entretenimiento', 'Servicios', 'Compras', 'Salud', 'Educación', 'Vivienda', 'Otros'];
    const types = ['Ingreso', 'Gasto', 'Transferencia'];

    useEffect(() => {
        // Simulate API call to fetch transactions
        const fetchTransactions = async () => {
            try {
                setIsLoading(true);
                // Here would be the actual API call
                // const response = await api.getTransactions();
                // setTransactions(response.data);

                // Using mock data for now
                setTimeout(() => {
                    setTransactions(mockTransactionsData);
                    setIsLoading(false);
                }, 800);
            } catch (err) {
                setError('Error al cargar las transacciones');
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    // Handle transaction click to view details
    const handleViewTransaction = (transaction) => {
        setSelectedTransaction(transaction);
        setDrawerVisible(true);
    };

    // Handle transaction deletion
    const showDeleteConfirm = (transaction) => {
        setTransactionToDelete(transaction);
        setDeleteModalVisible(true);
    };

    const handleDeleteTransaction = () => {
        // Here you would call API to delete the transaction
        // api.deleteTransaction(transactionToDelete.id)

        // For demo, just filter it out
        setTransactions(transactions.filter(t => t.id !== transactionToDelete.id));
        setDeleteModalVisible(false);
        setTransactionToDelete(null);
    };

    // Add function to handle adding a new transaction
    const handleAddTransaction = (newTransaction) => {
        setTransactions([newTransaction, ...transactions]);
    };

    // Filter transactions based on search and filters
    const filteredTransactions = transactions.filter(transaction => {
        // Text search
        const searchMatch =
            searchText === '' ||
            transaction.description.toLowerCase().includes(searchText.toLowerCase()) ||
            transaction.merchant?.toLowerCase().includes(searchText.toLowerCase()) ||
            transaction.amount.toString().includes(searchText);

        // Category filter
        const categoryMatch = categoryFilter === 'all' || transaction.category === categoryFilter;

        // Type filter
        const typeMatch = typeFilter === 'all' || transaction.type === typeFilter;

        // Date range filter
        let dateMatch = true;
        if (dateRange) {
            const transactionDate = dayjs(transaction.date);
            dateMatch = transactionDate.isAfter(dateRange[0]) && transactionDate.isBefore(dateRange[1]);
        }

        return searchMatch && categoryMatch && typeMatch && dateMatch;
    });

    // Table columns
    const columns = [
        {
            title: 'Fecha',
            dataIndex: 'date',
            key: 'date',
            render: (text) => dayjs(text).format('DD/MM/YYYY'),
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
        },
        {
            title: 'Descripción',
            dataIndex: 'description',
            key: 'description',
            render: (text, record) => (
                <div>
                    <Text strong>{text}</Text>
                    {record.merchant && <div><Text type="secondary">{record.merchant}</Text></div>}
                </div>
            ),
        },
        {
            title: 'Categoría',
            dataIndex: 'category',
            key: 'category',
            render: (text) => {
                let color;
                switch (text) {
                    case 'Alimentación': color = 'green'; break;
                    case 'Transporte': color = 'blue'; break;
                    case 'Entretenimiento': color = 'purple'; break;
                    case 'Servicios': color = 'orange'; break;
                    case 'Compras': color = 'cyan'; break;
                    case 'Salud': color = 'pink'; break;
                    case 'Educación': color = 'yellow'; break;
                    case 'Vivienda': color = 'volcano'; break;
                    default: color = 'default';
                }
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Tipo',
            dataIndex: 'type',
            key: 'type',
            render: (text) => {
                const color = text === 'Ingreso' ? 'success' : text === 'Gasto' ? 'error' : 'processing';
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Monto',
            dataIndex: 'amount',
            key: 'amount',
            render: (text, record) => {
                const color = record.type === 'Ingreso' ? 'success' : record.type === 'Gasto' ? 'danger' : '';
                const sign = record.type === 'Ingreso' ? '+' : record.type === 'Gasto' ? '-' : '';
                return <Text type={color}>{sign}${Math.abs(text).toFixed(2)}</Text>;
            },
            sorter: (a, b) => a.amount - b.amount,
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => console.log('Edit transaction', record.id)}
                    />
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => showDeleteConfirm(record)}
                    />
                </Space>
            ),
        },
    ];

    // Handle search and filter changes
    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    const handleCategoryChange = (value) => {
        setCategoryFilter(value);
    };

    const handleTypeChange = (value) => {
        setTypeFilter(value);
    };

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
    };

    const handleExportExcel = () => {
        // Implement Excel export functionality
        console.log('Export to Excel');
    };

    const handleExportPDF = () => {
        // Implement PDF export functionality
        console.log('Export to PDF');
    };

    if (isLoading) {
        return (
            <div className="transactions-loading">
                <Spin size="large" tip="Cargando transacciones..." />
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                className="transactions-error"
            />
        );
    }
    
    // Función para abrir el formulario
    const openAddForm = () => {
        setShowAddForm(true);
    };

    // Función para cerrar el formulario
    const closeAddForm = () => {
        setShowAddForm(false);
    };

    return (
        <div className="transactions-container">
            <div className="transactions-header">
                <div className="header-title">
                    <Title level={2}>Registro de Transacciones</Title>
                </div>

                {/* Add transaction button */}
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={openAddForm}
                    style={{ marginBottom: '16px' }}
                >
                    Nueva Transacción
                </Button>
                {showAddForm && <AddTransactionForm onAddTransaction={handleAddTransaction} onCancel={closeAddForm} />}
            </div>

            {/* Filters and Search */}
            <Card className="filters-card"
                style={{ marginBottom: '16px' }}
            >
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Input
                            placeholder="Buscar transacciones"
                            prefix={<SearchOutlined />}
                            allowClear
                            onChange={handleSearch}
                            value={searchText}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Select
                            placeholder="Categoría"
                            style={{ width: '100%' }}
                            onChange={handleCategoryChange}
                            value={categoryFilter}
                        >
                            <Option value="all">Todas las categorías</Option>
                            {categories.map(category => (
                                <Option key={category} value={category}>{category}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Select
                            placeholder="Tipo"
                            style={{ width: '100%' }}
                            onChange={handleTypeChange}
                            value={typeFilter}
                        >
                            <Option value="all">Todos los tipos</Option>
                            {types.map(type => (
                                <Option key={type} value={type}>{type}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={16} lg={6}>
                        <RangePicker
                            style={{ width: '100%' }}
                            onChange={handleDateRangeChange}
                            placeholder={['Fecha inicio', 'Fecha fin']}
                        />
                    </Col>
                </Row>

                <Divider style={{ margin: '16px 0' }} />

                <Row justify="end">
                    <Space>
                        <Button icon={<FileExcelOutlined />} onClick={handleExportExcel}>
                            Exportar Excel
                        </Button>
                        <Button icon={<FilePdfOutlined />} onClick={handleExportPDF}>
                            Exportar PDF
                        </Button>
                    </Space>
                </Row>
            </Card>

            {/* Transactions Table */}
            <Card className="transactions-table-card">
                <Table
                    columns={columns}
                    dataSource={filteredTransactions}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    onRow={(record) => ({
                        onClick: () => handleViewTransaction(record),
                    })}
                    scroll={{ x: 'max-content' }}
                    className="transactions-table"
                    summary={(pageData) => {
                        // Calculate totals for the filtered transactions
                        const incomesTotal = filteredTransactions
                            .filter(t => t.type === 'Ingreso')
                            .reduce((sum, transaction) => sum + transaction.amount, 0);

                        const expensesTotal = filteredTransactions
                            .filter(t => t.type === 'Gasto')
                            .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

                        const balance = incomesTotal - expensesTotal;

                        return (
                            <>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell colSpan={3}></Table.Summary.Cell>
                                    <Table.Summary.Cell>
                                        <Text strong>Totales:</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell>
                                        <Text type="success">+${incomesTotal.toFixed(2)}</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell></Table.Summary.Cell>
                                </Table.Summary.Row>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell colSpan={3}></Table.Summary.Cell>
                                    <Table.Summary.Cell></Table.Summary.Cell>
                                    <Table.Summary.Cell>
                                        <Text type="danger">-${expensesTotal.toFixed(2)}</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell></Table.Summary.Cell>
                                </Table.Summary.Row>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell colSpan={3}></Table.Summary.Cell>
                                    <Table.Summary.Cell>
                                        <Text strong>Balance:</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell>
                                        <Text type={balance >= 0 ? "success" : "danger"}>
                                            ${balance.toFixed(2)}
                                        </Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell></Table.Summary.Cell>
                                </Table.Summary.Row>
                            </>
                        );
                    }}
                />
            </Card>

            {/* Transaction Details Drawer */}
            <Drawer
                title="Detalles de Transacción"
                placement="right"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                width={500}
            >
                {selectedTransaction && (
                    <>
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="Fecha">
                                {dayjs(selectedTransaction.date).format('DD/MM/YYYY')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Descripción">
                                {selectedTransaction.description}
                            </Descriptions.Item>
                            {selectedTransaction.merchant && (
                                <Descriptions.Item label="Comercio">
                                    {selectedTransaction.merchant}
                                </Descriptions.Item>
                            )}
                            <Descriptions.Item label="Categoría">
                                <Tag color="blue">{selectedTransaction.category}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Tipo">
                                <Tag color={selectedTransaction.type === 'Ingreso' ? 'success' : 'error'}>
                                    {selectedTransaction.type}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Monto">
                                <Text
                                    type={selectedTransaction.type === 'Ingreso' ? 'success' : 'danger'}
                                    strong
                                >
                                    {selectedTransaction.type === 'Ingreso' ? '+' : '-'}
                                    ${Math.abs(selectedTransaction.amount).toFixed(2)}
                                </Text>
                            </Descriptions.Item>
                            {selectedTransaction.account && (
                                <Descriptions.Item label="Cuenta">
                                    {selectedTransaction.account}
                                </Descriptions.Item>
                            )}
                            {selectedTransaction.notes && (
                                <Descriptions.Item label="Notas">
                                    {selectedTransaction.notes}
                                </Descriptions.Item>
                            )}
                            {selectedTransaction.tags && selectedTransaction.tags.length > 0 && (
                                <Descriptions.Item label="Etiquetas">
                                    {selectedTransaction.tags.map(tag => (
                                        <Tag key={tag}>{tag}</Tag>
                                    ))}
                                </Descriptions.Item>
                            )}
                        </Descriptions>

                        <Divider />

                        <Space>
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => console.log('Edit transaction', selectedTransaction.id)}
                            >
                                Editar
                            </Button>
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => showDeleteConfirm(selectedTransaction)}
                            >
                                Eliminar
                            </Button>
                        </Space>
                    </>
                )}
            </Drawer>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Confirmar eliminación"
                open={deleteModalVisible}
                onOk={handleDeleteTransaction}
                onCancel={() => setDeleteModalVisible(false)}
                okText="Sí, eliminar"
                cancelText="Cancelar"
            >
                <p>¿Estás seguro que deseas eliminar esta transacción?</p>
                {transactionToDelete && (
                    <p>
                        <Text strong>{transactionToDelete.description}</Text> por <Text type={transactionToDelete.type === 'Ingreso' ? 'success' : 'danger'}>
                            {transactionToDelete.type === 'Ingreso' ? '+' : '-'}${Math.abs(transactionToDelete.amount).toFixed(2)}
                        </Text>
                    </p>
                )}
                <p>Esta acción no se puede deshacer.</p>
            </Modal>
        </div>
    );
};

export default TransactionsPage;