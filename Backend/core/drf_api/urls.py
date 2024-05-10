from django.urls import path
from django.contrib.auth import views as auth_view
from .views import PostList, PostDetail
from django.urls import include
app_name = "drf_api"
urlpatterns = [
    path("<int:pk>", PostDetail.as_view(), name="detailcreate"),
    path("", PostList.as_view(), name="post_list"),
    path("auth/", include("authentication.urls", namespace="auth_api"))
]
