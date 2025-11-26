from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from .models import EmployeeProfile
from .serializers import EmployeeProfileSerializer

User = get_user_model()

class IsHRorAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and (user.is_superuser or getattr(user, 'role', None) == 'hr'))

class EmployeeProfileListCreateView(generics.ListCreateAPIView):
    queryset = EmployeeProfile.objects.all()
    serializer_class = EmployeeProfileSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsHRorAdmin()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        user_data = self.request.data
        required_fields = ['username', 'password', 'email']
        for field in required_fields:
            if field not in user_data:
                raise PermissionDenied(f"{field} is required.")
        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data.get('email', ''),
            password=user_data['password']
        )
        serializer.save(user=user)

class EmployeeProfileRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = EmployeeProfile.objects.all()
    serializer_class = EmployeeProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
