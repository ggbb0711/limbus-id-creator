'use client'
import React, { ReactElement } from "react";
import ReactPaginate from "react-paginate";
import "./Pagination.css";

interface PaginationNavProps {
    page: number
    pageCount: number
    onChange: (page: number) => void
    compact?: boolean
    className?: string
}

export const pageCountOf = (total: number, pageLimit: number) => Math.ceil(total / Math.max(1, pageLimit))

export function PaginationNav({ page, pageCount, onChange, compact = false, className = "" }: PaginationNavProps): ReactElement {
    return <ReactPaginate className={`center-element paginated-bullet-point-container ${className}`.trim()}
        pageCount={pageCount}
        forcePage={Math.min(page, Math.max(0, pageCount - 1))}
        onPageChange={(e) => onChange(e.selected)}
        pageClassName="paginated-bullet-point"
        activeClassName="paginated-bullet-point active"
        breakLabel={"..."}
        {...(compact ? { pageRangeDisplayed: 2, marginPagesDisplayed: 1 } : {})}
        previousLabel={<p className="paginated-bullet-point">PREV</p>}
        nextLabel={<p className="paginated-bullet-point">NEXT</p>}/>
}
