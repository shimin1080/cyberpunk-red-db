import React from 'react';
import type { Item } from '../types';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './ItemCard.css';

interface Props {
  item: Item;
  onView: (item: Item) => void;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export const ItemCard: React.FC<Props> = ({ item, onView, onEdit, onDelete }) => {
  let shortDescription = item.description.split('\n')[0];
  if (shortDescription.length > 18) {
    shortDescription = shortDescription.substring(0, 18) + '...';
  } else if (item.description.includes('\n')) {
    shortDescription += '...';
  }

  return (
    <div className="item-card clickable" onClick={() => onView(item)}>
      {item.imageUrl && (
        <div className="item-image-container">
          <img src={item.imageUrl} alt={item.name} className="item-image" />
          <div className="item-image-overlay"></div>
        </div>
      )}
      <div className="item-card-header">
        <h3 className="cyber-font">{item.name}</h3>
        <span className="category-badge">{item.category}</span>
      </div>
      <div className="item-price">{item.price}</div>
      <div className="item-desc">
        {shortDescription}
      </div>
      
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
        <button className="btn" onClick={(e) => { e.stopPropagation(); onEdit(item); }}><FaEdit /> Edit</button>
        <button className="btn danger" onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}><FaTrash /> Delete</button>
      </div>
    </div>
  );
};
