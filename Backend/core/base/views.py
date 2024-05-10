from django.shortcuts import render, redirect
from django.http import HttpResponse
# from base.forms import UserForm, UserProfileForm
from django.contrib.auth.decorators import login_required
from django.db import transaction
# from base.models import UserProfilemm
from django.contrib.auth import login, authenticate
from django.core.exceptions import ObjectDoesNotExist


# Create your views here.


# def login_user(request):
#     error_message = None
#     if request.method == "POST":
#         username = request.POST.get("username")
#         password = request.POST.get("password")
#         user = authenticate(username, password)
#         if user:
#             login(request, user)
#         else:
#             error_message = "Invalid username or password"
#     return render(request, "base/login.html", {"error_message": error_message})


# @login_required
# @transaction.atomic
# def update_profile(request):
#     if request.method == "POST":
#         user_form = UserForm(request.POST, instance=request.user)
#         user_profile_form = UserProfileForm(request.POST, instance=request.user.profile)
#         if user_form.is_valid() and user_profile_form.is_valid():
#             user_form.save()
#             user_profile_form.save()
#             return redirect("basic_app:update_profile")
#     else:
#         try:
#             user_form = UserForm(instance=request.user)
#             user_profile = UserProfileForm(instance=request.user.profile)
#         except Exception as e:
#             return HttpResponse("<h1>Sorry this profile does not exits</h1>")
#         return render(
#             request,
#             "base/profile.html",
#             {"user_form": user_form, "profile_form": user_profile},
#     )
