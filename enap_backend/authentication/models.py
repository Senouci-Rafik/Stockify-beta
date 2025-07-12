from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    ROLE_CHOICES = [
        ('ADMIN', _('Administrator')),
        ('PROFESSIONAL', _('Professional Client')),
        ('INDIVIDUAL', _('Individual Client')),
    ]

    email = models.EmailField(_('Email address'), unique=True)
    role = models.CharField(_('Role'), max_length=20, choices=ROLE_CHOICES, default='INDIVIDUAL')
    phone_number = models.CharField(_('Phone Number'), max_length=20, blank=True)
    address = models.TextField(_('Address'), blank=True)
    company_name = models.CharField(_('Company Name'), max_length=100, blank=True)
    is_active = models.BooleanField(_('Active'), default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        ordering = ['-date_joined']

    def __str__(self):
        return self.email

    @property
    def is_admin(self):
        return self.role == 'ADMIN'

    @property
    def is_professional(self):
        return self.role == 'PROFESSIONAL'

    @property
    def is_individual(self):
        return self.role == 'INDIVIDUAL' 
