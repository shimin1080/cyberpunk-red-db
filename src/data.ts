import type { Item } from './types';
import { v4 as uuidv4 } from 'uuid';

export const INITIAL_CATEGORIES: string[] = ['Weapon', 'Armor', 'Cyberware', 'Gear', 'Program', 'Vehicle', 'Uncategorized'];

export const INITIAL_DATA: Item[] = [
  {
    id: uuidv4(),
    name: 'ヘヴィ・ピストル',
    category: 'Weapon',
    price: '100eb (Premium)',
    description: '標準的な大口径ピストル。高い威力を誇る。',
    stats: {
      damage: '3d6',
      rof: 2,
    }
  },
  {
    id: uuidv4(),
    name: 'アサルトライフル',
    category: 'Weapon',
    price: '500eb (Expensive)',
    description: '軍用アサルトライフル。連射が可能。',
    stats: {
      damage: '5d6',
      rof: 1,
    }
  },
  {
    id: uuidv4(),
    name: 'ライト・アーマージャック（胴）',
    category: 'Armor',
    price: '100eb (Premium)',
    description: 'ケブラーやプラスチックを編み込んだ一般的な防弾ジャケット。',
    stats: {
      sp: 11
    }
  },
  {
    id: uuidv4(),
    name: 'サイバーオーディオ',
    category: 'Cyberware',
    price: '500eb (Expensive)',
    description: '聴覚を強化し、様々なモジュールを組み込めるベースインプラント。',
    stats: {
      humanityCost: '2d6',
      slots: 3
    }
  },
  {
    id: uuidv4(),
    name: 'エージェント',
    category: 'Gear',
    price: '100eb (Premium)',
    description: 'AIを搭載した高機能スマートフォン。スケジュール管理から情報収集まで。',
  },
  {
    id: uuidv4(),
    name: 'トラウマチーム・サブスクリプション',
    category: 'Gear',
    price: '500eb/月 (Expensive)',
    description: '緊急医療チームの出動サービス。',
  }
];
