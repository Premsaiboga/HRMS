from rest_framework import serializers
from .models import Attendance
from employees.serializers import EmployeeProfileSerializer

class AttendanceSerializer(serializers.ModelSerializer):
    employee = EmployeeProfileSerializer(read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'employee', 'date', 'status', 'marked_by_hr', 'created_at']
