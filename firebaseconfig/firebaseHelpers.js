import { collection, getDocs, doc, getDoc, where, query } from "firebase/firestore";
import { db } from './firebaseConfig';

export const fetchCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    console.log('Fetched categories:', categories); // Log fetched categories
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error); // Log any errors
    throw error;
  }
};

export const fetchSubCategories = async (categoryId) => {
  const subCategoryCollection = collection(db, 'categories', categoryId, 'subcategories');
  const querySnapshot = await getDocs(subCategoryCollection);
  const subCategories = [];
  querySnapshot.forEach((doc) => {
    subCategories.push({ id: doc.id, ...doc.data() });
  });
  return subCategories;
};

export const fetchProducts = async (categoryId, subCategoryId) => {
  try {
    const productsCollection = collection(db, 'categories', categoryId, 'subcategories', subCategoryId, 'products');
    const querySnapshot = await getDocs(productsCollection);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    console.log('Fetched products:', products); // Log fetched products
    return products;
  } catch (error) {
    console.error('Error fetching products:', error); // Log any errors
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
