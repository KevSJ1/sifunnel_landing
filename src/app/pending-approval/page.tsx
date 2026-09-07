"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock3 } from "lucide-react";
import { SiFunnelBrand } from "@/components/layout/sifunnel-brand";

export default function PendingApprovalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const signOut = async () => {
    setLoading(true);
    await createClient().auth.signOut();
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="items-center text-center">
          <SiFunnelBrand className="mb-3" />
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Clock3 className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl text-foreground">Cuenta pendiente de aprobación</CardTitle>
          <CardDescription className="text-muted-foreground">
            Tu cuenta fue creada correctamente, pero un administrador debe aprobarla antes de que puedas acceder al CRM.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={signOut} disabled={loading} variant="outline" className="w-full">
            {loading ? "Cerrando sesión..." : "Volver al inicio de sesión"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}