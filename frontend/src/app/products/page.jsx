"use client";
import useSWR from "swr";
import { 
  Box, 
  Card, 
  CardActionArea, 
  CardContent, 
  CardMedia, 
  Container, 
  Grid, 
  Skeleton, 
  Stack, 
  TextField, 
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from "@mui/material";
import { Search } from "@mui/icons-material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAtom } from "jotai";
import { addToCartAtom } from "@/store/cart";
import api from "@/utils/api";

const fetcher = (url) => api.get(url).then((r) => r.data);

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [, addToCart] = useAtom(addToCartAtom);
  
  const { data, isLoading, error } = useSWR(`/products/?search=${encodeURIComponent(q)}&category=${category}&ordering=${sortBy}`, fetcher);
  useEffect(() => {
    const initialCategory = searchParams.get("category") || "";
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [searchParams]);
  const { data: categoriesData, error: categoriesError } = useSWR("/categories/", fetcher);
  
  const products = data?.results ?? [];
  const categories = Array.isArray(categoriesData?.results) ? categoriesData.results : [];

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (error || categoriesError) {
    return (
      <Container sx={{ py: 6 }}>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="error" gutterBottom>
            Error loading products
          </Typography>
          <Typography color="text.secondary">
            Please try refreshing the page
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Stack spacing={6}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              mb: 2,
              fontWeight: 600,
              color: "primary.main"
            }}
          >
            Our Collection
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Discover our curated selection of premium jewelry, each piece crafted with precision and elegance.
          </Typography>
        </Box>

        {/* Filters */}
        <Box sx={{ 
          p: 3, 
          bgcolor: "background.paper",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider"
        }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
            <TextField 
              placeholder="Search jewelry..." 
              value={q} 
              onChange={(e) => setQ(e.target.value)}
              sx={{ 
                minWidth: 250,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2
                }
              }}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />
              }}
            />
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.slug}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">Featured</MenuItem>
                <MenuItem value="price">Price: Low to High</MenuItem>
                <MenuItem value="-price">Price: High to Low</MenuItem>
                <MenuItem value="-created_at">Newest First</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>

        {/* Products Grid */}
        <Grid container spacing={4}>
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
                  <Skeleton 
                    variant="rectangular" 
                    height={400} 
                    sx={{ borderRadius: 2 }}
                  />
                </Grid>
              ))
            : products.map((p) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={p.id}>
                  <Card 
                    sx={{ 
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      overflow: "hidden",
                      "&:hover": {
                        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
                        transform: "translateY(-4px)",
                        transition: "all 0.3s ease"
                      }
                    }}
                  >
                    <CardActionArea 
                      component={Link} 
                      href={`/products/${p.slug}`}
                      sx={{ flexGrow: 1 }}
                    >
                      {p.primary_image ? (
                        <CardMedia 
                          component="img" 
                          image={p.primary_image} 
                          sx={{ 
                            height: 280, 
                            objectFit: "cover",
                            transition: "transform 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.05)"
                            }
                          }} 
                        />
                      ) : (
                        <Box 
                          sx={{ 
                            height: 280, 
                            bgcolor: "grey.50",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }} 
                        >
                          <Typography color="text.secondary">
                            No Image
                          </Typography>
                        </Box>
                      )}
                      <CardContent sx={{ p: 3 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            mb: 1,
                            fontWeight: 600,
                            color: "primary.main",
                            lineHeight: 1.3
                          }}
                        >
                          {p.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ mb: 2 }}
                        >
                          {p.category?.name}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 700,
                              color: "primary.main"
                            }}
                          >
                            ₹{p.sale_price ?? p.price}
                          </Typography>
                          {p.sale_price && (
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                textDecoration: "line-through",
                                color: "text.secondary"
                              }}
                            >
                              ₹{p.price}
                            </Typography>
                          )}
                        </Box>
                        {p.material && (
                          <Chip 
                            label={p.material} 
                            size="small" 
                            variant="outlined"
                            sx={{ 
                              fontSize: "0.75rem",
                              height: 24
                            }}
                          />
                        )}
                      </CardContent>
                    </CardActionArea>
                    <Box sx={{ p: 3, pt: 0 }}>
                      <Button 
                        variant="contained" 
                        fullWidth 
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(p);
                        }}
                        sx={{
                          bgcolor: "secondary.main",
                          color: "primary.main",
                          fontWeight: 600,
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: "none",
                          "&:hover": {
                            bgcolor: "secondary.dark",
                            transform: "translateY(-1px)"
                          },
                          transition: "all 0.2s ease"
                        }}
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </Stack>

      {products.length === 0 && !isLoading && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No products found
          </Typography>
        </Box>
      )}
    </Container>
  );
}
