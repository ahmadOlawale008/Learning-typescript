from typing import Any
from django.contrib import admin
from django.http import HttpRequest
from django.http.response import HttpResponse
from django.contrib.auth.admin import UserAdmin
from base.models import Post, Category, NewUser


@admin.display(description="Name")
def upper_case_name(obj):
    return ("%s %s" % (obj.title, obj.category.name)).capitalize()

class PersonAdmin(admin.ModelAdmin):
    list_display = (
        upper_case_name,
        "id",
        "author",
        "status",
    )
    prepopulated_fields = {"slug": ["title",]}

admin.site.register(Post, PersonAdmin)
admin.site.register(Category)


from django.db import models
from django.forms import Textarea
from django import forms
from django.contrib.auth.forms import UserCreationForm


class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True) 
    phone_number = forms.CharField(max_length=15, required=True)
    class Meta:
        model = NewUser
        fields = ("username", "email", "phone_number")
    def save(self, commit=True):
        new_user = super().save(commit=False)
        new_user.email = self.cleaned_data['email']
        new_user.phone_number = self.cleaned_data['phone_number']
        if commit:
            new_user.set_password(self.cleaned_data['password1']) 
            new_user.save()
        return new_user


class NewUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    add_form_template = "base/add_form.html"

    fieldsets = (
        (None, {"fields": ("username",)}),
        ("Personal info", {"fields": ("first_name", "phone_number", "email", "about")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Important dates", {"fields": ("start_date", "updated")}),
    )
    list_display = (
        "username",
        "email",
        "phone_number",
        "is_superuser",
        "is_staff",
        "is_active",
    )
    readonly_fields = ["updated"]
    formfield_overrides = {
        models.TextField: {"widget": Textarea(attrs={"rows": 15, "cols": 200})},
    }
    search_fields = [
        "username",
        "email",
        "first_name",
        "phone_number",
        "is_superuser",
        "is_staff",
        "is_active",
    ]
    ordering = [
        "username",
    ]
print("------------------")
print(NewUserAdmin.exclude)
admin.site.register(NewUser, NewUserAdmin)
