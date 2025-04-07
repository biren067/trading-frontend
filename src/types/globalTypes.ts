// src/types/index.ts

// // Type for generic component props (e.g., for Button or FeatureButton)
// export interface ButtonProps {
//     label: string;
//     onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
//     disabled?: boolean;
//   }
  
//   // Type for page metadata (e.g., for SEO or layout purposes)
//   export interface PageMeta {
//     title: string;
//     description?: string;
//   }
  
//   // Type for navigation items (used in _app.tsx for the nav bar)
//   export interface NavItem {
//     label: string;
//     href: string;
//   }
  
//   // Utility type for adding optional children to components
//   export type WithChildren<T = {}> = T & {
//     children?: React.ReactNode;
//   };
  
//   // Example type for a layout component (if you add one later)
//   export interface LayoutProps extends WithChildren {
//     meta?: PageMeta;
//   }
  
//   // Re-export types from other files if you split them later
//   // e.g., export * from './someOtherTypeFile';


//   // src/types/buttonTypes.ts
//   export interface ButtonProps {
//     label: string;
//   }

//   export interface LayoutProps {
//     children: React.ReactNode;
//   }
//   export interface NavItem {
//     label: string;
//     href?: string;
//     icon: React.FC<React.SVGProps<SVGSVGElement>>;
//     subItems?: { label: string; href: string }[];
//   }

//   export interface HeaderProps {
//     userName: string;
//   }

  export interface ScriptData {
    name: string | string;
    image_url: string | string;
    low_value: number | string;
  }