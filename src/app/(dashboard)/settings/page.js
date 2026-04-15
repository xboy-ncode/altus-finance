"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import {
    Plus,
    Edit,
    Trash2,
    Moon,
    Sun,
    Monitor,
    Check,
    ShoppingCart,
    Car,
    Home,
    Lightbulb,
    Pill,
    Coffee,
    DollarSign,
    CreditCard,
    Landmark,
    BookOpen,
    Tag,
    Heart,
    Star,
    MoreHorizontal,
    ShoppingBag,
    Palette,
    Settings,
    Globe,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { useTheme } from 'next-themes';
import { useSettings, THEME_PRESETS } from '@/app/components/contexts/SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PageLoader from '@/app/components/ui/page-loader';

// ─── Icon Map ──────────────────────────────────────
const ICON_MAP = {
    'shopping-cart': { icon: ShoppingCart, label: 'Carrito' },
    'car': { icon: Car, label: 'Coche' },
    'home': { icon: Home, label: 'Casa' },
    'bulb': { icon: Lightbulb, label: 'Bombilla' },
    'medicine-box': { icon: Pill, label: 'Medicina' },
    'coffee': { icon: Coffee, label: 'Café' },
    'dollar': { icon: DollarSign, label: 'Dinero' },
    'credit-card': { icon: CreditCard, label: 'Tarjeta' },
    'bank': { icon: Landmark, label: 'Banco' },
    'book': { icon: BookOpen, label: 'Libro' },
    'tag': { icon: Tag, label: 'Etiqueta' },
    'heart': { icon: Heart, label: 'Corazón' },
    'star': { icon: Star, label: 'Estrella' },
    'ellipsis': { icon: MoreHorizontal, label: 'Otros' },
    'shopping': { icon: ShoppingBag, label: 'Compras' },
    'play-circle': { icon: Star, label: 'Entretenimiento' },
};

function getCategoryIcon(iconName) {
    const entry = ICON_MAP[iconName];
    return entry ? entry.icon : Tag;
}

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const {
        settings,
        updateSetting,
        lastSaved,
        CURRENCY_MAP,
    } = useSettings();
    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState('general');
    const [showSavedIndicator, setShowSavedIndicator] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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
        { id: 9, name: 'Otros', color: '#81B29A', icon: 'ellipsis', isDefault: true },
    ]);
    const [newCategory, setNewCategory] = useState({ name: '', color: '#1890ff', icon: 'tag' });
    const [editingCategory, setEditingCategory] = useState(null);

    const currencies = [
        { code: 'USD', symbol: '$', name: 'Dólar estadounidense' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'MXN', symbol: '$', name: 'Peso mexicano' },
    ];

    const languages = [
        { code: 'es', name: 'Español' },
        { code: 'en', name: 'English' },
    ];

    const dateFormats = [
        { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
        { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    ];

    // Show "saved" indicator when lastSaved updates
    useEffect(() => {
        if (lastSaved) {
            setShowSavedIndicator(true);
            const timer = setTimeout(() => setShowSavedIndicator(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [lastSaved]);

    const handleAddCategory = () => {
        if (!newCategory.name.trim()) return;
        setCategories([...categories, { id: Date.now(), ...newCategory, isDefault: false }]);
        setNewCategory({ name: '', color: '#1890ff', icon: 'tag' });
    };

    const handleDeleteCategory = (categoryId) => {
        if (categories.find(c => c.id === categoryId)?.isDefault) return;
        setCategories(categories.filter(c => c.id !== categoryId));
    };
const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.name.trim()) return;
    setCategories(categories.map(c => (c.id === editingCategory.id ? editingCategory : c)));
    setEditingCategory(null);
};

if (!mounted) return null;

    const tabs = [
        { id: 'general', label: t('settings.tabGeneral'), icon: Settings },
        { id: 'themes', label: t('settings.tabThemes'), icon: Palette },
        { id: 'categories', label: t('settings.tabCategories'), icon: Tag },
    ];

    return (
        <PageLoader loading={isLoading} message={t('common.loading')}>
            <div className="p-6 max-w-5xl mx-auto space-y-6 pb-20">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/80 to-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                            <Settings className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h1>
                            <p className="text-sm text-muted-foreground">{t('settings.subtitle')}</p>
                        </div>
                    </div>

                    {/* Auto-save indicator */}
                    <AnimatePresence>
                        {showSavedIndicator && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg"
                            >
                                <Check className="h-4 w-4" />
                                <span>{t('common.savedAuto')}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <Card className="shadow-sm">
                    <CardContent className="pt-6">
                        {/* Tab Navigation */}
                        <div className="flex gap-1 mb-6 border-b pb-3 overflow-x-auto hide-scrollbar">
                            {tabs.map(tab => {
                                const Icon = tab.icon;
                                return (
                                    <Button
                                        key={tab.id}
                                        variant={activeTab === tab.id ? 'default' : 'ghost'}
                                        onClick={() => setActiveTab(tab.id)}
                                        className="gap-2"
                                    >
                                        <Icon className="h-4 w-4" />
                                        {tab.label}
                                    </Button>
                                );
                            })}
                        </div>

                        {/* ─── General Tab ──────────────────────────── */}
                        {activeTab === 'general' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Language */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                        {t('settings.language')}
                                    </Label>
                                    <Select value={settings.language} onValueChange={v => updateSetting('language', v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {languages.map(l => <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Currency */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        {t('settings.currency')}
                                    </Label>
                                    <Select value={settings.currency} onValueChange={v => updateSetting('currency', v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {currencies.map(c => (
                                                <SelectItem key={c.code} value={c.code}>{`${c.symbol} - ${c.code} (${c.name})`}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Theme (light/dark) */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        {theme === 'dark' ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
                                        {t('settings.mode')}
                                    </Label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full justify-between">
                                                <span>{theme === 'dark' ? t('settings.modeDark') : theme === 'light' ? t('settings.modeLight') : t('settings.modeSystem')}</span>
                                                <Sun className="h-4 w-4 dark:hidden" />
                                                <Moon className="h-4 w-4 hidden dark:block" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2"><Sun className="h-4 w-4" /> {t('settings.modeLight')}</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2"><Moon className="h-4 w-4" /> {t('settings.modeDark')}</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2"><Monitor className="h-4 w-4" /> {t('settings.modeSystem')}</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Date Format */}
                                <div className="space-y-2">
                                    <Label>{t('settings.dateFormat')}</Label>
                                    <Select value={settings.dateFormat} onValueChange={v => updateSetting('dateFormat', v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {dateFormats.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Show Cents */}
                                <div className="flex items-center justify-between space-x-4 pt-6">
                                    <Label htmlFor="showCents">{t('settings.showCents')}</Label>
                                    <Switch
                                        id="showCents"
                                        checked={settings.showCents}
                                        onCheckedChange={v => updateSetting('showCents', v)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* ─── Themes Tab (Presets) ─────────────────── */}
                        {activeTab === 'themes' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">{t('settings.themesTitle')}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{t('settings.themesSubtitle')}</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Object.entries(THEME_PRESETS).map(([key, preset]) => {
                                        const isActive = settings.colorTheme === key;
                                        return (
                                            <motion.div
                                                key={key}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Card
                                                    className={`cursor-pointer transition-all duration-200 ${
                                                        isActive
                                                            ? 'ring-2 ring-primary shadow-lg'
                                                            : 'hover:shadow-md border-border/50'
                                                    }`}
                                                    onClick={() => updateSetting('colorTheme', key)}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className="w-10 h-10 rounded-xl shadow-inner"
                                                                    style={{ backgroundColor: preset.swatch }}
                                                                />
                                                                <div>
                                                                    <p className="font-semibold text-sm">{preset.label}</p>
                                                                    <p className="text-xs text-muted-foreground">{preset.name}</p>
                                                                </div>
                                                            </div>
                                                            {isActive && (
                                                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                                                    <Check className="h-3.5 w-3.5 text-primary-foreground" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        {/* Color swatches preview */}
                                                        <div className="flex gap-1.5">
                                                            {[preset.chart1, preset.chart2, preset.chart3].map((c, i) => (
                                                                <div
                                                                    key={i}
                                                                    className="h-2 flex-1 rounded-full"
                                                                    style={{ background: c }}
                                                                />
                                                            ))}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ─── Categories Tab ───────────────────────── */}
                        {activeTab === 'categories' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Add New Category */}
                                <Card className="border shadow-none">
                                    <CardHeader><CardTitle className="text-lg">{t('settings.newCategory')}</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>{t('settings.name')}</Label>
                                            <Input
                                                value={newCategory.name}
                                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                                placeholder="Ej: Mascota"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('settings.color')}</Label>
                                            <input
                                                type="color"
                                                value={newCategory.color}
                                                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                                                className="w-full h-10 rounded-md border p-1 cursor-pointer"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('settings.icon')}</Label>
                                            <Select value={newCategory.icon} onValueChange={(v) => setNewCategory({ ...newCategory, icon: v })}>
                                                <SelectTrigger>
                                                    <SelectValue>
                                                        {(() => {
                                                            const entry = ICON_MAP[newCategory.icon];
                                                            if (!entry) return newCategory.icon;
                                                            const IconComp = entry.icon;
                                                            return (
                                                                <div className="flex items-center gap-2">
                                                                    <IconComp className="h-4 w-4" />
                                                                    <span>{entry.label}</span>
                                                                </div>
                                                            );
                                                        })()}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(ICON_MAP).map(([key, entry]) => {
                                                        const IconComp = entry.icon;
                                                        return (
                                                            <SelectItem key={key} value={key}>
                                                                <div className="flex items-center gap-2">
                                                                    <IconComp className="h-4 w-4" />
                                                                    <span>{entry.label}</span>
                                                                </div>
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button onClick={handleAddCategory} className="w-full gap-2">
                                            <Plus className="h-4 w-4" />
                                            {t('settings.addCategory')}
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Existing Categories */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold px-1">{t('settings.existingCategories')}</h3>
                                    <div className="grid gap-2 max-h-[500px] overflow-y-auto pr-2">
                                        {categories.map(cat => {
                                            const CatIcon = getCategoryIcon(cat.icon);
                                            return (
                                                <div key={cat.id} className="flex items-center justify-between p-3 border rounded-lg bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-9 h-9 rounded-lg flex items-center justify-center"
                                                            style={{ backgroundColor: cat.color + '20' }}
                                                        >
                                                            <CatIcon className="h-4 w-4" style={{ color: cat.color }} />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium flex items-center gap-2 text-sm">
                                                                {cat.name}
                                                                {cat.isDefault && <Badge variant="secondary" className="text-[10px]">Auto</Badge>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => setEditingCategory({ ...cat })}
                                                            disabled={editingCategory !== null}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                                            onClick={() => handleDeleteCategory(cat.id)}
                                                            disabled={cat.isDefault}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Edit inline */}
                                    <AnimatePresence>
                                        {editingCategory && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                            >
                                                <Card className="border-primary/50 border-2 shadow-md">
                                                    <CardHeader><CardTitle className="text-sm">{t('settings.editingCategory')}: {editingCategory.name}</CardTitle></CardHeader>
                                                    <CardContent className="space-y-3">
                                                        <Input
                                                            value={editingCategory.name}
                                                            onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                                        />
                                                        <input
                                                            type="color"
                                                            value={editingCategory.color}
                                                            onChange={e => setEditingCategory({ ...editingCategory, color: e.target.value })}
                                                            className="w-full h-8 rounded border p-1"
                                                        />
                                                        <Select value={editingCategory.icon} onValueChange={v => setEditingCategory({ ...editingCategory, icon: v })}>
                                                            <SelectTrigger>
                                                                <SelectValue>
                                                                    {(() => {
                                                                        const entry = ICON_MAP[editingCategory.icon];
                                                                        if (!entry) return editingCategory.icon;
                                                                        const IC = entry.icon;
                                                                        return (
                                                                            <div className="flex items-center gap-2">
                                                                                <IC className="h-4 w-4" />
                                                                                <span>{entry.label}</span>
                                                                            </div>
                                                                        );
                                                                    })()}
                                                                </SelectValue>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Object.entries(ICON_MAP).map(([key, entry]) => {
                                                                    const IC = entry.icon;
                                                                    return (
                                                                        <SelectItem key={key} value={key}>
                                                                            <div className="flex items-center gap-2">
                                                                                <IC className="h-4 w-4" />
                                                                                <span>{entry.label}</span>
                                                                            </div>
                                                                        </SelectItem>
                                                                    );
                                                                })}
                                                            </SelectContent>
                                                        </Select>
                                                        <div className="flex gap-2">
                                                            <Button variant="outline" className="flex-1" onClick={() => setEditingCategory(null)}>{t('common.cancel')}</Button>
                                                            <Button className="flex-1" onClick={handleUpdateCategory}>{t('common.save')}</Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </PageLoader>
    );
}