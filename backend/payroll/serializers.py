from rest_framework import serializers
from .models import Payroll
from employees.serializers import EmployeeProfileSerializer

class PayrollSerializer(serializers.ModelSerializer):
    employee = EmployeeProfileSerializer(read_only=True)

    class Meta:
        model = Payroll
        fields = '__all__'
