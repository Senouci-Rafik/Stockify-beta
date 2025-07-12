"""
Admin configuration for the products app.
"""
from django.contrib import admin
from products.models import Product, Gamme, Famille, Emballage

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('reference', 'nom', 'gamme', 'famille', 'quantite', 'date_expiration')
    list_filter = ('gamme', 'famille', 'emballage')
    search_fields = ('nom', 'reference', 'description')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('reference', 'nom', 'description')
        }),
        ('Classification', {
            'fields': ('gamme', 'famille', 'emballage')
        }),
        ('Product Details', {
            'fields': ('poids_emballage', 'couleurs', 'image')
        }),
        ('Inventory & Dates', {
            'fields': ('quantite', 'date_fabrication', 'date_expiration')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Gamme)
class GammeAdmin(admin.ModelAdmin):
    list_display = ('nom', 'description', 'created_at')
    search_fields = ('nom', 'description')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Famille)
class FamilleAdmin(admin.ModelAdmin):
    list_display = ('nom', 'gamme', 'created_at')
    list_filter = ('gamme',)
    search_fields = ('nom',)
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Emballage)
class EmballageAdmin(admin.ModelAdmin):
    list_display = ('nom', 'code', 'capacite', 'unite', 'created_at')
    search_fields = ('nom', 'code')
    readonly_fields = ('created_at', 'updated_at')
