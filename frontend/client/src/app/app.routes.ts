import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { UploadImage } from './pages/upload-image/upload-image';
import { PaintEditor } from './pages/paint-editor/paint-editor';
import { SavedProjects } from './pages/saved-projects/saved-projects';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { ColourManagement } from './pages/colour-management/colour-management';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'dashboard',
    component: Dashboard
  },

  {
    path: 'upload-image',
    component: UploadImage
  },

  {
    path: 'paint-editor',
    component: PaintEditor
  },

  {
    path: 'saved-projects',
    component: SavedProjects
  },

  {
    path: 'admin-dashboard',
    component: AdminDashboard
  },

  {
    path: 'colour-management',
    component: ColourManagement
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];