from django.urls import path
from .views import PayrollListCreateView

urlpatterns = [
    path('', PayrollListCreateView.as_view(), name='payroll-list-create'),
]
