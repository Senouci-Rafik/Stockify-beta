from django.db import models
from django.utils import timezone
import uuid

class Gamme(models.Model):
    nom = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nom

    class Meta:
        verbose_name = "Gamme"
        verbose_name_plural = "Gammes"

class Famille(models.Model):
    nom = models.CharField(max_length=100)
    gamme = models.ForeignKey(Gamme, on_delete=models.CASCADE, related_name='familles')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nom} ({self.gamme.nom})"

    class Meta:
        verbose_name = "Famille"
        verbose_name_plural = "Familles"

class Emballage(models.Model):
    nom = models.CharField(max_length=100)
    code = models.CharField(max_length=50, unique=True)
    capacite = models.DecimalField(max_digits=10, decimal_places=2)
    unite = models.CharField(max_length=20)  # kg, L, etc.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nom} ({self.capacite} {self.unite})"

    class Meta:
        verbose_name = "Emballage"
        verbose_name_plural = "Emballages"

class Product(models.Model):
    reference = models.CharField(max_length=50, unique=True)
    nom = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    gamme = models.ForeignKey(Gamme, on_delete=models.CASCADE, related_name='products')
    famille = models.ForeignKey(Famille, on_delete=models.CASCADE, related_name='products')
    emballage = models.ForeignKey(Emballage, on_delete=models.CASCADE, related_name='products')
    quantite = models.IntegerField(default=0)
    poids_emballage = models.DecimalField(max_digits=10, decimal_places=2)
    couleurs = models.JSONField(default=list)  # Liste des couleurs disponibles
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    date_fabrication = models.DateField()
    date_expiration = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nom} ({self.reference})"

    class Meta:
        verbose_name = "Produit"
        verbose_name_plural = "Produits"
        ordering = ['-created_at'] 
