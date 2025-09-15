import { useSelector, useDispatch } from 'react-redux';
import {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
  selectCartItems,
  selectIsCartOpen,
  selectTotalItems,
  selectTotalPrice,
  selectTotalCO2Savings,
} from '../store/slices/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const items = useSelector(selectCartItems);
  const isOpen = useSelector(selectIsCartOpen);
  const totalItems = useSelector(selectTotalItems);
  const totalPrice = useSelector(selectTotalPrice);
  const totalCO2Savings = useSelector(selectTotalCO2Savings);
  
  // Actions
  const handleAddItem = (product) => dispatch(addItem(product));
  const handleRemoveItem = (productId) => dispatch(removeItem(productId));
  const handleUpdateQuantity = (productId, quantity) => 
    dispatch(updateQuantity({ productId, quantity }));
  const handleClearCart = () => dispatch(clearCart());
  const handleToggleCart = () => dispatch(toggleCart());
  const handleOpenCart = () => dispatch(openCart());
  const handleCloseCart = () => dispatch(closeCart());
  
  return {
    // State
    items,
    isOpen,
    totalItems,
    totalPrice,
    totalCO2Savings,
    
    // Actions
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    toggleCart: handleToggleCart,
    openCart: handleOpenCart,
    closeCart: handleCloseCart,
  };
};

export default useCart;
