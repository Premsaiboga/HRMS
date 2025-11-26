from rest_framework import generics, permissions
from .models import Attendance
from .serializers import AttendanceSerializer
from employees.models import EmployeeProfile
from leaves.models import LeaveRequest
from rest_framework.exceptions import PermissionDenied
from datetime import date


class AttendanceListCreateView(generics.ListCreateAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'employee':
            return Attendance.objects.filter(employee__user=user)
        elif user.role in ['hr', 'admin']:
            return Attendance.objects.select_related('employee', 'employee__user').all()
        return Attendance.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role not in ['hr', 'admin']:
            raise PermissionDenied("Only HR/Admin can mark attendance.")

        employee_id = self.request.data.get('employee')
        date_str = self.request.data.get('date')

        if not employee_id or not date_str:
            raise PermissionDenied("Employee and date are required.")

        employee = EmployeeProfile.objects.get(id=employee_id)
        selected_date = date.fromisoformat(date_str)

        # ✅ Check if employee is on approved leave
        is_on_leave = LeaveRequest.objects.filter(
            employee=employee,
            status='approved',
            start_date__lte=selected_date,
            end_date__gte=selected_date
        ).exists()

        status = 'leave' if is_on_leave else self.request.data.get('status', 'present')

        serializer.save(
            employee=employee,
            status=status,
            marked_by_hr=user
        )


class AttendanceRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Attendance.objects.select_related('employee', 'employee__user').all()
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'employee':
            return Attendance.objects.filter(employee__user=user)
        elif user.role in ['hr', 'admin']:
            return Attendance.objects.select_related('employee', 'employee__user').all()
        return Attendance.objects.none()

    def get_object(self):
        obj = super().get_object()
        user = self.request.user
        if user.role == 'employee' and obj.employee.user != user:
            raise PermissionDenied("You do not have permission to access this record.")
        return obj
