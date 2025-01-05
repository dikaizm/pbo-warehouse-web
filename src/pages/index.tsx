/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Select, Table, useTheme } from "flowbite-react";
import { useCallback, useEffect, useState, type FC } from "react";
import Chart from "react-apexcharts";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import type {
  PerCategoryProps,
  ProductSummaryProps,
  SummaryProps,
  TopProductPerCategoryProps,
} from "../types/dashboard";
import { type ChartResponseProps } from "../types/dashboard";
import axios from "axios";
import { CONFIG } from "../config";
import { useAuth } from "../providers/auth-provider";
import { HiChevronLeft, HiChevronRight, HiRefresh } from "react-icons/hi";

const DashboardPage: FC = function () {
  const { token } = useAuth();

  const [data, setData] = useState<SummaryProps>({
    stockPerCategory: {
      electronic: 0,
      cosmetic: 0,
      fnb: 0,
      state: {
        loading: true,
        error: "",
      },
    },
    itemPerCategory: {
      electronic: 0,
      cosmetic: 0,
      fnb: 0,
      state: {
        loading: true,
        error: "",
      },
    },
    topFivePerCategory: {
      electronic: [],
      cosmetic: [],
      fnb: [],
      state: {
        loading: true,
        error: "",
      },
    },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${CONFIG.API_URL}/dashboard/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.success) throw new Error(response.data.message);

      setData(response.data.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="px-4 pt-6">
        <ChartStock />
        <div className="my-6">
          <ProductCountPerCategory
            electronic={data.itemPerCategory.electronic}
            cosmetic={data.itemPerCategory.cosmetic}
            fnb={data.itemPerCategory.fnb}
            state={{
              loading: loading,
              error: error,
            }}
          />
        </div>
        <div className="my-6">
          <StockPerCategory
            electronic={data.stockPerCategory.electronic}
            cosmetic={data.stockPerCategory.cosmetic}
            fnb={data.stockPerCategory.fnb}
            state={{
              loading: loading,
              error: error,
            }}
          />
        </div>
        <div className="my-6">
          <TopProductPerCategory
            electronic={data.topFivePerCategory.electronic}
            cosmetic={data.topFivePerCategory.cosmetic}
            fnb={data.topFivePerCategory.fnb}
            state={{
              loading: loading,
              error: error,
            }}
          />
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

const ChartStock: FC = function () {
  // Parameter state
  const currentDate = new Date();
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);

  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="shrink-0">
          <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400">
            Grafik Inventori
          </h3>
          <span className="text-sm text-gray-400">
            Grafik stok barang per bulan
          </span>
        </div>
        <div className="flex items-center justify-end gap-2 text-base font-bold text-green-600 dark:text-green-400">
          <div className="mb-4 flex items-center sm:mb-0">
            <button
              onClick={() => {
                const prevMonth = month - 1;
                if (prevMonth < 1) {
                  setMonth(12);
                  setYear(year - 1);
                } else {
                  setMonth(prevMonth);
                }
              }}
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              <span className="sr-only">Previous month</span>
              <HiChevronLeft className="text-2xl" />
            </button>
            <button
              onClick={() => {
                const nextMonth = month + 1;
                if (nextMonth > 12) {
                  setMonth(1);
                  setYear(year + 1);
                } else {
                  setMonth(nextMonth);
                }
              }}
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              <span className="sr-only">Next month</span>
              <HiChevronRight className="text-2xl" />
            </button>
          </div>

          <Select
            sizing="sm"
            className="relative cursor-pointer"
            id="showingCount"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
          >
            <option value="1" defaultChecked>
              Januari
            </option>
            <option value="2">Februari</option>
            <option value="3">Maret</option>
            <option value="4">April</option>
            <option value="5">Mei</option>
            <option value="6">Juni</option>
            <option value="7">Juli</option>
            <option value="8">Agustus</option>
            <option value="9">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
          </Select>

          <Select
            sizing="sm"
            className="relative w-20 cursor-pointer"
            id="showingCount"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          >
            <option value="2025" defaultChecked>
              2025
            </option>
            <option value="2024">2024</option>
          </Select>

          <Button
            size="sm"
            color="gray"
            className="flex items-center gap-1 p-0 text-gray-500"
            onClick={() => {
              setYear(currentDate.getFullYear());
              setMonth(currentDate.getMonth() + 1);
            }}
          >
            <HiRefresh className="h-5 w-5" />
            Reset
          </Button>
        </div>
      </div>
      <InventoryChart year={year} month={month} />
    </div>
  );
};

const InventoryChart: FC<{ year: number; month: number }> = function ({
  year,
  month,
}) {
  const { token } = useAuth();

  const daysCount = new Date(year, month, 0).getDate();
  const initializeArray = (length: number) => Array.from({ length }, () => 0);

  const [data, setData] = useState<ChartResponseProps>({
    year: year,
    month: month,
    daysCount: daysCount,
    totalStock: initializeArray(daysCount),
    details: {
      electronic: {
        stock: initializeArray(daysCount),
        inbound: initializeArray(daysCount),
        outbound: initializeArray(daysCount),
      },
      cosmetic: {
        stock: initializeArray(daysCount),
        inbound: initializeArray(daysCount),
        outbound: initializeArray(daysCount),
      },
      fnb: {
        stock: initializeArray(daysCount),
        inbound: initializeArray(daysCount),
        outbound: initializeArray(daysCount),
      },
    },
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${CONFIG.API_URL}/dashboard/chart?year=${year}&month=${month}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) throw new Error(response.data.message);

      setData(response.data.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
      setLoading(false);
    }
  }, [year, month, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { mode } = useTheme();
  const isDarkTheme = mode === "dark";

  const borderColor = isDarkTheme ? "#374151" : "#F3F4F6";
  const labelColor = isDarkTheme ? "#93ACAF" : "#6B7280";
  const opacityFrom = isDarkTheme ? 0 : 1;
  const opacityTo = isDarkTheme ? 0 : 1;

  const options: ApexCharts.ApexOptions = {
    stroke: {
      curve: "straight",
    },
    chart: {
      type: "bar",
      fontFamily: "Inter, sans-serif",
      foreColor: labelColor,
      toolbar: {
        show: false,
      },
      // stacked: true,
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom,
        opacityTo,
        type: "vertical",
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      style: {
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
      },
    },
    grid: {
      show: true,
      borderColor: borderColor,
      strokeDashArray: 1,
      padding: {
        left: 35,
        bottom: 15,
      },
    },
    markers: {
      size: 5,
      strokeColors: "#ffffff",
      hover: {
        size: undefined,
        sizeOffset: 3,
      },
    },
    xaxis: {
      categories: Array.from({ length: data.daysCount }, (_, i) => i + 1),
      labels: {
        style: {
          colors: [labelColor],
          fontSize: "14px",
          fontWeight: 500,
        },
      },
      axisBorder: {
        color: borderColor,
      },
      axisTicks: {
        color: borderColor,
      },
      crosshairs: {
        show: true,
        position: "back",
        stroke: {
          color: borderColor,
          width: 1,
          dashArray: 10,
        },
      },
    },
    yaxis: {
      max: () => Math.max(...data.totalStock),
      labels: {
        style: {
          colors: [labelColor],
          fontSize: "14px",
          fontWeight: 500,
        },
        formatter: function (value) {
          return `${Math.ceil(value)}`;
        },
      },
    },
    legend: {
      fontSize: "14px",
      fontWeight: 500,
      fontFamily: "Inter, sans-serif",
      labels: {
        colors: [labelColor],
      },
      itemMargin: {
        horizontal: 10,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          xaxis: {
            labels: {
              show: false,
            },
          },
        },
      },
    ],
  };
  const series: ApexAxisChartSeries = [
    {
      type: "column",
      name: "Stok Elektronik",
      data: data.details.electronic.stock,
      color: "#1A56DB", // Blue
    },
    {
      type: "column",
      name: "Stok Kosmetik",
      data: data.details.cosmetic.stock,
      color: "#F59E0B", // Orange
    },
    {
      type: "column",
      name: "Stok F&B",
      data: data.details.fnb.stock,
      color: "#10B981", // Green
    },
    {
      type: "line",
      name: "Total Stok",
      data: data.totalStock,
      color: "#6B7280", // Gray for clarity
    },
    {
      type: "line",
      name: "Elektronik Masuk",
      data: data.details.electronic.inbound,
      color: "#1A56DB", // Blue (same as "Stok Elektronik")
    },
    {
      type: "line",
      name: "Kosmetik Masuk",
      data: data.details.cosmetic.inbound,
      color: "#F59E0B", // Orange (same as "Stok Kosmetik")
    },
    {
      type: "line",
      name: "F&B Masuk",
      data: data.details.fnb.inbound,
      color: "#10B981", // Green (same as "Stok F&B")
    },
    {
      type: "line",
      name: "Elektronik Keluar",
      data: data.details.electronic.outbound,
      color: "#1A56DB", // Blue (same as "Stok Elektronik")
    },
    {
      type: "line",
      name: "Kosmetik Keluar",
      data: data.details.cosmetic.outbound,
      color: "#F59E0B", // Orange (same as "Stok Kosmetik")
    },
    {
      type: "line",
      name: "F&B Keluar",
      data: data.details.fnb.outbound,
      color: "#10B981", // Green (same as "Stok F&B")
    },
  ];

  if (loading)
    return (
      <div className="flex h-[420px] items-center justify-center text-gray-500">
        Memuat grafik...
      </div>
    );

  if (error)
    return (
      <div className="flex h-[420px] items-center justify-center text-red-500">
        {error}
      </div>
    );

  return <Chart height={420} options={options} series={series} type="area" />;
};

const ProductCountPerCategory: FC<PerCategoryProps> = function ({
  electronic,
  cosmetic,
  fnb,
  state,
}) {
  const maxCount = Math.max(electronic, cosmetic, fnb);

  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="mb-4 shrink-0">
        <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400">
          Jenis Barang
        </h3>
        <span className="text-sm text-gray-400">
          Jumlah jenis barang untuk masing-masing kategori
        </span>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow sm:rounded-lg">
              {state.loading ? (
                <div className="flex h-64 w-full items-center justify-center text-center text-gray-500">
                  Memuat data...
                </div>
              ) : state.error ? (
                <div className="flex h-64 w-full items-center justify-center text-center text-red-500">
                  {state.error}
                </div>
              ) : (
                <Table className="min-w-full table-fixed">
                  <Table.Head>
                    <Table.HeadCell className="whitespace-nowrap rounded-l border-x-0 bg-gray-50 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-700 dark:bg-gray-700 dark:text-white">
                      Kategori
                    </Table.HeadCell>
                    <Table.HeadCell className="whitespace-nowrap border-x-0 bg-gray-50 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-700 dark:bg-gray-700 dark:text-white">
                      Jumlah Jenis Barang
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y divide-gray-100 dark:divide-gray-700">
                    <Table.Row className="text-gray-500 dark:text-gray-400">
                      <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
                        Elektronik
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle font-medium text-gray-900 dark:text-white">
                        <div className="relative flex w-full flex-col gap-2">
                          <span>{electronic}</span>
                          <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-2 rounded-sm bg-primary-700"
                              style={{
                                width: `${(electronic / maxCount) * maxCount}%`,
                              }}
                            />
                          </div>
                        </div>
                      </Table.Cell>
                    </Table.Row>

                    <Table.Row className="text-gray-500 dark:text-gray-400">
                      <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
                        Kosmetik
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle font-medium text-gray-900 dark:text-white">
                        <div className="relative flex w-full flex-col gap-2">
                          <span>{cosmetic}</span>
                          <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-2 rounded-sm bg-primary-700"
                              style={{
                                width: `${(cosmetic / maxCount) * maxCount}%`,
                              }}
                            />
                          </div>
                        </div>
                      </Table.Cell>
                    </Table.Row>

                    <Table.Row className="text-gray-500 dark:text-gray-400">
                      <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
                        F&B
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle font-medium text-gray-900 dark:text-white">
                        <div className="relative flex w-full flex-col gap-2">
                          <span>{fnb}</span>
                          <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-2 rounded-sm bg-primary-700"
                              style={{
                                width: `${(fnb / maxCount) * maxCount}%`,
                              }}
                            />
                          </div>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StockPerCategory: FC<PerCategoryProps> = function ({
  electronic,
  cosmetic,
  fnb,
  state,
}) {
  const maxCount = Math.max(electronic, cosmetic, fnb);

  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="mb-4 shrink-0">
        <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400">
          Jumlah Stok
        </h3>
        <span className="text-sm text-gray-400">
          Jumlah stok barang untuk masing-masing kategori
        </span>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow sm:rounded-lg">
              {state.loading ? (
                <div className="flex h-64 w-full items-center justify-center text-center text-gray-500">
                  Memuat data...
                </div>
              ) : state.error ? (
                <div className="flex h-64 w-full items-center justify-center text-center text-red-500">
                  {state.error}
                </div>
              ) : (
                <Table className="min-w-full table-fixed">
                  <Table.Head>
                    <Table.HeadCell className="whitespace-nowrap rounded-l border-x-0 bg-gray-50 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-700 dark:bg-gray-700 dark:text-white">
                      Kategori
                    </Table.HeadCell>
                    <Table.HeadCell className="whitespace-nowrap border-x-0 bg-gray-50 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-700 dark:bg-gray-700 dark:text-white">
                      Jumlah Stok
                    </Table.HeadCell>
                  </Table.Head>

                  <Table.Body className="divide-y divide-gray-100 dark:divide-gray-700">
                    <Table.Row className="text-gray-500 dark:text-gray-400">
                      <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
                        Elektronik
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle font-medium text-gray-900 dark:text-white">
                        <div className="relative flex w-full flex-col gap-2">
                          <span>{electronic}</span>
                          <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-2 rounded-sm bg-primary-700"
                              style={{
                                width: `${(electronic / maxCount) * maxCount}%`,
                              }}
                            />
                          </div>
                        </div>
                      </Table.Cell>
                    </Table.Row>

                    <Table.Row className="text-gray-500 dark:text-gray-400">
                      <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
                        Kosmetik
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle font-medium text-gray-900 dark:text-white">
                        <div className="relative flex w-full flex-col gap-2">
                          <span>{cosmetic}</span>
                          <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-2 rounded-sm bg-primary-700"
                              style={{
                                width: `${(cosmetic / maxCount) * maxCount}%`,
                              }}
                            />
                          </div>
                        </div>
                      </Table.Cell>
                    </Table.Row>

                    <Table.Row className="text-gray-500 dark:text-gray-400">
                      <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
                        F&B
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle font-medium text-gray-900 dark:text-white">
                        <div className="relative flex w-full flex-col gap-2">
                          <span>{fnb}</span>
                          <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-2 rounded-sm bg-primary-700"
                              style={{
                                width: `${(fnb / maxCount) * maxCount}%`,
                              }}
                            />
                          </div>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TopProductPerCategory: FC<TopProductPerCategoryProps> = function ({
  electronic,
  cosmetic,
  fnb,
  state,
}) {
  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="mb-4 shrink-0">
        <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400">
          Produk dengan Stok Terbanyak
        </h3>
        <span className="text-sm text-gray-400">
          Produk dengan stok terbanyak pada masing-masing kategori
        </span>
      </div>

      {state.loading ? (
        <div className="flex h-[420px] items-center justify-center text-gray-500">
          Memuat data...
        </div>
      ) : state.error ? (
        <div className="flex h-[420px] items-center justify-center text-red-500">
          {state.error}
        </div>
      ) : (
        <>
          <ProductListByCategory products={electronic} />
          <ProductListByCategory products={cosmetic} />
          <ProductListByCategory products={fnb} />
        </>
      )}
    </div>
  );
};

const ProductListByCategory: FC<{ products: ProductSummaryProps[] }> =
  function ({ products }) {
    return (
      <div className="mt-8 flex flex-col">
        <h4 className="mb-4 text-lg font-bold text-gray-600">
          Kategori Elektronik
        </h4>
        <div className="overflow-x-auto rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow sm:rounded-lg">
              <Table
                striped
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-600"
              >
                <Table.Head className="bg-gray-50 dark:bg-gray-700">
                  <Table.HeadCell>Kode SKU</Table.HeadCell>
                  <Table.HeadCell>Nama Produk</Table.HeadCell>
                  <Table.HeadCell>Stok</Table.HeadCell>
                </Table.Head>
                <Table.Body className="bg-white dark:bg-gray-800">
                  {products.length > 0 &&
                    products.map((product) => (
                      <Table.Row key={product.id}>
                        <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                          {product.skuCode}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                          {product.name}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                          {product.stock}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default DashboardPage;
