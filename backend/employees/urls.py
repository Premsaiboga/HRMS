# employees/urls.py
from django.urls import path
from .views import EmployeeProfileListCreateView, EmployeeProfileRetrieveUpdateDestroyView

urlpatterns = [
    path('', EmployeeProfileListCreateView.as_view(), name='employee-list-create'),
    path('<int:pk>/', EmployeeProfileRetrieveUpdateDestroyView.as_view(), name='employee-detail'),
]
