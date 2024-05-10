from django.urls import path
from . import views

app_name = "auth_api"
urlpatterns = [
    path("register", views.CustomUserCreate.as_view(), name="create_user"),
    path("logout/blacklist/", views.BlackListTokenView.as_view(), name="logout"),
    path(
        "password-reset/<str:uidb64>/<token>/",
        views.PasswordTokenCheckAPI.as_view(),
        name="password-reset-confirm",
    ),
    path(
        "request-reset-email",
        views.RequestPasswordResetEmail.as_view(),
        name="request-reset-email",
    ),
    path("change-password", views.SetNewPasswordApiView.as_view(), name="change-password"),
]
