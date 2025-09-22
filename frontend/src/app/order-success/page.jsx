"use client";
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Button, 
  Stack,
  // CheckCircle
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <Container sx={{ py: 6 }}>
      <Box sx={{ maxWidth: 500, mx: "auto", textAlign: "center" }}>
        <Card>
          <CardContent sx={{ p: 6 }}>
            <CheckCircle sx={{ fontSize: 80, color: "success.main", mb: 3 }} />
            
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Order Placed Successfully!
            </Typography>
            
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Thank you for your purchase. Your order has been confirmed and will be processed shortly.
            </Typography>

            <Stack spacing={2} sx={{ mt: 4 }}>
              <Typography variant="h6" fontWeight={600}>
                What's Next?
              </Typography>
              
              <Typography variant="body2" align="left">
                • You will receive an order confirmation email shortly<br/>
                • Your order will be dispatched within 24 hours<br/>
                • You can track your order status in your account<br/>
                • Free shipping across India with same-day dispatch
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: "center" }}>
              <Button 
                component={Link} 
                href="/products" 
                variant="outlined"
                size="large"
              >
                Continue Shopping
              </Button>
              
              <Button 
                component={Link} 
                href="/" 
                variant="contained"
                size="large"
              >
                Back to Home
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
