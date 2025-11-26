from django.db import models
from employees.models import EmployeeProfile
from django.utils.timezone import now

class AttendanceSummary(models.Model):
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE)
    month = models.DateField()  # Usually set to first day of the month for aggregation
    total_present = models.PositiveIntegerField(default=0)
    total_absent = models.PositiveIntegerField(default=0)
    total_leave = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('employee', 'month')

    def __str__(self):
        return f"{self.employee.user.username} - {self.month.strftime('%B %Y')}"

class LeaveSummary(models.Model):
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE)
    year = models.PositiveIntegerField(default=now().year)
    total_leaves_taken = models.PositiveIntegerField(default=0)
    total_leaves_pending = models.PositiveIntegerField(default=0)
    total_leaves_approved = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('employee', 'year')

    def __str__(self):
        return f"{self.employee.user.username} - {self.year}"

class PayrollSummary(models.Model):
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE)
    year = models.PositiveIntegerField(default=now().year)
    month = models.PositiveIntegerField()  # 1 for Jan to 12 for Dec
    gross_pay = models.DecimalField(max_digits=10, decimal_places=2)
    deductions = models.DecimalField(max_digits=10, decimal_places=2)
    net_pay = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ('employee', 'year', 'month')

    def __str__(self):
        return f"{self.employee.user.username} - {self.month}/{self.year}"
