from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase
from base.models import Post, Category
from django.contrib.auth.models import User
from django.urls import reverse
from django.utils.text import slugify
from rest_framework.test import APIClient
from base.models import Post
class PostTests(APITestCase):
    def setUp(self):
        self.test_user1 = User.objects.create(
            username="Username A", password="password A"
        )
        self.test_category = Category.objects.create(name="Test Category")

        return super().setUp()
    def test_view_posts(self):
        url = reverse("drf_api:post_list")
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def create_post_test(self):
        data = {
            "author": 1,
            "category": 1,
            "title": "Title A",
            "slug": slugify("Title A"),
            "description": "This is description A",
        }
        url = reverse("drf_api:post_list")
        response = self.client.post(url, data, format="json")
        print(response.request, response.serialize)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    def test_post_update_success(self):
        client = APIClient()
        self.test_categoryB = Category.objects.create(name="Test_categoryB")
        self.test_user2 = User.objects.create(
            username="test_user_2", password="test_user2_password"
        )
        test_user = self.test_user1
        client.login(username="test_user_2", password="test_user2_password")
        self.test_postA = Post.objects.create(
            category=self.test_categoryB,
            title="Test Post B Title",
            description="Test post description title",
            slug=slugify("Test Post B Title"),
            status = Post.StatusChoices.choices[0],
            author = test_user)
        url = reverse("drf_api:detailcreate", kwargs={"pk": self.test_postA.pk})
        response = self.client.put(url, {"title": "This is title"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    def test_post_update_failure(self):
        client = APIClient()
        self.test_categoryB = Category.objects.create(name="Test_categoryB")
        self.test_user2 = User.objects.create(
            username="test_user_2", password="test_user2_password"
        )
        client.login(username="test_user_2", password="test_user2_password")
        self.test_postA = Post.objects.create(
            category=self.test_categoryB,
            title="Test Post B Title",
            description="Test post description title",
            slug=slugify("Test Post B Title"),
            author=self.test_user1,
        )
        url = reverse("drf_api:detailcreate", kwargs={"pk": self.test_postA.pk})
        response = self.client.put(url, {"title": "This is title"})
        print(response.data)
