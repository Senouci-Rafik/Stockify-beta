
"""
Defines the custom User model for the project.

We use email for login and add extra fields relevant to your business.
"""
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    """
    Custom manager for User. Only email is required, not username.
    """
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('L\'adresse email est obligatoire')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    """
    Main user model for authentication and permissions.
    """
    username = None  # Remove the default username field
    email = models.EmailField(_('adresse email'), unique=True)
    name = models.CharField(_('nom complet'), max_length=255)
    role = models.CharField(_('rôle principal'), max_length=100)
    specific_role = models.CharField(_('type de rôle'), max_length=100)
    notes = models.TextField(_('notes'), blank=True, null=True)

    # If you copy-paste this file elsewhere, remove these lines if you see related_name clash errors.
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name=_('groups'),
        blank=True,
        related_name='custom_user_set',
        help_text=_(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_query_name='custom_user',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name=_('user permissions'),
        blank=True,
        related_name='custom_user_set',
        help_text=_('Specific permissions for this user.'),
        related_query_name='custom_user',
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'role', 'specific_role']

    objects = UserManager()

    def __str__(self):
        return self.email
