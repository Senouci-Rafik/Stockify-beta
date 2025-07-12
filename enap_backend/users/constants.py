from django.utils.translation import gettext_lazy as _

class UserType:
    SUPER_ADMIN = 'super_admin'
    DIRECTOR = 'director'
    COMPTABLE = 'comptable'
    RH = 'rh'
    TERMINAL_USER = 'terminal_user'
    INDUSTRIAL_CLIENT = 'client_industriel'
    RETAIL_CLIENT = 'client_point_vente'
    RESELLER_CLIENT = 'client_revendeur'

    CHOICES = (
        (SUPER_ADMIN, _('Super Administrator')),
        (DIRECTOR, _('Director')),
        (COMPTABLE, _('Comptable')),
        (RH, _('Human Resources')),
        (TERMINAL_USER, _('Terminal User')),
        (INDUSTRIAL_CLIENT, _('Industrial Client')),
        (RETAIL_CLIENT, _('Retail Point')),
        (RESELLER_CLIENT, _('Reseller Client')),
    )

class ClientCategory:
    INDUSTRIAL = 'industriel'
    RESELLER = 'revendeur'

    CHOICES = (
        (INDUSTRIAL, _('Industrial')),
        (RESELLER, _('Reseller')),
    )
