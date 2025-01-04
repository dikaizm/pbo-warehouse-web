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
import { FaPlus } from "react-icons/fa";
import {
  HiChevronDown,
  HiChevronUp,
  HiEye,
  HiHome,
  HiOutlineExclamationCircle,
  HiPencilAlt,
  HiTrash,
} from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import axios from "axios";
import { CONFIG } from "../../config";
import { useAuth } from "../../providers/auth-provider";
import { Pagination } from "../../components/table-pagination";
import ListItem from "../../components/list-item";
import { getProductCategory, PRODUCT_CATEGORIES } from "../../const";
import type {
  PaginationProps,
  TableBaseProps,
  TableFilterProps,
} from "../../types/table";

interface ProductsPageProps {
  category: string | "electronic" | "cosmetic" | "fnb";
}

const ProductsPage: FC<ProductsPageProps> = function ({ category }) {
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
  const [productUpdate, setProductUpdate] = useState<boolean>(false);

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
      const sortQuery =
        sort === "type" ? `&sortByDetail=${sort}` : `&sort=${sort}`;
      const response = await axios.get(
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
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category, search, sort, order, pagination.limit]);

  useEffect(() => {
    if (productUpdate) {
      fetchData();
      setProductUpdate(false);
    }
  }, [productUpdate]);

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
        <div className="mb-1 w-full">
          <div className="mb-4">
            <Breadcrumb className="mb-4">
              <Breadcrumb.Item href="#">
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <span className="dark:text-white">Beranda</span>
                </div>
              </Breadcrumb.Item>
              <Breadcrumb.Item>Inventori</Breadcrumb.Item>
              <Breadcrumb.Item>{getProductCategory(category)}</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Produk {getProductCategory(category)}
            </h1>
          </div>
          <div className="block items-center sm:flex">
            <SearchForProducts search={search} setSearch={setSearch} />
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
            <div className="flex w-full items-center sm:justify-end">
              <AddProductModal
                category={category}
                setUpdate={setProductUpdate}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            {loading && <p className="p-4 text-gray-500">Loading...</p>}
            {error && <p className="p-4 text-red-500">{error}</p>}
            {!loading && !error && (
              <div className="overflow-hidden shadow">
                {category === PRODUCT_CATEGORIES.ELECTRONICS && (
                  <ProductsTableElectronic
                    data={data}
                    sort={{ value: sort, setter: setSort }}
                    order={{ value: order, setter: setOrder }}
                    columnState={{
                      value: columnState,
                      setter: setColumnState,
                    }}
                    update={{ value: productUpdate, setter: setProductUpdate }}
                  />
                )}
                {category === PRODUCT_CATEGORIES.COSMETICS && (
                  <ProductsTableCosmetic
                    data={data}
                    sort={{ value: sort, setter: setSort }}
                    order={{ value: order, setter: setOrder }}
                    columnState={{
                      value: columnState,
                      setter: setColumnState,
                    }}
                    update={{ value: productUpdate, setter: setProductUpdate }}
                  />
                )}
                {category === PRODUCT_CATEGORIES.FNB && (
                  <ProductsTableFnb
                    data={data}
                    sort={{ value: sort, setter: setSort }}
                    order={{ value: order, setter: setOrder }}
                    columnState={{
                      value: columnState,
                      setter: setColumnState,
                    }}
                    update={{ value: productUpdate, setter: setProductUpdate }}
                  />
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
        }}
      />
    </NavbarSidebarLayout>
  );
};

interface SearchForProductsProps {
  search: string;
  // eslint-disable-next-line no-unused-vars
  setSearch: (search: string) => void;
}

const SearchForProducts: FC<SearchForProductsProps> = function ({
  search,
  setSearch,
}) {
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

interface AddProductProps {
  skuCode: string;
  name: string;
  category: string;
  maxStock: number;
  details: {
    type?: string;
    expireDate?: string;
  };
}

const AddProductModal: FC<{
  category: string;
  // eslint-disable-next-line no-unused-vars
  setUpdate: (value: boolean) => void;
}> = function ({ category, setUpdate }) {
  const { token } = useAuth();
  const [isOpen, setOpen] = useState(false);
  const [data, setData] = useState<AddProductProps>({
    skuCode: "",
    name: "",
    category: category,
    maxStock: 0,
    details: {
      type: "",
      expireDate: "",
    },
  });

  function validateForm(): string {
    if (data.name === "") {
      return "Nama produk tidak boleh kosong";
    }

    if (data.skuCode === "") {
      return "Kode SKU tidak boleh kosong";
    }

    if (data.maxStock <= 0) {
      return "Stok maksimal tidak boleh kurang dari 1";
    }

    if (
      data.category === PRODUCT_CATEGORIES.ELECTRONICS &&
      data.details.type === ""
    ) {
      return "Tipe elektronik tidak boleh kosong";
    }

    if (
      (data.category === PRODUCT_CATEGORIES.COSMETICS ||
        data.category === PRODUCT_CATEGORIES.FNB) &&
      data.details.expireDate === ""
    ) {
      return "Tanggal kadaluarsa tidak boleh kosong";
    }

    return "";
  }

  const handleAddProduct = async () => {
    console.log(data);

    const validationMsg = validateForm();
    if (validationMsg !== "") {
      alert(validationMsg);
      return;
    }

    try {
      const response = await axios.post(`${CONFIG.API_URL}/product/add`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setOpen(false);
        setUpdate(true);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Button
        color="primary"
        onClick={() => {
          setOpen(!isOpen);
          setData({
            skuCode: "",
            name: "",
            category: category,
            maxStock: 0,
            details: {
              type: "",
              expireDate: "",
            },
          });
        }}
      >
        <FaPlus className="mr-3 text-sm" />
        Tambah produk
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Tambah Produk Elektronik</strong>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Label htmlFor="productName">Nama Produk</Label>
                <TextInput
                  id="productName"
                  name="productName"
                  placeholder="Apple iMac 27"
                  className="mt-1"
                  required
                  value={data.name}
                  onChange={(e) => {
                    setData({
                      ...data,
                      name: e.target.value,
                    });
                  }}
                />
              </div>

              <div>
                <Label htmlFor="skuCode">Kode SKU</Label>
                <TextInput
                  id="skuCode"
                  name="skuCode"
                  placeholder="APL-IMAC-27"
                  className="mt-1"
                  required
                  value={data.skuCode}
                  onChange={(e) => {
                    setData({
                      ...data,
                      skuCode: e.target.value,
                    });
                  }}
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
                  required
                  value={data.maxStock}
                  onChange={(e) => {
                    const value = e.target.value as unknown as number;
                    if (value < 0) return;

                    setData({
                      ...data,
                      maxStock: value,
                    });
                  }}
                />
              </div>

              {data.category === PRODUCT_CATEGORIES.ELECTRONICS && (
                <div>
                  <Label htmlFor="type">Tipe</Label>
                  <TextInput
                    id="type"
                    name="type"
                    placeholder="Laptop"
                    className="mt-1"
                    required
                    value={data.details.type}
                    onChange={(e) => {
                      setData({
                        ...data,
                        details: {
                          type: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
              )}

              {(data.category === PRODUCT_CATEGORIES.COSMETICS ||
                data.category === PRODUCT_CATEGORIES.FNB) && (
                  <div>
                    <Label htmlFor="expireDate">Tanggal Kadaluarsa</Label>
                    <TextInput
                      type="date"
                      id="expireDate"
                      name="expireDate"
                      className="mt-1"
                      required
                      value={data.details.expireDate}
                      onChange={(e) => {
                        setData({
                          ...data,
                          details: {
                            expireDate: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                )}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={() => handleAddProduct()}>
            Tambahkan
          </Button>
        </Modal.Footer>
      </Modal>
    </>
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

interface EditProductProps {
  name: string;
  category: string;
  maxStock: number;
  details: {
    type?: string;
    expireDate?: string;
  };
}

const EditProductModal: FC<{
  id: string;
  // eslint-disable-next-line no-unused-vars
  setUpdate: (value: boolean) => void;
}> = function ({ id, setUpdate }) {
  const [isOpen, setOpen] = useState(false);
  const { token } = useAuth();

  const [data, setData] = useState<EditProductProps>({
    name: "",
    category: "",
    maxStock: 0,
    details: {
      type: "",
      expireDate: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${CONFIG.API_URL}/product/find/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData({
          name: response.data.data.productName,
          category: response.data.data.category,
          maxStock: response.data.data.maxStock,
          details: {
            type: response.data.data.details?.type,
            expireDate: response.data.data.details?.expireDate,
          },
        });
      } catch (error: any) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);

  const handleEditProduct = async () => {
    console.log(data);

    try {
      const details: any = {};
      if (data.category === PRODUCT_CATEGORIES.ELECTRONICS) {
        details.type = data.details.type;
      } else {
        details.expireDate = data.details.expireDate;
      }

      const response = await axios.put(
        `${CONFIG.API_URL}/product/update/${id}`,
        {
          name: data.name,
          category: data.category,
          maxStock: data.maxStock,
          details: details,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      if (response.data.success) {
        setOpen(false);
        setUpdate(true);
      } else {
        throw new Error("Gagal mengedit produk");
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
                  value={data.name}
                  onChange={(e) => {
                    setData({
                      ...data,
                      name: e.target.value,
                    });
                  }}
                />
              </div>
              {data.category === PRODUCT_CATEGORIES.ELECTRONICS && (
                <div>
                  <Label htmlFor="type">Tipe</Label>
                  <TextInput
                    id="type"
                    name="type"
                    placeholder="Laptop"
                    className="mt-1"
                    value={data.details.type ?? ""}
                    onChange={(e) => {
                      setData({
                        ...data,
                        details: {
                          type: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
              )}

              {(data.category === PRODUCT_CATEGORIES.COSMETICS ||
                data.category === PRODUCT_CATEGORIES.FNB) && (
                  <div>
                    <Label htmlFor="expireDate">Tanggal Kadaluarsa</Label>
                    <TextInput
                      type="date"
                      id="expireDate"
                      name="expireDate"
                      className="mt-1"
                      value={data.details.expireDate ?? ""}
                      onChange={(e) => {
                        setData({
                          ...data,
                          details: {
                            expireDate: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                )}

              <div>
                <Label htmlFor="maxStock">Stok Maksimum</Label>
                <TextInput
                  type="number"
                  id="maxStock"
                  name="maxStock"
                  placeholder="50"
                  className="mt-1"
                  value={data.maxStock}
                  onChange={(e) => {
                    const value = e.target.value as unknown as number;
                    if (value < 0) return;

                    setData({
                      ...data,
                      maxStock: value,
                    });
                  }}
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

const DeleteProductModal: FC<{
  id: string;
  // eslint-disable-next-line no-unused-vars
  setUpdate: (value: boolean) => void;
}> = function ({ id, setUpdate }) {
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
        setUpdate(true);
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
              <b>
                Menghapus barang ini berarti menghapus seluruh data yang terkait
                pencatatan stok barang.{" "}
              </b>
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

interface ProductBaseProps {
  id: string;
  skuCode: string;
  productName: string;
  category: string;
  stock: number;
  maxStock: number;
  entryDate: string;
}

interface ProductElectronicProps extends ProductBaseProps {
  details: {
    type: string;
  };
}

interface ProductCosmeticProps extends ProductBaseProps {
  details: {
    expireDate: string;
  };
}

interface ProductFnbProps extends ProductBaseProps {
  details: {
    expireDate: string;
  };
}

interface ProductsTableElectronicProps extends TableFilterProps {
  data: ProductElectronicProps[];
}

interface ProductsTableCosmeticProps extends TableFilterProps {
  data: ProductCosmeticProps[];
}

interface ProductsTableFnbProps extends TableFilterProps {
  data: ProductFnbProps[];
}

const ProductsTableElectronic: FC<ProductsTableElectronicProps> = function ({
  data,
  sort,
  order,
  columnState,
  update,
}) {
  return (
    <ProductsTable
      update={update}
      header={[
        { key: "sku_code", value: "Kode SKU" },
        { key: "name", value: "Nama Produk" },
        { key: "type", value: "Tipe Elektronik" },
        { key: "stock", value: "Stok" },
        { key: "created_at", value: "Tanggal Entri" },
      ]}
      rows={data.map((item, index) => {
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
                <ViewProductModal id={item.id} />
                <EditProductModal id={item.id} setUpdate={update.setter} />
                <DeleteProductModal id={item.id} setUpdate={update.setter} />
              </div>
            </Table.Cell>
          </Table.Row>
        );
      })}
      sort={{
        value: sort.value,
        setter: sort.setter,
      }}
      order={{
        value: order.value,
        setter: order.setter,
      }}
      columnState={{
        value: columnState.value,
        setter: columnState.setter,
      }}
    />
  );
};

const ProductsTableCosmetic: FC<ProductsTableCosmeticProps> = function ({
  data,
  sort,
  order,
  columnState,
  update,
}) {
  return (
    <ProductsTable
      update={update}
      header={[
        { key: "sku_code", value: "Kode SKU" },
        { key: "name", value: "Nama Produk" },
        { key: "expire_date", value: "Tanggal Kadaluarsa" },
        { key: "stock", value: "Stok" },
        { key: "created_at", value: "Tanggal Entri" },
      ]}
      rows={data.map((item, index) => {
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
                <ViewProductModal id={item.id} />
                <EditProductModal id={item.id} setUpdate={update.setter} />
                <DeleteProductModal id={item.id} setUpdate={update.setter} />
              </div>
            </Table.Cell>
          </Table.Row>
        );
      })}
      sort={{
        value: sort.value,
        setter: sort.setter,
      }}
      order={{
        value: order.value,
        setter: order.setter,
      }}
      columnState={{
        value: columnState.value,
        setter: columnState.setter,
      }}
    />
  );
};

const ProductsTableFnb: FC<ProductsTableFnbProps> = function ({
  data,
  sort,
  order,
  columnState,
  update,
}) {
  return (
    <ProductsTable
      update={update}
      header={[
        { key: "sku_code", value: "Kode SKU" },
        { key: "name", value: "Nama Produk" },
        { key: "expire_date", value: "Tanggal Kadaluarsa" },
        { key: "stock", value: "Stok" },
        { key: "created_at", value: "Tanggal Entri" },
      ]}
      rows={data.map((item, index) => {
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
                <ViewProductModal id={item.id} />
                <EditProductModal id={item.id} setUpdate={update.setter} />
                <DeleteProductModal id={item.id} setUpdate={update.setter} />
              </div>
            </Table.Cell>
          </Table.Row>
        );
      })}
      sort={{
        value: sort.value,
        setter: sort.setter,
      }}
      order={{
        value: order.value,
        setter: order.setter,
      }}
      columnState={{
        value: columnState.value,
        setter: columnState.setter,
      }}
    />
  );
};

const ProductsTable: FC<TableBaseProps> = function ({
  header,
  rows,
  sort,
  order,
  columnState,
}) {
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        {/* <Table.HeadCell>
          <span className="sr-only">Toggle selected</span>
          <Checkbox />
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
        {rows.map((row) => row)}
      </Table.Body>
    </Table>
  );
};

export default ProductsPage;
