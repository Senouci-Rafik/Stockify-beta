import { Emballage } from './emballage';

export interface FamilleConfig {
  id: number;
  nom: string;
  gamme_id: number;
  emballages: {
    emballage: Emballage;
    poids: number[];
  }[];
}

// Configuration des familles avec leurs emballages et poids associés
export const FAMILLES_CONFIG: FamilleConfig[] = [
  {
    id: 1,
    nom: "Peinture à base d'huile de lin",
    gamme_id: 1,
    emballages: [
      {
        emballage: {
          id: 1,
          nom: "Seau métallique",
          code: "SM",
          capacite: 3.12,
          unite: "L"
        },
        poids: [3.12]
      },
      {
        emballage: {
          id: 2,
          nom: "Seau métallique",
          code: "SM",
          capacite: 23.4,
          unite: "L"
        },
        poids: [23.4]
      }
    ]
  },
  {
    id: 2,
    nom: "Laque bicomposant",
    gamme_id: 2,
    emballages: [
      {
        emballage: {
          id: 3,
          nom: "Bidon plastique",
          code: "BP",
          capacite: 5,
          unite: "L"
        },
        poids: [5]
      },
      {
        emballage: {
          id: 4,
          nom: "Bidon plastique",
          code: "BP",
          capacite: 10,
          unite: "L"
        },
        poids: [10]
      }
    ]
  },
  {
    id: 3,
    nom: "Laque métallisée",
    gamme_id: 3,
    emballages: [
      {
        emballage: {
          id: 5,
          nom: "Fût métallique",
          code: "FM",
          capacite: 200,
          unite: "L"
        },
        poids: [200]
      }
    ]
  },
  {
    id: 4,
    nom: "Eproxy sol",
    gamme_id: 4,
    emballages: [
      {
        emballage: {
          id: 6,
          nom: "Fût plastique",
          code: "FP",
          capacite: 200,
          unite: "L"
        },
        poids: [200]
      }
    ]
  }
]; 