// Datos de prueba para el dashboard
export const mockDashboardData = {
    // Datos para las tarjetas de resumen
    overview: {
        totalBalance: {
            current: 12450.75,
            previous: 11200.50
        },
        income: {
            current: 3500.00,
            previous: 3200.00
        },
        expenses: {
            current: 2249.75,
            previous: 2450.25
        },
        savings: {
            current: 1250.25,
            previous: 749.75
        }
    },

    // Datos para el gráfico de balance mensual
    monthlyBalance: [
        { month: 'Ene', income: 3200, expenses: 2800 },
        { month: 'Feb', income: 3100, expenses: 2900 },
        { month: 'Mar', income: 3400, expenses: 2700 },
        { month: 'Abr', income: 3300, expenses: 2600 },
        { month: 'May', income: 3500, expenses: 2250 },
        { month: 'Jun', income: 3450, expenses: 2400 }
    ],

    // Datos para el gráfico de gastos por categoría
    expensesByCategory: [
        { category: 'Vivienda', amount: 850 },
        { category: 'Alimentación', amount: 450 },
        { category: 'Transporte', amount: 220 },
        { category: 'Servicios', amount: 180 },
        { category: 'Ocio', amount: 320 },
        { category: 'Salud', amount: 150 },
        { category: 'Otros', amount: 79.75 }
    ],

    // Datos para las transacciones recientes
    recentTransactions: [
        {
            id: 1,
            description: 'Salario',
            category: 'Ingresos',
            amount: 3500,
            type: 'income',
            date: '2025-04-05'
        },
        {
            id: 2,
            description: 'Alquiler',
            category: 'Vivienda',
            amount: 850,
            type: 'expense',
            date: '2025-04-03'
        },
        {
            id: 3,
            description: 'Supermercado',
            category: 'Alimentación',
            amount: 120.50,
            type: 'expense',
            date: '2025-04-10'
        },
        {
            id: 4,
            description: 'Cine',
            category: 'Ocio',
            amount: 35.80,
            type: 'expense',
            date: '2025-04-12'
        },
        {
            id: 5,
            description: 'Venta artículo',
            category: 'Ingresos',
            amount: 150,
            type: 'income',
            date: '2025-04-15'
        }
    ],

    // Datos para los próximos pagos
    upcomingBills: [
        {
            id: 1,
            name: 'Alquiler',
            amount: 850,
            dueDate: '2025-05-05',
            isPaid: false,
            icon: '🏠',
            color: '#e8f4fd'
        },
        {
            id: 2,
            name: 'Electricidad',
            amount: 85.20,
            dueDate: '2025-04-22',
            isPaid: false,
            icon: '💡',
            color: '#fff8e1'
        },
        {
            id: 3,
            name: 'Internet',
            amount: 59.90,
            dueDate: '2025-04-15',
            isPaid: true,
            icon: '🌐',
            color: '#e6f7ee'
        },
        {
            id: 4,
            name: 'Seguro coche',
            amount: 180.50,
            dueDate: '2025-04-18',
            isPaid: false,
            icon: '🚗',
            color: '#ffe9e9'
        }
    ]
};


// Add this to your existing mockData.js file

export const mockTransactionsData = [
    {
        id: 1,
        date: '2025-05-01',
        description: 'Supermercado El Corte',
        merchant: 'Supermercado El Corte',
        category: 'Alimentación',
        type: 'Gasto',
        amount: -125.45,
        account: 'Tarjeta de Crédito',
        notes: 'Compra semanal de víveres',
        tags: ['Necesidades básicas', 'Recurrente']
    },
    {
        id: 2,
        date: '2025-05-02',
        description: 'Nómina Mayo',
        merchant: 'Empresa ABC',
        category: 'Salario',
        type: 'Ingreso',
        amount: 2500.00,
        account: 'Cuenta Corriente',
        notes: 'Salario mensual',
        tags: ['Ingreso recurrente']
    },
    {
        id: 3,
        date: '2025-05-03',
        description: 'Pago de Alquiler',
        merchant: 'Inmobiliaria XYZ',
        category: 'Vivienda',
        type: 'Gasto',
        amount: -850.00,
        account: 'Cuenta Corriente',
        notes: 'Alquiler del mes de mayo',
        tags: ['Gastos fijos', 'Recurrente']
    },
    {
        id: 4,
        date: '2025-05-03',
        description: 'Cena con amigos',
        merchant: 'Restaurante La Terraza',
        category: 'Entretenimiento',
        type: 'Gasto',
        amount: -87.50,
        account: 'Tarjeta de Crédito',
        notes: 'Cena de viernes con amigos',
        tags: ['Ocio']
    },
    {
        id: 5,
        date: '2025-05-04',
        description: 'Servicio de streaming',
        merchant: 'Netflix',
        category: 'Servicios',
        type: 'Gasto',
        amount: -12.99,
        account: 'Tarjeta de Crédito',
        notes: 'Suscripción mensual',
        tags: ['Entretenimiento', 'Recurrente']
    },
    {
        id: 6,
        date: '2025-05-05',
        description: 'Gasolina',
        merchant: 'Estación de Servicio Repsol',
        category: 'Transporte',
        type: 'Gasto',
        amount: -60.00,
        account: 'Tarjeta de Débito',
        notes: 'Tanque lleno',
        tags: ['Coche', 'Necesidades básicas']
    },
    {
        id: 7,
        date: '2025-05-06',
        description: 'Devolución préstamo',
        merchant: 'Carlos Martínez',
        category: 'Otros',
        type: 'Ingreso',
        amount: 150.00,
        account: 'Cuenta Corriente',
        notes: 'Devolución de préstamo a Carlos',
        tags: ['Préstamos']
    },
    {
        id: 8,
        date: '2025-05-07',
        description: 'Consulta médica',
        merchant: 'Clínica Bienestar',
        category: 'Salud',
        type: 'Gasto',
        amount: -50.00,
        account: 'Tarjeta de Débito',
        notes: 'Consulta anual de rutina',
        tags: ['Salud']
    },
    {
        id: 9,
        date: '2025-05-08',
        description: 'Factura de electricidad',
        merchant: 'Compañía Eléctrica',
        category: 'Servicios',
        type: 'Gasto',
        amount: -95.32,
        account: 'Cuenta Corriente',
        notes: 'Factura bimestral',
        tags: ['Gastos fijos', 'Servicios']
    },
    {
        id: 10,
        description: 'Zapatos nuevos',
        date: '2025-05-09',
        merchant: 'Tienda de Calzado Paso Fino',
        category: 'Compras',
        type: 'Gasto',
        amount: -89.99,
        account: 'Tarjeta de Crédito',
        notes: 'Zapatos para el trabajo',
        tags: ['Ropa', 'Trabajo']
    },
    {
        id: 11,
        date: '2025-05-10',
        description: 'Ingreso por proyecto freelance',
        merchant: 'Cliente Freelance',
        category: 'Ingresos Extra',
        type: 'Ingreso',
        amount: 450.00,
        account: 'Cuenta Corriente',
        notes: 'Desarrollo de página web',
        tags: ['Freelance', 'Ingresos extra']
    },
    {
        id: 12,
        date: '2025-05-11',
        description: 'Compra de libros',
        merchant: 'Librería Central',
        category: 'Educación',
        type: 'Gasto',
        amount: -45.75,
        account: 'Tarjeta de Débito',
        notes: 'Libros para curso de programación',
        tags: ['Desarrollo profesional']
    },
    {
        id: 13,
        date: '2025-05-12',
        description: 'Factura de internet',
        merchant: 'Proveedor de Internet',
        category: 'Servicios',
        type: 'Gasto',
        amount: -49.99,
        account: 'Cuenta Corriente',
        notes: 'Servicio mensual de fibra óptica',
        tags: ['Gastos fijos', 'Servicios']
    },
    {
        id: 14,
        date: '2025-05-13',
        description: 'Café de trabajo',
        merchant: 'Café del Centro',
        category: 'Alimentación',
        type: 'Gasto',
        amount: -5.85,
        account: 'Efectivo',
        notes: 'Café durante reunión de trabajo',
        tags: ['Trabajo']
    },
    {
        id: 15,
        date: '2025-05-14',
        description: 'Dividendos acciones',
        merchant: 'Bolsa de Valores',
        category: 'Inversiones',
        type: 'Ingreso',
        amount: 75.23,
        account: 'Cuenta de Inversiones',
        notes: 'Dividendos trimestrales',
        tags: ['Inversiones', 'Ingresos pasivos']
    },
    {
        id: 16,
        date: '2025-05-15',
        description: 'Seguro del coche',
        merchant: 'Aseguradora XYZ',
        category: 'Transporte',
        type: 'Gasto',
        amount: -175.00,
        account: 'Cuenta Corriente',
        notes: 'Pago semestral',
        tags: ['Gastos fijos', 'Coche']
    },
    {
        id: 17,
        date: '2025-05-16',
        description: 'Cine con pareja',
        merchant: 'Cines Moderno',
        category: 'Entretenimiento',
        type: 'Gasto',
        amount: -22.00,
        account: 'Tarjeta de Débito',
        notes: 'Dos entradas y palomitas',
        tags: ['Ocio', 'Pareja']
    },
    {
        id: 18,
        date: '2025-05-17',
        description: 'Regalo de cumpleaños',
        merchant: 'Tienda de Regalos',
        category: 'Compras',
        type: 'Gasto',
        amount: -35.50,
        account: 'Tarjeta de Crédito',
        notes: 'Regalo para cumpleaños de mamá',
        tags: ['Regalos', 'Familia']
    },
    {
        id: 19,
        date: '2025-05-18',
        description: 'Supermercado de descuento',
        merchant: 'Supermercado Ahorro',
        category: 'Alimentación',
        type: 'Gasto',
        amount: -78.45,
        account: 'Tarjeta de Débito',
        notes: 'Compra de productos básicos',
        tags: ['Necesidades básicas']
    },
    {
        id: 20,
        date: '2025-05-19',
        description: 'Devolución Hacienda',
        merchant: 'Agencia Tributaria',
        category: 'Impuestos',
        type: 'Ingreso',
        amount: 325.67,
        account: 'Cuenta Corriente',
        notes: 'Devolución de la declaración de la renta',
        tags: ['Impuestos', 'Ingresos anuales']
    },
    {
        id: 21,
        date: '2025-05-20',
        description: 'Medicamentos',
        merchant: 'Farmacia Salud',
        category: 'Salud',
        type: 'Gasto',
        amount: -27.85,
        account: 'Tarjeta de Débito',
        notes: 'Medicamentos para la alergia',
        tags: ['Salud', 'Necesidades básicas']
    },
    {
        id: 22,
        date: '2025-05-21',
        description: 'Curso online',
        merchant: 'Plataforma de Educación',
        category: 'Educación',
        type: 'Gasto',
        amount: -99.00,
        account: 'Tarjeta de Crédito',
        notes: 'Curso de desarrollo web',
        tags: ['Desarrollo profesional', 'Educación']
    },
    {
        id: 23,
        date: '2025-05-22',
        description: 'Factura de agua',
        merchant: 'Compañía de Agua',
        category: 'Servicios',
        type: 'Gasto',
        amount: -38.75,
        account: 'Cuenta Corriente',
        notes: 'Factura trimestral',
        tags: ['Gastos fijos', 'Servicios']
    },
    {
        id: 24,
        date: '2025-05-23',
        description: 'Venta de artículo usado',
        merchant: 'Plataforma de Segunda Mano',
        category: 'Ingresos Extra',
        type: 'Ingreso',
        amount: 85.00,
        account: 'Cuenta Corriente',
        notes: 'Venta de monitor viejo',
        tags: ['Ventas', 'Ingresos extra']
    },
    {
        id: 25,
        date: '2025-05-24',
        description: 'Compra de ropa',
        merchant: 'Tienda de Ropa Moda',
        category: 'Compras',
        type: 'Gasto',
        amount: -120.00,
        account: 'Tarjeta de Crédito',
        notes: 'Ropa de temporada',
        tags: ['Ropa', 'Compras']
    },
    {
        id: 26,
        date: '2025-05-25',
        description: 'Transferencia a cuenta ahorro',
        merchant: 'Banco Principal',
        category: 'Ahorros',
        type: 'Transferencia',
        amount: -200.00,
        account: 'Cuenta Corriente',
        notes: 'Transferencia mensual para ahorros',
        tags: ['Ahorros', 'Transferencias']
    },
    {
        id: 27,
        date: '2025-05-26',
        description: 'Cuota gimnasio',
        merchant: 'Gimnasio Fitness',
        category: 'Salud',
        type: 'Gasto',
        amount: -45.00,
        account: 'Cuenta Corriente',
        notes: 'Membresía mensual',
        tags: ['Salud', 'Recurrente']
    },
    {
        id: 28,
        date: '2025-05-27',
        description: 'Comida rápida',
        merchant: 'Restaurante Fast Food',
        category: 'Alimentación',
        type: 'Gasto',
        amount: -12.50,
        account: 'Tarjeta de Débito',
        notes: 'Almuerzo en día ocupado',
        tags: ['Comida fuera']
    },
    {
        id: 29,
        date: '2025-05-28',
        description: 'Gasolina',
        merchant: 'Estación de Servicio Cepsa',
        category: 'Transporte',
        type: 'Gasto',
        amount: -55.00,
        account: 'Tarjeta de Crédito',
        notes: 'Llenado de tanque',
        tags: ['Coche', 'Necesidades básicas']
    },
    {
        id: 30,
        date: '2025-05-29',
        description: 'Intereses cuenta',
        merchant: 'Banco Principal',
        category: 'Inversiones',
        type: 'Ingreso',
        amount: 5.37,
        account: 'Cuenta de Ahorros',
        notes: 'Intereses mensuales',
        tags: ['Ingresos pasivos', 'Inversiones']
    },
    {
        id: 31,
        date: '2025-05-30',
        description: 'Suscripción música',
        merchant: 'Servicio de Música Premium',
        category: 'Servicios',
        type: 'Gasto',
        amount: -9.99,
        account: 'Tarjeta de Crédito',
        notes: 'Suscripción mensual',
        tags: ['Entretenimiento', 'Recurrente']
    },
    {
        id: 32,
        date: '2025-06-01',
        description: 'Bono de rendimiento',
        merchant: 'Empresa ABC',
        category: 'Salario',
        type: 'Ingreso',
        amount: 500.00,
        account: 'Cuenta Corriente',
        notes: 'Bono trimestral por objetivos',
        tags: ['Trabajo', 'Bonos']
    }
];