import { createSlice } from '@reduxjs/toolkit';
import { databaseConfig } from '../../lib/config/database.config';

// Helper function to load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem(databaseConfig.storage.cart);
    if (serializedCart === null) {
      return [];
    }
    return JSON.parse(serializedCart);
  } catch (err) {
    return [];
  }
};

// Helper function to save cart to localStorage
const saveCartToStorage = (items) => {
  try {
    const serializedCart = JSON.stringify(items);
    localStorage.setItem(databaseConfig.storage.cart, serializedCart);
  } catch (err) {
    // Ignore write errors
  }
};

const initialState = {
  items: loadCartFromStorage(),
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      
      saveCartToStorage(state.items);
    },
    
    removeItem: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      saveCartToStorage(state.items);
    },
    
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        state.items = state.items.filter(item => item.id !== productId);
      } else {
        const item = state.items.find(item => item.id === productId);
        if (item) {
          item.quantity = quantity;
        }
      }
      
      saveCartToStorage(state.items);
    },
    
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
    
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    
    openCart: (state) => {
      state.isOpen = true;
    },
    
    closeCart: (state) => {
      state.isOpen = false;
    },
  },
});

// Action creators
export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectIsCartOpen = (state) => state.cart.isOpen;

export const selectTotalItems = (state) => 
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectTotalPrice = (state) => 
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

export const selectTotalCO2Savings = (state) => 
  state.cart.items.reduce((total, item) => total + ((item.co2Savings || 0) * item.quantity), 0);

export default cartSlice.reducer;