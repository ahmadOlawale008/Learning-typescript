from django.test import TestCase

# Create your tests here.
from django.test import TestCase
from django.contrib.auth.models import User
from base.models import Post, Category
from django.utils.text import slugify


# Create your tests here.
class SampleTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.test_category = Category.objects.create(name="Node Js")
        test_user1 = User.objects.create(
            username="test_user1", password="test_password1"
        )
        cls.test_post = Post.objects.create(
            author=test_user1,
            category=cls.test_category,
            title="Title A",
            slug=slugify("Title A"),
            description="This is description A",
        )
        return super().setUpTestData()

    def test_content(self):
        self.assertEqual(str(self.test_category), "Node Js")
        self.assertEqual(str(self.test_post), "Title A")
