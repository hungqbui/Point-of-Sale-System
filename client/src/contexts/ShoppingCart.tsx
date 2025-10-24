import { createContext, useContext }  from 'react';
import { useState } from 'react';
import type { MenuItem } from '../types/MenuItem';

interface CartItem extends MenuItem {
    quantity: number;
}

interface ShoppingCartContextType {
    items: Record<string, CartItem>;
    addItem: (item: MenuItem) => void;
    removeItem: (itemId: string) => void;
    clearCart: () => void;
    adjustQuantity: (itemId: string, delta: number) => void;
    total: number;
    tax: number;
    grandTotal: number;
}
const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<Record<string, CartItem>>({});
    const addItem = (item: MenuItem) => { 
        setItems((prev) => {
            console.log('addItem called with:', item);
            const itemId = String(item.MenuItemID);
            if (itemId in prev) {
                const temp = { ...prev };
                temp[itemId] = {
                    ...temp[itemId],
                    quantity: temp[itemId].quantity + 1
                };
                return temp;
            } else {
                return { ...prev, [itemId]: { ...item, quantity: 1 } };
            }
        });
        const itemPrice = parseFloat(item.Price);
        if (!itemPrice) return;
        setTotal(total + itemPrice);
        setTax((total + itemPrice) * 0.1); // Example: 10% tax
        setGrandTotal(total + itemPrice + (total + itemPrice) * 0.1); 
     };
    const removeItem = (itemId: string) => { 
        setItems((prev) => {
            if (!(itemId in prev)) return prev;
            const newItems = { ...prev };
            delete newItems[itemId];
            return newItems;
        });
        const item = items[itemId];
        if (!item || !item.Price) {
            return;
        }
        const itemPrice = parseFloat(item.Price);
        setTotal(total - itemPrice);
        setTax((total - itemPrice) * 0.1); // Example: 10% tax
        setGrandTotal(total - itemPrice + (total - itemPrice) * 0.1);
     }
    const clearCart = () => {
        setItems({});
        setTotal(0);
        setTax(0);
        setGrandTotal(0);
    };
    const adjustQuantity = (itemId: string, delta: number) => {
        setItems((prev) => {
            if (!(itemId in prev)) return prev;
            const newItems = { ...prev };
            const item = newItems[itemId];
            if (!item || !item.Price) {
                return newItems;
            }
            newItems[itemId] = {
                ...newItems[itemId],
                quantity: newItems[itemId].quantity + delta
            };
            if (newItems[itemId].quantity <= 0) {
                delete newItems[itemId];
            }
            const itemPrice = parseFloat(item.Price);
            console.log(total, grandTotal, tax, delta, itemPrice, item);
            setTax((total + delta * itemPrice) * 0.1); // Example: 10% tax
            setGrandTotal((total + delta * itemPrice) * 1.1);
            setTotal(total + delta * itemPrice);
            
            
            return newItems;

        });
    };

    const [total, setTotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);

    return (
        <ShoppingCartContext.Provider value={{ items, addItem, removeItem, clearCart, adjustQuantity, total, tax, grandTotal }}>
            {children}
        </ShoppingCartContext.Provider>
    );
};

export const useShoppingCart = (): ShoppingCartContextType => {
    const context = useContext(ShoppingCartContext);
    if (!context) {
        throw new Error('useShoppingCart must be used within a ShoppingCartProvider');
    }
    return context;
};
