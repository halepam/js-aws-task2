import Products from "~/components/pages/PageProducts/components/Products";
import Box from "@mui/material/Box";

export default function PageProducts() {
  return (
    <Box py={3}>
      <p>Hello, My change counter is (4)</p>
      <Products />
    </Box>
  );
}
