import React from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

const Pagination = ({ pagination, handlePageChange }) => {
  const { currentPage, totalPages } = pagination;
  
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-2" role="navigation" aria-label="Pagination">
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className="p-2 rounded border border-gray-300 disabled:opacity-50 hover:bg-[#dac0a3] transition"
        aria-label="First page"
      >
        <FiChevronsLeft />
      </button>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded border border-gray-300 disabled:opacity-50 hover:bg-[#dac0a3] transition"
        aria-label="Previous page"
      >
        <FiChevronLeft />
      </button>
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        let pageNum;
        if (totalPages <= 5) {
          pageNum = i + 1;
        } else if (currentPage <= 3) {
          pageNum = i + 1;
        } else if (currentPage >= totalPages - 2) {
          pageNum = totalPages - 4 + i;
        } else {
          pageNum = currentPage - 2 + i;
        }
        return (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`px-3 py-1 sm:px-4 sm:py-2 rounded border ${currentPage === pageNum ? 'bg-[#0f2c59] text-white border-[#0f2c59]' : 'border-gray-300 hover:bg-[#dac0a3]'} transition text-sm sm:text-base`}
            aria-current={currentPage === pageNum ? 'page' : undefined}
            aria-label={`Page ${pageNum}`}
          >
            {pageNum}
          </button>
        );
      })}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded border border-gray-300 disabled:opacity-50 hover:bg-[#dac0a3] transition"
        aria-label="Next page"
      >
        <FiChevronRight />
      </button>
      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2 rounded border border-gray-300 disabled:opacity-50 hover:bg-[#dac0a3] transition"
        aria-label="Last page"
      >
        <FiChevronsRight />
      </button>
    </div>
  );
};

export default React.memo(Pagination);