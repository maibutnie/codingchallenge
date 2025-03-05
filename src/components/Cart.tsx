import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Box, Button, Card, CardContent, CardMedia, Container, Divider, IconButton, Typography } from "@mui/material";
import { Product } from "../interface/Product";
import { useEffect, useState } from "react";
import { addToCart, removeAll } from "../redux/cartD";
import { Add, Delete, Favorite, FavoriteBorderOutlined, Remove } from "@mui/icons-material";
import { FavState, handleFav } from "../redux/favourites";

function Cart() {
  const url: string = 'https://dummyjson.com/products';
  const dispatch = useDispatch();
  const carts = useSelector((store: RootState) => store.cart.items);
  const favItems = useSelector((state: { fav: FavState }) => state.fav.items);

  const [data, setData] = useState<Product[]>([]);

  async function getData(id: number) {
    try {
      await fetch(`${url}/${id}`)
        .then(res => res.json())
        .then(res => setData(prevData => prevData ? [...prevData, res] : [res]))
    }
    catch (error) {
      console.error("Error:", error);
    }
  }

  function handleAddToCart(id: number, quantity: number) {
    dispatch(addToCart({
      id: id,
      quantity: quantity
    }))
  }

  function handleRemoveAll() {
    dispatch(removeAll())
  }

  function getQuantity(id: number) {
    const index = carts.findIndex(item => item.id == id);
    if (index >= 0) return carts[index].quantity;
    return 0
  }

  function getSum() {
    let sum = 0;
    carts.forEach(item => {
      const index = data.findIndex(itemFull => itemFull.id == item.id);
      if (index >= 0) sum += data[index].price * item.quantity;
    })
    return sum.toFixed(2)
  }

  //favs

  function isFav(id: number) {
    return !favItems.find(item => item.id == id);
  }

  function changeFav(id: number) {
    dispatch(handleFav(id))
  }

  //better compare arrays than set to [], longer x(inf)
  useEffect(() => {
    carts.forEach(cartItem => {
      const itemExists = data.some(item => item.id === cartItem.id);
      if (!itemExists) {
        getData(cartItem.id);
      }
    });

    setData(prevData => prevData.filter(item => carts.some(cartItem => cartItem.id === item.id)));
  }, [carts]);

  return (
    <Container maxWidth="sm">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">My Products</Typography>
        <Button variant="text" color="inherit" onClick={() => handleRemoveAll()}>
          Delete all
        </Button>
      </Box>

      {data.map((item) => (
        <Card key={item.id} sx={{ display: "flex", alignItems: "center", mb: 2, p: 2 }}>
          <CardMedia component="img" image={item.images[0]} sx={{ width: 50, height: 50, mr: 2 }} />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="body1" fontWeight="bold">
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.category}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {item.price.toFixed(2)} €
            </Typography>
          </CardContent>

          <IconButton aria-label="add/remove to favorites" onClick={() => changeFav(item.id)}>
            {isFav(item.id) ? (
              <FavoriteBorderOutlined />
            ) : (
              <Favorite />
            )}
          </IconButton>

          <Box display="flex" alignItems="center" mx={2}>
            <IconButton size="small" onClick={() => handleAddToCart(item.id, -1)}>
              <Remove />
            </IconButton>
            <Typography variant="body1" mx={1}>
              {getQuantity(item.id)}
            </Typography>
            <IconButton size="small" onClick={() => handleAddToCart(item.id, 1)}>
              <Add />
            </IconButton>
          </Box>

          <IconButton>
            <Delete />
          </IconButton>
        </Card>
      ))}

      <Box mt={3}>
        <Typography variant="h6">Subtotal: {getSum()} €</Typography>
        <Typography variant="h6">Shipping: 10 €</Typography>
        <Divider />
        <Typography variant="h6">Total (EUR): {(Number(getSum()) + 10).toFixed(2)} €</Typography>
      </Box>

      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Confirm order
      </Button>
    </Container>
  );
}

export default Cart
