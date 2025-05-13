# Create T3 App

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

###GLOBALS ACTULIADO PARA TAILWIND V4
```
/* globals.css */

@import "tailwindcss";

/*
  Configuración de Tailwind CSS v4
  Adaptada desde tu tailwind.config.ts
  Corregida según la documentación oficial de v4
*/

@theme inline { /* <-- Se agregó 'inline' aquí */
  /* Configuración del contenedor usando el namespace --container-* */
  --container-center: true;
  --container-padding: 2rem;
  --container-screens-2xl: 1400px;

  /* Colores definidos usando el namespace --color-* */
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));

  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));

  /* Colores personalizados con shades definidos bajo el namespace --color-* */
  --color-purple-500: "#8b5cf6";
  --color-purple-600: "#7c3aed";
  --color-purple-700: "#6d28d9";
  --color-purple-800: "#5b21b6";
  --color-purple-900: "#4c1d95";

  /* Border radius definidos usando el namespace --radius-* */
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);

  /* Animaciones definidas usando el namespace --animation-* */
  --animation-accordion-down: accordion-down 0.2s ease-out;
  --animation-accordion-up: animation-accordion-up 0.2s ease-out; /* Corregido para referenciar la variable */

  /* Los keyframes se definen DENTRO de @theme */
  @keyframes accordion-down {
    from: { height: "0" };
    to: { height: "var(--radix-accordion-content-height)" };
  }
  @keyframes accordion-up {
    from: { height: "var(--radix-accordion-content-height)" };
    to: { height: "0" };
  }
}

/*
  Los plugins se incluyen usando la directiva @plugin.
  Asegúrate de tener el plugin instalado.
  La sintaxis es @plugin "nombre-del-paquete";
*/
@plugin "tailwindcss-animate";

/*
  Nota sobre @content: En v4, la configuración del contenido
  generalmente se maneja a través de la configuración de tu
  herramienta de build (como la opción --content en el CLI
  de Tailwind) y no directamente en el CSS con una directiva @content.
*/

```

