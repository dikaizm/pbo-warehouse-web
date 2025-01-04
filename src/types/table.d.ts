import type { ReactNode } from "react";

export interface PaginationProps {
  page: number;
  limit: number;
  totalData: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TableBaseProps extends TableFilterProps {
  header: {
    key: string;
    value: string;
  }[];
  rows: ReactNode[];
}

export interface TableFilterProps {
  sort: {
    value: string;
    // eslint-disable-next-line no-unused-vars
    setter: (value: string) => void;
  };
  order: {
    value: string;
    // eslint-disable-next-line no-unused-vars
    setter: (value: string) => void;
  };
  columnState: {
    value: boolean[];
    // eslint-disable-next-line no-unused-vars
    setter: (value: boolean[]) => void;
  };
  update: {
    value: boolean;
    // eslint-disable-next-line no-unused-vars
    setter: (value: boolean) => void;
  };
}

export interface FilterProps {
  category: string;
  entryDate: string;
}
