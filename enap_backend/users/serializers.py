from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _
from .constants import UserType, ClientCategory
from .models import IndustrialClient, ResellerClient, RetailPoint, EntrepriseProfile # Import necessary models

User = get_user_model()

class UserCreationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    userType = serializers.CharField(write_only=True, required=True, source='user_type') # Map frontend's userType to backend's user_type

    # Fields common to all users (basic info)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)

    # Fields for professional clients (common to IndustrialClient and ResellerClient)
    companyName = serializers.CharField(write_only=True, required=False, source='company_name')
    companyAddress = serializers.CharField(write_only=True, required=False, source='company_address')
    taxId = serializers.CharField(write_only=True, required=False, source='nif') # Assuming taxId maps to nif

    # Fields specific to IndustrialClient
    sectorActivity = serializers.CharField(write_only=True, required=False, source='sector_activity')
    isPriorityClient = serializers.BooleanField(write_only=True, required=False, source='is_priority_client')
    contractReference = serializers.CharField(write_only=True, required=False, allow_blank=True, source='contract_reference')

    # Fields specific to ResellerClient
    resaleArea = serializers.CharField(write_only=True, required=False, allow_blank=True, source='resale_area')
    monthlyEstimate = serializers.FloatField(write_only=True, required=False, source='monthly_estimate')
    hasResaleAgreement = serializers.BooleanField(write_only=True, required=False, source='has_resale_agreement')

    # Fields specific to RetailPoint (Individual Client in frontend, but model is RetailPoint)
    # Note: frontend sends individual_client, backend expects retail_client. Need to handle this mapping
    # For simplicity, assuming individual_client maps to RetailPoint (since it's not a professional client)
    # If 'Individual Client' in frontend means no extra fields, then these won't be used.
    # Based on models.py, RetailPoint has specific fields, so need to clarify frontend's "individual_client" role.
    # For now, I will not include specific RetailPoint fields here for 'individual_client' as frontend doesn't send them.
    # If individual_client should map to RetailPoint and use its fields, please provide the frontend fields.

    class Meta:
        model = User
        fields = (
            'email', 'password', 'password2', 'userType',
            'first_name', 'last_name', 'phone_number',
            'companyName', 'companyAddress', 'taxId',
            'sectorActivity', 'isPriorityClient', 'contractReference',
            'resaleArea', 'monthlyEstimate', 'hasResaleAgreement',
        )
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(_("A user with this email already exists."))
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": _("Password fields didn't match.")})

        user_type = attrs.get('user_type')
        if user_type == 'professional_client': # This is a temporary userType value from frontend
            # Frontend distinguishes industrial_client and reseller_client via professionalClientType
            # We need to map it back to the specific backend user_type
            professional_client_type = attrs.get('professionalClientType')
            if professional_client_type == 'industrial_client':
                attrs['user_type'] = UserType.INDUSTRIAL_CLIENT
                # Validate industrial client specific fields
                required_fields = ['companyName', 'companyAddress', 'taxId', 'sectorActivity']
                for field in required_fields:
                    if not attrs.get(field):
                        raise serializers.ValidationError({field: _(f"{field} is required for industrial clients.")})
            elif professional_client_type == 'reseller_client':
                attrs['user_type'] = UserType.RESELLER_CLIENT
                # Validate reseller client specific fields
                required_fields = ['companyName', 'companyAddress', 'taxId', 'resaleArea', 'monthlyEstimate']
                for field in required_fields:
                    if not attrs.get(field):
                        raise serializers.ValidationError({field: _(f"{field} is required for reseller clients.")})
            else:
                raise serializers.ValidationError({'professionalClientType': _("Specific professional client type is required.")})

        elif user_type == 'individual_client':
            attrs['user_type'] = UserType.RETAIL_CLIENT # Map frontend individual_client to backend RETAIL_CLIENT
            # No additional fields currently expected from frontend for individual client
        elif user_type == 'employee':
            # No additional fields for employee beyond basic user info
            # Assuming 'employee' in frontend maps directly to backend 'employee'
            pass
        else:
            raise serializers.ValidationError({'userType': _("Invalid user type provided.")})

        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data.pop('password2')
        user_type = validated_data.pop('user_type')

        # Pop frontend-specific fields that are not directly on User model
        company_name = validated_data.pop('company_name', '')
        company_address = validated_data.pop('company_address', '')
        nif = validated_data.pop('nif', '')
        sector_activity = validated_data.pop('sector_activity', '')
        is_priority_client = validated_data.pop('is_priority_client', False)
        contract_reference = validated_data.pop('contract_reference', '')
        resale_area = validated_data.pop('resale_area', '')
        monthly_estimate = validated_data.pop('monthly_estimate', 0.0)
        has_resale_agreement = validated_data.pop('has_resale_agreement', False)

        user = User.objects.create_user(user_type=user_type, **validated_data)
        user.set_password(password)
        user.save()

        if user_type == UserType.INDUSTRIAL_CLIENT:
            IndustrialClient.objects.create(
                user_ptr=user,  # Link to the newly created User
                company_name=company_name,
                company_address=company_address,
                company_id=nif, # Assuming company_id for industrial client maps to nif
                nif=nif,
                sector_activity=sector_activity,
                is_priority_client=is_priority_client,
                contract_reference=contract_reference,
                # Set default values for other EntrepriseProfile fields if not provided
                contact_person="",
                delivery_addresses=[],
                payment_terms="",
                client_category=ClientCategory.INDUSTRIAL,
            )
        elif user_type == UserType.RESELLER_CLIENT:
            ResellerClient.objects.create(
                user_ptr=user,  # Link to the newly created User
                company_name=company_name,
                company_address=company_address,
                company_id=nif, # Assuming company_id for reseller client maps to nif
                nif=nif,
                resale_area=resale_area,
                monthly_estimate=monthly_estimate,
                has_resale_agreement=has_resale_agreement,
                # Set default values for other EntrepriseProfile fields if not provided
                contact_person="",
                delivery_addresses=[],
                payment_terms="",
                client_category=ClientCategory.RESELLER,
            )
        elif user_type == UserType.RETAIL_CLIENT: # This maps to frontend's individual_client
            # If RetailPoint has specific fields coming from frontend, add them here
            # For now, it only uses fields from User model (which is parent of RetailPoint)
            # If you want to use RetailPoint fields, frontend needs to send them.
            pass # No additional specific fields to create for RetailPoint from this form currently
        
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'email', 'user_type', 'first_name', 'last_name', 'role',
            'registre_de_commerce', 'nis', 'nif', 'emplacement_point_de_vente',
            'sector_activity', 'store_manager_name', 'store_code', 'assigned_region',
            'opening_hours', 'is_sso_authenticated'
        )
        read_only_fields = ('email', 'user_type', 'is_sso_authenticated')

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'first_name', 'last_name', 'role', 'registre_de_commerce',
            'nis', 'nif', 'emplacement_point_de_vente', 'sector_activity',
            'store_manager_name', 'store_code', 'assigned_region', 'opening_hours'
        )
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
            'role': {'required': False},
            'registre_de_commerce': {'required': False},
            'nis': {'required': False},
            'nif': {'required': False},
            'emplacement_point_de_vente': {'required': False},
            'sector_activity': {'required': False},
            'store_manager_name': {'required': False},
            'store_code': {'required': False},
            'assigned_region': {'required': False},
            'opening_hours': {'required': False}
        }

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class PasswordResetConfirmSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": _("Password fields didn't match.")})
        return attrs 
