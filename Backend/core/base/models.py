from typing import Any
from django.db import models
from django.contrib.auth.models import User

from django.utils.translation import gettext_lazy as _
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.models import (
    AbstractUser,
    BaseUserManager,
    AbstractBaseUser,
    PermissionsMixin,
)
from django.core.validators import RegexValidator, EmailValidator, BaseValidator
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.utils import timezone

# class NewUser(AbstractUser):
#     phone_number = models.CharField(
#         max_length=15,
#         validators=[
#             RegexValidator(
#                 regex=r"^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$"
#             )
#         ],
#         null=True,
#         blank=True
#     )
# class UserProfile(models.Model):

class CustomAccountManager(BaseUserManager):

    def create_superuser(
        self, email, phone_number, username, password, **other_fields
    ):
        other_fields.setdefault("is_staff", True)
        other_fields.setdefault("is_superuser", True)
        other_fields.setdefault("is_active", True)
        
        if other_fields.get("is_staff") is not True:
            raise ValueError("Superuser must be set to is_staff=True")
        if other_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must be set to is_superuser=True")
        self.create_user(email, phone_number, username, password, **other_fields)
    def create_user(
        self, email, phone_number, username, password, **other_fields
    ):
        email = self.normalize_email(email)
        if not email:
            raise ValueError("Please provide an email address")
        if not phone_number:
            raise ValueError("Please provide your phone number")
        user = self.model(
            email=email,
            phone_number=phone_number,
            username=username,
            password=password,
            **other_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

from django.core.exceptions import ValidationError
class NewUser(AbstractBaseUser, PermissionsMixin):
    def validator_alpha(value):
        if not value.isalpha():
            raise ValidationError(_("Name should only contain alhabelts"), params={"value": value})
    email = models.EmailField(
        _("Email Address"), unique=True, validators=[EmailValidator]
    )
    username = models.CharField(max_length=230, unique=True)
    phone_number = models.CharField(
        _("Phone number"),
        max_length=15,
        unique=True,
        validators=[
            RegexValidator(
                regex=r"^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$"
            )
        ],
    )
    start_date = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now_add=True)
    first_name = models.CharField(verbose_name=_("First name"), validators=[validator_alpha], error_messages=_("Please make sure your first_name contain only alphabelts"), max_length=150, blank=True)
    about = models.TextField(_("about"), max_length=500, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "phone_number",]
    objects = CustomAccountManager()
    def __str__(self):
        return self.username

class Category(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name
from django.shortcuts import get_object_or_404
def upload_to(instance, filename):
    return f'posts/{filename}'
class Post(models.Model):
    class StatusChoices(models.TextChoices):
        draft = "draft", _("Draft")
        published = "published", _("Published")

    class PostObjectManager(models.Manager):
        def get_queryset(self):
            return super().get_queryset().filter(status="published")

    category = models.ForeignKey(Category, on_delete=models.PROTECT, default=1)
    title = models.CharField(max_length=30)
    image = models.ImageField(
        _("Image"),
        upload_to=upload_to,
        default="posts/account_circle_48dp_FILL0_wght400_GRAD0_opsz48.png",
    )
    description = models.TextField(null=True)
    slug = models.SlugField(max_length=250, unique_for_date="published")
    published = models.DateTimeField(default=timezone.now)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="blog_posts"
    )
    status = models.CharField(
        max_length=9, default="published", choices=StatusChoices.choices
    )
    objects = models.Manager()
    postObjects = PostObjectManager()

    def save(self, *args, **kwargs):
        self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    def __str__(self):
        return self.title[:15]

    class Meta:
        ordering = [
            "-published",
        ]
