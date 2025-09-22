from rest_framework import serializers
from .models import Category, Product, ProductImage, Address, Order, OrderItem, UserProfile


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'is_featured', 'image']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary']


class ProductListSerializer(serializers.ModelSerializer):
    primary_image = serializers.SerializerMethodField()
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'title', 'slug', 'price', 'sale_price', 'material', 'category', 'primary_image']

    def get_primary_image(self, obj):
        image = obj.images.filter(is_primary=True).first() or obj.images.first()
        return image.image.url if image else None


class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'title', 'slug', 'description', 'material', 'price', 'sale_price', 'stock', 'highlights', 'category', 'images']


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'full_name', 'phone', 'line1', 'line2', 'city', 'state', 'postal_code', 'country', 'is_default']


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['phone']


class OrderItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source='product.title', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['product', 'product_title', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'address', 'subtotal', 'shipping_fee', 'total', 'status', 'payment_method', 'items', 'created_at']

