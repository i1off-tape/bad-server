export function getPagination(queryPage: unknown, queryLimit: unknown) {
    const page = Math.max(Number(queryPage) || 1, 1)
    const limit = Math.min(Math.max(Number(queryLimit) || 10, 1), 10)

    return {
        page,
        limit,
        skip: (page - 1) * limit,
    }
}
