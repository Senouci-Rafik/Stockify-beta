from rest_framework import serializers
from .models import Product, Gamme, Famille, Emballage

class EmballageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Emballage
        fields = ['id', 'nom', 'code', 'capacite', 'unite']

class FamilleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Famille
        fields = ['id', 'nom', 'gamme']

class GammeSerializer(serializers.ModelSerializer):
    familles = FamilleSerializer(many=True, read_only=True)

    class Meta:
        model = Gamme
        fields = ['id', 'nom', 'description', 'familles']

class ProductSerializer(serializers.ModelSerializer):
    gamme = GammeSerializer(read_only=True)
    famille = FamilleSerializer(read_only=True)
    emballage = EmballageSerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'nom', 'description', 'gamme', 'famille', 'emballage',
            'quantite', 'poids_emballage', 'couleurs', 'image',
            'date_fabrication', 'date_expiration', 'reference',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, data):
        # Validate that the reference matches the generated logic
        gamme_name = data.get('gamme')
        famille_name = data.get('famille')
        emballage_name = data.get('emballage')
        submitted_reference = data.get('reference')

        if not all([gamme_name, famille_name, emballage_name, submitted_reference]):
            raise serializers.ValidationError("Gamme, Famille, Emballage and Reference are required fields.")

        # Retrieve Gamme, Famille, and Emballage objects
        try:
            gamme_obj = Gamme.objects.get(nom=gamme_name)
            famille_obj = Famille.objects.get(nom=famille_name, gamme=gamme_obj)
            emballage_obj = Emballage.objects.get(nom=emballage_name)
        except (Gamme.DoesNotExist, Famille.DoesNotExist, Emballage.DoesNotExist):
            raise serializers.ValidationError("Gamme, Famille or Emballage not found.")

        # Define the mapping for gamme letters
        gamme_letter_map = {
            "Batiment": "B",
            "Aviation": "A",
            "Carrosserie": "C",
            "Vernis": "V",
            "Industrie": "I",
        }
        gamme_initial = gamme_letter_map.get(gamme_obj.nom, '')

        # Retrieve all familles for the selected gamme to determine index
        all_familles_in_gamme = list(Famille.objects.filter(gamme=gamme_obj).order_by('nom').values_list('nom', flat=True))
        try:
            famille_index = all_familles_in_gamme.index(famille_obj.nom) + 1
        except ValueError:
            raise serializers.ValidationError("Famille not found within the selected Gamme.")

        # Define the mapping for emballage code
        emballage_code = "1" if emballage_obj.nom == "Seau métallique" else "2"

        # Generate the expected reference
        expected_reference = f"{gamme_initial}{famille_index}{emballage_code}01"

        if submitted_reference != expected_reference:
            raise serializers.ValidationError("Generated reference does not match the submitted reference.")

        return data 
