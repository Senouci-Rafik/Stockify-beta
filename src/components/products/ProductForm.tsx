import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Image as ImageIcon, Plus, X } from 'lucide-react';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Schema de validation avec Zod
const productSchema = z.object({
  name: z.string().min(1, "Le nom du produit est requis"),
  description: z.string().min(1, "La description est requise"),
  gamme: z.string().min(1, "La gamme est requise"),
  famille: z.string().min(1, "La famille est requise"),
  emballage: z.string().min(1, "L'emballage est requis"),
  quantite: z.string().refine((val: string) => parseInt(val) >= 100, {
    message: "La quantité minimale est de 100"
  }),
  poids: z.string().min(1, "Le poids est requis"),
  couleurs: z.array(z.string()),
  manufacturingDate: z.date().optional(),
  expirationDate: z.date().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductForm() {
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      quantite: '100',
      couleurs: [],
    }
  });

  const [manufacturingDate, setManufacturingDate] = useState<Date>();
  const [expirationDate, setExpirationDate] = useState<Date>();
  const [customColor, setCustomColor] = useState('');
  const [showCustomColorInput, setShowCustomColorInput] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const availableColors = [
    { value: 'rouge', label: 'Rouge' },
    { value: 'bleu', label: 'Bleu' },
    { value: 'vert', label: 'Vert' },
    { value: 'jaune', label: 'Jaune' },
    { value: 'noir', label: 'Noir' },
    { value: 'blanc', label: 'Blanc' },
    { value: 'gris', label: 'Gris' },
    { value: 'orange', label: 'Orange' },
  ];

  const handleColorToggle = (colorValue: string) => {
    const currentColors = watch('couleurs');
    const newColors = currentColors.includes(colorValue)
      ? currentColors.filter((c: string) => c !== colorValue)
      : [...currentColors, colorValue];
    setValue('couleurs', newColors);
  };

  const handleAddCustomColor = () => {
    if (customColor.trim()) {
      const currentColors = watch('couleurs');
      if (!currentColors.includes(customColor.trim().toLowerCase())) {
        setValue('couleurs', [...currentColors, customColor.trim().toLowerCase()]);
      }
      setCustomColor('');
      setShowCustomColorInput(false);
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    const currentColors = watch('couleurs');
    setValue('couleurs', currentColors.filter((c: string) => c !== colorToRemove));
  };

  const isColorInPredefinedList = (color: string) => {
    return availableColors.some(c => c.value === color);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      console.log('Image sélectionnée:', file.name);
    }
  };

  const onSubmit = (data: ProductFormData) => {
    const formData = new FormData();
    
    // Ajouter les données du formulaire
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Ajouter l'image si elle existe
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    console.log('Form submitted:', {
      ...data,
      manufacturingDate,
      expirationDate,
      image: selectedImage ? selectedImage.name : null
    });

    toast({
      title: "Produit ajouté",
      description: "Le produit a été ajouté avec succès.",
    });
  };

  const handleCancel = () => {
    setValue('name', '');
    setValue('description', '');
    setValue('gamme', '');
    setValue('famille', '');
    setValue('emballage', '');
    setValue('quantite', '100');
    setValue('poids', '');
    setValue('couleurs', []);
    setManufacturingDate(undefined);
    setExpirationDate(undefined);
    setImagePreview(null);
    setSelectedImage(null);
    toast({
      title: "Formulaire annulé",
      description: "Les données du formulaire ont été effacées.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">Ajouter un nouveau produit</h1>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom du produit */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nom du produit
              </Label>
              <Input
                id="name"
                {...register('name')}
                className="w-full"
                placeholder="Entrez le nom du produit"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Description technique */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description technique
              </Label>
              <Textarea
                id="description"
                {...register('description')}
                className="w-full h-24 resize-none"
                placeholder="Entrez la description technique"
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Gamme */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Gamme</Label>
              <Select onValueChange={(value) => setValue('gamme', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une gamme" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="economique">Économique</SelectItem>
                </SelectContent>
              </Select>
              {errors.gamme && (
                <p className="text-sm text-red-600">{errors.gamme.message}</p>
              )}
            </div>

            {/* Famille */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Famille</Label>
              <Select onValueChange={(value) => setValue('famille', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une famille" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="electronique">Électronique</SelectItem>
                  <SelectItem value="textile">Textile</SelectItem>
                  <SelectItem value="alimentaire">Alimentaire</SelectItem>
                </SelectContent>
              </Select>
              {errors.famille && (
                <p className="text-sm text-red-600">{errors.famille.message}</p>
              )}
            </div>

            {/* Emballage */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Emballage</Label>
              <RadioGroup 
                onValueChange={(value) => setValue('emballage', value)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="seau-metallique" id="seau-metallique" />
                  <Label htmlFor="seau-metallique" className="text-sm text-gray-700">Seau métallique</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="seau-plastique" id="seau-plastique" />
                  <Label htmlFor="seau-plastique" className="text-sm text-gray-700">Seau plastique</Label>
                </div>
              </RadioGroup>
              {errors.emballage && (
                <p className="text-sm text-red-600">{errors.emballage.message}</p>
              )}
            </div>

            {/* Quantité disponible */}
            <div className="space-y-2">
              <Label htmlFor="quantite" className="text-sm font-medium text-gray-700">
                Quantité disponible (minimum 100)
              </Label>
              <Input
                id="quantite"
                type="number"
                min="100"
                {...register('quantite')}
                className="w-full"
                placeholder="100"
              />
              {errors.quantite && (
                <p className="text-sm text-red-600">{errors.quantite.message}</p>
              )}
            </div>

            {/* Poids */}
            <div className="space-y-2">
              <Label htmlFor="poids" className="text-sm font-medium text-gray-700">
                Poids (kg)
              </Label>
              <Input
                id="poids"
                type="number"
                step="0.1"
                {...register('poids')}
                className="w-full"
                placeholder="Entrez le poids en kg"
              />
              {errors.poids && (
                <p className="text-sm text-red-600">{errors.poids.message}</p>
              )}
            </div>

            {/* Date de fabrication */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Date de fabrication</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !manufacturingDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {manufacturingDate ? (
                      format(manufacturingDate, "dd/MM/yyyy", { locale: fr })
                    ) : (
                      <span>jj/mm/aaaa</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-lg z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={manufacturingDate}
                    onSelect={(date: Date | undefined) => {
                      setManufacturingDate(date);
                      if (date) setValue('manufacturingDate', date);
                    }}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date d'expiration */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Date d'expiration</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expirationDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expirationDate ? (
                      format(expirationDate, "dd/MM/yyyy", { locale: fr })
                    ) : (
                      <span>jj/mm/aaaa</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-lg z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={expirationDate}
                    onSelect={(date: Date | undefined) => {
                      setExpirationDate(date);
                      if (date) setValue('expirationDate', date);
                    }}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Couleurs disponibles */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">
                Couleurs disponibles ({watch('couleurs').length} sélectionnée{watch('couleurs').length !== 1 ? 's' : ''})
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCustomColorInput(!showCustomColorInput)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Ajouter une couleur
              </Button>
            </div>

            {/* Custom color input */}
            {showCustomColorInput && (
              <div className="flex gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <Input
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  placeholder="Entrez une couleur personnalisée"
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomColor();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddCustomColor}
                  disabled={!customColor.trim()}
                  size="sm"
                >
                  Ajouter
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCustomColorInput(false);
                    setCustomColor('');
                  }}
                  size="sm"
                >
                  Annuler
                </Button>
              </div>
            )}

            {/* Predefined colors */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableColors.map((color) => (
                <div
                  key={color.value}
                  className={cn(
                    "flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors",
                    watch('couleurs').includes(color.value)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => handleColorToggle(color.value)}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2",
                      color.value === 'rouge' && "bg-red-500",
                      color.value === 'bleu' && "bg-blue-500",
                      color.value === 'vert' && "bg-green-500",
                      color.value === 'jaune' && "bg-yellow-500",
                      color.value === 'noir' && "bg-black",
                      color.value === 'blanc' && "bg-white border-gray-400",
                      color.value === 'gris' && "bg-gray-500",
                      color.value === 'orange' && "bg-orange-500"
                    )}
                  />
                  <span className="text-sm text-gray-700">{color.label}</span>
                </div>
              ))}
            </div>

            {/* Selected colors */}
            {watch('couleurs').length > 0 && (
              <div className="mt-4">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Couleurs sélectionnées :
                </Label>
                <div className="flex flex-wrap gap-2">
                  {watch('couleurs').map((color: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      <span className="capitalize">{color}</span>
                      {!isColorInPredefinedList(color) && (
                        <span className="text-xs opacity-70">(personnalisée)</span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(color)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Image du produit */}
          <div className="mt-6 space-y-2">
            <Label className="text-sm font-medium text-gray-700">Image du produit</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                id="image-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Button
                variant="outline"
                type="button"
                className="flex items-center gap-2"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <ImageIcon className="h-4 w-4" />
                Sélectionner une image
              </Button>
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="mx-auto max-h-48 rounded-lg shadow-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-red-600 hover:text-red-700"
                    onClick={() => {
                      setImagePreview(null);
                      setSelectedImage(null);
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Supprimer l'image
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="px-6"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Ajouter le produit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 