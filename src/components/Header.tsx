import { Add, Favorite, FavoriteBorderOutlined } from "@mui/icons-material";
import { Box, Card, CardContent, CardMedia, IconButton, Popover, TextField, Typography } from "@mui/material";
import { useState } from "react";
import CreateDialog from "./CreateDialog";
import { Product } from "../interface/Product";
import { useDispatch, useSelector } from "react-redux";
import { FavState, handleFav } from "../redux/favourites";
import { RootState } from "../redux/store";
import { addToCart } from "../redux/cartD";

function Header() {
    const url: string = 'https://dummyjson.com/products/search?q=';
    const favItems = useSelector((state: { fav: FavState }) => state.fav.items);
    const carts = useSelector((store: RootState) => store.cart.items);
    const dispatch = useDispatch();

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    function handleDialog() {
        setDialogOpen(!dialogOpen);
    };

    async function handleSearch(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter" && searchTerm.trim() !== "") {
            try {
                const target = event.currentTarget;

                await fetch(url + searchTerm)
                    .then(res => res.json())
                    .then(data => setSearchResults(data.products))
                setAnchorEl(target)
            } catch (error) {
                console.error("Search error:", error);
            }
        }
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    function handleAddToCart(id: number, quantity: number) {
        dispatch(addToCart({
            id: id,
            quantity: quantity
        }))
    }

    //favs

    function isFav(id: number) {
        return !favItems.find(item => item.id == id);
    }

    function changeFav(id: number) {
        dispatch(handleFav(id))
    }

    return (
        <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
            <TextField
                variant="outlined"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                sx={{ width: "50%" }}
            />

            <IconButton onClick={handleDialog}>
                <Add />
                <Typography variant="body2">Create Product</Typography>
            </IconButton>
            <CreateDialog open={dialogOpen} onClose={handleDialog} />

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                slotProps={{
                    paper:
                    {
                        sx: {
                            width: "100vw",
                            maxHeight: 500,
                            overflowY: "auto",
                            boxShadow: 3,
                            borderRadius: 0,
                        },
                    }
                }}
            >
                {searchResults.length > 0 ? (
                    <>
                        {searchResults.map((item) => (
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
                                    <IconButton size="small" onClick={() => handleAddToCart(item.id, 1)}>
                                        <Add />
                                    </IconButton>
                                </Box>
                            </Card>
                        ))}
                    </>
                ) : (
                    <Typography variant="body1" fontWeight="bold">
                        Nothing was found!
                    </Typography>
                )}
            </Popover>
        </Box>
    )
}

export default Header
