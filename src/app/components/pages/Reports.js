"use client"

import React, { useState, useEffect } from 'react';
import {
    Typography,
    Card,
    Row,
    Col,
    Select,
    DatePicker,
    Button,
    Spin,
    Alert,
    Tabs,
    Divider,
    Space,
    Table,
    Tag
} from 'antd';
import {
    BarChartOutlined,
    PieChartOutlined,
    LineChartOutlined,
    DownloadOutlined,
    ReloadOutlined,
    DollarOutlined,
    FileExcelOutlined,
    FilePdfOutlined
} from '@ant-design/icons';
import { mockTransactionsData } from '../utils/mockData';
import dayjs from 'dayjs';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const ReportsPage = () => {
    // State variables
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeFrame, setTimeFrame] = useState('month');
    const [dateRange, setDateRange] = useState([
        dayjs().startOf('month'),
        dayjs()
    ]);
    const [activeTab, setActiveTab] = useState('overview');
    const [categoryData, setCategoryData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [balanceData, setBalanceData] = useState([]);
    const [topExpenses, setTopExpenses] = useState([]);
    const [categoryTrends, setCategoryTrends] = useState([]);

    // Chart colors
    const COLORS = [
        '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFC', 
        '#FF6B6B', '#4ECDC4', '#C7F464', '#81B29A', '#F28482'
    ];

    // Time frame options
    const timeFrameOptions = [
        { value: 'week', label: 'Esta semana' },
        { value: 'month', label: 'Este mes' },
        { value: 'quarter', label: 'Este trimestre' },
        { value: 'year', label: 'Este año' },
        { value: 'custom', label: 'Personalizado' },
    ];

    useEffect(() => {
        // Fetch transactions data
        fetchTransactions();
    }, []);

    useEffect(() => {
        // Process data for reports when transactions or date range changes
        if (transactions.length > 0) {
            processData();
        }
    }, [transactions, dateRange, timeFrame]);

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
            setError('Error al cargar los datos para los informes');
            setIsLoading(false);
        }
    };

    const handleTimeFrameChange = (value) => {
        setTimeFrame(value);
        
        // Update date range based on selected time frame
        if (value === 'week') {
            setDateRange([dayjs().startOf('week'), dayjs()]);
        } else if (value === 'month') {
            setDateRange([dayjs().startOf('month'), dayjs()]);
        } else if (value === 'quarter') {
            setDateRange([dayjs().startOf('quarter'), dayjs()]);
        } else if (value === 'year') {
            setDateRange([dayjs().startOf('year'), dayjs()]);
        }
        // If 'custom', keep current date range
    };

    const handleDateRangeChange = (dates) => {
        if (dates) {
            setDateRange(dates);
            setTimeFrame('custom');
        }
    };

    const handleRefresh = () => {
        fetchTransactions();
    };

    const handleExportExcel = () => {
        // Implement Excel export functionality
        console.log('Export to Excel');
    };

    const handleExportPDF = () => {
        // Implement PDF export functionality
        console.log('Export to PDF');
    };

    const processData = () => {
        // Filter transactions within selected date range
        const filteredTransactions = transactions.filter(transaction => {
            const txDate = dayjs(transaction.date);
            return txDate.isAfter(dateRange[0]) && txDate.isBefore(dateRange[1].add(1, 'day'));
        });

        // Process data for category pie chart
        processCategoryData(filteredTransactions);
        
        // Process data for monthly trend chart
        processMonthlyData(filteredTransactions);
        
        // Process data for balance chart
        processBalanceData(filteredTransactions);
        
        // Process top expenses
        processTopExpenses(filteredTransactions);
        
        // Process category trends
        processCategoryTrends(filteredTransactions);
    };

    const processCategoryData = (filteredTransactions) => {
        // Group expenses by category and sum amounts
        const categoryMap = {};
        
        filteredTransactions
            .filter(tx => tx.type === 'Gasto')
            .forEach(tx => {
                if (!categoryMap[tx.category]) {
                    categoryMap[tx.category] = 0;
                }
                categoryMap[tx.category] += Math.abs(tx.amount);
            });
        
        // Convert to array format for recharts
        const data = Object.keys(categoryMap).map(category => ({
            name: category,
            value: categoryMap[category]
        }));
        
        // Sort by value descending
        data.sort((a, b) => b.value - a.value);
        
        setCategoryData(data);
    };

    const processMonthlyData = (filteredTransactions) => {
        // Determine time unit based on selected time frame
        let timeUnit = 'day';
        if (timeFrame === 'year') {
            timeUnit = 'month';
        } else if (timeFrame === 'quarter') {
            timeUnit = 'week';
        }
        
        // Group by time unit
        const timeMap = {};
        
        filteredTransactions.forEach(tx => {
            const txDate = dayjs(tx.date);
            let timeKey;
            
            if (timeUnit === 'day') {
                timeKey = txDate.format('DD/MM');
            } else if (timeUnit === 'week') {
                timeKey = `Sem ${txDate.week()}`;
            } else if (timeUnit === 'month') {
                timeKey = txDate.format('MMM');
            }
            
            if (!timeMap[timeKey]) {
                timeMap[timeKey] = { 
                    name: timeKey,
                    ingresos: 0,
                    gastos: 0
                };
            }
            
            if (tx.type === 'Ingreso') {
                timeMap[timeKey].ingresos += tx.amount;
            } else if (tx.type === 'Gasto') {
                timeMap[timeKey].gastos += Math.abs(tx.amount);
            }
        });
        
        // Convert to array and sort by date
        let data = Object.values(timeMap);
        
        // Add balance field
        data = data.map(item => ({
            ...item,
            balance: item.ingresos - item.gastos
        }));
        
        setMonthlyData(data);
    };

    const processBalanceData = (filteredTransactions) => {
        // Sort transactions by date
        const sortedTransactions = [...filteredTransactions].sort((a, b) => 
            new Date(a.date) - new Date(b.date)
        );
        
        // Calculate running balance
        let balance = 0;
        const data = [];
        
        sortedTransactions.forEach(tx => {
            const amount = tx.type === 'Ingreso' ? tx.amount : -Math.abs(tx.amount);
            balance += amount;
            
            data.push({
                date: dayjs(tx.date).format('DD/MM'),
                balance: balance,
                amount: amount
            });
        });
        
        setBalanceData(data);
    };

    const processTopExpenses = (filteredTransactions) => {
        // Get expenses only and sort by amount
        const expenses = filteredTransactions
            .filter(tx => tx.type === 'Gasto')
            .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
            .slice(0, 10);  // Get top 10
            
        setTopExpenses(expenses);
    };

    const processCategoryTrends = (filteredTransactions) => {
        // Group expenses by category and month
        const categoryMonthMap = {};
        
        filteredTransactions
            .filter(tx => tx.type === 'Gasto')
            .forEach(tx => {
                const month = dayjs(tx.date).format('MMM');
                const category = tx.category;
                
                if (!categoryMonthMap[category]) {
                    categoryMonthMap[category] = {};
                }
                
                if (!categoryMonthMap[category][month]) {
                    categoryMonthMap[category][month] = 0;
                }
                
                categoryMonthMap[category][month] += Math.abs(tx.amount);
            });
        
        // Convert to array format for recharts
        const months = [...new Set(filteredTransactions.map(tx => dayjs(tx.date).format('MMM')))].sort();
        const categories = Object.keys(categoryMonthMap);
        
        const data = months.map(month => {
            const monthData = { name: month };
            
            categories.forEach(category => {
                monthData[category] = categoryMonthMap[category][month] || 0;
            });
            
            return monthData;
        });
        
        setCategoryTrends(data);
    };

    // Calculate summary data
    const calculateSummary = () => {
        const filteredTransactions = transactions.filter(transaction => {
            const txDate = dayjs(transaction.date);
            return txDate.isAfter(dateRange[0]) && txDate.isBefore(dateRange[1].add(1, 'day'));
        });
        
        const incomes = filteredTransactions
            .filter(tx => tx.type === 'Ingreso')
            .reduce((sum, tx) => sum + tx.amount, 0);
            
        const expenses = filteredTransactions
            .filter(tx => tx.type === 'Gasto')
            .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
            
        const balance = incomes - expenses;
        const transactionCount = filteredTransactions.length;
        
        return {
            incomes,
            expenses,
            balance,
            transactionCount
        };
    };

    if (isLoading) {
        return (
            <div className="reports-loading">
                <Spin size="large" tip="Cargando datos de informes..." />
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
                className="reports-error"
            />
        );
    }

    const summary = calculateSummary();

    return (
        <div className="reports-container">
            <div className="reports-header">
                <div className="header-title">
                    {/* <BarChartOutlined className="reports-icon" /> */}
                    <Title level={2}>Informes Financieros</Title>
                </div>

                <Space
                style={{ marginBottom: 16 }}
                >
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={handleRefresh}
                    >
                        Actualizar
                    </Button>
                    <Button
                        icon={<FileExcelOutlined />}
                        onClick={handleExportExcel}
                    >
                        Exportar Excel
                    </Button>
                    <Button
                        icon={<FilePdfOutlined />}
                        onClick={handleExportPDF}
                    >
                        Exportar PDF
                    </Button>
                </Space>
            </div>

            {/* Filters */}
            <Card className="filters-card"
            style={{ marginBottom: 12 }}
            >
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Período de tiempo"
                            value={timeFrame}
                            onChange={handleTimeFrameChange}
                        >
                            {timeFrameOptions.map(option => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={16} lg={12}>
                        <RangePicker
                            style={{ width: '100%' }}
                            value={dateRange}
                            onChange={handleDateRangeChange}
                            format="DD/MM/YYYY"
                            allowClear={false}
                        />
                    </Col>
                </Row>
            </Card>

            {/* Summary Cards */}
            <Row gutter={[16, 16]} className="summary-cards"
            style={{ marginBottom: 12 }}
            >
                <Col xs={24} sm={12} md={6}>
                    <Card className="summary-card income-card">
                        <div className="summary-icon">
                            <DollarOutlined />
                        </div>
                        <div className="summary-content">
                            <Text type="secondary">Ingresos Totales</Text>
                            <Title level={3} className="income-amount">
                                ${summary.incomes.toFixed(2)}
                            </Title>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="summary-card expense-card">
                        <div className="summary-icon">
                            <DollarOutlined />
                        </div>
                        <div className="summary-content">
                            <Text type="secondary">Gastos Totales</Text>
                            <Title level={3} className="expense-amount">
                                ${summary.expenses.toFixed(2)}
                            </Title>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="summary-card balance-card">
                        <div className="summary-icon">
                            <DollarOutlined />
                        </div>
                        <div className="summary-content">
                            <Text type="secondary">Balance</Text>
                            <Title level={3} className={summary.balance >= 0 ? "positive-balance" : "negative-balance"}>
                                ${summary.balance.toFixed(2)}
                            </Title>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="summary-card transaction-card">
                        <div className="summary-icon">
                            <DollarOutlined />
                        </div>
                        <div className="summary-content">
                            <Text type="secondary">Transacciones</Text>
                            <Title level={3}>
                                {summary.transactionCount}
                            </Title>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Reports Tabs */}
            <Card className="reports-tabs-card">
                <Tabs 
                    activeKey={activeTab} 
                    onChange={setActiveTab}
                    tabPosition="top"
                >
                    {/* Overview Tab */}
                    <TabPane
                        tab={<span><PieChartOutlined />Resumen</span>}
                        key="overview"
                    >
                        <Row gutter={[16, 16]}>
                            {/* Monthly Income/Expense Chart */}
                            <Col xs={24} lg={12}>
                                <Card title="Ingresos vs Gastos" className="chart-card">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            data={monthlyData}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                                            <Legend />
                                            <Bar dataKey="ingresos" name="Ingresos" fill="#52c41a" />
                                            <Bar dataKey="gastos" name="Gastos" fill="#f5222d" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>

                            {/* Categories Pie Chart */}
                            <Col xs={24} lg={12}>
                                <Card title="Gastos por Categoría" className="chart-card">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>

                            {/* Balance Chart */}
                            <Col xs={24}>
                                <Card title="Evolución del Balance" className="chart-card">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart
                                            data={balanceData}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                                            <Legend />
                                            <Line 
                                                type="monotone" 
                                                dataKey="balance" 
                                                name="Balance" 
                                                stroke="#1890ff" 
                                                activeDot={{ r: 8 }} 
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>

                    {/* Expenses Tab */}
                    <TabPane
                        tab={<span><LineChartOutlined />Gastos</span>}
                        key="expenses"
                    >
                        <Row gutter={[16, 16]}>
                            {/* Top Expenses */}
                            <Col xs={24} lg={12}>
                                <Card title="Principales Gastos" className="data-card">
                                    <Table
                                        dataSource={topExpenses}
                                        rowKey="id"
                                        pagination={false}
                                        size="small"
                                    >
                                        <Table.Column 
                                            title="Fecha" 
                                            dataIndex="date" 
                                            key="date"
                                            render={(text) => dayjs(text).format('DD/MM/YYYY')}
                                        />
                                        <Table.Column 
                                            title="Descripción" 
                                            dataIndex="description" 
                                            key="description" 
                                        />
                                        <Table.Column 
                                            title="Categoría" 
                                            dataIndex="category" 
                                            key="category"
                                            render={(text) => <Tag color="blue">{text}</Tag>}
                                        />
                                        <Table.Column 
                                            title="Monto" 
                                            dataIndex="amount" 
                                            key="amount"
                                            render={(text) => <Text type="danger">-${Math.abs(text).toFixed(2)}</Text>}
                                            sorter={(a, b) => Math.abs(a.amount) - Math.abs(b.amount)}
                                            defaultSortOrder="descend"
                                        />
                                    </Table>
                                </Card>
                            </Col>

                            {/* Category Distribution */}
                            <Col xs={24} lg={12}>
                                <Card title="Distribución por Categoría" className="chart-card">
                                    <ResponsiveContainer width="100%" height={400}>
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                                            <Legend 
                                                layout="vertical" 
                                                verticalAlign="middle" 
                                                align="right"
                                                formatter={(value, entry) => {
                                                    const item = categoryData.find(c => c.name === value);
                                                    return `${value}: $${item ? item.value.toFixed(2) : 0}`;
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>

                            {/* Category Trends */}
                            <Col xs={24}>
                                <Card title="Tendencias de Gastos por Categoría" className="chart-card">
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart
                                            data={categoryTrends}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                                            <Legend />
                                            {Object.keys(categoryTrends[0] || {}).filter(key => key !== 'name').map((category, index) => (
                                                <Bar 
                                                    key={category}
                                                    dataKey={category} 
                                                    name={category} 
                                                    fill={COLORS[index % COLORS.length]} 
                                                    stackId="a"
                                                />
                                            ))}
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>

                    {/* Income Tab */}
                    <TabPane
                        tab={<span><BarChartOutlined />Ingresos</span>}
                        key="income"
                    >
                        <Row gutter={[16, 16]}>
                            {/* Monthly Income Trend */}
                            <Col xs={24}>
                                <Card title="Tendencia de Ingresos" className="chart-card">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart
                                            data={monthlyData}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                                            <Legend />
                                            <Line 
                                                type="monotone" 
                                                dataKey="ingresos" 
                                                name="Ingresos" 
                                                stroke="#52c41a" 
                                                activeDot={{ r: 8 }} 
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>

                            {/* Income vs Expense Comparison */}
                            <Col xs={24}>
                                <Card title="Comparativa de Ingresos vs Gastos" className="chart-card">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            data={monthlyData}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                                            <Legend />
                                            <Bar dataKey="ingresos" name="Ingresos" fill="#52c41a" />
                                            <Bar dataKey="gastos" name="Gastos" fill="#f5222d" />
                                            <Bar dataKey="balance" name="Balance" fill="#1890ff" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

export default ReportsPage;