export type ItemCategory = string;

export interface BaseItem {
  id: string;
  name: string;
  category: ItemCategory;
  price: string;
  description: string;
}

export interface Item extends BaseItem {
  stats?: {
    damage?: string;
    rof?: number;
    sp?: number;
    humanityCost?: string;
    slots?: number;
    [key: string]: string | number | undefined;
  };
}
