from django.urls import path
# from base.views import update_profile
from django.views.generic import TemplateView

app_name = "basic_app"
urlpatterns = [
    # path("", update_profile, name="update_profile")
    path("site", TemplateView.as_view(template_name="base/profile.html")),
]