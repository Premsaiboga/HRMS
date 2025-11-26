from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Payroll
from .serializers import PayrollSerializer
from employees.models import EmployeeProfile
from attendance.models import Attendance
from datetime import datetime
from calendar import monthrange

class PayrollListCreateView(generics.ListCreateAPIView):
    serializer_class = PayrollSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'employee':
            return Payroll.objects.filter(employee__user=user)
        elif user.role in ['hr', 'admin']:
            return Payroll.objects.all()
        return Payroll.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role not in ['hr', 'admin']:
            raise PermissionDenied("Only HR can generate payroll.")

        employee_id = self.request.data.get('employee')
        month = self.request.data.get('month')
        base_salary = float(self.request.data.get('base_salary', 0))

        employee = EmployeeProfile.objects.get(id=employee_id)
        year, month_num = map(int, month.split('-'))  # expects 'YYYY-MM'
        total_days = monthrange(year, month_num)[1]

        attendances = Attendance.objects.filter(
            employee=employee,
            date__year=year,
            date__month=month_num
        )

        present_days = attendances.filter(status='present').count()
        leave_days = attendances.filter(status='leave').count()
        absent_days = total_days - (present_days + leave_days)

        daily_rate = base_salary / total_days
        net_salary = daily_rate * (present_days + leave_days)

        serializer.save(
            employee=employee,
            base_salary=base_salary,
            month=f"{datetime(year, month_num, 1).strftime('%B %Y')}",
            total_days=total_days,
            present_days=present_days,
            leave_days=leave_days,
            absent_days=absent_days,
            net_salary=net_salary,
            status='processed'
        )
