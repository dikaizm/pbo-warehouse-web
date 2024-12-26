import { FC } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface PaginationProps {
    page: number;
    limit: number;
    totalData: number;
    totalPage: number;
    hasNext: boolean;
    hasPrev: boolean;
    onPrev: () => void;
    onNext: () => void;
}

export const Pagination: FC<PaginationProps> = function ({ page, limit, totalData, totalPage, hasNext, hasPrev, onPrev, onNext }) {
    return (
        <div className="sticky right-0 bottom-0 w-full items-center border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex sm:justify-between">
            <div className="mb-4 flex items-center sm:mb-0">
                <button
                    onClick={onPrev}
                    disabled={!hasPrev}
                    className={"inline-flex cursor-pointer justify-center rounded p-1 " + (hasPrev ? "text-gray-500 hover:bg-gray-100 hover:text-gray-900" : "text-gray-300")}
                >
                    <span className="sr-only">Previous page</span>
                    <HiChevronLeft className="text-2xl" />
                </button>
                <button
                    onClick={onNext}
                    disabled={!hasNext}
                    className={"inline-flex cursor-pointer justify-center rounded p-1 " + (hasNext ? "text-gray-500 hover:bg-gray-100 hover:text-gray-900" : "text-gray-300")}
                >
                    <span className="sr-only">Next page</span>
                    <HiChevronRight className="text-2xl" />
                </button>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    Showing&nbsp;
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {(page - 1) * limit + 1}-{page * limit}
                    </span>
                    &nbsp;of&nbsp;
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {totalData}
                    </span>
                </span>
            </div>
            <div className="flex items-center space-x-3">
                <button
                    onClick={onPrev}
                    disabled={!hasPrev}
                    className={"inline-flex flex-1 items-center justify-center rounded-lg  py-2 px-3 text-center text-sm font-medium text-white  focus:ring-4 focus:ring-primary-300 " + (hasPrev ? "bg-primary-700 hover:bg-primary-800" : " bg-gray-300 text-gray-400")}
                >
                    <HiChevronLeft className="mr-1 text-base" />
                    Previous
                </button>
                <button
                    onClick={onNext}
                    disabled={!hasNext}
                    className={"inline-flex flex-1 items-center justify-center rounded-lg  py-2 px-3 text-center text-sm font-medium text-white  focus:ring-4 focus:ring-primary-300 " + (hasNext ? "bg-primary-700 hover:bg-primary-800" : " bg-gray-300 text-gray-400")}
                >
                    Next
                    <HiChevronRight className="ml-1 text-base" />
                </button>
            </div>
        </div>
    );
};