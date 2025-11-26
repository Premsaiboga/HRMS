from django.db import models
from employees.models import EmployeeProfile

class Payroll(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processed', 'Processed'),
        ('paid', 'Paid'),
    )

    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE)
    month = models.CharField(max_length=20)  # e.g. 'November 2025'
    base_salary = models.DecimalField(max_digits=10, decimal_places=2)
    total_days = models.IntegerField(default=0)
    present_days = models.IntegerField(default=0)
    leave_days = models.IntegerField(default=0)
    absent_days = models.IntegerField(default=0)
    net_salary = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    paid_date = models.DateField(null=True, blank=True)
    payment_method = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"{self.employee.user.username} - {self.month}"

    def calculate_salary(self):
        # example formula
        daily_rate = self.base_salary / self.total_days if self.total_days else 0
        payable = daily_rate * (self.present_days + self.leave_days)
        self.net_salary = payable
        return self.net_salary
