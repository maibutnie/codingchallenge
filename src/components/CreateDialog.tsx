import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography } from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ProductFormData } from '../interface/Product';

interface CreateDialogProps {
  open: boolean;
  onClose: () => void;
}

function CreateDialog({ open, onClose }: CreateDialogProps) {
  const url: string = 'https://dummyjson.com/products/add';
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProductFormData>({
    defaultValues: {
      title: '',
      brand: '',
      description: '',
      price: 0,
    }
  });

    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    function handleClose() {
      reset({
        title: '',
        brand: '',
        description: '',
        price: 0,
      });
      setImagePreview(null);
      onClose();
    };

    // I don’t store data on the frontend, so when I upload, they won’t be displayed (
    // ideally, after the POST request, the counter data should be updated, and you should be redirected to the last 
    // page (where the data will be shown), but I read on the API website: 'Adding a new product will not add it into the server. 
    // It will simulate a POST request and will return the newly created product with a new id,' so in my case, it’s pointless).

    async function onSubmit (data: ProductFormData) {
      try {
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: data.title,
            brand: data.brand,
            description: data.description,
            price: data.price,
          }),
        }).then(res => res.json()).then(console.log)
        onClose();
      } catch (error) {
        console.error('Error adding product:', error);
      }
    };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
    <DialogTitle sx={{ backgroundColor: '#f9fafb' }}>Create New Product</DialogTitle>
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent sx={{ padding: 3 }}>
        <Box mb={3} display="flex" justifyContent="center" alignItems="center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="image-upload"
            style={{ display: 'none' }}
          />
          <label htmlFor="image-upload">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: '128px',
                  height: '128px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: '2px dashed #cbd5e0',
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 128,
                  height: 128,
                  backgroundColor: '#f3f4f6',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '2px dashed #cbd5e0',
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  Add Image
                </Typography>
              </Box>
            )}
          </label>
        </Box>

        <Controller
          name="title"
          control={control}
          rules={{ required: 'Title is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Title"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
              sx={{ marginBottom: 2 }}
            />
          )}
        />

        <Controller
          name="brand"
          control={control}
          rules={{ required: 'Brand is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Brand"
              fullWidth
              error={!!errors.brand}
              helperText={errors.brand?.message}
              sx={{ marginBottom: 2 }}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={{ required: 'Description is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              fullWidth
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description?.message}
              sx={{ marginBottom: 2 }}
            />
          )}
        />

        <Controller
          name="price"
          control={control}
          rules={{
            required: 'Price is required',
            min: { value: 0, message: 'Price must be positive' },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Price"
              type="number"
              fullWidth
              error={!!errors.price}
              helperText={errors.price?.message}
              sx={{ marginBottom: 2 }}
            />
          )}
        />
      </DialogContent>

      <DialogActions sx={{ backgroundColor: '#f9fafb', padding: 2 }}>
        <Button onClick={() => handleClose()} color="inherit">
          Close
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Add Product
        </Button>
      </DialogActions>
    </form>
  </Dialog>
  )
}

export default CreateDialog
