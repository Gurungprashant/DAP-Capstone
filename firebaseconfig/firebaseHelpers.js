import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Function to fetch products
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
