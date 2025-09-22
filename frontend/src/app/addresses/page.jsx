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
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Alert,
  Skeleton,
  IconButton,
  Chip
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  LocationOn,
  Home,
  Star
} from "@mui/icons-material";
import api from "@/utils/api";

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    is_default: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await api.get("/addresses/");
      setAddresses(response.data.results || response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        router.push("/login");
      } else {
        setError("Failed to load addresses");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        full_name: address.full_name,
        phone: address.phone,
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country,
        is_default: address.is_default
      });
    } else {
      setEditingAddress(null);
      setFormData({
        full_name: "",
        phone: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "India",
        is_default: false
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAddress(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await api.put(`/addresses/${editingAddress.id}/`, formData);
      } else {
        await api.post("/addresses/", formData);
      }
      await fetchAddresses();
      handleClose();
    } catch (err) {
      setError("Failed to save address");
    }
  };

  const handleDelete = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await api.delete(`/addresses/${addressId}/`);
        await fetchAddresses();
      } catch (err) {
        setError("Failed to delete address");
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Stack spacing={4}>
          <Typography variant="h2" sx={{ fontWeight: 600, color: "primary.main" }}>
            Manage Addresses
          </Typography>
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          ))}
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Stack spacing={6}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography 
              variant="h2" 
              sx={{ 
                mb: 2,
                fontWeight: 600,
                color: "primary.main"
              }}
            >
              Manage Addresses
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
            >
              Add, edit, or remove your shipping addresses
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
            sx={{
              bgcolor: "secondary.main",
              color: "primary.main",
              "&:hover": { bgcolor: "secondary.dark" }
            }}
          >
            Add Address
          </Button>
        </Box>

        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Addresses Grid */}
        {addresses.length === 0 ? (
          <Card sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
            <CardContent sx={{ p: 6, textAlign: "center" }}>
              <LocationOn sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                No Addresses Added
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Add your first address to get started with shipping.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpen()}
                sx={{
                  bgcolor: "secondary.main",
                  color: "primary.main",
                  "&:hover": { bgcolor: "secondary.dark" }
                }}
              >
                Add Address
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {addresses.map((address) => (
              <Grid size={{ xs: 12, md: 6 }} key={address.id}>
                <Card 
                  sx={{ 
                    height: "100%",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: address.is_default ? "secondary.main" : "divider",
                    position: "relative",
                    "&:hover": {
                      boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
                      transition: "all 0.3s ease"
                    }
                  }}
                >
                  {address.is_default && (
                    <Chip
                      icon={<Star />}
                      label="Default"
                      color="secondary"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        zIndex: 1
                      }}
                    />
                  )}
                  
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Home sx={{ color: "secondary.main" }} />
                        <Typography variant="h6" fontWeight={600}>
                          {address.full_name}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        {address.phone}
                      </Typography>
                      
                      <Typography variant="body2">
                        {address.line1}
                      </Typography>
                      
                      {address.line2 && (
                        <Typography variant="body2">
                          {address.line2}
                        </Typography>
                      )}
                      
                      <Typography variant="body2">
                        {address.city}, {address.state} {address.postal_code}
                      </Typography>
                      
                      <Typography variant="body2">
                        {address.country}
                      </Typography>
                      
                      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                        <Button
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => handleOpen(address)}
                          sx={{ flex: 1 }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleDelete(address.id)}
                          sx={{ flex: 1 }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add/Edit Address Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingAddress ? "Edit Address" : "Add New Address"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Stack spacing={3} sx={{ mt: 1 }}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                />
                
                <TextField
                  required
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                
                <TextField
                  required
                  fullWidth
                  label="Address Line 1"
                  name="line1"
                  value={formData.line1}
                  onChange={handleInputChange}
                />
                
                <TextField
                  fullWidth
                  label="Address Line 2"
                  name="line2"
                  value={formData.line2}
                  onChange={handleInputChange}
                />
                
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      required
                      fullWidth
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      required
                      fullWidth
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
                
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      required
                      fullWidth
                      label="Postal Code"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      required
                      fullWidth
                      label="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_default}
                      onChange={handleInputChange}
                      name="is_default"
                    />
                  }
                  label="Set as default address"
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                {editingAddress ? "Update" : "Add"} Address
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Stack>
    </Container>
  );
}
