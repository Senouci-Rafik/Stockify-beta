from rest_framework import permissions

class IsSuperUser(permissions.BasePermission):
    """
    Allows access only to superusers.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser

class IsDirector(permissions.BasePermission):
    """
    Allows access only to director users.
    """
    def has_permission(self, request, _view):
        return request.user and request.user.is_authenticated and request.user.is_director()

class IsAdmin(permissions.BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, _view):
        return request.user and request.user.is_authenticated and request.user.is_admin()

class IsComptable(permissions.BasePermission):
    """
    Allows access only to comptable (accounting) users.
    Can manage invoices, financial reports, and payments.
    """
    def has_permission(self, request, _view):
        return request.user and request.user.is_authenticated and request.user.is_comptable()

class IsRH(permissions.BasePermission):
    """
    Allows access only to HR users.
    Can manage users, roles, and permissions.
    """
    def has_permission(self, request, _view):
        return request.user and request.user.is_authenticated and request.user.is_rh()

class IsTerminalUser(permissions.BasePermission):
    """
    Allows access only to terminal users.
    Can manage deliveries, inventory movements, and terminal operations.
    """
    def has_permission(self, request, _view):
        return request.user and request.user.is_authenticated and request.user.is_terminal_user()

class IsIndustrialClient(permissions.BasePermission):
    """
    Allows access only to industrial clients.
    """
    def has_permission(self, request, _view):
        return request.user and request.user.is_authenticated and request.user.is_industrial_client()

class IsRetailClient(permissions.BasePermission):
    """
    Allows access only to retail point clients.
    """
    def has_permission(self, request, _view):
        return request.user and request.user.is_authenticated and request.user.is_retail_client()

class IsClient(permissions.BasePermission):
    """
    Allows access to both industrial and retail clients.
    """
    def has_permission(self, request, _view):
        return request.user and request.user.is_authenticated and (
            request.user.is_industrial_client() or request.user.is_retail_client()
        )

class IsOwnerOrDirector(permissions.BasePermission):
    """
    Allows access only to the owner of the profile or directors.
    """
    def has_object_permission(self, request, view, obj):
        return obj == request.user or request.user.is_director()

class CanManageProducts(permissions.BasePermission):
    """
    Allows access to manage products only to director users and industrial clients.
    """
    def has_permission(self, request, _view):
        return request.user and request.user.is_authenticated and (
            request.user.is_director() or request.user.is_industrial_client()
        )

class CanViewOrders(permissions.BasePermission):
    """
    Allows access to view orders to all authenticated users.
    """
    def has_permission(self, request, _view):
        return request.user and request.user.is_authenticated

class CanManageOrders(permissions.BasePermission):
    """
    Allows access to manage orders only to director users and industrial clients.
    """
    def has_permission(self, request, _view):
        return request.user and request.user.is_authenticated and (
            request.user.is_director() or request.user.is_industrial_client()
        )

class CanViewInvoices(permissions.BasePermission):
    """
    Allows access to view invoices to all authenticated users.
    """
    def has_permission(self, request, _view):
        return request.user and request.user.is_authenticated

class CanManageInvoices(permissions.BasePermission):
    """
    Allows access to manage invoices only to director users and comptable.
    """
    def has_permission(self, request, _view):
        return request.user and request.user.is_authenticated and (
            request.user.is_director() or request.user.is_comptable()
        )

class CanManageFinancialReports(permissions.BasePermission):
    """
    Allows access to manage financial reports only to comptable and director.
    """
    def has_permission(self, request, _view):
        return request.user and request.user.is_authenticated and (
            request.user.is_comptable() or request.user.is_director()
        )

class CanManageUsers(permissions.BasePermission):
    """
    Allows access to manage users only to HR and director.
    """
    def has_permission(self, request, _view):
        return request.user and request.user.is_authenticated and (
            request.user.is_rh() or request.user.is_director()
        )

class CanManageTerminal(permissions.BasePermission):
    """
    Allows access to manage terminal operations only to terminal users and director.
    """
    def has_permission(self, request, _view):
        return request.user and request.user.is_authenticated and (
            request.user.is_terminal_user() or request.user.is_director()
        )

class CanViewExpiredAlerts(permissions.BasePermission):
    """
    Allows access to view expired product alerts to all authenticated users.
    """
    def has_permission(self, request, _view):
        return request.user and request.user.is_authenticated

class CanManageExpiredAlerts(permissions.BasePermission):
    """
    Allows access to manage expired product alerts only to director users.
    """
    def has_permission(self, request, _view):
        return request.user and request.user.is_authenticated and request.user.is_director()

class CanCreateUsers(permissions.BasePermission):
    """
    Allows access to create users only to superusers and HR.
    """
    def has_permission(self, request, _view):
        return request.user and request.user.is_authenticated and (
            request.user.is_superuser or request.user.is_rh()
        )

class CanUpdateUsers(permissions.BasePermission):
    """
    Allows access to update users only to superusers, HR, and the user themselves.
    """
    def has_object_permission(self, request, view, obj):
        return (
            request.user.is_superuser or 
            request.user.is_rh() or 
            obj == request.user
        )

class CanDeleteUsers(permissions.BasePermission):
    """
    Allows access to delete users only to superusers and HR.
    """
    def has_permission(self, request, _view):
        return request.user and request.user.is_authenticated and (
            request.user.is_superuser or request.user.is_rh()
        ) 
