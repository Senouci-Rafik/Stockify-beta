from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from users.constants import UserType

User = get_user_model()

class Command(BaseCommand):
    help = 'Créer des utilisateurs de test pour l\'application'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🚀 Création d\'utilisateurs de test...'))
        
        # Créer un utilisateur directeur
        director, created = User.objects.get_or_create(
            email='test@example.com',
            defaults={
                'first_name': 'Test',
                'last_name': 'User',
                'user_type': UserType.DIRECTOR,
                'is_active': True,
                'is_staff': True,
            }
        )
        
        if created:
            director.set_password('testpassword123')
            director.save()
            self.stdout.write(
                self.style.SUCCESS(f'✅ Directeur créé: {director.email} / testpassword123')
            )
        else:
            director.set_password('testpassword123')
            director.save()
            self.stdout.write(
                self.style.SUCCESS(f'✅ Directeur mis à jour: {director.email} / testpassword123')
            )

        # Créer un utilisateur client industriel
        industrial_client, created = User.objects.get_or_create(
            email='client@example.com',
            defaults={
                'first_name': 'Client',
                'last_name': 'Industriel',
                'user_type': UserType.INDUSTRIAL_CLIENT,
                'is_active': True,
            }
        )
        
        if created:
            industrial_client.set_password('client123')
            industrial_client.save()
            self.stdout.write(
                self.style.SUCCESS(f'✅ Client industriel créé: {industrial_client.email} / client123')
            )
        else:
            industrial_client.set_password('client123')
            industrial_client.save()
            self.stdout.write(
                self.style.SUCCESS(f'✅ Client industriel mis à jour: {industrial_client.email} / client123')
            )

        # Créer un utilisateur point de vente
        retail_client, created = User.objects.get_or_create(
            email='retail@example.com',
            defaults={
                'first_name': 'Point',
                'last_name': 'Vente',
                'user_type': UserType.RETAIL_CLIENT,
                'is_active': True,
            }
        )
        
        if created:
            retail_client.set_password('retail123')
            retail_client.save()
            self.stdout.write(
                self.style.SUCCESS(f'✅ Point de vente créé: {retail_client.email} / retail123')
            )
        else:
            retail_client.set_password('retail123')
            retail_client.save()
            self.stdout.write(
                self.style.SUCCESS(f'✅ Point de vente mis à jour: {retail_client.email} / retail123')
            )

        self.stdout.write(self.style.SUCCESS('\n✅ Tous les utilisateurs de test ont été créés!'))
        self.stdout.write(self.style.WARNING('\n📋 Identifiants de test:'))
        self.stdout.write('   - Directeur: test@example.com / testpassword123')
        self.stdout.write('   - Client Industriel: client@example.com / client123')
        self.stdout.write('   - Point de Vente: retail@example.com / retail123') 