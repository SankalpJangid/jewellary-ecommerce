"use client";
import { useState } from "react";
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Stack,
  Alert,
  Link as MuiLink
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/token/", formData);
      const { access, refresh } = response.data;
      
      // Store tokens in localStorage
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      
      // Redirect to home page
      router.push("/");
    } catch (error) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ py: 6 }}>
      <Box sx={{ maxWidth: 400, mx: "auto" }}>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
              Login
            </Typography>
            
            <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
              Welcome back to Rajasthani Gems
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Stack spacing={3}>
                <TextField
                  required
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
                
                <TextField
                  required
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />

                {error && (
                  <Alert severity="error">
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Login"}
                </Button>
              </Stack>
            </Box>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2">
                Don't have an account?{" "}
                <MuiLink component={Link} href="/signup">
                  Sign up here
                </MuiLink>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
