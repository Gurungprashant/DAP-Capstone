import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchWishlist, updateWishlist } from '../firebaseconfig/firebaseHelpers';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        loadWishlist(user.uid);
      }
    });
    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const loadWishlist = async (uid) => {
    try {
      const wishlistFromFirebase = await fetchWishlist(uid);
      setWishlist(wishlistFromFirebase);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const toggleWishlistItem = async (item) => {
    if (!item.categoryId || !item.subCategoryId || !item.productId) {
      console.error('Invalid item data', item);
      return;
    }

    const isInWishlist = wishlist.some(wishlistItem => wishlistItem.productId === item.productId);
    const updatedWishlist = isInWishlist
      ? wishlist.filter(wishlistItem => wishlistItem.productId !== item.productId)
      : [...wishlist, item];

    setWishlist(updatedWishlist);
    if (userId) {
      await updateWishlist(userId, updatedWishlist);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlistItem }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  return useContext(WishlistContext);
};
