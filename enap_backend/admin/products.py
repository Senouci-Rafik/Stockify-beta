
"""
Admin configuration for the products app.
"""
from django.contrib import admin
from ..models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('reference', 'name', 'category', 'purchase_price', 'selling_price', 'quantity', 'status')
    list_filter = ('category', 'status')
    search_fields = ('name', 'reference', 'description')
    readonly_fields = ('status',)
    fieldsets = (
        ('Basic Information', {
            'fields': ('reference', 'name', 'description')
        }),
        ('Classification', {
            'fields': ('category', 'subcategory')
        }),
        ('Pricing', {
            'fields': ('purchase_price', 'selling_price')
        }),
        ('Inventory', {
            'fields': ('unit', 'quantity', 'min_stock', 'status')
        }),
    )
