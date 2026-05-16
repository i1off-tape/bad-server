import { AsyncThunk } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from '@store/hooks'
import { RootState } from '@store/store'
import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

type PaginationParams = Record<string, string | number | undefined>

type PaginationResponse = {
    pagination: {
        totalPages: number
    }
}

interface PaginationResult<_, U> {
    data: U[]
    totalPages: number
    currentPage: number
    limit: number
    nextPage: () => void
    prevPage: () => void
    setPage: (page: number) => void
    setLimit: (limit: number) => void
}

const usePagination = <T extends PaginationResponse, U>(
    asyncAction: AsyncThunk<T, Record<string, unknown>, { state: RootState }>,
    selector: (state: RootState) => U[],
    defaultLimit: number
): PaginationResult<T, U> => {
    const dispatch = useDispatch()
    const data = useSelector(selector)
    const [searchParams, setSearchParams] = useSearchParams()
    const [totalPages, setTotalPages] = useState<number>(1)

    const currentPage = Math.min(
        Number(searchParams.get('page')) || 1,
        totalPages
    )

    const limit = Number(searchParams.get('limit')) || defaultLimit

    const updateURL = useCallback(
        (newParams: PaginationParams) => {
            const updatedParams = new URLSearchParams(searchParams)
            Object.entries(newParams).forEach(([key, value]) => {
                if (value !== undefined) {
                    updatedParams.set(key, value.toString())
                } else {
                    updatedParams.delete(key)
                }
            })
            setSearchParams(updatedParams)
        },
        [searchParams, setSearchParams]
    )

    const setPage = useCallback(
        (page: number) => {
            const newPage = Math.max(1, Math.min(page, totalPages))
            updateURL({ page: newPage, limit })
        },
        [limit, totalPages, updateURL]
    )

    const fetchData = useCallback(
        async (params: Record<string, unknown>) => {
            const response = await dispatch(asyncAction(params))

            if (asyncAction.fulfilled.match(response)) {
                setTotalPages(response.payload.pagination.totalPages)
            }
        },
        [asyncAction, dispatch]
    )

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries())
        fetchData({ ...params, page: currentPage, limit }).then(() => {
            if (data.length === 0 && currentPage > 1) {
                setPage(1)
            }
        })
    }, [currentPage, limit, searchParams, fetchData, data.length, setPage])

    const nextPage = useCallback(() => {
        if (currentPage < totalPages) {
            updateURL({ page: currentPage + 1, limit })
        }
    }, [currentPage, limit, totalPages, updateURL])

    const prevPage = useCallback(() => {
        if (currentPage > 1) {
            updateURL({ page: currentPage - 1, limit })
        }
    }, [currentPage, limit, updateURL])

    const setLimit = useCallback(
        (newLimit: number) => {
            updateURL({ page: 1, limit: newLimit }) // При изменении лимита возвращаемся на первую страницу
        },
        [updateURL]
    )

    return {
        data,
        totalPages,
        currentPage,
        limit,
        nextPage,
        prevPage,
        setPage,
        setLimit,
    }
}

export default usePagination
