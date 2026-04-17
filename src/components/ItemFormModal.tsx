import React, { useState, useEffect } from 'react';
import type { Item, ItemCategory } from '../types';
import { v4 as uuidv4 } from 'uuid';
import './ItemFormModal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Item) => void;
  editingItem: Item | null;
  categories: string[];
}

export const ItemFormModal: React.FC<Props> = ({ isOpen, onClose, onSave, editingItem, categories }) => {
  const [formData, setFormData] = useState<Partial<Item>>({
    name: '',
    category: 'Weapon',
    price: '',
    description: '',
    stats: {}
  });
  
  const [statsInput, setStatsInput] = useState<string>('');

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
      if (editingItem.stats) {
        // Convert stats object to multiline string for simple editing
        const statsStr = Object.entries(editingItem.stats)
          .map(([k, v]) => `${k}:${v}`)
          .join('\n');
        setStatsInput(statsStr);
      } else {
        setStatsInput('');
      }
    } else {
      setFormData({
        name: '',
        category: 'Weapon',
        price: '',
        description: '',
        stats: {}
      });
      setStatsInput('');
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Parse stats
    const parsedStats: Record<string, string | number> = {};
    if (statsInput.trim()) {
      statsInput.split('\n').forEach(line => {
        const [k, v] = line.split(':');
        if (k && v) {
          const val = v.trim();
          parsedStats[k.trim()] = isNaN(Number(val)) ? val : Number(val);
        }
      });
    }

    const newItem: Item = {
      id: editingItem ? editingItem.id : uuidv4(),
      name: formData.name || 'Unnamed',
      category: formData.category as ItemCategory || 'Gear',
      price: formData.price || '0eb',
      description: formData.description || '',
      stats: Object.keys(parsedStats).length > 0 ? parsedStats : undefined
    };

    onSave(newItem);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="cyber-font">{editingItem ? 'EDIT ITEM' : 'ADD NEW ITEM'}</h2>
        
        <div className="form-group">
          <label>Name</label>
          <input className="input-field" name="name" value={formData.name || ''} onChange={handleChange} placeholder="Item Name" />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select className="input-field" name="category" value={formData.category} onChange={handleChange}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Price</label>
          <input className="input-field" name="price" value={formData.price || ''} onChange={handleChange} placeholder="e.g. 100eb (Premium)" />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea className="input-field" name="description" value={formData.description || ''} onChange={handleChange} placeholder="Description" rows={3} />
        </div>

        <div className="form-group">
          <label>Stats (Optional) - format "key:value" per line</label>
          <textarea className="input-field" value={statsInput} onChange={(e) => setStatsInput(e.target.value)} placeholder="damage:3d6&#10;rof:2" rows={3} />
        </div>

        <div className="modal-actions">
          <button className="btn primary" onClick={handleSave}>Save</button>
          <button className="btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
