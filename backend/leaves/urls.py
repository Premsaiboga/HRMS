from django.urls import path
from .views import LeaveRequestListCreateView, LeaveRequestRetrieveUpdateDestroyView

urlpatterns = [
    path('', LeaveRequestListCreateView.as_view(), name='leave-list-create'),
    path('<int:pk>/', LeaveRequestRetrieveUpdateDestroyView.as_view(), name='leave-detail'),
]
