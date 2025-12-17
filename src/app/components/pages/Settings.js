"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
    CardDescription,
} from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/app/components/ui/select';
import { Avatar, AvatarImage } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { Label } from '@/app/components/ui/label';
import { showToast } from 'nextjs-toast-notify';
import { Save, Plus, Edit, Trash2, Moon, Sun } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { useTheme } from 'next-themes';


const Settings = () => {
    // General settings state
    const [language, setLanguage] = useState('es');
    const [currency, setCurrency] = useState('USD');
    const { setTheme } = useTheme()
    const [primaryColor, setPrimaryColor] = useState('#1890ff');
    const [secondaryColor, setSecondaryColor] = useState('#52c41a');
    const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
    const [showCents, setShowCents] = useState(true);
    const [startOfWeek, setStartOfWeek] = useState('monday');
    const [defaultView, setDefaultView] = useState('dashboard');
    const [activeTab, setActiveTab] = useState('general');


    // Categories state
    const [categories, setCategories] = useState([
        { id: 1, name: 'Alimentación', color: '#00C49F', icon: 'shopping-cart', isDefault: true },
        { id: 2, name: 'Transporte', color: '#0088FE', icon: 'car', isDefault: true },
        { id: 3, name: 'Entretenimiento', color: '#FFBB28', icon: 'play-circle', isDefault: true },
        { id: 4, name: 'Servicios', color: '#FF8042', icon: 'bulb', isDefault: true },
        { id: 5, name: 'Compras', color: '#A28BFC', icon: 'shopping', isDefault: true },
        { id: 6, name: 'Salud', color: '#FF6B6B', icon: 'medicine-box', isDefault: true },
        { id: 7, name: 'Educación', color: '#4ECDC4', icon: 'book', isDefault: true },
        { id: 8, name: 'Vivienda', color: '#C7F464', icon: 'home', isDefault: true },
        { id: 9, name: 'Otros', color: '#81B29A', icon: 'ellipsis', isDefault: true }
    ]);
    const [newCategory, setNewCategory] = useState({ name: '', color: '#1890ff', icon: 'tag' });
    const [editingCategory, setEditingCategory] = useState(null);

    // Account settings state
    const [accounts, setAccounts] = useState([
        { id: 1, name: 'Cuenta Principal', type: 'checking', balance: 5000, currency: 'USD', color: '#1890ff', isDefault: true },
        { id: 2, name: 'Ahorro', type: 'savings', balance: 10000, currency: 'USD', color: '#52c41a', isDefault: false },
        { id: 3, name: 'Tarjeta de Crédito', type: 'credit', balance: -1500, currency: 'USD', color: '#f5222d', isDefault: false }
    ]);
    const [newAccount, setNewAccount] = useState({ name: '', type: 'checking', balance: 0, currency: 'USD', color: '#1890ff' });
    const [editingAccount, setEditingAccount] = useState(null);

    // Notification settings state
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [lowBalanceAlerts, setLowBalanceAlerts] = useState(true);
    const [lowBalanceThreshold, setLowBalanceThreshold] = useState(100);
    const [billReminders, setBillReminders] = useState(true);
    const [reminderDays, setReminderDays] = useState(3);
    const [monthlyReports, setMonthlyReports] = useState(true);

    // Import/Export settings state
    const [exportFormat, setExportFormat] = useState('xlsx');
    const [importStatus, setImportStatus] = useState('');
    const [exportStatus, setExportStatus] = useState('');

    // Profile settings state
    const [name, setName] = useState('Usuario');
    const [email, setEmail] = useState('usuario@ejemplo.com');
    const [avatar, setAvatar] = useState(null);

    // Currency options
    const currencies = [
        { code: 'USD', symbol: '$', name: 'Dólar estadounidense' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'MXN', symbol: '$', name: 'Peso mexicano' },
        { code: 'COP', symbol: '$', name: 'Peso colombiano' },
        { code: 'ARS', symbol: '$', name: 'Peso argentino' },
        { code: 'CLP', symbol: '$', name: 'Peso chileno' },
        { code: 'PEN', symbol: 'S/', name: 'Sol peruano' },
        { code: 'BOB', symbol: 'Bs', name: 'Boliviano' },
        { code: 'VES', symbol: 'Bs.S', name: 'Bolívar soberano' },
        { code: 'BRL', symbol: 'R$', name: 'Real brasileño' }
    ];

    // Language options
    const languages = [
        { code: 'es', name: 'Español' },
        { code: 'en', name: 'English' },
        { code: 'pt', name: 'Português' },
        { code: 'fr', name: 'Français' },
        { code: 'de', name: 'Deutsch' }
    ];

    // Account types
    const accountTypes = [
        { value: 'checking', label: 'Cuenta Corriente' },
        { value: 'savings', label: 'Cuenta de Ahorro' },
        { value: 'credit', label: 'Tarjeta de Crédito' },
        { value: 'investment', label: 'Inversión' },
        { value: 'cash', label: 'Efectivo' },
        { value: 'other', label: 'Otro' }
    ];

    // Date format options
    const dateFormats = [
        { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
        { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
        { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
        { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' },
        { value: 'MM-DD-YYYY', label: 'MM-DD-YYYY' }
    ];

    // View options
    const viewOptions = [
        { value: 'dashboard', label: 'Dashboard' },
        { value: 'transactions', label: 'Transacciones' },
        { value: 'reports', label: 'Informes' },
    ];

    // Day options
    const dayOptions = [
        { value: 'monday', label: 'Lunes' },
        { value: 'sunday', label: 'Domingo' },
        { value: 'saturday', label: 'Sábado' }
    ];

    // Icon options (limited for simplicity)
    const iconOptions = [
        'shopping-cart', 'car', 'home', 'bulb', 'medicine-box',
        'coffee', 'dollar', 'credit-card', 'bank', 'book',
        'shopping', 'gift', 'trophy', 'phone', 'wifi',
        'play-circle', 'tag', 'heart', 'star', 'ellipsis'
    ];

    // Load saved configuration on mount (placeholder)
    useEffect(() => {
        // load from localStorage or API if needed
    }, []);

    // Handle form submission
    const handleSaveGeneral = (e) => {
        e && e.preventDefault && e.preventDefault();
        // In a real app, you would save these values to an API or localStorage
        // values are already bound to state
        alert('Configuración general guardada correctamente');
    };

    // Categories handlers
    const handleAddCategory = () => {
        if (!newCategory.name.trim()) {
            alert('El nombre de la categoría es obligatorio');
            return;
        }

        const newCategoryItem = {
            id: categories.length + 1,
            ...newCategory,
            isDefault: false
        };

        setCategories([...categories, newCategoryItem]);
        setNewCategory({ name: '', color: '#1890ff', icon: 'tag' });
        alert('Categoría añadida correctamente');
    };

    const handleDeleteCategory = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);

        if (category.isDefault) {
            alert('No se pueden eliminar las categorías predeterminadas');
            return;
        }

        if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;

        setCategories(categories.filter(c => c.id !== categoryId));
        alert('Categoría eliminada correctamente');
    };

    const startEditCategory = (category) => {
        setEditingCategory({ ...category });
    };

    const handleUpdateCategory = () => {
        if (!editingCategory || !editingCategory.name.trim()) {
            alert('El nombre de la categoría es obligatorio');
            return;
        }

        setCategories(categories.map(c => (c.id === editingCategory.id ? editingCategory : c)));

        setEditingCategory(null);
        alert('Categoría actualizada correctamente');
    };

    // Account handlers
    const handleAddAccount = () => {
        if (!newAccount.name.trim()) {
            alert('El nombre de la cuenta es obligatorio');
            return;
        }

        const newAccountItem = {
            id: accounts.length + 1,
            ...newAccount,
            isDefault: accounts.length === 0,
        };

        setAccounts([...accounts, newAccountItem]);
        setNewAccount({ name: '', type: 'checking', balance: 0, currency: 'USD', color: '#1890ff' });
        alert('Cuenta añadida correctamente');
    };

    const handleDeleteAccount = (accountId) => {
        const account = accounts.find(a => a.id === accountId);

        if (account.isDefault) {
            alert('No se puede eliminar la cuenta predeterminada. Establezca otra cuenta como predeterminada primero.');
            return;
        }

        if (!window.confirm('¿Estás seguro de eliminar esta cuenta?')) return;

        setAccounts(accounts.filter(a => a.id !== accountId));
        alert('Cuenta eliminada correctamente');
    };

    const startEditAccount = (account) => {
        setEditingAccount({ ...account });
    };

    const handleUpdateAccount = () => {
        if (!editingAccount || !editingAccount.name.trim()) {
            alert('El nombre de la cuenta es obligatorio');
            return;
        }

        setAccounts(accounts.map(a => (a.id === editingAccount.id ? editingAccount : a)));

        setEditingAccount(null);
        alert('Cuenta actualizada correctamente');
    };

    const setAccountAsDefault = (accountId) => {
        setAccounts(accounts.map(a => ({
            ...a,
            isDefault: a.id === accountId
        })));

        alert('Cuenta predeterminada actualizada');
    };

    // Notification settings handlers
    const handleSaveNotifications = () => {
        alert('Configuración de notificaciones guardada correctamente');
    };

    // Import/Export handlers
    const handleExport = () => {
        setExportStatus('Exportando datos...');

        // Simulate export process
        setTimeout(() => {
            setExportStatus('');
            alert(`Datos exportados correctamente en formato ${exportFormat.toUpperCase()}`);
        }, 800);
    };

    const handleImportFile = (file) => {
        if (!file) return;
        setImportStatus('Importando datos...');
        setTimeout(() => {
            setImportStatus('');
            alert(`${file.name} importado correctamente`);
        }, 800);
    };

    // Profile settings handlers
    const handleSaveProfile = () => {
        if (!name.trim() || !email.trim()) {
            alert('Nombre y correo electrónico son obligatorios');
            return;
        }

        alert('Perfil actualizado correctamente');
    };

    const handleAvatarChange = (file) => {
        if (!file) return;
        setAvatar(URL.createObjectURL(file));
        alert('Avatar actualizado correctamente');
    };

    return (
        <div className="configuration-container">

            <div className="configuration-header mb-6">
                <div className="header-title">
                    <h2 className="text-2xl font-semibold">Configuración</h2>
                </div>
            </div>

            <Card className="configuration-card">
                <CardContent>
                    <div className="flex gap-2 mb-4">
                        <Button variant="ghost" size="sm" onClick={() => setActiveTab('general')}>General</Button>
                        <Button variant="ghost" size="sm" onClick={() => setActiveTab('categories')}>Categorías</Button>
                        <Button variant="ghost" size="sm" onClick={() => setActiveTab('accounts')}>Cuentas</Button>
                    </div>

                    {activeTab === 'general' && (
                        <form onSubmit={handleSaveGeneral} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>


                                <Label className="mb-2 block" >Idioma</Label>
                                <Select defaultValue={language} onValueChange={(v) => setLanguage(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {languages.map(l => (
                                            <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                            </div>

                            <div>
                                <Label className="mb-2 block">Moneda</Label>
                                <Select defaultValue={currency} onValueChange={(v) => setCurrency(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currencies.map(c => (
                                            <SelectItem key={c.code} value={c.code}>{`${c.symbol} - ${c.name} (${c.code})`}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col">
                                <Label className="mb-2 block">Tema</Label>
                                <div className="flex">

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="icon" className="h-10 w-10">
                                                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                                                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                                                <span className="sr-only">Toggle theme</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                                Claro
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                                Oscuro
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setTheme("system")}>
                                                Sistema
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <Label className="mb-2 block">Color primario</Label>
                                <input
                                    type="color"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="w-24 h-10 rounded-md border" // Agregué rounded y border para mejor estética
                                />
                            </div>

                            <div className="flex flex-col">
                                <Label className="mb-2 block">Color secundario</Label>
                                <input
                                    type="color"
                                    value={secondaryColor}
                                    onChange={(e) => setSecondaryColor(e.target.value)}
                                    className="w-24 h-10 rounded-md border" />
                            </div>

                            <div>
                                <Label className="mb-2 block">Formato de fecha</Label>
                                <Select defaultValue={dateFormat} onValueChange={(v) => setDateFormat(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dateFormats.map(f => (
                                            <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <input id="showCents" type="checkbox" checked={showCents} onChange={(e) => setShowCents(e.target.checked)} />
                                <Label htmlFor="showCents">Mostrar céntimos</Label>
                            </div>

                            <div>
                                <Label className="mb-2 block">Inicio de semana</Label>
                                <Select defaultValue={startOfWeek} onValueChange={(v) => setStartOfWeek(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dayOptions.map(d => (
                                            <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="mb-2 block">Vista predeterminada</Label>
                                <Select defaultValue={defaultView} onValueChange={(v) => setDefaultView(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {viewOptions.map(v => (
                                            <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="md:col-span-3 mt-2">
                                <Button type="submit" asChild>
                                    <button onClick={handleSaveGeneral}><Save className="mr-2" /> Guardar Configuración</button>
                                </Button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'categories' && (
                        <div className="grid md:grid-cols-2 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Añadir Nueva Categoría</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div>
                                            <Label>Nombre</Label>
                                            <Input value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} />
                                        </div>

                                        <div>
                                            <Label>Color</Label>
                                            <input type="color" value={newCategory.color} onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })} />
                                        </div>

                                        <div>
                                            <Label>Icono</Label>
                                            <Select defaultValue={newCategory.icon} onValueChange={(v) => setNewCategory({ ...newCategory, icon: v })}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {iconOptions.map(ic => <SelectItem key={ic} value={ic}>{ic}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Button onClick={handleAddCategory}><Plus className="mr-2" /> Añadir Categoría</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Categorías Existentes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {categories.map(cat => (
                                            <div key={cat.id} className="flex items-center justify-between p-2 border rounded-md">
                                                <div className="flex items-center gap-3">
                                                    <div style={{ backgroundColor: cat.color }} className="w-6 h-6 rounded-full" />
                                                    <div>
                                                        <div className="font-medium">{cat.name} {cat.isDefault && <Badge>Predeterminada</Badge>}</div>
                                                        <div className="text-sm text-muted-foreground">Icono: {cat.icon}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => startEditCategory(cat)} disabled={editingCategory !== null}><Edit /></Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(cat.id)} disabled={cat.isDefault}><Trash2 /></Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {editingCategory && (
                                <Card className="md:col-span-2">
                                    <CardHeader>
                                        <CardTitle>Editar Categoría</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div>
                                                <Label>Nombre</Label>
                                                <Input value={editingCategory.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} />
                                            </div>
                                            <div>
                                                <Label>Color</Label>
                                                <input type="color" value={editingCategory.color} onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })} />
                                            </div>
                                            <div>
                                                <Label>Icono</Label>
                                                <Select defaultValue={editingCategory.icon} onValueChange={(v) => setEditingCategory({ ...editingCategory, icon: v })}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {iconOptions.map(ic => <SelectItem key={ic} value={ic}>{ic}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            <Button onClick={handleUpdateCategory}>Guardar Cambios</Button>
                                            <Button variant="outline" onClick={() => setEditingCategory(null)}>Cancelar</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}

                    {activeTab === 'accounts' && (
                        <div className="grid md:grid-cols-2 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Añadir Nueva Cuenta</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div>
                                            <Label>Nombre de la cuenta</Label>
                                            <Input value={newAccount.name} onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })} />
                                        </div>

                                        <div>
                                            <Label>Tipo de cuenta</Label>
                                            <Select defaultValue={newAccount.type} onValueChange={(v) => setNewAccount({ ...newAccount, type: v })}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {accountTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label>Moneda</Label>
                                            <Select defaultValue={newAccount.currency} onValueChange={(v) => setNewAccount({ ...newAccount, currency: v })}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {currencies.map(c => <SelectItem key={c.code} value={c.code}>{`${c.symbol} - ${c.code}`}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label>Saldo inicial</Label>
                                            <Input type="number" value={newAccount.balance} onChange={(e) => setNewAccount({ ...newAccount, balance: Number(e.target.value) })} />
                                        </div>

                                        <div>
                                            <Button onClick={handleAddAccount}><Plus className="mr-2" /> Añadir Cuenta</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default Settings;