from django.contrib import admin
from .models import Category, Product, ProductImage, Address, Order, OrderItem, Payment


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "price", "stock", "is_active")
    list_filter = ("category", "is_active")
    search_fields = ("title", "description")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [ProductImageInline]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "is_active")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


admin.site.register(Address)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Payment)

# Register your models here.
