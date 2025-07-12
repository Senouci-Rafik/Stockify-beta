
"""
Defines the Product model for inventory management.
"""
from django.db import models
from django.utils.translation import gettext_lazy as _

class Product(models.Model):
    UNIT_CHOICES = [
        ('KG', 'Kilogramme'),
        ('L', 'Litre'),
        ('U', 'Unité'),
        ('M', 'Mètre'),
        ('M2', 'Mètre carré'),
        ('M3', 'Mètre cube'),
    ]
    
    STATUS_CHOICES = [
        ('in_stock', 'En stock'),
        ('low_stock', 'Stock faible'),
        ('out_of_stock', 'Rupture de stock'),
        ('discontinued', 'Discontinué'),
    ]
    
    reference = models.CharField(_('référence'), max_length=50, unique=True)
    name = models.CharField(_('nom'), max_length=255)
    description = models.TextField(_('description'), blank=True, null=True)
    category = models.CharField(_('catégorie'), max_length=100)
    subcategory = models.CharField(_('sous-catégorie'), max_length=100, blank=True, null=True)
    purchase_price = models.DecimalField(_('prix d\'achat'), max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(_('prix de vente'), max_digits=10, decimal_places=2)
    unit = models.CharField(_('unité'), max_length=5, choices=UNIT_CHOICES, default='U')
    quantity = models.DecimalField(_('quantité'), max_digits=10, decimal_places=2, default=0)
    min_stock = models.DecimalField(_('stock minimal'), max_digits=10, decimal_places=2, default=0)
    status = models.CharField(_('statut'), max_length=20, choices=STATUS_CHOICES, default='in_stock')
    created_at = models.DateTimeField(_('créé le'), auto_now_add=True)
    updated_at = models.DateTimeField(_('mis à jour le'), auto_now=True)
    
    def __str__(self):
        return f"{self.reference} - {self.name}"
    
    def get_stock_status(self):
        if self.quantity <= 0:
            return 'out_of_stock'
        elif self.quantity <= self.min_stock:
            return 'low_stock'
        else:
            return 'in_stock'
            
    def save(self, *args, **kwargs):
        self.status = self.get_stock_status()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _('produit')
        verbose_name_plural = _('produits')
        ordering = ['name']
