from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

# Validator to ensure only CSV or Excel files are uploaded
def validate_file_extension(value):
    if not value.name.endswith(('.csv', '.xlsx')):
        raise ValidationError('Unsupported file extension. Only CSV and Excel files are allowed.')

# Model for uploaded files (CSV, Excel, etc.)
class FileUpload(models.Model):
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='uploads/', validators=[validate_file_extension])
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# Model for data models linking to file uploads
class DataModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    linked_tables = models.ManyToManyField(FileUpload)

    def __str__(self):
        return self.name
