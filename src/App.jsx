import { useMemo, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  Divider,
} from "@mui/material";

const PRODUCTS = [
  { name: "Product A", price: 100 },
  { name: "Product B", price: 200 },
  { name: "Product C", price: 350 },
];

export default function App() {
  // form state
  const [itemName, setItemName] = useState(PRODUCTS[0].name);
  const [pricePerUnit, setPricePerUnit] = useState(PRODUCTS[0].price);
  const [qty, setQty] = useState(1);
  const [discount, setDiscount] = useState(0); // discount per row

  // table state
  const [rows, setRows] = useState([
    // demo rows (you can delete later / replace with JSON prefill)
    { id: 1, name: "Product B", price: 200, qty: 1, discount: 0 },
    { id: 2, name: "Product B", price: 200, qty: 10, discount: 0 },
  ]);

  const subtotal = useMemo(() => {
    return rows.reduce((sum, r) => sum + r.price * r.qty - r.discount, 0);
  }, [rows]);

  const totalDiscount = useMemo(() => {
    return rows.reduce((sum, r) => sum + (Number(r.discount) || 0), 0);
  }, [rows]);

  function handleClear() {
    setRows([]);
  }

  function handleAdd() {
    const newRow = {
      id: Date.now(),
      name: itemName,
      price: Number(pricePerUnit) || 0,
      qty: Number(qty) || 0,
      discount: Number(discount) || 0,
    };

    setRows((prev) => [...prev, newRow]);

    // reset discount only (optional)
    setDiscount(0);
  }

  function handleDelete(id) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Quotation
      </Typography>

      <Grid container spacing={3}>
        {/* LEFT FORM */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <TextField
              select
              fullWidth
              label="Item"
              value={itemName}
              onChange={(e) => {
                const selected = PRODUCTS.find((p) => p.name === e.target.value);
                setItemName(e.target.value);
                setPricePerUnit(selected?.price ?? 0);
              }}
              margin="dense"
            >
              {PRODUCTS.map((p) => (
                <MenuItem key={p.name} value={p.name}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              type="number"
              label="Price Per Unit"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(e.target.value)}
              margin="dense"
            />

            <TextField
              fullWidth
              type="number"
              label="Quantity"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              margin="dense"
            />

            {/* ✅ Discount input field (required by exam) */}
            <TextField
              fullWidth
              type="number"
              label="Discount (per row)"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              margin="dense"
              helperText="Discount is applied once per row (not multiplied by qty)"
            />

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleAdd}
            >
              Add
            </Button>
          </Paper>
        </Grid>

        {/* RIGHT TABLE */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Typography variant="h6" fontWeight={700}>
                Quotation
              </Typography>
              <Button variant="outlined" onClick={handleClear}>
                Clear
              </Button>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width={80}>Action</TableCell>
                  <TableCell align="right" width={80}>
                    Qty
                  </TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell align="right" width={120}>
                    Price/Unit
                  </TableCell>

                  {/* ✅ Discount column (required by exam) */}
                  <TableCell align="right" width={120}>
                    Discount
                  </TableCell>

                  <TableCell align="right" width={140}>
                    Amount
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((r) => {
                  const amount = r.price * r.qty - (Number(r.discount) || 0);
                  return (
                    <TableRow key={r.id}>
                      <TableCell>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDelete(r.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                      <TableCell align="right">{r.qty}</TableCell>
                      <TableCell>{r.name}</TableCell>
                      <TableCell align="right">{r.price.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        {(Number(r.discount) || 0).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">{amount.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} align="right" sx={{ fontWeight: 700 }}>
                    Total Discount
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {totalDiscount.toFixed(2)}
                  </TableCell>
                  <TableCell />
                </TableRow>

                <TableRow>
                  <TableCell colSpan={5} align="right" sx={{ fontWeight: 700 }}>
                    Total
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {subtotal.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
