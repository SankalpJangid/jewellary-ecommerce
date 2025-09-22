from django.conf import settings
from rest_framework import generics, permissions, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Category, Product, Address, Order, OrderItem, Payment, UserProfile
from .serializers import CategorySerializer, ProductListSerializer, ProductDetailSerializer, AddressSerializer, OrderSerializer, UserProfileSerializer
import razorpay
from decimal import Decimal
import hmac
import hashlib

User = get_user_model()


class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        qs = Category.objects.filter(is_active=True).order_by('name')
        featured = self.request.query_params.get('featured')
        limit = self.request.query_params.get('limit')
        if featured in ['1', 'true', 'True']:
            qs = qs.filter(is_featured=True)
        if limit:
            try:
                qs = qs[:int(limit)]
            except Exception:
                pass
        return qs


class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'material', 'category__name']
    ordering_fields = ['price', 'created_at']
    ordering = ['-created_at']  # Default ordering to fix pagination warning

    def get_queryset(self):
        qs = Product.objects.filter(is_active=True).order_by('-created_at')
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category__slug=category)
        return qs


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'


class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user).order_by('-is_default', '-created_at')

    def perform_create(self, serializer):
        if serializer.validated_data.get('is_default'):
            Address.objects.filter(user=self.request.user, is_default=True).update(is_default=False)
        serializer.save(user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_order(request):
    data = request.data
    items = data.get('items', [])
    address_id = data.get('address_id')
    payment_method = data.get('payment_method')

    address = Address.objects.get(id=address_id, user=request.user)

    subtotal = sum(Decimal(str(item['price'])) * int(item['quantity']) for item in items)
    shipping_fee = Decimal('0')
    total = subtotal + shipping_fee

    order = Order.objects.create(
        user=request.user,
        address=address,
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        total=total,
        status='cod_pending' if payment_method == 'cod' else 'pending',
        payment_method=payment_method,
    )

    for item in items:
        OrderItem.objects.create(
            order=order,
            product_id=item['product_id'],
            quantity=item['quantity'],
            price=Decimal(str(item['price']))
        )

    return Response({'order_id': order.id, 'total': str(order.total)})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def razorpay_create_order(request):
    order_id = request.data.get('order_id')
    order = Order.objects.get(id=order_id, user=request.user)

    client = razorpay.Client(auth=(getattr(settings, 'RAZORPAY_KEY_ID', ''), getattr(settings, 'RAZORPAY_KEY_SECRET', '')))
    rp_order = client.order.create(dict(amount=int(order.total * 100), currency='INR', payment_capture=1))

    payment = Payment.objects.create(order=order, amount=order.total, provider_order_id=rp_order['id'])
    return Response({'razorpay_order_id': rp_order['id'], 'amount': int(order.total * 100), 'currency': 'INR'})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def razorpay_verify_payment(request):
    order_id = request.data.get('order_id')
    rp_payment_id = request.data.get('razorpay_payment_id')
    rp_order_id = request.data.get('razorpay_order_id')
    rp_signature = request.data.get('razorpay_signature')

    order = Order.objects.get(id=order_id, user=request.user)
    payment = order.payment

    payment.provider_payment_id = rp_payment_id
    payment.provider_signature = rp_signature
    payment.save(update_fields=['provider_payment_id', 'provider_signature'])

    # Verify signature
    secret = getattr(settings, 'RAZORPAY_KEY_SECRET', '')
    payload = f"{rp_order_id}|{rp_payment_id}".encode()
    expected_signature = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()

    if hmac.compare_digest(expected_signature, rp_signature):
        order.status = 'paid'
        order.save(update_fields=['status'])
        payment.success = True
        payment.save(update_fields=['success'])
        return Response({'status': 'success'})
    else:
        return Response({'status': 'failed', 'detail': 'Invalid signature'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not all([username, email, password]):
        return Response({'detail': 'Username, email and password are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(username=username).exists():
        return Response({'detail': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(email=email).exists():
        return Response({'detail': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(username=username, email=email, password=password)
    
    return Response({'detail': 'User created successfully'}, status=status.HTTP_201_CREATED)


class UserOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')


class AddressUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        if serializer.validated_data.get('is_default'):
            Address.objects.filter(user=self.request.user, is_default=True).update(is_default=False)
        serializer.save()


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_profile(request):
    user = request.user
    profile, _ = UserProfile.objects.get_or_create(user=user)
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'phone': profile.phone,
        'date_joined': user.date_joined
    })


@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_profile(request):
    user = request.user
    data = request.data
    profile, _ = UserProfile.objects.get_or_create(user=user)

    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.email = data.get('email', user.email)
    user.save()

    phone = data.get('phone')
    if phone is not None:
        profile.phone = phone
        profile.save(update_fields=['phone'])

    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'phone': profile.phone,
        'date_joined': user.date_joined
    })

# Create your views here.
