import { cn } from "@/lib/utils";

interface SiFunnelBrandProps {
  compact?: boolean;
  className?: string;
}

export function SiFunnelMark({ compact = false, className }: SiFunnelBrandProps) {
  return (
    <span
      aria-label="SiFunnel"
      className={cn("sifunnel-mark", compact && "sifunnel-mark--compact", className)}
    >
      <span className="sifunnel-mark__rings" aria-hidden="true" />
      <span className="sifunnel-mark__wedge sifunnel-mark__wedge--blue" aria-hidden="true" />
      <span className="sifunnel-mark__wedge sifunnel-mark__wedge--teal" aria-hidden="true" />
      <span className="sifunnel-mark__wedge sifunnel-mark__wedge--coral" aria-hidden="true" />
      <span className="sifunnel-mark__wedge sifunnel-mark__wedge--gold" aria-hidden="true" />
    </span>
  );
}

export function SiFunnelBrand({ compact = false, className }: SiFunnelBrandProps) {
  return (
    <span className={cn("sifunnel-brand", compact && "sifunnel-brand--compact", className)}>
      <SiFunnelMark compact={compact} />
      <span className="sifunnel-brand__copy">
        <span className="sifunnel-brand__name">SiFunnel</span>
        {!compact && (
          <span className="sifunnel-brand__tagline">
            Consigue y convierte más clientes
          </span>
        )}
      </span>
    </span>
  );
}
