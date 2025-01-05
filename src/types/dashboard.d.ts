export interface ChartResponseProps {
  year: number;
  month: number;
  daysCount: number;
  totalStock: number[];
  details: ChartDetailProps;
}

interface ChartDetailProps {
  electronic: ChartStockProps;
  cosmetic: ChartStockProps;
  fnb: ChartStockProps;
}

interface ChartStockProps {
  stock: number[];
  inbound: number[];
  outbound: number[];
}

export interface SummaryProps {
  stockPerCategory: PerCategoryProps;
  itemPerCategory: PerCategoryProps;
  topFivePerCategory: TopProductPerCategoryProps;
}

export interface PerCategoryProps {
  electronic: number;
  cosmetic: number;
  fnb: number;
  state: {
    loading: boolean;
    error: string;
  };
}

export interface TopProductPerCategoryProps {
  electronic: ProductSummaryProps[];
  cosmetic: ProductSummaryProps[];
  fnb: ProductSummaryProps[];
  state: {
    loading: boolean;
    error: string;
  };
}

export interface ProductSummaryProps {
  id: string;
  skuCode: string;
  name: string;
  stock: number;
}
