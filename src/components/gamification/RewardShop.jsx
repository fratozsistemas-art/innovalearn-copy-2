import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  Coins, 
  Star,
  Trophy,
  Users,
  Sparkles,
  Crown,
  CheckCircle2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CATEGORY_ICONS = {
  academic: Trophy,
  social: Users,
  cosmetic: Sparkles,
  privilege: Crown,
  experience: Star
};

const CATEGORY_LABELS = {
  academic: "Acadêmicas",
  social: "Sociais",
  cosmetic: "Cosméticas",
  privilege: "Privilégios",
  experience: "Experiências"
};

export default function RewardShop({ userEmail, currentCoins, motivationalProfile }) {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

  // Buscar itens da loja
  const { data: shopItems = [], isLoading } = useQuery({
    queryKey: ['reward-shop-items'],
    queryFn: async () => {
      const items = await base44.entities.RewardShopItem.filter({ active: true });
      return items.sort((a, b) => a.cost_coins - b.cost_coins);
    }
  });

  // Buscar compras do usuário
  const { data: myPurchases = [] } = useQuery({
    queryKey: ['my-purchases', userEmail],
    queryFn: () => base44.entities.RewardPurchase.filter({ student_email: userEmail }),
    enabled: !!userEmail
  });

  // Mutation para comprar item
  const purchaseMutation = useMutation({
    mutationFn: async (item) => {
      // 1. Verificar saldo
      const profiles = await base44.entities.GamificationProfile.filter({ student_email: userEmail });
      if (profiles.length === 0) throw new Error('Perfil de gamificação não encontrado');
      
      const profile = profiles[0];
      if (profile.innova_coins < item.cost_coins) {
        throw new Error('Innova Coins insuficientes');
      }

      // 2. Criar compra
      const purchase = await base44.entities.RewardPurchase.create({
        student_email: userEmail,
        item_id: item.id,
        item_name: item.name,
        cost_paid: item.cost_coins,
        purchased_at: new Date().toISOString(),
        status: 'active',
        expires_at: item.effect_duration_days ? 
          new Date(Date.now() + item.effect_duration_days * 24 * 60 * 60 * 1000).toISOString() : null
      });

      // 3. Deduzir coins
      await base44.entities.GamificationProfile.update(profile.id, {
        innova_coins: profile.innova_coins - item.cost_coins,
        total_coins_spent: (profile.total_coins_spent || 0) + item.cost_coins,
        coin_history: [
          ...(profile.coin_history || []),
          {
            action: 'purchase',
            coins: -item.cost_coins,
            description: `Comprou: ${item.name}`,
            timestamp: new Date().toISOString()
          }
        ]
      });

      // 4. Atualizar popularidade do item
      await base44.entities.RewardShopItem.update(item.id, {
        popularity_score: (item.popularity_score || 0) + 1
      });

      return purchase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-purchases'] });
      queryClient.invalidateQueries({ queryKey: ['gamification-profile'] });
      setIsPurchaseDialogOpen(false);
      setSelectedItem(null);
    }
  });

  // Filtrar itens
  const filteredItems = shopItems.filter(item => {
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
    
    // Se tem perfil motivacional, priorizar itens que apelem ao perfil
    if (motivationalProfile && motivationalProfile.bartle_type !== 'mixed') {
      // Não filtrar, apenas ordenar depois
      return true;
    }
    
    return true;
  });

  // Ordenar por apelo motivacional se perfil disponível
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!motivationalProfile) return 0;
    
    const aAppeals = a.motivational_appeal?.includes(motivationalProfile.bartle_type) ? 1 : 0;
    const bAppeals = b.motivational_appeal?.includes(motivationalProfile.bartle_type) ? 1 : 0;
    
    return bAppeals - aAppeals;
  });

  const handlePurchase = (item) => {
    setSelectedItem(item);
    setIsPurchaseDialogOpen(true);
  };

  const confirmPurchase = () => {
    if (selectedItem) {
      purchaseMutation.mutate(selectedItem);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Carregando loja...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Header com saldo */}
      <Card className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">💰 Loja de Recompensas</h3>
              <p className="text-sm text-gray-600">
                Troque seus Innova Coins por recompensas incríveis!
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2 text-3xl font-bold text-orange-600">
                <Coins className="w-8 h-8" />
                {currentCoins.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600">Innova Coins</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros por categoria */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-6 w-full bg-white">
          <TabsTrigger value="all">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Todas
          </TabsTrigger>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
            const Icon = CATEGORY_ICONS[key];
            return (
              <TabsTrigger key={key} value={key}>
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* Grid de itens */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedItems.map((item) => {
          const Icon = CATEGORY_ICONS[item.category];
          const canAfford = currentCoins >= item.cost_coins;
          const alreadyPurchased = myPurchases.some(p => 
            p.item_id === item.id && 
            (p.status === 'active' || item.effect_type === 'permanent')
          );
          const isRecommended = motivationalProfile?.bartle_type && 
            item.motivational_appeal?.includes(motivationalProfile.bartle_type);

          return (
            <Card 
              key={item.id}
              className={`overflow-hidden transition-all hover:shadow-lg ${
                isRecommended ? 'ring-2 ring-blue-400' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{item.icon}</div>
                  {isRecommended && (
                    <Badge className="bg-blue-500 text-white border-0">
                      <Star className="w-3 h-3 mr-1" />
                      Para você
                    </Badge>
                  )}
                </div>

                <h4 className="font-bold text-lg mb-2">{item.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-orange-600 font-bold">
                    <Coins className="w-5 h-5" />
                    {item.cost_coins}
                  </div>

                  {alreadyPurchased ? (
                    <Badge className="bg-green-100 text-green-800 border-0">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Possui
                    </Badge>
                  ) : (
                    <Button
                      onClick={() => handlePurchase(item)}
                      disabled={!canAfford || purchaseMutation.isPending}
                      size="sm"
                      className={canAfford ? 'bg-orange-500 hover:bg-orange-600' : ''}
                    >
                      {canAfford ? 'Comprar' : 'Insuficiente'}
                    </Button>
                  )}
                </div>

                {item.effect_type === 'temporary' && (
                  <p className="text-xs text-gray-500 mt-2">
                    ⏱️ Válido por {item.effect_duration_days} dias
                  </p>
                )}

                {item.limited_quantity && (
                  <p className="text-xs text-red-600 mt-2">
                    🔥 Limitado: {item.limited_quantity} unidades
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sortedItems.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Nenhum item disponível nesta categoria</p>
          </CardContent>
        </Card>
      )}

      {/* Dialog de confirmação de compra */}
      <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Compra</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja comprar este item?
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="py-4">
              <div className="flex items-start gap-4">
                <div className="text-5xl">{selectedItem.icon}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-2">{selectedItem.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{selectedItem.description}</p>
                  <div className="flex items-center gap-2 text-orange-600 font-bold text-xl">
                    <Coins className="w-6 h-6" />
                    {selectedItem.cost_coins} Innova Coins
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">
                  <strong>Saldo atual:</strong> {currentCoins} 🪙
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Após compra:</strong> {currentCoins - selectedItem.cost_coins} 🪙
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsPurchaseDialogOpen(false)}
              disabled={purchaseMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              onClick={confirmPurchase}
              disabled={purchaseMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {purchaseMutation.isPending ? 'Comprando...' : 'Confirmar Compra'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}