import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from './firebaseConfig';

export const fetchCategories = async () => {
  const querySnapshot = await getDocs(collection(db, 'categories'));
  const categories = [];
  querySnapshot.forEach((doc) => {
    categories.push({ id: doc.id, ...doc.data() });
  });
  return categories;
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
