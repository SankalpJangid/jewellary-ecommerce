"use client";
import { Box, Button, Container, Grid, Stack, Typography, Card, CardContent } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/utils/api";

export default function Home() {
  const [featuredCategories, setFeaturedCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/categories/?featured=1&limit=3");
        setFeaturedCategories(res.data.results || res.data);
      } catch (e) {
        // ignore on home if fails
      }
    };
    load();
  }, []);
  return (
    <>
      {/* Hero Section */}
      <Box sx={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        py: { xs: 12, md: 20 },
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)",
        }
      }}>
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={4}>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    color: "white",
                    fontWeight: 700,
                    lineHeight: 1.1,
                    mb: 2
                  }}
                >
                  Luxe Adorn
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: "secondary.main",
                    fontWeight: 400,
                    mb: 3
                  }}
                >
                  Premium Jewelry Collection
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "1.125rem",
                    lineHeight: 1.6,
                    mb: 4,
                    maxWidth: 500
                  }}
                >
                  Discover our exquisite collection of handcrafted jewelry, featuring certified 92.5% pure silver pieces that embody elegance and timeless beauty.
                </Typography>
                <Stack direction="row" spacing={3}>
                  <Button 
                    component={Link} 
                    href="/products" 
                    variant="contained" 
                    size="large"
                    sx={{ 
                      bgcolor: "secondary.main",
                      color: "primary.main",
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: 2,
                      "&:hover": { 
                        bgcolor: "secondary.dark",
                        transform: "translateY(-2px)",
                        boxShadow: "0px 8px 24px rgba(212, 175, 55, 0.3)"
                      },
                      transition: "all 0.3s ease"
                    }}
                  >
                    Explore Collection
                  </Button>
                  <Button 
                    component={Link} 
                    href="/products" 
                    variant="outlined" 
                    size="large"
                    sx={{ 
                      borderColor: "white",
                      color: "white",
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: 500,
                      textTransform: "none",
                      borderRadius: 2,
                      "&:hover": { 
                        borderColor: "white",
                        bgcolor: "rgba(255,255,255,0.1)",
                        transform: "translateY(-2px)"
                      },
                      transition: "all 0.3s ease"
                    }}
                  >
                    View Catalog
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{
                height: { xs: 300, md: 500 },
                background: "linear-gradient(45deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)",
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(212, 175, 55, 0.2)"
              }}>
                <Typography variant="h6" color="text.secondary">
                  Premium Jewelry Showcase
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Categories */}
      {featuredCategories?.length > 0 && (
        <Container maxWidth="lg" sx={{ pt: 12 }}>
          <Typography 
            variant="h3" 
            align="center" 
            sx={{ mb: 6, fontWeight: 600, color: "primary.main" }}
          >
            Featured Categories
          </Typography>
          <Grid container spacing={4}>
            {featuredCategories.map((cat) => (
              <Grid key={cat.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card 
                  component={Link}
                  href={`/products?category=${cat.slug}`}
                  sx={{
                    height: 260,
                    textDecoration: "none",
                    border: "1px solid",
                    borderColor: "divider",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": { boxShadow: "0px 8px 24px rgba(0,0,0,0.12)" }
                  }}
                >
                  <Box sx={{ flex: 1, position: "relative", bgcolor: "grey.100" }}>
                    {cat.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={cat.image}
                        alt={cat.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography color="text.secondary">{cat.name}</Typography>
                      </Box>
                    )}
                  </Box>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} color="primary.main">{cat.name}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>{cat.description}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Typography 
          variant="h3" 
          align="center" 
          sx={{ 
            mb: 8,
            fontWeight: 600,
            color: "primary.main"
          }}
        >
          Why Choose Luxe Adorn
        </Typography>
        
        <Grid container spacing={6}>
          {[
            { 
              title: "Certified 92.5% Silver", 
              description: "All our jewelry is certified for purity and authenticity",
              icon: "✨"
            },
            { 
              title: "Free Worldwide Shipping", 
              description: "Complimentary shipping on all orders with express delivery options",
              icon: "🚚"
            },
            { 
              title: "Handcrafted Excellence", 
              description: "Each piece is meticulously crafted by skilled artisans",
              icon: "👨‍🎨"
            },
            { 
              title: "Lifetime Support", 
              description: "Dedicated customer service and lifetime care instructions",
              icon: "💎"
            },
          ].map((feature) => (
            <Grid key={feature.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card 
                sx={{ 
                  height: "100%",
                  textAlign: "center",
                  p: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": {
                    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
                    transform: "translateY(-4px)",
                    transition: "all 0.3s ease"
                  }
                }}
              >
                <CardContent>
                  <Typography 
                    fontSize={48} 
                    sx={{ mb: 2 }}
                  >
                    {feature.icon}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2,
                      fontWeight: 600,
                      color: "primary.main"
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      
    </>
  );
}
