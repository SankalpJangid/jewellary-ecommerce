"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Box,
  Divider,
  Stack,
  Avatar,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import {
  Person,
  ShoppingBag,
  LocationOn,
  Edit,
  Logout
} from "@mui/icons-material";
import Link from "next/link";
import api from "@/utils/api";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/user/profile/");
        setProfile(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          router.push("/login");
        } else {
          setError("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleOpen = () => {
    setForm({
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      email: profile?.email || "",
      phone: profile?.phone || ""
    });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      const res = await api.put("/user/profile/update/", form);
      setProfile(res.data);
      setOpen(false);
    } catch (e) {
      setError("Failed to update profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/");
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <>
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
            My Profile
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Manage your account settings and preferences
          </Typography>
        </Box>

        {/* Profile Overview */}
        <Card sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid size={{ xs: 12, md: 3 }}>
                <Box sx={{ textAlign: "center" }}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: "secondary.main",
                      color: "primary.main",
                      fontSize: "2rem",
                      mx: "auto",
                      mb: 2
                    }}
                  >
                    <Person />
                  </Avatar>
                  <Typography variant="h6" fontWeight={600}>
                    {profile?.first_name || profile?.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Member since {new Date(profile?.date_joined).toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 9 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      Account Information
                    </Typography>
                    <Typography variant="body1">
                      <strong>Username:</strong> {profile?.username}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Email:</strong> {profile?.email}
                    </Typography>
                    {profile?.first_name && (
                      <Typography variant="body1">
                        <strong>Name:</strong> {profile?.first_name} {profile?.last_name}
                      </Typography>
                    )}
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    sx={{ alignSelf: "flex-start" }}
                    onClick={handleOpen}
                  >
                    Edit Profile
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card 
              sx={{ 
                height: "100%",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                "&:hover": {
                  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
                  transform: "translateY(-4px)",
                  transition: "all 0.3s ease"
                }
              }}
            >
              <CardContent sx={{ p: 3, textAlign: "center" }}>
                <ShoppingBag sx={{ fontSize: 48, color: "secondary.main", mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  My Orders
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  View your order history and track current orders
                </Typography>
                <Button
                  component={Link}
                  href="/orders"
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: "secondary.main",
                    color: "primary.main",
                    "&:hover": { bgcolor: "secondary.dark" }
                  }}
                >
                  View Orders
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card 
              sx={{ 
                height: "100%",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                "&:hover": {
                  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
                  transform: "translateY(-4px)",
                  transition: "all 0.3s ease"
                }
              }}
            >
              <CardContent sx={{ p: 3, textAlign: "center" }}>
                <LocationOn sx={{ fontSize: 48, color: "secondary.main", mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  Manage Addresses
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Add, edit, or remove your shipping addresses
                </Typography>
                <Button
                  component={Link}
                  href="/addresses"
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: "secondary.main",
                    color: "primary.main",
                    "&:hover": { bgcolor: "secondary.dark" }
                  }}
                >
                  Manage Addresses
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card 
              sx={{ 
                height: "100%",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                "&:hover": {
                  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
                  transform: "translateY(-4px)",
                  transition: "all 0.3s ease"
                }
              }}
            >
              <CardContent sx={{ p: 3, textAlign: "center" }}>
                <Logout sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  Sign Out
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Sign out of your account
                </Typography>
                <Button
                  onClick={handleLogout}
                  variant="outlined"
                  color="error"
                  fullWidth
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Container>
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="First Name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          <TextField label="Last Name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          <TextField label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TextField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
    </>
  );
}
