from django.urls import path
from .views import (
    FileUploadListCreateView, 
    FileUploadDetailView, 
    DataModelListCreateView, 
    data_visualization, 
    register_user, 
    user_profile,
    chatbot_query,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # File upload and detail routes
    path('files/', FileUploadListCreateView.as_view(), name='file-list-create'),
    path('files/<int:pk>/', FileUploadDetailView.as_view(), name='file-detail'),


    # DataModel routes
    path('data-models/', DataModelListCreateView.as_view(), name='data-model-list-create'),

    # Data visualization route
    path('visualize/<int:file_id>/', data_visualization, name='data-visualization'),

    # User registration and profile
    path('register/', register_user, name='register'),
    path('profile/', user_profile, name='profile'),

    # JWT Authentication
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('chatbot/query/', chatbot_query, name='chatbot_query'),
]
