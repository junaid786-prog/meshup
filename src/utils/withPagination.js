const withPagination = async (model, page = 1, limit = 10, query = {}, sort = {}, populate, selectedFields) => {
    // Parse page and limit to ensure they are integers and have reasonable defaults
    const currentPage = Math.max(parseInt(page, 10), 1);
    const itemsPerPage = Math.max(parseInt(limit, 10), 1);

    try {
        // Calculate the total number of items that match the query
        const totalItems = await model.countDocuments(query);

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // Apply pagination to the query
        const items = await model
            ?.find(query)
            .select(selectedFields)
            .populate(populate)
            .sort(sort)
            .skip((currentPage - 1) * itemsPerPage)
            .limit(itemsPerPage);

        // Return paginated results with metadata
        return {
            data: items,
            pagination: {
                totalResults: totalItems,
                totalPages,
                currentPage,
                itemsPerPage,
                nextPage: currentPage < totalPages ? currentPage + 1 : null,
                prevPage: currentPage > 1 ? currentPage - 1 : null
            }
        };
    } catch (error) {
        throw new Error(`Pagination error: ${error.message}`);
    }
};

module.exports = withPagination;