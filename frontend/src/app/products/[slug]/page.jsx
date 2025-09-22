"use client";
import useSWR from "swr";
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Stack, 
  Typography,
  Chip,
  Divider,
  Card,
  CardContent,
  Alert,
  Snackbar
} from "@mui/material";
import { useParams } from "next/navigation";
import { useAtom } from "jotai";
import { addToCartAtom } from "@/store/cart";
import { useState } from "react";
import api from "@/utils/api";

const fetcher = (url) => api.get(url).then((r) => r.data);

export default function ProductDetail() {
  const params = useParams();
  const { data } = useSWR(`/products/${params.slug}/`, fetcher);
  const [, addToCart] = useAtom(addToCartAtom);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  const p = data ?? {};

  const handleAddToCart = () => {
    addToCart(p);
    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={8}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper"
          }}>
            {p.images?.[0]?.image ? (
              <Box 
                component="img" 
                src={p.images[0].image} 
                sx={{ 
                  width: "100%", 
                  height: { xs: 300, md: 500 },
                  objectFit: "cover",
                  display: "block"
                }} 
              />
            ) : (
              <Box 
                sx={{ 
                  height: { xs: 300, md: 500 }, 
                  bgcolor: "grey.50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }} 
              >
                <Typography color="text.secondary">
                  No Image Available
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={4}>
            <Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  mb: 2,
                  fontWeight: 600,
                  color: "primary.main",
                  lineHeight: 1.2
                }}
              >
                {p.title}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    color: "primary.main"
                  }}
                >
                  ₹{p.sale_price ?? p.price}
                </Typography>
                {p.sale_price && (
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      textDecoration: "line-through", 
                      color: "text.secondary",
                      fontWeight: 400
                    }}
                  >
                    ₹{p.price}
                  </Typography>
                )}
                {p.sale_price && (
                  <Chip 
                    label={`${Math.round(((p.price - p.sale_price) / p.price) * 100)}% OFF`}
                    color="secondary"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Box>
            </Box>

            {p.material && (
              <Chip 
                label={`Material: ${p.material}`} 
                variant="outlined"
                sx={{ 
                  alignSelf: "flex-start",
                  fontWeight: 500
                }}
              />
            )}

            <Typography 
              variant="body1" 
              sx={{ 
                lineHeight: 1.7,
                color: "text.primary",
                fontSize: "1.1rem"
              }}
            >
              {p.description}
            </Typography>

            <Divider />

            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3,
                  fontWeight: 600,
                  color: "primary.main"
                }}
              >
                Product Highlights
              </Typography>
              <Stack spacing={2}>
                {p.highlights?.map((highlight, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                    <Typography sx={{ color: "secondary.main", mt: 0.5 }}>•</Typography>
                    <Typography>{highlight}</Typography>
                  </Box>
                )) || [
                  "925 Silver Starting at ₹499",
                  "Gold Plated Elegance – Under ₹999",
                  "Festival Special: Flat 20% Off",
                  "Best Price Promise",
                  "Luxury Made Affordable"
                ].map((highlight, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                    <Typography sx={{ color: "secondary.main", mt: 0.5 }}>•</Typography>
                    <Typography>{highlight}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3,
                  fontWeight: 600,
                  color: "primary.main"
                }}
              >
                Delivery & Service
              </Typography>
              <Stack spacing={2}>
                {[
                  "Free Delivery Across India",
                  "Express Delivery – Get It in 48 Hrs",
                  "Cash on Delivery Available",
                  "Same-Day Dispatch",
                  "Gift-Ready Packaging"
                ].map((service, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                    <Typography sx={{ color: "secondary.main", mt: 0.5 }}>•</Typography>
                    <Typography>{service}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Button 
              variant="contained" 
              size="large" 
              onClick={handleAddToCart}
              disabled={!p.id}
              sx={{ 
                py: 2,
                px: 4,
                fontSize: "1.1rem",
                fontWeight: 600,
                bgcolor: "secondary.main",
                color: "primary.main",
                borderRadius: 2,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "secondary.dark",
                  transform: "translateY(-2px)",
                  boxShadow: "0px 8px 24px rgba(212, 175, 55, 0.3)"
                },
                transition: "all 0.3s ease"
              }}
            >
              Add to Cart
            </Button>

            <Alert 
              severity="info"
              sx={{ 
                borderRadius: 2,
                "& .MuiAlert-icon": {
                  color: "secondary.main"
                }
              }}
            >
              <Typography variant="body2">
                <strong>Certified 92.5% Silver</strong> - All our products are certified for purity and quality.
              </Typography>
            </Alert>
          </Stack>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Product added to cart!"
      />
    </Container>
  );
}
