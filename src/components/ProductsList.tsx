import { Box, Card, CardActions, CardContent, CardMedia, CircularProgress, Container, Grid2 as Grid, IconButton, Pagination, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Product } from "../interface/Product";
import { Add, Check, Favorite, FavoriteBorderOutlined } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeOneFromCart, CartState } from "../redux/cartD";
import { FavState, handleFav } from "../redux/favourites";

function ProductsList() {
  const url: string = 'https://dummyjson.com/products';
  const limit: number = 10;
  const dispatch = useDispatch();
  const cartItems = useSelector((state: { cart: CartState }) => state.cart.items);
  const favItems = useSelector((state: { fav: FavState }) => state.fav.items);

  const [count, setCount] = useState<number>(0);
  const [skip, setSkip] = useState<number>(0);
  const [data, setData] = useState<Product[] | null>(null);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  async function getData() {
    setLoading(true);    
    try {
      await fetch(`${url}?limit=${limit}&skip=${skip}`)
        .then(res => res.json())
        .then(data => {
          setCount(Math.ceil(data.total / limit))
          setData(data.products)})
    }
    catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  }

  function handlePage(page: number) {
    setPage(page);
    setSkip(page * limit - limit);
  }

  //cart

  function handleAddToCart(id: number, quantity: number) {
    dispatch(addToCart({
      id: id,
      quantity: quantity
    }))
  }

  function handleRemoveOneFromCart(id: number) {
    dispatch(removeOneFromCart(id))
  }

  function isInCart(id: number) {
    return !cartItems.find(item => item.id == id);
  }

  //favs

  function changeFav(id: number) {
    dispatch(handleFav(id))
  }

  function isFav(id: number) {
    return !favItems.find(item => item.id == id);
  }

  //first page load
  useEffect(() => {
    getData();
  }, []);

  //after each skip change
  useEffect(() => {
    getData();
  }, [skip]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width="100vw"
        position="fixed"
        top={0}
        left={0}
        bgcolor="white"
        zIndex={1300}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container>
      <Grid container spacing={2} justifyContent="center">
        {data ? (
          data.map((item, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 6 }}>
              <Card sx={{ Width: 345 }}>
                <CardMedia
                  sx={{ height: 300 }}
                  image={item.images[0]}
                  title={item.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h4" component="div">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {item.description}
                  </Typography>
                  <Typography variant="h5" component="div" sx={{ marginTop: 'auto', textAlign: 'right' }}>
                    {item.price}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton aria-label="add/remove to favorites" onClick={() => changeFav(item.id)}>
                    {isFav(item.id) ? (
                      <FavoriteBorderOutlined />
                    ) : (
                      <Favorite />
                    )
                    }
                  </IconButton>
                  {isInCart(item.id) ? (
                    <IconButton aria-label="add to cart" onClick={() => handleAddToCart(item.id, 1)}>
                      <Add />
                      <p>add to cart</p>
                    </IconButton>
                  ) : (
                    <IconButton aria-label="add to cart" onClick={() => handleRemoveOneFromCart(item.id)}>
                      <Check />
                      <p>added to cart</p>
                    </IconButton>
                  )
                  }
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <p>There is nothing</p>
        )}
      </Grid>
      <Stack spacing={2} sx={{ marginTop: 2 }}>
        <Pagination count={count} variant="outlined" page={page} onChange={(event, value) => handlePage(value)} />
      </Stack>
    </Container>
  );
}

export default ProductsList
