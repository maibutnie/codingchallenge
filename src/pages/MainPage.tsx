import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Cart from "../components/Cart";
import ProductsList from "../components/ProductsList";
import Header from "../components/Header";

function MainPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  return (
    <Box display="flex" flexDirection={isMobile ? "column" : "row"} p={1}>
      <Box flexGrow={1}>
        <Typography variant="h4" gutterBottom>
          My Shopping List
        </Typography>
        <Header />
        <ProductsList />
      </Box>

      <Box sx={{ width: isMobile ? '100%' : 400, position: "sticky", top: 20, alignSelf: "flex-start" }}>
        <Cart />
      </Box>
    </Box>
  );
}

export default MainPage;
