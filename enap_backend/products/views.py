from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Product, Gamme, Famille, Emballage
from .serializers import (
    ProductSerializer,
    GammeSerializer,
    FamilleSerializer,
    EmballageSerializer
)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    
    def by_gamme(self, request):
        gamme_id = request.query_params.get('gamme_id')
        if not gamme_id:
            return Response(
                {"error": "gamme_id parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        products = Product.objects.filter(gamme_id=gamme_id)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_famille(self, request):
        famille_id = request.query_params.get('famille_id')
        if not famille_id:
            return Response(
                {"error": "famille_id parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        products = Product.objects.filter(famille_id=famille_id)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

class GammeViewSet(viewsets.ModelViewSet):
    queryset = Gamme.objects.all()
    serializer_class = GammeSerializer
    permission_classes = [IsAuthenticated]

class FamilleViewSet(viewsets.ModelViewSet):
    queryset = Famille.objects.all()
    serializer_class = FamilleSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def by_gamme(self, request):
        gamme_id = request.query_params.get('gamme_id')
        if not gamme_id:
            return Response(
                {"error": "gamme_id parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        familles = Famille.objects.filter(gamme_id=gamme_id)
        serializer = self.get_serializer(familles, many=True)
        return Response(serializer.data)

class EmballageViewSet(viewsets.ModelViewSet):
    queryset = Emballage.objects.all()
    serializer_class = EmballageSerializer
    permission_classes = [IsAuthenticated] 
