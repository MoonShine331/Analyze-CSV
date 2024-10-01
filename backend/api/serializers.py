from .models import FileUpload, DataModel
from rest_framework import serializers
from django.contrib.auth.models import User

# Serializer for the FileUpload model
class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileUpload
        fields = '__all__'

# Serializer for the DataModel model
class DataModelSerializer(serializers.ModelSerializer):
    linked_tables = serializers.PrimaryKeyRelatedField(
        many=True, queryset=FileUpload.objects.all()
    )  # Serialize linked file uploads as file IDs

    class Meta:
        model = DataModel
        fields = '__all__'

# Serializer for visualizing data in charts
class DataVisualizationSerializer(serializers.Serializer):
    # Expose data fields needed for charts
    name = serializers.CharField()
    data = serializers.JSONField()  # The data extracted from files for visualization

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']  # Add any other fields you'd like to include