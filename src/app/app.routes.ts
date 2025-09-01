import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full'
  },
  {
    path: 'overview',
    // Corrected path below
    loadComponent: () => import('./components/overview/overview').then(c => c.OverviewComponent)
  }
];