from rest_framework import generics, permissions
from .models import LeaveRequest
from .serializers import LeaveRequestSerializer
from employees.models import EmployeeProfile
from rest_framework.exceptions import PermissionDenied

class LeaveRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = LeaveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'employee':
            return LeaveRequest.objects.filter(employee__user=user)
        elif user.role in ('hr', 'admin'):
            return LeaveRequest.objects.select_related('employee', 'employee__user').all()
        return LeaveRequest.objects.none()

    def perform_create(self, serializer):
        try:
            employee_profile = EmployeeProfile.objects.get(user=self.request.user)
        except EmployeeProfile.DoesNotExist:
            raise PermissionDenied("Employee profile does not exist for this user.")
        serializer.save(employee=employee_profile)


class LeaveRequestRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj = super().get_object()
        user = self.request.user
        print(self.request.user)
        if user.role == 'employee' and obj.employee.user != user:
            raise PermissionDenied("You do not have permission to access this leave request.")
        return obj

    def perform_update(self, serializer):
        user = self.request.user
        if user.role in ('hr', 'admin'):
            serializer.save()
        else:
            raise PermissionDenied("Only HR/Admin can update leave status.")
