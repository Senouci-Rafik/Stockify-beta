import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/hooks/use-toast';
import { userService } from '@/services/api';
import { useNavigate } from 'react-router-dom';

const userSchema = z.object({
  userType: z.enum(["employee", "professional_client", "individual_client"], {
    required_error: "Le type d'utilisateur est requis.",
  }),
  professionalClientType: z.enum(["industrial_client", "reseller_client"]).optional(),
  firstName: z.string().min(2, "Le prénom est requis."),
  lastName: z.string().min(2, "Le nom est requis."),
  email: z.string().email("Email invalide."),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
  confirmPassword: z.string().min(8, "Confirmer le mot de passe est requis."),
  phoneNumber: z.string().optional(),
  companyName: z.string().optional(),
  companyAddress: z.string().optional(),
  taxId: z.string().optional(),
  sectorActivity: z.string().optional(),
  isPriorityClient: z.boolean().optional(),
  contractReference: z.string().optional(),
  resaleArea: z.string().optional(),
  monthlyEstimate: z.coerce.number().optional(),
  hasResaleAgreement: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

type UserFormData = z.infer<typeof userSchema>;

export default function UserAdd() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      userType: "employee",
      professionalClientType: undefined,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      companyName: "",
      companyAddress: "",
      taxId: "",
      sectorActivity: "",
      isPriorityClient: false,
      contractReference: "",
      resaleArea: "",
      monthlyEstimate: 0,
      hasResaleAgreement: false,
    },
  });

  const selectedUserType = form.watch("userType");
  const selectedProfessionalClientType = form.watch("professionalClientType");

  const onSubmit = async (data: UserFormData) => {
    try {
      const payload: any = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
        password2: data.confirmPassword,
        user_type: data.userType,
      };

      if (data.phoneNumber) {
        payload.phone_number = data.phoneNumber;
      }

      if (data.userType === "professional_client") {
        if (data.companyName) payload.company_name = data.companyName;
        if (data.companyAddress) payload.company_address = data.companyAddress;
        if (data.taxId) payload.tax_id = data.taxId;

        if (data.professionalClientType === "industrial_client") {
          payload.user_type = "client_industriel";
          if (data.sectorActivity) payload.sector_activity = data.sectorActivity;
          if (data.contractReference) payload.contract_reference = data.contractReference;
        } else if (data.professionalClientType === "reseller_client") {
          payload.user_type = "client_revendeur";
          if (data.resaleArea) payload.resale_area = data.resaleArea;
          if (data.monthlyEstimate) payload.monthly_estimate = data.monthlyEstimate;
          payload.has_resale_agreement = data.hasResaleAgreement;
        }
      }

      if (data.userType === "individual_client") {
        payload.user_type = "client_particulier";
      }
      
      if (data.userType === "employee") {
        payload.user_type = "employee";
      }
      
      await userService.create(payload);

      toast({
        title: "Succès",
        description: "Utilisateur ajouté avec succès.",
      });
      navigate("/admin/utilisateurs");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible d'ajouter l'utilisateur.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">Ajouter un nouvel utilisateur</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Type d'utilisateur</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("professionalClientType", undefined);
                        form.clearErrors(["professionalClientType", "companyName", "companyAddress", "taxId", "sectorActivity", "isPriorityClient", "contractReference", "resaleArea", "monthlyEstimate", "hasResaleAgreement"]);
                      }}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 md:flex-row md:space-x-4 md:space-y-0"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="employee" />
                        </FormControl>
                        <FormLabel className="font-normal">Employé</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="professional_client" />
                        </FormControl>
                        <FormLabel className="font-normal">Client Professionnel</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="individual_client" />
                        </FormControl>
                        <FormLabel className="font-normal">Client Particulier</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedUserType === "professional_client" && (
              <FormField
                control={form.control}
                name="professionalClientType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Type de Client Professionnel</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1 md:flex-row md:space-x-4 md:space-y-0"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="industrial_client" />
                          </FormControl>
                          <FormLabel className="font-normal">Client Industriel</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="reseller_client" />
                          </FormControl>
                          <FormLabel className="font-normal">Client Revendeur</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez le prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez le nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Entrez l\'email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de téléphone (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez le numéro de téléphone" {...field} />
                    </FormControl>
                    <FormDescription>
                      Exemple: 0555123456 ou +213555123456
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Entrez le mot de passe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer le mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirmez le mot de passe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {selectedUserType === "professional_client" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6 mt-6">
                <h2 className="col-span-full text-lg font-semibold mb-2">Informations Professionnelles Communes</h2>
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'entreprise</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de l'entreprise" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse de l'entreprise</FormLabel>
                      <FormControl>
                        <Input placeholder="Adresse de l'entreprise" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro d'identification fiscale</FormLabel>
                      <FormControl>
                        <Input placeholder="Numéro d'identification fiscale" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {selectedProfessionalClientType === "industrial_client" && selectedUserType === "professional_client" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6 mt-6">
                <h2 className="col-span-full text-lg font-semibold mb-2">Informations Client Industriel</h2>
                <FormField
                  control={form.control}
                  name="sectorActivity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secteur d'activité</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Automobile, Aéronautique" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contractReference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Référence du contrat (optionnel)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: CONT-2024-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isPriorityClient"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-full">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Client prioritaire
                        </FormLabel>
                        <FormDescription>
                          Ce client bénéficie d'un traitement prioritaire.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Input type="checkbox" checked={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {selectedProfessionalClientType === "reseller_client" && selectedUserType === "professional_client" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6 mt-6">
                <h2 className="col-span-full text-lg font-semibold mb-2">Informations Client Revendeur</h2>
                <FormField
                  control={form.control}
                  name="resaleArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zone de revente</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Oran et ses environs (50km)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="monthlyEstimate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimation mensuelle (DA)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 50000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hasResaleAgreement"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-full">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Accord de revente signé
                        </FormLabel>
                        <FormDescription>
                          Indique si un accord de revente formel a été signé.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Input type="checkbox" checked={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={() => navigate("/admin/utilisateurs")}>
                Annuler
              </Button>
              <Button type="submit">
                Ajouter l'utilisateur
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
