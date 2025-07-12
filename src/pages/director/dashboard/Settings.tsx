import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Save, 
  Mail, 
  User, 
  Building, 
  Bell, 
  Shield, 
  Database,
  RefreshCcw 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Schéma pour les paramètres généraux
const generalSettingsSchema = z.object({
  companyName: z.string().min(2, { message: "Nom de l'entreprise requis" }),
  email: z.string().email({ message: "Email invalide" }),
  address: z.string().min(5, { message: "Adresse requise" }),
  phone: z.string().min(5, { message: "Numéro de téléphone requis" }),
  logo: z.string().optional(),
});

// Schéma pour les paramètres de notification
const notificationSettingsSchema = z.object({
  lowStockAlerts: z.boolean(),
  expiryAlerts: z.boolean(),
  daysBeforeExpiry: z.coerce.number().min(1).max(90),
  lowStockThreshold: z.coerce.number().min(1),
  orderNotifications: z.boolean(),
  systemAlerts: z.boolean(),
});

// Schéma pour les paramètres d'email
const emailSettingsSchema = z.object({
  mailjetApiKey: z.string().min(1, { message: "Clé API Mailjet requise" }),
  mailjetSecretKey: z.string().min(1, { message: "Clé secrète Mailjet requise" }),
  senderEmail: z.string().email({ message: "Email d'expéditeur invalide" }),
  senderName: z.string().min(1, { message: "Nom d'expéditeur requis" }),
  emailFooter: z.string().optional(),
});

// Types pour les formulaires
type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;
type NotificationSettingsValues = z.infer<typeof notificationSettingsSchema>;
type EmailSettingsValues = z.infer<typeof emailSettingsSchema>;

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [isGeneralSubmitting, setIsGeneralSubmitting] = useState(false);
  const [isNotificationSubmitting, setIsNotificationSubmitting] = useState(false);
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);

  // Formulaire pour les paramètres généraux
  const generalForm = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      companyName: "ENAP - Entreprise Nationale des Peintures",
      email: "contact@enap.dz",
      address: "Route de Médéa, Oued El Alleug, Blida, Algérie",
      phone: "+213 25 36 32 42",
      logo: "",
    },
  });

  // Formulaire pour les paramètres de notification
  const notificationForm = useForm<NotificationSettingsValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      lowStockAlerts: true,
      expiryAlerts: true,
      daysBeforeExpiry: 30,
      lowStockThreshold: 10,
      orderNotifications: true,
      systemAlerts: true,
    },
  });

  // Formulaire pour les paramètres d'email
  const emailForm = useForm<EmailSettingsValues>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      mailjetApiKey: "********",
      mailjetSecretKey: "********",
      senderEmail: "notifications@enap.dz",
      senderName: "ENAP Notifications",
      emailFooter: "© ENAP - Entreprise Nationale des Peintures",
    },
  });

  // Fonction de soumission pour les paramètres généraux
  const onGeneralSubmit = (values: GeneralSettingsValues) => {
    setIsGeneralSubmitting(true);
    
    // Simulation d'envoi à l'API
    setTimeout(() => {
      console.log("Paramètres généraux:", values);
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres généraux ont été enregistrés.",
      });
      setIsGeneralSubmitting(false);
    }, 1000);
  };

  // Fonction de soumission pour les paramètres de notification
  const onNotificationSubmit = (values: NotificationSettingsValues) => {
    setIsNotificationSubmitting(true);
    
    // Simulation d'envoi à l'API
    setTimeout(() => {
      console.log("Paramètres de notification:", values);
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres de notification ont été enregistrés.",
      });
      setIsNotificationSubmitting(false);
    }, 1000);
  };

  // Fonction de soumission pour les paramètres d'email
  const onEmailSubmit = (values: EmailSettingsValues) => {
    setIsEmailSubmitting(true);
    
    // Simulation d'envoi à l'API
    setTimeout(() => {
      console.log("Paramètres d'email:", values);
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres d'email ont été enregistrés.",
      });
      setIsEmailSubmitting(false);
    }, 1000);
  };

  // Fonction pour réinitialiser la base de données (simulation)
  const handleDatabaseReset = () => {
    // Simulation d'une réinitialisation de base de données
    toast({
      title: "Fonction de démonstration",
      description: "La réinitialisation de la base de données est une fonctionnalité de démonstration.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Paramètres</h1>
      </div>

      <Tabs 
        defaultValue="general" 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value)}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="general" className="flex gap-2">
            <Building size={16} className="hidden md:block" />
            <span>Général</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-2">
            <Bell size={16} className="hidden md:block" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex gap-2">
            <Mail size={16} className="hidden md:block" />
            <span>Email</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex gap-2">
            <User size={16} className="hidden md:block" />
            <span>Utilisateurs</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex gap-2">
            <Shield size={16} className="hidden md:block" />
            <span>Système</span>
          </TabsTrigger>
        </TabsList>

        {/* Paramètres Généraux */}
        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Généraux</CardTitle>
              <CardDescription>
                Configurez les informations générales de l'entreprise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={generalForm.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom de l'entreprise</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email de contact</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logo</FormLabel>
                          <FormControl>
                            <Input type="file" {...field} value={undefined} onChange={(e) => {
                              field.onChange(e.target.files?.[0]?.name || '');
                            }} />
                          </FormControl>
                          <FormDescription>
                            Format recommandé: PNG, dimensions 200x200px
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={generalForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3">
                    <Button type="submit" disabled={isGeneralSubmitting} className="gap-2">
                      <Save size={16} />
                      {isGeneralSubmitting ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paramètres de Notification */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de Notification</CardTitle>
              <CardDescription>
                Configurez les alertes et les notifications du système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={notificationForm.control}
                      name="lowStockAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Alertes de stock faible
                            </FormLabel>
                            <FormDescription>
                              Recevoir des notifications quand le stock est bas
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="expiryAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Alertes d'expiration
                            </FormLabel>
                            <FormDescription>
                              Recevoir des notifications avant l'expiration des produits
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="orderNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Notifications de commande
                            </FormLabel>
                            <FormDescription>
                              Recevoir des notifications pour les nouvelles commandes
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="systemAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Alertes système
                            </FormLabel>
                            <FormDescription>
                              Recevoir des notifications sur l'état du système
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={notificationForm.control}
                      name="daysBeforeExpiry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jours avant expiration</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} min={1} max={90} />
                          </FormControl>
                          <FormDescription>
                            Nombre de jours avant expiration pour déclencher une alerte
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="lowStockThreshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seuil de stock faible</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} min={1} />
                          </FormControl>
                          <FormDescription>
                            Quantité minimale avant de déclencher une alerte de stock faible
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button type="submit" disabled={isNotificationSubmitting} className="gap-2">
                      <Save size={16} />
                      {isNotificationSubmitting ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paramètres d'Email */}
        <TabsContent value="email" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres d'Email</CardTitle>
              <CardDescription>
                Configurez les paramètres pour l'envoi d'emails via Mailjet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={emailForm.control}
                      name="mailjetApiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Clé API Mailjet</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={emailForm.control}
                      name="mailjetSecretKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Clé Secrète Mailjet</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={emailForm.control}
                      name="senderEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email d'expéditeur</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={emailForm.control}
                      name="senderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom d'expéditeur</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={emailForm.control}
                    name="emailFooter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pied de page des emails</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>
                          Ce texte apparaîtra en bas de tous les emails envoyés
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline">
                      Envoyer un email test
                    </Button>
                    <Button type="submit" disabled={isEmailSubmitting} className="gap-2">
                      <Save size={16} />
                      {isEmailSubmitting ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paramètres Utilisateurs */}
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Utilisateurs</CardTitle>
              <CardDescription>
                Gérez les politiques relatives aux comptes utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-6">
                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <p className="text-base font-medium">Complexité des mots de passe</p>
                      <p className="text-sm text-muted-foreground">
                        Exiger 8 caractères minimum, une majuscule, un chiffre et un caractère spécial
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>

                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <p className="text-base font-medium">Double authentification</p>
                      <p className="text-sm text-muted-foreground">
                        Activer l'authentification à deux facteurs pour les comptes administrateurs
                      </p>
                    </div>
                    <Switch checked={false} />
                  </div>

                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <p className="text-base font-medium">Expiration des sessions</p>
                      <p className="text-sm text-muted-foreground">
                        Déconnecter automatiquement les utilisateurs après 1 heure d'inactivité
                      </p>
                    </div>
                    <Select defaultValue="60">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Délai d'expiration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 heure</SelectItem>
                        <SelectItem value="120">2 heures</SelectItem>
                        <SelectItem value="0">Jamais</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button className="gap-2">
                    <Save size={16} />
                    Enregistrer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paramètres Système */}
        <TabsContent value="system" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Système</CardTitle>
              <CardDescription>
                Gérez les paramètres avancés du système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col space-y-4">
                  <h3 className="text-lg font-medium">Sauvegarde et restauration</h3>
                  <div className="flex space-x-4">
                    <Button className="gap-2">
                      <Database size={16} />
                      Exporter les données
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Database size={16} />
                      Importer des données
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex flex-col space-y-4">
                    <h3 className="text-lg font-medium">Maintenance du système</h3>
                    <div className="flex space-x-4">
                      <Button variant="outline" className="gap-2">
                        <RefreshCcw size={16} />
                        Vider le cache
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="gap-2"
                        onClick={handleDatabaseReset}
                      >
                        <Database size={16} />
                        Réinitialiser la base de données
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex flex-col space-y-4">
                    <h3 className="text-lg font-medium">Informations système</h3>
                    <div className="grid gap-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Version</span>
                        <span>1.0.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dernière mise à jour</span>
                        <span>16/04/2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Environnement</span>
                        <span>Production</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 flex justify-between">
              <p className="text-sm text-muted-foreground">
                Démonstration: certaines fonctions sont simulées.
              </p>
              <Button variant="outline" size="sm">
                Voir les logs système
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
