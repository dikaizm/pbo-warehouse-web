/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Breadcrumb,
  Button,
  Checkbox,
  Label,
  Modal,
  Table,
  Textarea,
  TextInput,
} from "flowbite-react";
import type { FC, ReactNode } from "react";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  HiChevronDown,
  HiChevronUp,
  HiCog,
  HiDotsVertical,
  HiExclamationCircle,
  HiEye,
  HiHome,
  HiOutlineExclamationCircle,
  HiPencilAlt,
  HiTrash,
  HiUpload,
} from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import axios from "axios";
import { CONFIG } from "../../config";
import { useAuth } from "../../providers/auth-provider";
import { PRODUCT_CATEGORIES } from "../../const";
import { Pagination } from "../../components/table-pagination";

interface ProductsPageProps {
  category: string | 'electronic' | 'cosmetic' | 'fnb';
}

interface PaginationProps {
  page: number;
  limit: number;
  totalData: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const ProductsPage: FC<ProductsPageProps> = function ({ category }) {
  const { token } = useAuth();

  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<string>('name');
  const [order, setOrder] = useState<string>('asc');
  const [columnState, setColumnState] = useState<boolean[]>([false, true, false, false, false]);

  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    page: 1,
    limit: 10,
    totalData: 0,
    totalPage: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (page: number = pagination.page) => {
    setLoading(true);
    setError(null);

    try {
      let sortQuery = sort === 'type' ? `&sortByDetail=${sort}` : `&sort=${sort}`;
      let response = await axios.get(
        `${CONFIG.API_URL}/product/find?page=${page}&limit=${pagination.limit}&category=${category}&name=${search}&order=${order}${sortQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category, search, sort, order]);

  const handlePaginationBtn = (pageChange: number) => {
    if (pagination.page + pageChange > 0 && pagination.page + pageChange <= pagination.totalPage) {
      fetchData(pagination.page + pageChange);
    }
  };

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <Breadcrumb className="mb-4">
              <Breadcrumb.Item href="#">
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <span className="dark:text-white">Home</span>
                </div>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                Inventori
              </Breadcrumb.Item>
              <Breadcrumb.Item>{category}</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Produk {category}
            </h1>
          </div>
          <div className="block items-center sm:flex">
            <SearchForProducts search={search} setSearch={setSearch} />
            {/* <div className="hidden space-x-1 border-l border-gray-100 pl-2 dark:border-gray-700 md:flex">
              <a
                href="#"
                className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Configure</span>
                <HiCog className="text-2xl" />
              </a>
              <a
                href="#"
                className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Delete</span>
                <HiTrash className="text-2xl" />
              </a>
              <a
                href="#"
                className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Purge</span>
                <HiExclamationCircle className="text-2xl" />
              </a>
              <a
                href="#"
                className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Settings</span>
                <HiDotsVertical className="text-2xl" />
              </a>
            </div> */}
            <div className="flex w-full items-center sm:justify-end">
              <AddProductModal />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            {loading && <p className="text-gray-500 p-4">Loading...</p>}
            {error && <p className="text-red-500 p-4">{error}</p>}
            {!loading && !error && (
              <div className="overflow-hidden shadow">
                {category === 'electronic' && (
                  <ProductsTableElectronic data={data} sort={{ value: sort, setter: setSort }} order={{ value: order, setter: setOrder }} columnState={{
                    value: columnState,
                    setter: setColumnState
                  }} />
                )}
                {category === 'cosmetic' && (
                  <ProductsTableCosmetic data={data} />
                )}
                {category === 'fnb' && (
                  <ProductsTableFnb data={data} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Pagination
        page={pagination.page}
        limit={pagination.limit}
        totalData={pagination.totalData}
        totalPage={pagination.totalPage}
        hasNext={pagination.hasNextPage}
        hasPrev={pagination.hasPrevPage}
        onPrev={() => {
          handlePaginationBtn(-1);
        }}
        onNext={() => {
          handlePaginationBtn(1);
        }} />
    </NavbarSidebarLayout>
  );
};

interface SearchForProductsProps {
  search: string;
  setSearch: (search: string) => void;
}

const SearchForProducts: FC<SearchForProductsProps> = function ({ search, setSearch }) {
  return (
    <form className="mb-4 sm:mb-0 sm:pr-3">
      <Label htmlFor="products-search" className="sr-only">
        Search
      </Label>
      <div className="relative mt-1 lg:w-64 xl:w-96">
        <TextInput
          id="products-search"
          name="products-search"
          placeholder="Cari nama barang..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </form>
  );
};

const AddProductModal: FC = function () {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(!isOpen)}>
        <FaPlus className="mr-3 text-sm" />
        Tambah produk
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add product</strong>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Label htmlFor="productName">Product name</Label>
                <TextInput
                  id="productName"
                  name="productName"
                  placeholder='Apple iMac 27"'
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <TextInput
                  id="category"
                  name="category"
                  placeholder="Electronics"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <TextInput
                  id="brand"
                  name="brand"
                  placeholder="Apple"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <TextInput
                  id="price"
                  name="price"
                  type="number"
                  placeholder="$2300"
                  className="mt-1"
                />
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="producTable.Celletails">Product details</Label>
                <Textarea
                  id="producTable.Celletails"
                  name="producTable.Celletails"
                  placeholder="e.g. 3.8GHz 8-core 10th-generation Intel Core i7 processor, Turbo Boost up to 5.0GHz, Ram 16 GB DDR4 2300Mhz"
                  rows={6}
                  className="mt-1"
                />
              </div>
              <div className="lg:col-span-2">
                <div className="flex w-full items-center justify-center">
                  <label className="flex h-32 w-full cursor-pointer flex-col rounded border-2 border-dashed border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <HiUpload className="text-4xl text-gray-300" />
                      <p className="py-1 text-sm text-gray-600 dark:text-gray-500">
                        Upload a file or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <input type="file" className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={() => setOpen(false)}>
            Add product
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const ViewProductModal: FC = function () {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button className="px-0 bg-primary-200 hover:bg-primary-300" size="sm" onClick={() => setOpen(!isOpen)}>
        <HiEye className="text-lg text-primary-600" />
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>View product</strong>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Label htmlFor="productName">Product name</Label>
                <TextInput
                  id="productName"
                  name="productName"
                  placeholder='Apple iMac 27"'
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <TextInput
                  id="category"
                  name="category"
                  placeholder="Electronics"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <TextInput
                  id="brand"
                  name="brand"
                  placeholder="Apple"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <TextInput
                  id="price"
                  name="price"
                  type="number"
                  placeholder="$2300"
                  className="mt-1"
                />
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="productDetails">Product details</Label>
                <Textarea
                  id="productDetails"
                  name="productDetails"
                  placeholder="e.g. 3.8GHz 8-core 10th-generation Intel Core i7 processor, Turbo Boost up to 5.0GHz, Ram 16 GB DDR4 2300Mhz"
                  rows={6}
                  className="mt-1"
                />
              </div>
              <div className="flex space-x-5">
                <div>
                  <img
                    alt="Apple iMac 1"
                    src="/images/products/apple-imac-1.png"
                    className="h-24"
                  />
                  <a href="#" className="cursor-pointer">
                    <span className="sr-only">Delete</span>
                    <HiTrash className="-mt-5 text-2xl text-red-600" />
                  </a>
                </div>
                <div>
                  <img
                    alt="Apple iMac 2"
                    src="/images/products/apple-imac-2.png"
                    className="h-24"
                  />
                  <a href="#" className="cursor-pointer">
                    <span className="sr-only">Delete</span>
                    <HiTrash className="-mt-5 text-2xl text-red-600" />
                  </a>
                </div>
                <div>
                  <img
                    alt="Apple iMac 3"
                    src="/images/products/apple-imac-3.png"
                    className="h-24"
                  />
                  <a href="#" className="cursor-pointer">
                    <span className="sr-only">Delete</span>
                    <HiTrash className="-mt-5 text-2xl text-red-600" />
                  </a>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="flex w-full items-center justify-center">
                  <label className="flex h-32 w-full cursor-pointer flex-col rounded border-2 border-dashed border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <HiUpload className="text-4xl text-gray-300" />
                      <p className="py-1 text-sm text-gray-600 dark:text-gray-500">
                        Upload a file or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <input type="file" className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

const EditProductModal: FC = function () {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button className="px-0 bg-orange-200 hover:bg-orange-300" size="sm" onClick={() => setOpen(!isOpen)}>
        <HiPencilAlt className="text-lg text-orange-500" />
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Edit product</strong>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Label htmlFor="productName">Product name</Label>
                <TextInput
                  id="productName"
                  name="productName"
                  placeholder='Apple iMac 27"'
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <TextInput
                  id="category"
                  name="category"
                  placeholder="Electronics"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <TextInput
                  id="brand"
                  name="brand"
                  placeholder="Apple"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <TextInput
                  id="price"
                  name="price"
                  type="number"
                  placeholder="$2300"
                  className="mt-1"
                />
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="productDetails">Product details</Label>
                <Textarea
                  id="productDetails"
                  name="productDetails"
                  placeholder="e.g. 3.8GHz 8-core 10th-generation Intel Core i7 processor, Turbo Boost up to 5.0GHz, Ram 16 GB DDR4 2300Mhz"
                  rows={6}
                  className="mt-1"
                />
              </div>
              <div className="flex space-x-5">
                <div>
                  <img
                    alt="Apple iMac 1"
                    src="/images/products/apple-imac-1.png"
                    className="h-24"
                  />
                  <a href="#" className="cursor-pointer">
                    <span className="sr-only">Delete</span>
                    <HiTrash className="-mt-5 text-2xl text-red-600" />
                  </a>
                </div>
                <div>
                  <img
                    alt="Apple iMac 2"
                    src="/images/products/apple-imac-2.png"
                    className="h-24"
                  />
                  <a href="#" className="cursor-pointer">
                    <span className="sr-only">Delete</span>
                    <HiTrash className="-mt-5 text-2xl text-red-600" />
                  </a>
                </div>
                <div>
                  <img
                    alt="Apple iMac 3"
                    src="/images/products/apple-imac-3.png"
                    className="h-24"
                  />
                  <a href="#" className="cursor-pointer">
                    <span className="sr-only">Delete</span>
                    <HiTrash className="-mt-5 text-2xl text-red-600" />
                  </a>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="flex w-full items-center justify-center">
                  <label className="flex h-32 w-full cursor-pointer flex-col rounded border-2 border-dashed border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <HiUpload className="text-4xl text-gray-300" />
                      <p className="py-1 text-sm text-gray-600 dark:text-gray-500">
                        Upload a file or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <input type="file" className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={() => setOpen(false)}>
            Save all
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const DeleteProductModal: FC = function () {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button className="px-0 bg-red-200 hover:bg-red-300" size="sm" color="failure" onClick={() => setOpen(!isOpen)}>
        <HiTrash className="text-lg text-red-600" />
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-3 pt-3 pb-0">
          <span className="sr-only">Delete product</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-600" />
            <p className="text-lg text-gray-500 dark:text-gray-300">
              Are you sure you want to delete this product?
            </p>
            <div className="flex items-center gap-x-3">
              <Button color="failure" onClick={() => setOpen(false)}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

interface ProductsTableElectronicProps {
  id: string;
  skuCode: string;
  productName: string;
  category: string;
  stock: number;
  maxStock: number;
  entryDate: string;
  details: {
    type: string;
  }
}

interface ProductsTableCosmeticProps {
  id: string;
  skuCode: string;
  productName: string;
  category: string;
  stock: number;
  maxStock: number;
  entryDate: string;
  details: {
    expireDate: string;
  }
}

interface ProductsTableFnbProps {
  id: string;
  skuCode: string;
  productName: string;
  category: string;
  stock: number;
  maxStock: number;
  entryDate: string;
  details: {
    expireDate: string;
  }
}

interface ProductsTableProps {
  header: {
    key: string;
    value: string;
  }[];
  rows: ReactNode[];
  sort: {
    value: string;
    setter: (value: string) => void;
  };
  order: {
    value: string;
    setter: (value: string) => void;
  };
  columnState: {
    value: boolean[];
    setter: (value: boolean[]) => void;
  };
}

const ProductsTableElectronic: FC<{
  data: ProductsTableElectronicProps[],
  sort: { value: string, setter: (value: string) => void },
  order: { value: string, setter: (value: string) => void },
  columnState: { value: boolean[], setter: (value: boolean[]) => void }
}> = function ({ data, sort, order, columnState }) {
  return (
    <ProductsTable
      header={[
        { key: 'sku_code', value: 'Kode SKU' },
        { key: 'name', value: 'Nama Produk' },
        { key: 'type', value: 'Tipe Elektronik' },
        { key: 'stock', value: 'Stok' },
        { key: 'entry_date', value: 'Tanggal Entri' },
      ]}
      rows={data.map((item, index) => {
        return (
          <Table.Row key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
            {/* <Table.Cell className="w-4 p-4">
                      <Checkbox />
                    </Table.Cell> */}

            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
              {item.skuCode}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
              {item.productName}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
              {item.details.type}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {item.stock}
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                Maks {item.maxStock}
              </div>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
              {item.entryDate}
            </Table.Cell>

            <Table.Cell className="space-x-2 whitespace-nowrap p-4">
              <div className="flex items-center gap-x-2">
                <ViewProductModal />
                <EditProductModal />
                <DeleteProductModal />
              </div>
            </Table.Cell>
          </Table.Row>
        );
      })}
      sort={{
        value: sort.value,
        setter: sort.setter
      }}
      order={{
        value: order.value,
        setter: order.setter
      }}
      columnState={{
        value: columnState.value,
        setter: columnState.setter
      }}
    />
  )
}

const ProductsTableCosmetic: FC<{ data: ProductsTableCosmeticProps[] }> = function ({ data }) {
  return (
    <ProductsTable

      rows={data.map((item, index) => {
        return (
          <Table.Row key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
            {/* <Table.Cell className="w-4 p-4">
                              <Checkbox />
                            </Table.Cell> */}

            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
              {item.skuCode}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
              {item.productName}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
              {item.details.expireDate}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {item.stock}
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                Maks {item.maxStock}
              </div>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
              {item.entryDate}
            </Table.Cell>

            <Table.Cell className="space-x-2 whitespace-nowrap p-4">
              <div className="flex items-center gap-x-3">
                <EditProductModal />
                <DeleteProductModal />
              </div>
            </Table.Cell>
          </Table.Row>
        );
      })} sort={{
        value: "",
        setter: () => { }
      }} order={{
        value: "",
        setter: () => { }
      }} header={[]} columnState={{
        value: [],
        setter: function (value: boolean[]): void {
          throw new Error("Function not implemented.");
        }
      }} />
  )
}

const ProductsTableFnb: FC<{ data: ProductsTableFnbProps[] }> = function ({ data }) {
  return (
    <ProductsTable

      rows={data.map((item, index) => {
        return (
          <Table.Row key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
            {/* <Table.Cell className="w-4 p-4">
                              <Checkbox />
                            </Table.Cell> */}

            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
              {item.skuCode}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
              {item.productName}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
              {item.details.expireDate}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {item.stock}
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                Maks {item.maxStock}
              </div>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
              {item.entryDate}
            </Table.Cell>

            <Table.Cell className="space-x-2 whitespace-nowrap p-4">
              <div className="flex items-center gap-x-3">
                <EditProductModal />
                <DeleteProductModal />
              </div>
            </Table.Cell>
          </Table.Row>
        );
      })} sort={{
        value: "",
        setter: () => { }
      }} order={{
        value: "",
        setter: () => { }
      }} header={[]} columnState={{
        value: [],
        setter: function (value: boolean[]): void {
          throw new Error("Function not implemented.");
        }
      }} />
  )
}

const ProductsTable: FC<ProductsTableProps> = function ({ header, rows, sort, order, columnState }) {

  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        {/* <Table.HeadCell>
          <span className="sr-only">Toggle selected</span>
          <Checkbox />
        </Table.HeadCell> */}
        {
          header.map((item, index) => (
            <Table.HeadCell key={index}>
              <div className="flex items-center gap-2 ">
                <span className={columnState.value[index] ? "text-blue-600" : ""}>{item.value}</span>
                <button
                  onClick={() => {
                    columnState.setter(columnState.value.map((_, idx) => {
                      if (index === idx) {
                        return true;
                      } else {
                        return false;
                      }
                    }));

                    sort.setter(item.key);
                    order.setter(order.value === 'asc' ? 'desc' : 'asc');

                  }}
                  className={"cursor-pointer shrink-0 justify-center overflow-hidden rounded bg-gray-100 text-gray-500 hover:bg-gray-200 border-gray-200 border"}
                >
                  <span className="sr-only">Sort</span>
                  {columnState.value[index] ? (
                    order.value === 'asc' ? (
                      <HiChevronUp className="text-lg" />
                    ) : (
                      <HiChevronDown className="text-lg" />
                    )
                  ) : (
                    <div className="w-4 h-4" />
                  )}
                </button>
              </div>
            </Table.HeadCell>
          ))
        }
        <Table.HeadCell>Aksi</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {
          rows.map((row) => (
            row
          ))
        }
      </Table.Body>
    </Table>
  );
};

export default ProductsPage;
