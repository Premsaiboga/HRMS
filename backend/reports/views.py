from rest_framework import generics, permissions
from django.db.models import Count, Sum, Q
from datetime import date
from attendance.models import Attendance
from leaves.models import LeaveRequest
from payroll.models import Payroll
from employees.models import EmployeeProfile
from .serializers import AttendanceSummarySerializer, LeaveSummarySerializer, PayrollSummarySerializer
from rest_framework.response import Response
from calendar import monthrange


class IsHRorAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role in ['hr', 'admin']


# 🧾 Attendance Summary Report
class AttendanceSummaryListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsHRorAdmin]
    serializer_class = AttendanceSummarySerializer

    def list(self, request, *args, **kwargs):
        current_year = date.today().year
        data = []
        employees = EmployeeProfile.objects.select_related('user').all()

        for emp in employees:
            for month in range(1, 13):
                attendances = Attendance.objects.filter(
                    employee=emp,
                    date__year=current_year,
                    date__month=month
                )
                if attendances.exists():
                    total_present = attendances.filter(status='present').count()
                    total_absent = attendances.filter(status='absent').count()
                    total_leave = attendances.filter(status='leave').count()
                    data.append({
                        "id": f"{emp.id}-{month}",
                        "employee": {"user": {"username": emp.user.username}},
                        "month": date(current_year, month, 1),
                        "total_present": total_present,
                        "total_absent": total_absent,
                        "total_leave": total_leave,
                    })
        return Response(data)


# 🧾 Leave Summary Report
class LeaveSummaryListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsHRorAdmin]
    serializer_class = LeaveSummarySerializer

    def list(self, request, *args, **kwargs):
        current_year = date.today().year
        data = []
        employees = EmployeeProfile.objects.select_related('user').all()

        for emp in employees:
            leaves = LeaveRequest.objects.filter(employee=emp, start_date__year=current_year)
            if leaves.exists():
                total_taken = leaves.count()
                total_approved = leaves.filter(status='approved').count()
                total_pending = leaves.filter(status='pending').count()
                data.append({
                    "id": emp.id,
                    "employee": {"user": {"username": emp.user.username}},
                    "year": current_year,
                    "total_leaves_taken": total_taken,
                    "total_leaves_approved": total_approved,
                    "total_leaves_pending": total_pending,
                })
        return Response(data)


# 🧾 Payroll Summary Report
class PayrollSummaryListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsHRorAdmin]
    serializer_class = PayrollSummarySerializer

    def list(self, request, *args, **kwargs):
        data = []
        payrolls = Payroll.objects.select_related('employee', 'employee__user').all()

        for p in payrolls:
            data.append({
                "id": p.id,
                "employee": {"user": {"username": p.employee.user.username}},
                "year": int(p.month.split()[-1]) if p.month else date.today().year,
                "month": p.month.split()[0] if p.month else "",
                "gross_pay": float(p.base_salary),
                "deductions": float(p.base_salary) - float(p.net_salary),
                "net_pay": float(p.net_salary),
            })
        return Response(data)
