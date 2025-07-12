
"""
API views for product management.
"""
from rest_framework import viewsets, permissions, filters
from enap_backend.models.products import Product
from enap_backend.serializers.products import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint for product management.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'reference', 'category', 'subcategory']
    ordering_fields = ['name', 'reference', 'category', 'purchase_price', 'selling_price', 'quantity']
    ordering = ['name']
