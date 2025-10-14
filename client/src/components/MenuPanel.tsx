
import React from 'react';
import MenuItem from './MenuItem';
import './MenuPanel.css';
import { useShoppingCart } from '../contexts/ShoppingCart';

const MenuPanel = () => {
    const menuItems = [
        { id: 1, name: '#1 Combo', price: 10.00, image: 'https://placehold.co/200x150/d3a47c/ffffff?text=Sandwich+1' },
        { id: 2, name: '#2 Combo', price: 10.50, image: 'https://placehold.co/200x150/bca28e/ffffff?text=Sandwich+2' },
        { id: 3, name: '#3 Combo', price: 9.50, image: 'https://placehold.co/200x150/e9c898/ffffff?text=Grilled+Cheese' },
        { id: 4, name: '#4 Combo', price: 11.00, image: 'https://placehold.co/200x150/c5a78c/ffffff?text=Baguette' },
        { id: 5, name: '#5 Combo', price: 12.00, image: 'https://placehold.co/200x150/d3b59f/ffffff?text=Sub' },
        { id: 6, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 7, name: 'Grab & Go', count: 10, color: '#16a34a' },
        { id: 8, name: 'Discounts', icon: '%', color: '#16a34a' },
        { id: 9, name: 'Sides', icon: 'sides', color: '#f97316' },
        { id: 10, name: 'Custom amount', icon: 'custom', color: '#f5f5f5' },
        { id: 11, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 12, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 13, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 14, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 15, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 16, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 17, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 18, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 19, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 20, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 21, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 22, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 23, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 24, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 25, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 26, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 27, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 28, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 29, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 30, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 31, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 32, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 33, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 34, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 35, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 36, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 37, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 38, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 39, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 40, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 41, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
        { id: 42, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },

    ];


    return (
        <div id="menu-panel">
            <div id="menu-grid">
                {menuItems.map(item => <MenuItem key={item.id} item={item} />)}
            </div>
        </div>
    );
};

export default MenuPanel;