import React, { useState, useEffect, useMemo } from 'react';
import type { Item, ItemCategory } from './types';
import { INITIAL_DATA, INITIAL_CATEGORIES } from './data';
import { ItemCard } from './components/ItemCard';
import { ItemFormModal } from './components/ItemFormModal';
import { CategoryManageModal } from './components/CategoryManageModal';
import { ConfirmModal } from './components/ConfirmModal';
import { FaPlus, FaSearch, FaList } from 'react-icons/fa';
import './App.css';

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'All'>('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Load from local storage or use initial data
  useEffect(() => {
    const savedItems = localStorage.getItem('cyberpunk_red_items');
    if (savedItems && savedItems !== '[]') {
      setItems(JSON.parse(savedItems));
    } else {
      setItems(INITIAL_DATA);
      localStorage.setItem('cyberpunk_red_items', JSON.stringify(INITIAL_DATA));
    }

    const savedCategories = localStorage.getItem('cyberpunk_red_categories');
    if (savedCategories && savedCategories !== '[]') {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories(INITIAL_CATEGORIES);
      localStorage.setItem('cyberpunk_red_categories', JSON.stringify(INITIAL_CATEGORIES));
    }
  }, []);

  // Save to local storage whenever data changes
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('cyberpunk_red_items', JSON.stringify(items));
    }
  }, [items]);

  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem('cyberpunk_red_categories', JSON.stringify(categories));
    }
  }, [categories]);

  // Item Handlers
  const handleSaveItem = (newItem: Item) => {
    if (editingItem) {
      setItems(items.map(item => item.id === newItem.id ? newItem : item));
    } else {
      setItems([newItem, ...items]);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    setItemToDelete(id);
  };

  const executeDeleteItem = () => {
    if (itemToDelete) {
      setItems(items.filter(item => item.id !== itemToDelete));
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
  const handleAddCategory = (cat: string) => {
    setCategories([...categories, cat]);
  };

  const handleEditCategory = (oldCat: string, newCat: string) => {
    setCategories(categories.map(c => c === oldCat ? newCat : c));
    setItems(items.map(item => item.category === oldCat ? { ...item, category: newCat } : item));
    if (selectedCategory === oldCat) {
      setSelectedCategory(newCat);
    }
  };

  const handleDeleteCategory = (cat: string) => {
    setCategories(categories.filter(c => c !== cat));
    setItems(items.map(item => item.category === cat ? { ...item, category: 'Uncategorized' } : item));
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
          {filteredItems.map(item => (
            <ItemCard 
              key={item.id} 
              item={item} 
              onEdit={openEditModal} 
              onDelete={handleDeleteItem} 
            />
          ))}
          {filteredItems.length === 0 && (
            <div className="no-results cyber-font">NO ITEMS FOUND.</div>
          )}
        </div>
      </main>

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
