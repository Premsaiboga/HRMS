from rest_framework import serializers
from .models import LeaveRequest
from employees.serializers import EmployeeProfileSerializer

class LeaveRequestSerializer(serializers.ModelSerializer):
    employee = EmployeeProfileSerializer(read_only=True)

    class Meta:
        model = LeaveRequest
        fields = ['id', 'employee', 'start_date', 'end_date', 'reason', 'status', 'submitted_at']
        read_only_fields = ['id', 'employee', 'submitted_at']
