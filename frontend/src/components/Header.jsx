"use client";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Badge, 
  Box,
  Menu,
  MenuItem,
  Avatar,
  Container,
  Stack
} from "@mui/material";
import { 
  ShoppingCart, 
  Person, 
  Search,
  Menu as MenuIcon
} from "@mui/icons-material";
import Link from "next/link";
import { useAtom } from "jotai";
import { cartAtom } from "@/store/cart";
import { useState } from "react";

export default function Header() {
  const [cart] = useAtom(cartAtom);
  const [anchorEl, setAnchorEl] = useState(null);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider"
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: 0 }}>
          <Typography 
            variant="h5" 
            component={Link} 
            href="/" 
            sx={{ 
              flexGrow: 1, 
              textDecoration: "none", 
              color: "primary.main",
              fontWeight: 700,
              letterSpacing: "-0.01em"
            }}
          >
            Luxe Adorn
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              mr: 4, 
              color: "text.secondary",
              fontSize: "0.875rem",
              fontWeight: 400
            }}
          >
            Premium Jewelry Collection
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button 
              component={Link} 
              href="/products"
              sx={{ 
                color: "text.primary",
                textTransform: "none",
                fontWeight: 500,
                px: 2
              }}
            >
              Shop
            </Button>
            
            <IconButton 
              component={Link} 
              href="/products"
              sx={{ color: "text.secondary" }}
            >
              <Search />
            </IconButton>
            
            <IconButton 
              component={Link} 
              href="/cart"
              sx={{ color: "text.secondary" }}
            >
              <Badge 
                badgeContent={cartCount} 
                sx={{ 
                  "& .MuiBadge-badge": { 
                    bgcolor: "secondary.main",
                    color: "primary.main",
                    fontWeight: 600
                  } 
                }}
              >
                <ShoppingCart />
              </Badge>
            </IconButton>

            <IconButton 
              onClick={handleMenuOpen}
              sx={{ color: "text.secondary" }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: "grey.100",
                  color: "text.secondary"
                }}
              >
                <Person />
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)"
                }
              }}
            >
              {typeof window !== "undefined" && localStorage.getItem("access_token") ? [
                <MenuItem 
                  key="profile"
                  component={Link} 
                  href="/profile" 
                  onClick={handleMenuClose}
                  sx={{ py: 1.5 }}
                >
                  My Profile
                </MenuItem>,
                <MenuItem 
                  key="orders"
                  component={Link} 
                  href="/orders" 
                  onClick={handleMenuClose}
                  sx={{ py: 1.5 }}
                >
                  My Orders
                </MenuItem>,
                <MenuItem 
                  key="addresses"
                  component={Link} 
                  href="/addresses" 
                  onClick={handleMenuClose}
                  sx={{ py: 1.5 }}
                >
                  Manage Addresses
                </MenuItem>,
                <MenuItem 
                  key="logout"
                  onClick={() => {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    window.location.href = "/";
                    handleMenuClose();
                  }}
                  sx={{ py: 1.5 }}
                >
                  Sign Out
                </MenuItem>
              ] : [
                <MenuItem 
                  key="login"
                  component={Link} 
                  href="/login" 
                  onClick={handleMenuClose}
                  sx={{ py: 1.5 }}
                >
                  Sign In
                </MenuItem>,
                <MenuItem 
                  key="signup"
                  component={Link} 
                  href="/signup" 
                  onClick={handleMenuClose}
                  sx={{ py: 1.5 }}
                >
                  Create Account
                </MenuItem>
              ]}
            </Menu>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
