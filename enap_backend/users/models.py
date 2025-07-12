from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _
from .constants import UserType, ClientCategory

class UserManager(BaseUserManager): #this is the admin
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email field must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('user_type', UserType.SUPER_ADMIN)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        if extra_fields.get('user_type') != UserType.SUPER_ADMIN:
            raise ValueError(_('Superuser must have user_type=super_admin.'))

        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    username = None
    email = models.EmailField(_('email address'), unique=True)
    user_type = models.CharField(
        _('user type'),
        max_length=20,
        choices=UserType.CHOICES,
        default=UserType.RETAIL_CLIENT
    )
    phone_number = models.CharField(_('phone number'), max_length=15, blank=True)
    image = models.ImageField(
        _('profile image'),
        upload_to='users/images/',
        blank=True,
        help_text=_('Supported formats: JPEG, PNG, BMP')
    )
    description = models.TextField(_('description'), blank=True)
    is_sso_authenticated = models.BooleanField(_('SSO authenticated'), default=False)
    last_password_reset_request = models.DateTimeField(_('last password reset request'), null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return self.email

    def is_super_admin(self):
        return self.user_type == UserType.SUPER_ADMIN

    def is_director(self):
        return self.user_type == UserType.DIRECTOR

    def is_comptable(self):
        return self.user_type == UserType.COMPTABLE

    def is_rh(self):
        return self.user_type == UserType.RH

    def is_terminal_user(self):
        return self.user_type == UserType.TERMINAL_USER

    def is_industrial_client(self):
        return self.user_type == UserType.INDUSTRIAL_CLIENT

    def is_retail_client(self):
        return self.user_type == UserType.RETAIL_CLIENT

    def is_reseller_client(self):
        return self.user_type == UserType.RESELLER_CLIENT

    def is_professional_client(self):
        return self.is_industrial_client() or self.is_reseller_client()

    def is_individual_client(self):
        return self.is_retail_client()

class EntrepriseProfile(models.Model):
    company_name = models.CharField(_('company name'), max_length=255)
    company_address = models.TextField(_('company address'))
    company_id = models.CharField(_('company ID'), max_length=50)
    contact_person = models.CharField(_('contact person'), max_length=255)
    delivery_addresses = models.JSONField(_('delivery addresses'), default=list)
    payment_terms = models.CharField(_('payment terms'), max_length=255)
    client_category = models.CharField(
        _('client category'),
        max_length=20,
        choices=ClientCategory.CHOICES
    )

    class Meta:
        abstract = True

class IndustrialClient(User, EntrepriseProfile):
    sector_activity = models.CharField(_('sector of activity'), max_length=100)
    is_priority_client = models.BooleanField(_('priority client'), default=False)
    contract_reference = models.CharField(_('contract reference'), max_length=100, blank=True)

    class Meta:
        verbose_name = _('industrial client')
        verbose_name_plural = _('industrial clients')

    def save(self, *args, **kwargs):
        self.user_type = UserType.INDUSTRIAL_CLIENT
        self.client_category = ClientCategory.INDUSTRIAL
        super().save(*args, **kwargs)

class ResellerClient(User, EntrepriseProfile):
    resale_area = models.CharField(_('resale area'), max_length=255)
    monthly_estimate = models.FloatField(_('monthly estimate'), default=0.0)
    has_resale_agreement = models.BooleanField(_('has resale agreement'), default=False)

    class Meta:
        verbose_name = _('reseller client')
        verbose_name_plural = _('reseller clients')

    def save(self, *args, **kwargs):
        self.user_type = UserType.RESELLER_CLIENT
        self.client_category = ClientCategory.RESELLER
        super().save(*args, **kwargs)

class RetailPoint(User):
    location = models.CharField(_('location'), max_length=255)
    store_manager_name = models.CharField(_('store manager name'), max_length=255)
    store_code = models.CharField(_('store code'), max_length=50, unique=True)
    assigned_region = models.CharField(_('assigned region'), max_length=255)
    opening_hours = models.CharField(_('opening hours'), max_length=255)

    class Meta:
        verbose_name = _('retail point')
        verbose_name_plural = _('retail points')

    def save(self, *args, **kwargs):
        self.user_type = UserType.RETAIL_CLIENT
        super().save(*args, **kwargs)

class SuperAdminUser(User):
    class Meta:
        proxy = True
        verbose_name = _('super administrator')
        verbose_name_plural = _('super administrators')

    def save(self, *args, **kwargs):
        self.user_type = UserType.SUPER_ADMIN
        super().save(*args, **kwargs)

class DirectorUser(User):
    class Meta:
        proxy = True
        verbose_name = _('director')
        verbose_name_plural = _('directors')

    def save(self, *args, **kwargs):
        self.user_type = UserType.DIRECTOR
        super().save(*args, **kwargs)

class ComptableUser(User):
    class Meta:
        proxy = True
        verbose_name = _('comptable')
        verbose_name_plural = _('comptables')

    def save(self, *args, **kwargs):
        self.user_type = UserType.COMPTABLE
        super().save(*args, **kwargs)

class RHUser(User):
    class Meta:
        proxy = True
        verbose_name = _('human resources')
        verbose_name_plural = _('human resources')

    def save(self, *args, **kwargs):
        self.user_type = UserType.RH
        super().save(*args, **kwargs)

class TerminalUser(User):
    class Meta:
        proxy = True
        verbose_name = _('terminal user')
        verbose_name_plural = _('terminal users')

    def save(self, *args, **kwargs):
        self.user_type = UserType.TERMINAL_USER
        super().save(*args, **kwargs) 
