import React from 'react';
import type { Item } from '../types';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './ItemCard.css';

interface Props {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export const ItemCard: React.FC<Props> = ({ item, onEdit, onDelete }) => {
  return (
    <div className="item-card">
      <div className="item-card-header">
        <h3 className="cyber-font">{item.name}</h3>
        <span className="category-badge">{item.category}</span>
      </div>
      <div className="item-price">{item.price}</div>
      <div className="item-desc">{item.description}</div>
      
      {item.stats && Object.keys(item.stats).length > 0 && (
        <div className="item-stats">
          {Object.entries(item.stats).map(([key, value]) => (
            <div key={key} className="stat-row">
              <span className="stat-key">{key.toUpperCase()}:</span>
              <span className="stat-value">{value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="item-actions">
        <button className="btn" onClick={() => onEdit(item)}><FaEdit /> Edit</button>
        <button className="btn danger" onClick={() => onDelete(item.id)}><FaTrash /> Delete</button>
      </div>
    </div>
  );
};
