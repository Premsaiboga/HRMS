from rest_framework import serializers
from .models import AttendanceSummary, LeaveSummary, PayrollSummary

class AttendanceSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceSummary
        fields = '__all__'

class LeaveSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveSummary
        fields = '__all__'

class PayrollSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = PayrollSummary
        fields = '__all__'
