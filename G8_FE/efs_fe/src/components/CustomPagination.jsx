import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export const CustomPagination = ({ totalPages, currentPage, onPageChange }) => {
    const handleChange = (event, value) => {
        onPageChange(value);
    };

    if (totalPages <= 1) return null;

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