import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export const MarketplaceSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Marketplace Digitalz</CardTitle>
            <CardDescription className="text-base">
              Acesse produtos exclusivos para acelerar seus resultados com IA e Marketing Digital.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <Button
              size="lg"
              className="w-full max-w-xs"
              onClick={() => window.open("https://marketplace.digitalzeducacao.com", "_blank")}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Abrir Marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
