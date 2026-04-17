import React from 'react';
import type { Item } from '../types';
import { FaTimes } from 'react-icons/fa';
import './ItemDetailModal.css';

interface Props {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ItemDetailModal: React.FC<Props> = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content detail-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><FaTimes /></button>
        
        {item.imageUrl && (
          <div className="detail-image-container">
            <img src={item.imageUrl} alt={item.name} className="detail-image" />
          </div>
        )}
        
        <div className="detail-header">
          <h2 className="cyber-font">{item.name}</h2>
          <span className="category-badge">{item.category}</span>
        </div>
        
        <div className="detail-price">{item.price}</div>
        
        <div className="detail-section">
          <h4 className="cyber-font">DESCRIPTION</h4>
          <p className="detail-desc">{item.description}</p>
        </div>

        {item.stats && Object.keys(item.stats).length > 0 && (
          <div className="detail-section">
            <h4 className="cyber-font">STATS</h4>
            <div className="detail-stats">
              {Object.entries(item.stats).map(([key, value]) => (
                <div key={key} className="stat-row">
                  <span className="stat-key">{key.toUpperCase()}</span>
                  <span className="stat-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
