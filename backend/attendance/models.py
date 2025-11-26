from django.db import models
from employees.models import EmployeeProfile
from django.contrib.auth import get_user_model

User = get_user_model()

class Attendance(models.Model):
    STATUS_CHOICES = (
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('leave', 'Leave'),
    )

    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='present')
    marked_by_hr = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('employee', 'date')  # prevent duplicate entries

    def __str__(self):
        return f"{self.employee.user.username} - {self.date} ({self.status})"
