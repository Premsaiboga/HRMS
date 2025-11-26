from rest_framework import serializers
from .models import EmployeeProfile
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class EmployeeProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = EmployeeProfile
        fields = ['id', 'user', 'position', 'department', 'hire_date']
