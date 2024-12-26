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
  HiCog,
  HiDotsVertical,
  HiExclamationCircle,
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
  category: string;
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

  const [dataElectronic, setDataElectronic] = useState<ProductsTableElectronicProps[]>([]);
  const [dataCosmetic, setDataCosmetic] = useState<ProductsTableCosmeticProps[]>([]);
  const [dataFnb, setDataFnb] = useState<ProductsTableFnbProps[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    page: 1,
    limit: 10,
    totalData: 0,
    totalPage: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (category === PRODUCT_CATEGORIES.ELECTRONICS) {

          const response = await axios.get(`${CONFIG.API_URL}/product/find?page=1&limit=10&category=electronic`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          setDataElectronic(response.data.data);
          setPagination(response.data.pagination);

        } else if (category === PRODUCT_CATEGORIES.COSMETICS) {

          const response = await axios.get(`${CONFIG.API_URL}/product/find?page=1&limit=10&category=cosmetic`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setDataCosmetic(response.data.data);
          setPagination(response.data.pagination);

        } else if (category === PRODUCT_CATEGORIES.FNB) {

          const response = await axios.get(`${CONFIG.API_URL}/product/find?page=1&limit=10&category=fnb`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setDataFnb(response.data.data);
          setPagination(response.data.pagination);

        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

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
            <SearchForProducts />
            <div className="hidden space-x-1 border-l border-gray-100 pl-2 dark:border-gray-700 md:flex">
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
            </div>
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
                {category === 'electronics' && (
                  <ProductsTableElectronic data={dataElectronic} />
                )}
                {category === 'cosmetics' && (
                  <ProductsTableCosmetic data={dataCosmetic} />
                )}
                {category === 'fnb' && (
                  <ProductsTableFnb data={dataFnb} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Pagination page={pagination.page} limit={pagination.limit} totalData={pagination.totalData} totalPage={pagination.totalPage} hasNext={pagination.hasNextPage} hasPrev={pagination.hasPrevPage} onPageChange={function (page: number): void {
        throw new Error("Function not implemented.");
      }} />
    </NavbarSidebarLayout>
  );
};

const SearchForProducts: FC = function () {
  return (
    <form className="mb-4 sm:mb-0 sm:pr-3" action="#" method="GET">
      <Label htmlFor="products-search" className="sr-only">
        Search
      </Label>
      <div className="relative mt-1 lg:w-64 xl:w-96">
        <TextInput
          id="products-search"
          name="products-search"
          placeholder="Cari barang..."
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
        Add product
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

const EditProductModal: FC = function () {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(!isOpen)}>
        <HiPencilAlt className="mr-2 text-lg" />
        Edit item
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
      <Button color="failure" onClick={() => setOpen(!isOpen)}>
        <HiTrash className="mr-2 text-lg" />
        Delete item
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
  header: string[];
  rows: ReactNode[];
}

const ProductsTableElectronic: FC<{ data: ProductsTableElectronicProps[] }> = function ({ data }) {
  return (
    <ProductsTable
      header={["Kode SKU", "Nama Produk", "Tipe Elektronik", "Stok", "Tanggal Entri"]}
      rows={
        data.map((item, index) => {
          return (
            <Table.Row key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <Table.Cell className="w-4 p-4">
                <Checkbox />
              </Table.Cell>

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
                <div className="flex items-center gap-x-3">
                  <EditProductModal />
                  <DeleteProductModal />
                </div>
              </Table.Cell>
            </Table.Row>
          )
        })
      }
    />
  )
}

const ProductsTableCosmetic: FC<{ data: ProductsTableCosmeticProps[] }> = function ({ data }) {
  return (
    <ProductsTable
      header={["Kode SKU", "Nama Produk", "Tipe Elektronik", "Stok", "Tanggal Entri"]}
      rows={
        data.map((item, index) => {
          return (
            <Table.Row key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <Table.Cell className="w-4 p-4">
                <Checkbox />
              </Table.Cell>

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
          )
        })
      }
    />
  )
}

const ProductsTableFnb: FC<{ data: ProductsTableFnbProps[] }> = function ({ data }) {
  return (
    <ProductsTable
      header={["Kode SKU", "Nama Produk", "Tipe Elektronik", "Stok", "Tanggal Entri"]}
      rows={
        data.map((item, index) => {
          return (
            <Table.Row key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <Table.Cell className="w-4 p-4">
                <Checkbox />
              </Table.Cell>

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
          )
        })
      }
    />
  )
}

const ProductsTable: FC<ProductsTableProps> = function ({ header, rows }) {
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>
          <span className="sr-only">Toggle selected</span>
          <Checkbox />
        </Table.HeadCell>
        {
          header.map((item, index) => (
            <Table.HeadCell key={index}>{item}</Table.HeadCell>
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