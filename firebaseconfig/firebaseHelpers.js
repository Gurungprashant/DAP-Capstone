import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { storage } from './firebaseConfig'; // Ensure this path is correct

// Function to fetch products from a specific category and subcategory
export const fetchProducts = async (categoryId, subCategoryId) => {
  try {
    const productsCollection = collection(db, 'categories', categoryId, 'subcategories', subCategoryId, 'products');
    const querySnapshot = await getDocs(productsCollection);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Function to fetch user's wishlist
export const fetchWishlist = async (userId) => {
  try {
    const docRef = doc(db, 'wishlists', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().products || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

// Function to update user's wishlist
export const updateWishlist = async (userId, wishlist) => {
  try {
    const filteredWishlist = wishlist.filter(item => item.categoryId && item.subCategoryId && item.productId);
    const docRef = doc(db, 'wishlists', userId);
    await setDoc(docRef, { products: filteredWishlist }, { merge: true });
  } catch (error) {
    console.error('Error updating wishlist:', error);
    throw error;
  }
};

// Function to fetch a product by its ID, categoryId, and subCategoryId
export const fetchProductById = async (categoryId, subCategoryId, productId) => {
  try {
    const productRef = doc(db, 'categories', categoryId, 'subcategories', subCategoryId, 'products', productId);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      return { id: productSnap.id, ...productSnap.data(), categoryId, subCategoryId };
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Function to fetch all categories
export const fetchCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Function to fetch subcategories for a given category
export const fetchSubCategories = async (categoryId) => {
  try {
    const subCategoryCollection = collection(db, 'categories', categoryId, 'subcategories');
    const querySnapshot = await getDocs(subCategoryCollection);
    const subCategories = [];
    querySnapshot.forEach((doc) => {
      subCategories.push({ id: doc.id, ...doc.data() });
    });
    return subCategories;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
};

// Function to fetch images from the 'images' collection
export const fetchImages = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'images'));
    const images = [];
    querySnapshot.forEach((doc) => {
      images.push({ id: doc.id, url: doc.data().url });
    });
    console.log('Fetched images:', images); // Log fetched images
    return images;
  } catch (error) {
    console.error('Error fetching images:', error); // Log any errors
    throw error;
  }
};

// Function to fetch cart items for a specific user with real-time updates
export const fetchCartItems = async (userId, setCartItems) => {
  try {
    const unsubscribe = onSnapshot(collection(db, `carts/${userId}/items`), (querySnapshot) => {
      const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCartItems(items);
    });

    return unsubscribe; // Return unsubscribe function to stop listening later
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};

// Function to add or update an item in the cart
export const addToCart = async (userId, item) => {
  try {
    const cartItemRef = doc(db, `carts/${userId}/items`, item.id);
    await setDoc(cartItemRef, item);
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

// Function to update the quantity of a cart item
export const updateCartItemQuantity = async (userId, itemId, quantity) => {
  try {
    const cartItemRef = doc(db, `carts/${userId}/items`, itemId);
    await updateDoc(cartItemRef, { quantity });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
};

// Function to delete an item from the cart
export const deleteCartItem = async (userId, itemId) => {
  try {
    const cartItemRef = doc(db, `carts/${userId}/items`, itemId);
    await deleteDoc(cartItemRef);
  } catch (error) {
    console.error('Error deleting cart item:', error);
    throw error;
  }
};

// Function to upload a profile image to Firebase Storage
export const uploadProfileImage = async (userId, uri) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const imageRef = ref(storage, `profileImages/${userId}`);
    await uploadBytes(imageRef, blob);
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

// Function to fetch the profile image URL for a user
export const fetchProfileImage = async (userId) => {
  try {
    const imageRef = ref(storage, `profileImages/${userId}`);
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error('Error fetching profile image:', error);
    throw new Error('Profile image not found');
  }
};