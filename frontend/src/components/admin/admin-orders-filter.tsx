import { ordersActions, ordersSelector } from '@slices/orders'
import { StatusType } from '@types'
import { useActionCreators, useDispatch, useSelector } from '@store/hooks'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fetchOrdersWithFilters } from '../../services/slice/orders/thunk'
import { FiltersOrder } from '../../services/slice/orders/type'
import { AppRoute } from '../../utils/constants'
import Filter from '../filter'
import styles from './admin.module.scss'
import { ordersFilterFields } from './helpers/ordersFilterFields'
import { FilterValue, FilterValues } from '../../utils/types'

const getStatusFilterValue = (
    status: FilterValue
): FiltersOrder['status'] | undefined => {
    const value =
        status && typeof status === 'object' && 'value' in status
            ? status.value
            : status

    if (value === '') {
        return ''
    }

    if (
        typeof value === 'string' &&
        Object.values(StatusType).includes(value as StatusType)
    ) {
        return value as StatusType
    }

    return undefined
}

export default function AdminFilterOrders() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [_, setSearchParams] = useSearchParams()

    const { updateFilter, clearFilters } = useActionCreators(ordersActions)
    const filterOrderOption = useSelector(ordersSelector.selectFilterOption)

    const handleFilter = (filters: FilterValues) => {
        const status = getStatusFilterValue(filters.status)
        dispatch(
            updateFilter({
                ...filters,
                status,
            })
        )
        const queryParams: { [key: string]: string } = {}
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                queryParams[key] =
                    typeof value === 'object' ? value.value : value.toString()
            }
        })
        setSearchParams(queryParams)
        navigate(
            `${AppRoute.AdminOrders}?${new URLSearchParams(queryParams).toString()}`
        )
    }

    const handleClearFilters = () => {
        dispatch(clearFilters())
        setSearchParams({})
        dispatch(fetchOrdersWithFilters({}))
        navigate(AppRoute.AdminOrders)
    }

    return (
        <>
            <h2 className={styles.admin__title}>Фильтры</h2>
            <Filter
                fields={ordersFilterFields}
                onFilter={handleFilter}
                onClear={handleClearFilters}
                defaultValue={filterOrderOption}
            />
        </>
    )
}
