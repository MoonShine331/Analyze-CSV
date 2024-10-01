# permissions.py
from rest_framework.permissions import BasePermission

class IsAdminOrAnalyst(BasePermission):
    """
    Allows access only to users in the Admin or Analyst groups.
    """
    def has_permission(self, request, view):
        return request.user.groups.filter(name__in=['Admin', 'Analyst']).exists()


class IsViewer(BasePermission):
    """
    Allows access only to users in the Viewer group.
    """
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Viewer').exists()
