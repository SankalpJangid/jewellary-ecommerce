from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views


urlpatterns = [
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', views.register_user, name='register'),

    path('categories/', views.CategoryListView.as_view()),
    path('products/', views.ProductListView.as_view()),
    path('products/<slug:slug>/', views.ProductDetailView.as_view()),

    path('addresses/', views.AddressListCreateView.as_view()),
    path('addresses/<int:pk>/', views.AddressUpdateDeleteView.as_view()),
    path('checkout/create-order/', views.create_order),
    path('checkout/razorpay/create/', views.razorpay_create_order),
    path('checkout/razorpay/verify/', views.razorpay_verify_payment),
    
    path('user/profile/', views.user_profile),
    path('user/profile/update/', views.update_profile),
    path('user/orders/', views.UserOrdersView.as_view()),
]


