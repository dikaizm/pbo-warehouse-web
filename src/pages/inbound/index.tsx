/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Breadcrumb,
  Button,
  Label,
  Modal,
  Select,
  Table,
  TextInput,
} from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  HiChevronDown,
  HiChevronUp,
  HiDocumentDownload,
  HiEye,
  HiHome,
  HiOutlineExclamationCircle,
  HiPencilAlt,
  HiPlus,
  HiTrash,
} from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { useAuth } from "../../providers/auth-provider";
import axios from "axios";
import { CONFIG } from "../../config";
import ListItem from "../../components/list-item";
import type {
  FilterProps,
  PaginationProps,
  TableFilterProps,
} from "../../types/table";
import { Pagination } from "../../components/table-pagination";
import { PRODUCT_CATEGORIES } from "../../const";
import { inboundRecordSeed } from "./seed";

const RecordInboundPage: FC = function () {
  const { token } = useAuth();

  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("name");
  const [order, setOrder] = useState<string>("asc");
  const [columnState, setColumnState] = useState<boolean[]>([
    false,
    true,
    false,
    false,
    false,
  ]);
  const [filter, setFilter] = useState<FilterProps>({
    category: "",
    entryDate: "",
  });

  const [data, setData] = useState<InboundRecordProps[]>(inboundRecordSeed);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState<PaginationProps>({
    page: 1,
    limit: 10,
    totalData: 0,
    totalPage: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchData = async (page: number = pagination.page) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${CONFIG.API_URL}/inbound/find?page=${page}&limit=${pagination.limit}&category=${filter.category}&name=${search}&order=${order}&sort=${sort}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, sort, order, pagination.limit]);

  const handlePaginationBtn = (pageChange: number) => {
    if (
      pagination.page + pageChange > 0 &&
      pagination.page + pageChange <= pagination.totalPage
    ) {
      fetchData(pagination.page + pageChange);
    }
  };

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="block items-center justify-between overflow-hidden rounded-lg border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="relative z-50 mb-1 w-full">
          <div className="mb-4">
            <Breadcrumb className="mb-4">
              <Breadcrumb.Item href="#">
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <span className="dark:text-white">Beranda</span>
                </div>
              </Breadcrumb.Item>
              <Breadcrumb.Item>Barang Masuk</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Barang Masuk
            </h1>
          </div>
          <div>
            <div className="block items-center sm:flex">
              <form className="lg:pr-3">
                <Label htmlFor="recordsSearch" className="sr-only">
                  Search
                </Label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <TextInput
                    id="recordsSearch"
                    name="recordsSearch"
                    placeholder="Cari nama barang masuk..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </form>
              <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
                <AddRecordModal />
                <Button color="gray">
                  <div className="flex items-center gap-x-3">
                    <HiDocumentDownload className="text-xl" />
                    <span>Unduh Excel</span>
                  </div>
                </Button>
              </div>
            </div>

            <div className="mt-2 block items-center justify-between gap-3 sm:flex">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center gap-2 ">
                  <Label htmlFor="category">Kategori</Label>
                  <Select
                    id="category"
                    sizing="sm"
                    className="relative cursor-pointer"
                    value={filter.category}
                    onChange={(e) => {
                      setFilter({ ...filter, category: e.target.value });
                    }}
                  >
                    <option value="" defaultChecked>
                      Semua
                    </option>
                    <option value={PRODUCT_CATEGORIES.ELECTRONICS}>
                      Elektronik
                    </option>
                    <option value={PRODUCT_CATEGORIES.COSMETICS}>
                      Kosmetik
                    </option>
                    <option value={PRODUCT_CATEGORIES.FNB}>F&B</option>
                  </Select>
                </div>

                <div className="relative flex items-center justify-center gap-2 ">
                  <Label htmlFor="entryDate">Tanggal Masuk</Label>
                  <input
                    type="date"
                    name="entryDate"
                    id="entryDateStart"
                    className="rounded-lg border border-gray-300 bg-gray-50 py-[6px] px-2 text-sm"
                  />
                  <span>-</span>
                  <input
                    type="date"
                    name="entryDate"
                    id="entryDateEnd"
                    className="rounded-lg border border-gray-300 bg-gray-50 py-[6px] px-2 text-sm"
                  />
                </div>
              </div>

              <div className="hidden space-x-1 border-l border-gray-100 pl-2  md:flex">
                <div className="flex items-center justify-center gap-2">
                  <HiEye className="text-lg" />
                  <span className="text-sm">Tampilkan</span>

                  <Select
                    sizing="sm"
                    className="relative w-20 cursor-pointer"
                    id="showingCount"
                    placeholder="10"
                    value={pagination.limit}
                    onChange={(e) => {
                      setPagination({
                        ...pagination,
                        limit: e.target.value as unknown as number,
                      });
                    }}
                  >
                    <option value="10" defaultChecked>
                      10
                    </option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <AllRecordsTable
                data={data}
                sort={{ value: sort, setter: setSort }}
                order={{ value: order, setter: setOrder }}
                columnState={{
                  value: columnState,
                  setter: setColumnState,
                }}
                filter={filter}
              />
            </div>
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
        }}
      />
    </NavbarSidebarLayout>
  );
};

interface ProductProps {
  id: string;
  skuCode: string;
  productName: string;
}

interface AddRecordFormProps {
  category: string;
  productId: string;
  productName: string;
  quantity: number;
  entryDate: string;
}

const AddRecordModal: FC = function () {
  const { token } = useAuth();
  const [isOpen, setOpen] = useState(false);
  const [productList, setProductList] = useState<ProductProps[]>([]);

  const [formData, setFormData] = useState<AddRecordFormProps>({
    category: "",
    productId: "",
    productName: "",
    quantity: 0,
    entryDate: "",
  });

  const getProductList = async (category: string) => {
    try {
      const response = await axios.get(
        `${CONFIG.API_URL}/product/find?category=${category}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProductList(response.data.data);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleAddRecord = async () => {
    try {
      const response = await axios.post(
        `${CONFIG.API_URL}/inbound/add`,
        {
          productId: formData.productId,
          quantity: formData.quantity,
          entryDate: formData.entryDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setOpen(false);
      } else {
        alert("Gagal menambahkan stok");
      }
    } catch (error: any) {
      console.error(error.message);
      alert(error.message);
    }
  };

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Tambah stok
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Tambah stok baru</strong>
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">Kategori</Label>
              <div className="mt-1">
                <Select
                  id="showingCount"
                  placeholder="Pilih kategori"
                  value={formData.category}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, category: value });
                    getProductList(value);
                  }}
                >
                  <option defaultChecked hidden>
                    Pilih kategori
                  </option>
                  <option value={PRODUCT_CATEGORIES.ELECTRONICS}>
                    Elektronik
                  </option>
                  <option value={PRODUCT_CATEGORIES.COSMETICS}>Kosmetik</option>
                  <option value={PRODUCT_CATEGORIES.FNB}>F&B</option>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="productName">Nama Produk</Label>
              <div className="mt-1">
                <Select id="productName" placeholder="Pilih produk">
                  <option defaultChecked hidden>
                    Pilih produk
                  </option>
                  {productList.length > 0 &&
                    productList.map((item, index) => {
                      return (
                        <option key={index} value={item.id}>
                          {item.productName} - {item.skuCode}
                        </option>
                      );
                    })}
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="quantity">Kuantitas</Label>
              <div className="mt-1">
                <TextInput
                  id="quantity"
                  name="quantity"
                  placeholder="50"
                  type="number"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Tanggal Masuk</Label>
              <div className="mt-1">
                <input
                  type="date"
                  name="entryDate"
                  id="entryDateStart"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 py-[10px] px-2 text-sm"
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={() => handleAddRecord()}>
            Tambahkan
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export interface InboundRecordProps {
  id: string;
  skuCode: string;
  productName: string;
  category: string;
  entryDate: string;
  quantity: number;
}

interface AllRecordsTableProps extends TableFilterProps {
  data: InboundRecordProps[];
  filter: FilterProps;
}

const AllRecordsTable: FC<AllRecordsTableProps> = function ({
  data,
  sort,
  order,
  columnState,
}) {
  const header = [
    { key: "skuCode", value: "Kode SKU" },
    { key: "productName", value: "Nama Produk" },
    { key: "category", value: "Kategori" },
    { key: "quantity", value: "Kuantitas" },
    { key: "entryDate", value: "Tanggal Masuk" },
  ];

  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        {/* <Table.HeadCell>
          <Label htmlFor="select-all" className="sr-only">
            Select all
          </Label>
          <Checkbox id="select-all" name="select-all" />
        </Table.HeadCell> */}
        {header.map((item, index) => (
          <Table.HeadCell key={index} className="px-4">
            <div className="flex items-center gap-2 ">
              <span className={columnState.value[index] ? "text-blue-600" : ""}>
                {item.value}
              </span>
              <button
                onClick={() => {
                  columnState.setter(
                    columnState.value.map((_, idx) => {
                      if (index === idx) {
                        return true;
                      } else {
                        return false;
                      }
                    })
                  );

                  sort.setter(item.key);
                  order.setter(order.value === "asc" ? "desc" : "asc");
                }}
                className={
                  "shrink-0 cursor-pointer justify-center overflow-hidden rounded border border-gray-200 bg-gray-100 text-gray-500 hover:bg-gray-200"
                }
              >
                <span className="sr-only">Sort</span>
                {columnState.value[index] ? (
                  order.value === "asc" ? (
                    <HiChevronUp className="text-lg" />
                  ) : (
                    <HiChevronDown className="text-lg" />
                  )
                ) : (
                  <div className="h-4 w-4" />
                )}
              </button>
            </div>
          </Table.HeadCell>
        ))}
        <Table.HeadCell>Aksi</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {data.map((item, index) => {
          return (
            <Table.Row
              key={index}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
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
                {item.category}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                {item.quantity}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                {item.entryDate}
              </Table.Cell>

              <Table.Cell className="space-x-2 whitespace-nowrap p-4">
                <div className="flex items-center gap-x-2">
                  <ViewProductModal id={item.id} />
                  <EditProductModal id={item.id} />
                  <DeleteProductModal id={item.id} />
                </div>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

interface ProductDetailProps {
  id: string;
  skuCode: string;
  productName: string;
  category: string;
  entryDate: string;
  stock: number;
  maxStock: number;
  createdBy: {
    name: string;
    email: string;
  };
  details?: {
    type?: string;
    expireDate?: string;
  };
}

const ViewProductModal: FC<{ id: string }> = function ({ id }) {
  const [isOpen, setOpen] = useState(false);
  const [data, setData] = useState<ProductDetailProps>({
    id: "",
    skuCode: "",
    productName: "",
    category: "",
    entryDate: new Date().getUTCDate().toString(),
    stock: 0,
    maxStock: 0,
    createdBy: {
      name: "",
      email: "",
    },
    details: {
      type: "",
      expireDate: "",
    },
  });

  const { token } = useAuth();

  const handleViewProduct = async (id: string) => {
    try {
      const response = await axios.get(`${CONFIG.API_URL}/product/find/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data.data);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Button
        onClickCapture={() => handleViewProduct(id)}
        className="bg-primary-200 px-0 hover:bg-primary-300"
        size="sm"
        onClick={() => setOpen(!isOpen)}
      >
        <HiEye className="text-lg text-primary-600" />
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Detail produk</strong>
        </Modal.Header>
        <Modal.Body className="h-96 max-h-96 overflow-y-auto">
          <ListItem title="Kode SKU" value={data.skuCode} />
          <ListItem title="Nama Produk" value={data.productName} />
          <ListItem title="Tipe" value={data.details?.type} />
          <ListItem title="Kategori" value={data.category} />
          <ListItem title="Tanggal Entri" value={data.entryDate} />
          <ListItem title="Stok" value={data.stock} />
          <ListItem title="Stok Maksimal" value={data.maxStock} />
          <ListItem
            title="Entri Oleh"
            value={data.createdBy.name + " (" + data.createdBy.email + ")"}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

const EditProductModal: FC<{ id: string }> = function ({ id }) {
  const [isOpen, setOpen] = useState(false);
  const { token } = useAuth();

  const handleEditProduct = async () => {
    try {
      const response = await axios.put(
        `${CONFIG.API_URL}/product/update/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setOpen(false);
      } else {
        alert("Gagal mengedit produk");
      }
    } catch (error: any) {
      console.error(error.message);
      alert(error.message);
    }
  };

  return (
    <>
      <Button
        className="bg-orange-200 px-0 hover:bg-orange-300"
        size="sm"
        onClick={() => setOpen(!isOpen)}
      >
        <HiPencilAlt className="text-lg text-orange-500" />
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Edit Produk</strong>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Label htmlFor="productName">Nama Produk</Label>
                <TextInput
                  id="productName"
                  name="productName"
                  placeholder='Apple iMac 27"'
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="type">Tipe</Label>
                <TextInput
                  id="type"
                  name="type"
                  placeholder="Laptop"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="maxStock">Stok Maksimum</Label>
                <TextInput
                  type="number"
                  id="maxStock"
                  name="maxStock"
                  placeholder="50"
                  className="mt-1"
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={() => handleEditProduct()}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const DeleteProductModal: FC<{ id: string }> = function ({ id }) {
  const [isOpen, setOpen] = useState(false);
  const { token } = useAuth();

  const handleDeleteProduct = async () => {
    try {
      const response = await axios.delete(
        `${CONFIG.API_URL}/product/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setOpen(false);
      } else {
        alert("Gagal menghapus produk");
      }
    } catch (error: any) {
      console.log(error.message);
      alert(error.message);
    }
  };

  return (
    <>
      <Button
        className="bg-red-200 px-0 hover:bg-red-300"
        size="sm"
        color="failure"
        onClick={() => setOpen(!isOpen)}
      >
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
              Apakah kamu yakin ingin menghapus produk ini?
            </p>
            <div className="flex items-center gap-x-3">
              <Button color="failure" onClick={() => handleDeleteProduct()}>
                Ya, hapus
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                Batal
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RecordInboundPage;
