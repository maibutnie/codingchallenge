import { Box, Typography } from "@mui/material";
import Cart from "../components/Cart";
import ProductsList from "../components/ProductsList";
import Header from "../components/Header";

function MainPage() {
  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box flexGrow={1}>
        <Typography variant="h4" gutterBottom>
          My Shopping List
        </Typography>
        <Header />
        <ProductsList />
      </Box>

      <Box sx={{ width: 400, position: "sticky", top: 20, alignSelf: "flex-start" }}>
        <Cart />
      </Box>
    </Box>
  );
}

export default MainPage;
