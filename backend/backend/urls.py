from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),  # Include your app's API URLs
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # JWT Token
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Token Refresh
]
