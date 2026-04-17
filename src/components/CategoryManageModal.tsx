import React, { useState } from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaPlus } from 'react-icons/fa';
import { ConfirmModal } from './ConfirmModal';
import './ItemFormModal.css';
import './CategoryManageModal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onAddCategory: (cat: string) => void;
  onEditCategory: (oldCat: string, newCat: string) => void;
  onDeleteCategory: (cat: string) => void;
}

export const CategoryManageModal: React.FC<Props> = ({ isOpen, onClose, categories, onAddCategory, onEditCategory, onDeleteCategory }) => {
  const [newCatInput, setNewCatInput] = useState('');
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editInput, setEditInput] = useState('');
  const [catToDelete, setCatToDelete] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAdd = () => {
    const trimmed = newCatInput.trim();
    if (trimmed && !categories.includes(trimmed)) {
      onAddCategory(trimmed);
      setNewCatInput('');
    }
  };

  const startEdit = (cat: string) => {
    setEditingCat(cat);
    setEditInput(cat);
  };

  const saveEdit = (oldCat: string) => {
    const trimmed = editInput.trim();
    if (trimmed && trimmed !== oldCat && !categories.includes(trimmed)) {
      onEditCategory(oldCat, trimmed);
    }
    setEditingCat(null);
  };

  const handleDelete = (cat: string) => {
    setCatToDelete(cat);
  };

  const executeDelete = () => {
    if (catToDelete) {
      onDeleteCategory(catToDelete);
      setCatToDelete(null);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content category-modal-content">
        <h2 className="cyber-font">MANAGE CATEGORIES</h2>

        <div className="add-category-row">
          <input 
            className="input-field" 
            placeholder="New category name..." 
            value={newCatInput} 
            onChange={(e) => setNewCatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button className="btn primary" onClick={handleAdd}><FaPlus /> ADD</button>
        </div>

        <div className="category-list">
          {categories.map(cat => (
            <div key={cat} className="category-item">
              {editingCat === cat ? (
                <div className="category-edit-mode">
                  <input 
                    className="input-field" 
                    value={editInput} 
                    onChange={(e) => setEditInput(e.target.value)} 
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(cat);
                      if (e.key === 'Escape') setEditingCat(null);
                    }}
                  />
                  <button className="btn primary icon-btn" onClick={() => saveEdit(cat)}><FaCheck /></button>
                  <button className="btn icon-btn" onClick={() => setEditingCat(null)}><FaTimes /></button>
                </div>
              ) : (
                <>
                  <span className="category-name cyber-font">{cat}</span>
                  {cat !== 'Uncategorized' && (
                    <div className="category-actions">
                      <button className="btn icon-btn" onClick={() => startEdit(cat)}><FaEdit /></button>
                      <button className="btn danger icon-btn" onClick={() => handleDelete(cat)}><FaTrash /></button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
      
      <ConfirmModal 
        isOpen={!!catToDelete}
        message={`カテゴリ '${catToDelete}' を本当に削除しますか？\n（含まれるアイテムは 'Uncategorized' に移動します）`}
        onConfirm={executeDelete}
        onCancel={() => setCatToDelete(null)}
      />
    </div>
  );
};
