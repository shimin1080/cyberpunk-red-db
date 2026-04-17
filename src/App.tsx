import React, { useState, useEffect, useMemo } from 'react';
import type { Item, ItemCategory } from './types';
import { INITIAL_CATEGORIES } from './data';
import { ItemCard } from './components/ItemCard';
import { ItemFormModal } from './components/ItemFormModal';
import { CategoryManageModal } from './components/CategoryManageModal';
import { ConfirmModal } from './components/ConfirmModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { FaPlus, FaSearch, FaList } from 'react-icons/fa';
import { db } from './firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, getDoc, writeBatch } from 'firebase/firestore';
import './App.css';

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'All'>('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [viewingItem, setViewingItem] = useState<Item | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  // Initialize Firestore and Listen for changes
  useEffect(() => {
    // Check and initialize categories if empty
    const initCategories = async () => {
      const catRef = doc(db, 'settings', 'categories');
      const docSnap = await getDoc(catRef);
      if (!docSnap.exists()) {
        await setDoc(catRef, { list: INITIAL_CATEGORIES });
      }
    };
    initCategories();

    // Listen for items
    const itemsRef = collection(db, 'items');
    const unsubscribeItems = onSnapshot(itemsRef, (snapshot) => {
      const fetchedItems: Item[] = [];
      snapshot.forEach((docSnap) => {
        fetchedItems.push({ id: docSnap.id, ...docSnap.data() } as Item);
      });
      setItems(fetchedItems);
      setLoading(false);
    });

    // Listen for categories
    const catRef = doc(db, 'settings', 'categories');
    const unsubscribeCat = onSnapshot(catRef, (docSnap) => {
      if (docSnap.exists()) {
        setCategories(docSnap.data().list);
      }
    });

    return () => {
      unsubscribeItems();
      unsubscribeCat();
    };
  }, []);

  // Item Handlers
  const handleSaveItem = async (newItem: Item) => {
    const itemRef = doc(db, 'items', newItem.id);
    await setDoc(itemRef, newItem);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    setItemToDelete(id);
  };

  const executeDeleteItem = async () => {
    if (itemToDelete) {
      await deleteDoc(doc(db, 'items', itemToDelete));
      setItemToDelete(null);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Category Handlers
  const handleAddCategory = async (cat: string) => {
    const newCats = [...categories, cat];
    await setDoc(doc(db, 'settings', 'categories'), { list: newCats });
  };

  const handleEditCategory = async (oldCat: string, newCat: string) => {
    const newCats = categories.map(c => c === oldCat ? newCat : c);
    await setDoc(doc(db, 'settings', 'categories'), { list: newCats });
    
    // Update all items
    const batch = writeBatch(db);
    items.forEach(item => {
      if (item.category === oldCat) {
        batch.update(doc(db, 'items', item.id), { category: newCat });
      }
    });
    await batch.commit();

    if (selectedCategory === oldCat) {
      setSelectedCategory(newCat);
    }
  };

  const handleDeleteCategory = async (cat: string) => {
    const newCats = categories.filter(c => c !== cat);
    await setDoc(doc(db, 'settings', 'categories'), { list: newCats });
    
    // Update all items
    const batch = writeBatch(db);
    items.forEach(item => {
      if (item.category === cat) {
        batch.update(doc(db, 'items', item.id), { category: 'Uncategorized' });
      }
    });
    await batch.commit();

    if (selectedCategory === cat) {
      setSelectedCategory('All');
    }
  };

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="glitch" data-text="CYBERPUNK RED DB">CYBERPUNK RED DB</h1>
        <p className="subtitle cyber-font">UNOFFICIAL ITEM DATABASE</p>
        <div style={{ color: 'var(--neon-yellow)', fontSize: '0.8rem', marginTop: '8px' }}>
          {loading ? 'SYNCING DATABASE...' : 'DATABASE SYNCED'}
        </div>
      </header>

      <main className="main-content">
        <div className="controls-section">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search items by name or description..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button className="btn primary add-btn" onClick={openAddModal}>
            <FaPlus /> ADD NEW ITEM
          </button>
          <button className="btn add-btn" onClick={() => setIsCategoryModalOpen(true)}>
            <FaList /> MANAGE CATEGORIES
          </button>
        </div>

        <div className="categories-filter">
          <button 
            className={`btn ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
          >
            ALL
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              className={`btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="items-grid">
          {loading && items.length === 0 ? (
            <div className="no-results cyber-font">CONNECTING TO MAINFRAME...</div>
          ) : filteredItems.length === 0 ? (
            <div className="no-results cyber-font">NO ITEMS FOUND.</div>
          ) : (
            filteredItems.map(item => (
              <ItemCard 
                key={item.id} 
                item={item} 
                onView={(i) => setViewingItem(i)}
                onEdit={openEditModal} 
                onDelete={handleDeleteItem} 
              />
            ))
          )}
        </div>
      </main>

      <ItemDetailModal 
        item={viewingItem}
        isOpen={!!viewingItem}
        onClose={() => setViewingItem(null)}
      />

      <ItemFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
        editingItem={editingItem}
        categories={categories}
      />

      <CategoryManageModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <ConfirmModal 
        isOpen={!!itemToDelete}
        message="本当にこのアイテムを削除しますか？"
        onConfirm={executeDeleteItem}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};

export default App;
