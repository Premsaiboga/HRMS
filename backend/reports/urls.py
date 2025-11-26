from django.urls import path
from .views import AttendanceSummaryListView, LeaveSummaryListView, PayrollSummaryListView

urlpatterns = [
    path('attendance/', AttendanceSummaryListView.as_view(), name='attendance-summary'),
    path('leaves/', LeaveSummaryListView.as_view(), name='leave-summary'),
    path('payroll/', PayrollSummaryListView.as_view(), name='payroll-summary'),
]
