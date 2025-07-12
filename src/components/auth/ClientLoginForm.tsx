import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { UserRole } from '@/types/auth';

const formSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  role: z.enum(['client_particulier', 'client_interne'] as const),
});

type FormValues = z.infer<typeof formSchema>;

interface ClientLoginFormProps {
  onBackToSelection: () => void;
}

export function ClientLoginForm({ onBackToSelection }: ClientLoginFormProps) {
  const { login } = useAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'client_particulier',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values.email, values.password, values.role);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBackToSelection}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>

      <h2 className="text-2xl font-bold mb-6">Connexion Client</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="exemple@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Se connecter
          </Button>
        </form>
      </Form>
    </div>
  );
} 