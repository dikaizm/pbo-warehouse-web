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
