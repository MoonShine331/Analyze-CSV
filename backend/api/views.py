import logging
import os
import pandas as pd
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer
from django.contrib.auth.hashers import make_password
from .models import FileUpload, DataModel
from .serializers import FileUploadSerializer, DataModelSerializer, UserProfileSerializer
import openai
# Custom permission for Admin role (if needed for Admin-based actions)
from rest_framework.permissions import BasePermission
from django.conf import settings

# Set up the logger
logger = logging.getLogger(__name__)


openai.api_key = settings.OPENAI_API_KEY


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Admin').exists()

# File upload list and create view (requires authentication)
class FileUploadListCreateView(generics.ListCreateAPIView):
    queryset = FileUpload.objects.all()
    serializer_class = FileUploadSerializer
    permission_classes = [IsAuthenticated]

# File detail view (requires authentication)
class FileUploadDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FileUpload.objects.all()
    serializer_class = FileUploadSerializer
    permission_classes = [IsAuthenticated]

class FileUploadDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FileUpload.objects.all()
    serializer_class = FileUploadSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        try:
            file_upload = self.get_object()
            file_path = file_upload.file.path  # Get the file path
            logger.info(f"Attempting to delete file: {file_path}")
            
            if os.path.exists(file_path):
                logger.info(f"File exists: {file_path}")
                file_upload.file.delete(save=False)  # Delete the file from the filesystem
                file_upload.delete()  # Delete the record from the database
                logger.info("File and database record deleted successfully")
                return Response({'message': 'File deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
            else:
                logger.error(f"File not found on the filesystem: {file_path}")
                file_upload.delete()  # Delete the record from the database
                return Response({'error': 'File not found on the filesystem, but record was deleted.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error deleting file: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# User Registration Serializer (for registration with password)
class UserRegistrationSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])  # Hash the password
        return super(UserRegistrationSerializer, self).create(validated_data)

# View for handling user profile (GET and PUT)
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user  # Get the currently authenticated user

    if request.method == 'GET':
        # Pass the user instance to the serializer
        serializer = UserProfileSerializer(instance=user)
        return Response(serializer.data)  # Ensure the correct data is returned

    elif request.method == 'PUT':
        # Pass both the instance and the data for updating
        serializer = UserProfileSerializer(instance=user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Profile updated successfully!'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View for handling user registration (POST)
@api_view(['POST'])
@permission_classes([AllowAny])  # Allow anyone to register
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User registered successfully!'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View for DataModel creation and listing (requires authentication)
class DataModelListCreateView(generics.ListCreateAPIView):
    queryset = DataModel.objects.all()
    serializer_class = DataModelSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically link the data model to the current user
        serializer.save(user=self.request.user)

# View for Data Visualization (Processing CSV/Excel Files)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def data_visualization(request, file_id=None):
    """
    This view fetches an uploaded file by ID, processes it, and returns the data
    in a format suitable for visualization, with optional filtering.
    """
    filter_value = request.GET.get('filter', None)

    try:
        # Get the uploaded file by ID
        file_upload = FileUpload.objects.get(id=file_id)

        # Load the file using pandas
        file_path = file_upload.file.path
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        elif file_path.endswith('.xlsx'):
            df = pd.read_excel(file_path)
        else:
            return Response({'error': 'Unsupported file format.'}, status=status.HTTP_400_BAD_REQUEST)

        # Apply filtering if the filter_value exists
        if filter_value:
            df = df[df[df.columns[0]] == filter_value]

        data = df.to_dict(orient='records')  # Convert the dataframe to a dictionary

        return Response({'file_name': file_upload.name, 'data': data})

    except FileUpload.DoesNotExist:
        return Response({'error': 'File not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Optional: View for DataModel with Admin permissions
class DataModelAdminView(generics.ListCreateAPIView):
    queryset = DataModel.objects.all()
    serializer_class = DataModelSerializer
    permission_classes = [IsAuthenticated, IsAdmin]  # Only admins can access this view

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Restrict access to authenticated users
def chatbot_query(request):
    """
    This view handles the chatbot queries, processes them using OpenAI's GPT, and returns the response.
    """
    user_query = request.data.get('query')
    
    if not user_query:
        return Response({'error': 'No query provided'}, status=400)
    
    # Check if the request has a valid token
    if not request.user.is_authenticated:
        return Response({'error': 'User is not authenticated'}, status=403)

    prompt=f"Interpret this data query: {user_query}"
    # Process the query using OpenAI's GPT to interpret it
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=150,
        temperature=0
    )

    interpreted_query = response.choices[0].message.content

    return Response({'response': interpreted_query})
