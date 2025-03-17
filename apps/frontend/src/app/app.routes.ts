import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CadastroUsuarioComponent } from './pages/cadastro-usuario/cadastro-usuario.component';

export const appRoutes: Route[] = [
    { path: '', component: HomeComponent },
    { path: 'cad-usuario', component: CadastroUsuarioComponent },      
];
