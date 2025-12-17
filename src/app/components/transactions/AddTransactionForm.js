import React, { useState } from 'react';
import {
    DollarOutlined,
    PlusOutlined,
    MinusOutlined,
    SwapOutlined,
    ShoppingOutlined,
    CarOutlined,
    HomeOutlined,
    MedicineBoxOutlined,
    BookOutlined,
    CoffeeOutlined,
    BulbOutlined,
    AppstoreOutlined,
    CloseOutlined
} from '@ant-design/icons';
import './AddTransactionForm.css';

const AddTransactionForm = ({ onAddTransaction, onCancel }) => {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'Gasto',
        category: 'Otros',
        merchant: '',
        account: 'Efectivo',
        notes: '',
        tags: []
    });

    const [tagInput, setTagInput] = useState('');

    // Categories with their corresponding icons
    const categories = [
        { name: 'Alimentación', icon: <CoffeeOutlined /> },
        { name: 'Transporte', icon: <CarOutlined /> },
        { name: 'Entretenimiento', icon: <AppstoreOutlined /> },
        { name: 'Servicios', icon: <BulbOutlined /> },
        { name: 'Compras', icon: <ShoppingOutlined /> },
        { name: 'Salud', icon: <MedicineBoxOutlined /> },
        { name: 'Educación', icon: <BookOutlined /> },
        { name: 'Vivienda', icon: <HomeOutlined /> },
        { name: 'Otros', icon: <AppstoreOutlined /> }
    ];

    // Transaction types
    const types = [
        { name: 'Ingreso', icon: <PlusOutlined />, className: 'income' },
        { name: 'Gasto', icon: <MinusOutlined />, className: 'expense' },
        { name: 'Transferencia', icon: <SwapOutlined />, className: 'transfer' }
    ];

    // Account options
    const accounts = ['Efectivo', 'Tarjeta de Crédito', 'Tarjeta de Débito', 'Cuenta Bancaria', 'Otro'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTypeSelect = (type) => {
        setFormData(prev => ({
            ...prev,
            type
        }));
    };

    const handleCategorySelect = (category) => {
        setFormData(prev => ({
            ...prev,
            category
        }));
    };

    const handleTagInputChange = (e) => {
        setTagInput(e.target.value);
    };

    const handleTagInputKeyDown = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim())) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...prev.tags, tagInput.trim()]
                }));
            }
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        // Validate required fields
        if (!formData.description || !formData.amount || !formData.date || !formData.type || !formData.category) {
            alert('Por favor complete todos los campos obligatorios');
            return;
        }

        // Create new transaction object
        const newTransaction = {
            id: Date.now().toString(),
            description: formData.description,
            amount: parseFloat(formData.amount) * (formData.type === 'Gasto' ? -1 : 1),
            date: formData.date,
            type: formData.type,
            category: formData.category,
            merchant: formData.merchant || null,
            account: formData.account,
            notes: formData.notes || null,
            tags: formData.tags.length > 0 ? formData.tags : null
        };

        onAddTransaction(newTransaction);
        onCancel(); // Close form after submit
    };

    // Handle clicks on the overlay to close the form
    const handleOverlayClick = (e) => {
        if (e.target.className === 'add-transaction-form-overlay') {
            onCancel();
        }
    };

    return (
        <div className="add-transaction-form-overlay" onClick={handleOverlayClick}>
            <div className="add-transaction-form">
                <div className="form-header">
                    <h3>Añadir Nueva Transacción</h3>
                    <button className="close-button" onClick={onCancel}><CloseOutlined /></button>
                </div>

                <div className="form-container">
                    {/* Transaction Type Selection */}
                    <div className="form-group">
                        <label>Tipo de Transacción</label>
                        <div className="type-selector">
                            {types.map(type => (
                                <div
                                    key={type.name}
                                    className={`type-option ${type.className} ${formData.type === type.name ? 'selected' : ''}`}
                                    onClick={() => handleTypeSelect(type.name)}
                                >
                                    {type.icon} {type.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Descripción*</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Ej: Compra de comestibles"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Importe (€)*</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Fecha*</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Comercio</label>
                            <input
                                type="text"
                                name="merchant"
                                value={formData.merchant}
                                onChange={handleChange}
                                placeholder="Ej: Supermercado XYZ"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Categoría*</label>
                        <div className="category-selector">
                            {categories.map(category => (
                                <div
                                    key={category.name}
                                    className={`category-option ${formData.category === category.name ? 'selected' : ''}`}
                                    onClick={() => handleCategorySelect(category.name)}
                                >
                                    {category.icon} {category.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Cuenta</label>
                        <select
                            name="account"
                            value={formData.account}
                            onChange={handleChange}
                        >
                            {accounts.map(account => (
                                <option key={account} value={account}>{account}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Notas</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Añade notas adicionales aquí..."
                            rows="2"
                        />
                    </div>

                    <div className="form-group">
                        <label>Etiquetas</label>
                        <div className="tags-input">
                            {formData.tags.map(tag => (
                                <div key={tag} className="tag">
                                    {tag}
                                    <span className="tag-close" onClick={() => handleRemoveTag(tag)}>
                                        <CloseOutlined style={{ fontSize: '10px' }} />
                                    </span>
                                </div>
                            ))}
                            <input
                                type="text"
                                className="tag-input"
                                value={tagInput}
                                onChange={handleTagInputChange}
                                onKeyDown={handleTagInputKeyDown}
                                placeholder={formData.tags.length === 0 ? "Añadir etiquetas (presiona Enter)" : ""}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-cancel" onClick={onCancel}>Cancelar</button>
                        <button type="button" className="btn btn-save" onClick={handleSubmit}>Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTransactionForm;