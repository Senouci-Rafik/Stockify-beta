from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

from .models import (
    User, SuperAdminUser, DirectorUser, ComptableUser, RHUser, TerminalUser,
    IndustrialClient, ResellerClient, RetailPoint
)

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'user_type', 'is_staff', 'is_active',)
    list_filter = ('user_type', 'is_staff', 'is_active',)
    search_fields = ('email',)
    ordering = ('email',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('phone_number', 'image', 'description')}),
        (_('Permissions'), {
            'fields': ('user_type', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined', 'last_password_reset_request')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'user_type'),
        }),
    )


@admin.register(SuperAdminUser)
class SuperAdminUserAdmin(CustomUserAdmin):
    def get_queryset(self, request):
        return super().get_queryset(request).filter(user_type='super_admin')

@admin.register(DirectorUser)
class DirectorUserAdmin(CustomUserAdmin):
    def get_queryset(self, request):
        return super().get_queryset(request).filter(user_type='director')

@admin.register(ComptableUser)
class ComptableUserAdmin(CustomUserAdmin):
    def get_queryset(self, request):
        return super().get_queryset(request).filter(user_type='comptable')

@admin.register(RHUser)
class RHUserAdmin(CustomUserAdmin):
    def get_queryset(self, request):
        return super().get_queryset(request).filter(user_type='rh')

@admin.register(TerminalUser)
class TerminalUserAdmin(CustomUserAdmin):
    def get_queryset(self, request):
        return super().get_queryset(request).filter(user_type='terminal_user')

@admin.register(IndustrialClient)
class IndustrialClientAdmin(CustomUserAdmin):
    def get_queryset(self, request):
        return super().get_queryset(request).filter(user_type='client_industriel')

@admin.register(ResellerClient)
class ResellerClientAdmin(CustomUserAdmin):
    def get_queryset(self, request):
        return super().get_queryset(request).filter(user_type='client_revendeur')

@admin.register(RetailPoint)
class RetailPointAdmin(CustomUserAdmin):
    def get_queryset(self, request):
        return super().get_queryset(request).filter(user_type='client_point_vente') 
