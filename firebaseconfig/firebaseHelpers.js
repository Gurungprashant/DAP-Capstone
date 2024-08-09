import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot, addDoc, getFirestore, writeBatch } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { db } from './firebaseConfig';
import { storage } from './firebaseConfig'; 

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
    console.log('Fetched images:', images);
    return images;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

export const fetchCartItems = async (userId, setCartItems) => {
  try {
    const unsubscribe = onSnapshot(collection(db, `carts/${userId}/items`), (querySnapshot) => {
      const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCartItems(items);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};

export const addToCart = async (userId, cartItem) => {
  try {
    if (!userId || !cartItem || !cartItem.id || !cartItem.name || !cartItem.price || !cartItem.quantity) {
      throw new Error('Invalid cart item data');
    }

    const cartDocRef = doc(db, 'carts', userId);
    const itemDocRef = doc(cartDocRef, 'items', cartItem.id);

    const cartItemData = {
      id: cartItem.id || '',
      name: cartItem.name || '',
      price: parseFloat(cartItem.price) || 0,
      quantity: cartItem.quantity || 1,
      categoryId: cartItem.categoryId || null,
      subCategoryId: cartItem.subCategoryId || null,
      imageUrl: cartItem.imageUrl || 'https://via.placeholder.com/80',
    };

    await setDoc(itemDocRef, cartItemData, { merge: true });
    console.log('Cart item added successfully');
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateCartItemQuantity = async (userId, itemId, quantity) => {
  try {
    const cartItemRef = doc(db, `carts/${userId}/items`, itemId);
    await updateDoc(cartItemRef, { quantity });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
};


export const deleteCartItem = async (userId, itemId) => {
  try {
    const cartItemRef = doc(db, `carts/${userId}/items`, itemId);
    await deleteDoc(cartItemRef);
  } catch (error) {
    console.error('Error deleting cart item:', error);
    throw error;
  }
};

export const removePurchasedItemsFromCart = async (userId, cartItems) => {
  const db = getFirestore();
  const batch = writeBatch(db);

  cartItems.forEach(item => {
    const itemRef = doc(db, `carts/${userId}/items`, item.id);
    batch.delete(itemRef);
  });

  try {
    await batch.commit();
    console.log('Successfully removed purchased items from cart');
  } catch (error) {
    console.error('Error removing purchased items from cart:', error);
  }
};

export const uploadProfileImage = async (userId, uri) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, `profileImages/${userId}`);

  try {
    await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image.');
  }
};

export const fetchProfileImage = async (userId) => {
  const storageRef = ref(storage, `profileImages/${userId}`);

  try {
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    if (error.code === 'storage/object-not-found') {
      console.log('Profile image not found, using default user icon.');
      return defaultProfileImageUrl;
    } else {
      console.error('Error fetching profile image:', error);
      throw new Error('Failed to fetch profile image.');
    }
  }
};

export const removeProfileImage = async (userId) => {
  const storageRef = ref(storage, `profileImages/${userId}`);

  try {
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error removing profile image:', error);
    throw new Error('Failed to remove profile image.');
  }
};

export const fetchOrderHistory = async (userId) => {
  try {
    const ordersCollection = collection(db, 'orders');
    const querySnapshot = await getDocs(ordersCollection);
    const orders = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().userId === userId) {
        orders.push({ id: doc.id, ...doc.data() });
      }
    });
    return orders;
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error;
  }
};

export const saveOrderToFirebase = async (userId, orderDetails) => {
  try {
    const ordersCollection = collection(db, 'orders');
    await addDoc(ordersCollection, {
      userId,
      items: orderDetails.items,
      total: orderDetails.total,
      date: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error saving order to Firebase:', error);
    throw new Error('Failed to save order.');
  }
};


export async function fetchNewOffers() {
  try {
    const offersCollection = collection(db, 'newOffers');
    const offersSnapshot = await getDocs(offersCollection);
    const offersList = offersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return offersList;
  } catch (error) {
    console.error('Error fetching new offers:', error);
    throw error;
  }
}

export async function fetchProductsByOfferId(offerId) {
  try {

    const offerDoc = await getDoc(doc(db, 'newOffers', offerId));
    const offerData = offerDoc.data();

    if (!offerData || !Array.isArray(offerData.products)) {
      console.warn('No products found for the offer ID:', offerId);
      return [];
    }

    const productIds = offerData.products;
    const productsCollection = collection(db, 'products');

    const productQueries = productIds.map(productId => 
      doc(productsCollection, productId)
    );

    const productSnapshots = await Promise.all(productQueries.map(docRef => getDoc(docRef)));

    const productsList = productSnapshots.map(snapshot => {
      if (snapshot.exists()) {
        return {
          id: snapshot.id,
          ...snapshot.data(),
        };
      } else {
        console.warn('Product not found:', snapshot.id);
        return null;
      }
    }).filter(product => product !== null);

    return productsList;
  } catch (error) {
    console.error('Error fetching products by offer ID:', error);
    throw error;
  }
}

export async function retrieveProducts() {
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const productsList = productsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        imageUrl: Array.isArray(data.imageUrl) && data.imageUrl.length > 0 ? data.imageUrl[0] : null,
      };
    });
    console.log('Fetched Products:', productsList);
    return productsList;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export const defaultProfileImageUrl = 'https://firebasestorage.googleapis.com/v0/b/capstone-project-1234f.appspot.com/o/defaultUserImage%2Fdefault-profile.png?alt=media&token=18cb2658-1ac2-4056-816c-5fb865c23d40';