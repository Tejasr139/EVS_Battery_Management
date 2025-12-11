import { Pagination, Stack } from '@mui/material';

export const SimplePagination = ({ totalPages, currentPage, onPageChange }) => {
    if (totalPages <= 1) return null;

    const handleChange = (event, value) => {
        onPageChange(value);
    };

    return (
        <Stack spacing={2} alignItems="center" sx={{ mt: 3 }}>
            <Pagination 
                count={totalPages} 
                page={currentPage}
                onChange={handleChange}
                color="primary"
                size="large"
                showFirstButton 
                showLastButton
            />
        </Stack>
    );
};